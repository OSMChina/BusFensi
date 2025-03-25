import { useOSMMapStore } from "../../../store/osmmeta";
import { OutlineCollectionProps } from "../../../type/view/outline/type";
import { isRouteMaster } from "../../../utils/osm/relationType";
import { FeatureCollection, FeatureList } from "../base/list";

export function RouteMasterCollection(props: OutlineCollectionProps) {
    const relation = useOSMMapStore(state => state.meta.relation)
    return <FeatureCollection name="route master">
        <FeatureList
            {...props}
            relation={Object.values(relation).filter(r => isRouteMaster(r.tag))}
        />
    </FeatureCollection>
}