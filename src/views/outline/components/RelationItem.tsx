import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNodes, faChevronRight, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useShallow } from "zustand/react/shallow";
import NodeItem from "./NodeItem";
import WayItem from "./WayItem";
import { useState } from "react";
import { FilterFunc } from "../../../type/view/outline/type";
import { useOSMMapStore } from "../../../store/osmmeta";
import { NumericString } from "../../../type/osm/refobj";
import { T2Arr } from "../../../utils/helper/object";

function RelationItem({ id, filter }: { id: NumericString, filter: FilterFunc }) {
    const relations = useOSMMapStore(useShallow((state) => state.meta.relation[id]));
    const setSelectedComponent = useOSMMapStore((state) => state.selectFeature);
    const featureState = useOSMMapStore(useShallow((state) => state.meta.relation[id]["@_localStates"]));
    const [collapsed, setCollapsed] = useState(true)

    if (!filter(relations, "relation")) {
        return null
    }

    const { visible, selected } = featureState!;

    let name = `relation-${id}`;
    const tags = T2Arr(relations.tag);
    tags.forEach(tag => {
        if (tag["@_k"] === 'name') {
            name = tag["@_v"];
        }
    });

    const className = `outline-list-item
    ${selected ? 'active' : (visible ? 'bg-base-200 text-base-content' : 'bg-base-100 text-gray-400')}`;

    const members = T2Arr(relations.member)
    const subNodes = members.filter(member => member["@_type"] === "node")
    const subWays = members.filter(member => member["@_type"] === "way")
    const subRelations = members.filter(member => member["@_type"] === "relation")

    const handleClick: React.MouseEventHandler<HTMLSpanElement> = (e) => {
        setSelectedComponent("relation", id, !e.shiftKey); // select the way, auto
    };

    const toggleCollapse: React.MouseEventHandler<SVGSVGElement> = (e) => {
        e.stopPropagation(); // prevent selecting when collapsing
        setCollapsed(!collapsed);
    };


    return (
        <li className={className}>
            <span className={`flex flex-row ${selected ? "bg-neutral text-neutral-content " : ""}`} onClick={handleClick}>
                <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronDown} onClick={toggleCollapse} />
                <FontAwesomeIcon className="ml-2" icon={faCircleNodes} />
                {name}
                {/* {(subNodeSelected || subWaySeleted) && (<FontAwesomeIcon className={`ml-auto text-info`} icon={faCircle} />)} */}
            </span>
            {!collapsed && (<ul className="menu menu-xs pl-4">
                {subNodes.map(member => <NodeItem key={member["@_ref"]} id={member["@_ref"]} filter={filter} />)}
                {subWays.map(member => <WayItem key={member["@_ref"]} id={member["@_ref"]} filter={filter} />)}
                {subRelations.map(member => <RelationItem key={member["@_ref"]} id={member["@_ref"]} filter={filter} />)}
            </ul>)}
        </li>
    );
}

export default RelationItem;
