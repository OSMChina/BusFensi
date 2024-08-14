import { Node, OSMV06BBoxObj, Relation, Way } from "../../api/osm/type"
import { PointWGS84 } from "../../utils/geo/types"

export interface FeatureState {
    visible: boolean
    active: boolean
    selected: boolean
    hovered: boolean
    highlighted: boolean
}

export interface DataState {
    /** changes be tracked by zundo */
    /** commit counter */
    commitCounter: number
    /** changeset of editor */
    edit: {
        nodes: {
            [id: string]: Node
        }
        ways: {
            [id: string]: Way
        }
        relations: {
            [id: string]: Relation
        }
    },
    selectedComponent: string[]
    /** rendered osm features meta, */
    renderedOSMFeatureMeta: {
        nodes: {
            [id: string]: Node
        }
        ways: {
            [id: string]: Way
        }
        relations: {
            [id: string]: Relation
        }
    }
    renderedFeatureState: {
        [id: string]: FeatureState
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
    PIXIPointMoveNoCommit: (idStr: string, location: PointWGS84) => void
    PIXIPointSelectAction: (idStr: string, clear: boolean) => void
    PIXIComponentHoverNoCommit: (idStr: string, val: boolean) => void
    PIXIComponentVisibleNoCommit: (idStr: string, val: boolean) => void
    viewpintMoveNoTrack: (viewpoint: PointWGS84) => void
    zoomNoTrack: (zoom: number) => void
    stageResizeNoTrack: (stage: { width: number, height: number }) => void
}

export type PartializedStoreState = Pick<DataState, "edit" | "selectedComponent" | "commitCounter" | "renderedOSMFeatures">;
