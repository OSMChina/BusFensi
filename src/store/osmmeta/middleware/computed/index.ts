import { createComputed } from "zustand-computed"
import { FeatureMetaGroup, FeatureTypes, NumericString } from "../../../../type/osm/refobj"
import { OSMMapStore } from "../../store"

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
export interface ComputedFeatures {
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
            featureTree.roots[type][numericId] = true;
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

                delete featureTree.roots.node[child.id];
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

                delete featureTree.roots[mem["@_type"]][child.id];
            }
        });
    })
    
    return featureTree
};

export const computed = createComputed((state: OSMMapStore): ComputedFeatures => {
    return {
        tree: genTree(state.meta)
    }
})