import { FeatureRefObj } from "../../osm/refobj";
import { BaseEvent } from "../baseEvent";
import { FederatedMouseEvent, FederatedPointerEvent } from 'pixi.js';

export interface PointerWithOSMEvent extends BaseEvent, FederatedPointerEvent, FederatedMouseEvent {
    componentTarget: FeatureRefObj;
}
