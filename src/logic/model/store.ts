import { create } from "zustand";
import { temporal } from "zundo";
import { DEFAULT_VIEWPOINT_WGS84, DEFAULT_ZOOM } from "../../utils/geo/constants";
import { Collection, CollectionItem, DataState, FeatureState, FeatureTree, FeatureTreeNode, NodesObj, RelationsObj, Settings, WaysObj } from "./type";
import { Member, Nd, Node, OSMV06BBoxObj, Relation, Way } from "../../api/osm/type";
import { deepCopy, deepMerge, T2Arr, union } from "../../utils/helper/object";
import { produce } from "immer";
import { enableMapSet } from "immer";
import { filterBusPTv2, filterHighway } from "../../utils/osm/filter";
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
    const featureTree: FeatureTree = {
        elems: { nodes: {}, ways: {}, relations: {} },
        roots: { nodesID: new Set(), waysID: new Set(), relationsID: new Set() }
    }
    // step 1 elements
    Object.keys(nodes).forEach(nd =>
        featureTree.elems.nodes[nd] = {
            id: nd,
            type: "node",
            fathers: { nodesID: [], waysID: [], relationsID: [] },
            childs: { nodesID: [], waysID: [], relationsID: [] }
        }
    )
    Object.keys(ways).forEach(way =>
        featureTree.elems.ways[way] = {
            id: way,
            type: "way",
            fathers: { nodesID: [], waysID: [], relationsID: [] },
            childs: { nodesID: [], waysID: [], relationsID: [] }
        }
    )
    Object.keys(relations).forEach(rl =>
        featureTree.elems.relations[rl] = {
            id: rl,
            type: "relation",
            fathers: { nodesID: [], waysID: [], relationsID: [] },
            childs: { nodesID: [], waysID: [], relationsID: [] }
        }
    )
    // step 2 build tree
    Object.values(ways).forEach(way => {
        const cur = featureTree.elems.ways[way["@_id"]]
        if (!cur) {
            throw new Error(`${way["@_id"]} !`)
        }
        T2Arr(way.nd).forEach(nd => {
            const child = featureTree.elems.nodes[nd["@_ref"]]
            if (child) {
                child.fathers.waysID.push(cur.id)
                cur.childs.nodesID.push(child.id)
            }
        });
    })

    Object.values(relations).forEach(rl => {
        const cur = featureTree.elems.relations[rl["@_id"]]
        if (!cur) {
            throw new Error(`${rl["@_id"]} !`)
        }
        T2Arr(rl.member).forEach(mem => {
            const child = featureTree.elems[`${mem["@_type"]}s`][mem["@_ref"]]
            if (child) {
                child.fathers.relationsID.push(cur.id)
                cur.childs[`${mem["@_type"]}sID`].push(child.id)
            }
        });
    })
    // step 3 identify roots
    const faEmpty = (n: FeatureTreeNode) => 0 === (n.fathers.nodesID.length + n.fathers.waysID.length + n.fathers.relationsID.length)

    Object.values(featureTree.elems.nodes).forEach(node => {
        if (faEmpty(node)) {
            featureTree.roots.nodesID.add(node.id)
        }
    })
    Object.values(featureTree.elems.ways).forEach(way => {
        if (faEmpty(way)) {
            featureTree.roots.waysID.add(way.id)
        }
    })
    Object.values(featureTree.elems.relations).forEach(relation => {
        if (faEmpty(relation)) {
            featureTree.roots.relationsID.add(relation.id)
        }
    })

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

let newIdCounterNode = -1;

const CreateNodeMeta = (location: PointWGS84) => {
    const id = `${newIdCounterNode--}`;
    const newNode: Node = {
        "@_id": id,
        "@_lat": location.lat,
        "@_lon": location.lon,
        "@_visible": true,
    };
    return newNode
}

let newIdCounterWay = -1;

const createLocalWayMeta = (nodes: Nd[]) => {
    const id = `${newIdCounterWay--}`;
    const newWay: Way = {
        "@_id": id,
        nd: [...nodes],
        "@_visible": true,
    };
    return newWay
}

let newIdCounterRelation = -1;

const createLocalRelationMeta = (members: Member[]) => {
    const id = `${newIdCounterRelation--}`;
    const newRelation: Relation = {
        "@_id": id,
        member: [...members],
        "@_visible": true,
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
            deletedOSMFeatureMeta: {
                nodes: {},
                ways: {},
                relations: {},
            },
            renderedOSMFeatureMeta: {
                nodes: {},
                ways: {},
                relations: {},
            },
            renderedFeatureState: {
                nodes: {},
                ways: {},
                relations: {}
            },
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
                elems: {
                    nodes: {},
                    ways: {},
                    relations: {}
                },
                roots: {
                    nodesID: new Set(),
                    waysID: new Set(),
                    relationsID: new Set()
                }
            },
            settings: {
                osmAPI: {
                    BASEURL: 'https://api.openstreetmap.org',
                    TILE_SOURCE: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                },
                view: {
                    MAX_ZOOM: 19
                },
                pixiRender: {
                    zIndex: {
                        LINE: 10,
                        POINT: 20
                    }
                }
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
                            nodesId: union(pre.nodesId, cur.nodesId,),
                            waysId: union(pre.waysId, cur.waysId,),
                            relationsId: union(pre.relationsId, cur.relationsId,)
                        }), {
                        nodesId: new Set(Object.keys(state.deletedOSMFeatureMeta.nodes)),
                        waysId: new Set(Object.keys(state.deletedOSMFeatureMeta.ways)),
                        relationsId: new Set(Object.keys(state.deletedOSMFeatureMeta.relations))
                    })

                    // remove unused deatures and assign default states
                    const renderedFeatureState = state.renderedFeatureState
                    const removedNodes = new Set(addedNodes.filter(key => !totalFiltered.nodesId.has(key)))
                    const removedWays = new Set(addedWays.filter(key => !totalFiltered.waysId.has(key)))
                    const removedRelations = new Set(addedReations.filter(key => !totalFiltered.relationsId.has(key)))

                    const { nodes, ways, relations } = deepCopy(state.renderedOSMFeatureMeta);

                    T2Arr(bbox.osm.node).forEach(node => {
                        const key = node["@_id"];
                        if (!nodes[key] && !removedNodes.has(key)) {
                            nodes[key] = node
                            renderedFeatureState.nodes[key] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE)
                        }
                    })
                    T2Arr(bbox.osm.way).forEach(way => {
                        const key = way["@_id"]
                        if (!ways[key] && !removedWays.has(key)) {
                            ways[key] = way
                            renderedFeatureState.ways[key] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE)

                        }
                    })
                    T2Arr(bbox.osm.relation).forEach(relation => {
                        const key = relation["@_id"]
                        if (!relations[key] && !removedRelations.has(key)) {
                            relations[key] = relation
                            renderedFeatureState.relations[key] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE)
                        }
                    })


                    // commit to state
                    state.bboxs.push(bbox)
                    state.renderedOSMFeatureMeta = {
                        nodes: nodes,
                        ways: ways,
                        relations: relations,
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

                    state.renderedFeatureState.nodes[key] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE);
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

                    state.renderedFeatureState.ways[key] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE);

                    nodes.forEach(node => {
                        const key = node["@_id"]
                        if (state.renderedOSMFeatureMeta.nodes[key]) {
                            console.log(`node ${key} in way ${way["@_id"]} already exists`)
                            return;
                        }
                        state.renderedOSMFeatureMeta.nodes[key] = node;

                        state.renderedFeatureState.nodes[key] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE);
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

                    state.renderedFeatureState.relations[key] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE);
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
                    state.renderedOSMFeatureMeta.nodes[id] = newNode
                    state.renderedFeatureState.nodes[id] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE)

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
                    state.renderedOSMFeatureMeta.ways[id] = newWay
                    state.renderedFeatureState.ways[id] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE)

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
                    state.renderedOSMFeatureMeta.relations[id] = newRelation
                    state.renderedFeatureState.relations[id] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE)

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
                    state.renderedOSMFeatureMeta.nodes[key] = {
                        ...state.renderedOSMFeatureMeta.nodes[key],
                        ...newNodeData,
                        '@_action': 'modify'
                    };
                    state.collections = genCollection(state.renderedOSMFeatureMeta)
                    state.featureTree = genTree(state.renderedOSMFeatureMeta)
                }
            )),
            deleteNodeAction: (id: string) => set(produce((state: DataState) => {
                // no child to delete, delete node from fathers
                const { waysID, relationsID } = state.featureTree.elems.nodes[id].fathers
                waysID.forEach(wayID => {
                    const way = state.renderedOSMFeatureMeta.ways[wayID]
                    way.nd = T2Arr(way.nd).filter(nd => nd["@_ref"] !== id)
                    // if way have less then 2 nodes, delete this way
                    if (way.nd.length === 1) {
                        const { waysID, relationsID } = state.featureTree.elems.nodes[way.nd[0]["@_ref"]].fathers
                        if (waysID.length == 1 && relationsID.length == 0) {
                            // del
                            state.deletedOSMFeatureMeta.nodes[way.nd[0]["@_ref"]] = state.renderedOSMFeatureMeta.nodes[way.nd[0]["@_ref"]]
                            state.deletedOSMFeatureMeta.nodes[way.nd[0]["@_ref"]]["@_action"] = "delete"
                            delete state.renderedOSMFeatureMeta.nodes[way.nd[0]["@_ref"]]
                            delete state.renderedFeatureState.nodes[way.nd[0]["@_ref"]]
                        }
                        state.deletedOSMFeatureMeta.ways[wayID] = state.renderedOSMFeatureMeta.ways[wayID]
                        state.deletedOSMFeatureMeta.ways[wayID]["@_action"] = "delete"
                        delete state.renderedOSMFeatureMeta.ways[wayID]
                        delete state.renderedFeatureState.ways[wayID]
                    }
                    way["@_action"] = "modify"
                })
                relationsID.forEach(relationID => {
                    const faRelation = state.renderedOSMFeatureMeta.relations[relationID];
                    faRelation.member = T2Arr(faRelation.member)
                        .filter(m => !(m["@_type"] === "node" && m["@_ref"] === id))
                    faRelation["@_action"] = "modify"
                })

                // delete node
                state.deletedOSMFeatureMeta.nodes[id] = state.renderedOSMFeatureMeta.nodes[id]
                state.deletedOSMFeatureMeta.nodes[id]["@_action"] = "delete"
                delete state.renderedOSMFeatureMeta.nodes[id]
                delete state.renderedFeatureState.nodes[id]

                // rebuild tree and collection
                state.collections = genCollection(state.renderedOSMFeatureMeta);
                state.featureTree = genTree(state.renderedOSMFeatureMeta);

                // commit
                state.commitCounter++
            })),
            deleteWayAndSubNdAction: (id: string) => set(produce((state: DataState) => {
                // delete sub node excpect node have other fathers
                T2Arr(state.renderedOSMFeatureMeta.ways[id].nd).forEach(nd => {
                    const { waysID, relationsID } = state.featureTree.elems.nodes[nd["@_ref"]].fathers
                    if (waysID.length > 1 || relationsID.length > 0) {
                        return
                    }
                    state.deletedOSMFeatureMeta.nodes[nd["@_ref"]] = state.renderedOSMFeatureMeta.nodes[nd["@_ref"]]
                    state.deletedOSMFeatureMeta.nodes[nd["@_ref"]]["@_action"] = "delete"
                    delete state.renderedOSMFeatureMeta.nodes[nd["@_ref"]]
                    delete state.renderedFeatureState.nodes[nd["@_ref"]]
                })
                // delete way from fathers (relation)
                const { relationsID } = state.featureTree.elems.ways[id].fathers
                relationsID.forEach(relationID => {
                    const faRelation = state.renderedOSMFeatureMeta.relations[relationID];
                    faRelation.member = T2Arr(faRelation.member)
                        .filter(m => !(m["@_type"] === "way" && m["@_ref"] === id))
                    faRelation["@_action"] = "modify"
                })
                // delete way
                state.deletedOSMFeatureMeta.ways[id] = state.renderedOSMFeatureMeta.ways[id]
                state.deletedOSMFeatureMeta.ways[id]["@_action"] = "delete"
                delete state.renderedOSMFeatureMeta.ways[id]
                delete state.renderedFeatureState.ways[id]
                // rebuild tree
                state.collections = genCollection(state.renderedOSMFeatureMeta);
                state.featureTree = genTree(state.renderedOSMFeatureMeta);

                state.commitCounter++
            })),
            deleteRelationAction: (id: string) => set(produce((state: DataState) => {
                // no need to delete child, only delete from father
                const { relationsID } = state.featureTree.elems.relations[id].fathers
                relationsID.forEach(relationID => {
                    const faRelation = state.renderedOSMFeatureMeta.relations[relationID];
                    faRelation.member = T2Arr(faRelation.member)
                        .filter(m => !(m["@_type"] === "relation" && m["@_ref"] === id))
                    faRelation["@_action"] = "modify"
                })
                // delete self
                state.deletedOSMFeatureMeta.relations[id] = state.renderedOSMFeatureMeta.relations[id]
                state.deletedOSMFeatureMeta.relations[id]["@_action"] = "delete"
                delete state.renderedOSMFeatureMeta.relations[id]
                delete state.renderedFeatureState.relations[id]
                // rebuild tree
                state.collections = genCollection(state.renderedOSMFeatureMeta);
                state.featureTree = genTree(state.renderedOSMFeatureMeta);

                state.commitCounter++
            })),

            // 修改 way[id] 的方法
            modifyWayNoCommit: (idStr, newWayData) => set(produce(
                (state: DataState) => {
                    const key = idStr;
                    state.renderedOSMFeatureMeta.ways[key] = {
                        ...state.renderedOSMFeatureMeta.ways[key],
                        ...newWayData,
                        '@_action': 'modify'
                    };
                    state.collections = genCollection(state.renderedOSMFeatureMeta)
                    state.featureTree = genTree(state.renderedOSMFeatureMeta)
                }
            )),

            // 修改 relation[id] 的方法
            modifyRelationNoCommit: (idStr, newRelationData) => set(produce(
                (state: DataState) => {
                    const key = idStr
                    state.renderedOSMFeatureMeta.relations[key] = {
                        ...state.renderedOSMFeatureMeta.relations[key],
                        ...newRelationData,
                        '@_action': 'modify'
                    };
                    state.collections = genCollection(state.renderedOSMFeatureMeta)
                    state.featureTree = genTree(state.renderedOSMFeatureMeta)
                }
            )),

            splitWayAction: (node: Node) => set(produce((state: DataState) => {
                const faWays = state.featureTree.elems.nodes[node["@_id"]].fathers.waysID
                    .map(faWayId => state.renderedOSMFeatureMeta.ways[faWayId])

                faWays?.forEach(way => { // split way
                    const nds = T2Arr(way.nd)
                    const idx = nds.findIndex(nd => nd["@_ref"] === node["@_id"])
                    if (idx !== 0 && idx !== nds.length - 1) { // not head or tail
                        if (idx === -1) { throw new Error(`way ${way} must contain node ${node}, the feature tree is broken.`) }
                        const newNds = nds.slice(idx)
                        way.nd = nds.slice(0, idx + 1) // modify old
                        way["@_action"] = 'modify'

                        const newWay = createLocalWayMeta(newNds) // create new
                        newWay.tag = deepCopy(way.tag)
                        state.renderedOSMFeatureMeta.ways[newWay["@_id"]] = newWay
                        state.renderedFeatureState.ways[newWay["@_id"]] = deepCopy(DEFAULT_RENDERED_FEATURE_STATE)

                        // append new way to related relation
                        const faRelationOfWay = state.featureTree.elems.ways[way["@_id"]].fathers.relationsID
                            .map(fa => state.renderedOSMFeatureMeta.relations[fa])

                        faRelationOfWay?.forEach(relation => {
                            const members = T2Arr(relation.member)
                            const idx = members.findIndex(m => m["@_ref"] === way["@_id"])
                            if (idx === -1) { throw new Error(`relation ${relation} must contain way ${way}, the feature tree is broken.`) }
                            members.splice(idx + 1, 0, { "@_ref": newWay["@_id"], "@_type": "way", "@_role": members[idx]["@_role"] })
                            relation.member = members
                            relation["@_action"] = "modify"
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
                    nodes[key]["@_action"] = "modify"
                    state.renderedOSMFeatureMeta.nodes = nodes
                }
            )),
            PIXIComponentSelectAction: (type, idStr, clear) => set(produce(
                (state: DataState) => {
                    if (clear) {
                        state.selectedComponent.forEach(item => {
                            state.renderedFeatureState[`${item.type}s`][item.id].selected = false
                        })
                        if (state.renderedFeatureState[`${type}s`][idStr].selected) {
                            state.selectedComponent = []
                            state.renderedFeatureState[`${type}s`][idStr].selected = false
                        } else {
                            state.selectedComponent = [{ type: type, id: idStr }]
                            state.renderedFeatureState[`${type}s`][idStr].selected = true
                        }
                    } else if (!state.selectedComponent.some(item => item.id === idStr && item.type === type)) {
                        state.selectedComponent = [...state.selectedComponent, { type: type, id: idStr }]
                        state.renderedFeatureState[`${type}s`][idStr].selected = true
                    } else {
                        state.selectedComponent = state.selectedComponent.filter(item => item.id === idStr && item.type === type)
                        state.renderedFeatureState[`${type}s`][idStr].selected = false
                    }
                    state.commitCounter++;
                })),
            PIXIComponentSelectClearAction: () => set(produce((state: DataState) => {
                state.selectedComponent.forEach(item => {
                    state.renderedFeatureState[`${item.type}s`][item.id].selected = false
                })
                state.selectedComponent = []
                state.commitCounter++
            })),
            PIXIComponentHoverNoCommit: (type, idStr, val) => set(produce((state: DataState) => { state.renderedFeatureState[`${type}s`][idStr].hovered = val })),
            PIXIComponentVisibleNoCommit: (type, idStr, val) => set(produce((state: DataState) => { state.renderedFeatureState[`${type}s`][idStr].visible = val })),
            updateSettingsAction: (newSettings: Partial<Settings>) => {
                set(produce((state: DataState) => {
                    // Deep merge new settings with the current settings
                    deepMerge(state.settings, newSettings);
                }));
            },
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