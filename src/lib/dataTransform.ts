// Database to Frontend data transformation utilities

/**
 * Convert snake_case to camelCase
 */
function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Transform object keys from snake_case to camelCase
 */
export function transformKeys<T = any>(obj: any): T {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map(transformKeys) as any;
    if (typeof obj !== 'object') return obj;

    const transformed: any = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const camelKey = toCamelCase(key);
            transformed[camelKey] = transformKeys(obj[key]);
        }
    }
    return transformed;
}

/**
 * Transform camelCase to snake_case for database
 */
export function toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Transform object keys from camelCase to snake_case
 */
export function transformKeysToSnake<T = any>(obj: any): T {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map(transformKeysToSnake) as any;
    if (typeof obj !== 'object') return obj;

    const transformed: any = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const snakeKey = toSnakeCase(key);
            transformed[snakeKey] = transformKeysToSnake(obj[key]);
        }
    }
    return transformed;
}
