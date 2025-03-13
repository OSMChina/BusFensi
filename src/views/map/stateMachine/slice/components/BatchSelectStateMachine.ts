import { BaseContext, StoreType } from "../../../../../type/stateMachine/baseEvent"
import { BaseStateMachine, StateItem } from "../../state"
import { AllStateMachineEvents } from "../../../../../type/stateMachine/allEvents"
import { getLocalPosistion } from "./helper"
import { FederatedMouseEvent } from "pixi.js"
import { PointPixel } from "../../../../../utils/geo/types"
import { useMapViewStore } from "../../../../../store/mapview"
type BatchSelectStateItem = StateItem<AllStateMachineEvents>;
interface BatchSelectContext extends BaseContext {
  from?: PointPixel
}

interface BatchSelectHandlers {
  onSelectRect?: (rect: {
    from: PointPixel,
    to: PointPixel
  }, event: FederatedMouseEvent | MouseEvent) => void
}

export class BatchSelectStateMachine extends BaseStateMachine<AllStateMachineEvents, BatchSelectContext> {
  idle: BatchSelectStateItem
  mousedown: BatchSelectStateItem
  draging: BatchSelectStateItem
  constructor(store: StoreType, handlers?: BatchSelectHandlers) {
    super(store)
    // 新建子状态
    this.idle = new StateItem("select-idle")
    this.mousedown = new StateItem("select-mousedown")
    this.draging = new StateItem("select-dragging")

    // 设置初始状态
    this.entry = this.idle
    this.current = this.idle
    this.accept = [this.idle]

    // Transition: idle → mousedown
    this.idle.appendNext(this.mousedown, {
      transform: (event) => {
        const context = this.context;
        const ev = event as FederatedMouseEvent
        if (event.type === "mousedown" && event.shiftKey) {
          console.debug("BatchSelectStateMachine: transition from idle to mousedown");
          context.from = getLocalPosistion(ev.clientX, ev.clientY, context)
          return true;
        }
        return false;
      },
    });

    // Transition: mousedown → drag
    this.mousedown.appendNext(this.idle, {
      transform: (event) => {
        const context = this.context;
        if (["mouseup", "mouseupoutside", "pointerup", "pointerupoutside"].includes(event.type)) {
          console.debug("BatchSelectStateMachine: transition from mousedown to idle");
          context.from = undefined
          return true;
        }
        return false;
      }
    })

    // Transition: mousedown → pointDrag (dragging)
    this.mousedown.appendNext(this.draging, {
      transform: (event) => {
        const context = this.context;
        if (event.type === 'pointermove') {
          console.debug("BatchSelectStateMachine: start dragging");
          const { clientX, clientY } = event as FederatedMouseEvent;
          useMapViewStore.getState().setSelectionRect({ from: context.from!, to: getLocalPosistion(clientX, clientY, context) })
          return true;
        }
        return false;
      },
    });

    // Transition: draging → idle (end drag)
    this.draging.appendNext(this.idle, {
      transform: (event) => {
        if (["mouseup", "mouseupoutside", "pointerup", "pointerupoutside"].includes(event.type)) {
          console.debug("BatchSelectStateMachine: drag canceled, back to idle");
          useMapViewStore.getState().setSelectionRect()
          if (handlers?.onSelectRect) {
            const { clientX, clientY } = event as FederatedMouseEvent;
            handlers.onSelectRect({ from: this.context.from!, to: getLocalPosistion(clientX, clientY, this.context) }, event as MouseEvent)
          }
          this.context.from = undefined;
          return true;
        }
        return false;
      }
    })

    // Transition: draging → draging
    this.draging.appendNext(this.draging, {
      transform: (event) => {
        const context = this.context;
        if (event.type === 'pointermove') {
          console.debug("BatchSelectStateMachine: continue dragging");
          const { clientX, clientY } = event as FederatedMouseEvent;
          useMapViewStore.getState().setSelectionRect({ from: context.from!, to: getLocalPosistion(clientX, clientY, context) })
          return true;
        }
        return false;
      },
    });
  }
}