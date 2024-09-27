import { Tag } from "../../api/osm/type";
import { T2Arr } from "../helper/object";

export function getPropFromTags(key: string, tags?: Tag | Tag[]): string|null {
    if (!tags) {
        return null;
    }
    const tagsArr = T2Arr(tags)
    for (let i = 0; i < tagsArr.length; i++) {
        const tag = tagsArr[i]
        if (tag["@_k"] === key ) {
            return tag["@_v"]
        }
    }
    return null;
}