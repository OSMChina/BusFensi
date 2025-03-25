import { useShallow } from "zustand/shallow";
import { useOSMMapStore } from "../../../store/osmmeta";
import { OutlineCollectionProps } from "../../../type/view/outline/type";
import { FeatureCollection, FeatureList } from "../base/list";
import { getActiveMeta } from "../../../store/osmmeta/selector";
import { Node, Relation, Way } from "../../../type/osm/meta";

export function ActiveCollection(props: OutlineCollectionProps) {
    const active = useOSMMapStore(useShallow(getActiveMeta))
    return <FeatureCollection name="active" forceOpen>
        <FeatureList
            {...props}
            node={active?.type === "node" ? [active.meta as Node] : undefined}
            way={active?.type === "way" ? [active.meta as Way] : undefined}
            relation={active?.type === "relation" ? [active.meta as Relation] : undefined}
            showMetaType
        />
    </FeatureCollection>
}