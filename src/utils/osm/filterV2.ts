// see https://wiki.openstreetmap.org/wiki/Public_transport for detail

import { NodesObj, RelationsObj, WaysObj } from "../../logic/model/type";
import { FeatureTypes, NumericString } from "../../type/osm/refobj";
import { T2Arr } from "../helper/object";
import { getPropFromTags } from "./getTag";

type CollectionItem = Record<FeatureTypes, Record<NumericString, boolean>>

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
        if (getPropFromTags("type", relation.tag) === 'route_master' && getPropFromTags('route_master', relation.tag) === 'bus') {
            // Collect members of the route master relation
            collectMembers(relation["@_id"], "relation");
        } else if (getPropFromTags("type", relation.tag) === 'route' && getPropFromTags('public_transport:version', relation.tag) === '2') {
            // Collect members of the route relation
            collectMembers(relation["@_id"], "relation");
        }
    });

    // Optionally handle roundtrip routes
    Object.values(relations).forEach((relation) => {
        if (getPropFromTags("type", relation.tag) === 'route' && getPropFromTags('public_transport:version', relation.tag) === '2' && getPropFromTags('roundtrip', relation.tag) === 'yes') {
            // Collect members of roundtrip relations
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