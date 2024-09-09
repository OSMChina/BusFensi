import { create } from "zustand";
import { temporal } from "zundo";
import { DEFAULT_VIEWPOINT_WGS84, DEFAULT_ZOOM } from "../../utils/geo/constants";
import { Collection, CollectionItem, DataState, FeatureState, FeatureTree, NodesObj, RelationsObj, WaysObj } from "./type";
import { Member, Node, OSMV06BBoxObj, Relation, Way } from "../../api/osm/type";
import { deepCopy, T2Arr, union } from "../../utils/helper/object";
import { produce } from "immer";
import { enableMapSet } from "immer";
import { filterBusPTv2, filterHighway } from "../../utils/osm/busFilter";
import { PointWGS84 } from "../../utils/geo/types";

const DEFAULT_RENDERED_FEATURE_STATE: FeatureState = {
    visible: true,
    selected: false,
    highlighted: false,
    active: false,
    hovered: false
}

const genTree = (
    renderedOSMFeatureMeta: {
        nodes: NodesObj,
        ways: WaysObj,
        relations: RelationsObj,
    }
): FeatureTree => {
    const { nodes, ways, relations } = renderedOSMFeatureMeta
    const featureTree: FeatureTree = { elems: new Map(), roots: new Set() }
    // step 1 elements
    Object.keys(nodes).forEach(nd => featureTree.elems.set(nd, { id: nd, type: "node", fathers: [], childs: [] }))
    Object.keys(ways).forEach(way => featureTree.elems.set(way, { id: way, type: "way", fathers: [], childs: [] }))
    Object.keys(relations).forEach(rl => featureTree.elems.set(rl, { id: rl, type: "relation", fathers: [], childs: [] }))
    // step 2 build tree
    Object.values(ways).forEach(way => {
        const cur = featureTree.elems.get(way["@_id"])
        if (!cur) {
            throw new Error(`${way["@_id"]} !`)
        }
        T2Arr(way.nd).forEach(nd => {
            const child = featureTree.elems.get(nd["@_ref"])
            if (child) {
                child.fathers.push(cur.id)
                cur.childs.push(child.id)
            }
        });
    })

    Object.values(relations).forEach(rl => {
        const cur = featureTree.elems.get(rl["@_id"])
        if (!cur) {
            throw new Error(`${rl["@_id"]} !`)
        }
        T2Arr(rl.member).forEach(mem => {
            const child = featureTree.elems.get(mem["@_ref"])
            if (child) {
                child.fathers.push(cur.id)
                cur.childs.push(child.id)
            }
        });
    })
    // step 3 identify roots

    featureTree.elems.forEach((element, id) => {
        if (element.fathers.length === 0) {
            featureTree.roots.add(id);
        }
    });

    return featureTree
};

const genCollection = (osmFeatureMeta: {
    nodes: NodesObj,
    ways: WaysObj,
    relations: RelationsObj,
}): Collection => {
    const unionCollection = (...iterable: CollectionItem[]): CollectionItem => ({
        nodesId: union(...iterable.map(col => col.nodesId)),
        waysId: union(...iterable.map(col => col.waysId)),
        relationsId: union(...iterable.map(col => col.relationsId)),
    })

    const { nodes, ways, relations } = osmFeatureMeta
    const ptv2 = filterBusPTv2(nodes, ways, relations)
    const highway = filterHighway(nodes, ways, relations)

    return {
        ptv2: ptv2,
        highway: highway,
        global: unionCollection(ptv2, highway)
    }
}

const CreateNodeMeta = (location: PointWGS84) => {
    const id = `local-${Date.now()}`;
    const newNode: Node = {
        "@_id": id,
        "@_lat": location.lat,
        "@_lon": location.lon,
        "@_visible": true,
        "@_version": 'local',
        "@_changeset": 'local',
        "@_timestamp": 'local',
        "@_user": 'local',
        "@_uid": 'local'
    };
    return newNode
}

const createLocalWayMeta = (nodes: Node[]) => {
    const id = `local-${Date.now()}`;
    const newWay: Way = {
        "@_id": id,
        nd: nodes.map((node) => ({ "@_ref": node["@_id"] })),
        "@_visible": true,
        "@_version": 'local',
        "@_changeset": 'local',
        "@_timestamp": 'local',
        "@_user": 'local',
        "@_uid": 'local'
    };
    return newWay
}

const createLocalRelationMeta = (members: Member[]) => {
    const id = `local-${Date.now()}`;
    const newRelation: Relation = {
        "@_id": id,
        member: members,
        "@_visible": true,
        "@_version": '',
        "@_changeset": '',
        "@_timestamp": '',
        "@_user": '',
        "@_uid": ''
    };
    return newRelation
}

enableMapSet();
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
                height: 0,
                cursor: 'default'
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
            featureTree: {
                elems: new Map(),
                roots: new Set()
            },
            commitAction: () => set(
                (state) => ({
                    commitCounter: state.commitCounter + 1
                })
            ),
            OSMLoadedBboxAction: (bbox: OSMV06BBoxObj) => set(produce(
                (state: DataState) => {
                    // preload
                    const { nodes: nodesTmp, ways: waysTmp, relations: relationsTmp } = deepCopy(state.renderedOSMFeatureMeta);
                    const addedNodes: string[] = [],
                        addedWays: string[] = [],
                        addedReations: string[] = []
                    T2Arr(bbox.osm.node).forEach(node => {
                        const key: string = node["@_id"];
                        if (!nodesTmp[key]) {
                            nodesTmp[key] = node
                            addedNodes.push(key)
                        }
                    })
                    T2Arr(bbox.osm.way).forEach(way => {
                        const key = way["@_id"];
                        if (!waysTmp[key]) {
                            waysTmp[key] = way
                            addedWays.push(key)
                        }
                    })
                    T2Arr(bbox.osm.relation).forEach(relation => {
                        const key = relation["@_id"];
                        if (!relationsTmp[key]) {
                            relationsTmp[key] = relation
                            addedReations.push(key)
                        }
                    })

                    // filter
                    const collections = genCollection({ nodes: nodesTmp, ways: waysTmp, relations: relationsTmp })

                    const totalFiltered: CollectionItem = Object.values(collections).reduce(
                        (pre: CollectionItem, cur: CollectionItem): CollectionItem => ({
                            nodesId: union(pre.nodesId, cur.nodesId),
                            waysId: union(pre.waysId, cur.waysId),
                            relationsId: union(pre.relationsId, cur.relationsId)
                        }), {
                        nodesId: new Set(),
                        waysId: new Set(),
                        relationsId: new Set()
                    })

                    // remove unused deatures and assign default states
                    const renderedFeatureState = state.renderedFeatureState
                    const removedNodes = new Set(addedNodes.filter(key => !totalFiltered.nodesId.has(key)))
                    const removedWays = new Set(addedWays.filter(key => !totalFiltered.waysId.has(key)))
                    const removedRelations = new Set(addedReations.filter(key => !totalFiltered.relationsId.has(key)))

                    const { nodes, ways, relations, id2type } = deepCopy(state.renderedOSMFeatureMeta);

                    T2Arr(bbox.osm.node).forEach(node => {
                        const key = node["@_id"];
                        if (!nodes[key] && !removedNodes.has(key)) {
                            nodes[key] = node
                            id2type[key] = "node"
                            renderedFeatureState[key] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE)
                        }
                    })
                    T2Arr(bbox.osm.way).forEach(way => {
                        const key = way["@_id"]
                        if (!ways[key] && !removedWays.has(key)) {
                            ways[key] = way
                            id2type[key] = "way"
                            renderedFeatureState[key] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE)

                        }
                    })
                    T2Arr(bbox.osm.relation).forEach(relation => {
                        const key = relation["@_id"]
                        if (!relations[key] && !removedRelations.has(key)) {
                            relations[key] = relation
                            id2type[key] = "relation"
                            renderedFeatureState[key] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE)
                        }
                    })


                    // commit to state
                    state.bboxs.push(bbox)
                    state.renderedOSMFeatureMeta = {
                        nodes: nodes,
                        ways: ways,
                        relations: relations,
                        id2type: id2type
                    }
                    state.renderedFeatureState = renderedFeatureState
                    state.collections = genCollection(state.renderedOSMFeatureMeta)
                    state.featureTree = genTree(state.renderedOSMFeatureMeta)
                    state.commitCounter += 1
                })
            ),

            addNodeAction: (node) => set(produce(
                (state: DataState) => {
                    const key = node["@_id"];
                    if (state.renderedOSMFeatureMeta.nodes[key]) {
                        throw new Error(`way ${key} already exists`)
                    }
                    state.renderedOSMFeatureMeta.nodes[key] = node;
                    state.renderedOSMFeatureMeta.id2type[key] = 'node'

                    state.renderedFeatureState[key] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE);
                    state.collections = genCollection(state.renderedOSMFeatureMeta);
                    state.featureTree = genTree(state.renderedOSMFeatureMeta);
                    state.commitCounter++;
                }
            )),

            addWayAction: (way, nodes) => set(produce(
                (state: DataState) => {
                    const key = way["@_id"];
                    if (state.renderedOSMFeatureMeta.ways[key]) {
                        throw new Error(`way ${key} already exists`)
                    }
                    state.renderedOSMFeatureMeta.ways[key] = way;
                    state.renderedOSMFeatureMeta.id2type[key] = 'way'

                    state.renderedFeatureState[key] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE);

                    nodes.forEach(node => {
                        const key = node["@_id"]
                        if (state.renderedOSMFeatureMeta.nodes[key]) {
                            console.log(`node ${key} in way ${way["@_id"]} already exists`)
                            return;
                        }
                        state.renderedOSMFeatureMeta.nodes[key] = node;
                        state.renderedOSMFeatureMeta.id2type[key] = 'node'

                        state.renderedFeatureState[key] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE);
                    })

                    state.collections = genCollection(state.renderedOSMFeatureMeta);
                    state.featureTree = genTree(state.renderedOSMFeatureMeta);
                    state.commitCounter++;
                }
            )),

            addRelationAction: (relation) => set(produce(
                (state: DataState) => {
                    const key = relation["@_id"];
                    if (state.renderedOSMFeatureMeta.relations[key]) {
                        throw new Error(`relation ${key} already exists`)
                    }
                    state.renderedOSMFeatureMeta.relations[key] = relation;
                    state.renderedOSMFeatureMeta.id2type[key] = 'relation'

                    state.renderedFeatureState[key] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE);
                    state.collections = genCollection(state.renderedOSMFeatureMeta);
                    state.featureTree = genTree(state.renderedOSMFeatureMeta);
                    state.commitCounter++;
                }
            )),

            // Action to create a local node
            createLocalNodeAction: (location) => {
                const newNode = CreateNodeMeta(location)
                const id = newNode["@_id"]

                set(produce((state: DataState) => {
                    state.edit.nodes[id] = newNode
                    state.renderedOSMFeatureMeta.nodes[id] = newNode
                    state.renderedOSMFeatureMeta.id2type[id] = 'node'
                    state.renderedFeatureState[id] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE)

                    state.collections = genCollection(state.renderedOSMFeatureMeta);
                    state.featureTree = genTree(state.renderedOSMFeatureMeta);

                    state.commitCounter++
                }));
                return id
            },

            // Action to create a local way
            createLocalWayAction: (nodes) => {
                const newWay = createLocalWayMeta(nodes)
                const id = newWay["@_id"]
                set(produce((state: DataState) => {
                    state.edit.ways[id] = newWay
                    state.renderedOSMFeatureMeta.ways[id] = newWay
                    state.renderedOSMFeatureMeta.id2type[id] = 'way'
                    state.renderedFeatureState[id] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE)

                    state.collections = genCollection(state.renderedOSMFeatureMeta);
                    state.featureTree = genTree(state.renderedOSMFeatureMeta);

                    state.commitCounter++
                }));
                return id
            },

            // Action to create a local relation
            createLocalRelationAction: (members) => {
                const newRelation = createLocalRelationMeta(members)
                const id = newRelation["@_id"]
                set(produce((state: DataState) => {
                    state.edit.relations[id] = newRelation
                    state.renderedOSMFeatureMeta.relations[id] = newRelation
                    state.renderedOSMFeatureMeta.id2type[id] = 'relation'
                    state.renderedFeatureState[id] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE)

                    state.collections = genCollection(state.renderedOSMFeatureMeta);
                    state.featureTree = genTree(state.renderedOSMFeatureMeta);

                    state.commitCounter++
                }));
                return id
            },

            // 修改 node[id] 的方法
            modifyNodeNoCommit: (idStr, newNodeData) => set(produce(
                (state: DataState) => {
                    const key = idStr
                    state.edit.nodes[key] = {
                        ...state.edit.nodes[key],
                        ...newNodeData,
                    };
                    state.renderedOSMFeatureMeta.nodes[key] = {
                        ...state.renderedOSMFeatureMeta.nodes[key],
                        ...newNodeData,
                    };
                    state.collections = genCollection(state.renderedOSMFeatureMeta)
                    state.featureTree = genTree(state.renderedOSMFeatureMeta)
                }
            )),

            // 修改 way[id] 的方法
            modifyWayNoCommit: (idStr, newWayData) => set(produce(
                (state: DataState) => {
                    const key = idStr;
                    state.edit.ways[key] = {
                        ...state.edit.ways[key],
                        ...newWayData,
                    };
                    state.renderedOSMFeatureMeta.ways[key] = {
                        ...state.renderedOSMFeatureMeta.ways[key],
                        ...newWayData,
                    };
                    state.collections = genCollection(state.renderedOSMFeatureMeta)
                    state.featureTree = genTree(state.renderedOSMFeatureMeta)
                }
            )),

            // 修改 relation[id] 的方法
            modifyRelationNoCommit: (idStr, newRelationData) => set(produce(
                (state: DataState) => {
                    const key = idStr
                    state.edit.relations[key] = {
                        ...state.edit.relations[key],
                        ...newRelationData,
                    };
                    state.renderedOSMFeatureMeta.relations[key] = {
                        ...state.renderedOSMFeatureMeta.relations[key],
                        ...newRelationData,
                    };
                    state.collections = genCollection(state.renderedOSMFeatureMeta)
                    state.featureTree = genTree(state.renderedOSMFeatureMeta)
                }
            )),

            splitWayAction: (node: Node) => set(produce((state: DataState) => {
                const faWays = state.featureTree.elems
                    .get(node["@_id"])?.fathers
                    .filter(fa => "way" === state.renderedOSMFeatureMeta.id2type[fa])
                    .map(fa => state.renderedOSMFeatureMeta.ways[fa])

                faWays?.forEach(way => { // split way
                    const nds = T2Arr(way.nd)
                    const idx = nds.findIndex(nd => nd["@_ref"] === node["@_id"])
                    if (idx !== 0 && idx !== nds.length - 1) { // not head or tail
                        if (idx === -1) { throw new Error(`way ${way} must contain node ${node}, the feature tree is broken.`) }
                        const newNds = nds.slice(idx).map(nd => state.renderedOSMFeatureMeta.nodes[nd["@_ref"]])
                        way.nd = nds.slice(0, idx + 1) // modify old

                        const newWay = createLocalWayMeta(newNds) // create new
                        newWay.tag = deepCopy(way.tag)
                        state.edit.ways[newWay["@_id"]] = newWay
                        state.renderedOSMFeatureMeta.ways[newWay["@_id"]] = newWay
                        state.renderedOSMFeatureMeta.id2type[newWay["@_id"]] = 'way'
                        state.renderedFeatureState[newWay["@_id"]] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE)

                        // append new way to related relation
                        const faRelationOfWay = state.featureTree.elems
                            .get(way["@_id"])?.fathers
                            .filter(fa => "relation" === state.renderedOSMFeatureMeta.id2type[fa])
                            .map(fa => state.renderedOSMFeatureMeta.relations[fa])

                        faRelationOfWay?.forEach(relation => {
                            const members = T2Arr(relation.member)
                            const idx = members.findIndex(m => m["@_ref"] === way["@_id"])
                            if (idx === -1) { throw new Error(`relation ${relation} must contain way ${way}, the feature tree is broken.`) }
                            members.splice(idx + 1, 0, { "@_ref": newWay["@_id"], "@_type": "way", "@_role": members[idx]["@_role"] })
                            relation.member = members
                        })
                    }
                })
                state.collections = genCollection(state.renderedOSMFeatureMeta)
                state.featureTree = genTree(state.renderedOSMFeatureMeta)
                state.commitCounter++;
            })),

            PIXIPointMoveNoCommit: (idStr, location) => set(produce(
                (state: DataState) => {
                    const { nodes } = state.renderedOSMFeatureMeta;
                    const key = idStr
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
            stageStateNoTrack: (stage) => set((state) => ({ stage: { ...state.stage, ...stage } })),
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