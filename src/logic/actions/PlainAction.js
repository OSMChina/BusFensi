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
    do() {
        /** @type {import('./type').DataState} */
        this._undo = {}
        /** @type {import('./type').DataState} */
        this._redo = {}
    }
}