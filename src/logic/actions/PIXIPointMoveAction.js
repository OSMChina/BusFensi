import { deepMerge, deepReverseDiff } from "../../utils/helper/object";
import { AbstractAction } from "./AbstractAction";

export class PIXIPointMoveAction extends AbstractAction {
    constructor(point, location) {
        super()
        this.point = point
        this.location = location
        this.type = 'pixi-point-move'
    }
    do(state) {
        this._redo = {
            edit: { }
        }
        this._redo.edit[this.point.id] = this.location
        this._undo = deepReverseDiff(state, this._redo)
        this._state = state;
        deepMerge(this._state, this._redo);
    }
    redo(){
        deepMerge(this._state, this._redo)
        // then call layer to update point
    }
    undo(){
        deepMerge(this._state, this._undo) 
        // then call layer to update point
    }
}