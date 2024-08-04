// from: https://wiki.openstreetmap.org/wiki/API_v0.6

// eslint-disable-next-line no-unused-vars
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';

import { convertNumberBoolValues } from '../../utils/helper/object';
async function baseget(baseurl, path) {
    const url = `${baseurl}${path}`
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error on fetching ${url}: ${response.statusText}`);
    }
    const data = await response.text()
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        allowBooleanAttributes: true,
    });
    const json = parser.parse(data);
    console.log(`Get ${url}`, JSON.stringify(json), json)
    return convertNumberBoolValues(json)
}

/**
 * Retrieving map data by bounding box: GET /api/0.6/map
 *
 * The following command returns:
 *
 *   All nodes that are inside a given bounding box and any relations that reference them.
 *   All ways that reference at least one node that is inside a given bounding box, any relations that reference them [the ways], and any nodes outside the bounding box that the ways may reference.
 *   All relations that reference one of the nodes, ways or relations included due to the above rules. (Does not apply recursively, see explanation below.)
 * 
 * Note that, while this command returns those relations that reference the aforementioned nodes and ways, the reverse is not true: it does not (necessarily) return all of the nodes and ways that are referenced by these relations. This prevents unreasonably-large result sets. For example, imagine the case where:

 *   There is a relation named "England" that references every node in England.
 *   The nodes, ways, and relations are retrieved for a bounding box that covers a small portion of England.

 * While the result would include the nodes, ways, and relations as specified by the rules for the command, including the "England" relation, it would (fortuitously) not include every node and way in England. If desired, the nodes and ways referenced by the "England" relation could be retrieved by their respective IDs.

 * Also note that ways which intersect the bounding box but have no nodes within the bounding box will not be returned. 
 * 
 * @param {String} baseurl - is where to fetch data
 * @param {Number} left - is the longitude of the left (westernmost) side of the bounding box.
 * @param {Number} bottom  - is the latitude of the bottom (southernmost) side of the bounding box.
 * @param {Number} right  - is the longitude of the right (easternmost) side of the bounding box.
 * @param {Number} top - is the latitude of the top (northernmost) side of the bounding box.
 * @returns {Promise<import('./type').OSMV06BBoxObj>}
 */
export async function bbox(baseurl, left, bottom, right, top) {
    return await baseget(baseurl, `/api/0.6/map?bbox=${left},${bottom},${right},${top}`);
}

/**
 * 
 * @param {String} baseurl 
 * @param {"node"|"way"|"relation"} type 
 * @param {Number} id 
 * @returns {Promise<import('./type').>}
 */
export async function elementRead(baseurl, type, id) {
    return await baseget(baseurl, `/api/0.6/${type}/${id}`)
}

/**
 * 
 * @param {String} baseurl 
 * @param {"node"|"way"|"relation"} type 
 * @param {Number} id 
 * @returns {Promise<import('./type').>}
 */
export async function elementHistory(baseurl, type, id) {
    return await baseget(baseurl, `/api/0.6/${type}/${id}/history`)
}

/**
 * 
 * @param {String} baseurl 
 * @param {"node"|"way"|"relation"} type 
 * @param {Number} id 
 * @returns {Promise<import('./type').>}
 */
export async function elementVersion(baseurl, type, id, version) {
    return await baseget(baseurl, `/api/0.6/${type}/${id}/${version}`)
}

/**
 * 
 * @param {String} baseurl 
 * @param {"node"|"way"|"relation"} type 
 * @param {Number} id 
 * @returns {Promise<import('./type').>}
 */
export async function elementMultiFetch(baseurl, type, parameters) {
    return await baseget(baseurl, `/api/0.6/${type}?${parameters}`)
}

/**
 * 
 * @param {String} baseurl 
 * @param {"node"|"way"|"relation"} type 
 * @param {Number} id 
 * @returns {Promise<import('./type').>}
 */
export async function elementRelation(baseurl, type, id) {
    return await baseget(baseurl, `/api/0.6/${type}/${id}/relations`)
}

/**
 * 
 * @param {String} baseurl 
 * @param {Number} id 
 * @returns {Promise<import('./type').>}
 */
export async function nodeWays(baseurl, id) {
    return await baseget(baseurl, `/api/0.6/node/${id}/ways`)
}

/**
 * 
 * @param {String} baseurl 
 * @param {"way"|"relation"} type 
 * @param {Number} id 
 * @returns {Promise<import('./type').>}
 */
export async function wayRealationFull(baseurl, type, id) {
    return await baseget(baseurl, `/api/0.6/${type}/${id}/full`)
}