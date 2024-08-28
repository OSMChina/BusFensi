import { useShallow } from "zustand/react/shallow";
import useBearStoreWithUndo from "../../logic/model/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import NodeItem from "./components/NodeItem";
import WayItem from "./components/WayItem";
import RelationItem from "./components/RelationItem";
import { T2Arr } from "../../utils/helper/object";

function OutlineView() {
    const nodesId = useBearStoreWithUndo(useShallow((state) => Object.keys(state.renderedOSMFeatureMeta.nodes)));
    const waysId = useBearStoreWithUndo(useShallow((state) => Object.keys(state.renderedOSMFeatureMeta.ways)));
    const relationsId = useBearStoreWithUndo(useShallow((state) => Object.keys(state.renderedOSMFeatureMeta.relations)));
    const { ways, relations } = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta))

    const subNodesId = new Set([
        waysId
            .filter(id => ways[id].nd).map(id => T2Arr(ways[id].nd).map(nd => String(nd["@_ref"])))
            .flat(),
        relationsId
            .filter(id => relations[id].member && T2Arr(relations[id].member).some(member => member["@_type"] === "node"))
            .map(id => T2Arr(relations[id].member).filter(member => member["@_type"] === "node").map(member => String(member["@_ref"])))
            .flat()
    ].flat())

    const subWaysId = new Set(relationsId
        .filter(id => relations[id].member && T2Arr(relations[id].member).some(member => member["@_type"] === "way"))
        .map(id => T2Arr(relations[id].member).filter(member => member["@_type"] === "way").map(member => String(member["@_ref"])))
        .flat())

    return (
        <div className="outline-view min-h-1/2 h-1/2 max-h-1/2 w-full flex flex-col p-1 rounded bg-base-100">
            <label className="input input-xs input-bordered flex items-center gap-2">
                <FontAwesomeIcon icon={faSearch} />
                <input type="text" className="grow" placeholder="Search" />
            </label>
            <div className="outline-list flex-1 overflow-scroll mt-1 rounded">
                <ul className="menu menu-xs bg-base-200">
                    {nodesId.filter(id => !subNodesId.has(id)).map(id => <NodeItem key={id} id={id} />)}
                    {waysId.filter(id => !subWaysId.has(id)).map(id => <WayItem key={id} id={id} />)}
                    {relationsId.map(id => <RelationItem key={id} id={id} />)}
                </ul>
            </div>
        </div>
    );
}

export default OutlineView;
