import { FederatedPointerEvent } from "pixi.js";
import { BaseContext, StoreType } from "../../../../../type/stateMachine/baseEvent";
import { CommonStateEvent } from "../../../../../type/stateMachine/commonEdit";
import { BaseStateMachine, StateItem } from "../../state";
import { getWGS84LocateByPixel } from "../../../../../utils/geo/mapProjection";
import { PointerWithOSMEvent } from "../../../../../type/stateMachine/commonEdit/componentEvent";
import { getNearestPointOnPolyline } from "../../../../../utils/osm/featureLineProjection";

type UtilStateContext = BaseContext

type UtilStateStateItem = StateItem<CommonStateEvent>;

export class UtilStateMachine extends BaseStateMachine<CommonStateEvent, UtilStateContext> {
    idle: UtilStateStateItem
    addNode: UtilStateStateItem
    addNodeOnWay: UtilStateStateItem
    splitWay: UtilStateStateItem
    constructor(store: StoreType) {
        super(store)
        this.idle = new StateItem("node-idle")
        this.addNode = new StateItem("add-node")
        this.addNodeOnWay = new StateItem("add-node-on-way")
        this.splitWay = new StateItem("split-way")

        this.entry = this.idle;
        this.current = this.idle;
        this.accept = [this.idle];

        this.idle.appendNext(this.idle, {
            transform: (event) => {
                if (event.type === 'keydown') {
                    const ev = event as KeyboardEvent
                    const { undo, redo } = this.context.store.meta.temporal.getState()
                    if (ev.code === 'KeyZ') {
                        if (ev.shiftKey && ev.ctrlKey) {
                            console.log('redo')
                            redo()
                            return true
                        } else if (ev.ctrlKey) {
                            console.log('undo')
                            undo()
                            return true
                        }
                    }
                }
                if (event.type === "utils-undo") {
                    const { undo } = this.context.store.meta.temporal.getState()
                    console.log('undo')
                    undo()
                    return true;
                }
                if (event.type === "utils-redo") {
                    const { redo } = this.context.store.meta.temporal.getState()
                    console.log('redo')
                    redo()
                    return true;
                }
                return false
            },
        })

        this.idle.appendNext(this.addNode, {
            transform: (event) => {
                if (event.type === "add-node") {
                    console.log('to addnode way state')
                    return true
                }
                return false
            }
        })

        this.idle.appendNext(this.addNodeOnWay, {
            transform: (event) => {
                if (event.type === 'add-node-on-way') {
                    console.log('to addnode way state')
                    return true
                }
                return false
            }
        })

        this.idle.appendNext(this.splitWay, {
            transform: (event) => {
                if (event.type === 'split-way') {
                    console.log('to split way state')
                    return true
                }
                return false
            }
        })

        this.addNode.appendNext(this.idle, {
            transform: (event) => {
                if (event.type === 'pointerdown') {
                    const ev = event as FederatedPointerEvent
                    if (ev.button === 0) {
                        const { viewpoint, zoom, width: _w, height: _h } = this.context.store.view.getState()
                        const width = _w!, height = _h!;
                        const { clientX, clientY } = ev
                        const point = getWGS84LocateByPixel(
                            { x: clientX, y: clientY },
                            viewpoint,
                            zoom,
                            width,
                            height
                        )
                        this.context.store.meta.getState().createLocalNode(point)
                        console.log('added node');
                    }
                    return true;
                }
                return false;
            }
        })

        this.addNodeOnWay.appendNext(this.idle, {
            transform: (event) => {
                if (event.type === 'pointerdown') {
                    const ev = event as PointerWithOSMEvent
                    if (ev.button === 0 && ev.componentTarget && ev.componentTarget.type === "way") {
                        const { viewpoint, zoom, width: _w, height: _h } = this.context.store.view.getState();
                        const width = _w!, height = _h!;
                        const { meta, createLocalNode, modifyFeatureMetaNC, commit } = this.context.store.meta.getState()
                        const { clientX, clientY } = ev
                        const point = getWGS84LocateByPixel(
                            { x: clientX, y: clientY },
                            viewpoint,
                            zoom,
                            width,
                            height
                        )
                        const way = meta.way[ev.componentTarget.id]
                        const pointPath = way.nd.map(nd => meta.node[nd['@_ref']])
                        const { nearestPoint, insertAfter } = getNearestPointOnPolyline(point, pointPath)
                        const nodeId = createLocalNode(nearestPoint)
                        const newNd = Array.from(way.nd)
                        newNd.splice(way.nd.findIndex(nd => nd['@_ref'] === insertAfter['@_id']) + 1, 0, { "@_ref": nodeId })
                        commit()
                        modifyFeatureMetaNC(
                            ev.componentTarget.type,
                            ev.componentTarget.id,
                            (w) => w.nd = newNd
                        )
                        console.log('nodeid', nodeId, newNd)
                        console.log('added node');
                    }
                    return true;
                }
                return false;
            },
        })
        this.splitWay.appendNext(this.idle, {
            transform: (event) => {
                if (event.type === 'pointerdown') {
                    const ev = event as PointerWithOSMEvent
                    if (ev.button === 0 && ev.componentTarget && "node" === ev.componentTarget.type) {
                        const { meta, splitWay } = this.context.store.meta.getState()
                        const node = meta.node[ev.componentTarget.id]
                        splitWay(node["@_id"]);
                        console.log('splited way');
                    }
                    return true;
                }
                return false
            }
        })
    }
}

