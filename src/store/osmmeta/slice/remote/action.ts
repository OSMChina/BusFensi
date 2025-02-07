import { StateCreator } from "zustand";
import { NumericString } from "../../../../type/osm/refobj";
import { OSMMapStore } from "../../store";
import { addFeatureMetaHelper, commitHelper } from "../../helper";
import { MapViewStatus } from "../../../../utils/geo/types";
import { loadBBox } from "../../helper";
import { deepCopy } from "../../../../utils/helper/object";
import { genCollection } from "../../computed";
import { Node, Relation, Way } from "../../../../type/osm/meta";

export interface RemoteApiAction {
    loadbbox: (mapview: MapViewStatus, baseurl: string) => Promise<void>
}

export const createRemoteApiActionSlice: StateCreator<
    OSMMapStore, [
        ["zustand/devtools", never],
        ["zustand/persist", unknown],
        ["chrisvander/zustand-computed", unknown],
        ["temporal", unknown],
        ["zustand/immer", never],
    ],
    [],
    RemoteApiAction
> = (set, get) => ({
    loadbbox: async (mapview, baseurl) => {
        const { bbox, meta } = get();
        if (mapview.zoom <= 16) {
            return
        }
        try {
            const b = await loadBBox(bbox || [], mapview, baseurl)
            if (b === null) { return }
            const { node: nodesTmp, way: waysTmp, relation: relationsTmp } = deepCopy(meta);
            const addedNodes: Node[] = [],
                addedWays: Way[] = [],
                addedReations: Relation[] = []
            b.osm.node.forEach(node => {
                const key = node["@_id"];
                if (!nodesTmp[key]) {
                    nodesTmp[key] = node
                    addedNodes.push(node)
                }
            })
            b.osm.way.forEach(way => {
                const key = way["@_id"];
                if (!waysTmp[key]) {
                    waysTmp[key] = way
                    addedWays.push(way)
                }
            })
            b.osm.relation.forEach(relation => {
                const key = relation["@_id"];
                if (!relationsTmp[key]) {
                    relationsTmp[key] = relation
                    addedReations.push(relation)
                }
            })

            // filter
            const collections = genCollection({ node: nodesTmp, way: waysTmp, relation: relationsTmp })

            const totalFiltered = {
                nodesId: new Set<NumericString>(Object.keys(collections.global.node) as NumericString[]),
                waysId: new Set<NumericString>(Object.keys(collections.global.way) as NumericString[]),
                relationsId: new Set<NumericString>(Object.keys(collections.global.relation) as NumericString[]),
            }

            const validNodes = addedNodes.filter(n => totalFiltered.nodesId.has(n["@_id"]))
            const validWays = addedWays.filter(w => totalFiltered.waysId.has(w["@_id"]))
            const validRelations = addedReations.filter(r => totalFiltered.relationsId.has(r["@_id"]))

            set((state) => {
                commitHelper(state);
                validNodes.forEach(n => {
                    addFeatureMetaHelper(state, "node", n);
                });
                validWays.forEach(w => {
                    addFeatureMetaHelper(state, "way", w);
                });
                validRelations.forEach(r => {
                    addFeatureMetaHelper(state, "relation", r);
                });
                // 修改 bbox，直接对 state.bbox 进行原地修改
                state.bbox.push({
                    ...b,
                    osm: {
                        ...b.osm,
                        node: [], // 不保存 meta
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
