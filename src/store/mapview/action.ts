import { StateCreator } from "zustand";
import { PointPixel, PointWGS84 } from "../../utils/geo/types";
import { MapViewStore } from "./store";
import { Application } from "pixi.js";

export interface MapViewAction {
    setViewpoint: (viewpoint: PointWGS84) => void,
    setZoom: (zoom: number) => void
    setStage: (width: number, height: number) => void
    setStageApp: (app: Application | undefined) => void,
    setSelectionRect: (selectionRect?: { from: PointPixel, to: PointPixel }) => void,

    clearDrawModeNC: () => void;
    setFromPosNC: (pos: PointWGS84) => void;
    setCurPosNC: (pos: PointWGS84) => void;
}

export const createMapStatusActionSlice: StateCreator<
    MapViewStore,
    [["zustand/devtools", never]],
    [],
    MapViewAction
> = (set) => ({
    setViewpoint: (viewpoint: PointWGS84) => set(() => ({ viewpoint: viewpoint })),
    setZoom: (zoom: number) => set(() => ({ zoom: zoom })),
    setStage: (width: number, height: number) => set({ width, height }),
    setStageApp: (app) => set({ stage: app }),
    setSelectionRect: (selectionRect) => set({ selectionRect }),
    clearDrawModeNC: () => set({ drawMode: {} }),
    setFromPosNC: (pos) => set(state => ({ 
        drawMode: { ...state.drawMode, fromPos: pos } 
    })),
    setCurPosNC: (pos) => set(state => ({ 
        drawMode: { ...state.drawMode, curPos: pos } 
    })),
})
