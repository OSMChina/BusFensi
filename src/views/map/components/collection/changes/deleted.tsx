import { useShallow } from "zustand/shallow";
import { useOSMMapStore } from "../../../../../store/osmmeta";
import { getDeletedFeatures } from "../../../../../store/osmmeta/selector";
import { OutlineCollectionProps } from "../../../../../type/view/outline/type";
import { FeatureCollection, FeatureList } from "../base/list";
import { useMemo } from "react";

export function DeletedCollection(props: OutlineCollectionProps) {
    const { relation, way, node } = useOSMMapStore(useShallow(getDeletedFeatures))
        const relationList = useMemo(() => Object.values(relation), [relation])
        const wayList = useMemo(() => Object.values(way), [way])
        const nodeList = useMemo(() => Object.values(node), [node])
        return <FeatureCollection name="deleted">
            <FeatureList
                {...props}
                relation={relationList}
                way={wayList}
                node={nodeList}
            />
        </FeatureCollection>
    
}