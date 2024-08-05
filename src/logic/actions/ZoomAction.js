import { deepMerge, deepReverseDiff } from "../../utils/helper/object";
import { AbstractAction } from "./AbstractAction";
import { actionList } from "./ActionList";
import { loadBBox, OSMLoadDataAction } from "./OSMLoadedDataAction";
const MAXZOOM = 19; // 先假设后面会更的

export class ZoomAction extends AbstractAction {
    /**
     * 
     * @param {Boolean} axis 
     * @param {import('../states/type').Layers} layers
     * @param {import('pixi.js').Application} scene  
     */
    constructor(axis, layers, scene) {
        super();
        this.axis = axis;
        this.type = 'zoom'
        this.layers = layers
        this.scene = scene
    }
    do(state) {
        this._state = state
        const zoom = this._state.view.zoom + (this.axis ? 1 : -1);
        console.log(`zoom from ${this.state.view.zoom} to ${zoom}`)
        if (zoom > MAXZOOM) {
            this._redo = {}
            this._undo = {}
            this._state = state
            return
        }
        this._redo = {
            view: {
                zoom: zoom
            }
        }
        this._undo = deepReverseDiff(state, this._redo)
        deepMerge(this._state, this._redo);
        loadBBox(this._state, this._state.view.viewpoint, this._state.view.zoom, this.scene.canvas.width, this.scene.canvas.height)
            .then(bboxObj => {
                if (bboxObj?.osm?.bounds) {
                    const osmLoadedDataAction = new OSMLoadDataAction(this.layers, bboxObj);
                    actionList.do(osmLoadedDataAction);
                }
            })
        this.updateMap()
    }
    redo() {
        deepMerge(this._state, this._redo)
        this.updateMap()
    }
    undo() {
        deepMerge(this._state.this._undo)
        this.updateMap()
    }
    updateMap() {
        for (const key in this.layers) {
            if (Object.prototype.hasOwnProperty.call(this.layers, key)) {
                this.layers[key].updateZoom(this._state.view.zoom)
            }
        }
    }
}