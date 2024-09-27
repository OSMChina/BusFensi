import { Tag } from "../../api/osm/type";
import { osmOneWayTags, osmRemoveLifecyclePrefix, osmRightSideIsInsideTags, OSMTagFilterObj } from "./tags";

export function wayIsHighway(tags: Tag[]): boolean {
    return tags.some(tag => tag["@_k"] === 'highway')
}

export function wayIsOneWay(tags: Tag[]): boolean {
    // explicit oneway
    const values = {
        'yes': true,
        '1': true,
        '-1': true,
        'reversible': true,
        'alternating': true,
        'no': false,
        '0': false
    };
    let ret = null;
    tags.forEach(tag => {
        if (tag["@_k"] === 'oneway' && values[tag["@_v"] as keyof typeof values]) {
            ret = values[tag["@_v"] as keyof typeof values]
        }
    })

    if (ret !== null) {
        return ret
    }

    tags.forEach(tag => {
        if (tag["@_k"] in osmOneWayTags &&
            tag["@_v"] in osmOneWayTags[tag["@_k"] as keyof OSMTagFilterObj]) {
            ret = true
        }
    })

    return ret ? true : false
}

export function wayIsSided(tags: Tag[]): boolean {
    const sidednessIdentifier = () => {
        for (let i = 0; i < tags.length; i++) {
            const realKey = tags[i]["@_k"]
            const value = tags[i]["@_v"]
            const key = osmRemoveLifecyclePrefix(realKey);
            if (
                key in osmRightSideIsInsideTags
                && (value in osmRightSideIsInsideTags[key as keyof OSMTagFilterObj])
            ) {
                if (osmRightSideIsInsideTags[key as keyof OSMTagFilterObj][value]) {
                    return key;
                } else {
                    // if the map's value is something other than a
                    // literal true, we should use it so we can
                    // special case some keys (e.g. natural=coastline
                    // is handled differently to other naturals).
                    return osmRightSideIsInsideTags[key as keyof OSMTagFilterObj][value]
                }
            }
        }
        return null
    }
    if (tags.some(tag => tag["@_k"] === 'two_sided' && tag["@_v"] === 'yes')) {
        return false
    }
    return sidednessIdentifier() !== null
}
