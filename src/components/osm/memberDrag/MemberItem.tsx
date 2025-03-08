import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ItemBaseDisplay } from "../outline/itemBase";
import { useOSMMapStore } from "../../../store/osmmeta";
import { FeatureTypes, NumericString } from "../../../type/osm/refobj";
import { getName, getNodeType } from "../../../utils/osm/nodeType";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";
import { useMapViewStore } from "../../../store/mapview";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons/faCheckCircle";
import { cn } from "../../../utils/helper/object";
import { useShallow } from "zustand/shallow";
import { Node } from "../../../type/osm/meta";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons/faXmarkCircle";
import { MouseEventHandler, ReactNode, useCallback, useMemo, useState } from "react";
import { getRelationType } from "../../../utils/osm/relationType";
import { useSettingsStore } from "../../../store/settings";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

export default function MemberItem({ type, id, showMetaType, children }: {
    type: FeatureTypes, id: NumericString, showMetaType?: true,
    children?: (props: { type: FeatureTypes, id: NumericString }) => ReactNode
}) {
    const [meta, selectFeature, unselectFeature, loadFeature] = useOSMMapStore(useShallow(
        state => ([state.meta[type][id], state.selectFeatureWithoutActive, state.unSelectFeature, state.loadFeature])))
    const baseurl = useSettingsStore(store => store.osmAPI.BASEURL)
    const setViewpoint = useMapViewStore(state => state.setViewpoint);

    const metatype = useMemo(() => {
        if (showMetaType && meta?.tag?.length) {
            if (type === "node") {
                return getNodeType(meta.tag)
            } else if (type === "relation") {
                return getRelationType(meta.tag)
            }
        }
        return undefined;
    }, [showMetaType, meta?.tag, type])

    const [loading, setLoading] = useState(false)

    const loadElement = useCallback(async () => {
        setLoading(true)
        await loadFeature(type, id, baseurl)
        setLoading(false)
    }, [loadFeature, type, id, baseurl])

    const setViewpiont = useCallback<MouseEventHandler<HTMLButtonElement>>((e) => {
        e.stopPropagation()
        if (type === "node") {
            const node = meta as Node;
            setViewpoint({ lat: node["@_lat"], lon: node["@_lon"] })
        }
    }, [meta, setViewpoint, type])

    const toggleSelectFeature = useCallback<MouseEventHandler<HTMLButtonElement>>((e) => {
        e.stopPropagation()
        if (meta["@_localStates"]?.selected) {
            unselectFeature(type, id)
        } else {
            selectFeature(type, id, false)
        }
    }, [id, meta, selectFeature, type, unselectFeature])

    const toggleLoadElement = useCallback<MouseEventHandler<HTMLButtonElement>>((event) => {
        event.stopPropagation();
        loadElement()
    }, [loadElement])

    if (!meta) {
        return <div className="flex text-xs flex-1 flex-row items-center px-1 ml-1 gap-1">
            <ItemBaseDisplay
                featuretype={type}
                id={id}
                fullname={'[not downloaded]'}
            >
                {(loading ?
                    (<span className="loading loading-spinner loading-xs"></span>)
                    : (
                        <button className="btn btn-square btn-xs btn-success tooltip tooltip-bottom"
                            data-tip="Download feature"
                            onMouseDown={toggleLoadElement} >
                            <FontAwesomeIcon icon={faDownload} />
                        </button>
                    ))}
                {children && children({ type, id })}
            </ItemBaseDisplay>
        </div>
    }

    return <div className="flex text-xs flex-1 flex-row items-center px-1 ml-1 gap-1"><ItemBaseDisplay
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
            onClick={setViewpiont}>
            <FontAwesomeIcon icon={faLocationDot} /></button>}
        <button className={cn("btn btn-xs btn-square tooltip tooltip-bottom", meta["@_localStates"]?.selected && "btn-accent")}
            data-tip={meta["@_localStates"]?.selected ? "Unselect" : "Select"}
            onClick={toggleSelectFeature}>
            <FontAwesomeIcon icon={meta["@_localStates"]?.selected ? faXmarkCircle : faCheckCircle} /></button>
        {children && children({ type, id })}
    </ItemBaseDisplay>
    </div>
}

