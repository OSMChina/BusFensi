import { FeatureRefObj } from "../../osm/refobj";
import { BaseEvent } from "../baseEvent";
import { FederatedPointerEvent } from 'pixi.js';

export interface PointerWithOSMEvent extends BaseEvent, FederatedPointerEvent {
    componentTarget: FeatureRefObj;
}
