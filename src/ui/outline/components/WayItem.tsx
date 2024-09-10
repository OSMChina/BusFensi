import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRoad, faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import useBearStoreWithUndo from "../../../logic/model/store";
import NodeItem from "./NodeItem";
import { T2Arr } from "../../../utils/helper/object";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
import { filterFunc } from "../type";

function WayItem({ id, filter }: { id: string, filter: filterFunc }) {
    const nodesId = useBearStoreWithUndo(useShallow((state) => Object.keys(state.renderedOSMFeatureMeta.nodes)));
    const way = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta.ways[id]));
    const setSelectedComponent = useBearStoreWithUndo((state) => state.PIXIComponentSelectAction);
    const featureState = useBearStoreWithUndo(useShallow((state) => state.renderedFeatureState.ways[id]));
    const [collapsed, setCollapsed] = useState(true);
    if (!filter(way, "way")) {
        return null
    }

    const { visible, selected } = featureState;
    const tags = T2Arr(way.tag);

    let name = `way-${id}`;
    tags.forEach(tag => {
        if (tag["@_k"] === 'name') {
            name = tag["@_v"];
        }
    });

    const subNodes = T2Arr(way.nd).filter(nd => nodesId.includes(nd["@_ref"]));

    const className = `outline-list-item
    ${selected ? 'active' : (visible ? 'bg-base-200 text-base-content' : 'bg-base-100 text-gray-400')}`;


    const handleClick: React.MouseEventHandler<HTMLSpanElement> = (e) => {
        setSelectedComponent("way", id, !e.shiftKey); // select the way, auto
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
                {/* {subNodeSelected && (<FontAwesomeIcon className={`ml-auto text-info`} icon={faCircle} />)} */}
            </span>
            {!collapsed && (
                <ul className="menu menu-xs pl-4">
                    {subNodes.map(nd => <NodeItem key={nd["@_ref"]} id={nd["@_ref"]} filter={filter} />)}
                </ul>
            )}
        </li>
    );
}

export default WayItem;
