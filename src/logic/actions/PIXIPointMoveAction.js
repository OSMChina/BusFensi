import { deepMerge } from "../../utils/helper/object";
import { AbstractAction } from "./AbstractAction";

export class PIXIPointMoveAction extends AbstractAction {
    /**
     * 
     * @param {import("../../pixi/components/Point").Point} point 
     * @param {import("../../utils/geo/types").PointWGS84} location 
     * @param {import("../../utils/geo/types").PointPixel} pixpoint
     * @param {import("../states/type").Layers} layers 
     */
    constructor(point, location, pixpoint, layers) {
        super()
        this.point = point
        this.location = location
        this.pixpoint = pixpoint
        this.layers = layers
        this.type = 'pixi-point-move'
    }
    do(state) {
        this._redo = {
            edit: {}
        }
        this._undo = {
            edit: {}
        }
        this.pixpointOrigin = { x: this.point.container.position.x, y: this.point.container.position.y }

        this._redo.edit[this.point.id] = { location: this.location }
        this._state = state
        if (typeof state.edit[this.point.id] === "object") {
            this._undo.edit[this.point.id] = { location: this.location }
            state.edit[this.point.id].location = this.location
        } else {
            this._undo.edit[this.point.id] = {}
            state.edit[this.point.id] = { location: this.location }
        }
        this.updatePoint(this.location)
    }
    redo() {
        deepMerge(this._state, this._redo)
        // then call layer to update point
    }
    undo() {
        deepMerge(this._state, this._undo)
        // then call layer to update point
    }
    /**
     * 尝试是否可以合并到队尾，为了避免过多重复 Action
     * 
     * @param {PIXIPointMoveAction} action 
     * @param {import('./type').DataState} state 
     * @returns {Boolean} 
     */
    mergeAction(action, state) {
        if (action.type !== this.type) return false
        this._undo = action._undo
        this.pixpointOrigin = action.pixpointOrigin
        this._redo = {
            edit: {}
        }
        this._redo.edit[this.point.id] = { location: this.location }
        state.edit[this.point.icon].locate = this.location
        this.updatePoint(this.location)
    }
    updatePoint(locate) {
        this.layers.editableLayer.updatePointLocation(this.point.id, locate);
    }
}