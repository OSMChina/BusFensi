import { getWGS84LocateByPixel } from "../../utils/geo/mapProjection";
import { deepCopy, deepMerge } from "../../utils/helper/object";
import { AbstractAction } from "./AbstractAction";

export class PIXIViewpointMove extends AbstractAction {
    /**
     * 
     * @param {Number} deltax
     * @param {Number} deltay 
     * @param {import('../states/type').Layers} layers
     * @param {import('pixi.js').Application} scene  
     */
    constructor(deltax, deltay, layers, scene) {
        super()
        /** @type {Number} */
        this.deltax = deltax
        /** @type {Number} */
        this.deltay = deltay
        /** @type {import('../states/type').Layers}*/
        this.layers = layers
        /** @type {import('pixi.js').Application} */
        this.scene = scene

        this.type = 'pixi-viewpoint-move'
    }
    do(state) {
        const { viewpoint, zoom } = state.view;
        const pixpoint = {
            x: this.deltax + this.scene.canvas.width / 2,
            y: this.deltay + this.scene.canvas.height / 2
        }
        const location = getWGS84LocateByPixel(pixpoint, viewpoint, zoom, this.scene.canvas.width, this.scene.canvas.height);
        this._redo = {
            view: {
                viewpoint: location
            }
        }
        this._undo = {
            view: {
                viewpoint: deepCopy(state.view.viewpoint)
            }
        }
        this._state = state;
        this._state.view.viewpoint = deepCopy(location);
        // then request data
        this.updateMap()
    }
    redo() {
        deepMerge(this._state, this._redo)
        // then call layer to update point
        this.updateMap()
    }
    undo() {
        deepMerge(this._state, this._undo)
        // then call layer to update point
        this.updateMap()
    }

    mergeAction(action, state) {
        if (action.type === this.type) {
            const { zoom } = state.view
            const { viewpoint } = action._undo.view // original viewpoint
            const pixpoint = {
                x: this.deltax + this.scene.canvas.width / 2,
                y: this.deltay + this.scene.canvas.height / 2
            }
            const location = getWGS84LocateByPixel(pixpoint, viewpoint, zoom, this.scene.canvas.width, this.scene.canvas.height);
            console.log("from", viewpoint, "to", location)

            this._redo = {
                view: {
                    viewpoint: location
                }
            }
            this._undo = action._undo;
            this._state = state;
            this._state.view.viewpoint = deepCopy(location);
            console.log('merged action')
            this.updateMap()
            return true;
        }
        return false
    }
    updateMap() {
        for (const key in this.layers) {
            if (Object.prototype.hasOwnProperty.call(this.layers, key)) {
                this.layers[key].updateViewpoint(this._state.view.viewpoint)
            }
        }
    }
}