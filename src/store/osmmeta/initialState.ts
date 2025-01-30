import { commitInitialState, CommitSlice } from "./slice/commit/initialState";
import { featureInitialState, FeatureStateSlice } from "./slice/featureState/initialState";
import { metaInitialState, MetaStateSlice } from "./slice/meta/initialState";

export type OSMMapState = CommitSlice 
& FeatureStateSlice
& MetaStateSlice

export const initialState: OSMMapState = {
    ...commitInitialState,
    ...featureInitialState,
    ...metaInitialState
}