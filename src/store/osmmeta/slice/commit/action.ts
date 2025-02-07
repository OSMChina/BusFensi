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
        ["chrisvander/zustand-computed", unknown],
        ["temporal", unknown],
        ["zustand/immer", never],
    ],
    [],
    CommitAction
> = (set) => ({
    commit: () => set((state) => commitHelper(state)),
})