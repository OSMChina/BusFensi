import { createJSONStorage, devtools, persist } from "zustand/middleware"
import { URLSearchStorage } from "../../utils/zustand/urlStorage"
import { initialMapState, MapState } from "./initialState"
import { create } from "zustand"
import { createMapStatusActionSlice, MapViewAction } from "./action"

export type MapViewStore = MapState
    & MapViewAction

const storageOptions = {
    name: 'fishAndBearsStore',
    storage: createJSONStorage<MapViewStore>(() => URLSearchStorage),
}

// Apply the store creation with the correct middleware order
export const useLocalAndUrlStore = create<MapViewStore>()(
    persist(
        devtools((...parameters) => ({
            ...initialMapState,
            ...createMapStatusActionSlice(...parameters),
        }), { name: 'MapView' }),  // devtools applied after persist
        storageOptions,
    ),
);