import {  devtools,  } from "zustand/middleware"
import { initialMapState, MapState } from "./initialState"
import { create } from "zustand"
import { createMapStatusActionSlice, MapViewAction } from "./action"
import { mapViewURLPersistMiddleware } from "./middleware"

export type MapViewStore = MapState
    & MapViewAction


// Apply the store creation with the correct middleware order
export const useMapViewStore = create<MapViewStore>()(
    devtools(
        mapViewURLPersistMiddleware((...parameters) => ({
            ...initialMapState,
            ...createMapStatusActionSlice(...parameters),
        })),  // devtools applied after persist
        { name: 'MapView' },
    ),
);