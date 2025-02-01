import { FeatureMetaGroup } from "../../../../type/osm/refobj";

export interface MetaStateSlice {
    meta: FeatureMetaGroup,
    deletedMeta: FeatureMetaGroup,
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
}