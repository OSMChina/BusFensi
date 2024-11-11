import { NodesObj, RelationsObj, WaysObj } from "../../logic/model/type";
import { JSOMExportObj, OSMV06BBoxObj } from "./type";
import { XMLBuilder } from 'fast-xml-parser';

export function exportJOSMXML(renderedOSMFeatureMeta: {
    nodes: NodesObj,
    ways: WaysObj,
    relations: RelationsObj
}, deletedOSMFeatureMeta: {
    nodes: NodesObj,
    ways: WaysObj,
    relations: RelationsObj
}, bboxs: OSMV06BBoxObj[]
): string {
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
                '@_origin': `-BusFensi`
            },
            node: Object.values({
                ...renderedOSMFeatureMeta.nodes,
                ...deletedOSMFeatureMeta.nodes
            }),
            way: Object.values({
                ...renderedOSMFeatureMeta.ways,
                ...deletedOSMFeatureMeta.ways
            }),
            relation: Object.values({
                ...renderedOSMFeatureMeta.relations,
                ...deletedOSMFeatureMeta.relations
            }),
            "@_version": 0.6,
            "@_generator": "BusFensi",
        }
    }
    console.log(exObj, renderedOSMFeatureMeta)
    const builder = new XMLBuilder({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        suppressBooleanAttributes: false,
    })
    const xml = builder.build(exObj)
    console.log(xml)
    return xml;
}