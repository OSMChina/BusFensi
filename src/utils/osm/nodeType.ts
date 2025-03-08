import { Tag } from "../../type/osm/meta";

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
export function isBusStop(tags?: Tag[]): boolean {
    tags = tags || []
    return tags.some(tag => tag["@_k"] === "public_transport" && tag["@_v"] === "platform")
        && tags.some(tag => tag["@_k"] === "highway" && tag["@_v"] === "bus_stop")
}

/**
 * 
 * stop position should have these tags
 * 
 * public_transport=stop_position
 * name=* 
 * bus=*
 * @param tags 
 */
export function isStopPosition(tags?: Tag[]): boolean {
    tags = tags || []
    return tags.some(t => t["@_k"] === "public_transport" && t["@_v"] === "stop_position")
        && tags.some(t => t["@_k"] === "name")
        && tags.some(t => t["@_k"] === "bus")
}

export function getName(tags?: Tag[]): string | undefined {
    tags = tags || []
    return tags.find(t => t["@_k"] === "name")?.["@_v"]
}

export function getNodeType(tags?: Tag[]): string | undefined {
    if (!tags) {
        return undefined
    }
    if (isBusStop(tags)) {
        return "Bus Stop"
    } else if (isStopPosition(tags)) {
        return "Stop Position"
    }
}