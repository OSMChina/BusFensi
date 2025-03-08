/**
 * Reference https://wiki.openstreetmap.org/wiki/Zoom_levels
 * 
 */

import proj4 from "proj4";

import { DEFAULT_TILE_SIZE, WEB_MERCATOR_BOUNDS } from './constants';
import { PointPixel, PointWebMercator, PointWGS84 } from "./types";
import { BoundsType } from "../../type/mapProjection";

/**
 * EPSG:3857 -> EPSG:4326
 */
function convertWebMercatorToWGS84(point: PointWebMercator): PointWGS84 {
    const [lon, lat] = proj4('EPSG:3857', 'EPSG:4326', [point.x, point.y]);
    return {
        lon: lon,
        lat: lat
    }
}

/**
 * EPSG:4326 -> EPSG:3857
 */
function convertWGS84ToWebMercator(point: PointWGS84): PointWebMercator {
    const [x, y] = proj4('EPSG:4326', 'EPSG:3857', [point.lon, point.lat])
    return {
        x: x,
        y: y
    }
}

function convertWebMercatorToAbsolutePixel(point: PointWebMercator, zoom: number): PointPixel {
    const totPix = Math.pow(2, zoom) * DEFAULT_TILE_SIZE;
    // totMeter / totPix = meterPerPix m/p
    const meterPerPix = WEB_MERCATOR_BOUNDS.EQUATOR / totPix;
    // pix = meter / a(m/p) 
    const x = (point.x - WEB_MERCATOR_BOUNDS.XMIN) / meterPerPix,
        y = (WEB_MERCATOR_BOUNDS.XMAX - point.y) / meterPerPix
    //console.log("on convert", point, zoom, ' totpix', totPix, ' meterperpix', meterPerPix, 'xy',x,y);
    return { x: x, y: y };
}

function convertWGS84ToAbsolutePixel(point: PointWGS84, zoom: number): PointPixel {
    //console.log('conver wgs84 to abs pix', point, convertWebMercatorToAbsolutePixel(convertWGS84ToWebMercator(point), zoom), convertWGS84ToWebMercator(point))
    return convertWebMercatorToAbsolutePixel(convertWGS84ToWebMercator(point), zoom);
}


function adjustAbsolutePixelToLocal(pixpoint: PointPixel, reference: PointWGS84, zoom: number, width?: number, height?: number): PointPixel {
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
 * Converts a WGS84 coordinate to pixel coordinates based on the reference point, zoom level, and optional viewport dimensions.
 * 
 * @param {PointWGS84} point - The WGS84 coordinate to convert.
 * @param {PointWGS84} reference - The reference point for conversion.
 * @param {number} zoom - The zoom level to use for conversion.
 * @param {number} [width] - The optional width of the viewport.
 * @param {number} [height] - The optional height of the viewport.
 * @returns {PointPixel} The pixel coordinates corresponding to the WGS84 point.
 */
function getPixelByWGS84Locate(
    point: PointWGS84,
    reference: PointWGS84,
    zoom: number,
    width?: number,
    height?: number
): PointPixel {
    return adjustAbsolutePixelToLocal(convertWGS84ToAbsolutePixel(point, zoom), reference, zoom, width, height);
}

/**
 * Converts pixel coordinates to a WGS84 coordinate based on the reference point, zoom level, and viewport dimensions.
 * 
 * @param {PointPixel} pixpoint - The pixel coordinates to convert.
 * @param {PointWGS84} reference - The reference point for conversion.
 * @param {number} zoom - The zoom level to use for conversion.
 * @param {number} width - The width of the viewport.
 * @param {number} height - The height of the viewport.
 * @returns {PointWGS84} The WGS84 coordinates corresponding to the pixel point.
 */
function getWGS84LocateByPixel(
    pixpoint: PointPixel,
    reference: PointWGS84,
    zoom: number,
    width: number,
    height: number
): PointWGS84 {
    const totPix = Math.pow(2, zoom) * DEFAULT_TILE_SIZE;
    const meterPerPix = WEB_MERCATOR_BOUNDS.EQUATOR / totPix;
    const wmr = convertWGS84ToWebMercator(reference);
    const xmid = Math.floor(width / 2), ymid = Math.floor(height / 2);
    const xmdiff = (pixpoint.x - xmid) * meterPerPix,
        ymdiff = (pixpoint.y - ymid) * meterPerPix;
    const wm = {
        x: wmr.x + xmdiff, // West is negative, East is positive
        y: wmr.y - ymdiff  // North is positive, South is negative
    };
    return convertWebMercatorToWGS84(wm);
}

/**
 * Calculates the geographic bounds (left, bottom, right, top) of the scene based on the viewpoint, zoom level, and viewport dimensions.
 * 
 * @param {PointWGS84} viewpoint - The viewpoint in WGS84 coordinates.
 * @param {number} zoom - The zoom level to use for conversion.
 * @param {number} width - The width of the viewport.
 * @param {number} height - The height of the viewport.
 * @returns {{left: number, bottom: number, right: number, top: number}} The geographic bounds of the scene.
 */
function getBoundsByScene(
    viewpoint: PointWGS84,
    zoom: number,
    width: number,
    height: number
): BoundsType {
    const { lon: lon1, lat: lat1 } = getWGS84LocateByPixel({ x: 0, y: 0 }, viewpoint, zoom, width, height);
    const { lon: lon2, lat: lat2 } = getWGS84LocateByPixel({ x: width, y: height }, viewpoint, zoom, width, height);

    return {
        left: lon1,
        bottom: lat2,
        right: lon2,
        top: lat1
    };
}

function getBoundsByRect(
    viewpoint: PointWGS84,
    zoom: number,
    width: number,
    height: number,
    { from, to }: {
        from: PointPixel,
        to: PointPixel
    }
): BoundsType {
    const p1: PointPixel = { x: Math.min(from.x, to.x), y: Math.min(from.y, to.y) }
    const p2: PointPixel = { x: Math.max(from.x, to.x), y: Math.max(from.y, to.y) }
    console.debug("getBoundsByRect, p1 p2", p1, p2, "vp zoom w h", viewpoint, zoom, width, height, {from, to})
    const { lon: lon1, lat: lat1 } = getWGS84LocateByPixel(p1, viewpoint, zoom, width, height);
    const { lon: lon2, lat: lat2 } = getWGS84LocateByPixel(p2, viewpoint, zoom, width, height);

    return {
        left: lon1,
        bottom: lat2,
        right: lon2,
        top: lat1
    };
}


export {
    convertWebMercatorToWGS84,
    convertWGS84ToWebMercator,
    convertWebMercatorToAbsolutePixel,
    convertWGS84ToAbsolutePixel,
    adjustAbsolutePixelToLocal,
    getPixelByWGS84Locate,
    getWGS84LocateByPixel,
    getBoundsByScene,
    getBoundsByRect
}