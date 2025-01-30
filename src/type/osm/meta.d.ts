import { FeatureTypes, NumericString, LocalActionAttr } from "./refobj"

interface Tag {
    "@_k": string
    "@_v": string
}

interface Node extends LocalActionAttr {
    "@_id": NumericString,
    "@_visible": string,
    "@_version"?: string,
    "@_changeset"?: string,
    "@_timestamp"?: string,
    "@_user"?: string,
    "@_uid"?: string,
    "@_lat": number,
    "@_lon": number,
    tag?: Tag[]
} 

interface Nd {
    "@_ref": NumericString
}

interface Way extends LocalActionAttr {
    nd: Nd[],
    tag?: Tag[],
    "@_id": NumericString,
    "@_visible": string,
    "@_version"?: string,
    "@_changeset"?: string,
    "@_timestamp"?: string,
    "@_user"?: string,
    "@_uid"?: string
}

interface Member {
    "@_type": FeatureTypes,
    "@_ref": NumericString,
    "@_role"? : string
}

interface Relation extends LocalActionAttr {
    member: Member[],
    tag?: Tag[],
    "@_id": NumericString,
    "@_visible": string,
    "@_version"?: string,
    "@_changeset"?: string,
    "@_timestamp"?: string,
    "@_user"?: string,
    "@_uid"?: string
}

export interface OSMV06BBoxObj {
    "?xml": {
        "@_version": 1,
        "@_encoding": "UTF-8"
    },
    osm: {
        bounds: {
            "@_minlat": number,
            "@_minlon": number,
            "@_maxlat": number,
            "@_maxlon": number
        },
        node: Node[],
        way: Way[],
        relation: Relation[],
        "@_version": 0.6,
        "@_generator": string,
        "@_copyright": string,
        "@_attribution": string,
        "@_license": string
    }
}

export interface OSMV06FeatureObj {
    "?xml": {
        "@_version": 1,
        "@_encoding": "UTF-8"
    },
    osm: {
        node: Node 
        way: Way
        relation: Relation 
        "@_version": 0.6,
        "@_generator": string,
        "@_copyright": string,
        "@_attribution": string,
        "@_license": string
    }
}

export interface OSMV06BatchFeatureObj {
    "?xml": {
        "@_version": 1,
        "@_encoding": "UTF-8"
    },
    osm: {
        node: Node[] 
        way: Way[]
        relation: Relation[]
        "@_version": 0.6,
        "@_generator": string,
        "@_copyright": string,
        "@_attribution": string,
        "@_license": string
    }
}

// see https://wiki.openstreetmap.org/Relation | wiki/JOSM_file_format
export interface JSOMExportObj {
    "?xml": {
        "@_version": string,
        "@_encoding": "UTF-8"
    },
    osm: {
        bounds: {
            "@_minlat": number,
            "@_minlon": number,
            "@_maxlat": number,
            "@_maxlon": number,
            '@_origin': `${string}-BusFensi`
        },
        node: Node[] 
        way: Way[]
        relation: Relation[]
        "@_version": 0.6,
        "@_generator": "BusFensi",
        "@_copyright"?: string,
        "@_attribution"?: string,
        "@_license"?: string
    }
}