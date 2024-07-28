import { deepMerge, deepReverseDiff } from "../../utils/helper/object";
import { AbstractAction } from "./AbstractAction";
import { actionList } from "./ActionList";
import { loadBBox, OSMLoadDataAction } from "./OSMLoadedDataAction";

export class PIXIViewpointMove extends AbstractAction {
    constructor(location, layer) {
        super()
        this.location = location
        this.layer = layer
        this.type = 'pixi-viewpoint-move'
    }
    do(state) {
        this._redo = {
            view: {
                viewpoint: this.location
            }
        }
        this._undo = deepReverseDiff(state, this._redo)
        this._state = state;
        deepMerge(this._state, this._redo);
        // then request data
        loadBBox(this._state)
            .then(bboxObj => {
                if (bboxObj.osm.bounds) {
                    const osmLoadedDataAction = new OSMLoadDataAction(this.layer, bboxObj);
                    actionList.do(osmLoadedDataAction);
                }
            })
    }
    redo(){
        deepMerge(this._state, this._redo)
        // then call layer to update point
        this.updateMap()
    }
    undo(){
        deepMerge(this._state, this._undo)
        // then call layer to update point
        this.updateMap()
    }

    mergeAction(action, state) {
        if (action.type === this.type) {
            this._redo = {
                view: {
                    viewpoint: this.location
                }
            }
            this._undo = action._undo;
            this._state = state;
            deepMerge(this._state, this._redo);
            this.updateMap()
            return true
        }
        return false
    }
    updateMap() {
        // 等以后实现
    }
}