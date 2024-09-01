/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Helper function to deep copy an object.
 * 
 * @param {T} obj - The object to deep copy.
 * @returns {T} A deep copy of the object.
 * @template T
 */
export function deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Helper function to deep merge properties from source to target.
 * 
 * @param {Record<string, any>} target - The target object to merge into.
 * @param {Record<string, any>} source - The source object to merge from.
 */
export function deepMerge(target: Record<string, any>, source: Record<string, any>): void {
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (typeof source[key] === 'object' && source[key] !== null) {
                if (!target[key]) {
                    target[key] = {};
                }
                deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
}

/**
 * Helper function to compute the deep difference between two objects.
 * 
 * @param {Record<string, any>} obj1 - The first object.
 * @param {Record<string, any>} obj2 - The second object.
 * @returns {Record<string, any>} An object representing the differences between obj1 and obj2.
 */
export function deepDiff(obj1: Record<string, any>, obj2: Record<string, any>): Record<string, any> {
    const diff: Record<string, any> = {};

    function findDiff(o1: Record<string, any>, o2: Record<string, any>, d: Record<string, any>): void {
        for (const key in o1) {
            if (Object.prototype.hasOwnProperty.call(o1, key)) {
                if (typeof o1[key] === 'object' && o1[key] !== null) {
                    if (!Object.prototype.hasOwnProperty.call(o2, key) || typeof o2[key] !== 'object' || o2[key] === null) {
                        d[key] = deepCopy(o1[key]);
                    } else {
                        d[key] = {};
                        findDiff(o1[key], o2[key], d[key]);
                        if (Object.keys(d[key]).length === 0) {
                            delete d[key];
                        }
                    }
                } else if (!Object.prototype.hasOwnProperty.call(o2, key) || o1[key] !== o2[key]) {
                    d[key] = o1[key];
                }
            }
        }
        for (const key in o2) {
            if (Object.prototype.hasOwnProperty.call(o2, key) && !Object.prototype.hasOwnProperty.call(o1, key)) {
                d[key] = undefined;
            }
        }
    }

    findDiff(obj1, obj2, diff);
    return diff;
}

/**
 * Helper function to compute the reverse diff needed to revert result to original.
 * 
 * @param {Record<string, any>} original - The original object.
 * @param {Record<string, any>} diff - The diff object.
 * @returns {Record<string, any>} An object representing the reverse diff.
 */
export function deepReverseDiff(original: Record<string, any>, diff: Record<string, any>): Record<string, any> {
    const reverseDiff: Record<string, any> = {};

    function findReverseDiff(o: Record<string, any>, d: Record<string, any>, r: Record<string, any>): void {
        for (const key in d) {
            if (Object.prototype.hasOwnProperty.call(d, key)) {
                if (typeof d[key] === 'object' && d[key] !== null) {
                    if (!Object.prototype.hasOwnProperty.call(o, key)) {
                        r[key] = undefined;
                    } else {
                        r[key] = {};
                        findReverseDiff(o[key], d[key], r[key]);
                        if (Object.keys(r[key]).length === 0) {
                            delete r[key];
                        }
                    }
                } else if (o[key] !== d[key]) {
                    r[key] = o[key] === undefined ? null : o[key];
                }
            }
        }

        for (const key in o) {
            if (Object.prototype.hasOwnProperty.call(o, key) && !Object.prototype.hasOwnProperty.call(d, key)) {
                r[key] = o[key];
            }
        }
    }

    findReverseDiff(original, diff, reverseDiff);
    return reverseDiff;
}

/**
 * Helper function to convert string numbers and booleans in an object.
 * 
 * @param {Record<string, any>} obj - The object to convert values in.
 * @returns {Record<string, any>} The object with converted values.
 */
export function convertNumberBoolValues(obj: Record<string, any>): Record<string, any> {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];

            if (typeof value === 'object' && value !== null) {
                convertNumberBoolValues(value);
            } else if (typeof value === 'string') {
                if (!isNaN(value as any)) {
                    obj[key] = Number(value);
                } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
                    obj[key] = value.toLowerCase() === 'true';
                }
            }
        }
    }
    return obj;
}

/**
 * Convert type T or T[] to T[], skipping falsy values.
 * 
 * @template T
 * @param {T | T[] | undefined} obj - The value or array to convert.
 * @returns {T[]} An array containing the value, or the original array.
 */
export function T2Arr<T>(obj: T | T[] | undefined): T[] {
    return obj ? (Array.isArray(obj) ? obj : [obj]) : [];
}


export function union<T>(...iterables: Iterable<T>[]): Set<T> {
    const set = new Set<T>();

    for (const iterable of iterables) {
        for (const item of iterable) {
            set.add(item);
        }
    }

    return set;
}