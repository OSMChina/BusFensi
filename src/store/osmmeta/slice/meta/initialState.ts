import { OSMV06BBoxObj } from "../../../../type/osm/meta";
import { FeatureMetaGroup } from "../../../../type/osm/refobj";

export interface MetaStateSlice {
    meta: FeatureMetaGroup,
    deletedMeta: FeatureMetaGroup,
    bbox?: OSMV06BBoxObj[]
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