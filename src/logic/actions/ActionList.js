import { PlainAction } from "./PlainAction"

class ActionList {
    /**
     * 
     */
    constructor() {
        const plain = new PlainAction();
        plain.do({});
        /** @type {import('./AbstractAction').AbstractAction} */
        this._tail = plain;
        /** @type {import('./AbstractAction').AbstractAction} */
        this._head = plain;
    }
    /**
     * @returns {import('./type').DataState}
     */
    get state() {
        return this._tail.state;
    }
    /**
     * @returns {import('./type').DataState}
     */
    get diff() {
        return this._tail.diff;
    }
    /**
     * do current action
     * 
     * @param {import('./AbstractAction').AbstractAction} action 
     */
    do(action) {
        if (action.mergeAction(this._tail, this.state)) {
            action.prev = this._tail.prev
            this._tail = action
        } else {
            action.do(this.state);
            this._tail.next = action;
            action.prev = this._tail;
            this._tail = action;
        }
    }

    undo() {
        if (this._tail.prev === null) return;
        this._tail.undo();
        this._tail = this._tail.prev;
    }

    redo() {
        if (this._tail.next === null) return;
        this._tail.redo();
        this._tail = this._tail.next;
    }
}

export const actionList = new ActionList();