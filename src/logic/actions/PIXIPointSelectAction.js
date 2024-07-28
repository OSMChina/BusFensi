import { deepMerge, deepReverseDiff } from "../../utils/helper/object";
import { AbstractAction } from "./AbstractAction";

export class PIXIPointSelectAction extends AbstractAction {
    /**
     * 
     * @param {import('../../pixi/layers/EditableLayer').EditableLayer} editableLayer 
     * @param {import('../../pixi/components/Point')} component 
     * @param {Boolean} [clear]
     */
    constructor(editableLayer, component, clear) {
        super()
        /** @type {import('../../pixi/layers/EditableLayer').EditableLayer} */
        this.editableLayer = editableLayer
        /** @type {import('../../pixi/components/Point')} */
        this.component = component

        this.type = 'pixi-point-select'
        if (clear) {
            /** @type {Boolean} */
            this.clear = true;
        }
    }
    /**
     * 
     * @param {import('./type').DataState} state 
     */
    do(state) {
        if (this.clear) {
            this._redo = {
                view: {
                    selectedComponent: [this.component]
                }
            }
        } else {
            this._redo = {
                view: {
                    selectedComponent: [...state.view.selectedComponent, this.component]
                }
            }
        }
        this._undo = deepReverseDiff(state, this._redo)
        this._state = state
        deepMerge(this._state, this._redo);
        this.updateUI()
    }

    undo() {
        deepMerge(this._state, this._undo)
        this.updateUI()
    }

    redo() {
        deepMerge(this._state, this._redo);
        this.updateUI()
    }

    updateUI(){
        // to be implimented
    }
}