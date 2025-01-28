import { PointWGS84 } from "../../utils/geo/types";

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
    zoom: number
}

export const initialMapState: MapState = {
    viewpoint: DEFAULT_VIEWPOINT_WGS84,
    zoom: DEFAULT_ZOOM,
};