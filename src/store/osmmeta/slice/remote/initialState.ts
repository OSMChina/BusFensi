import { OSMV06BBoxObj } from "../../../../type/osm/meta";

export interface RemoteAPISlice {
    bbox: OSMV06BBoxObj[]
}

export const remoteApiInitialSlice = {
    bbox:[]
}