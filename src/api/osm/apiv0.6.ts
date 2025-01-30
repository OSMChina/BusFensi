// from: https://wiki.openstreetmap.org/wiki/API_v0.6

import { XMLParser } from 'fast-xml-parser';
import { Node, OSMV06BatchFeatureObj, OSMV06BBoxObj, OSMV06FeatureObj, Relation, Way } from '../../type/osm/meta';
import { T2Arr } from '../../utils/helper/object';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function baseget(baseurl: string, path: string): Promise<any> {
    const url = `${baseurl}${path}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error on fetching ${url}: ${response.statusText}`);
    }
    const data = await response.text();
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
    });
    const json = parser.parse(data);
    console.log(`Get ${url}`, JSON.stringify(json), json);
    return json;
}

/**
 * Retrieves map data by bounding box: GET /api/0.6/map.
 * 
 * @param baseurl - The base URL where to fetch data.
 * @param left - The longitude of the left (westernmost) side of the bounding box.
 * @param bottom - The latitude of the bottom (southernmost) side of the bounding box.
 * @param right - The longitude of the right (easternmost) side of the bounding box.
 * @param top - The latitude of the top (northernmost) side of the bounding box.
 * @returns A Promise that resolves to an OSMV06BBoxObj object.
 */
export async function bbox(
    baseurl: string,
    left: number,
    bottom: number,
    right: number,
    top: number
): Promise<OSMV06BBoxObj> {
    const data: OSMV06BBoxObj = await baseget(baseurl, `/api/0.6/map?bbox=${left},${bottom},${right},${top}`)
    data.osm.bounds['@_maxlat'] = Number(data.osm.bounds['@_maxlat'])
    data.osm.bounds['@_minlat'] = Number(data.osm.bounds['@_minlat'])
    data.osm.bounds['@_maxlon'] = Number(data.osm.bounds['@_maxlon'])
    data.osm.bounds['@_minlon'] = Number(data.osm.bounds['@_minlon'])

    data.osm.node = T2Arr(data.osm.node).map(node => {
        node['@_lat'] = Number(node['@_lat'])
        node['@_lon'] = Number(node['@_lon'])
        if (node.tag) { node.tag = T2Arr(node.tag) }
        return node
    });

    return data;
}

/**
 * Fetches a specific OSM node by ID.
 * 
 * @param baseurl - The base URL where to fetch data.
 * @param id - The ID of the node.
 * @returns A Promise that resolves to the fetched OSM node.
 */
export async function fetchNode(baseurl: string, id: string): Promise<Node> {
    const data: OSMV06FeatureObj = await baseget(baseurl, `/api/0.6/node/${id}`);
    const node = data.osm.node
    node['@_lon'] = Number(node['@_lon'])
    node['@_lat'] = Number(node['@_lat'])
    return node;
}

/**
 * Fetches a specific OSM way by ID.
 * 
 * @param baseurl - The base URL where to fetch data.
 * @param id - The ID of the way.
 * @returns A Promise that resolves to the fetched OSM way.
 */
export async function fetchWay(baseurl: string, id: string): Promise<Way> {
    return (await baseget(baseurl, `/api/0.6/way/${id}`) as OSMV06FeatureObj).osm.way;
}

/**
 * Fetches a specific OSM relation by ID.
 * 
 * @param baseurl - The base URL where to fetch data.
 * @param id - The ID of the relation.
 * @returns A Promise that resolves to the fetched OSM relation.
 */
export async function fetchRelation(baseurl: string, id: string): Promise<Relation> {
    return (await baseget(baseurl, `/api/0.6/relation/${id}`) as OSMV06FeatureObj).osm.relation;
}

/**
 * Fetches a batch of OSM nodes by their IDs.
 * 
 * @param baseurl - The base URL where to fetch data.
 * @param ids - The IDs of the nodes to fetch.
 * @returns A Promise that resolves to an array of OSM nodes.
 */
export async function fetchNodes(baseurl: string, ids: string[]): Promise<Node[]> {
    if (ids.length === 0) return [];

    const params = ids.join(',');
    const url = `/api/0.6/nodes?nodes=${params}`;
    const response = await baseget(baseurl, url) as OSMV06BatchFeatureObj;
    const nodes = T2Arr(response.osm.node).map((node) => {
        node['@_lat'] = Number(node['@_lat'])
        node['@_lon'] = Number(node['@_lon'])
        return node
    })
    return nodes
}

/**
 * Fetches a batch of OSM ways by their IDs.
 * 
 * @param baseurl - The base URL where to fetch data.
 * @param ids - The IDs of the ways to fetch.
 * @returns A Promise that resolves to an array of OSM ways.
 */
export async function fetchWays(baseurl: string, ids: string[]): Promise<Way[]> {
    if (ids.length === 0) return [];

    const params = ids.join(',');
    const url = `/api/0.6/ways?ways=${params}`;
    const response = await baseget(baseurl, url) as OSMV06BatchFeatureObj;

    return T2Arr(response.osm.way)
}

/**
 * Fetches a batch of OSM relations by their IDs.
 * 
 * @param baseurl - The base URL where to fetch data.
 * @param ids - The IDs of the relations to fetch.
 * @returns A Promise that resolves to an array of OSM relations.
 */
export async function fetchRelations(baseurl: string, ids: string[]): Promise<Relation[]> {
    if (ids.length === 0) return [];

    const params = ids.join(',');
    const url = `/api/0.6/relations?relations=${params}`;
    const response = await baseget(baseurl, url) as OSMV06BatchFeatureObj;

    return T2Arr(response.osm.relation)
}



/**
 * Fetches the history of a specific OSM element by ID.
 * 
 * @param baseurl - The base URL where to fetch data.
 * @param type - The type of element (node, way, or relation).
 * @param id - The ID of the element.
 * @returns A Promise that resolves to the history of the OSM element.
 */
export async function elementHistory(
    baseurl: string,
    type: 'node' | 'way' | 'relation',
    id: number
): Promise<unknown> {
    return await baseget(baseurl, `/api/0.6/${type}/${id}/history`);
}

/**
 * Fetches a specific version of an OSM element by ID.
 * 
 * @param baseurl - The base URL where to fetch data.
 * @param type - The type of element (node, way, or relation).
 * @param id - The ID of the element.
 * @param version - The version of the element.
 * @returns A Promise that resolves to the specified version of the OSM element.
 */
export async function elementVersion(
    baseurl: string,
    type: 'node' | 'way' | 'relation',
    id: number,
    version: number
): Promise<unknown> {
    return await baseget(baseurl, `/api/0.6/${type}/${id}/${version}`);
}

/**
 * Fetches multiple OSM elements by their IDs.
 * 
 * @param baseurl - The base URL where to fetch data.
 * @param type - The type of element (node, way, or relation).
 * @param parameters - The query string parameters for fetching multiple elements.
 * @returns A Promise that resolves to the fetched OSM elements.
 */
export async function elementMultiFetch(
    baseurl: string,
    type: 'node' | 'way' | 'relation',
    parameters: string
): Promise<unknown> {
    return await baseget(baseurl, `/api/0.6/${type}?${parameters}`);
}

/**
 * Fetches the relations of a specific OSM element by ID.
 * 
 * @param baseurl - The base URL where to fetch data.
 * @param type - The type of element (node, way, or relation).
 * @param id - The ID of the element.
 * @returns A Promise that resolves to the relations of the OSM element.
 */
export async function elementRelation(
    baseurl: string,
    type: 'node' | 'way' | 'relation',
    id: number
): Promise<unknown> {
    return await baseget(baseurl, `/api/0.6/${type}/${id}/relations`);
}

/**
 * Fetches all ways related to a specific node.
 * 
 * @param baseurl - The base URL where to fetch data.
 * @param id - The ID of the node.
 * @returns A Promise that resolves to the ways related to the node.
 */
export async function nodeWays(
    baseurl: string,
    id: number
): Promise<unknown> {
    return await baseget(baseurl, `/api/0.6/node/${id}/ways`);
}

/**
 * Fetches the full details of a way or relation.
 * 
 * @param baseurl - The base URL where to fetch data.
 * @param type - The type of element (way or relation).
 * @param id - The ID of the element.
 * @returns A Promise that resolves to the full details of the way or relation.
 */
export async function wayRealationFull(
    baseurl: string,
    type: 'way' | 'relation',
    id: number
): Promise<unknown> {
    return await baseget(baseurl, `/api/0.6/${type}/${id}/full`);
}
