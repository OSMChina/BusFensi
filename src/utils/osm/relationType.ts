import { Tag } from "../../type/osm/meta";
import { RELATION_TYPES } from "./featureTypeEnum";
import { getPropFromTags } from "./getTag";

export function isStopArea(tag?: Tag[]) {
    tag = tag || []
    return getPropFromTags("public_transport", tag) === "stop_area" &&
        getPropFromTags("type", tag) === "public_transport"
}

export function isRoute(tag?: Tag[]) {
    tag = tag || []
    return getPropFromTags("type", tag) === "route"
}

export function isRouteMaster(tag?: Tag[]) {
    tag = tag || []
    return getPropFromTags("type", tag) === "route_master"
}

export function getRelationType(tag?: Tag[]) {
    if (!tag) {
        return undefined
    }
    if (isStopArea(tag)) {
        return 
    } else if (isRoute(tag)) {
        return RELATION_TYPES.ROUTE
    } else if (isRouteMaster(tag)) {
        return RELATION_TYPES.ROUTE_MASTER
    }
}