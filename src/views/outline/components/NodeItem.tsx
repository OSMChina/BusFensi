import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faCircle } from "@fortawesome/free-solid-svg-icons";
import { T2Arr } from "../../../utils/helper/object";
import { isBusStop } from "../../../utils/osm/nodeType";
import { useShallow } from "zustand/react/shallow";
import { FilterFunc } from "../../../type/view/outline/type";
import { useOSMMapStore } from "../../../store/osmmeta";
import { NumericString } from "../../../type/osm/refobj";

function NodeItem({ id, filter }: { id: NumericString, filter: FilterFunc }) {
    const meta = useOSMMapStore(useShallow((state) => state.meta.node[id]));
    const featureState = useOSMMapStore(useShallow((state) => state.meta.node[id]["@_localStates"]));
    const setSelectedComponent = useOSMMapStore((state) => state.selectFeature)

    if (!meta || !filter(meta, "node")) {
        return null
    }

    const { visible, selected } = featureState!

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
        setSelectedComponent("node", id, !e.shiftKey); // select the way, auto
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
