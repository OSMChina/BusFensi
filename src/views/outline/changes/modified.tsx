import { useMemo } from "react";
import { useOSMMapStore } from "../../../store/osmmeta";
import { OutlineCollectionProps } from "../../../type/view/outline/type";
import { FeatureCollection, FeatureList } from "../base/list";
import { Node, Way, Relation } from "../../../type/osm/meta";
import { filterFeatures } from "../../../utils/osm/filterV2";

function isModified<T extends Node | Way | Relation>(feature: T) {
    return feature["@_action"] === "modify";
}
export function ModifiedCollection(props: OutlineCollectionProps) {
    const { relation, way, node } = useOSMMapStore(state => state.meta)
    const relationList = useMemo(() => Object.values(filterFeatures(relation, isModified)), [relation])
    const wayList = useMemo(() => Object.values(filterFeatures(way, isModified)), [way])
    const nodeList = useMemo(() => Object.values(filterFeatures(node, isModified)), [node])
    return <FeatureCollection name="modified">
        <FeatureList
            {...props}
            relation={relationList}
            way={wayList}
            node={nodeList}
        />
    </FeatureCollection>
}