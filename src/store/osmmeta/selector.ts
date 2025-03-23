import { BoundsType } from "../../type/mapProjection";
import { Node } from "../../type/osm/meta";
import { FeatureMetaGroup, FeatureTypes, NumericString } from "../../type/osm/refobj";
import { FeatureTypeMap } from "./slice/meta/type";
import { OSMMapStore } from "./store";

export * from "./slice/bus/selector"

const getFeatureInBound = ({ left, right, bottom, top }: BoundsType) => (store: OSMMapStore): FeatureMetaGroup => {
    const inBound = ({ '@_lon': lon, '@_lat': lat }: Node) => {
        return left <= lon && lon <= right && bottom <= lat && lat <= top;
    }
    const nd2Node = <T extends { '@_ref': NumericString }>(nd: T) => store.meta.node[nd["@_ref"]];
    return {
        node: Object.entries(store.meta.node)
            .filter(([, v]) => inBound(v))
            .reduce((acc, col) => ({ ...acc, [col[0]]: col[1] }), {}),
        way: Object.entries(store.meta.way)
            .filter(([, w]) => w.nd.map(nd2Node).some(inBound))
            .reduce((acc, col) => ({ ...acc, [col[0]]: col[1] }), {}),
        relation: Object.entries(store.meta.relation)
            .filter(([, r]) => r.member.filter(m => m["@_type"] === "node" && nd2Node(m)).map(nd2Node).some(inBound))
            .reduce((acc, col) => ({ ...acc, [col[0]]: col[1] }), {}),
    }
}

function getActiveMeta<T extends FeatureTypes>(
    store: OSMMapStore
): { type: T, meta: FeatureTypeMap[T] } | null {
    const ref = store.activeRef;
    if (!ref) {
        return null;
    }
    return {
        type: ref.type as T,
        meta: store.meta[ref.type][ref.id]
    } as { type: T, meta: FeatureTypeMap[T] };
}

const getSelectedMeta = <T extends FeatureTypes>(type: T) => (store: OSMMapStore): FeatureTypeMap[T][] => {
    const refs = store.selectedRef;
    if (!refs.length) {
        return [];
    }
    return refs.filter(ref => ref.type === type).map(ref => store.meta[type][ref.id] as FeatureTypeMap[T])
}


export {
    getFeatureInBound,
    getActiveMeta,
    getSelectedMeta,
}