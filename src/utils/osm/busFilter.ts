// see https://wiki.openstreetmap.org/wiki/Public_transport for detail

import { Tag } from "../../api/osm/type";
import { NodesObj, RelationsObj, WaysObj } from "../../logic/model/type";
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
): {
    nodes: NodesObj,
    ways: WaysObj,
    relations: RelationsObj
} {
    const filteredNodes: NodesObj = {};
    const filteredWays: WaysObj = {};
    const filteredRelations: RelationsObj = {};

    // Helper function to collect all members of a relation
    const collectMembers = (relationId: string) => {
        const relation = relations[relationId];
        if (!relation) return;

        T2Arr(relation.member).forEach((member) => {
            if (member["@_type"] === 'node') {
                if (!filteredNodes[member["@_ref"]]) {
                    filteredNodes[member["@_ref"]] = nodes[member["@_ref"]];
                }
            } else if (member["@_type"] === 'way') {
                if (!filteredWays[member["@_ref"]]) {
                    filteredWays[member["@_ref"]] = ways[member["@_ref"]];
                }
            } else if (member["@_type"] === 'relation') {
                if (!filteredRelations[member["@_ref"]]) {
                    filteredRelations[member["@_ref"]] = relations[member["@_ref"]];
                    // Recurse into nested relations
                    collectMembers(String(member["@_ref"]));
                }
            }
        });
    };

    // Process route master and route relations
    Object.values(relations).forEach((relation) => {
        if (getPropFromTags("type", relation.tag) === 'route_master' && getPropFromTags('route_master', relation.tag) === 'bus') {
            // Collect members of the route master relation
            collectMembers(String(relation["@_id"]));
        } else if (getPropFromTags("type", relation.tag) === 'route' && getPropFromTags('public_transport:version', relation.tag) === '2') {
            // Collect members of the route relation
            collectMembers(String(relation["@_id"]));
        }
    });

    // Optionally handle roundtrip routes
    Object.values(relations).forEach((relation) => {
        if (getPropFromTags('roundtrip', relation.tag) === 'yes') {
            // Collect members of roundtrip relations
            collectMembers(String(relation["@_id"]));
        }
    });

    return {
        nodes: filteredNodes,
        ways: filteredWays,
        relations: filteredRelations
    };
}