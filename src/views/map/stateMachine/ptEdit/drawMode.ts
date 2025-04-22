import { FederatedMouseEvent } from "pixi.js";
import { NumericString } from "../../../../type/osm/refobj";
import { AllStateMachineEvents } from "../../../../type/stateMachine/allEvents";
import { BaseContext, StoreType } from "../../../../type/stateMachine/baseEvent";
import { PointerWithOSMEvent } from "../../../../type/stateMachine/commonEdit/componentEvent";
import { PointerOnMapViewEvent } from "../../../../type/stateMachine/commonEdit/mapViewEvent";
import { FeatureClassifyFun } from "../../../../type/stateMachine/ptEdit";
import { getLocalPosistion } from "../slice/components/helper";
import { UndoRedoStateMachine } from "../slice/util/UndoRedoStateMachine";
import { BaseStateMachine, StateItem } from "../state";
import { BusTabComponentStateMachine } from "./slice/BusTabComponent";
import { getLocationByPixel } from "../../../../store/mapview";

enum DRAW_STATUS {
    PLAIN, // first node
    PRESEG, // second node
    CONTINUE // rest node
}

interface DrawModeContext extends BaseContext {
    status: DRAW_STATUS,
    preNode?: NumericString,
    curWay?: NumericString
}
type BaseMachine = BaseStateMachine<AllStateMachineEvents, BaseContext>
export class DrawModeStateMacine extends BaseStateMachine<AllStateMachineEvents, DrawModeContext> {
    drawMode: StateItem<AllStateMachineEvents>
    onMouseDown: StateItem<AllStateMachineEvents>
    component: BaseMachine
    undoRedo: BaseMachine

    clearDrawMode() {
        this.context.store.view.getState().clearDrawModeNC();
    }

    constructor(store: StoreType) {
        super(store)
        this.drawMode = new StateItem('draw-mode-entry')
        this.onMouseDown = new StateItem('draw-mode-mousedown')
        this.entry = this.drawMode
        this.current = this.drawMode
        this.accept = [this.drawMode]

        this.context.store.view.getState().clearDrawModeNC();
        this.context.status = DRAW_STATUS.PLAIN

        const hoverable: FeatureClassifyFun = (target) => {
            return target.type === "way" || target.type === "node"
        }

        const clickable: FeatureClassifyFun = (target) => {
            return target.type === "way" || target.type === "node"
        }

        const dragable: FeatureClassifyFun = () => {
            return false
        }

        const selectable: FeatureClassifyFun = () => {
            return false
        }

        const eventToWGS84 = this.#eventToWGS84.bind(this);

        this.component = new BusTabComponentStateMachine(store, {
            onLeftClick: (target, event) => {
                const { setFromPosNC, clearDrawModeNC } = this.context.store.view.getState();
                const { createNodeOnWay, createLocalWay, modifyFeatureMetaNC, meta, tree } = this.context.store.meta.getState();
                const pos = eventToWGS84(event);
                if (target.type === "way") {
                    // create a new Node on the way
                    const way = meta.way[target.id]
                    // click on Way:
                    // PLAIN: enter PRESEG
                    // PRESEG or CONTINUE: end seg, to PLAIN state
                    switch (this.context.status) {
                        case DRAW_STATUS.PLAIN: {
                            // create a new Node on the way, set preNode, curWay enter PRESEG state.
                            this.context.preNode = createNodeOnWay(pos, [], way["@_id"]);
                            this.context.status = DRAW_STATUS.PRESEG
                            setFromPosNC(pos);
                        } break;
                        case DRAW_STATUS.PRESEG: {
                            // create a new Node on the way, clear preNode, curWay, enter PLAIN state.
                            const newNode = createNodeOnWay(eventToWGS84(event), [], way["@_id"]);
                            createLocalWay([{ "@_ref": this.context.preNode! }, { "@_ref": newNode }]);
                            this.context.preNode = undefined
                            this.context.curWay = undefined
                            this.context.status = DRAW_STATUS.PLAIN
                            clearDrawModeNC();
                        } break;
                        case DRAW_STATUS.CONTINUE: {
                            // create a new Node on the way
                            const newNode = createNodeOnWay(eventToWGS84(event), [], way["@_id"]);
                            modifyFeatureMetaNC("way", this.context.curWay!, w => {
                                if (w.nd[0]["@_ref"] === this.context.preNode!) {
                                    w.nd = [{ "@_ref": newNode }, ...w.nd];
                                } else {
                                    w.nd.push({ "@_ref": newNode });
                                }
                            });
                            this.context.preNode = undefined
                            this.context.curWay = undefined
                            this.context.status = DRAW_STATUS.PLAIN
                            clearDrawModeNC();
                        } break;
                        default:
                            throw new Error(`Unknown state ${this.context.status}`);
                    }
                } else if (target.type === "node") {
                    // connect to this Node.
                    // node is on way: PLAIN: edge of way: continue drawing, middle of way: preseg. REST: quit to PLAIN
                    // node is plain node: quit to PLAIN
                    switch (this.context.status) {
                        case DRAW_STATUS.PLAIN: {
                            if (tree.elems.node[target.id].fathers.way.length == 1) {
                                const faWay = tree.elems.node[target.id].fathers.way[0];
                                const way = meta.way[faWay];
                                if (way.nd[0]["@_ref"] === target.id || way.nd[way.nd.length - 1]["@_ref"] === target.id) {
                                    this.context.curWay = faWay;
                                    this.context.preNode = target.id;
                                    this.context.status = DRAW_STATUS.CONTINUE;
                                } else {
                                    // just start at pre segment
                                    this.context.preNode = target.id;
                                    this.context.status = DRAW_STATUS.PRESEG;
                                }
                            } else {
                                // just start at pre segment
                                this.context.preNode = target.id;
                                this.context.status = DRAW_STATUS.PRESEG;
                            }
                        } break;
                        case DRAW_STATUS.PRESEG: {
                            // connect the Node to the way, tterminate it.
                            createLocalWay([{ "@_ref": this.context.preNode! }, { "@_ref": target.id }]);
                            // then to continue
                            this.context.preNode = undefined;
                            this.context.curWay = undefined;
                            this.context.status = DRAW_STATUS.PLAIN;
                            clearDrawModeNC();
                        } break;
                        case DRAW_STATUS.CONTINUE: {
                            // connect the Node to the way, then ending the way.
                            modifyFeatureMetaNC("way", this.context.curWay!, w => {
                                if (w.nd[0]["@_ref"] === this.context.preNode!) {
                                    w.nd = [{ "@_ref": target.id }, ...w.nd];
                                } else {
                                    w.nd.push({ "@_ref": target.id });
                                }
                            });
                            this.context.preNode = undefined;
                            this.context.curWay = undefined;
                            this.context.status = DRAW_STATUS.PLAIN;
                            clearDrawModeNC();
                        } break;
                        default:
                            throw new Error(`Unknown state ${this.context.status}`);
                    }
                }
            },
            // onHoverStart: (target, event) => {
            //     // highlight the target
            // },
            // onHoverExit: (target, event) => {
            //     // cancel highlight the target
            // },
            hoverable,
            clickable,
            dragable,
            selectable
        })
        this.undoRedo = new UndoRedoStateMachine(store)
        this.drawMode.appendNext(this.component, { isEpsilon: true })
        this.drawMode.appendNext(this.undoRedo, { isEpsilon: true })
        this.drawMode.appendNext(this.drawMode, {
            transform: (event) => {
                if (event.type === "mousedown" && !(event as PointerWithOSMEvent)?.componentTarget) {
                    const pos = eventToWGS84(event as PointerWithOSMEvent);
                    const { setFromPosNC } = this.context.store.view.getState();
                    const { createLocalNode, createLocalWay, modifyFeatureMetaNC } = this.context.store.meta.getState();
                    switch (this.context.status) {
                        case DRAW_STATUS.PLAIN: {
                            // create node, set pre pos, switch status
                            const newNode = createLocalNode(pos);
                            setFromPosNC(pos);
                            this.context.status = DRAW_STATUS.PRESEG;
                            this.context.preNode = newNode;
                            this.context.curWay = undefined;
                        } break;
                        case DRAW_STATUS.PRESEG: {
                            // create node, create way, set pre pos, switch status, 
                            const newNode = createLocalNode(pos);
                            const newWay = createLocalWay([{ "@_ref": this.context.preNode! }, { '@_ref': newNode }]);
                            setFromPosNC(pos);
                            this.context.status = DRAW_STATUS.CONTINUE;
                            this.context.preNode = newNode;
                            this.context.curWay = newWay;
                        } break;
                        case DRAW_STATUS.CONTINUE: {
                            // create node, append node to way, set pre pos, retain status
                            const newNode = createLocalNode(pos)
                            modifyFeatureMetaNC("way", this.context.curWay!, w => {
                                if (w.nd[0]["@_ref"] === this.context.preNode!) {
                                    w.nd = [{ "@_ref": newNode }, ...w.nd];
                                } else {
                                    w.nd.push({ "@_ref": newNode });
                                }
                            })
                            setFromPosNC(pos);
                            this.context.status = DRAW_STATUS.CONTINUE;
                            this.context.preNode = newNode;
                            // this.context.way retain the same
                        } break;
                        default:
                            throw new Error(`Unknown state ${this.context.status}`);
                    }
                }
                return false;
            }
        })

        this.component.appendNext(this.drawMode, { isEpsilon: true })
        this.undoRedo.appendNext(this.drawMode, { isEpsilon: true })
    }

    #eventToWGS84(event: PointerOnMapViewEvent | PointerWithOSMEvent | FederatedMouseEvent) {
        return getLocationByPixel(getLocalPosistion(event.clientX, event.clientY, this.context))(this.context.store.view.getState())!
    }

    transform(event: AllStateMachineEvents): void {
        // to sync position
        if (event.type === "pointermove") {
            const ev = event as PointerOnMapViewEvent;
            const pos = this.#eventToWGS84(ev);
            console.debug("drawMode pointermove", pos);
            this.context.store.view.getState().setCurPosNC(pos);
        }
        super.transform(event)
    }
}