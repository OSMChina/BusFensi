import { ComponentStateContext } from "../../../views/map/stateMachine/slice/components/helper";
import { FeatureRefObj } from "../../osm/refobj";
import { RightClickMenuProps } from "../../view/map";
import { BaseContext } from "../baseEvent";
import { PointerWithOSMEvent } from "../commonEdit/componentEvent";
import { PointerOnMapViewEvent } from "../commonEdit/mapViewEvent";

export type PtEditEvents = PointerOnMapViewEvent | PointerWithOSMEvent | KeyboardEvent

export interface PtEditRightClickMenus {
    busStop: (props: RightClickMenuProps) => void,
    stopPosition: (props: RightClickMenuProps) => void
}
export type PtEditContext = BaseContext & {
    rightClickMenus: PtEditRightClickMenus
}
export type FeatureClassifyFun = (target: FeatureRefObj, context: ComponentStateContext) => boolean
