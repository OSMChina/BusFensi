import { useShallow } from "zustand/react/shallow"
import { useState } from "react"
import { fetchNode, fetchNodes, fetchRelation, fetchWay } from "../../../api/osm/apiv0.6"
import { T2Arr } from "../../../utils/helper/object"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faDeleteLeft, faDownload } from "@fortawesome/free-solid-svg-icons"
import { ItemRefObj } from "../../../logic/model/type"
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons"
import { FeatureTypes, NumericString } from "../../../type/osm/refobj"
import { useOSMMapStore } from "../../../store/osmmeta"
import { useSettingsStore } from "../../../store/settings"

function MemberListItem({ id, type, onDel, select, edit }: {
    id: NumericString,
    type: FeatureTypes,
    onDel: (item: ItemRefObj) => void,
    select?: {
        active?: ItemRefObj
        setter: (item: ItemRefObj) => void
    },
    edit?: {
        text: string,
        setter: (text: string) => void
        onBlur: () => void,
        onFocus: () => void
    }
}) {
    const settings = useSettingsStore()
    const loaded = useOSMMapStore(useShallow((state) => state.collections.global[type][id]))
    const addFeatureMeta = useOSMMapStore((state) => state.addFeatureMetaBatch);

    const [loading, setLoading] = useState(false)
    const [editing, setEditing] = useState(false)

    const loadElement = async (
        id: string) => {
        setLoading(true)
        if (type === "node") {
            const node = await fetchNode(settings.osmAPI.BASEURL, id)
            addFeatureMeta("node", node);
        } else if (type === "way") {
            const way = await fetchWay(settings.osmAPI.BASEURL, id)
            const nodes = await fetchNodes(settings.osmAPI.BASEURL, T2Arr(way.nd).map(nd => nd["@_ref"]))
            addFeatureMeta("node", nodes);
            addFeatureMeta("way", way);
        } else if (type === "relation") {
            const rl = await fetchRelation(settings.osmAPI.BASEURL, id)
            addFeatureMeta("relation", rl);
        }
        setLoading(false)
    }

    return <div className={`rounded-sm border text-xs flex flex-row pl-1 ${(select?.active?.id === id && select.active.type) ? "bg-neutral text-neutral-content" : "bg-base-200 text-base-content"}`}>
        <span>{`${type}-${id}`}</span>
        <span className="ml-auto"></span>
        {edit && (editing ?
            <input
                className="input input-xs input-bordered"
                type="text"
                value={edit.text}
                onMouseDown={e => e.stopPropagation()}
                onKeyDown={e => e.stopPropagation()}
                onChange={(e) => edit.setter(e.target.value)}
                onBlur={() => {
                    edit.onBlur()
                    setEditing(false)
                }}
            />
            :
            <button className="btn btn-square btn-xs"
                onMouseDown={(event) => {
                    event.stopPropagation();
                    setEditing(true)
                    edit.onFocus()
                }}
            >
                <FontAwesomeIcon icon={faPenToSquare} />
            </button>)
        }
        {!loaded && (loading ?
            (<span className="loading loading-spinner loading-xs"></span>)
            : (
                <button className="btn btn-square btn-xs btn-success" onMouseDown={(event) => {
                    event.stopPropagation();
                    loadElement(id)
                }} >
                    <FontAwesomeIcon icon={faDownload} />
                </button>
            ))
        }

        {select && (<button className="btn btn-square btn-accent btn-xs" onMouseDown={(event) => {
            event.stopPropagation();
            select.setter({ id: id, type: type })
        }}>
            <FontAwesomeIcon icon={faCheck} />
        </button>)}
        <button className="btn btn-square btn-error  btn-xs" onMouseDown={(event) => {
            event.stopPropagation();
            onDel({ id: id, type: type })
        }} >
            <FontAwesomeIcon icon={faDeleteLeft} />
        </button>

    </div>
}

export default MemberListItem;