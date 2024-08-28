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


interface FeatureTreeNode {
    id: string
    type: "node" | "way" | "relation"
    father?: CollectionTreeNode
    childs?: CollectionTreeNode[]
}
/**
 * Collection is a collection of osm feature ids.
 * 
 * when data loaded, the meta stored in renderedOSMFeatureMeta,
 * and the tree relationship between features will be maintained
 * in feature relation tree
 * 
 */
interface Collection {
    nodesId: Set<string>
    waysId: Set<string>
    relationsId: Set<string>
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
    collections: {
        ptv2: Collection
        highway: Collection
        global: Collection
    }
    /** local changes like viewpoint, won't be tracked by zundo */
    viewpoint: PointWGS84
    zoom: number
    bboxs: Array<OSMV06BBoxObj>
    stage: {
        width: number,
        height: number
    },
    /**
     * All actions commits. commit means track state with zundo, allow undo/redo.
     * Some set don't commit, just temporary. need commit after stable
     * Some set only change untracked, like viewpoint and zoom
     */
    commitAction: () => void
    OSMLoadedDataAction: (bbox: OSMV06BBoxObj) => void
    modifyNodeNoCommit: (idStr: string, newNodeData: Partial<Node>) => void;
    modifyWayNoCommit: (idStr: string, newWayData: Partial<Way>) => void;
    modifyRelationNoCommit: (idStr: string, newRelationData: Partial<Relation>) => void;

    PIXIPointMoveNoCommit: (idStr: string, location: PointWGS84) => void
    PIXIComponentSelectAction: (idStr: string, clear: boolean) => void
    PIXIComponentHoverNoCommit: (idStr: string, val: boolean) => void
    PIXIComponentVisibleNoCommit: (idStr: string, val: boolean) => void
    viewpintMoveNoTrack: (viewpoint: PointWGS84) => void
    zoomNoTrack: (zoom: number) => void
    stageResizeNoTrack: (stage: { width: number, height: number }) => void
}

export type PartializedStoreState = Pick<DataState, "edit" | "selectedComponent" | "commitCounter" | "renderedOSMFeatures">;
