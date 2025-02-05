import { JSOMExportObj, OSMV06BBoxObj } from "../../type/osm/meta";
import { XMLBuilder } from 'fast-xml-parser';
import { FeatureMetaGroup } from "../../type/osm/refobj";

export function exportJOSMXML(meta: FeatureMetaGroup, deletedMeta: FeatureMetaGroup, bboxs: OSMV06BBoxObj[]): string {
    const exObj: JSOMExportObj = {
        "?xml": {
            "@_version": "1.0",
            "@_encoding": "UTF-8"
        },
        osm: {
            bounds: {
                "@_minlat": bboxs.reduce((pre, bbox) => Math.min(pre, bbox.osm.bounds["@_minlat"]), Infinity),
                "@_minlon": bboxs.reduce((pre, bbox) => Math.min(pre, bbox.osm.bounds["@_minlon"]), Infinity),
                "@_maxlat": bboxs.reduce((pre, bbox) => Math.max(pre, bbox.osm.bounds["@_maxlat"]), -Infinity),
                "@_maxlon": bboxs.reduce((pre, bbox) => Math.max(pre, bbox.osm.bounds["@_maxlon"]), -Infinity),
                '@_origin': `v0.0.2-BusFensi`
            },
            node: Object.values({
                ...meta.node,
                ...deletedMeta.node
            }),
            way: Object.values({
                ...meta.way,
                ...deletedMeta.way
            }),
            relation: Object.values({
                ...meta.relation,
                ...deletedMeta.relation
            }),
            "@_version": 0.6,
            "@_generator": "BusFensi",
        }
    }
    console.log(exObj, meta)
    const builder = new XMLBuilder({
        ignoreAttributes: ["localStates"],
        attributeNamePrefix: "@_",
        suppressBooleanAttributes: false,
    })
    const xml = builder.build(exObj)
    console.log(xml)
    return xml;
}