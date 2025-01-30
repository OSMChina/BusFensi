import { StateCreator } from "zustand"
import { OSMMapStore } from "../../store"
import { commitHelper } from "./helper"
export interface CommitAction {
    commit: () => void
}

export const createCommitActionSlice: StateCreator<
    OSMMapStore, [
        ["zustand/devtools", never],
        ["zustand/persist", unknown],
        ["temporal", unknown],
        ["zustand/immer", never],
        ["chrisvander/zustand-computed", unknown]
    ],
    [],
    CommitAction
> = (set) => ({
    commit: () => set((state) => commitHelper(state)),
})