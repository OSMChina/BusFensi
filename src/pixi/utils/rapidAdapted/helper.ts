/* eslint-disable @typescript-eslint/no-explicit-any */

import * as PIXI from 'pixi.js';

type Vector = [number, number]

/**
 * Adds two vectors.
 * @param v1 - The first vector [x, y].
 * @param v2 - The second vector [x, y].
 * @returns The resulting vector.
 */
function vecAdd(v1: Vector, v2: Vector): Vector {
  return [v1[0] + v2[0], v1[1] + v2[1]];
}

/**
 * Calculates the angle (in radians) between two points.
 * @param v1 - The first vector [x, y].
 * @param v2 - The second vector [x, y].
 * @returns The angle between the two vectors.
 */
function vecAngle(v1: Vector, v2: Vector): number {
  return Math.atan2(v2[1] - v1[1], v2[0] - v1[0]);
}

/**
 * Compares two vectors for equality with an optional epsilon tolerance.
 * @param v1 - The first vector [x, y].
 * @param v2 - The second vector [x, y].
 * @param epsilon - Tolerance for floating-point comparisons (default is 0).
 * @returns True if the vectors are equal.
 */
function vecEqual(v1: Vector, v2: Vector, epsilon = 0): boolean {
  return Math.abs(v1[0] - v2[0]) <= epsilon && Math.abs(v1[1] - v2[1]) <= epsilon;
}

/**
 * Calculates the Euclidean distance (length) between two points.
 * @param v1 - The first vector [x, y].
 * @param v2 - The second vector [x, y].
 * @returns The distance between the two vectors.
 */
function vecLength(v1: Vector, v2: Vector): number {
  const dx = v2[0] - v1[0];
  const dy = v2[1] - v1[1];
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Generates a polygon from a line. Intended for use to create custom hit areas for our ways.
 * @param width The width of the polygon in pixels (deviation from either side of the line).
 * @param points A list of point coord pairs that denote the line.
 * @returns The polygon encasing the line with specified width.
 * Method pilfered from https://jsfiddle.net/bigtimebuddy/xspmq8au/
 */
export function lineToPolygon(width: number, points: number[]): PIXI.Polygon {
  const numPoints = points.length / 2;
  const output = new Array(points.length * 2);

  for (let i = 0; i < numPoints; i++) {
    const j = i * 2;

    // Position of current point
    const x = points[j];
    const y = points[j + 1];

    // Start
    const x0 = points[j - 2] !== undefined ? points[j - 2] : x;
    const y0 = points[j - 1] !== undefined ? points[j - 1] : y;

    // End
    const x1 = points[j + 2] !== undefined ? points[j + 2] : x;
    const y1 = points[j + 3] !== undefined ? points[j + 3] : y;

    // Get the angle of the line
    const a = Math.atan2(-x1 + x0, y1 - y0);
    const deltaX = width * Math.cos(a);
    const deltaY = width * Math.sin(a);

    // Add the x, y at the beginning
    output[j] = x + deltaX;
    output[j + 1] = y + deltaY;

    // Add the reflected x, y at the end
    output[output.length - 1 - j - 1] = x - deltaX;
    output[output.length - 1 - j] = y - deltaY;
  }

  // Close the shape
  output.push(output[0], output[1]);

  return new PIXI.Polygon(output);
}

/**
 * lineToPoly
 * Use Pixi's built-in line builder to convert a line with some width into a polygon.
 * @param flatPoints `Array` of [ x,y, x,y, … ] points that make up the line
 * @param lineStyle `Object` suitable to use as a lineStyle (important options are alignment and width)
 */
export function lineToPoly(flatPoints: number[], lineStyle: any = {}): { perimeter?: number[]; outer?: number[]; inner?: number[] } {
  const EPSILON = 1e-4;
  const first: Vector = [flatPoints[0], flatPoints[1]];
  const last: Vector = [flatPoints[flatPoints.length - 2], flatPoints[flatPoints.length - 1]];
  const isClosed = vecEqual(first, last, EPSILON);
  const sourceShape = new PIXI.Polygon(flatPoints);

  lineStyle.native = false;  // we want the non-native line builder
  sourceShape.closeStroke = false;  // don't make an extra segment from end to start

  const graphicsData = { shape: sourceShape, lineStyle: lineStyle };
  const graphicsGeometry = { closePointEps: EPSILON, indices: [], points: [], uvs: [] };

  PIXI.graphicsUtils.buildLine(graphicsData as any, graphicsGeometry as any);

  const verts = graphicsGeometry.points;
  const indices = graphicsGeometry.indices;

  const sides = new Map<number, boolean>();
  const pathL: Vector[] = [];
  const pathR: Vector[] = [];
  let lastL: Vector = [NaN, NaN];
  let lastR: Vector = [NaN, NaN];
  let lenL = 0;
  let lenR = 0;

  let vp0: Vector = [NaN, NaN], vp1: Vector = [NaN, NaN], vp2: Vector = [NaN, NaN];
  let ip0: number = NaN, ip1: number = NaN, ip2: number = NaN;

  for (let j = 0; j < indices.length; j += 3) {
    const i0 = indices[j];
    const i1 = indices[j + 1];
    const i2 = indices[j + 2];
    const v0: Vector = [verts[i0 * 2], verts[i0 * 2 + 1]];
    const v1: Vector = [verts[i1 * 2], verts[i1 * 2 + 1]];
    const v2: Vector = [verts[i2 * 2], verts[i2 * 2 + 1]];

    if (j === 0) {
      sides.set(i0, true);
      sides.set(i1, false);
      sides.set(i2, true);
      pathL.push(v0);
      pathR.push(v1);
      pathL.push(v2);
      lastR = v1;
      lastL = v2;
      lenL = vecLength(v0, v2);
    } else {
      let s0 = sides.get(i0);
      let s1 = sides.get(i1);
      let s2 = sides.get(i2);

      if (s0 === undefined && vecEqual(v0, vp0, EPSILON)) {
        s0 = sides.get(ip0);
        sides.set(i0, s0!);
      }
      if (s1 === undefined && vecEqual(v1, vp1, EPSILON)) {
        s1 = sides.get(ip1);
        sides.set(i1, s1!);
      }
      if (s2 === undefined && vecEqual(v2, vp2, EPSILON)) {
        s2 = sides.get(ip2);
        sides.set(i2, s2!);
      }

      let inew: number | undefined, vnew: Vector | undefined, snew: boolean | undefined;
      if (s0 === undefined) {
        inew = i0;
        vnew = v0;
        snew = !s2;
      }
      if (s1 === undefined) {
        inew = i1;
        vnew = v1;
        snew = !s0;
      }
      if (s2 === undefined) {
        inew = i2;
        vnew = v2;
        snew = !s1;
      }

      if (inew !== undefined) {
        sides.set(inew, snew!);
        if (snew === true) {
          pathL.push(vnew!);
          lenL += vecLength(lastL, vnew!);
          lastL = vnew!;
        } else {
          pathR.push(vnew!);
          lenR += vecLength(lastR, vnew!);
          lastR = vnew!;
        }
      }
    }

    vp0 = v0; vp1 = v1; vp2 = v2;
    ip0 = i0; ip1 = i1; ip2 = i2;
  }

  const result: { perimeter?: number[]; outer?: number[]; inner?: number[] } = {};

  const len = pathL.length + pathR.length + 1;
  const perimeter = new Array(len * 2);
  let i = 0;
  for (let j = 0; j < pathL.length; ++i, ++j) {
    perimeter[i * 2] = pathL[j][0];
    perimeter[i * 2 + 1] = pathL[j][1];
  }
  for (let j = pathR.length - 1; j >= 0; ++i, --j) {
    perimeter[i * 2] = pathR[j][0];
    perimeter[i * 2 + 1] = pathR[j][1];
  }
  perimeter[i * 2] = pathL[0][0];
  perimeter[i * 2 + 1] = pathL[0][1];

  result.perimeter = perimeter;

  if (isClosed) {
    const which = lenR > lenL ? pathR : pathL;
    const outer = new Array((which.length + 1) * 2);
    for (let j = 0; j < which.length; ++j) {
      outer[j * 2] = which[j][0];
      outer[j * 2 + 1] = which[j][1];
    }
    outer[which.length * 2] = which[0][0];
    outer[which.length * 2 + 1] = which[0][1];
    result.outer = outer;
  }

  return result;
}

/**
 * getLineSegments
 * @param   points    the series of Vec[2] arrays delineating each waypoint
 * @param   spacing   Number indicating the distance between segments (arrows, sided arrows, etc)
 * @param   isSided    optional Boolean, applying a 'sided' style to the line, arrows will be drawn perpendicular to the line segments.
 * @param   isLimited  optional Boolean, whether to limit the number (temporary, see below)
 * @returns Array of segment Objects
 */
export function getLineSegments(points: Vector[], spacing: number, isSided = false, isLimited = false): {
  coords: Vector[],
  angle: number,
}[] {
  const SIDEDOFFSET = 7;

  let offset = spacing;
  let a;

  const segments = [];
  for (let i = 0; i < points.length; i++) {
    const b = points[i];

    if (a) {
      let span = vecLength(a, b) - offset;

      if (span >= 0) {
        const heading = vecAngle(a, b);
        const dx = spacing * Math.cos(heading);
        const dy = spacing * Math.sin(heading);

        let sided_dx = 0;
        let sided_dy = 0;
        // For 'sided' segments, we want to offset the arrows so that they are not centered on the line segment's path
        if (isSided) {
          sided_dx = SIDEDOFFSET * Math.cos(heading + Math.PI / 2);
          sided_dy = SIDEDOFFSET * Math.sin(heading + Math.PI / 2);
        }

        let p: Vector = [
          a[0] + offset * Math.cos(heading) + sided_dx,
          a[1] + offset * Math.sin(heading) + sided_dy
        ];

        // generate coordinates between `a` and `b`, spaced `spacing` apart
        const coords = [a, p];

        // temporary, see https://github.com/facebook/Rapid/issues/544
        // If we are going to generate more than 100 line segments,
        // cap it at 100 so we're not adding thousands of oneway arrows.
        if (isLimited && (span >= spacing * 100)) {
          const newSpacing = Math.floor(span / 100);
          // console.log(`skipped calculating ${Math.floor(span / spacing) - 100} segments.`);
          spacing = newSpacing;
        }

        for (span -= spacing; span >= 0; span -= spacing) {
          p = vecAdd(p, [dx, dy]);
          coords.push(p);
        }
        coords.push(b);

        segments.push({
          coords: coords.slice(1, -1),   // skip first and last
          angle: heading + (isSided ? Math.PI / 2 : 0)
        });
      }

      offset = -span;
    }
    a = b;
  }

  return segments;
}


export function flatCoordsToPoints(coords: any) {
  const points = new Array(coords.length / 2);
  for (let i = 0; i < coords.length; i += 2) {
    points[i / 2] = new PIXI.Point(coords[i], coords[i + 1]);
  }
  return points;
}



/**
 * getLineCapEnum
 * see https://pixijs.download/dev/docs/PIXI.html#LINE_CAP
 * @param   {string}   str - One of 'butt', 'square', or 'round' (default)
 * @returns {nummber}  The corresponding PIXI enum value
 */
export function getLineCapEnum(str: 'butt' | 'square' | 'round' | undefined) {
  if (str === 'butt') {
    return PIXI.LINE_CAP.BUTT;
  } else if (str === 'square') {
    return PIXI.LINE_CAP.SQUARE;
  } else {
    return PIXI.LINE_CAP.ROUND;
  }
}


/**
 * getLineJoinEnum
 * see https://pixijs.download/dev/docs/PIXI.html#LINE_JOIN
 * @param   {string}   str - One of 'bevel', 'miter', or 'round' (default)
 * @returns {nummber}  The corresponding PIXI enum value
 */
export function getLineJoinEnum(str: 'bevel' | 'miter' | 'round' | undefined) {
  if (str === 'bevel') {
    return PIXI.LINE_JOIN.BEVEL;
  } else if (str === 'miter') {
    return PIXI.LINE_JOIN.MITER;
  } else {
    return PIXI.LINE_JOIN.ROUND;
  }
}


export function getDebugBBox(x: number, y: number, width: number, height: number, color?: number, alpha?: number, name?: string) {
  const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
  sprite.eventMode = 'none';
  sprite.anchor.set(0, 0);  // top, left
  sprite.position.set(x, y);
  sprite.width = width;
  sprite.height = height;
  sprite.tint = color || 0xffff33;  // yellow
  sprite.alpha = alpha || 0.75;
  if (name) sprite.name = name;
  return sprite;
}