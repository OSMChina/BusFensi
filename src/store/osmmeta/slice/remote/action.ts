import { StateCreator } from "zustand";
import { FeatureTypes, NumericString } from "../../../../type/osm/refobj";
import { OSMMapStore } from "../../store";
import { addFeatureMetaHelper, commitHelper } from "../../helper";
import { MapViewStatus } from "../../../../utils/geo/types";
import { loadBBox } from "../../helper";
import { deepCopy } from "../../../../utils/helper/object";
import { genCollection } from "../../middleware/computed";
import { Node, Relation, Way } from "../../../../type/osm/meta";
import { fetchNode, fetchNodes, fetchRelation, fetchRelations, fetchWay, fetchWays } from "../../../../api/osm/apiv0.6";

export interface RemoteApiAction {
    loadbbox: (mapview: MapViewStatus, baseurl: string) => Promise<void>
    loadFeature: (type: FeatureTypes, id: NumericString, baseurl: string) => Promise<void>
    loadFeatureBatch: (features: { type: FeatureTypes, id: NumericString }[], baseurl: string) => Promise<void>
    setAutoloadNC: (enable: boolean | (() => boolean)) => void
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
                    if (!state.meta.node[n["@_id"]]) addFeatureMetaHelper(state, "node", n);
                });
                validWays.forEach(w => {
                    if (!state.meta.way[w["@_id"]]) addFeatureMetaHelper(state, "way", w);
                });
                validRelations.forEach(r => {
                    if (!state.meta.relation[r["@_id"]]) addFeatureMetaHelper(state, "relation", r);
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
    },
    loadFeature: async (type, id, baseurl) => {
        const { meta, addFeatureMetaBatch } = get();
        if (type === "node") {
            if (!meta.node[id]) addFeatureMetaBatch("node", await fetchNode(baseurl, id));
        } else if (type === "way") {
            const way = await fetchWay(baseurl, id)
            const nodes = await fetchNodes(baseurl, way.nd.map(nd => nd["@_ref"]))
            addFeatureMetaBatch("node", nodes.filter(n => !meta.node[n["@_id"]]));
            if (!meta.way[id]) addFeatureMetaBatch("way", way);
        } else if (type === "relation") {
            if (!meta.relation[id]) addFeatureMetaBatch("relation", await fetchRelation(baseurl, id));
        }
    },
    loadFeatureBatch: async (features, baseurl) => {
        const { meta, addFeatureMetaBatch } = get();
        const node = features.filter(f => f.type === "node" && !meta.node[f.id]).map(f => f.id)
        const way = features.filter(f => f.type === "way" && !meta.way[f.id]).map(f => f.id)
        const relation = features.filter(f => f.type === "relation" && !meta.relation[f.id]).map(f => f.id)
        if (way.length > 0) {
            const wmeta = await fetchWays(baseurl, way)
            const wnds = wmeta.map(w => w.nd.map(nd => nd["@_ref"]).filter(n => !meta.node[n])).flat()
            const wndmeta = await fetchNodes(baseurl, wnds)
            addFeatureMetaBatch("node", wndmeta)
            addFeatureMetaBatch("way", wmeta)
        }
        if (node.length > 0) {
            const nmeta = await fetchNodes(baseurl, node)
            addFeatureMetaBatch("node", nmeta)
        }
        if (relation.length > 0 ) {
            const rmeta = await fetchRelations(baseurl, relation)
            addFeatureMetaBatch("relation", rmeta)
        }
    },

    setAutoloadNC: (enable) => set(state => { state.autoload = (typeof enable === "function" ? enable() : enable) }),
})
