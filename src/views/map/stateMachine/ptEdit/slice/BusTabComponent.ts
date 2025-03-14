import { FederatedMouseEvent } from "pixi.js";
import { StoreType } from "../../../../../type/stateMachine/baseEvent";
import { PointerWithOSMEvent } from "../../../../../type/stateMachine/commonEdit/componentEvent";
import { FeatureClassifyFun, PtEditContext, PtEditEvents } from "../../../../../type/stateMachine/ptEdit";
import { ComponentStateContext, doComponentDragging } from "../../slice/components/helper";
import { BaseStateMachine, StateItem } from "../../state"
import { MOUSE } from "../../../../../utils/mouse/moueBtn";
import { FeatureRefObj } from "../../../../../type/osm/refobj";
type ComponentStateItem = StateItem<PtEditEvents>;
interface ComponentStateMachineOptions {
    // menus: PtEditRightClickMenus,
    onRightClick?: (target: FeatureRefObj, event: FederatedMouseEvent) => void,
    onLeftClick?: (target: FeatureRefObj, event: FederatedMouseEvent) => void,
    onHoverStart?: (target: FeatureRefObj, event: FederatedMouseEvent) => void,
    onHoverExit?: (target: FeatureRefObj, event: FederatedMouseEvent) => void
    hoverable: FeatureClassifyFun,
    clickable: FeatureClassifyFun,
    dragable: FeatureClassifyFun,
    selectable: FeatureClassifyFun
}
// TODO:: right click modal support. expose some hooks to enable: onHover, onClick, onDrag?
export class BusTabComponentStateMachine extends BaseStateMachine<PtEditEvents, ComponentStateContext & PtEditContext> {
    idle: ComponentStateItem
    componentHover: ComponentStateItem
    componentMousedown: ComponentStateItem
    pointDrag: ComponentStateItem
    constructor(store: StoreType, { onRightClick, onLeftClick, onHoverExit, onHoverStart, hoverable, clickable, dragable, selectable }: ComponentStateMachineOptions) {
        super(store)
        // 新建子状态
        this.idle = new StateItem("pt-bus-component-idle")
        this.componentHover = new StateItem("pt-bus-component-hover")
        this.componentMousedown = new StateItem("pt-bus-component-mousedown")
        this.pointDrag = new StateItem("pt-bus-component-drag")

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
                    && hoverable(event.componentTarget, this.context)
                ) {
                    context.componentTarget = event.componentTarget;
                    const { id, type } = context.componentTarget;
                    console.log("BusComponentStateMachine: component hover triggered", type, id);

                    const { modifyFeatureStateNC } = context.store.meta.getState();
                    modifyFeatureStateNC(type, id, feature => feature.hovered = true);
                    if (onHoverStart) onHoverStart(context.componentTarget, event as FederatedMouseEvent)
                    return true;
                }
                return false;
            }
        })

        // Transition: componentHover → mousedown
        this.componentHover.appendNext(this.componentMousedown, {
            transform: (event) => {
                const context = this.context;
                if (event.type === "mousedown" && context.componentTarget
                    && clickable(context.componentTarget, context)) {
                    console.log("BusComponentStateMachine: transition to " + this.componentMousedown.name);

                    const { id, type } = context.componentTarget;
                    const { modifyFeatureStateNC } = context.store.meta.getState();
                    modifyFeatureStateNC(type, id, feature => feature.hovered = false);
                    if (onHoverExit) onHoverExit(context.componentTarget, event as FederatedMouseEvent)
                    return true;
                }
                return false;
            },
        });

        // Transition: componentHover → idle
        this.componentHover.appendNext(this.idle, {
            transform: (event) => {
                const context = this.context;
                if (['pointerleave', 'pointerout'].includes(event.type) && context.componentTarget) {
                    console.log("BusComponentStateMachine: transition to idle");

                    const { id, type } = context.componentTarget;
                    const { modifyFeatureStateNC } = context.store.meta.getState();
                    modifyFeatureStateNC(type, id, feature => feature.hovered = false);
                    if (onHoverExit) onHoverExit(context.componentTarget, event as FederatedMouseEvent)
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
                    && "node" === context.componentTarget?.type
                    && dragable(context.componentTarget, context)) {
                    console.log("BusComponentStateMachine: start dragging");
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
                    if ((event as FederatedMouseEvent).button === MOUSE.RIGHT && onRightClick) {
                        onRightClick(context.componentTarget, event as FederatedMouseEvent);
                        // this.context.rightClickMenus.stopPosition({ ...getLocalPosistion(ev.clientX, ev.clientY, this.context), feature: context.componentTarget, open: true })
                    } else if ((event as FederatedMouseEvent).button === MOUSE.LEFT && onLeftClick) {
                        onLeftClick(context.componentTarget, event as FederatedMouseEvent)
                    }
                    if (selectable(context.componentTarget, context)) {
                        // mouse down and up, means select
                        const { selectFeature } = context.store.meta.getState()
                        const { id, type } = context.componentTarget;
                        if (typeof id === "string") {
                            selectFeature(type, id, !event.shiftKey);
                            console.log('selected id', id, context.store.meta.getState().selectFeature)
                        } else {
                            throw new Error(`id ${id} is invalid for component`)
                        }
                    }
                    context.componentTarget = undefined;
                    return true;
                }
                return false;
            }
        })

        // Transition: pointDrag → idle (end drag)
        this.pointDrag.appendNext(this.idle, {
            transform: (event) => {
                if (event.type === 'mouseupoutside' || event.type === 'mouseup') {
                    console.log("BusComponentStateMachine: drag canceled, back to idle");
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