import { StateCreator } from "zustand";
import { NumericString } from "../../../../type/osm/refobj";
import { OSMMapStore } from "../../store";
import { addFeatureMetaHelper, commitHelper } from "../../helper";
import { MapViewStatus } from "../../../../utils/geo/types";
import { useSettingsStore } from "../../../settings";
import { loadBBox } from "../../helper";
import { deepCopy } from "../../../../utils/helper/object";
import { genCollection } from "../../computed";

export interface RemoteApiAction {
    loadbbox: (mapview: MapViewStatus) => Promise<void>
}

export const createRemoteApiActionSlice: StateCreator<
    OSMMapStore, [
        ["zustand/devtools", never],
        ["zustand/persist", unknown],
        ["temporal", unknown],
        ["zustand/immer", never],
        ["chrisvander/zustand-computed", unknown]
    ],
    [],
    RemoteApiAction
> = (set, get) => ({
    loadbbox: async (mapview) => {
        const settings = useSettingsStore.getState();
        const { bbox, meta } = get();
        try {
            const b = await loadBBox(bbox || [], mapview, settings.osmAPI.BASEURL)
            if (b === null) { return }
            const { node: nodesTmp, way: waysTmp, relation: relationsTmp } = deepCopy(meta);
            const addedNodes: NumericString[] = [],
                addedWays: NumericString[] = [],
                addedReations: NumericString[] = []
            b.osm.node.forEach(node => {
                const key = node["@_id"];
                if (!nodesTmp[key]) {
                    nodesTmp[key] = node
                    addedNodes.push(key)
                }
            })
            b.osm.way.forEach(way => {
                const key = way["@_id"];
                if (!waysTmp[key]) {
                    waysTmp[key] = way
                    addedWays.push(key)
                }
            })
            b.osm.relation.forEach(relation => {
                const key = relation["@_id"];
                if (!relationsTmp[key]) {
                    relationsTmp[key] = relation
                    addedReations.push(key)
                }
            })

            // filter
            const collections = genCollection({ node: nodesTmp, way: waysTmp, relation: relationsTmp })

            const totalFiltered = {
                nodesId: new Set<NumericString>(Object.keys(collections.global.node) as NumericString[]),
                waysId: new Set<NumericString>(Object.keys(collections.global.way) as NumericString[]),
                relationsId: new Set<NumericString>(Object.keys(collections.global.relation) as NumericString[]),
            }

            const validNodes = addedNodes.filter(key => totalFiltered.nodesId.has(key))
            const validWays = addedWays.filter(key => totalFiltered.waysId.has(key))
            const validRelations = addedReations.filter(key => totalFiltered.relationsId.has(key))

            set(state => {
                commitHelper(state)
                validNodes.forEach(id => addFeatureMetaHelper(state, "node", b.osm.node[id]))
                validWays.forEach(id => addFeatureMetaHelper(state, "way", b.osm.way[id]))
                validRelations.forEach(id => addFeatureMetaHelper(state, "relation", b.osm.relation[id]))
                state.bbox.push({
                    ...b,
                    osm: {
                        ...b.osm,
                        node: [], // dont save meta
                        way: [],
                        relation: [],
                    },
                });
            })
        } catch (err) {
            console.log(err);
        }
    }
})
