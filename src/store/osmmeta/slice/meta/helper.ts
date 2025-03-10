import { WritableDraft } from "immer";
import { OSMMapStore } from "../../store";
import { FeatureTypes, NumericString } from "../../../../type/osm/refobj";
import { FeatureTypeMap, ModifyFeatureMetaHelper, WritableFeatureTypeMap } from "./type";
import { PointWGS84 } from "../../../../utils/geo/types";
import { Member, Nd, Node, Relation, Way } from "../../../../type/osm/meta";
import { FeatureTree } from "../../middleware/computed";
import { createFeatureStateHelper } from "../../helper";
import { T2Arr } from "../../../../utils/helper/object";

const _createNodeMeta = (state: WritableDraft<OSMMapStore>, location: PointWGS84) => {
    const id = `${state._create_feature_counter--}` as NumericString;
    const newNode: Node = {
        "@_id": id,
        "@_lat": location.lat,
        "@_lon": location.lon,
        "@_visible": "true",
    };
    return newNode;
}

const _createLocalWayMeta = (state: WritableDraft<OSMMapStore>, nodes: Nd[]) => {
    const id = `${state._create_feature_counter--}` as NumericString;
    const newWay: Way = {
        "@_id": id,
        nd: [...nodes],
        "@_visible": "true",
    };
    return newWay;
}

const _createLocalRelationMeta = (state: WritableDraft<OSMMapStore>, members: Member[]) => {
    const id = `${state._create_feature_counter--}` as NumericString;
    const newRelation: Relation = {
        "@_id": id,
        member: [...members],
        "@_visible": "true",
    };
    return newRelation;
}

export function addFeatureMetaHelper<T extends FeatureTypes>(
    state: WritableDraft<OSMMapStore>,
    type: T,
    feature: FeatureTypeMap[T],
) {
    const key = feature["@_id"]
    if (state.meta[type][key]) {
        console.debug(`Can't add feature ${type} ${key}: already exsits! Ignoring this attempt`);
    }
    state.meta[type][key] = feature;
    createFeatureStateHelper(state, type, key)
}

export function addFeatureMetaBatchHelper<T extends FeatureTypes>(
    state: WritableDraft<OSMMapStore>,
    type: T,
    meta: FeatureTypeMap[T] | FeatureTypeMap[T][],
) {
    return T2Arr(meta).forEach(m => addFeatureMetaHelper(state, type, m))
}

export function createLocalNodeHelper(
    state: WritableDraft<OSMMapStore>,
    location: PointWGS84,
): NumericString {
    const node = _createNodeMeta(state, location);
    state.meta.node[node["@_id"]] = node;
    createFeatureStateHelper(state, "node", node["@_id"])
    return node["@_id"];
}

export function createLocalWayHelper(
    state: WritableDraft<OSMMapStore>,
    nd: Nd[],
): NumericString {
    const way = _createLocalWayMeta(state, nd);
    state.meta.way[way["@_id"]] = way;
    createFeatureStateHelper(state, "way", way["@_id"])
    return way["@_id"];
}

export function createLocalRelationHelper(
    state: WritableDraft<OSMMapStore>,
    members: Member[],
): NumericString {
    const relation = _createLocalRelationMeta(state, members);
    state.meta.relation[relation["@_id"]] = relation;
    createFeatureStateHelper(state, "relation", relation["@_id"])
    return relation["@_id"];
}

export const modifyFeatureHelper: ModifyFeatureMetaHelper = (
    state, type, id, modify
) => {
    const feature = state.meta[type][id] as WritableFeatureTypeMap[typeof type];
    if (feature) {
        modify(feature);
        feature["@_action"] = "modify";
    }
}

export function splitWayHelper(
    state: WritableDraft<OSMMapStore>,
    tree: FeatureTree,
    id: NumericString
) {
    const faWays = tree.elems.node[id].fathers.way.map(faWayId => state.meta.way[faWayId])
    faWays?.forEach(way => { // split way
        const nds = way.nd
        const idx = nds.findIndex(nd => nd["@_ref"] === id)
        if (idx !== 0 && idx !== nds.length - 1) { // not head or tail
            if (idx === -1) { throw new Error(`way ${way} must contain node ${id}, the feature tree is broken.`) }
            const newNds = nds.slice(idx)
            way.nd = nds.slice(0, idx + 1) // modify old
            way["@_action"] = 'modify'

            const newWay = _createLocalWayMeta(state, newNds) // create new
            newWay.tag = way.tag && [...way.tag]
            state.meta.way[newWay["@_id"]] = newWay
            createFeatureStateHelper(state, "way", newWay["@_id"]);

            // append new way to related relation
            const faRelationOfWay = tree.elems.way[way["@_id"]].fathers.relation
                .map(fa => state.meta.relation[fa])

            faRelationOfWay?.forEach(relation => {
                const members = relation.member
                const idx = members.findIndex(m => m["@_ref"] === way["@_id"])
                if (idx === -1) { throw new Error(`relation ${relation} must contain way ${way}, the feature tree is broken.`) }
                members.splice(idx + 1, 0, { "@_ref": newWay["@_id"], "@_type": "way", "@_role": members[idx]["@_role"] })
                relation.member = members
                relation["@_action"] = "modify"
            })
        }
    })
}

export function deleteFeatureSelfHelper(
    state: WritableDraft<OSMMapStore>,
    type: FeatureTypes,
    id: NumericString
) {
    if (!state.meta[type][id]) {
        throw new Error(`Can't delete feature ${type} ${id}: not exsit!`);
    }
    state.deletedMeta[type][id] = state.meta[type][id];
    state.deletedMeta[type][id]["@_action"] = "delete";
    delete state.meta[type][id];
}

function _deleteNodeFa(
    state: WritableDraft<OSMMapStore>,
    tree: FeatureTree,
    id: NumericString
) {
    // no child to delete, delete node from fathers
    const { way, relation } = tree.elems.node[id].fathers;
    way.forEach(wayId => {
        // delete from father way
        modifyFeatureHelper(state, "way", wayId, (way) => {
            way.nd = way.nd.filter(nd => nd["@_ref"] !== id)
        })
        // if way have less then 2 nodes, delete this way
        if (state.meta.way[wayId].nd.length <= 1) {
            _deleteWaySubFa(state, tree, wayId)
        }
    })
    relation.forEach(relationId => {
        modifyFeatureHelper(state, "relation", relationId, (relation) => {
            relation.member = relation.member
                .filter(m => (m["@_type"] === "node" && m["@_ref"] === id))
        })
        // relation won't be deleted
    })
    deleteFeatureSelfHelper(state, "node", id);
}

function _deleteWaySubFa(
    state: WritableDraft<OSMMapStore>,
    tree: FeatureTree,
    id: NumericString
) {
    // delete sub node excpect node have other fathers
    state.meta.way[id].nd.forEach(nd => {
        const nodeId = nd["@_ref"]
        const { way, relation } = tree.elems.node[nodeId].fathers;
        if (way.length > 1 || relation.length > 0) {
            return
        }
        // each feature should call ther father (not child) to avoid infinite loop
        deleteFeatureSelfHelper(state, "node", nodeId)
    })
    // delete way from fathers (relation)
    const { relation } = tree.elems.way[id].fathers;
    relation.forEach(relationId => {
        modifyFeatureHelper(state, "relation", relationId, (relation) => {
            relation.member = relation.member
                .filter(m => (m["@_type"] === "way" && m["@_ref"] === id))
        })
    })
    deleteFeatureSelfHelper(state, "way", id);
}

function _deleteRelationFa(
    state: WritableDraft<OSMMapStore>,
    tree: FeatureTree,
    id: NumericString
) {
    const { relation } = tree.elems.relation[id].fathers
    relation.forEach(relationId => {
        modifyFeatureHelper(state, "relation", relationId, (relation) => {
            relation.member = relation.member
                .filter(m => (m["@_type"] === "relation" && m["@_ref"] === id))
        })
    })
    deleteFeatureSelfHelper(state, "relation", id);
}

export function deleteFeatureFaSubHelper(
    state: WritableDraft<OSMMapStore>,
    tree: FeatureTree,
    type: FeatureTypes,
    id: NumericString
) {
    if (type === "node") _deleteNodeFa(state, tree, id)
    else if (type === "way") _deleteWaySubFa(state, tree, id)
    else if (type === "relation") _deleteRelationFa(state, tree, id);
    else throw new Error(`Type ${type} not allowed.`)
}