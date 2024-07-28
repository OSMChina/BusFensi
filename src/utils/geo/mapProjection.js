/**
 * Reference https://wiki.openstreetmap.org/wiki/Zoom_levels
 * 
 */

import proj4 from "proj4";

import { DEFAULT_TILE_SIZE, WEB_MERCATOR_BOUNDS } from './constants';

/**
 * EPSG:3857 -> EPSG:4326
 * 
 * @param {import('./types').PointWebMercator} point 
 * @returns {import('./types').PointWGS84}
 */
function convertWebMercatorToWGS84(point) {
    return proj4('EPSG:4326', 'EPSG:3857', [point.x, point.y]);
}

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
    //console.log("on convert", point, zoom, ' totpix', totPix, ' meterperpix', meterPerPix, 'xy',x,y);
    return { x: x, y: y };
}

/**
 * 
 * @param {import('./types').PointWGS84} point 
 * @param {number} zoom 
 * @returns {import('./types').PointPixel}
 */
function convertWGS84ToAbsolutePixel(point, zoom) {
    //console.log('conver wgs84 to abs pix', point, convertWebMercatorToAbsolutePixel(convertWGS84ToWebMercator(point), zoom), convertWGS84ToWebMercator(point))
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
    //console.log('on adjusting', pixpoint, pixViewpoint, xoffset, yoffset)
    return {
        x: Math.floor(pixpoint.x + xoffset - pixViewpoint.x),
        y: Math.floor(pixpoint.y + yoffset - pixViewpoint.y)
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

/**
 * 
 * @param {import('./types').PointPixel} pixpoint 
 * @param {import('./types').PointWGS84} reference 
 * @param {number} zoom 
 * @param {number} width 
 * @param {number} height 
 * @returns 
 */
function getWGS84LocateByPixel(pixpoint, reference, zoom, width, height) {
    const totPix = Math.pow(2, zoom) * DEFAULT_TILE_SIZE;
    // totMeter / totPix = meterPerPix m/p
    const meterPerPix = WEB_MERCATOR_BOUNDS.EQUATOR / totPix;
    const wmr = convertWGS84ToWebMercator(reference);
    const xmid = Math.floor(width / 2), ymid = Math.floor(height / 2);
    const xmdiff = (pixpoint.x - xmid) * meterPerPix,
        ymdiff = (pixpoint.y - ymid) * meterPerPix;
    const wm = {
        x: wmr.x + xmdiff,
        y: wmr.y + ymdiff
    }
    return convertWebMercatorToWGS84(wm);
}

/**
 * 
 * @param {import('./types').PointWGS84} viewpoint 
 * @param {Number} zoom 
 * @param {Number} width 
 * @param {Number} height 
 * @returns {{
 *      left: Number
 *      bottom: Number
 *      right: Number
 *      top: Number
 * }}
 */
function getBoundsByScene(viewpoint, zoom, width, height) {
    const {lon1, lat1} = getWGS84LocateByPixel({x:0, y:0}, viewpoint, zoom, width, height);
    const {lon2, lat2} = getWGS84LocateByPixel({x:width, y:height}, viewpoint, zoom, width, height);
    return {
        left: lon1,
        bottom: lat2,
        right: lon2,
        top: lat1
    }
}

export {
    convertWebMercatorToWGS84,
    convertWGS84ToWebMercator,
    convertWebMercatorToAbsolutePixel,
    convertWGS84ToAbsolutePixel,
    adjustAbsolutePixelToLocal,
    getPixelByWGS84Locate,
    getWGS84LocateByPixel,
    getBoundsByScene
}