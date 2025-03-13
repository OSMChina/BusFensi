import { Member } from "../../../../type/osm/meta"
import { NumericString } from "../../../../type/osm/refobj"

export type BusEditSlice = {
    routeEdit: {
        editing?: NumericString,
        step: number,
        stops: Member[]
    }
}

export const busEditInitialState: BusEditSlice = {
    routeEdit: {
        step: 0,
        stops: []
    }
}