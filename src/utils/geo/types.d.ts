/**
 * point in WGS84 (EPSG:4326)
 */
export interface PointWGS84 {
    lon: number,
    lat: number,
};

/**
 * point in WEb Mercator (EPSG:3857)
 */
export interface PointWebMercator {
    x: number // from lon
    y: number // from lat
}

/**
 * point in pixel of pixi
 */
export interface PointPixel {
    x: number,
    y: number
}

export interface MapViewStatus {
    viewpoint: PointWGS84,
    zoom: number,
    width: number,
    height: number,
}