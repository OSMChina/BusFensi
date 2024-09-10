import { faBars, faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import useBearStoreWithUndo from "../../../logic/model/store";
import { CollectionItem as ColItemType } from "../../../logic/model/type";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NodeItem from "./NodeItem";
import WayItem from "./WayItem";
import RelationItem from "./RelationItem";
import { filterFunc } from "../type";

function CollectionItem({ collecion, name: coName }: {
    collecion: ColItemType,
    name: string
}) {
    const { nodesId, waysId, relationsId } = collecion
    const { roots } = useBearStoreWithUndo((state) => state.featureTree)
    const [collapsed, setCollapsed] = useState(true);
    const toggleCollapse: React.MouseEventHandler<SVGSVGElement> = (e) => {
        e.stopPropagation(); // prevent selecting when collapsing
        setCollapsed(!collapsed);
    };
    const filter: filterFunc = (meta, type) => (
        meta
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
                    {[...roots.nodesID].map(id => <NodeItem key={id} id={id} filter={filter} />)}
                    {[...roots.waysID].map(id => <WayItem key={id} id={id} filter={filter} />)}
                    {[...roots.relationsID].map(id => <RelationItem key={id} id={id} filter={filter} />)}
                </ul>
            )}
        </li>
    );
}

export default CollectionItem