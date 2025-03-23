import { useOSMMapStore } from "../../../../store/osmmeta";
import { Member } from "../../../../type/osm/meta";
import { AllStateMachineEvents } from "../../../../type/stateMachine/allEvents";
import { BaseContext, StoreType } from "../../../../type/stateMachine/baseEvent";
import { FeatureClassifyFun } from "../../../../type/stateMachine/ptEdit";
import { MapViewStateMachine } from "../slice/map/MapViewStateMachine";
import { UndoRedoStateMachine } from "../slice/util/UndoRedoStateMachine";
import { BaseStateMachine, StateItem } from "../state";
import { BusTabComponentStateMachine } from "./slice/BusTabComponent";

type BaseMachine = BaseStateMachine<AllStateMachineEvents, BaseContext>
export class RouteAddPathStateMachine extends BaseStateMachine<AllStateMachineEvents, BaseContext> {
    manualAddPathMode: StateItem<AllStateMachineEvents>
    mpView: BaseMachine
    mpComponent: BaseMachine
    mpUndoRedo: BaseMachine
    constructor(store: StoreType) {
        super(store)
        this.manualAddPathMode = new StateItem('path-add-manual-mode')
        this.entry = this.manualAddPathMode
        this.current = this.manualAddPathMode
        this.accept = [this.manualAddPathMode]


        const hoverable: FeatureClassifyFun = (target) => {
            return target.type === "way"
        }

        const clickable: FeatureClassifyFun = (target) => {
            return target.type === "way"
        }

        const dragable: FeatureClassifyFun = () => {
            return false
        }

        const selectable: FeatureClassifyFun = () => {
            return false
        }

        this.mpView = new MapViewStateMachine(store)
        this.mpComponent = new BusTabComponentStateMachine(store, {
            onRightClick: (target) => {
                console.debug(`Add path: right click at ${target}`);
                const { routeEdit, setRoutePath } = useOSMMapStore.getState()
                const match = (member: Member) => member["@_ref"] === target.id && member["@_type"] === target.type
                if (routeEdit.path.some(match)) {
                    setRoutePath(routeEdit.path.filter(m => !match(m)))
                } else {
                    setRoutePath([...routeEdit.path, { '@_ref': target.id, "@_type": target.type }])
                }
            },
            onLeftClick: (target) => {
                const { toggleFeature } = useOSMMapStore.getState()
                toggleFeature(target.type, target.id, true);
            },
            hoverable,
            clickable,
            
            dragable,
            selectable
        })
        this.mpUndoRedo = new UndoRedoStateMachine(store)
        this.manualAddPathMode.appendNext(this.mpComponent, { isEpsilon: true })

        this.manualAddPathMode.appendNext(this.mpView, { isEpsilon: true })
        this.manualAddPathMode.appendNext(this.mpUndoRedo, { isEpsilon: true })

        this.mpView.appendNext(this.manualAddPathMode, { isEpsilon: true })
        this.mpComponent.appendNext(this.manualAddPathMode, { isEpsilon: true })
        this.mpUndoRedo.appendNext(this.manualAddPathMode, { isEpsilon: true })
    }

    transform(event: AllStateMachineEvents): void {
        super.transform(event)
    }
}