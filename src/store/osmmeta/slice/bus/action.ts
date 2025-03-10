import { StateCreator } from "zustand"
import { OSMMapStore } from "../../store"
import { commitHelper, createLocalNodeOnWayWithModifierHelper, createLocalNodeWithModifierHelper, createLocalRelationHelper, modifyFeatureHelper, selectFeatureHelper } from "../../helper"
import { PointWGS84 } from "../../../../utils/geo/types"
import { Member, Tag } from "../../../../type/osm/meta"
import { NumericString } from "../../../../type/osm/refobj"
export interface BusEditAction {
    createBusStopSel: (location: PointWGS84, tags: Tag[]) => void;
    createStopPositionSel: (location: PointWGS84, tags: Tag[], targetway: NumericString) => void,
    createStopAreaSel: (tag: Tag[], member?: Member[]) => void
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
    createBusStopSel: (location, tags) => set(state => {
        commitHelper(state)
        const id = createLocalNodeWithModifierHelper(state, location, f => { f.tag = tags })
        selectFeatureHelper(state, "node", id)
    }),
    createStopPositionSel: (location, tags, target) => set(state => {
        commitHelper(state)
        const id = createLocalNodeOnWayWithModifierHelper(state, location, f => { f.tag = tags }, target)
        selectFeatureHelper(state, "node", id)
    }),
    createStopAreaSel: (tag, member) => {
        set(state => {
            commitHelper(state)
            const id = createLocalRelationHelper(state, member || [])
            modifyFeatureHelper(state, "relation", id, r => {
                r.tag = tag
            })
            selectFeatureHelper(state, "relation", id)
        })
    }
})