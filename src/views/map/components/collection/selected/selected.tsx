import { useShallow } from "zustand/shallow";
import { useOSMMapStore } from "../../../../../store/osmmeta";
import { OutlineCollectionProps } from "../../../../../type/view/outline/type";
import { FeatureCollection, FeatureList } from "../base/list";
import { getSelectedMeta } from "../../../../../store/osmmeta/selector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStarOfLife } from "@fortawesome/free-solid-svg-icons/faStarOfLife";

export function SelectedCollection(props: OutlineCollectionProps) {
    const selectedNode = useOSMMapStore(useShallow(getSelectedMeta("node")))
    const selectedWay = useOSMMapStore(useShallow(getSelectedMeta("way")))
    const selectedRelation = useOSMMapStore(useShallow(getSelectedMeta("relation")))
    const selectFeature = useOSMMapStore(state => state.selectFeature)
    return <FeatureCollection name="selected" defaultOpen>
        {() => <FeatureList
            {...props}
            node={selectedNode}
            way={selectedWay}
            relation={selectedRelation}
            showMetaType
        >
            {(type, meta) => <button className="btn btn-xs btn-square tooltip tooltip-bottom"
                data-tip="Active"
                onClick={async (e) => {
                    e.stopPropagation()
                    console.debug("activating: ", type, meta["@_id"])
                    selectFeature(type, meta["@_id"], false)

                }}>
                <FontAwesomeIcon icon={faStarOfLife} /></button>
            }
        </FeatureList>}
    </FeatureCollection>
}