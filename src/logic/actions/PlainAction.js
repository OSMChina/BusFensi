import { deepReverseDiff } from "../../utils/helper/object";
import { AbstractAction } from "./AbstractAction";

export class PlainAction extends AbstractAction {
    /**
     * A plain action that actually do nothing
     * 
     * @param {import('./type').DataState} state 
     */
    constructor(state) {
        super(state)
        this.type = "plain"
    }
    /**
     * do nothing
     */
    do(state) {
        if (this._state === null) {
            this._state = state
        }
        /** @type {import('./type').DataState} */
        this._undo = deepReverseDiff(this._state, state);
        /** @type {import('./type').DataState} */
        this._redo = state

        console.log(`On init action`, this._state)
    }
}