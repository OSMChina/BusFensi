import { StateCreator } from "zustand";
import { FeatureState, FeatureTypes, NumericString } from "../../../../type/osm/refobj";
import { OSMMapStore } from "../../store";
import { WritableDraft } from "immer";
import { clearSelectHelper, modifyFeatureStateHelper, selectFeatureHelper, selectFeatureWithoutActiveHelper, unSelectFeatureHelper } from "./helper";
import { commitHelper } from "../../helper";

export interface FeatureStateAction {
    modifyFeatureStateNC: (
        type: FeatureTypes,
        id: NumericString,
        modify: (feature: WritableDraft<Omit<FeatureState, 'selected' | 'active'>>) => void
    ) => void,
    modifyFeatureStateBatchNC: (
        modifications: Array<{
            type: FeatureTypes,
            id: NumericString,
            modify: (feature: WritableDraft<Omit<FeatureState, 'selected' | 'active'>>) => void
        }>
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
    toggleFeature: (
        type: FeatureTypes,
        id: NumericString,
        clear: boolean // clear select or not
    ) => void,
    toggleFeatureWithoutActive: (
        type: FeatureTypes,
        id: NumericString,
        clear: boolean // clear select or not
    ) => void,
    selectFeatureWithoutActive: (
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
    modifyFeatureStateBatchNC: (modifications) => set(state => {
        modifications.forEach(({ type, id, modify }) => {
            modifyFeatureStateHelper(state, type, id, modify);
        });
    }),
    selectFeature: (type, id, clear) => set(state => {
        commitHelper(state);
        if (clear) { clearSelectHelper(state) }
        selectFeatureHelper(state, type, id)
    }),
    selectFeatureWithoutActive: (type, id, clear) => set(state => {
        commitHelper(state);
        if (clear) { clearSelectHelper(state) }
        selectFeatureWithoutActiveHelper(state, type, id)
    }),
    unSelectFeature: (type, id) => set(state => {
        commitHelper(state)
        unSelectFeatureHelper(state, type, id)
    }),
    toggleFeature: (type, id, clear) => set(state => {
        commitHelper(state)
        if (state.meta[type][id]["@_localStates"]?.selected){
            unSelectFeatureHelper(state, type,id)
        } else {
            if (clear) { clearSelectHelper(state) }
            selectFeatureHelper(state, type,id)
        }
    }),
    toggleFeatureWithoutActive: (type, id, clear) => set(state => {
        commitHelper(state)
        if (state.meta[type][id]["@_localStates"]?.selected){
            unSelectFeatureHelper(state, type,id)
        } else {
            if (clear) { clearSelectHelper(state) }
            selectFeatureWithoutActiveHelper(state, type,id)
        }
    }),
    clearSelect: () => set(state => {
        commitHelper(state);
        clearSelectHelper(state)
    }),
})
