import { StateCreator } from "zustand";
import { OSMMapStore } from "./store";
import { initialState } from "./initialState";

/**
 * actions are mostly nested actions, may use multiple helper
 * export by other slices
 * 
 * see action.ts in each slice
 */
export interface OSMMetaAction {
    reset: () => void,
}

export const createOSMMetaActionSlice: StateCreator<
    OSMMapStore, [
        ["zustand/devtools", never],
        ["zustand/persist", unknown],
        ["temporal", unknown],
        ["zustand/immer", never],
        ["chrisvander/zustand-computed", unknown]
    ],
    [],
    OSMMetaAction
> = (set,) => ({
    reset: () => {
        set({ ...initialState })
    }
})
