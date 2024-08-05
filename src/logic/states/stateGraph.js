import { getWGS84LocateByPixel } from '../../utils/geo/mapProjection';
import { actionList } from '../actions/ActionList';
import { loadBBox, OSMLoadDataAction } from '../actions/OSMLoadedDataAction';
import { PIXIPointMoveAction } from '../actions/PIXIPointMoveAction';
import { PIXIPointSelectAction } from '../actions/PIXIPointSelectAction';
import { PIXIViewpointMove } from '../actions/PIXIViewpointMove';
import { ZoomAction } from '../actions/ZoomAction';
import { stateMachine } from './stateMachine'
/** @type {import('./type').State} */
const Idle = {
    type: 'idle',
    /**
     * 
     * @param {import('pixi.js').FederatedEvent} event 
     */
    retain: (event) => {
        if (event.type === 'wheel') {
            // wheel roll, zoom in or out
            const axis = event.deltaY > 0;
            const zoomAction = new ZoomAction(axis, stateMachine.layers, stateMachine.scene);
            actionList.do(zoomAction);
        }
        return true;
    }
}

// components states begin::
/** @type {import('./type').State} */
const ComponentHover = {
    type: 'component-hover',
    retain: () => {
        return true;
    }
}

/** @type {import('./type').State} */
const componentMousedown = {
    type: 'component-mousedown',
    retain: () => {
        return true;
    }
}

const doComponentDraging = (x, y) => {
    const { height, width } = stateMachine.scene.canvas;
    const { viewpoint, zoom } = actionList.state.view;
    const location = getWGS84LocateByPixel({ x: x, y: y }, viewpoint, zoom, width, height);
    const pointMoveAction = new PIXIPointMoveAction(stateMachine.bucket.componentTarget, location, { x: x, y: y }, stateMachine.layers);
    actionList.do(pointMoveAction)
}
/** @type {import('./type').State} */
const componentDrag = {
    type: 'component-drag',
    retain: (event) => {
        if (event.type === 'pointermove') {
            const {x, y} = event.global
            doComponentDraging(x, y)
        }
        return true;
    }
}
// components states end::

// map states begin::
/** @type {import('./type').State} */
const mapDrag = {
    type: 'map-drag',
    retain: (event) => {
        if (event.type === 'pointermove') {
            const { x, y } = event.global;
            const [deltax, deltay] = [stateMachine.bucket.mapDrag.x - x, stateMachine.bucket.mapDrag.y - y]
            console.log('moving to', deltax, deltay)
            const viewpointMoveAction = new PIXIViewpointMove(deltax, deltay, stateMachine.layers, stateMachine.scene);
            actionList.do(viewpointMoveAction);
            actionList.enableMerge = true;
        }
        return true;
    }
}
// map states end::

Idle.nxt = [{
    state: ComponentHover,
    transfer: (event) => {
        if (['pointerenter', 'pointerover'].includes(event.type) && stateMachine.target) {
            stateMachine.bucket = {}
            stateMachine.bucket.componentTarget = stateMachine.target
            stateMachine.bucket.componentTarget.hovered = true;
            console.log('component hovered:', stateMachine.target)
            return true;
        }
        return false;
    }
}, {
    state: mapDrag,
    transfer: (event) => {
        if (event.type === 'pointerdown' && !stateMachine.bucket?.componentTarget) {
            stateMachine.bucket = {}
            stateMachine.bucket.mapDrag = { x: event.global.x, y: event.global.y }
            console.log('to mapDrag state')
            return true;
        }
    }
}];

ComponentHover.nxt = [{
    state: componentMousedown,
    transfer: (event) => {
        if (event.type === 'pointerdown') {
            stateMachine.bucket.componentTarget.hovered = false;
            return true;
        }
        return false;
    },
}, {
    state: Idle,
    transfer: (event) => {
        if (['pointerleave', 'pointerout'].includes(event.type)) {
            stateMachine.bucket.componentTarget.hovered = false;

            stateMachine.bucket.componentTarget = null;
            console.log('quit hovered', stateMachine.bucket.componentTarget)

            return true;
        }
        return false;
    },
}
]

componentMousedown.nxt = [{
    state: componentDrag,
    transfer: (event) => {
        if (event.type === 'pointermove') {
            const { x, y } = event.global;
            doComponentDraging(x, y)
            actionList.enableMerge = true
            return true;
        }
    }
}, {
    state: Idle,
    transfer: (event) => {
        if (event.type === 'pointerup' || event.type === 'pointerupouside') {
            // mouse down and up, means select
            const pointSelect = new PIXIPointSelectAction(stateMachine.layers.editableLayer, stateMachine.bucket.componentTarget);
            stateMachine.bucket.componentTarget = null;
            actionList.do(pointSelect);
            return true;
        }
    },
}]

componentDrag.nxt = [{
    state: ComponentHover,
    transfer: (event) => {
        if (event.type === 'pointerup') {
            console.log('state back to hover')
            actionList.enableMerge = false
            return true;
        }
        return false;
    }
}, {
    state: Idle,
    transfer: (event) => {
        if (event.type === 'pointerupoutside') {
            stateMachine.bucket.componentTarget = null
            actionList.enableMerge = false
            console.log('state back to idle')
        }
    }
}]

mapDrag.nxt = [{
    state: Idle,
    transfer: (event) => {
        if (event.type === 'pointerup' || event.type === 'pointerupoutside') {
            actionList.enableMerge = false
            stateMachine.bucket = {}
            // request map data
            const { viewpoint, zoom } = actionList.state.view;
            const { width, height } = stateMachine.scene.canvas
            loadBBox(actionList.state, viewpoint, zoom, width, height)
                .then(bboxObj => {
                    if (bboxObj?.osm?.bounds) {
                        const osmLoadedDataAction = new OSMLoadDataAction(stateMachine.layers, bboxObj);
                        actionList.do(osmLoadedDataAction);
                    }
                }).catch(err => { console.log(err) })
            return true;
        }
        return false;
    }
}]
export const defaultState = Idle;