import { StateCreator } from "zustand";
import { PointWGS84 } from "../../utils/geo/types";
import { MapViewStore } from "./store";

export interface MapViewAction {
    setViewpoint: (viewpoint: PointWGS84) => void,
    setZoom: (zoom: number) => void
}

export const createMapStatusActionSlice: StateCreator<
    MapViewStore,
    [["zustand/devtools", never], ["zustand/persist", unknown]],
    [],
    MapViewAction
> = (set) => ({
    setViewpoint: (viewpoint: PointWGS84) => set(() => ({ viewpoint: viewpoint })),
    setZoom: (zoom: number) => set(() => ({ zoom: zoom })),
})
