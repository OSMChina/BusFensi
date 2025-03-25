import { useOSMMapStore } from "../../../store/osmmeta";
import { FeatureCollection, FeatureList } from "../base/list";
import { OutlineCollectionProps } from "../../../type/view/outline/type";
import { isRoute } from "../../../utils/osm/relationType";

export function RouteCollection(props: OutlineCollectionProps) {
    const relation = useOSMMapStore(state => state.meta.relation)
    return <FeatureCollection name="route">
        <FeatureList
            {...props}
            relation={Object.values(relation).filter(r => isRoute(r.tag))}
        />
    </FeatureCollection>
}