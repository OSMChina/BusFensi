import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemBase from "../../../../../components/osm/outline/itemBase";
import { useOSMMapStore } from "../../../../../store/osmmeta";
import { FeatureTypes } from "../../../../../type/osm/refobj";
import { getName } from "../../../../../utils/osm/nodeType";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";
import { useMapViewStore } from "../../../../../store/mapview";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons/faCheckCircle";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { cn } from "../../../../../utils/helper/object";
import { useShallow } from "zustand/shallow";
import { useConfirm } from "../../../../../components/modal/simpleConform";
import { Node } from "../../../../../type/osm/meta";
import { FeatureTypeMap } from "../../../../../store/osmmeta/slice/meta/type";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons/faXmarkCircle";

export function FeatureItem<T extends FeatureTypes>({ type, meta }: { type: T, meta: FeatureTypeMap[T] }) {
    const id = meta["@_id"];
    const [selectFeature, unselectFeature, deleteFeature] = useOSMMapStore(useShallow(state => ([state.selectFeature, state.unSelectFeature, state.deleteFeature])))
    const setViewpoint = useMapViewStore(state => state.setViewpoint);
    const confirmModal = useConfirm();

    return <ItemBase
        featuretype={type}
        id={id}
        fullname={getName(meta.tag)}
        created={Number(meta["@_id"]) < 0}
        deleted={meta["@_action"] === "delete"}
        modified={meta["@_action"] === "modify"}
    >
        {type === "node" && <button className="btn btn-xs btn-square tooltip tooltip-bottom"
            data-tip="Switch to position"
            onClick={() => {
                if (type === "node") {
                    const node = meta as Node;
                    setViewpoint({ lat: node["@_lat"], lon: node["@_lon"] })
                }
            }}>
            <FontAwesomeIcon icon={faLocationDot} /></button>}
        <button className={cn("btn btn-xs btn-square tooltip tooltip-bottom", meta["@_localStates"]?.selected && "active")}
            data-tip={meta["@_localStates"]?.selected ? "Unselect" : "Select"}
            onClick={() => {
                if (meta["@_localStates"]?.selected) {
                    unselectFeature(type, id)
                } else {
                    selectFeature(type, id, false)
                }
            }}>

            <FontAwesomeIcon icon={meta["@_localStates"]?.selected ? faXmarkCircle : faCheckCircle} /></button>
        <button className="btn btn-xs btn-square tooltip tooltip-bottom"
            data-tip="Delete"
            onClick={async () => {
                if (await confirmModal({
                    title: "Confirm delete feature",
                    message: "Are you sure you want delete this feature?\n" + (getName(meta.tag || []) || id)
                })
                ) {
                    deleteFeature(type, id)
                }
            }}>
            <FontAwesomeIcon icon={faTrash} /></button>
    </ItemBase>
}

