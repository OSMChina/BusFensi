import { FeatureRefObj } from "../../osm/refobj"

export interface RightClickMenuProps {
    x: number,
    y: number,
    feature?: FeatureRefObj
    open: boolean
}