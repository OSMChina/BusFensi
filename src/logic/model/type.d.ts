import { Node, OSMV06BBoxObj, Relation, Way } from "../../api/osm/type"
import { PointWGS84 } from "../../utils/geo/types"

export interface FeatureState {
    visible: boolean
    active: boolean
    selected: boolean
    hovered: boolean
    highlighted: boolean
}

export interface NodesObj {
    [id: string]: Node
}

export interface WaysObj {
    [id: string]: Way
}

export interface RelationsObj {
    [id: string]: Relation
}


export interface FeatureTreeNode {
    id: string
    type: "node" | "way" | "relation"
    fathers: string[]
    /** must in order, may includes non-exsist */
    childs: string[]
}

export interface FeatureTree {
    elems: Map<string, FeatureTreeNode>
    roots: Set<string>
}

/**
 * Collection is a collection of osm feature ids.
 * 
 * when data loaded, the meta stored in renderedOSMFeatureMeta,
 * and the tree relationship between features will be maintained
 * in feature relation tree
 * 
 */
export interface CollectionItem {
    nodesId: Set<string>
    waysId: Set<string>
    relationsId: Set<string>
}

export interface Collection {
    ptv2: CollectionItem
    highway: CollectionItem
    global: CollectionItem
}

interface StageState {
    width: number,
    height: number,
    cursor: string
}

export interface DataState {
    /** changes be tracked by zundo */
    /** commit counter */
    commitCounter: number
    /** changeset of editor */
    edit: {
        nodes: NodesObj
        ways: WaysObj
        relations: RelationsObj
    },
    selectedComponent: string[]
    /** rendered osm features meta, */
    renderedOSMFeatureMeta: {
        nodes: NodesObj
        ways: WaysObj
        relations: RelationsObj
        id2type: {
            [id: string]: "node" | "way" | "relation"
        }
    }
    renderedFeatureState: {
        [id: string]: FeatureState
    }
    collections: Collection
    featureTree: FeatureTree
    /** local changes like viewpoint, won't be tracked by zundo */
    viewpoint: PointWGS84
    zoom: number
    bboxs: Array<OSMV06BBoxObj>
    stage: StageState,
    /**
     * All actions commits. commit means track state with zundo, allow undo/redo.
     * Some set don't commit, just temporary. need commit after stable
     * Some set only change untracked, like viewpoint and zoom
     */
    commitAction: () => void

    OSMLoadedBboxAction: (bbox: OSMV06BBoxObj) => void
    addNodeAction: (node: Node) => void
    addWayAction: (way: Way, nodes: Node[]) => void
    addRelationAction: (relation: Relation) => void
    createLocalNodeAction: (location: PointWGS84) => string;
    createLocalWayAction: (nodes: Node[]) => string;
    createLocalRelationAction: (members: Member[]) => string;
    modifyNodeNoCommit: (idStr: string, newNodeData: Partial<Node>) => void;
    modifyWayNoCommit: ( idStr:string, newWayData: Partial<Way>) => void;
    modifyRelationNoCommit: (idStr: string, newRelationData: Partial<Relation>) => void;
    splitWayAction: (node: Node) => void

    PIXIPointMoveNoCommit: (idStr: string, location: PointWGS84) => void
    PIXIComponentSelectAction: (idStr: string, clear: boolean) => void
    PIXIComponentHoverNoCommit: (idStr: string, val: boolean) => void
    PIXIComponentVisibleNoCommit: (idStr: string, val: boolean) => void
    viewpintMoveNoTrack: (viewpoint: PointWGS84) => void
    zoomNoTrack: (zoom: number) => void
    stageStateNoTrack: (stage: Partial<StageState>) => void
}

export type PartializedStoreState = Pick<DataState, "edit" | "selectedComponent" | "commitCounter" | "renderedOSMFeatures">;
