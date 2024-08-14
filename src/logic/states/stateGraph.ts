import React from 'react';
import { OSMV06BBoxObj } from '../../api/osm/type';
import { getBoundsByScene, getPixelByWGS84Locate, getWGS84LocateByPixel } from '../../utils/geo/mapProjection';
import { stateMachine } from './stateMachine';
import { State } from './type';
import useBearStoreWithUndo from '../model/store';
import { settings } from '../settings/settings';
import { PointWGS84 } from '../../utils/geo/types';
import { bbox } from '../../api/osm/apiv0.6';

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
    console.log("on component drag", {x:x, y:y}, newpixPoint)
    if (typeof stateMachine.bucket.componentTargetId === "string") {
        PIXIPointMoveNoCommit(stateMachine.bucket.componentTargetId, location)
    } else {
        throw new Error(`stateMachine.bucket.componentTargetId should not be ${stateMachine.bucket.componentTargetId} at point move`)
    }
};

const componentDrag: State = {
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

Idle.nxt = [
    {
        state: ComponentHover,
        transfer: (event: React.PointerEvent<HTMLCanvasElement>): boolean => {
            if (['pointerover', 'pointerenter',].includes(event.type) && stateMachine.targetId) {
                stateMachine.bucket = {};
                stateMachine.bucket.componentTargetId = stateMachine.targetId;
                const { PIXIComponentHoverNoCommit } = useBearStoreWithUndo.getState()
                PIXIComponentHoverNoCommit(stateMachine.bucket.componentTargetId, true);
                // console.log('component hovered:', stateMachine.targetId);
                return true;
            }
            return false;
        },
    },
    {
        state: mapDrag,
        transfer: (event: React.PointerEvent<HTMLCanvasElement>): boolean => {
            if (event.type === 'pointerdown' && !stateMachine.bucket?.componentTargetId) {
                const vnb = useBearStoreWithUndo.getState().viewpoint
                stateMachine.bucket = {};
                stateMachine.bucket.mapDrag = { x: event.clientX, y: event.clientY, viewpointBeforeDrag: vnb };
                console.log('to mapDrag state');
                return true;
            }
            return false;
        },
    },
];

ComponentHover.nxt = [
    {
        state: componentMousedown,
        transfer: (event): boolean => {
            if (event.type === 'pointerdown') {
                const id = stateMachine.bucket.componentTargetId;
                const { PIXIComponentHoverNoCommit } = useBearStoreWithUndo.getState()
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
        state: componentDrag,
        transfer: (event: React.PointerEvent<HTMLCanvasElement>): boolean => {
            if (event.type === 'pointermove') {
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
                const { PIXIPointSelectAction } = useBearStoreWithUndo.getState()
                const id = stateMachine.bucket.componentTargetId;
                if (typeof id === "string") {
                    PIXIPointSelectAction(id, !stateMachine.shiftKey);
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

componentDrag.nxt = [
    {
        state: ComponentHover,
        transfer: (event): boolean => {
            if (event.type === 'pointerup') {
                console.log('state back to hover');
                const { commitAction, PIXIComponentHoverNoCommit } = useBearStoreWithUndo.getState()
                commitAction() // end Drag, to hover
                if (typeof stateMachine.bucket.componentTargetId === "string" ) {
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
                            const {OSMLoadedDataAction} = useBearStoreWithUndo.getState()
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

export const defaultState = Idle;