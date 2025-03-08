import { useOSMMapStore } from "../../../../../store/osmmeta";
import { OutlineCollectionProps } from "../../../../../type/view/outline/type";
import { isStopPosition } from "../../../../../utils/osm/nodeType";
import { FeatureCollection, FeatureList } from "../base/list";

export function StopPositionCollection(props: OutlineCollectionProps) {
    const node = useOSMMapStore(state => state.meta.node)
    return <FeatureCollection name="stop position">
        <FeatureList
            {...props}
            node={Object.values(node).filter(n => isStopPosition(n.tag))}
        />
    </FeatureCollection>
}