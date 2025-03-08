import { busEditInitialState, BusEditSlice } from "./slice/bus/initialState";
import { commitInitialState, CommitSlice } from "./slice/commit/initialState";
import { featureInitialState, FeatureStateSlice } from "./slice/featureState/initialState";
import { metaInitialState, MetaStateSlice } from "./slice/meta/initialState";
import { remoteApiInitialSlice, RemoteAPISlice } from "./slice/remote/initialState";

export type OSMMapState = CommitSlice 
& FeatureStateSlice
& MetaStateSlice
& RemoteAPISlice
& BusEditSlice

export const initialState: OSMMapState = {
    ...commitInitialState,
    ...featureInitialState,
    ...metaInitialState,
    ...remoteApiInitialSlice,
    ...busEditInitialState,
}