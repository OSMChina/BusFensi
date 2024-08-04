/**
  * Helper function to deep copy an object
  * 
  * @param {object} obj
  * @returns {object}
  */
export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Helper function to deep merge properties from source to target
 * 
 * @param {object} target
 * @param {object} source
 */
export function deepMerge(target, source) {
    for (const key in source) {
        if (Object.hasOwn(source, key)) {
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
 * Helper function to compute the deep difference between two objects
 * 
 * @param {object} obj1
 * @param {object} obj2
 * @returns {object}
 */
export function deepDiff(obj1, obj2) {
    const diff = {};

    function findDiff(o1, o2, d) {
        for (const key in o1) {
            if (Object.hasOwn(o1, key)) {
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
            if (Object.hasOwn(o2, key) && !Object.prototype.hasOwnProperty.call(o1, key)) {
                d[key] = undefined;
            }
        }
    }

    findDiff(obj1, obj2, diff);
    return diff;
}

/**
 * Helper function to compute the reverse diff needed to revert result to original
 * 
 * @param {object} original
 * @param {object} diff
 * @returns {object}
 */
export function deepReverseDiff(original, diff) {
    const reverseDiff = {};

    function findReverseDiff(o, d, r) {
        for (const key in d) {
            if (Object.hasOwn(d, key)) {
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
            if (Object.hasOwn(o, key) && !Object.prototype.hasOwnProperty.call(d, key)) {
                r[key] = o[key];
            }
        }
    }

    findReverseDiff(original, diff, reverseDiff);
    return reverseDiff;
}

export function convertNumberBoolValues(obj) {
    // Iterate through each key in the object
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            let value = obj[key];

            // Check if the value is an object, and recursively call convertValues
            if (typeof value === 'object' && value !== null) {
                convertNumberBoolValues(value);
            } else if (typeof value === 'string') {
                // Try to convert string to number
                if (!isNaN(value)) {
                    obj[key] = Number(value);
                } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
                    // Convert string to boolean
                    obj[key] = value.toLowerCase() === 'true';
                }
            }
        }
    }
    return obj;
}
