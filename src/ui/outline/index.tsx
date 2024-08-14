import { useShallow } from "zustand/react/shallow";
import useBearStoreWithUndo from "../../logic/model/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBus, faCircleNodes, faCircle, faRoad } from "@fortawesome/free-solid-svg-icons";
import { T2Arr } from "../../utils/helper/object";
import { isBusStop } from "../../utils/osm/busStop";



function ListItem({type, id} : {
    type: "node" | "way" | "relation", // will be used to fetch meta like : state.renderedOSMFeatureMeta[type]
    id: string
}) {
    const meta = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta[`${type}s`][id]))
    const {visible, selected} = useBearStoreWithUndo(useShallow((state) => state.renderedFeatureState[id]))

    let name = `${type}-${id}`
    let icon = faCircle;
    if (type === "way") {
        icon = faRoad
    } else if (type === "relation") {
        icon = faCircleNodes
    }

    const tags = T2Arr(meta.tag)
    tags.forEach(tag => {
        if (tag["@_k"] === 'name') {
            name = tag["@_v"]
        }
    })

    if (isBusStop(tags)) {
        icon = faBus
    }

    return <div className={`outline-list-item flex ${visible ? 'text-gray-500 bg-gray-100' : (selected ? 'selected' : 'common')}`} >
        <span><FontAwesomeIcon icon={icon}/></span>
        <span>{name}</span>
    </div>
}

function OutlineView() {
    const nodesId = useBearStoreWithUndo(useShallow((state) => Object.keys(state.renderedOSMFeatureMeta.nodes)));
    const waysId = useBearStoreWithUndo(useShallow((state) => Object.keys(state.renderedOSMFeatureMeta.ways)));
    const relationsId = useBearStoreWithUndo(useShallow((state) => Object.keys(state.renderedOSMFeatureMeta.relations)));

    return <>
        <label className="input input-bordered flex items-center gap-2">
            <input type="text" className="grow" placeholder="Search" />
            <FontAwesomeIcon icon={faSearch} />
        </label>
        <div className="outline-list">
            {nodesId.map(id => ListItem({type: "node", id: id}))}
            {waysId.map(id => ListItem({type: "node", id: id}))}
            {relationsId.map(id => ListItem({type: "node", id: id}))}
        </div>
    </>
}

export default OutlineView