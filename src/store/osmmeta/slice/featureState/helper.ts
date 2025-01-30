import { WritableDraft } from "immer";
import { OSMMapStore } from "../../store";
import { FeatureRefObj, FeatureState, FeatureTypes, NumericString } from "../../../../type/osm/refobj";

export function modifyFeatureStateHelper(
    state: WritableDraft<OSMMapStore>,
    type: FeatureTypes,
    id: NumericString,
    modify: (feature: WritableDraft<FeatureState>) => void
) {
    const featureState = state.meta[type][id]['@_localStates'];
    if (featureState) {
        modify(featureState);
    }
}

export function createFeatureStateHelper(
    state: WritableDraft<OSMMapStore>,
    type: FeatureTypes,
    id: NumericString,
) {
    state.meta[type][id]['@_localStates'] = {
        visible: true,
        highlighted: false,
        hovered: false,
        selected: false,
        active: false
    }
}

export function deleteFeatureStateHelper(
    state: WritableDraft<OSMMapStore>,
    type: FeatureTypes,
    id: NumericString,
) {
    const match = (ref: FeatureRefObj) => (ref.type === type && ref.id === id)
    if (state.selectedRef.some(match)) {
        state.selectedRef = state.selectedRef.filter((ref) => !match(ref));
    }
    if (state.activeRef && match(state.activeRef)) {
        state.activeRef = undefined;
    }
    delete state.meta[type][id]['@_localStates'];
}

function _activeFeature(
    state: WritableDraft<OSMMapStore>,
    type: FeatureTypes,
    id: NumericString,
) {
    if (state.activeRef) {
        const { type: t, id: i } = state.activeRef;
        if (state.meta[t][i]['@_localStates']) state.meta[t][i]['@_localStates'].active = false
    }
    state.activeRef = { type: type, id: id }
    if (state.meta[type][id]['@_localStates']) state.meta[type][id]['@_localStates'].active = true
}

function _selectFeature(
    state: WritableDraft<OSMMapStore>,
    type: FeatureTypes,
    id: NumericString,
) {
    const match = (ref: FeatureRefObj) => (ref.type === type && ref.id === id)
    if (!state.selectedRef.some(match)) {
        state.selectedRef.push({ type: type, id: id })
        if (state.meta[type][id]['@_localStates']) state.meta[type][id]['@_localStates'].selected = true
    }
}

export function clearSelectHelper(
    state: WritableDraft<OSMMapStore>,
) {
    // clear active
    if (state.activeRef) {
        const { type: t, id: i } = state.activeRef;
        if (state.meta[t][i]['@_localStates']) state.meta[t][i]['@_localStates'].active = false;
        delete state.activeRef;
    }
    // clear select
    state.selectedRef.forEach(({ id, type }) =>
        (state.meta[type][id]['@_localStates']) && (state.meta[type][id]['@_localStates'].selected = false)
    )
    state.selectedRef = [];
}

export function selectFeatureHelper(
    state: WritableDraft<OSMMapStore>,
    type: FeatureTypes,
    id: NumericString,
) {
    _selectFeature(state, type, id)
    _activeFeature(state, type, id);
}