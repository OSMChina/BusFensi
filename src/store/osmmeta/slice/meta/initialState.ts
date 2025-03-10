import { FeatureMetaGroup } from "../../../../type/osm/refobj";

export interface MetaStateSlice {
    meta: FeatureMetaGroup,
    deletedMeta: FeatureMetaGroup,
    _create_feature_counter: number
}

export const metaInitialState: MetaStateSlice = {
    meta: {
        node: {},
        way: {},
        relation: {}
    },
    deletedMeta: {
        node: {},
        way: {},
        relation: {}
    },
    _create_feature_counter: -1
}