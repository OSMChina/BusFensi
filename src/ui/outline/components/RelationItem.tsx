import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNodes, faChevronRight, faChevronDown, faCircle } from "@fortawesome/free-solid-svg-icons";
import useBearStoreWithUndo from "../../../logic/model/store";
import { T2Arr } from "../../../utils/helper/object";
import { useShallow } from "zustand/react/shallow";
import NodeItem from "./NodeItem";
import WayItem from "./WayItem";
import { useState } from "react";

function RelationItem({ id }: { id: string }) {
    const nodesId = useBearStoreWithUndo(useShallow((state) => Object.keys(state.renderedOSMFeatureMeta.nodes)));
    const relations = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta.relations[id]));
    const ways = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta.ways))
    const waysId = Object.keys(ways);
    const selectedComponent = useBearStoreWithUndo(useShallow(state => state.selectedComponent))
    const setSelectedComponent = useBearStoreWithUndo((state) => state.PIXIComponentSelectAction);
    const { visible, selected } = useBearStoreWithUndo(useShallow((state) => state.renderedFeatureState[id]));

    let name = `relation-${id}`;
    const tags = T2Arr(relations.tag);
    tags.forEach(tag => {
        if (tag["@_k"] === 'name') {
            name = tag["@_v"];
        }
    });

    const subNodes = T2Arr(relations.member).filter(member => member["@_type"] === "node" && nodesId.includes(String(member["@_ref"])));
    const subWays = T2Arr(relations.member).filter(member => member["@_type"] === "way" && waysId.includes(String(member["@_ref"])));
    const className = `outline-list-item
    ${selected ? 'active' : (visible ? 'bg-base-200 text-base-content' : 'bg-base-100 text-gray-400')}`;

    const subNodeSelected =
        subNodes.some(node => selectedComponent.includes(String(node["@_ref"])))
        || subWays.some(way => ways[way["@_ref"]].nd && T2Arr(ways[way["@_ref"]].nd).some(nd => selectedComponent.includes(String(nd["@_ref"]))))
    const subWaySeleted = subWays.some(way => selectedComponent.includes(String(way["@_ref"])))
    
    const [collapsed, setCollapsed] = useState(!(subNodeSelected || subWaySeleted))

    const handleClick: React.MouseEventHandler<HTMLSpanElement> = (e) => {
        setSelectedComponent(id, !e.shiftKey); // select the way, auto
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
                {(subNodeSelected || subWaySeleted) && (<FontAwesomeIcon className={`ml-auto text-info`} icon={faCircle} />)}
            </span>
            {!collapsed && (<ul className="menu menu-xs pl-4">
                {subNodes.map(member => <NodeItem key={member["@_ref"]} id={String(member["@_ref"])} />)}
                {subWays.map(member => <WayItem key={member["@_ref"]} id={String(member["@_ref"])} />)}
            </ul>)}
        </li>
    );
}

export default RelationItem;
