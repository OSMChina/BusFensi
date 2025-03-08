import { useOSMMapStore } from "../../../../../store/osmmeta";
import { isBusStop } from "../../../../../utils/osm/nodeType";
import { FeatureCollection, FeatureList } from "../base/list";
import { OutlineCollectionProps } from "../../../../../type/view/outline/type";

export function BusStopCollection(props: OutlineCollectionProps) {
    const node = useOSMMapStore(state => state.meta.node)
    return <FeatureCollection name="bus stop">
        <FeatureList
            {...props}
            node={Object.values(node).filter(n => isBusStop(n.tag))}
        />
    </FeatureCollection>
}