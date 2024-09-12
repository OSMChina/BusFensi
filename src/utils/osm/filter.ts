// see https://wiki.openstreetmap.org/wiki/Public_transport for detail

import { Tag } from "../../api/osm/type";
import { CollectionItem, NodesObj, RelationsObj, WaysObj } from "../../logic/model/type";
import { T2Arr } from "../helper/object";
import { getPropFromTags } from "./getTag";


/**
 * If there is no real platform and you will only find a simple sign for the passengers … 
 * 
 * Add a node node at the location of the bus stop sign. It gets following tags:
 *
 *   public_transport=platform
 *   highway=bus_stop
 *   name=<name> or ref=<reference number>
 *   optional: additional tags like shelter=yes/no, bench=yes/no, bin=yes/no, etc. See the buses page for more tags to add to a bus stop.
 * 
 * @param tags 
 */
export function isBusStop(tags: Tag[]): boolean {
    return tags.some(tag => tag["@_k"] === "public_transport" && tag["@_v"] === "platform")
        && tags.some(tag => tag["@_k"] === "highway" && tag["@_v"] === "bus_stop")
}

const getCollector = (
    filteredNodes: Set<string>,
    filteredWays: Set<string>,
    filteredRelations: Set<string>,
    nodes: NodesObj,
    ways: WaysObj,
    relations: RelationsObj
) => {
    const collectMembers = (id: string, type: "node" | "way" | "relation") => {
        if (type === "relation") {
            const relation = relations[id];
            if (!relation) return;

            if (!filteredRelations.has(id)) {
                filteredRelations.add(id)
            }
            T2Arr(relation.member).forEach((member) => {
                const key = member["@_ref"],
                    type = member["@_type"]
                if (type === 'node') {
                    if (!filteredNodes.has(key) && nodes[key]) {
                        filteredNodes.add(key)
                    }
                } else if (type === 'way') {
                    if (!filteredWays.has(key) && ways[key]) {
                        collectMembers(key, "way");
                    }
                } else if (type === 'relation') {
                    if (!filteredRelations.has(key) && relations[key]) {
                        collectMembers(key, "relation");
                    }
                }
            });
        } else if (type === "way") {
            const way = ways[id]
            if (!way) return;

            if (!filteredWays.has(id)) {
                filteredWays.add(id)
            }
            T2Arr(way.nd).forEach(nd => {
                const key = nd["@_ref"]
                if (!filteredNodes.has(key) && nodes[key]) {
                    filteredNodes.add(key)
                }
            })
        } else if (type === "node") {
            const node = nodes[id]
            if (!node) return;

            if (!filteredNodes.has(id)) {
                filteredNodes.add(id)
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
    const filteredNodes = new Set<string>()
    const filteredWays = new Set<string>()
    const filteredRelations = new Set<string>()

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
        nodesId: filteredNodes,
        waysId: filteredWays,
        relationsId: filteredRelations
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
    const filteredNodes = new Set<string>()
    const filteredWays = new Set<string>()
    const filteredRelations = new Set<string>()

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
        nodesId: filteredNodes,
        waysId: filteredWays,
        relationsId: filteredRelations
    };
}

