// see https://wiki.openstreetmap.org/wiki/Public_transport for detail

import { Tag } from "../../api/osm/type";


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
export function isBusStop(tags: Tag[]) {
    return tags.some(tag => tag["@_k"] === "public_transport" && tag["@_v"]==="platform")
        && tags.some(tag => tag["@_k"] === "highway" && tag["@_v"] === "bus_stop")
}