import { Tag } from "../../type/osm/meta";
import { getPropFromTags } from "./getTag";

export function isStopArea(tag?: Tag[]) {
    tag = tag || []
    return getPropFromTags("public_transport", tag) === "stop_area" &&
        getPropFromTags("type", tag) === "public_transport"
}

export function getRelationType(tag?: Tag[]) {
    if (!tag) {
        return undefined
    }
    if (isStopArea(tag)) {
        return "Stop Area"
    }
}