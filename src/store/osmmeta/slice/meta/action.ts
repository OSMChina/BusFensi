import { StateCreator } from "zustand";
import { OSMMapStore } from "../../store";
import { AddFeatureMetaBatchFunction, ModifyFeatureMetaFunction } from "./type";
import { addFeatureMetaHelper, createLocalNodeHelper, createLocalRelationHelper, createLocalWayHelper, deleteFeatureFaSubHelper, modifyFeatureHelper, splitWayHelper } from "./helper";
import { PointWGS84 } from "../../../../utils/geo/types";
import { Member, Nd } from "../../../../type/osm/meta";
import { commitHelper } from "../commit/helper";
import { ComputedFeatures } from "../../computed";
import { FeatureTypes, NumericString } from "../../../../type/osm/refobj";
import { T2Arr } from "../../../../utils/helper/object";

export interface MetaAction {
    addFeatureMetaBatch: AddFeatureMetaBatchFunction,
    createLocalNode: (location: PointWGS84) => NumericString,
    createLocalWay: (nds: Nd[]) => NumericString,
    createLocalRelation: (members: Member[]) => NumericString,
    modifyFeatureMetaNC: ModifyFeatureMetaFunction,
    deleteFeature: (type: FeatureTypes, id: NumericString) => void,
    splitWay: (nodeId: NumericString) => void
}

export const createMetaActionSlice: StateCreator<
    OSMMapStore, [
        ["zustand/devtools", never],
        ["zustand/persist", unknown],
        ["temporal", unknown],
        ["zustand/immer", never],
        ["chrisvander/zustand-computed", ComputedFeatures]
    ],
    [],
    MetaAction
> = (set, get) => ({
    addFeatureMetaBatch: (type, meta) => set(state => T2Arr(meta).forEach(m => addFeatureMetaHelper(state, type, m))),
    createLocalNode: (location) => {
        let id: NumericString = "0";
        set(state => {
            commitHelper(state)
            id = createLocalNodeHelper(state, location)
        })
        return id
    },
    createLocalWay: (nds) => {
        let id: NumericString = "0";
        set(state => {
            commitHelper(state)
            id = createLocalWayHelper(state, nds)
        })
        return id
    },
    createLocalRelation: (members) => {
        let id: NumericString = "0";
        set(state => {
            commitHelper(state)
            id = createLocalRelationHelper(state, members)
        })
        return id
    },
    modifyFeatureMetaNC: (type, id, modify) => set(state => {
        modifyFeatureHelper(state, type, id, modify)
    }),
    deleteFeature: (type, id) => set(state => {
        commitHelper(state)
        deleteFeatureFaSubHelper(state, get().tree, type, id)
    }),
    splitWay: (nodeId) => set(state => {
        commitHelper(state);
        splitWayHelper(state, get().tree, nodeId);
    })
})
