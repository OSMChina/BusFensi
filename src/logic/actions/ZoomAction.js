import { deepMerge, deepReverseDiff } from "../../utils/helper/object";
import { AbstractAction } from "./AbstractAction";
import { actionList } from "./ActionList";
import { loadBBox, OSMLoadDataAction } from "./OSMLoadedDataAction";
const MAXZOOM = 19; // 先假设后面会更的

export class ZoomAction extends AbstractAction {
    /**
     * 
     * @param {Boolean} axis 
     */
    constructor(axis) {
        super();
        this.axis = axis;
        this.type = 'zoom'
    }
    do(state) {
        const zoom = this.state.view.zoom + this.axis ? 1 : -1;
        if (zoom > MAXZOOM) {
            this._redo = {}
            this._undo = {}
            this.state = state
            return
        }
        this._redo = {
            view: {
                zoom: zoom
            }
        }
        this._undo = deepReverseDiff(state, this._redo)
        deepMerge(this._state, this._redo);
        loadBBox(this._state)
            .then(bboxObj => {
                if (bboxObj.osm.bounds) {
                    const osmLoadedDataAction = new OSMLoadDataAction(this.layer, bboxObj);
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
        // 等以后实现
    }
}