import { OSMV06BBoxObj } from "../../../../type/osm/meta";

export interface RemoteAPISlice {
    bbox: OSMV06BBoxObj[],
    autoload: boolean
}

export const remoteApiInitialSlice = {
    bbox:[],
    autoload: true
}