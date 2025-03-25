import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { initialState, OSMMapState } from "./initialState";
import { CommitAction, createCommitActionSlice } from "./slice/commit/action";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { temporal } from "zundo";
import { computed, ComputedFeatures } from "./middleware/computed";
import { createFeatureStateActionSlice, FeatureStateAction } from "./slice/featureState/action";
import { createMetaActionSlice, MetaAction } from "./slice/meta/action";
import { createRemoteApiActionSlice, RemoteApiAction } from "./slice/remote/action";
import { BusEditAction, createBusEditActionSlice } from "./slice/bus/action";
import { createOSMMetaActionSlice, OSMMetaAction } from "./action";

export type OSMMapStore = OSMMapState
    & CommitAction
    & FeatureStateAction
    & MetaAction
    & RemoteApiAction
    & BusEditAction
    & OSMMetaAction

export type OSMMapStoreWithComputed = OSMMapStore & ComputedFeatures

export const useOSMMapStore = create<OSMMapStore>()(
    devtools(
        persist(
            computed(
                temporal(
                    immer(
                        (...params) => ({
                            ...initialState,
                            ...createCommitActionSlice(...params),
                            ...createFeatureStateActionSlice(...params),
                            ...createMetaActionSlice(...params),
                            ...createRemoteApiActionSlice(...params),
                            ...createBusEditActionSlice(...params),
                            ...createOSMMetaActionSlice(...params),
                        })
                    ), {
                    partialize: (state) => {
                        // may ignore some value in future
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { tree, ...tracked } = state as OSMMapStoreWithComputed;
                        return tracked;
                    },
                    equality: (pastState, currentState) => {
                        return pastState.commitCounter === currentState.commitCounter
                    },
                }),
            ),
            {
                name: 'OSMMapStateStore',
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => {
                    // may ignore some value in future
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { tree, ...tracked } = state as OSMMapStoreWithComputed;
                    return tracked;
                },
            }
        ),
        { name: 'OSMMapState' }
    ),  // devtools applied after persist
);