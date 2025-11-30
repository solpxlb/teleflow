// Metrics Definitions - Pre-defined KPIs and their calculation logic

import { Task, Site, User, Resource, Document } from '../mockData';
import { MetricDefinition, MetricValue, MetricFilter, TimeRange } from '../types/analytics';
import {
    applyFilters,
    filterByTimeRange,
    groupBy,
    calculatePercentage,
    calculateTrend
} from './dataTransformers';
import { subDays, differenceInHours, parseISO } from 'date-fns';

// Helper to create metric value
function createMetricValue(
    value: number | string,
    label: string,
    previousValue?: number,
    format?: string
): MetricValue {
    const trend = previousValue !== undefined && typeof value === 'number'
        ? calculateTrend(value, previousValue)
        : undefined;

    return {
        value,
        label,
        trend: trend ? {
            ...trend,
            comparisonPeriod: 'previous period'
        } : undefined,
        timestamp: new Date().toISOString(),
    };
}

/**
 * PROJECT PERFORMANCE METRICS
 */

export const completionRateMetric: MetricDefinition = {
    id: 'completion_rate',
    name: 'Completion Rate',
    description: 'Percentage of completed tasks vs total tasks',
    category: 'project_performance',
    format: 'percentage',
    unit: '%',
    target: 80,
    defaultVisualization: 'gauge',
    calculator: (data: { tasks: Task[] }, filters?, timeRange?) => {
        let tasks = data.tasks;

        if (filters) tasks = applyFilters(tasks, filters);
        if (timeRange) tasks = filterByTimeRange(tasks, timeRange);

        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const rate = calculatePercentage(completed, total);

        return createMetricValue(rate, `${completed}/${total} tasks completed`);
    },
};

export const onTimeDeliveryMetric: MetricDefinition = {
    id: 'on_time_delivery',
    name: 'On-Time Delivery',
    description: 'Percentage of tasks completed by due date',
    category: 'project_performance',
    format: 'percentage',
    unit: '%',
    target: 90,
    defaultVisualization: 'gauge',
    calculator: (data: { tasks: Task[] }, filters?, timeRange?) => {
        let tasks = data.tasks.filter(t => t.status === 'completed');

        if (filters) tasks = applyFilters(tasks, filters);
        if (timeRange) tasks = filterByTimeRange(tasks, timeRange);

        const total = tasks.length;
        const onTime = tasks.filter(t => {
            if (!t.dueDate) return true;
            // In real implementation, compare actualCompletionDate with dueDate
            return true; // Simplified
        }).length;

        const rate = calculatePercentage(onTime, total);
        return createMetricValue(rate, `${onTime}/${total} tasks on time`);
    },
};

export const velocityMetric: MetricDefinition = {
    id: 'velocity',
    name: 'Project Velocity',
    description: 'Average tasks completed per week',
    category: 'project_performance',
    format: 'number',
    unit: 'tasks/week',
    defaultVisualization: 'line',
    calculator: (data: { tasks: Task[] }, filters?, timeRange?) => {
        let tasks = data.tasks.filter(t => t.status === 'completed');

        if (filters) tasks = applyFilters(tasks, filters);
        if (timeRange) tasks = filterByTimeRange(tasks, timeRange);

        // Calculate velocity based on last 4 weeks
        const weeksToCheck = 4;
        const tasksPerWeek = tasks.length / weeksToCheck;

        return createMetricValue(
            Math.round(tasksPerWeek),
            `${Math.round(tasksPerWeek)} tasks/week average`
        );
    },
};

export const blockedTasksMetric: MetricDefinition = {
    id: 'blocked_tasks',
    name: 'Blocked Tasks',
    description: 'Number and percentage of blocked tasks',
    category: 'project_performance',
    format: 'number',
    defaultVisualization: 'number',
    calculator: (data: { tasks: Task[] }, filters?, timeRange?) => {
        let tasks = data.tasks;

        if (filters) tasks = applyFilters(tasks, filters);
        if (timeRange) tasks = filterByTimeRange(tasks, timeRange);

        const total = tasks.length;
        const blocked = tasks.filter(t => t.status === 'blocked').length;
        const percentage = calculatePercentage(blocked, total);

        return createMetricValue(
            blocked,
            `${blocked} blocked (${percentage}% of total)`
        );
    },
};

/**
 * SITE OPERATIONS METRICS
 */

export const siteUptimeMetric: MetricDefinition = {
    id: 'site_uptime',
    name: 'Network Uptime',
    description: 'Percentage of sites online and operational',
    category: 'site_operations',
    format: 'percentage',
    unit: '%',
    target: 99.9,
    defaultVisualization: 'gauge',
    calculator: (data: { sites: Site[] }, filters?, timeRange?) => {
        let sites = data.sites;

        if (filters) sites = applyFilters(sites, filters);

        const total = sites.length;
        const online = sites.filter(s => s.status === 'online').length;
        const uptime = calculatePercentage(online, total);

        return createMetricValue(
            parseFloat(uptime.toFixed(2)),
            `${online}/${total} sites online`
        );
    },
};

export const averageHealthScoreMetric: MetricDefinition = {
    id: 'avg_health_score',
    name: 'Average Health Score',
    description: 'Average health score across all sites',
    category: 'site_operations',
    format: 'number',
    unit: '/100',
    target: 85,
    defaultVisualization: 'gauge',
    calculator: (data: { sites: Site[] }, filters?, timeRange?) => {
        let sites = data.sites;

        if (filters) sites = applyFilters(sites, filters);

        const scores = sites
            .map(s => s.healthScore || 0)
            .filter(score => score > 0);

        const avgScore = scores.length > 0
            ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
            : 0;

        return createMetricValue(avgScore, `Average: ${avgScore}/100`);
    },
};

export const lowBatterySitesMetric: MetricDefinition = {
    id: 'low_battery_sites',
    name: 'Low Battery Sites',
    description: 'Sites with battery level below 20%',
    category: 'site_operations',
    format: 'number',
    defaultVisualization: 'number',
    calculator: (data: { sites: Site[] }, filters?, timeRange?) => {
        let sites = data.sites;

        if (filters) sites = applyFilters(sites, filters);

        const lowBattery = sites.filter(s => s.batteryLevel < 20).length;

        return createMetricValue(
            lowBattery,
            lowBattery === 0 ? 'All sites healthy' : `${lowBattery} sites need attention`
        );
    },
};

export const complianceRateMetric: MetricDefinition = {
    id: 'compliance_rate',
    name: 'Compliance Rate',
    description: 'Percentage of sites in compliance',
    category: 'site_operations',
    format: 'percentage',
    unit: '%',
    target: 100,
    defaultVisualization: 'gauge',
    calculator: (data: { sites: Site[] }, filters?, timeRange?) => {
        let sites = data.sites;

        if (filters) sites = applyFilters(sites, filters);

        const total = sites.length;
        const compliant = sites.filter(s => s.complianceStatus === 'compliant').length;
        const rate = calculatePercentage(compliant, total);

        return createMetricValue(rate, `${compliant}/${total} sites compliant`);
    },
};

/**
 * FINANCIAL METRICS
 */

export const budgetAdherenceMetric: MetricDefinition = {
    id: 'budget_adherence',
    name: 'Budget Adherence',
    description: 'Percentage of projects within budget',
    category: 'financial',
    format: 'percentage',
    unit: '%',
    target: 95,
    defaultVisualization: 'gauge',
    calculator: (data: { tasks: Task[] }, filters?, timeRange?) => {
        let tasks = data.tasks;

        if (filters) tasks = applyFilters(tasks, filters);
        if (timeRange) tasks = filterByTimeRange(tasks, timeRange);

        // Filter tasks with time estimates
        const tasksWithEstimates = tasks.filter(t => t.estimatedHours && t.actualHours);
        const total = tasksWithEstimates.length;

        const withinBudget = tasksWithEstimates.filter(t =>
            (t.actualHours || 0) <= (t.estimatedHours || 0)
        ).length;

        const rate = calculatePercentage(withinBudget, total);
        return createMetricValue(rate, `${withinBudget}/${total} within budget`);
    },
};

export const totalLaborHoursMetric: MetricDefinition = {
    id: 'total_labor_hours',
    name: 'Total Labor Hours',
    description: 'Sum of all actual hours worked',
    category: 'financial',
    format: 'number',
    unit: 'hours',
    defaultVisualization: 'number',
    calculator: (data: { tasks: Task[] }, filters?, timeRange?) => {
        let tasks = data.tasks;

        if (filters) tasks = applyFilters(tasks, filters);
        if (timeRange) tasks = filterByTimeRange(tasks, timeRange);

        const total = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);

        return createMetricValue(total, `${total} hours logged`);
    },
};

export const costEfficiencyMetric: MetricDefinition = {
    id: 'cost_efficiency',
    name: 'Cost Efficiency',
    description: 'Ratio of estimated to actual hours (>100% is good)',
    category: 'financial',
    format: 'percentage',
    unit: '%',
    target: 100,
    defaultVisualization: 'gauge',
    calculator: (data: { tasks: Task[] }, filters?, timeRange?) => {
        let tasks = data.tasks;

        if (filters) tasks = applyFilters(tasks, filters);
        if (timeRange) tasks = filterByTimeRange(tasks, timeRange);

        const totalEstimated = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
        const totalActual = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);

        const efficiency = totalActual > 0
            ? Math.round((totalEstimated / totalActual) * 100)
            : 100;

        return createMetricValue(
            efficiency,
            efficiency >= 100 ? 'Under budget' : 'Over budget'
        );
    },
};

/**
 * TEAM PERFORMANCE METRICS
 */

export const teamUtilizationMetric: MetricDefinition = {
    id: 'team_utilization',
    name: 'Team Utilization',
    description: 'Average workload across team members',
    category: 'team',
    format: 'percentage',
    unit: '%',
    target: 80,
    defaultVisualization: 'gauge',
    calculator: (data: { users: User[] }, filters?, timeRange?) => {
        let users = data.users;

        if (filters) users = applyFilters(users, filters);

        const workloads = users.map(u => u.workload || 0).filter(w => w > 0);
        const avgUtilization = workloads.length > 0
            ? Math.round(workloads.reduce((sum, w) => sum + w, 0) / workloads.length)
            : 0;

        return createMetricValue(avgUtilization, `${avgUtilization}% average capacity`);
    },
};

export const activeTeamMembersMetric: MetricDefinition = {
    id: 'active_team_members',
    name: 'Active Team Members',
    description: 'Number of available team members',
    category: 'team',
    format: 'number',
    defaultVisualization: 'number',
    calculator: (data: { users: User[] }, filters?, timeRange?) => {
        let users = data.users;

        if (filters) users = applyFilters(users, filters);

        const available = users.filter(u => u.availability === 'available').length;
        const total = users.length;

        return createMetricValue(available, `${available}/${total} available`);
    },
};

/**
 * RESOURCE METRICS
 */

export const resourceUtilizationMetric: MetricDefinition = {
    id: 'resource_utilization',
    name: 'Resource Utilization',
    description: 'Percentage of resources currently in use',
    category: 'resources',
    format: 'percentage',
    unit: '%',
    target: 70,
    defaultVisualization: 'gauge',
    calculator: (data: { resources: Resource[] }, filters?, timeRange?) => {
        let resources = data.resources;

        if (filters) resources = applyFilters(resources, filters);

        const total = resources.length;
        const inUse = resources.filter(r => r.availability === 'in_use').length;
        const rate = calculatePercentage(inUse, total);

        return createMetricValue(rate, `${inUse}/${total} resources in use`);
    },
};

export const availableResourcesMetric: MetricDefinition = {
    id: 'available_resources',
    name: 'Available Resources',
    description: 'Number of resources ready for assignment',
    category: 'resources',
    format: 'number',
    defaultVisualization: 'number',
    calculator: (data: { resources: Resource[] }, filters?, timeRange?) => {
        let resources = data.resources;

        if (filters) resources = applyFilters(resources, filters);

        const available = resources.filter(r => r.availability === 'available').length;

        return createMetricValue(available, `${available} resources ready`);
    },
};

/**
 * QUALITY METRICS
 */

export const documentationCompletenessMetric: MetricDefinition = {
    id: 'documentation_completeness',
    name: 'Documentation Completeness',
    description: 'Average documents per task',
    category: 'quality',
    format: 'number',
    defaultVisualization: 'number',
    calculator: (data: { tasks: Task[]; documents: Document[] }, filters?, timeRange?) => {
        let tasks = data.tasks;

        if (filters) tasks = applyFilters(tasks, filters);
        if (timeRange) tasks = filterByTimeRange(tasks, timeRange);

        const totalDocs = data.documents.length;
        const totalTasks = tasks.length;
        const avgDocs = totalTasks > 0 ? (totalDocs / totalTasks).toFixed(1) : '0';

        return createMetricValue(avgDocs, `${avgDocs} docs/task average`);
    },
};

// Export all metrics as a registry
export const METRICS_REGISTRY: Record<string, MetricDefinition> = {
    // Project Performance
    completion_rate: completionRateMetric,
    on_time_delivery: onTimeDeliveryMetric,
    velocity: velocityMetric,
    blocked_tasks: blockedTasksMetric,

    // Site Operations
    site_uptime: siteUptimeMetric,
    avg_health_score: averageHealthScoreMetric,
    low_battery_sites: lowBatterySitesMetric,
    compliance_rate: complianceRateMetric,

    // Financial
    budget_adherence: budgetAdherenceMetric,
    total_labor_hours: totalLaborHoursMetric,
    cost_efficiency: costEfficiencyMetric,

    // Team
    team_utilization: teamUtilizationMetric,
    active_team_members: activeTeamMembersMetric,

    // Resources
    resource_utilization: resourceUtilizationMetric,
    available_resources: availableResourcesMetric,

    // Quality
    documentation_completeness: documentationCompletenessMetric,
};

// Export helper to get metric by ID
export function getMetric(id: string): MetricDefinition | undefined {
    return METRICS_REGISTRY[id];
}

// Export list of all metric IDs by category
export function getMetricsByCategory(category: string): MetricDefinition[] {
    return Object.values(METRICS_REGISTRY).filter(m => m.category === category);
}
