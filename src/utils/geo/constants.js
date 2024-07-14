import { convertWGS84ToWebMercator } from "./mapProjection"

/**
 * Set San Francisco as default
 * 
 * @type {import('./types').PointWGS84}
 */
export const DEFAULT_VIEWPOINT_WGS84 = {
    lon: 37.7547,
    lat: -122.4431,
}

/**
 * Set San Francisco as default
 * 
 * @type {import('./types').PointWebMercator}
 */
export const DEFAULT_VIEWPOINT_WEB_MERCATOR = convertWGS84ToWebMercator(DEFAULT_VIEWPOINT_WGS84);
export const DEFAULT_TILE_SIZE = 256;
export const DEFAULT_ZOOM = 12;
export const WEB_MERCATOR_BOUNDS = {
    XMIN: -20037508.34,
    YMIN: -20048966.1,
    XMAX: 20037508.34,
    YMAX: 20048966.1,
    EQUATOR: 40075016.68, // use x, not y. y is limited
}
