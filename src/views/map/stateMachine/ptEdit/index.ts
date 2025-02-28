import { BaseContext, StoreType } from "../../../../type/stateMachine/baseEvent";
import { PtEditEvents, PtEditRightClickMenus } from "../../../../type/stateMachine/ptEdit";
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
    private menus: PtEditRightClickMenus
    constructor(store: StoreType, menus: PtEditRightClickMenus) {
        super(store)

        this.menus = menus

        this.idle = new StateItem('pt-edit-idle')
        this.mapViewSubMachine = new MapViewStateMachine(store, {
            rightClickHandeler: (event) => {
                menus.busStop({ ...getLocalPosistion(event.clientX, event.clientY, this.context), open: true })
                menus.stopPosition({ x: 0, y: 0, open: false })
            }
        })
        this.busStopEditSubMachine = new BusTabComponentStateMachine(store, menus)
        this.undoRedo = new UndoRedoStateMachine(store)

        this.entry = this.idle
        this.current = this.idle
        this.accept = [this.idle]

        this.idle.appendNext(this.mapViewSubMachine, { isEpsilon: true })
        this.idle.appendNext(this.busStopEditSubMachine, { isEpsilon: true })
        this.idle.appendNext(this.undoRedo, { isEpsilon: true })

        this.mapViewSubMachine.appendNext(this.idle, { isEpsilon: true })
        this.busStopEditSubMachine.appendNext(this.idle, { isEpsilon: true })
        this.undoRedo.appendNext(this.idle, { isEpsilon: true })
    }

    transform(event: PtEditEvents): void {
        if (event.type === "mousedown") {
            this.menus.busStop({ x: 0, y: 0, open: false })
            this.menus.stopPosition({ x: 0, y: 0, open: false })
        }
        super.transform(event)
    }
}