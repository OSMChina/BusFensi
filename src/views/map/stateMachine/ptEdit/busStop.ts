import { getFeatureInBound } from "../../../../store/osmmeta/selector";
import { BaseContext, StoreType } from "../../../../type/stateMachine/baseEvent";
import { FeatureClassifyFun, PtEditEvents, PtEditRightClickMenus } from "../../../../type/stateMachine/ptEdit";
import { getBoundsByRect } from "../../../../utils/geo/mapProjection";
import { isBusStop, isStopPosition } from "../../../../utils/osm/nodeType";
import { BatchSelectStateMachine } from "../slice/components/BatchSelectStateMachine";
import { getLocalPosistion } from "../slice/components/helper";
import { MapViewStateMachine } from "../slice/map/MapViewStateMachine";
import { UndoRedoStateMachine } from "../slice/util/UndoRedoStateMachine";
import { BaseStateMachine, StateItem } from "../state";
import { BusTabComponentStateMachine } from "./slice/BusTabComponent";

type BaseMachine = BaseStateMachine<PtEditEvents, BaseContext>
export class PtEditStateMachine extends BaseStateMachine<PtEditEvents, BaseContext> {
    idle: StateItem<PtEditEvents>
    mapViewSubMachine: BaseMachine
    busStopEditSubMachine: BaseMachine
    undoRedo: BaseMachine
    batchSelect: BaseMachine
    private menus: PtEditRightClickMenus
    constructor(store: StoreType, menus: PtEditRightClickMenus) {
        super(store)

        this.menus = menus

        const hoverable: FeatureClassifyFun = (target) => {
            return target.type === "way" || target.type === "node"
        }

        const clickable: FeatureClassifyFun = (target) => {
            return target.type === "way" || target.type === "node"
        }

        const dragable: FeatureClassifyFun = (target, context) => {
            const tags = context.store.meta.getState().meta[target.type][target.id].tag || []
            return target.type === "node" && (isBusStop(tags)
                || isStopPosition(tags))
        }

        const selectable: FeatureClassifyFun = (target) => {
            return target.type === "node"
        }


        this.idle = new StateItem('pt-edit-idle')
        this.mapViewSubMachine = new MapViewStateMachine(store, {
            rightClickHandeler: (event) => {
                this.menus.busStop({ ...getLocalPosistion(event.clientX, event.clientY, this.context), open: true })
                this.menus.stopPosition({ x: 0, y: 0, open: false })
            }
        })
        this.busStopEditSubMachine = new BusTabComponentStateMachine(store, {
            onRightClick: (target, event) => {
                this.menus.stopPosition({ ...getLocalPosistion(event.clientX, event.clientY, this.context), feature: target, open: true })
            },
            hoverable,
            clickable,
            dragable,
            selectable
        })
        this.undoRedo = new UndoRedoStateMachine(store)
        this.batchSelect = new BatchSelectStateMachine(store, {
            onSelectRect: (rect, event) => {
                const { viewpoint, zoom, width, height } = this.context.store.view.getState()
                const bounds = getBoundsByRect(viewpoint, zoom, width!, height!, rect);
                const osmmeta = this.context.store.meta.getState()
                const featuregroup = getFeatureInBound(bounds)(osmmeta)
                console.debug("get feature group ", featuregroup)
                if (!event.ctrlKey) {
                    osmmeta.clearSelect()
                }
                Object.entries(featuregroup.node)
                    .filter(([, n]) => selectable({ id: n["@_id"], type: "node" }, this.context))
                    .forEach(([, n]) => osmmeta.selectFeature("node", n["@_id"], false))
            }
        })

        this.entry = this.idle
        this.current = this.idle
        this.accept = [this.idle]

        this.idle.appendNext(this.mapViewSubMachine, { isEpsilon: true })
        this.idle.appendNext(this.busStopEditSubMachine, { isEpsilon: true })
        this.idle.appendNext(this.undoRedo, { isEpsilon: true })
        this.idle.appendNext(this.batchSelect, { isEpsilon: true })

        this.mapViewSubMachine.appendNext(this.idle, { isEpsilon: true })
        this.busStopEditSubMachine.appendNext(this.idle, { isEpsilon: true })
        this.undoRedo.appendNext(this.idle, { isEpsilon: true })
        this.batchSelect.appendNext(this.idle, { isEpsilon: true })
    }

    transform(event: PtEditEvents): void {
        if (event.type === "mousedown") {
            this.menus.busStop({ x: 0, y: 0, open: false })
            this.menus.stopPosition({ x: 0, y: 0, open: false })
        }
        super.transform(event)
    }
}