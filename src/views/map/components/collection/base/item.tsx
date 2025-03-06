import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemBase from "../../../../../components/osm/outline/itemBase";
import { useOSMMapStore } from "../../../../../store/osmmeta";
import { FeatureTypes } from "../../../../../type/osm/refobj";
import { getName, isBusStop, isStopPosition } from "../../../../../utils/osm/nodeType";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";
import { useMapViewStore } from "../../../../../store/mapview";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons/faCheckCircle";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { cn } from "../../../../../utils/helper/object";
import { useShallow } from "zustand/shallow";
import SimpleConfirm from "../../../../../components/modal/SimpleConfirm";
import { Node } from "../../../../../type/osm/meta";
import { FeatureTypeMap } from "../../../../../store/osmmeta/slice/meta/type";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons/faXmarkCircle";
import { createConfirmation } from "react-confirm";
import { ReactNode, useMemo } from "react";
import { isStopArea } from "../../../../../utils/osm/relationType";

export function FeatureItem<T extends FeatureTypes>({ type, meta, showMetaType, children }: {
    type: T, meta: FeatureTypeMap[T], showMetaType?: true,
    children?: (type: T, meta: FeatureTypeMap[T]) => ReactNode
}) {
    const id = meta["@_id"];
    const [selectFeature, unselectFeature, deleteFeature] = useOSMMapStore(useShallow(state => ([state.selectFeature, state.unSelectFeature, state.deleteFeature])))
    const setViewpoint = useMapViewStore(state => state.setViewpoint);
    const confirmModal = createConfirmation(SimpleConfirm)

    const metatype = useMemo(() => {
        if (showMetaType && meta.tag?.length) {
            if (type === "node") {
                if (isBusStop(meta.tag)) {
                    return "Bus Stop"
                } else if (isStopPosition(meta.tag)) {
                    return "Stop Position"
                }
            } else if (type === "relation") {
                if (isStopArea(meta.tag)) {
                    return "Stop Area"
                }
            }
        }
        return undefined;
    }, [showMetaType, meta.tag, type])

    return <ItemBase
        featuretype={type}
        id={id}
        metatype={metatype}
        fullname={getName(meta.tag)}
        created={Number(meta["@_id"]) < 0}
        deleted={meta["@_action"] === "delete"}
        modified={meta["@_action"] === "modify"}
    >
        {type === "node" && <button className="btn btn-xs btn-square tooltip tooltip-bottom"
            data-tip="Switch to position"
            onClick={(e) => {
                e.stopPropagation()
                if (type === "node") {
                    const node = meta as Node;
                    setViewpoint({ lat: node["@_lat"], lon: node["@_lon"] })
                }
            }}>
            <FontAwesomeIcon icon={faLocationDot} /></button>}
        <button className={cn("btn btn-xs btn-square tooltip tooltip-bottom", meta["@_localStates"]?.selected && "active")}
            data-tip={meta["@_localStates"]?.selected ? "Unselect" : "Select"}
            onClick={(e) => {
                e.stopPropagation()
                if (meta["@_localStates"]?.selected) {
                    unselectFeature(type, id)
                } else {
                    selectFeature(type, id, false)
                }
            }}>

            <FontAwesomeIcon icon={meta["@_localStates"]?.selected ? faXmarkCircle : faCheckCircle} /></button>
        <button className="btn btn-xs btn-square tooltip tooltip-bottom"
            data-tip="Delete"
            onClick={async (e) => {
                e.stopPropagation()
                console.debug("deleting: ", type, id)
                const res = await confirmModal({
                    title: "Confirm delete feature",
                    message: "Are you sure you want delete this feature?\n" + (getName(meta.tag || []) || id)
                })
                console.debug("confirmed deleting: ", res, type, id)
                if (res) {

                    deleteFeature(type, id)
                }
            }}>
            <FontAwesomeIcon icon={faTrash} /></button>
        {children && children(type, meta)}
    </ItemBase>
}

