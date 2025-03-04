import { WritableDraft } from "immer";
import { OSMMapStore } from "../../store";
import { PointWGS84 } from "../../../../utils/geo/types";
import { createLocalNodeHelper, modifyFeatureHelper } from "../meta/helper";
import { NumericString } from "../../../../type/osm/refobj";
import { HandlerTypeMap } from "../meta/type";
import { getNearestPointOnPolyline } from "../../../../utils/osm/featureLineProjection";

export function createLocalNodeWithModifierHelper(
    state: WritableDraft<OSMMapStore>,
    location: PointWGS84,
    modify: (feature: HandlerTypeMap["node"]) => void
): NumericString {
    const id = createLocalNodeHelper(state, location)
    modifyFeatureHelper(state, "node", id, modify)
    return id;
}

export function createLocalNodeOnWayWithModifierHelper(
    state: WritableDraft<OSMMapStore>,
    location: PointWGS84,
    modify: (feature: HandlerTypeMap["node"]) => void,
    wayid: NumericString
): NumericString {
    let nodeid: NumericString = '0';
    modifyFeatureHelper(state, "way", wayid, way => {
        const pointPath = way.nd.map(nd => state.meta.node[nd['@_ref']])
        const { nearestPoint, insertAfter } = getNearestPointOnPolyline(location, pointPath)
        nodeid = createLocalNodeWithModifierHelper(state, nearestPoint, modify);
        way.nd.splice(way.nd.findIndex(nd => nd['@_ref'] === insertAfter['@_id']) + 1, 0, { "@_ref": nodeid })
    })
    return nodeid;
}