import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRoad, faChevronDown, faChevronRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import useBearStoreWithUndo from "../../../logic/model/store";
import NodeItem from "./NodeItem";
import { T2Arr } from "../../../utils/helper/object";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";

function WayItem({ id }: { id: string }) {
    const nodesId = useBearStoreWithUndo(useShallow((state) => Object.keys(state.renderedOSMFeatureMeta.nodes)));
    const way = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta.ways[id]));
    const selectedComponent = useBearStoreWithUndo(useShallow(state => state.selectedComponent))
    const setSelectedComponent = useBearStoreWithUndo((state) => state.PIXIComponentSelectAction);
    const { visible, selected } = useBearStoreWithUndo(useShallow((state) => state.renderedFeatureState[id]));
    const tags = T2Arr(way.tag);

    let name = `way-${id}`;
    tags.forEach(tag => {
        if (tag["@_k"] === 'name') {
            name = tag["@_v"];
        }
    });

    const subNodes = T2Arr(way.nd).filter(nd => nodesId.includes(String(nd["@_ref"])));

    const className = `outline-list-item
    ${selected ? 'active' : (visible ? 'bg-base-200 text-base-content' : 'bg-base-100 text-gray-400')}`;

    const subNodeSelected = subNodes.some(nd => selectedComponent.includes(String(nd["@_ref"])))
    const [collapsed, setCollapsed] = useState(!subNodeSelected);

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
                <FontAwesomeIcon icon={faRoad} className="ml-2 " />
                <span className="ml-0 mr-auto">{name}</span>
                {subNodeSelected && (<FontAwesomeIcon className={`ml-auto text-info`} icon={faCircle} />)}
            </span>
            {!collapsed && (
                <ul className="menu menu-xs pl-4">
                    {subNodes.map(nd => <NodeItem key={nd["@_ref"]} id={String(nd["@_ref"])} />)}
                </ul>
            )}
        </li>
    );
}

export default WayItem;
