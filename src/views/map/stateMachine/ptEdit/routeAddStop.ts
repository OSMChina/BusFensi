import { Member } from "../../../../type/osm/meta";
import { AllStateMachineEvents } from "../../../../type/stateMachine/allEvents";
import { BaseContext, StoreType } from "../../../../type/stateMachine/baseEvent";
import { FeatureClassifyFun } from "../../../../type/stateMachine/ptEdit";
import { MapViewStateMachine } from "../slice/map/MapViewStateMachine";
import { UndoRedoStateMachine } from "../slice/util/UndoRedoStateMachine";
import { BaseStateMachine, StateItem } from "../state";
import { BusTabComponentStateMachine } from "./slice/BusTabComponent";

type BaseMachine = BaseStateMachine<AllStateMachineEvents, BaseContext>
export class RouteAddStopStateMachine extends BaseStateMachine<AllStateMachineEvents, BaseContext> {
    idle: StateItem<AllStateMachineEvents>
    mapViewSubMachine: BaseMachine
    busStopEditSubMachine: BaseMachine
    undoRedo: BaseMachine
    constructor(store: StoreType) {
        super(store)

        const hoverable: FeatureClassifyFun = (target) => {
            return target.type === "node"
        }

        const clickable: FeatureClassifyFun = (target) => {
            return target.type === "node"
        }

        const dragable: FeatureClassifyFun = () => {
            return false
        }

        const selectable: FeatureClassifyFun = () => {
            return false
        }


        this.idle = new StateItem('pt-edit-idle')
        this.mapViewSubMachine = new MapViewStateMachine(store)
        this.busStopEditSubMachine = new BusTabComponentStateMachine(store, {
            onRightClick: (target) => {
                const { routeEdit, setRouteStop } = this.context.store.meta.getState()
                const match = (member: Member) => member["@_ref"] === target.id && member["@_type"] === target.type
                if (routeEdit.stops.some(match)) {
                    setRouteStop(routeEdit.stops.filter(m => !match(m)))
                } else {
                    setRouteStop([...routeEdit.stops, { '@_ref': target.id, "@_type": target.type }])
                }
            },
            onLeftClick: (target, event) => {
                const { toggleFeature } = this.context.store.meta.getState()
                toggleFeature(target.type, target.id, !event.shiftKey);
            },
            hoverable,
            clickable,
            dragable,
            selectable
        })
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

    transform(event: AllStateMachineEvents): void {
        super.transform(event)
    }
}