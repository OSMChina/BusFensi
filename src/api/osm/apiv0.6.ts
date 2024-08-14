// from: https://wiki.openstreetmap.org/wiki/API_v0.6

import { XMLParser } from 'fast-xml-parser';
import { convertNumberBoolValues } from '../../utils/helper/object';
import { OSMV06BBoxObj } from './type';

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
        allowBooleanAttributes: true,
    });
    const json = parser.parse(data);
    console.log(`Get ${url}`, JSON.stringify(json), json);
    return convertNumberBoolValues(json);
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
    return await baseget(baseurl, `/api/0.6/map?bbox=${left},${bottom},${right},${top}`);
}

/**
 * Fetches a specific OSM element by ID.
 * 
 * @param baseurl - The base URL where to fetch data.
 * @param type - The type of element (node, way, or relation).
 * @param id - The ID of the element.
 * @returns A Promise that resolves to the fetched OSM element.
 */
export async function elementRead(
    baseurl: string,
    type: 'node' | 'way' | 'relation',
    id: number
): Promise<unknown> {
    return await baseget(baseurl, `/api/0.6/${type}/${id}`);
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
