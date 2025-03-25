import { useMemo } from "react";
import { useOSMMapStore } from "../../../store/osmmeta";
import { OutlineCollectionProps } from "../../../type/view/outline/type";
import { FeatureCollection, FeatureList } from "../base/list";
import { Node, Relation, Way } from "../../../type/osm/meta";
import { filterFeatures } from "../../../utils/osm/filterV2";

function isCreated<T extends Node | Way | Relation>(feature: T) {
    return Number(feature["@_id"]) < 0;
}

export function CreatedCollection(props: OutlineCollectionProps) {
    const { relation, way, node } = useOSMMapStore(state => state.meta)
    const relationList = useMemo(() => Object.values(filterFeatures(relation, isCreated)), [relation]);
    const wayList = useMemo(() => Object.values(filterFeatures(way, isCreated)), [way]);
    const nodeList = useMemo(() => Object.values(filterFeatures(node, isCreated)), [node]);
    return <FeatureCollection name="created">
        <FeatureList
            {...props}
            relation={relationList}
            way={wayList}
            node={nodeList}
        />
    </FeatureCollection>
}