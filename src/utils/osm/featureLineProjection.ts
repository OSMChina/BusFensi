import { vec2 } from 'gl-matrix';
import { PointWGS84 } from '../geo/types';
import { Node } from '../../api/osm/type';

// Define types for point and polyline
type Polyline = Node[];

// Function to get the nearest point on a line segment using vector math
function getClosestPointOnSegment(p: vec2, p1: vec2, p2: vec2): vec2 {
    const lineDir = vec2.create();
    vec2.subtract(lineDir, p2, p1); // Direction vector of the segment

    const lengthSq = vec2.sqrLen(lineDir); // Squared length of the line segment

    if (lengthSq === 0) return vec2.clone(p1); // If the segment is a point

    const pToP1 = vec2.create();
    vec2.subtract(pToP1, p, p1); // Vector from p1 to the point p

    // Project the point onto the line (using dot product)
    const t = vec2.dot(pToP1, lineDir) / lengthSq;

    // Clamp t to the range [0, 1] to stay within the segment
    const clampedT = Math.max(0, Math.min(1, t));

    const nearestPoint = vec2.create();
    vec2.scaleAndAdd(nearestPoint, p1, lineDir, clampedT); // Calculate the point on the segment

    return nearestPoint;
}

// Function to find the nearest point on a polyline
export function getNearestPointOnPolyline(point: PointWGS84, polyline: Polyline): {
    nearestPoint: PointWGS84,
    insertAfter: Node
} {
    let nearestPoint: vec2 | null = null;
    let insertAfter: Node | null = null;
    let minDistance = Infinity;

    const p = vec2.fromValues(point.lon, point.lat); // Convert point to vector

    for (let i = 0; i < polyline.length - 1; i++) {
        const p1 = vec2.fromValues(polyline[i]['@_lon'], polyline[i]['@_lat']);
        const p2 = vec2.fromValues(polyline[i + 1]['@_lon'], polyline[i + 1]['@_lat']);

        const closestPoint = getClosestPointOnSegment(p, p1, p2);

        const distance = vec2.distance(p, closestPoint); // Calculate distance

        if (distance < minDistance) {
            minDistance = distance;
            nearestPoint = vec2.clone(closestPoint); // Store the nearest point
            insertAfter = polyline[i]
        }
    }
    if (null === insertAfter) {
        throw new Error('point is not insertable for polyline')
    }
    // Return the nearest point as an object with x and y
    return {
        nearestPoint: nearestPoint ? { lon: nearestPoint[0], lat: nearestPoint[1] } : point,
        insertAfter: insertAfter
    };
}