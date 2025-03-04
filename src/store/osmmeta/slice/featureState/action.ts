import { StateCreator } from "zustand";
import { FeatureState, FeatureTypes, NumericString } from "../../../../type/osm/refobj";
import { OSMMapStore } from "../../store";
import { WritableDraft } from "immer";
import { clearSelectHelper, modifyFeatureStateHelper, selectFeatureHelper, unSelectFeatureHelper } from "./helper";
import { commitHelper } from "../../helper";

export interface FeatureStateAction {
    modifyFeatureStateNC: (
        type: FeatureTypes,
        id: NumericString,
        modify: (feature: WritableDraft<Omit<FeatureState, 'selected' | 'active'>>) => void
    ) => void,
    unSelectFeature: (
        type: FeatureTypes,
        id: NumericString,
    ) => void
    selectFeature: (
        type: FeatureTypes,
        id: NumericString,
        clear: boolean // clear select or not
    ) => void,
    clearSelect: () => void
}

export const createFeatureStateActionSlice: StateCreator<
    OSMMapStore, [
        ["zustand/devtools", never],
        ["zustand/persist", unknown],
        ["temporal", unknown],
        ["zustand/immer", never],
        ["chrisvander/zustand-computed", unknown]
    ],
    [],
    FeatureStateAction
> = (set) => ({
    modifyFeatureStateNC: (type, id, modify) => set(state => {
        modifyFeatureStateHelper(state, type, id, modify)
    }),
    selectFeature: (type, id, clear) => set(state => {
        commitHelper(state);
        if (clear) { clearSelectHelper(state) }
        selectFeatureHelper(state, type, id)
    }),
    unSelectFeature: (type, id) => set(state => {
        commitHelper(state)
        unSelectFeatureHelper(state, type, id)
    }),
    clearSelect: () => set(state => {
        commitHelper(state);
        clearSelectHelper(state)
    }),
})
