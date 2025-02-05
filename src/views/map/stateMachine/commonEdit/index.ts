import { BaseContext, StoreType } from "../../../../type/stateMachine/baseEvent";
import { CommonStateEvent } from "../../../../type/stateMachine/commonEdit";
import { BaseStateMachine, StateItem } from "../state";
import { ComponentStateMachine } from "./slice/ComponentStateMachine";
import { MapViewStateMachine } from "./slice/MapViewStateMachine";
import { UtilStateMachine } from "./slice/UtilStateMachine";

type BaseMachine = BaseStateMachine<CommonStateEvent, BaseContext>
export class CommonEditStateMachine extends BaseStateMachine<CommonStateEvent, BaseContext> {
    idle: StateItem<CommonStateEvent>
    componentSubMachine: BaseMachine
    mapViewSubMachine: BaseMachine
    uiStateSubMachine: BaseMachine
    constructor(store: StoreType) {
        super(store)

        this.idle = new StateItem("common-edit-idle");
        this.componentSubMachine = new ComponentStateMachine(store);
        this.mapViewSubMachine = new MapViewStateMachine(store);
        this.uiStateSubMachine = new UtilStateMachine(store);

        this.entry = this.idle
        this.current = this.idle
        this.accept = [this.idle]

        this.idle.appendNext(this.componentSubMachine, { isEpsilon: true })
        this.idle.appendNext(this.mapViewSubMachine, { isEpsilon: true })
        this.idle.appendNext(this.uiStateSubMachine, { isEpsilon: true })

        this.componentSubMachine.appendNext(this.idle, { isEpsilon: true })
        this.mapViewSubMachine.appendNext(this.idle, { isEpsilon: true })
        this.uiStateSubMachine.appendNext(this.idle, { isEpsilon: true })
    }
}