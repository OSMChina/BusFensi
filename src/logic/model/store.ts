import { create } from "zustand";
import { temporal } from "zundo";
import { DEFAULT_VIEWPOINT_WGS84, DEFAULT_ZOOM } from "../../utils/geo/constants";
import { DataState, FeatureState } from "./type";
import { OSMV06BBoxObj } from "../../api/osm/type";
import { deepCopy, T2Arr } from "../../utils/helper/object";
import { produce } from "immer";
const DEFAULT_RENDERED_FEATURE_STATE: FeatureState = {
    visible: true,
    selected: false,
    highlighted: false,
    active: false,
    hovered: false
}

/**
 * Why bear store? Cause we use zustand!
*/
const useBearStoreWithUndo = create<DataState>()(
    temporal(
        (set) => ({
            zoom: DEFAULT_ZOOM,
            viewpoint: DEFAULT_VIEWPOINT_WGS84,
            stage: {
                width: 0,
                height: 0
            },
            bboxs: [],
            commitCounter: 0,
            selectedComponent: [],
            edit: {
                nodes: {},
                ways: {},
                relations: {}
            },
            renderedOSMFeatureMeta: {
                nodes: {},
                ways: {},
                relations: {},
                id2type: {}
            },
            renderedFeatureState: {},
            collections: {
                ptv2: {
                    nodesId: new Set(),
                    waysId: new Set(),
                    relationsId: new Set(),
                },
                highway: {
                    nodesId: new Set(),
                    waysId: new Set(),
                    relationsId: new Set()
                },
                global: {
                    nodesId: new Set(),
                    waysId: new Set(),
                    relationsId: new Set()
                }
            },

            commitAction: () => set(
                (state) => ({
                    commitCounter: state.commitCounter + 1
                })
            ),
            OSMLoadedDataAction: (bbox: OSMV06BBoxObj) => set(produce(
                (state: DataState) => {
                    const { nodes, ways, relations, id2type } = state.renderedOSMFeatureMeta;
                    const renderedFeatureState = state.renderedFeatureState;
                    T2Arr(bbox.osm.node).forEach(node => {
                        const key: string = String(node["@_id"]);
                        if (!nodes[key]) {
                            nodes[key] = node
                            id2type[key] = "node"
                            renderedFeatureState[key] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE)
                        }
                    })
                    T2Arr(bbox.osm.way).forEach(way => {
                        const key = String(way["@_id"]);
                        if (!ways[key]) {
                            ways[key] = way
                            id2type[key] = "way"
                            renderedFeatureState[key] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE)
                        }
                    })
                    T2Arr(bbox.osm.relation).forEach(relation => {
                        const key = String(relation["@_id"]);
                        if (!relations[key]) {
                            relations[key] = relation
                            id2type[key] = "relation"
                            renderedFeatureState[key] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE)
                        }
                    })
                    state.bboxs.push(bbox)
                    state.renderedOSMFeatureMeta = {
                        nodes: nodes,
                        ways: ways,
                        relations: relations,
                        id2type: id2type
                    }
                    state.renderedFeatureState = renderedFeatureState
                    state.commitCounter += 1
                })
            ),
            // 修改 node[id] 的方法
            modifyNodeNoCommit: (idStr, newNodeData) => set(produce(
                (state: DataState) => {
                    const key = String(idStr);
                    state.edit.nodes[key] = {
                        ...state.edit.nodes[key],
                        ...newNodeData,
                    };
                    state.renderedOSMFeatureMeta.nodes[key] = {
                        ...state.renderedOSMFeatureMeta.nodes[key],
                        ...newNodeData,
                    };
                    state.commitCounter++;
                }
            )),

            // 修改 way[id] 的方法
            modifyWayNoCommit: (idStr, newWayData) => set(produce(
                (state: DataState) => {
                    const key = String(idStr);
                    state.edit.ways[key] = {
                        ...state.edit.ways[key],
                        ...newWayData,
                    };
                    state.renderedOSMFeatureMeta.ways[key] = {
                        ...state.renderedOSMFeatureMeta.ways[key],
                        ...newWayData,
                    };
                    state.commitCounter++;
                }
            )),

            // 修改 relation[id] 的方法
            modifyRelationNoCommit: (idStr, newRelationData) => set(produce(
                (state: DataState) => {
                    const key = String(idStr);
                    state.edit.relations[key] = {
                        ...state.edit.relations[key],
                        ...newRelationData,
                    };
                    state.renderedOSMFeatureMeta.relations[key] = {
                        ...state.renderedOSMFeatureMeta.relations[key],
                        ...newRelationData,
                    };
                    state.commitCounter++;
                }
            )),
            PIXIPointMoveNoCommit: (idStr, location) => set(produce(
                (state: DataState) => {
                    const { nodes } = state.renderedOSMFeatureMeta;
                    const key = String(idStr);
                    nodes[key]["@_lat"] = location.lat
                    nodes[key]["@_lon"] = location.lon
                    const { nodes: nodesEdit } = state.edit;
                    if (Object.prototype.hasOwnProperty.call(nodesEdit, key)) {
                        nodesEdit[key]["@_lat"] = location.lat
                        nodesEdit[key]["@_lon"] = location.lon
                    } else {
                        nodesEdit[key] = nodes[key]
                    }
                    state.renderedOSMFeatureMeta.nodes = nodes
                    state.edit.nodes = nodesEdit
                }
            )),
            PIXIComponentSelectAction: (idStr, clear) => set(produce(
                (state: DataState) => {
                    if (clear) {
                        state.selectedComponent.forEach(id => {
                            state.renderedFeatureState[id].selected = false
                        })
                        if (state.renderedFeatureState[idStr].selected) {
                            state.selectedComponent = []
                        } else {
                            state.selectedComponent = [idStr]
                            state.renderedFeatureState[idStr].selected = true
                        }
                    } else if (!state.selectedComponent.includes(idStr)) {
                        state.selectedComponent = [idStr, ...state.selectedComponent]
                        state.renderedFeatureState[idStr].selected = true
                    } else {
                        state.selectedComponent = state.selectedComponent.filter(id => id !== idStr)
                        state.renderedFeatureState[idStr].selected = false
                    }
                    state.commitCounter++;
                })),
            PIXIComponentHoverNoCommit: (idStr, val) => set(produce((state: DataState) => { state.renderedFeatureState[idStr].hovered = val })),
            PIXIComponentVisibleNoCommit: (idStr, val) => set(produce((state: DataState) => { state.renderedFeatureState[idStr].visible = val })),
            viewpintMoveNoTrack: (viewpoint) => set(
                () => {
                    return {
                        viewpoint: viewpoint
                    }
                }
            ),
            zoomNoTrack: (zoom) => set(
                () => {
                    return {
                        zoom: zoom
                    }
                }
            ),
            stageResizeNoTrack: (stage) => set(() => { return { stage: stage } }),
        }), {

        partialize: (state) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { viewpoint, zoom, bboxs, ...tracked } = state;
            return tracked;
        },

        equality: (pastState, currentState) => {
            return pastState.commitCounter === currentState.commitCounter
        },
    }),
);

export default useBearStoreWithUndo;