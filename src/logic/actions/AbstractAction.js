import { deepMerge } from '../../utils/helper/object'

export class AbstractAction {
    /**
     * Action 是组成 Edit list 的结点，对应了编辑时的操作
     * Action 跟踪 state 的状态，拥有 next 和 prev 方法
     * 可以根据自己内部存储的信息将状态进行正向和反向转移
     * 
     * Edit list 是在编辑操作的时使用的数据结构，这个结构
     * 是将 Action 作为结点的双向链表，允许前进和后退
     * 
     * 为了避免很多重复的 Action 占据队列，部分 Action
     * 可以在一定情况下合并，比如 Move 。
     * 
     */
    constructor() {
        /** @type {import('./type').DataState} */
        this._state = null
        /** @type {import('./type').DataState} */
        this._undo = null
        /** @type {import('./type').DataState} */
        this._redo = null
        /** @type {AbstractAction} */
        this.prev = null
        /** @type {AbstractAction} */
        this.next = null
        /** @type {String} */
        this.type = "abstact";

    }
    /** 
     * Return state of this Action
     * 
     * @return {import('./type').DataState}
     */
    get state() {
        return this._state
    }

    /**
     * return diff of Action
     * 
     * @return {import('./type').DataState}
     */
    get diff() {
        return this._redo
    }

    /**
     * Undo, return state after undo
     * 
     * @returns {import('./type').DataState}
     */
    undo() {
        deepMerge(this._state, this._undo)
        return this._state
    }

    /**
     * Redo, return state after redo
     * 
     * @returns {import('./type').DataState}
     */
    redo() {
        deepMerge(this._state, this._redo)
        return this._state
    }

    /**
     * should fill this._undo and this._redo. recommended to
     * be only used in edit list's do function.
     * 
     * @param {import('./type').DataState} state 
     */
    do(state) {
        this._state = state;
    }
    /**
     * 尝试是否可以合并到队尾，为了避免过多重复 Action
     * 
     * @param {*} action 
     * @param {*} state 
     * @returns {Boolean} 
     */
    // eslint-disable-next-line no-unused-vars
    mergeAction(action, state) {
        return false;
    }
}