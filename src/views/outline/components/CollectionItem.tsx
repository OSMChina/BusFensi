import { faBars, faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NodeItem from "./NodeItem";
import WayItem from "./WayItem";
import RelationItem from "./RelationItem";
import { CollectionItem as ColItemType } from "../../../type/osm/refobj";
import { FilterFunc } from "../../../type/view/outline/type";
import { useOSMMapStore } from "../../../store/osmmeta";
import { typedKeys } from "../../../utils/helper/object";

function CollectionItem({ collecion, name: coName, filterFun }: {
    collecion: ColItemType,
    name: string,
    filterFun: FilterFunc
}) {
    const { node, way, relation } = collecion
    const { roots } = useOSMMapStore((state) => state.tree)
    const [collapsed, setCollapsed] = useState(true);
    const toggleCollapse: React.MouseEventHandler<SVGSVGElement> = (e) => {
        e.stopPropagation(); // prevent selecting when collapsing
        setCollapsed(!collapsed);
    };
    const filter: FilterFunc = (meta, type) => (
        meta
        && (
            type === "node" && node[meta["@_id"]]
            || type === "way" && way[meta["@_id"]]
            || type === "relation" && relation[meta["@_id"]]
        )
        && filterFun(meta, type)
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
                    {[...typedKeys(roots.node)].map(id => <NodeItem key={id} id={id} filter={filter} />)}
                    {[...typedKeys(roots.way)].map(id => <WayItem key={id} id={id} filter={filter} />)}
                    {[...typedKeys(roots.relation)].map(id => <RelationItem key={id} id={id} filter={filter} />)}
                </ul>
            )}
        </li>
    );
}

export default CollectionItem