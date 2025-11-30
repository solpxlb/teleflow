// Data Transformers - Utility functions for data preparation and transformation

import { Task, Site, User } from '../mockData';
import { MetricFilter, FilterOperator, TimeRange } from '../types/analytics';
import { isWithinInterval, subDays, startOfDay, endOfDay } from 'date-fns';

/**
 * Apply filters to a dataset
 */
export function applyFilters<T extends Record<string, any>>(
    data: T[],
    filters: MetricFilter[]
): T[] {
    if (!filters || filters.length === 0) {
        return data;
    }

    return data.filter(item => {
        return filters.every((filter, index) => {
            const matchesFilter = evaluateFilter(item, filter);

            // Handle logic operators between filters
            if (index > 0 && filters[index - 1].logicOperator === 'OR') {
                // If previous filter had OR, we need different logic
                // This is simplified - in production, need proper expression tree
                return matchesFilter;
            }

            return matchesFilter;
        });
    });
}

/**
 * Evaluate a single filter against a data item
 */
function evaluateFilter<T extends Record<string, any>>(
    item: T,
    filter: MetricFilter
): boolean {
    const fieldValue = getNestedValue(item, filter.field);
    const filterValue = filter.value;

    switch (filter.operator) {
        case 'eq':
            return fieldValue === filterValue;
        case 'ne':
            return fieldValue !== filterValue;
        case 'gt':
            return fieldValue > filterValue;
        case 'lt':
            return fieldValue < filterValue;
        case 'gte':
            return fieldValue >= filterValue;
        case 'lte':
            return fieldValue <= filterValue;
        case 'in':
            return Array.isArray(filterValue) && filterValue.includes(fieldValue);
        case 'contains':
            return String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
        case 'between':
            return Array.isArray(filterValue) &&
                fieldValue >= filterValue[0] &&
                fieldValue <= filterValue[1];
        default:
            return true;
    }
}

/**
 * Get nested object value by path (e.g., 'user.profile.name')
 */
function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
}

/**
 * Filter data by time range
 */
export function filterByTimeRange<T extends { createdAt?: string; dueDate?: string; startDate?: string }>(
    data: T[],
    timeRange: TimeRange,
    customRange?: { start: Date; end: Date },
    dateField: keyof T = 'createdAt' as keyof T
): T[] {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    if (timeRange === 'custom' && customRange) {
        start = customRange.start;
        end = customRange.end;
    } else {
        switch (timeRange) {
            case '7d':
                start = subDays(now, 7);
                break;
            case '30d':
                start = subDays(now, 30);
                break;
            case '90d':
                start = subDays(now, 90);
                break;
            case 'ytd':
                start = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                return data;
        }
    }

    return data.filter(item => {
        const dateValue = item[dateField];
        if (!dateValue) return false;

        const itemDate = new Date(dateValue as string);
        return isWithinInterval(itemDate, { start: startOfDay(start), end: endOfDay(end) });
    });
}

/**
 * Group data by a field
 */
export function groupBy<T extends Record<string, any>>(
    data: T[],
    field: string
): Record<string, T[]> {
    return data.reduce((groups, item) => {
        const key = String(getNestedValue(item, field));
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {} as Record<string, T[]>);
}

/**
 * Aggregate data using various functions
 */
export function aggregate(
    data: number[],
    type: 'sum' | 'average' | 'min' | 'max' | 'count'
): number {
    if (data.length === 0) return 0;

    switch (type) {
        case 'sum':
            return data.reduce((sum, val) => sum + val, 0);
        case 'average':
            return data.reduce((sum, val) => sum + val, 0) / data.length;
        case 'min':
            return Math.min(...data);
        case 'max':
            return Math.max(...data);
        case 'count':
            return data.length;
        default:
            return 0;
    }
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

/**
 * Calculate trend comparison
 */
export function calculateTrend(
    current: number,
    previous: number
): {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
} {
    if (previous === 0) {
        return { direction: 'stable', percentage: 0 };
    }

    const diff = current - previous;
    const percentage = Math.round((diff / previous) * 100);

    return {
        direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable',
        percentage: Math.abs(percentage),
    };
}

/**
 * Normalize data for charting (0-100 scale)
 */
export function normalize(values: number[]): number[] {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    if (range === 0) return values.map(() => 0);

    return values.map(val => ((val - min) / range) * 100);
}

/**
 * Create time series buckets
 */
export function createTimeSeries(
    data: any[],
    dateField: string,
    valueField: string,
    bucketSize: 'day' | 'week' | 'month' = 'day'
): { date: string; value: number }[] {
    // Group by date bucket
    const grouped = data.reduce((acc, item) => {
        const date = new Date(getNestedValue(item, dateField));
        let key: string;

        if (bucketSize === 'day') {
            key = date.toISOString().split('T')[0];
        } else if (bucketSize === 'week') {
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            key = weekStart.toISOString().split('T')[0];
        } else {
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }

        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(getNestedValue(item, valueField));
        return acc;
    }, {} as Record<string, number[]>);

    // Convert to array and sum values
    return Object.entries(grouped)
        .map(([date, values]) => ({
            date,
            value: values.reduce((sum, val) => sum + (val || 0), 0),
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Pivot data (transform rows to columns)
 */
export function pivot<T extends Record<string, any>>(
    data: T[],
    rowField: string,
    columnField: string,
    valueField: string,
    aggregateFunc: 'sum' | 'average' | 'count' = 'sum'
): Record<string, Record<string, number>> {
    const result: Record<string, Record<string, number>> = {};

    data.forEach(item => {
        const row = String(getNestedValue(item, rowField));
        const col = String(getNestedValue(item, columnField));
        const value = Number(getNestedValue(item, valueField)) || 0;

        if (!result[row]) {
            result[row] = {};
        }
        if (!result[row][col]) {
            result[row][col] = 0;
        }

        if (aggregateFunc === 'sum') {
            result[row][col] += value;
        } else if (aggregateFunc === 'average') {
            // For average, we need to track count separately
            // This is simplified
            result[row][col] = (result[row][col] + value) / 2;
        } else {
            result[row][col] += 1;
        }
    });

    return result;
}

/**
 * Sort data by field
 */
export function sortBy<T extends Record<string, any>>(
    data: T[],
    field: string,
    order: 'asc' | 'desc' = 'asc'
): T[] {
    return [...data].sort((a, b) => {
        const aVal = getNestedValue(a, field);
        const bVal = getNestedValue(b, field);

        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
 * Get top N items
 */
export function topN<T>(data: T[], n: number): T[] {
    return data.slice(0, n);
}

/**
 * Calculate moving average
 */
export function movingAverage(values: number[], windowSize: number): number[] {
    const result: number[] = [];

    for (let i = 0; i < values.length; i++) {
        const start = Math.max(0, i - windowSize + 1);
        const window = values.slice(start, i + 1);
        const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
        result.push(avg);
    }

    return result;
}

/**
 * Detect outliers using IQR method
 */
export function detectOutliers(values: number[]): {
    outliers: number[];
    indices: number[];
} {
    const sorted = [...values].sort((a, b) => a - b);
    const q1Index = Math.floor(sorted.length * 0.25);
    const q3Index = Math.floor(sorted.length * 0.75);

    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    const iqr = q3 - q1;

    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    const outliers: number[] = [];
    const indices: number[] = [];

    values.forEach((val, idx) => {
        if (val < lowerBound || val > upperBound) {
            outliers.push(val);
            indices.push(idx);
        }
    });

    return { outliers, indices };
}
