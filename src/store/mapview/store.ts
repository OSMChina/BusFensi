import { createJSONStorage, devtools, persist } from "zustand/middleware"
import { URLSearchStorage } from "../../utils/zustand/urlStorage"
import { initialMapState, MapState } from "./initialState"
import { create } from "zustand"
import { createMapStatusActionSlice, MapViewAction } from "./action"

export type MapViewStore = MapState
    & MapViewAction

const storageOptions = {
    name: 'mapViewStore',
    storage: createJSONStorage<MapViewStore>(() => URLSearchStorage),
}

// Apply the store creation with the correct middleware order
export const useLocalAndUrlStore = create<MapViewStore>()(
    devtools(
        persist((...parameters) => ({
            ...initialMapState,
            ...createMapStatusActionSlice(...parameters),
        }), storageOptions),  // devtools applied after persist
        { name: 'MapView' },
    ),
);