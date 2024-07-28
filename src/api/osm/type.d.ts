interface Tag {
    k: string
    v: string
}

interface Node {
    "@_id": Number,
    "@_visible": Boolean,
    "@_version": Number,
    "@_changeset": Number,
    "@_timestamp": String,
    "@_user": StreamPipeOptions,
    "@_uid": Number,
    "@_lat": Number,
    "@_lon": Number,
    tag?: Tag | Array<Tag>
}

interface Nd {
    "@_ref": Number
}

interface Way {
    nd: Nd | Array<Nd>,
    tag?: Tag | Array<Tag>,
    "@_id": Number,
    "@_visible": Boolean,
    "@_version": Number,
    "@_changeset": Number,
    "@_timestamp": String,
    "@_user": String,
    "@_uid": Number
}

interface Member {
    "@_type": "way" | "node",
    "@_ref": number,
    "@_role": String
}

interface Relation {
    member: Member | Array<Member>,
    tag?: Tag | Array<Tag>,
    "@_id": Number,
    "@_visible": Boolean,
    "@_version": Number,
    "@_changeset": Number,
    "@_timestamp": String,
    "@_user": String,
    "@_uid": Number
}

export interface OSMV06BBoxObj {
    "?xml": {
        "@_version": 1,
        "@_encoding": "UTF-8"
    },
    osm: {
        bounds: {
            "@_minlat": Number,
            "@_minlon": Number,
            "@_maxlat": Number,
            "@_maxlon": Number
        },
        node: Node | Array<Node>,
        way: Way | Array<Way>,
        relation: Relation | Array<Relation>,
        "@_version": 0.6,
        "@_generator": String,
        "@_copyright": String,
        "@_attribution": String,
        "@_license": String
    }
}