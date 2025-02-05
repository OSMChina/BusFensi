import { BaseEvent } from "../baseEvent";
import { FederatedPointerEvent, FederatedWheelEvent } from 'pixi.js';

export type PointerOnMapViewEvent = BaseEvent & FederatedPointerEvent & FederatedWheelEvent