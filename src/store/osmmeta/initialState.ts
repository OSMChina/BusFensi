import { commitInitialState, CommitSlice } from "./slice/commit/initialState";
import { featureInitialState, FeatureStateSlice } from "./slice/featureState/initialState";
import { metaInitialState, MetaStateSlice } from "./slice/meta/initialState";
import { remoteApiInitialSlice, RemoteAPISlice } from "./slice/remote/initialState";

export type OSMMapState = CommitSlice 
& FeatureStateSlice
& MetaStateSlice
& RemoteAPISlice

export const initialState: OSMMapState = {
    ...commitInitialState,
    ...featureInitialState,
    ...metaInitialState,
    ...remoteApiInitialSlice
}