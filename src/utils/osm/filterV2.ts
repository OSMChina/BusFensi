// see https://wiki.openstreetmap.org/wiki/Public_transport for detail

import { CollectionItem, FeatureMetaGroup, NodesObj, NumericString, RelationsObj, WaysObj } from "../../type/osm/refobj";
import { T2Arr } from "../helper/object";
import { getPropFromTags } from "./getTag";


const getCollector = (
    filteredNodes: Record<NumericString, boolean>,
    filteredWays: Record<NumericString, boolean>,
    filteredRelations: Record<NumericString, boolean>,
    nodes: NodesObj,
    ways: WaysObj,
    relations: RelationsObj
) => {
    const collectMembers = (id: NumericString, type: "node" | "way" | "relation") => {
        if (type === "relation") {
            const relation = relations[id];
            if (!relation) return;

            if (!filteredRelations[id]) {
                filteredRelations[id] = true
            }
            T2Arr(relation.member).forEach((member) => {
                const key = member["@_ref"],
                    type = member["@_type"]
                if (type === 'node') {
                    if (!filteredNodes[key] && nodes[key]) {
                        filteredNodes[key] = true
                    }
                } else if (type === 'way') {
                    if (!filteredWays[key] && ways[key]) {
                        collectMembers(key, "way");
                    }
                } else if (type === 'relation') {
                    if (!filteredRelations[key] && relations[key]) {
                        collectMembers(key, "relation");
                    }
                }
            });
        } else if (type === "way") {
            const way = ways[id]
            if (!way) return;

            if (!filteredWays[id]) {
                filteredWays[id] = true
            }
            T2Arr(way.nd).forEach(nd => {
                const key = nd["@_ref"]
                if (!filteredNodes[key] && nodes[key]) {
                    filteredNodes[key] = true
                }
            })
        } else if (type === "node") {
            const node = nodes[id]
            if (!node) return;

            if (!filteredNodes[id]) {
                filteredNodes[id] = true
            }
        }
    };
    return collectMembers
}

/**
 * Filters and collects nodes, ways, and relations based on the bus PTv2 schema.
 * 
 * @param nodes - Object containing nodes data.
 * @param ways - Object containing ways data.
 * @param relations - Object containing relations data.
 * @returns An object containing filtered nodes, ways, and relations.
 */
export function filterBusPTv2(
    nodes: NodesObj,
    ways: WaysObj,
    relations: RelationsObj
): CollectionItem {
    const filteredNodes: Record<NumericString, boolean> = {}
    const filteredWays: Record<NumericString, boolean> = {}
    const filteredRelations: Record<NumericString, boolean> = {}

    // Helper function to collect all members of a feature
    const collectMembers = getCollector(filteredNodes, filteredWays, filteredRelations, nodes, ways, relations)

    // Process route master and route relations
    Object.values(relations).forEach((relation) => {
        const typeValue = getPropFromTags("type", relation.tag),
          routeMasterValue = getPropFromTags("route_master", relation.tag),
          ptvValue = getPropFromTags("public_transport:version", relation.tag);
    
        if (typeValue === "route_master" && routeMasterValue === "bus") {
          // Collect members of the route master relation
          collectMembers(relation["@_id"], "relation");
        } else if (typeValue === "route" && ptvValue === "2") {
          // Collect members of the route relation including the roundtrip
          collectMembers(relation["@_id"], "relation");
        }
    });

    return {
        node: filteredNodes,
        way: filteredWays,
        relation: filteredRelations
    };
}

/**
 * Filters and collects nodes, ways, and relations in highway system.
 * 
 * @param nodes - Object containing nodes data.
 * @param ways - Object containing ways data.
 * @param relations - Object containing relations data.
 * @returns An object containing filtered nodes, ways, and relations.
 */

export function filterHighway(
    nodes: NodesObj,
    ways: WaysObj,
    relations: RelationsObj
): CollectionItem {
    const filteredNodes: Record<NumericString, boolean> = {}
    const filteredWays: Record<NumericString, boolean> = {}
    const filteredRelations: Record<NumericString, boolean> = {}

    // Helper function to collect all members of a feature
    const collectMembers = getCollector(filteredNodes, filteredWays, filteredRelations, nodes, ways, relations)

    // Process highway relation
    Object.values(relations).forEach((relation) => {
        if (getPropFromTags("highway", relation.tag)) {
            collectMembers(relation["@_id"], "relation");
        }
    });

    Object.values(ways).forEach((way) => {
        if (getPropFromTags("highway", way.tag)) {
            collectMembers(way["@_id"], "way");
        }
    });

    Object.values(nodes).forEach((node) => {
        if (getPropFromTags("highway", node.tag)) {
            collectMembers(node["@_id"], "node");
        }
    });

    return {
        node: filteredNodes,
        way: filteredWays,
        relation: filteredRelations
    };
}

export function filterCreated(
    nodes: NodesObj,
    ways: WaysObj,
    relations: RelationsObj
): CollectionItem {
    const filteredNodes: Record<NumericString, boolean> = {}
    const filteredWays: Record<NumericString, boolean> = {}
    const filteredRelations: Record<NumericString, boolean> = {}

    // Helper function to collect all members of a feature
    const collectMembers = getCollector(filteredNodes, filteredWays, filteredRelations, nodes, ways, relations)

    // Process highway relation
    Object.values(relations).forEach((relation) => {
        if (Number(relation["@_id"]) < 0) {
            collectMembers(relation["@_id"], "relation");
        }
    });

    Object.values(ways).forEach((way) => {
        if (Number(way["@_id"]) < 0) {
            collectMembers(way["@_id"], "way");
        }
    });

    Object.values(nodes).forEach((node) => {
        if (Number(node["@_id"]) < 0) {
            collectMembers(node["@_id"], "node");
        }
    });

    return {
        node: filteredNodes,
        way: filteredWays,
        relation: filteredRelations
    };

}

export type Collection = {
    ptv2: CollectionItem,
    highway: CollectionItem,
    created: CollectionItem,
    global: CollectionItem
}


export const genCollection = (osmFeatureMeta: FeatureMetaGroup): Collection => {
    const unionCollection = (...iterable: CollectionItem[]): CollectionItem => {
        return iterable.reduce(
          (acc, col) => {
            Object.assign(acc.node, col.node);
            Object.assign(acc.way, col.way);
            Object.assign(acc.relation, col.relation);
            return acc;
          },
          { node: {}, way: {}, relation: {} } as CollectionItem
        );
    };

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



export function filterFeatures<T>(
    features: Record<string, T>,
    predicate: (feature: T) => boolean
): Record<string, T> {
    const result: Record<string, T> = {};
    for (const [id, feature] of Object.entries(features)) {
        if (predicate(feature)) {
            result[id] = feature;
        }
    }
    return result;
}
