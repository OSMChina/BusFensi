import { useShallow } from "zustand/shallow";
import { useOSMMapStore } from "../../../../../store/osmmeta";
import { OutlineCollectionProps } from "../../../../../type/view/outline/type";
import { FeatureCollection, FeatureList } from "../base/list";
import { getSelectedMeta } from "../../../../../store/osmmeta/selector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStarOfLife } from "@fortawesome/free-solid-svg-icons/faStarOfLife";
import { useCallback } from "react";
import { FeatureTypes } from "../../../../../type/osm/refobj";
import { Node, Way, Relation } from "../../../../../type/osm/meta";

export function SelectedCollection(props: OutlineCollectionProps) {
    const selectedNode = useOSMMapStore(useShallow(getSelectedMeta("node")))
    const selectedWay = useOSMMapStore(useShallow(getSelectedMeta("way")))
    const selectedRelation = useOSMMapStore(useShallow(getSelectedMeta("relation")))
    const selectFeature = useOSMMapStore(state => state.selectFeature)

    const renderChild = useCallback(({ type, meta }: { type: FeatureTypes; meta: Node | Way | Relation; }) => (<button className="btn btn-xs btn-square tooltip tooltip-bottom"
        data-tip="Active"
        onClick={async (e) => {
            e.stopPropagation()
            console.debug("activating: ", type, meta["@_id"])
            selectFeature(type, meta["@_id"], false)

        }}>
        <FontAwesomeIcon icon={faStarOfLife} />
    </button>), [selectFeature])

    return <FeatureCollection name="selected" defaultOpen>
        <FeatureList
            {...props}
            node={selectedNode}
            way={selectedWay}
            relation={selectedRelation}
            showMetaType
        >
            {renderChild}
        </FeatureList>
    </FeatureCollection>
}