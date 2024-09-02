import { useShallow } from "zustand/react/shallow"
import useBearStoreWithUndo from "../../../logic/model/store"
import { useState } from "react"
import { fetchNode, fetchNodes, fetchRelation, fetchWay } from "../../../api/osm/apiv0.6"
import { settings } from "../../../logic/settings/settings"
import { T2Arr } from "../../../utils/helper/object"

function MemberListItem({ id, type, onDel }: {
    id: string,
    type: "node" | "way" | "relation",
    onDel: (id: string) => void
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

    return <div className="p-2 bg-base-200 rounded-md">
        {loaded ?
            (<span>{`${type}-${id}`}</span>)
            : (<>
                <span>{`${type}-${id}`}</span>
                {loading
                    ? (<span className="loading loading-spinner loading-xs"></span>)
                    : (
                        <button className="btn btn-square" onMouseDown={(event) => {
                            event.stopPropagation();
                            loadElement(id)
                        }} >
                            Down
                        </button>
                    )
                }
            </>)
        }
        <button className="btn btn-square btn-error" onMouseDown={(event) => {
            event.stopPropagation();
            onDel(id)
        }} >
            Del
        </button>

    </div>
}

export default MemberListItem;