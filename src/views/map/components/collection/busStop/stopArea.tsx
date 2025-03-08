import { useOSMMapStore } from "../../../../../store/osmmeta";
import { OutlineCollectionProps } from "../../../../../type/view/outline/type";
import { isStopArea } from "../../../../../utils/osm/relationType";
import { FeatureCollection, FeatureList } from "../base/list";

export function StopAreaCollection(props: OutlineCollectionProps) {
    const relation = useOSMMapStore(state => state.meta.relation)
    return <FeatureCollection name="stop area">
        <FeatureList
            {...props}
            relation={Object.values(relation).filter(r => isStopArea(r.tag))}
        />
    </FeatureCollection>
}