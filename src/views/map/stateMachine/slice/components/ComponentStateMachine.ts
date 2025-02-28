import { StoreType } from "../../../../../type/stateMachine/baseEvent"
import { BaseStateMachine, StateItem } from "../../state"
import { PointerWithOSMEvent } from "../../../../../type/stateMachine/commonEdit/componentEvent"
import { AllStateMachineEvents } from "../../../../../type/stateMachine/allEvents"
import { doComponentDragging, ComponentStateContext } from "./helper"
type ComponentStateItem = StateItem<AllStateMachineEvents>;

export class ComponentStateMachine extends BaseStateMachine<AllStateMachineEvents, ComponentStateContext> {
  idle: ComponentStateItem
  componentHover: ComponentStateItem
  componentMousedown: ComponentStateItem
  pointDrag: ComponentStateItem
  constructor(store: StoreType) {
    super(store)
    // 新建子状态
    this.idle = new StateItem("component-idle")
    this.componentHover = new StateItem("component-hover")
    this.componentMousedown = new StateItem("component-mousedown")
    this.pointDrag = new StateItem("component-drag")

    // 设置初始状态
    this.entry = this.idle
    this.current = this.idle
    this.accept = [this.idle]

    // 状态转换：从 idle 到 componentHover
    this.idle.appendNext(this.componentHover, {
      transform: (event) => {
        const context = this.context;
        if (
          ["pointerover", "pointerenter"].includes(event.type) &&
          'componentTarget' in event && event.componentTarget
        ) {
          context.componentTarget = event.componentTarget;
          const { id, type } = context.componentTarget;
          console.log("ComponentStateMachine: component hover triggered", type, id);

          const { modifyFeatureStateNC } = context.store.meta.getState();
          modifyFeatureStateNC(type, id, feature => feature.hovered = true);
          return true;
        }
        return false;
      }
    })


    // Transition: componentHover → mousedown
    this.componentHover.appendNext(this.componentMousedown, {
      transform: (event) => {
        const context = this.context;
        if (event.type === "mousedown" && context.componentTarget) {
          console.log("ComponentStateMachine: transition to mousedown");

          const { id, type } = context.componentTarget;
          const { modifyFeatureStateNC } = context.store.meta.getState();
          modifyFeatureStateNC(type, id, feature => feature.hovered = false);
          return true;
        }
        return false;
      },
    });

    // Transition: componentHover → mousedown
    this.componentHover.appendNext(this.idle, {
      transform: (event) => {
        const context = this.context;
        if (['pointerleave', 'pointerout'].includes(event.type) && context.componentTarget) {
          console.log("ComponentStateMachine: transition to idle");

          const { id, type } = context.componentTarget;
          const { modifyFeatureStateNC } = context.store.meta.getState();
          modifyFeatureStateNC(type, id, feature => feature.hovered = false);
          context.componentTarget = undefined;
          return true;
        }
        return false;
      }
    })

    // Transition: mousedown → pointDrag (dragging)
    this.componentMousedown.appendNext(this.pointDrag, {
      transform: (event) => {
        const context = this.context;
        if (event.type === 'pointermove'
          && "node" === context.componentTarget?.type) {
          console.log("ComponentStateMachine: start dragging");
          const { clientX, clientY } = event as PointerWithOSMEvent;
          const { commit } = context.store.meta.getState();
          commit();
          doComponentDragging(clientX, clientY, context)
          return true;
        }
        return false;
      },
    });

    // Transition: mousedown → idle
    this.componentMousedown.appendNext(this.idle, {
      transform: (event) => {
        const context = this.context;
        if ((event.type === 'mouseup' || event.type === 'mouseupoutside') && context.componentTarget) {
          // mouse down and up, means select
          const { selectFeature } = context.store.meta.getState()
          const { id, type } = context.componentTarget;
          if (typeof id === "string") {
            selectFeature(type, id, !event.shiftKey);
            console.log('selected id', id, context.store.meta.getState().selectFeature)
            context.componentTarget = undefined;
          } else {
            throw new Error(`id ${id} is invalid for component`)
          }
          return true;
        }
        return false;
      }
    })

    // Transition: pointDrag → idle (end drag)
    this.pointDrag.appendNext(this.idle, {
      transform: (event) => {
        if (event.type === 'mouseup' || event.type === 'mouseuppoutside') {
          console.log("ComponentStateMachine: drag canceled, back to idle");
          this.context.componentTarget = undefined;
          return true;
        }
        return false;
      }
    })

    // Transition: pointDrag → pointDrag (dragging)
    this.pointDrag.appendNext(this.pointDrag, {
      transform: (event) => {
        if (event.type === 'pointermove') {
          const { clientX, clientY } = event as PointerWithOSMEvent;
          doComponentDragging(clientX, clientY, this.context);
          return true;
        }
        return false;
      }
    })

  }
}