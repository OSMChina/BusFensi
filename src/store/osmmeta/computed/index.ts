import { createComputed } from "zustand-computed"
import { FeatureMetaGroup, FeatureTypes, NumericString } from "../../../type/osm/refobj"
import { OSMMapStore } from "../store"
import { filterBusPTv2, filterCreated, filterHighway } from "../../../utils/osm/filterV2"

export type CollectionItem = Record<FeatureTypes, Record<NumericString, boolean>>

type FeatureTreeNode = {
    id: NumericString
    type: FeatureTypes
    fathers: Record<FeatureTypes, NumericString[]>
    /** must in order, may includes non-exsist */
    childs: Record<FeatureTypes, NumericString[]>
}

export type FeatureTree = {
    elems: Record<FeatureTypes, Record<NumericString, FeatureTreeNode>>,
    roots: Record<FeatureTypes, Record<NumericString, boolean>>
}

export type Collection = {
    ptv2: CollectionItem,
    highway: CollectionItem,
    created: CollectionItem,
    global: CollectionItem
}

export interface ComputedFeatures {
    collections: Collection,
    tree: FeatureTree,
}

export const genTree = (
    renderedOSMFeatureMeta: FeatureMetaGroup
): FeatureTree => {
    const { node, way, relation } = renderedOSMFeatureMeta
    const featureTree: FeatureTree = {
        elems: { node: {}, way: {}, relation: {} },
        roots: { node: {}, way: {}, relation: {} }
    }
    // step 1 elements

    // Step 1: Initialize elements
    const initializeElements = (
        type: FeatureTypes,
        sourceObj: Record<NumericString, unknown>
    ) => {
        Object.keys(sourceObj).forEach(id => {
            const numericId = id as NumericString
            featureTree.elems[type][numericId] = {
                id: numericId,
                type: type,
                fathers: { node: [], way: [], relation: [] },
                childs: { node: [], way: [], relation: [] }
            }
        })
    }
    initializeElements('node', node)
    initializeElements('way', way)
    initializeElements('relation', relation)

    // step 2 build tree
    Object.values(way).forEach(way => {
        const cur = featureTree.elems.way[way["@_id"]]
        if (!cur) {
            throw new Error(`${way["@_id"]} !`)
        }
        way.nd.forEach(nd => {
            const child = featureTree.elems.node[nd["@_ref"]]
            if (child) {
                child.fathers.way.push(cur.id)
                cur.childs.node.push(child.id)
            }
        });
    })

    Object.values(relation).forEach(rl => {
        const cur = featureTree.elems.relation[rl["@_id"]]
        if (!cur) {
            throw new Error(`${rl["@_id"]} !`)
        }
        rl.member.forEach(mem => {
            const child = featureTree.elems[mem["@_type"]][mem["@_ref"]]
            if (child) {
                child.fathers.relation.push(cur.id)
                cur.childs[mem["@_type"]].push(child.id)
            }
        });
    })
    // step 3 identify roots
    const faEmpty = (n: FeatureTreeNode) => 0 === (n.fathers.node.length + n.fathers.way.length + n.fathers.relation.length)

    Object.values(featureTree.elems.node).forEach(node => {
        if (faEmpty(node)) {
            featureTree.roots.node[node.id] = true
        }
    })
    Object.values(featureTree.elems.way).forEach(way => {
        if (faEmpty(way)) {
            featureTree.roots.way[way.id] = true
        }
    })
    Object.values(featureTree.elems.relation).forEach(relation => {
        if (faEmpty(relation)) {
            featureTree.roots.relation[relation.id] = true
        }
    })

    return featureTree
};

export const genCollection = (osmFeatureMeta: FeatureMetaGroup): Collection => {
    const unionCollection = (...iterable: CollectionItem[]): CollectionItem => ({
        node: iterable.reduce((acc, col) => ({ ...acc, ...col.node }), {}),
        way: iterable.reduce((acc, col) => ({ ...acc, ...col.way }), {}),
        relation: iterable.reduce((acc, col) => ({ ...acc, ...col.relation }), {}),
    })

    const { node, way, relation } = osmFeatureMeta
    const ptv2 = filterBusPTv2(node, way, relation)
    const highway = filterHighway(node, way, relation)
    const created = filterCreated(node, way, relation);
    return {
        ptv2: ptv2,
        highway: highway,
        created: created,
        global: unionCollection(ptv2, highway)
    }
}

export const computed = createComputed((state: OSMMapStore): ComputedFeatures => {
    return {
        collections: genCollection(state.meta),
        tree: genTree(state.meta)
    }
})