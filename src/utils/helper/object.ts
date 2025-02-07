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

export const typedKeys = <T extends object>(obj: T): (keyof T)[] =>
    Object.keys(obj) as (keyof T)[];

/**
 * 深度合并 source 对象到 target 对象中，返回合并后的结果。
 * 仅支持合并属性值为 string、number、boolean、对象等，不支持函数、数组特殊处理（可根据需求扩展）。
 *
 * @param target - 目标对象
 * @param source - 源对象
 * @returns 合并后的对象，类型为 T & U
 */
export function deepMerge<T extends object, U extends object>(
    target: T,
    source: U
): T & U {
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            // 将 key 显式转换为 string 类型（实际上是 U 的键）
            const k = key as Extract<keyof U, string>;
            const sourceValue = source[k];
            if (
                typeof sourceValue === "object" &&
                sourceValue !== null &&
                !Array.isArray(sourceValue)
            ) {
                // 如果 target[k] 不存在或不是对象则初始化为 {}
                if (!(k in target) || typeof (target as any)[k] !== "object" || (target as any)[k] === null) {
                    (target as any)[k] = {};
                }
                // 递归合并
                deepMerge((target as any)[k], sourceValue);
            } else {
                (target as any)[k] = sourceValue;
            }
        }
    }
    return target as T & U;
}

/**
 * 防抖函数：在指定延迟时间内，如果多次调用函数，则只执行最后一次调用。
 *
 * @param func - 需要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的新函数
 */
export function debounce<F extends (...args: any[]) => void>(
    func: F,
    delay: number
): (...args: Parameters<F>) => void {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<F>): void => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

/**
 * 类封装的防抖器，根据传入的类型分类进行防抖操作。
 */
export class Debouncer {
    // 使用 Map 存储定时器，键为字符串 type
    private timers = new Map<string, ReturnType<typeof setTimeout>>();

    /**
     * 对传入的函数进行防抖包装，根据 type 进行分类处理，并支持立即执行
     *
     * @param func 需要防抖的函数
     * @param delay 延迟时间（毫秒）
     * @param type 分类标识，相同 type 的函数会共享同一个定时器
     * @param immediate 如果为 true，则在首次调用时立即执行函数（leading edge），延迟期间不重复执行
     * @returns 返回一个防抖后的函数，其参数类型与 func 保持一致
     */
    public debounce<F extends (...args: any[]) => void>(
        func: F,
        delay: number,
        type: string,
        immediate: boolean = false
    ): (...args: Parameters<F>) => void {
        return (...args: Parameters<F>): void => {
            // 如果 immediate 为 true 且当前没有定时器，则立即执行
            const callNow = immediate && !this.timers.has(type);
            // 如果当前 type 已存在定时器，则清除旧的定时器
            if (this.timers.has(type)) {
                clearTimeout(this.timers.get(type));
            }
            // 创建一个新的定时器
            const timer = setTimeout(() => {
                // 延迟结束后删除定时器
                this.timers.delete(type);
                // 如果 immediate 为 false，则在延迟结束后执行函数
                if (!immediate) {
                    func(...args);
                }
            }, delay);
            this.timers.set(type, timer);
            // 如果应立即执行，则直接调用函数
            if (callNow) {
                func(...args);
            }
        };
    }


    /**
     * 根据 type 取消对应的防抖操作
     * @param type 防抖类型
     */
    public cancel(type: string): void {
        if (this.timers.has(type)) {
            clearTimeout(this.timers.get(type));
            this.timers.delete(type);
        }
    }

    /**
     * 取消所有待执行的防抖操作
     */
    public cancelAll(): void {
        for (const timer of this.timers.values()) {
            clearTimeout(timer);
        }
        this.timers.clear();
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

export const cn = (...args: any[]) => args.filter(Boolean).join(" ");
