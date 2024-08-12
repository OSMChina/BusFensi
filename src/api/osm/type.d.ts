interface Tag {
    "@_k": string
    "@_v": string
}

interface Node {
    "@_id": number,
    "@_visible": boolean,
    "@_version": number,
    "@_changeset": number,
    "@_timestamp": string,
    "@_user": StreamPipeOptions,
    "@_uid": number,
    "@_lat": number,
    "@_lon": number,
    tag?: Tag | Array<Tag>
}

interface Nd {
    "@_ref": number
}

interface Way {
    nd: Nd | Array<Nd>,
    tag?: Tag | Array<Tag>,
    "@_id": number,
    "@_visible": boolean,
    "@_version": number,
    "@_changeset": number,
    "@_timestamp": string,
    "@_user": string,
    "@_uid": number
}

interface Member {
    "@_type": "way" | "node",
    "@_ref": number,
    "@_role": string
}

interface Relation {
    member: Member | Array<Member>,
    tag?: Tag | Array<Tag>,
    "@_id": number,
    "@_visible": boolean,
    "@_version": number,
    "@_changeset": number,
    "@_timestamp": string,
    "@_user": string,
    "@_uid": number
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
        node: Node | Array<Node>,
        way: Way | Array<Way>,
        relation: Relation | Array<Relation>,
        "@_version": 0.6,
        "@_generator": string,
        "@_copyright": string,
        "@_attribution": string,
        "@_license": string
    }
}