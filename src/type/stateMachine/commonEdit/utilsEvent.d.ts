import { BaseEvent } from "../baseEvent";

export interface UndoRedoEvent extends BaseEvent {
    type: "utils-undo" | "utils-redo"
}

export interface MetaActionsEvent extends BaseEvent {
    type: "add-node" | "add-node-on-way" | "split-way"
}

export type UtilStateEvents = UndoRedoEvent | MetaActionsEvent | KeyboardEvent