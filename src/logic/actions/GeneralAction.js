import { AbstractAction } from "./AbstractAction";
import { deepMerge, deepReverseDiff } from "../../utils/helper/object";
/**
 * Callback function type.
 * 
 * @callback callback
 * @param {object} state - The current state object after change.
 * @param {object} diff - The difference object representing changes to the state.
 */
export class GeneralAction extends AbstractAction {
    /**
     * 
     * 
     * @param {import('./type').DataState} state
     * @param {import('./type').DataState} diff
     * @param {String} [type] 
     * @param {callback} onDo
     * @param {callback} onUndo
     * @param {callback} onRedo 
     */
    constructor(state, diff, type, onDo, onUndo, onRedo) {
        super(state);
        this._redo = diff;
        this._undo = deepReverseDiff(state, diff);
        this.type = type || "general(or undefined, lol)";
        this._onDo = onDo;
        this._onUndo = onUndo;
        this._onRedo = onRedo;
    }

    do() {
        deepMerge(this.state, this._redo)
        this._onDo(this.state, this._redo)
    }

    redo(){
        deepMerge(this.state, this._redo)
        this._onRedo(this.state, this._redo)
    }

    undo() {
        deepMerge(this.state, this._undo)
        this._onUndo(this.state, this._undo)
    }
}