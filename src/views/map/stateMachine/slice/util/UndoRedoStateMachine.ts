import { StoreType } from "../../../../../type/stateMachine/baseEvent";
import { BaseStateMachine, StateItem } from "../../state";

export class UndoRedoStateMachine extends BaseStateMachine {
    idle: StateItem
    constructor(store: StoreType) {
        super(store)
        this.idle = new StateItem("undo-redo-idle")

        this.entry = this.idle
        this.current = this.idle
        this.accept = [this.idle]

        this.idle.appendNext(this.idle, {
            transform: (event) => {
                if (event.type === 'keydown') {
                    const ev = event as KeyboardEvent
                    const { undo, redo } = this.context.store.meta.temporal.getState()
                    if (ev.code === 'KeyZ') {
                        if (ev.shiftKey && ev.ctrlKey) {
                            console.log('redo')
                            redo()
                            return true
                        } else if (ev.ctrlKey) {
                            console.log('undo')
                            undo()
                            return true
                        }
                    }
                }
                if (event.type === "utils-undo") {
                    const { undo } = this.context.store.meta.temporal.getState()
                    console.log('undo')
                    undo()
                    return true;
                }
                if (event.type === "utils-redo") {
                    const { redo } = this.context.store.meta.temporal.getState()
                    console.log('redo')
                    redo()
                    return true;
                }
                return false
            },
        })
    }
}