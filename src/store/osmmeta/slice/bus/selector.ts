import { Member } from "../../../../type/osm/meta";
import { OSMMapState } from "../../initialState";

export const getRouteBusStop = (store: OSMMapState): Member[] => {
    const id = store.routeEdit.editing
    if (!id) {
        return [];
    }
    return store.meta.relation[id].member.filter(m => m["@_type"] === "node")
}
export const getRouteWay = (store: OSMMapState): Member[] => {
    const id = store.routeEdit.editing
    if (!id) {
        return [];
    }
    return store.meta.relation[id].member.filter(m => m["@_type"] === "way")
}

export const getSelectedMaster = (store: OSMMapState) => store.routeEdit.selectedMaster
