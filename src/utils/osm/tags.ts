/**
 * This file is adapted from the https://github.com/facebook/Rapid under the ISC License.
 * Original License: ISC (see below)
 * 
 * ISC License:
 * 
 * Copyright (c) 2024, Rapid Contributors
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE. 
 */

export interface OSMTagFilterObj {
    [id: string]: {
        [id: string]: boolean
    }
}

export function osmIsInterestingTag(key: string) {
    return key !== 'attribution' &&
        key !== 'created_by' &&
        key !== 'source' &&
        key !== 'odbl' &&
        key.indexOf('source:') !== 0 &&
        key.indexOf('source_ref') !== 0 && // purposely exclude colon
        key.indexOf('tiger:') !== 0;
}

export const osmLifecyclePrefixes = {
    // nonexistent, might be built
    proposed: true, planned: true,
    // under maintentance or between groundbreaking and opening
    construction: true,
    // existent but not functional
    disused: true,
    // dilapidated to nonexistent
    abandoned: true, was: true,
    // nonexistent, still may appear in imagery
    dismantled: true, razed: true, demolished: true, destroyed: true, removed: true, obliterated: true,
    // existent occasionally, e.g. stormwater drainage basin
    intermittent: true
};

/** @param {string} key */
export function osmRemoveLifecyclePrefix(key: string) {
    const keySegments = key.split(':');
    if (keySegments.length === 1) return key;

    if (keySegments[0] in osmLifecyclePrefixes) {
        return key.slice(keySegments[0].length + 1);
    }

    return key;
}


export const osmAreaKeysExceptions: OSMTagFilterObj = {
    amenity: {
        bicycle_parking: true
    },
    highway: {
        elevator: true,
        rest_area: true,
        services: true
    },
    public_transport: {
        platform: true
    },
    railway: {
        platform: true,
        roundhouse: true,
        station: true,
        traverser: true,
        turntable: true,
        ventilation_shaft: true,
        wash: true
    },
    traffic_calming: {
        island: true
    },
    waterway: {
        dam: true
    }
};

export const osmOneWayTags: OSMTagFilterObj = {
    'aerialway': {
        'chair_lift': true,
        'drag_lift': true,
        'j-bar': true,
        'magic_carpet': true,
        'mixed_lift': true,
        'platter': true,
        'rope_tow': true,
        't-bar': true,
        'zip_line': true
    },
    'highway': {
        'motorway': true
    },
    'junction': {
        'circular': true,
        'roundabout': true
    },
    'man_made': {
        'goods_conveyor': true,
        'piste:halfpipe': true
    },
    'piste:type': {
        'downhill': true,
        'sled': true,
        'yes': true
    },
    'roller_coaster': {
        'track': true
    },
    'seamark:type': {
        'two-way_route': true,
        'recommended_traffic_lane': true,
        'separation_lane': true,
        'separation_roundabout': true
    },
    'waterway': {
        'canal': true,
        'ditch': true,
        'drain': true,
        'fish_pass': true,
        'flowline': true,
        'pressurised': true,
        'river': true,
        'spillway': true,
        'stream': true,
        'tidal_channel': true
    }
};

// solid and smooth surfaces akin to the assumed default road surface in OSM
export const osmPavedTags: OSMTagFilterObj = {
    'surface': {
        'paved': true,
        'asphalt': true,
        'concrete': true,
        'chipseal': true,
        'concrete:lanes': true,
        'concrete:plates': true
    },
    'tracktype': {
        'grade1': true
    }
};

// solid, if somewhat uncommon surfaces with a high range of smoothness
export const osmSemipavedTags: OSMTagFilterObj = {
    'surface': {
        'cobblestone': true,
        'cobblestone:flattened': true,
        'unhewn_cobblestone': true,
        'sett': true,
        'paving_stones': true,
        'metal': true,
        'wood': true
    }
};

export const osmRightSideIsInsideTags: OSMTagFilterObj = {
    'natural': {
        'cliff': true,
        'coastline': true,
    },
    'barrier': {
        'retaining_wall': true,
        'kerb': true,
        'guard_rail': true,
        'city_wall': true,
    },
    'man_made': {
        'embankment': true
    },
    'waterway': {
        'weir': true
    }
};

// "highway" tag values for pedestrian or vehicle right-of-ways that make up the routable network
// (does not include `raceway`)
export const osmRoutableHighwayTagValues: { [key: string]: boolean } = {
    motorway: true, trunk: true, primary: true, secondary: true, tertiary: true, residential: true,
    motorway_link: true, trunk_link: true, primary_link: true, secondary_link: true, tertiary_link: true,
    unclassified: true, road: true, service: true, track: true, living_street: true, bus_guideway: true, busway: true,
    path: true, footway: true, cycleway: true, bridleway: true, pedestrian: true, corridor: true, steps: true
};

/** aeroway tags that are treated as routable for aircraft */
export const osmRoutableAerowayTags: { [key: string]: boolean } = {
    runway: true, taxiway: true
};

// "highway" tag values that generally do not allow motor vehicles
export const osmPathHighwayTagValues: { [key: string]: boolean } = {
    path: true, footway: true, cycleway: true, bridleway: true, pedestrian: true, corridor: true, steps: true
};

// "railway" tag values representing existing railroad tracks (purposely does not include 'abandoned')
export const osmRailwayTrackTagValues: { [key: string]: boolean } = {
    rail: true, light_rail: true, tram: true, subway: true,
    monorail: true, funicular: true, miniature: true, narrow_gauge: true,
    disused: true, preserved: true
};

// "waterway" tag values for line features representing water flow
export const osmFlowingWaterwayTagValues: { [key: string]: boolean } = {
    'canal': true,
    'ditch': true,
    'drain': true,
    'fish_pass': true,
    'flowline': true,
    'river': true,
    'stream': true,
    'tidal_channel': true
};