import { useShallow } from "zustand/react/shallow"
import useBearStoreWithUndo from "../../../logic/model/store"
import { useState } from "react"
import { fetchNode, fetchNodes, fetchRelation, fetchWay } from "../../../api/osm/apiv0.6"
import { settings } from "../../../logic/settings/settings"
import { T2Arr } from "../../../utils/helper/object"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faDeleteLeft, faDownload } from "@fortawesome/free-solid-svg-icons"

function MemberListItem({ id, type, onDel, select }: {
    id: string,
    type: "node" | "way" | "relation",
    onDel: (id: string) => void,
    select?: {
        activeId: string | null
        setter: (id: string) => void
    }
}) {
    const loaded = useBearStoreWithUndo(useShallow((state) => state.collections.global[`${type}sId`].has(id)))
    const addNodeAction = useBearStoreWithUndo((state) => state.addNodeAction)
    const addWayAction = useBearStoreWithUndo((state) => state.addWayAction)
    const addRelationAction = useBearStoreWithUndo((state) => state.addRelationAction)
    const [loading, setLoading] = useState(false)

    const loadElement = async (
        id: string) => {
        setLoading(true)
        if (type === "node") {
            const node = await fetchNode(settings.osmAPI.BASEURL, id)
            addNodeAction(node);
        } else if (type === "way") {
            const way = await fetchWay(settings.osmAPI.BASEURL, id)
            const nodes = await fetchNodes(settings.osmAPI.BASEURL, T2Arr(way.nd).map(nd => nd["@_ref"]))
            addWayAction(way, nodes)
        } else if (type === "relation") {
            const rl = await fetchRelation(settings.osmAPI.BASEURL, id)
            addRelationAction(rl)
        }
        setLoading(false)
    }

    return <div className={`rounded-sm border text-xs flex flex-row pl-1 ${select?.activeId === id ? "bg-neutral text-neutral-content" : "bg-base-200 text-base-content"}`}>
        <span>{`${type}-${id}`}</span>
        <span className="ml-auto"></span>
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
            select.setter(id)
        }}>
            <FontAwesomeIcon icon={faCheck} />
        </button>)}
        <button className="btn btn-square btn-error  btn-xs" onMouseDown={(event) => {
            event.stopPropagation();
            onDel(id)
        }} >
            <FontAwesomeIcon icon={faDeleteLeft} />
        </button>

    </div>
}

export default MemberListItem;