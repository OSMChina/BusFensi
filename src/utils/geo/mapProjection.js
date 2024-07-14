/**
 * Reference https://wiki.openstreetmap.org/wiki/Zoom_levels
 * 
 */

import proj4 from "proj4";

import { DEFAULT_TILE_SIZE, WEB_MERCATOR_BOUNDS } from './constants';
/**
 * EPSG:4326 -> EPSG:3857
 * 
 * @param {import('./types').PointWGS84} point 
 * @returns {import('./types').PointWebMercator}
 */
function convertWGS84ToWebMercator(point) {
    const tmp = proj4('EPSG:4326', 'EPSG:3857', [point.lon, point.lat])
    return {
        x: tmp[0],
        y: tmp[1]
    }
}

/**
 * 
 * @param {import('./types').PointWebMercator} point 
 * @param {number} zoom 
 * @returns {import('./types').PointPixel}
 */
function convertWebMercatorToAbsolutePixel(point, zoom) {
    const totPix = Math.pow(2, zoom) * DEFAULT_TILE_SIZE;
    // totMeter / totPix = meterPerPix m/p
    const meterPerPix = WEB_MERCATOR_BOUNDS.EQUATOR / totPix;
    // pix = meter / a(m/p) 
    const x = point.x / meterPerPix,
        y = point.y / meterPerPix
    console.log("on convert", point, zoom, ' totpix', totPix, ' meterperpix', meterPerPix, 'xy',x,y);
    return { x: x, y: y };
}

/**
 * 
 * @param {import('./types').PointWGS84} point 
 * @param {number} zoom 
 * @returns {import('./types').PointPixel}
 */
function convertWGS84ToAbsolutePixel(point, zoom) {
    console.log('conver wgs84 to abs pix', point, convertWebMercatorToAbsolutePixel(convertWGS84ToWebMercator(point), zoom), convertWGS84ToWebMercator(point))
    return convertWebMercatorToAbsolutePixel(convertWGS84ToWebMercator(point), zoom);
}


/**
 * 
 * @param {import('./types').PointPixel} pixpoint 
 * @param {import('./types').PointWGS84} reference 
 * @param {number} zoom
 * @param {number} [width] 
 * @param {number} [height] 
 * @returns {import('./types').PointPixel}
 */
function adjustAbsolutePixelToLocal(pixpoint, reference, zoom, width, height) {
    const pixViewpoint = convertWebMercatorToAbsolutePixel(convertWGS84ToWebMercator(reference), zoom);
    // viewpoint is in mid of container.
    const xoffset = width ? width / 2 : 0, yoffset = height ? height / 2 : 0;
    console.log('on adjusting', pixpoint, pixViewpoint, xoffset, yoffset)
    return {
        x: pixpoint.x + xoffset - pixViewpoint.x,
        y: pixpoint.y + yoffset - pixViewpoint.y
    }
}

/**
 * 
 * @param {import('./types').PointWGS84} point 
 * @param {import('./types').PointWGS84} reference 
 * @param {number} zoom 
 * @param {number} [width] 
 * @param {number} [height] 
 */
function getPixelByWGS84Locate(point, reference, zoom, width, height) {
    return adjustAbsolutePixelToLocal(convertWGS84ToAbsolutePixel(point, zoom), reference, zoom, width, height);
}

export {
    convertWGS84ToWebMercator,
    convertWebMercatorToAbsolutePixel,
    convertWGS84ToAbsolutePixel,
    adjustAbsolutePixelToLocal,
    getPixelByWGS84Locate
}