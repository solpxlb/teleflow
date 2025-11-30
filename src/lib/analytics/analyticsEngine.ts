// Analytics Engine - Core calculation and processing engine

import { Task, Site, User, Resource, Document } from '../mockData';
import {
    MetricValue,
    MetricFilter,
    TimeRange,
    CustomMetric,
    CalculationType,
    FilterState
} from '../types/analytics';
import { METRICS_REGISTRY, getMetric } from './metricsDefinitions';
import { cacheManager } from './cacheManager';
import { applyFilters, filterByTimeRange, aggregate } from './dataTransformers';

// Main data interface for analytics
export interface AnalyticsData {
    tasks: Task[];
    sites: Site[];
    users: User[];
    resources: Resource[];
    documents: Document[];
}

/**
 * Calculate a predefined metric
 */
export function calculateMetric(
    metricId: string,
    data: AnalyticsData,
    filters?: MetricFilter[],
    timeRange?: TimeRange,
    customTimeRange?: { start: Date; end: Date }
): MetricValue | null {
    // Check cache first
    const cacheKey = `metric:${metricId}:${JSON.stringify({ filters, timeRange })}`;
    const cached = cacheManager.get<MetricValue>(cacheKey);

    if (cached) {
        return cached;
    }

    // Get metric definition
    const metric = getMetric(metricId);
    if (!metric) {
        console.error(`Metric not found: ${metricId}`);
        return null;
    }

    try {
        // Calculate metric
        const result = metric.calculator(data, filters, timeRange);

        // Cache result
        cacheManager.set(cacheKey, result, 5 * 60 * 1000); // Cache for 5 minutes

        return result;
    } catch (error) {
        console.error(`Error calculating metric ${metricId}:`, error);
        return null;
    }
}

/**
 * Calculate a custom metric
 */
export function calculateCustomMetric(
    metric: CustomMetric,
    data: AnalyticsData
): MetricValue | null {
    try {
        let sourceData: any[] = [];

        // Select data source
        switch (metric.dataSource) {
            case 'tasks':
                sourceData = data.tasks;
                break;
            case 'sites':
                sourceData = data.sites;
                break;
            case 'team':
                sourceData = data.users;
                break;
            case 'resources':
                sourceData = data.resources;
                break;
            case 'documents':
                sourceData = data.documents;
                break;
            default:
                return null;
        }

        // Apply filters
        if (metric.filters && metric.filters.length > 0) {
            sourceData = applyFilters(sourceData, metric.filters);
        }

        // Apply time range filter
        if (metric.timeRange !== 'custom') {
            sourceData = filterByTimeRange(sourceData as any[], metric.timeRange);
        } else if (metric.customTimeRange) {
            sourceData = filterByTimeRange(
                sourceData as any[],
                'custom',
                metric.customTimeRange
            );
        }

        // Calculate based on type
        let value: number | string;

        switch (metric.calculationType) {
            case 'count':
                value = sourceData.length;
                break;

            case 'sum':
            case 'average':
            case 'min':
            case 'max':
                // For aggregations, we need a numeric field
                // In a real implementation, this would be configurable
                const values = sourceData.map(item => {
                    // Extract numeric value from first numeric property
                    const numValue = Object.values(item).find(v => typeof v === 'number');
                    return typeof numValue === 'number' ? numValue : 0;
                });
                value = aggregate(values, metric.calculationType === 'average' ? 'average' : metric.calculationType);
                break;

            case 'percentage':
                // Percentage would need numerator and denominator configuration
                // Simplified here
                value = sourceData.length > 0 ? 100 : 0;
                break;

            case 'formula':
                // Parse and evaluate formula
                if (metric.formula) {
                    value = evaluateFormula(metric.formula, data, sourceData);
                } else {
                    value = 0;
                }
                break;

            default:
                value = 0;
        }

        return {
            value,
            label: metric.name,
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        console.error(`Error calculating custom metric ${metric.id}:`, error);
        return null;
    }
}

/**
 * Evaluate a formula expression
 * Supports basic arithmetic and aggregation functions
 */
function evaluateFormula(
    formula: string,
    data: AnalyticsData,
    currentDataset: any[]
): number {
    try {
        // Simple formula evaluator
        // In production, use a proper expression parser

        // Replace function calls
        let processedFormula = formula;

        // COUNT()
        processedFormula = processedFormula.replace(/COUNT\(\)/gi, String(currentDataset.length));

        // SUM(field)
        processedFormula = processedFormula.replace(/SUM\(([^)]+)\)/gi, (match, field) => {
            const sum = currentDataset.reduce((acc, item) => acc + (Number(item[field.trim()]) || 0), 0);
            return String(sum);
        });

        // AVG(field)
        processedFormula = processedFormula.replace(/AVG\(([^)]+)\)/gi, (match, field) => {
            const values = currentDataset.map(item => Number(item[field.trim()]) || 0);
            const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
            return String(avg);
        });

        // Evaluate mathematical expression
        // SECURITY WARNING: Using eval is dangerous in production
        // Use a proper math expression evaluator library like mathjs
        const result = eval(processedFormula);

        return Number(result) || 0;
    } catch (error) {
        console.error('Formula evaluation error:', error);
        return 0;
    }
}

/**
 * Calculate multiple metrics at once
 */
export function calculateMetrics(
    metricIds: string[],
    data: AnalyticsData,
    filters?: FilterState,
    timeRange?: TimeRange
): Record<string, MetricValue> {
    const results: Record<string, MetricValue> = {};

    // Convert FilterState to MetricFilter[]
    const metricFilters = convertFilterState(filters);

    for (const id of metricIds) {
        const value = calculateMetric(id, data, metricFilters, timeRange);
        if (value) {
            results[id] = value;
        }
    }

    return results;
}

/**
 * Convert FilterState to MetricFilter array
 */
function convertFilterState(filters?: FilterState): MetricFilter[] {
    if (!filters) return [];

    const metricFilters: MetricFilter[] = [];

    if (filters.status && filters.status.length > 0) {
        metricFilters.push({
            field: 'status',
            operator: 'in',
            value: filters.status,
        });
    }

    if (filters.priority && filters.priority.length > 0) {
        metricFilters.push({
            field: 'priority',
            operator: 'in',
            value: filters.priority,
        });
    }

    if (filters.assignee && filters.assignee.length > 0) {
        metricFilters.push({
            field: 'assigneeId',
            operator: 'in',
            value: filters.assignee,
        });
    }

    if (filters.site && filters.site.length > 0) {
        metricFilters.push({
            field: 'siteId',
            operator: 'in',
            value: filters.site,
        });
    }

    if (filters.tags && filters.tags.length > 0) {
        // Tags is array field, need special handling
        filters.tags.forEach(tag => {
            metricFilters.push({
                field: 'tags',
                operator: 'contains',
                value: tag,
                logicOperator: 'OR',
            });
        });
    }

    if (filters.customFilters) {
        metricFilters.push(...filters.customFilters);
    }

    return metricFilters;
}

/**
 * Invalidate cache for specific metrics
 */
export function invalidateMetricCache(metricId?: string): void {
    if (metricId) {
        cacheManager.invalidatePattern(`metric:${metricId}:`);
    } else {
        cacheManager.invalidatePattern('metric:');
    }
}

/**
 * Get all available metrics grouped by category
 */
export function getAvailableMetrics() {
    const metrics = Object.values(METRICS_REGISTRY);
    const grouped: Record<string, typeof metrics> = {};

    metrics.forEach(metric => {
        if (!grouped[metric.category]) {
            grouped[metric.category] = [];
        }
        grouped[metric.category].push(metric);
    });

    return grouped;
}

/**
 * Refresh all metrics in cache
 */
export async function refreshAllMetrics(data: AnalyticsData): Promise<void> {
    const metricIds = Object.keys(METRICS_REGISTRY);

    // Invalidate existing cache
    invalidateMetricCache();

    // Recalculate all metrics
    for (const id of metricIds) {
        calculateMetric(id, data);
    }
}

/**
 * Get metric metadata
 */
export function getMetricMetadata(metricId: string) {
    const metric = getMetric(metricId);
    if (!metric) return null;

    return {
        id: metric.id,
        name: metric.name,
        description: metric.description,
        category: metric.category,
        format: metric.format,
        unit: metric.unit,
        target: metric.target,
        defaultVisualization: metric.defaultVisualization,
    };
}
