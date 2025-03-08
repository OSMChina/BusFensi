import { FeatureRefObj } from "../../../../type/osm/refobj"

export interface FeatureStateSlice {
    selectedRef: FeatureRefObj[],
    activeRef?: FeatureRefObj
}

export const featureInitialState: FeatureStateSlice = {
    selectedRef: [],
    activeRef: undefined
}