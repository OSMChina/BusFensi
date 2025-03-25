import { StateCreator } from "zustand"
import { OSMMapStore } from "../../store"
import { commitHelper, createLocalNodeOnWayWithModifierHelper, createLocalNodeWithModifierHelper, createLocalRelationHelper, modifyFeatureHelper, selectFeatureHelper } from "../../helper"
import { PointWGS84 } from "../../../../utils/geo/types"
import { Member, Tag } from "../../../../type/osm/meta"
import { NumericString } from "../../../../type/osm/refobj"
export interface BusEditAction {
    createBusStopSel: (location: PointWGS84, tags: Tag[]) => void;
    createStopPositionSel: (location: PointWGS84, tags: Tag[], targetway: NumericString) => void,
    createNodeOnWay: (location: PointWGS84, tags: Tag[], targetway: NumericString) => void,
    createStopAreaSel: (tag: Tag[], member?: Member[]) => void,
    createEditRoute: (tag: Tag[], member?: Member[]) => void
    setEditRoute: (id: NumericString) => void,
    setRouteStop: (stops: Member[]) => void,
    setRoutePath: (path: Member[]) => void,
    cancelEditRoute: () => void,
    setEditStepNC: (step: number) => void,
    saveEditRoute: () => void,
    setSelectedMaster: (ref: NumericString) => void,
    clearSelectedMaster: () => void
}

const inBusStop = (m: Member) => m["@_type"] === "node" || m["@_role"]?.startsWith("stop") || m["@_role"]?.startsWith("platform");

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
    createNodeOnWay: (location, tags, target) => set(state => {
        commitHelper(state)
        createLocalNodeOnWayWithModifierHelper(state, location, f => { f.tag = tags }, target)
    }),
    createStopAreaSel: (tag, member) => set(state => {
        commitHelper(state)
        const id = createLocalRelationHelper(state, member || [])
        modifyFeatureHelper(state, "relation", id, r => {
            r.tag = tag
        })
        selectFeatureHelper(state, "relation", id)
    }),
    createEditRoute: (tag, member) => set(state => {
        commitHelper(state)
        const id = createLocalRelationHelper(state, member || [])
        modifyFeatureHelper(state, "relation", id, r => {
            r.tag = tag
        })
        selectFeatureHelper(state, "relation", id)
        const members = member || [];
        const indexes = members.map((item, index) => (inBusStop(item) ? index : -1));
        const lastIndex = indexes.lastIndexOf(Math.max(...indexes));

        state.routeEdit.editing = id
        state.routeEdit.step = 0
        state.routeEdit.stops = members.slice(0, lastIndex + 1)
        state.routeEdit.path = members.slice(lastIndex + 1, members.length)
    }),
    setEditRoute: (id) => set(state => {
        commitHelper(state)
        const members = state.meta.relation?.[id].member || [];
        const indexes = members.map((item, index) => (inBusStop(item) ? index : -1));
        const lastIndex = indexes.lastIndexOf(Math.max(...indexes));

        state.routeEdit.editing = id
        state.routeEdit.step = 0
        state.routeEdit.stops = members.slice(0, lastIndex + 1)
        state.routeEdit.path = members.slice(lastIndex + 1, members.length)
    }),
    cancelEditRoute: () => set(state => {
        commitHelper(state)

        state.routeEdit.editing = undefined
        state.routeEdit.step = 0
        state.routeEdit.stops = []
        state.routeEdit.path = []
    }),
    setRouteStop: (stops) => set(state => {
        commitHelper(state)
        state.routeEdit.stops = stops
    }),
    setRoutePath: (path) => set(state => {
        commitHelper(state)
        state.routeEdit.path = path
    }),
    setEditStepNC: (step) => set(state => {
        state.routeEdit.step = step
    }),
    saveEditRoute: () => set(state => {
        const { editing: routeId, stops, path } = state.routeEdit;
        if (!routeId) return;

        commitHelper(state);

        modifyFeatureHelper(state, "relation", routeId, relation => {
            relation.tag = [...relation.tag || []];
            relation.member = [...stops, ...path];
        });

        state.routeEdit.editing = undefined;
        state.routeEdit.stops = [];
        state.routeEdit.path = [];
        state.routeEdit.selectedMaster = undefined;
    }),
    setSelectedMaster: (ref) => set(state => {
        state.routeEdit.selectedMaster = ref
    }),
    clearSelectedMaster: () => set(state => {
        state.routeEdit.selectedMaster = undefined
    }),
})