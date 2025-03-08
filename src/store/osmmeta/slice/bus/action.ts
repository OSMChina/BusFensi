import { StateCreator } from "zustand"
import { OSMMapStore } from "../../store"
import { commitHelper, createLocalNodeOnWayWithModifierHelper, createLocalNodeWithModifierHelper } from "../../helper"
import { PointWGS84 } from "../../../../utils/geo/types"
import { Tag } from "../../../../type/osm/meta"
import { NumericString } from "../../../../type/osm/refobj"
export interface BusEditAction {
    createBusStop: (location: PointWGS84, tags: Tag[]) => void;
    createStopPosition: (location: PointWGS84, tags: Tag[], targetway: NumericString) => void
}

export const createBusEditActionSlice: StateCreator<
    OSMMapStore, [
        ["zustand/devtools", never],
        ["zustand/persist", unknown],
        ["chrisvander/zustand-computed", unknown],
        ["temporal", unknown],
        ["zustand/immer", never],
    ],
    [],
    BusEditAction
> = (set) => ({
    createBusStop: (location, tags) => set(state => {
        commitHelper(state)
        createLocalNodeWithModifierHelper(state, location, f => { f.tag = tags })
    }),
    createStopPosition: (location, tags, target) => set(state => {
        commitHelper(state)
        createLocalNodeOnWayWithModifierHelper(state, location, f => { f.tag = tags }, target)
    })
})