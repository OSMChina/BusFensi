import { createJSONStorage, devtools, persist } from "zustand/middleware"
import { URLSearchStorage } from "../../utils/zustand/urlStorage"
import { initialMapState, MapState } from "./initialState"
import { create } from "zustand"
import { createMapStatusActionSlice, MapViewAction } from "./action"

export type MapViewStore = MapState
    & MapViewAction

const storageOptions = {
    name: 'mapViewStore',
    storage: createJSONStorage(() => URLSearchStorage),
    partialize: (state: MapViewStore) => ({ viewpoint: state.viewpoint, zoom: state.zoom }),
}

// Apply the store creation with the correct middleware order
export const useMapViewStore = create<MapViewStore>()(
    devtools(
        persist((...parameters) => ({
            ...initialMapState,
            ...createMapStatusActionSlice(...parameters),
        }), storageOptions),  // devtools applied after persist
        { name: 'MapView' },
    ),
);