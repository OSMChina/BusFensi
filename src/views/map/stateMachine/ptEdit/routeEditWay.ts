import { BaseContext, StoreType } from "../../../../type/stateMachine/baseEvent";
import { BaseStateMachine, StateItem } from "../state";
import { MapViewStateMachine } from "../slice/map/MapViewStateMachine";
import { getBoundsByRect } from "../../../../utils/geo/mapProjection";
import { getFeatureInBound } from "../../../../store/osmmeta/selector";
import { BatchSelectStateMachine } from "../slice/components/BatchSelectStateMachine";
import { UndoRedoStateMachine } from "../slice/util/UndoRedoStateMachine";
import { getLocalPosistion } from "../slice/components/helper";
import { AllStateMachineEvents } from "../../../../type/stateMachine/allEvents";
import { FeatureRefObj } from "../../../../type/osm/refobj";
import { FeatureClassifyFun } from "../../../../type/stateMachine/ptEdit";
import { BusTabComponentStateMachine } from "./slice/BusTabComponent";

type RouteEditEvents = AllStateMachineEvents;
type RightClickMenuHandler = (props: { x: number; y: number; open: boolean; feature?: FeatureRefObj }) => void;

export class RouteEditWayStateMachine extends BaseStateMachine<RouteEditEvents, BaseContext> {
  idle: StateItem<RouteEditEvents>;
  mapViewSubMachine: BaseStateMachine<RouteEditEvents, BaseContext>;
  componentSubMachine: BaseStateMachine<RouteEditEvents, BaseContext>;
  undoRedo: BaseStateMachine<RouteEditEvents, BaseContext>;
  batchSelect: BaseStateMachine<RouteEditEvents, BaseContext>;

  constructor(
    store: StoreType,
    private menus: { wayEditMenu: RightClickMenuHandler }
  ) {
    super(store);

    this.idle = new StateItem('route-edit-idle');
    const hoverable: FeatureClassifyFun = (target) => {
      return target.type === "way" || target.type === "node"
    }

    const clickable: FeatureClassifyFun = (target) => {
      return target.type === "way" || target.type === "node"
    }

    const dragable: FeatureClassifyFun = (target) => {
      return target.type === "node"
    }

    const selectable: FeatureClassifyFun = () => {
      return false;
    }

    this.mapViewSubMachine = new MapViewStateMachine(store);
    this.componentSubMachine = new BusTabComponentStateMachine(store, {
      onRightClick: (target, event) => {
        menus.wayEditMenu({
          ...getLocalPosistion(event.clientX, event.clientY, this.context),
          open: true,
          feature: target
        });
      },
      onLeftClick: (target, event) => {
        if (target.type === "node" || target.type === "way") {
          const {toggleFeature} = this.context.store.meta.getState();
          toggleFeature(target.type, target.id, !event.shiftKey);
        }
      },
      hoverable,
      clickable,
      dragable,
      selectable,
    })
    this.undoRedo = new UndoRedoStateMachine(store);
    this.batchSelect = new BatchSelectStateMachine(store, {
      onSelectRect: (rect, event) => {
        const { viewpoint, zoom, width, height } = this.context.store.view.getState();
        const bounds = getBoundsByRect(viewpoint, zoom, width!, height!, rect);
        const osmmeta = this.context.store.meta.getState();
        const featuregroup = getFeatureInBound(bounds)(osmmeta);

        if (!event.ctrlKey) {
          osmmeta.clearSelect();
        }
        Object.entries(featuregroup.node).forEach(([, n]) =>
          osmmeta.selectFeature("node", n["@_id"], false)
        );
      }
    });

    this.entry = this.idle;
    this.current = this.idle;
    this.accept = [this.idle];

    this.idle.appendNext(this.mapViewSubMachine, { isEpsilon: true });
    this.idle.appendNext(this.componentSubMachine, { isEpsilon: true });
    this.idle.appendNext(this.undoRedo, { isEpsilon: true });
    this.idle.appendNext(this.batchSelect, { isEpsilon: true });

    this.mapViewSubMachine.appendNext(this.idle, { isEpsilon: true });
    this.componentSubMachine.appendNext(this.idle, { isEpsilon: true })
    this.undoRedo.appendNext(this.idle, { isEpsilon: true });
    this.batchSelect.appendNext(this.idle, { isEpsilon: true });
  }

  transform(event: RouteEditEvents): void {
    if (event.type === "mousedown") {
      this.menus.wayEditMenu({ x: 0, y: 0, open: false });
    }
    super.transform(event);
  }
}
