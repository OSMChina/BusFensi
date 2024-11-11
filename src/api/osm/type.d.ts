
interface Tag {
    "@_k": string
    "@_v": string
}

interface Node {
    "@_id": string,
    "@_visible": string,
    "@_version"?: string,
    "@_changeset"?: string,
    "@_timestamp"?: string,
    "@_user"?: string,
    "@_uid"?: string,
    "@_lat": number,
    "@_lon": number,
    '@_action'?: "modify" | "delete", 
    tag?: Tag | Tag[]

}

interface Nd {
    "@_ref": string
}

interface Way {
    nd: Nd | Nd[],
    tag?: Tag | Tag[],
    "@_id": string,
    "@_visible": string,
    "@_version"?: string,
    "@_changeset"?: string,
    "@_timestamp"?: string,
    "@_user"?: string,
    "@_uid"?: string
    '@_action'?: "modify" | "delete", 
}

interface Member {
    "@_type": "way" | "node" | "relation",
    "@_ref": string,
    "@_role"? : string
}

interface Relation {
    member: Member | Member[],
    tag?: Tag | Tag[],
    "@_id": string,
    "@_visible": string,
    "@_version"?: string,
    "@_changeset"?: string,
    "@_timestamp"?: string,
    "@_user"?: string,
    "@_uid"?: string
    '@_action'?: "modify" | "delete", 
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
        node: Node | Node[],
        way: Way | Way[],
        relation: Relation | Relation[],
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
        node: Node | Node[] 
        way: Way | Way[]
        relation: Relation | Relation[]
        "@_version": 0.6,
        "@_generator": string,
        "@_copyright": string,
        "@_attribution": string,
        "@_license": string
    }
}

// see https://wiki.openstreetmap.org/wiki/JOSM_file_format
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