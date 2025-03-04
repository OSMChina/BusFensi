import { Tag } from "../../type/osm/meta";
import { getPropFromTags } from "./getTag";

export function isStopArea(tag?: Tag[]) {
    tag = tag || []
    return getPropFromTags("public_transport") === "stop_area" &&
        getPropFromTags("type") === "public_transport"
}