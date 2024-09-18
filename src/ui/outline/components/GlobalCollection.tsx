import { faBars, faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import useBearStoreWithUndo from "../../../logic/model/store";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NodeItem from "./NodeItem";
import WayItem from "./WayItem";
import RelationItem from "./RelationItem";
import { FilterFunc } from "../type";

function GlobalCollection({ name: coName, filterFun }: {
    name: string,
    filterFun: FilterFunc
}) {
    const {nodesId, waysId, relationsId} = useBearStoreWithUndo((state) => state.collections.global)
    
    const [collapsed, setCollapsed] = useState(true);
    const toggleCollapse: React.MouseEventHandler<SVGSVGElement> = (e) => {
        e.stopPropagation(); // prevent selecting when collapsing
        setCollapsed(!collapsed);
    };
    const filter: FilterFunc = (meta, type) => (
        meta
        && filterFun(meta, type)
        && (
            type === "node" && nodesId.has(meta["@_id"])
            || type === "way" && waysId.has(meta["@_id"])
            || type === "relation" && relationsId.has(meta["@_id"])
        )
    )
    return (
        <li className="outline-list-item">
            <span className={`flex flex-row`} >
                <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronDown} onClick={toggleCollapse} />
                <FontAwesomeIcon icon={faBars} className="ml-1 " />
                <span className="ml-0 mr-auto">{coName}</span>
                {/* {subNodeSelected && (<FontAwesomeIcon className={`ml-auto text-info`} icon={faCircle} />)} */}
            </span>
            {!collapsed && (
                <ul className="menu menu-xs pl-4">
                    {[...nodesId.values()].map(id => <NodeItem key={id} id={id} filter={filter} />)}
                    {[...waysId.values()].map(id => <WayItem key={id} id={id} filter={filter} />)}
                    {[...relationsId.values()].map(id => <RelationItem key={id} id={id} filter={filter} />)}
                </ul>
            )}
        </li>
    );
}

export default GlobalCollection