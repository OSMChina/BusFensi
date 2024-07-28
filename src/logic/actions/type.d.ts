import { OSMV06BBoxObj } from "../../api/osm/type"
import { AbstractComponent } from "../../pixi/components/AbstructComponent"
import { PointWGS84 } from "../../utils/geo/types"

export interface DataState {
    /** changes may be uploaded */
    edit: any,
    /** local changes like viewpoint, won't be uploaded */
    view: {
        viewpoint: PointWGS84
        zoom: Number
        selectedComponent: Array<AbstractComponent>
        bboxs: Array<OSMV06BBoxObj>
    }
}