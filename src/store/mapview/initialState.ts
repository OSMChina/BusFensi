import { Application } from "pixi.js";
import { PointPixel, PointWGS84 } from "../../utils/geo/types";

/**
 * Set San Francisco as default
 */
const DEFAULT_VIEWPOINT_WGS84 = {
    lon: -122.431297,
    lat: 37.773972,
}
const DEFAULT_ZOOM = 17;

export interface MapState {
    viewpoint: PointWGS84,
    zoom: number,
    width?: number,
    height?: number,
    stage?: Application,
    selectionRect?: {
        from: PointPixel,
        to: PointPixel
    }
    
    // Added draw mode state
    drawMode: {
        fromPos?: PointWGS84;
        curPos?: PointWGS84;
    };
}

export const initialMapState: MapState = {
    viewpoint: DEFAULT_VIEWPOINT_WGS84,
    zoom: DEFAULT_ZOOM,
    drawMode: {},
};