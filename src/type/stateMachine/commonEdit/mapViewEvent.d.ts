import { BaseEvent } from "../baseEvent";

export type PointerOnMapViewEvent = BaseEvent & React.PointerEvent<HTMLCanvasElement>
    | BaseEvent & React.WheelEvent<HTMLCanvasElement>