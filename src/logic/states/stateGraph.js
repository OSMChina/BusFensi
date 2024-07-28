import { getWGS84LocateByPixel } from '../../utils/geo/mapProjection';
import { actionList } from '../actions/ActionList';
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
            const zoomAction = new ZoomAction(axis);
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

/** @type {import('./type').State} */
const componentDrag = {
    type: 'component-drag',
    retain: (event) => {
        if (event.type === 'pointermove') {
            const { x, y } = event.global;
            stateMachine.target.container.position.set(x, y);
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
            const { height, width } = stateMachine.scene.canvas;
            const { viewpoint, zoom } = actionList.state.view.viewpoint;
            const vn = getWGS84LocateByPixel({ x: x, y: y }, viewpoint, zoom, width, height)
            const viewpointMoveAction = new PIXIViewpointMove(vn, stateMachine.layers.editableLayer);
            actionList.do(viewpointMoveAction);
        }
        return true;
    }
}
// map states end::

Idle.nxt = [{
    state: ComponentHover,
    transfer: (event) => {
        if (event.type === 'pointerenter' && stateMachine.target) {
            stateMachine.target.hovered = true;
            return true;
        }
        return false;
    }
}, {
    state: mapDrag,
    transfer: (event) => {
        if (event.type === 'pointerdown' && !stateMachine.target) {
            return true;
        }
    }
}];

ComponentHover.nxt = [{
    state: componentMousedown,
    transfer: (event) => {
        if (event.type === 'pointerdown') {
            stateMachine.target.hovered = false;
            return true;
        }
        return false;
    },
}, {
    state: Idle,
    transfer: (event) => {
        if (event.type === 'pointerleave') {
            stateMachine.target.hovered = false;
            stateMachine.target = null;
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
            stateMachine.target.container.position.set(x, y);
            return true;
        }
    }
}, {
    state: Idle,
    transfer: (event) => {
        if (event.type === 'pointerup' || event.type === 'pointerupouside') {
            // mouse down and up, means select
            const pointSelect = new PIXIPointSelectAction(stateMachine.layers.editableLayer, stateMachine.target);
            actionList.do(pointSelect);
            stateMachine.target = null;
            return true;
        }
    },
}]

componentDrag.nxt = [{
    state: Idle,
    transfer: (event) => {
        if (event.type === 'pointerup' || event.type === 'pointerupoutside') {
            const { x, y } = stateMachine.target.container.position;
            const { height, width } = stateMachine.scene.canvas;
            const { viewpoint, zoom } = actionList.state.view.viewpoint;
            const location = getWGS84LocateByPixel({ x: x, y: y }, viewpoint, zoom, width, height);
            const pointMoveAction = new PIXIPointMoveAction(stateMachine.target, location);
            actionList.do(pointMoveAction)
            stateMachine.target = null
            return true;
        }
        return false;
    }
}]

mapDrag.nxt = [{
    state: Idle,
    transfer: (event) => {
        if (event.type === 'pointerup' || event.type === 'pointerupoutside') {
            // request map data
            return true;
        }
        return false;
    }
}]
export const defaultState = Idle;