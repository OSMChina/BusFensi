import { getWGS84LocateByPixel } from "../../utils/geo/mapProjection";
import { PointPixel } from "../../utils/geo/types";
import { MapViewStore } from "./store";

const getLocationByPixel = (point: PointPixel) => (store: MapViewStore) => getWGS84LocateByPixel(point, store.viewpoint, store.zoom, store.width!, store.height!)

export {
    getLocationByPixel
}