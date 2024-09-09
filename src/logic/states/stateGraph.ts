/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { OSMV06BBoxObj } from '../../api/osm/type';
import { getBoundsByScene, getPixelByWGS84Locate, getWGS84LocateByPixel } from '../../utils/geo/mapProjection';
import { stateMachine } from './stateMachine';
import { State } from './type';
import useBearStoreWithUndo from '../model/store';
import { settings } from '../settings/settings';
import { PointWGS84 } from '../../utils/geo/types';
import { bbox } from '../../api/osm/apiv0.6';
import { T2Arr } from '../../utils/helper/object';
import { getNearestPointOnPolyline } from '../../utils/osm/featureLineProjection';

const Idle: State = {
    type: 'idle',
    retain: (event: React.WheelEvent<HTMLCanvasElement>): boolean => {
        if (event.type === 'wheel') {
            // wheel roll, zoom in or out
            const axis = event.deltaY < 0;
            const { zoom, zoomNoTrack } = useBearStoreWithUndo.getState()
            const newZoom = zoom + (axis ? 1 : -1);
            if (newZoom >= 0 && newZoom <= settings.view.MAX_ZOOM) {
                zoomNoTrack(newZoom)
            }
        }
        return true;
    },
    nxt: []
};

const ComponentHover: State = {
    type: 'component-hover',
    retain: (): boolean => {
        return true;
    },
    nxt: []
};

const componentMousedown: State = {
    type: 'component-mousedown',
    retain: (): boolean => {
        return true;
    },
    nxt: []
};

const doComponentDragging = (x: number, y: number): void => {
    const { height, width } = useBearStoreWithUndo.getState().stage
    const { viewpoint, zoom, PIXIPointMoveNoCommit } = useBearStoreWithUndo.getState()
    const location = getWGS84LocateByPixel({ x: x, y: y }, viewpoint, zoom, width, height);
    const newpixPoint = getPixelByWGS84Locate(location, viewpoint, zoom, width, height);
    console.log("on component drag", { x: x, y: y }, newpixPoint)
    if (typeof stateMachine.bucket.componentTargetId === "string") {
        PIXIPointMoveNoCommit(stateMachine.bucket.componentTargetId, location)
    } else {
        throw new Error(`stateMachine.bucket.componentTargetId should not be ${stateMachine.bucket.componentTargetId} at point move`)
    }
};

const pointDrag: State = {
    type: 'component-drag',
    retain: (event: React.PointerEvent<HTMLCanvasElement>): boolean => {
        if (event.type === 'pointermove') {
            doComponentDragging(event.clientX, event.clientY);
        }
        return true;
    },
    nxt: []
};

const mapDrag: State = {
    type: 'map-drag',
    retain: (event: React.PointerEvent<HTMLCanvasElement>): boolean => {
        if (event.type === 'pointermove') {
            const [x, y] = [event.clientX, event.clientY];
            if (typeof stateMachine.bucket.mapDrag?.x !== "number" || typeof stateMachine.bucket.mapDrag?.y !== "number") {
                throw new Error(`stateMachine.bucket.mapDrag.x must be number when map drag`)
            }
            const [deltax, deltay] = [stateMachine.bucket.mapDrag.x - x, stateMachine.bucket.mapDrag.y - y];
            console.log('moving to', deltax, deltay);
            const { zoom, viewpintMoveNoTrack } = useBearStoreWithUndo.getState()
            const { width, height } = useBearStoreWithUndo.getState().stage
            const vnb = stateMachine.bucket.mapDrag.viewpointBeforeDrag;
            const vn = getWGS84LocateByPixel({ x: deltax + width / 2, y: deltay + height / 2 }, vnb, zoom, width, height);
            viewpintMoveNoTrack(vn);
        }
        return true;
    },
    nxt: []
};

const addNode: State = {
    type: 'add-node',
    retain: () => true,
    nxt: []
}

const addNodeOnWay: State = {
    type: 'add-node-on-way',
    retain: () => true,
    nxt: []
}

const splitWay: State = {
    type: 'split-way',
    retain: () => true,
    nxt: []
}

Idle.nxt = [
    {
        state: ComponentHover,
        transfer: (event: React.PointerEvent<HTMLCanvasElement>): boolean => {
            if (['pointerover', 'pointerenter',].includes(event.type) && stateMachine.targetId) {
                stateMachine.bucket = {};
                stateMachine.bucket.componentTargetId = stateMachine.targetId;
                const { PIXIComponentHoverNoCommit } = useBearStoreWithUndo.getState()
                PIXIComponentHoverNoCommit(stateMachine.bucket.componentTargetId, true);
                console.log('component hovered:', stateMachine.targetId, event);
                return true;
            }
            return false;
        },
    },
    {
        state: mapDrag,
        transfer: (event: React.PointerEvent<HTMLCanvasElement>): boolean => {
            if (event.type === 'pointerdown' && !stateMachine.bucket?.componentTargetId && !stateMachine.shiftKey) {
                const vnb = useBearStoreWithUndo.getState().viewpoint
                stateMachine.bucket = {};
                stateMachine.bucket.mapDrag = { x: event.clientX, y: event.clientY, viewpointBeforeDrag: vnb };
                console.log('to mapDrag state');
                return true;
            }
            return false;
        },
    },
    {
        state: addNode,
        transfer: (event: any) => {
            if (event.type === 'add-node') {
                console.log('to addnode state')
                return true
            }
            return false
        }
    },
    {
        state: addNodeOnWay,
        transfer: (event: any) => {
            if (event.type === 'add-node-on-way') {
                console.log('to addnode way state')
                return true
            }
            return false

        }
    },
    {
        state: splitWay,
        transfer: (event: any) => {
            if (event.type === 'split-way') {
                console.log('to split way state')
                return true
            }
            return false
        }
    }
];

ComponentHover.nxt = [
    {
        state: componentMousedown,
        transfer: (event): boolean => {
            if (['pointerdown', 'mousedown'].includes(event.type)) {
                const id = stateMachine.bucket.componentTargetId;
                const { PIXIComponentHoverNoCommit } = useBearStoreWithUndo.getState()
                console.log('to componnet mouse down', event)
                if (typeof id === "string") {

                    PIXIComponentHoverNoCommit(id, false);
                } else {
                    throw new Error(`id ${id} is invalid for component`)
                }
                return true;
            }
            return false;
        },
    },
    {
        state: Idle,
        transfer: (event): boolean => {
            if (['pointerleave', 'pointerout'].includes(event.type)) {
                const id = stateMachine.bucket.componentTargetId;
                const { PIXIComponentHoverNoCommit } = useBearStoreWithUndo.getState()
                if (typeof id === "string") {
                    PIXIComponentHoverNoCommit(id, false);
                } else {
                    throw new Error(`id ${id} is invalid for component`)
                }
                stateMachine.bucket.componentTargetId = null;
                console.log('quit hovered', stateMachine.bucket.componentTargetId);
                return true;
            }
            return false;
        },
    },
];

componentMousedown.nxt = [
    {
        state: pointDrag,
        transfer: (event: React.PointerEvent<HTMLCanvasElement>): boolean => {
            if (event.type === 'pointermove'
                && stateMachine.bucket.componentTargetId
                && "node" === useBearStoreWithUndo.getState().renderedOSMFeatureMeta.id2type[stateMachine.bucket.componentTargetId]
            ) {
                const { clientX, clientY } = event;
                doComponentDragging(clientX, clientY);
                return true;
            }
            return false;
        },
    },
    {
        state: Idle,
        transfer: (event): boolean => {
            if (event.type === 'pointerup' || event.type === 'pointerupoutside') {
                // mouse down and up, means select
                const { PIXIComponentSelectAction: PIXIPointSelectAction } = useBearStoreWithUndo.getState()
                const id = stateMachine.bucket.componentTargetId;
                if (typeof id === "string") {
                    PIXIPointSelectAction(id, !stateMachine.shiftKey);
                    console.log('selected id', id, useBearStoreWithUndo.getState().selectedComponent)
                    stateMachine.bucket.componentTargetId = null;
                } else {
                    throw new Error(`id ${id} is invalid for component`)
                }
                return true;
            }
            return false;
        },
    },
];

pointDrag.nxt = [
    {
        state: ComponentHover,
        transfer: (event): boolean => {
            if (event.type === 'pointerup') {
                console.log('state back to hover');
                const { commitAction, PIXIComponentHoverNoCommit } = useBearStoreWithUndo.getState()
                commitAction() // end Drag, to hover
                if (typeof stateMachine.bucket.componentTargetId === "string") {
                    PIXIComponentHoverNoCommit(stateMachine.bucket.componentTargetId, true)
                } else {
                    throw new Error(`id ${stateMachine.bucket.componentTargetId} is invalid for component at hover`)
                }
                return true;
            }
            return false;
        },
    },
    {
        state: Idle,
        transfer: (event): boolean => {
            if (event.type === 'pointerupoutside') {
                stateMachine.bucket.componentTargetId = null;
                const { commitAction } = useBearStoreWithUndo.getState()
                commitAction()
                return true;
            }
            return false;
        },
    },
];

async function loadBBox(bboxs: OSMV06BBoxObj[], viewpoint: PointWGS84, zoom: number, width: number, height: number): Promise<OSMV06BBoxObj | null> {
    const V = 0.0000001;
    const { left, bottom, right, top } = getBoundsByScene(viewpoint, zoom, width, height);
    const valid = (obj: OSMV06BBoxObj): boolean => {
        return obj.osm.bounds["@_minlon"] <= left + V
            && obj.osm.bounds["@_minlat"] <= bottom + V
            && obj.osm.bounds["@_maxlon"] >= right - V
            && obj.osm.bounds["@_maxlat"] >= top - V
    }
    // 如果不包含当前区域，则直接请求 bbox。
    if (!bboxs.some(valid)) {
        console.log(`osm load data, faild to get cache: ${left} ${bottom} ${right} ${top}`, viewpoint, zoom)
        console.log("state bboxs", bboxs)
        const bboxobj = await bbox(settings.osmAPI.BASEURL, left, bottom, right, top);
        return bboxobj
    } else {
        // 如果存在包含当前区域的 bbox，那么请求该 bbox 的 changeset
        // 当然，现在我们假设它没有更新，所以不管了，毕竟元素都已经渲染了,搞不好还被修改了，所以，直接 null
        console.log('requested bbox is already cached')
        return null
    }
}

mapDrag.nxt = [
    {
        state: Idle,
        transfer: (event): boolean => {
            if (event.type === 'pointerup' || event.type === 'pointerupoutside') {
                stateMachine.bucket = {};
                // request map data
                const { viewpoint, zoom, bboxs } = useBearStoreWithUndo.getState();
                const { width, height } = useBearStoreWithUndo.getState().stage;
                loadBBox(bboxs, viewpoint, zoom, width, height)
                    .then((bboxObj) => {
                        if (bboxObj !== null) {
                            const { OSMLoadedBboxAction: OSMLoadedDataAction } = useBearStoreWithUndo.getState()
                            OSMLoadedDataAction(bboxObj)
                        }
                    })
                    .catch((err: unknown) => {
                        console.log(err);
                    });
                return true;
            }
            return false;
        },
    },
];

addNode.nxt = [{
    state: Idle,
    transfer: (event: React.PointerEvent<HTMLCanvasElement>): boolean => {
        if (event.type === 'pointerdown') {
            if (event.button === 0) {
                const { viewpoint, zoom, stage } = useBearStoreWithUndo.getState()
                const { clientX, clientY } = event
                const point = getWGS84LocateByPixel(
                    { x: clientX, y: clientY },
                    viewpoint,
                    zoom,
                    stage.width,
                    stage.height
                )
                useBearStoreWithUndo.getState().createLocalNodeAction(point)
                console.log('added node');
            }
            return true;
        }
        return false;
    },

}]

addNodeOnWay.nxt = [{
    state: Idle,
    transfer: (event: React.PointerEvent<HTMLCanvasElement>): boolean => {
        if (event.type === 'pointerdown') {
            if (event.button === 0 && stateMachine.targetId) {
                const { viewpoint, zoom, stage, renderedOSMFeatureMeta, createLocalNodeAction: createLocalNode, modifyWayNoCommit, commitAction } = useBearStoreWithUndo.getState()
                if (renderedOSMFeatureMeta.id2type[stateMachine.targetId] === "way") {
                    const { clientX, clientY } = event
                    const point = getWGS84LocateByPixel(
                        { x: clientX, y: clientY },
                        viewpoint,
                        zoom,
                        stage.width,
                        stage.height
                    )
                    const way = renderedOSMFeatureMeta.ways[stateMachine.targetId]
                    const pointPath = T2Arr(way.nd).map(nd => renderedOSMFeatureMeta.nodes[nd['@_ref']])
                    const { nearestPoint, insertAfter } = getNearestPointOnPolyline(point, pointPath)
                    const nodeId = createLocalNode(nearestPoint)
                    const newNd = Array.from(T2Arr(way.nd))
                    newNd.splice(T2Arr(way.nd).findIndex(nd => nd['@_ref'] === insertAfter['@_id']) + 1, 0, { "@_ref": nodeId })
                    modifyWayNoCommit(
                        stateMachine.targetId, {
                        nd: newNd
                    })
                    console.log('nodeid', nodeId, newNd)

                    commitAction()
                    console.log('added node');
                }
            }
            return true;
        }
        return false;
    },
}]

splitWay.nxt = [{
    state: Idle,
    transfer: (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (event.type === 'pointerdown') {
            if (event.button === 0 && stateMachine.targetId) {
                const { renderedOSMFeatureMeta, splitWayAction } = useBearStoreWithUndo.getState()
                if (renderedOSMFeatureMeta.id2type[stateMachine.targetId] === "node") {
                    const node = renderedOSMFeatureMeta.nodes[stateMachine.targetId]
                    splitWayAction(node);
                    console.log('splited way');
                }
            }
            return true;
        }

        return false
    }
}]

export const defaultState = Idle;