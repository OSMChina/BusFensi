import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faCircle } from "@fortawesome/free-solid-svg-icons";
import useBearStoreWithUndo from "../../../logic/model/store";
import { T2Arr } from "../../../utils/helper/object";
import { isBusStop } from "../../../utils/osm/busFilter";
import { useShallow } from "zustand/react/shallow";
import { filterFunc } from "./type";

function NodeItem({ id, filter }: { id: string, filter:filterFunc }) {
    const meta = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta.nodes[id]));
    const featureState = useBearStoreWithUndo(useShallow((state) => state.renderedFeatureState[id]));
    const setSelectedComponent = useBearStoreWithUndo((state) => state.PIXIComponentSelectAction)
    
    if (!filter(meta, "node")) {
        return null
    }
    
    const {visible, selected } = featureState

    let name = `node-${id}`;
    let icon = faCircle;

    const tags = T2Arr(meta.tag);
    tags.forEach(tag => {
        if (tag["@_k"] === 'name') {
            name = tag["@_v"];
        }
    });

    if (isBusStop(tags)) {
        icon = faBus;
    }

    const className = `outline-list-item
    ${(visible ? 'bg-base-200 text-base-content' : 'bg-base-100 text-gray-400')}`;

    const handleClick: React.MouseEventHandler<HTMLSpanElement> = (e) => {
        setSelectedComponent(id, !e.shiftKey); // select the way, auto
    };


    return (
        <li className={className}>
            <span className={selected ? 'active' : ""} onClick={handleClick} >
                <FontAwesomeIcon icon={icon} />
                {name}
            </span>
        </li>
    );
}

export default NodeItem;
