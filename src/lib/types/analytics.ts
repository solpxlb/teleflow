// Analytics Type Definitions

export type AnalyticsCategory = 
  | 'project_performance'
  | 'site_operations'
  | 'financial'
  | 'team'
  | 'quality'
  | 'resources'
  | 'vendors'
  | 'predictive';

export type ChartType = 
  | 'number'
  | 'line'
  | 'bar'
  | 'area'
  | 'pie'
  | 'donut'
  | 'gauge'
  | 'heatmap'
  | 'scatter'
  | 'waterfall'
  | 'gantt'
  | 'burndown'
  | 'map'
  | 'table';

export type TimeRange = 
  | '7d'
  | '30d'
  | '90d'
  | 'ytd'
  | 'custom';

export type FilterOperator = 
  | 'eq'
  | 'ne'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'in'
  | 'contains'
  | 'between';

export type CalculationType = 
  | 'count'
  | 'sum'
  | 'average'
  | 'percentage'
  | 'ratio'
  | 'formula'
  | 'min'
  | 'max';

export type DataSource = 
  | 'tasks'
  | 'sites'
  | 'team'
  | 'resources'
  | 'documents'
  | 'workflows'
  | 'vendors'
  | 'custom';

export interface MetricFilter {
  field: string;
  operator: FilterOperator;
  value: any;
  logicOperator?: 'AND' | 'OR';
}

export interface CustomMetric {
  id: string;
  name: string;
  description?: string;
  category: AnalyticsCategory;
  dataSource: DataSource;
  calculationType: CalculationType;
  formula?: string;
  filters: MetricFilter[];
  timeRange: TimeRange;
  customTimeRange?: {
    start: Date;
    end: Date;
  };
  visualization: ChartType;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  isPublic: boolean;
  tags?: string[];
}

export interface MetricValue {
  value: number | string;
  label: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    comparisonPeriod: string;
  };
  timestamp: string;
}

export interface MetricDefinition {
  id: string;
  name: string;
  description: string;
  category: AnalyticsCategory;
  calculator: (data: any, filters?: MetricFilter[], timeRange?: TimeRange) => MetricValue;
  format?: 'number' | 'percentage' | 'currency' | 'duration' | 'text';
  unit?: string;
  target?: number;
  defaultVisualization: ChartType;
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'insight' | 'map';
  metricId: string;
  position: { 
    x: number; 
    y: number; 
    w: number; 
    h: number; 
  };
  config: WidgetConfig;
}

export interface WidgetConfig {
  title?: string;
  showTrend?: boolean;
  showTarget?: boolean;
  colorScheme?: string[];
  refreshInterval?: number;
  drillDownEnabled?: boolean;
}

export interface CustomDashboard {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  filters: FilterState;
  dateRange: {
    type: TimeRange;
    customStart?: Date;
    customEnd?: Date;
  };
  refreshInterval?: number;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  sharedWith?: string[];
  isPublic: boolean;
}

export interface FilterState {
  status?: string[];
  priority?: string[];
  assignee?: string[];
  site?: string[];
  tags?: string[];
  customFilters?: MetricFilter[];
}

export interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'prediction' | 'recommendation';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  actionable?: boolean;
  action?: {
    label: string;
    url?: string;
    handler?: string;
  };
  confidence: number; // 0-100
  relevantData: {
    entityType: 'task' | 'site' | 'resource' | 'vendor';
    entityId?: string;
    metrics?: Record<string, any>;
  };
  createdAt: string;
  dismissedAt?: string;
  dismissedBy?: string;
}

export interface Anomaly {
  id: string;
  metricId: string;
  metricName: string;
  detectedAt: string;
  severity: 'low' | 'medium' | 'high';
  expectedValue: number;
  actualValue: number;
  deviation: number; // percentage
  description: string;
  possibleCauses?: string[];
}

export interface Recommendation {
  id: string;
  type: 'resource_optimization' | 'cost_saving' | 'process_improvement' | 'risk_mitigation';
  title: string;
  description: string;
  impact: {
    metric: string;
    estimatedImprovement: number;
    unit: string;
  };
  effort: 'low' | 'medium' | 'high';
  priority: number; // 1-10
  actionItems?: string[];
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'implemented';
}

export type ReportType = 
  | 'executive_summary'
  | 'project_status'
  | 'financial_performance'
  | 'team_performance'
  | 'site_operations'
  | 'vendor_performance'
  | 'custom';

export interface ScheduledReport {
  id: string;
  name: string;
  description?: string;
  type: ReportType;
  schedule: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time?: string; // HH:mm
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  filters: FilterState;
  dashboardId?: string;
  nextRunAt: string;
  lastRunAt?: string;
  enabled: boolean;
  createdBy: string;
  createdAt: string;
}

export interface ExportJob {
  id: string;
  type: 'dashboard' | 'report' | 'chart' | 'data';
  format: 'pdf' | 'excel' | 'csv' | 'png' | 'json';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  data: any;
  options: ExportOptions;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  error?: string;
}

export interface ExportOptions {
  fileName?: string;
  includeCharts?: boolean;
  includeRawData?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: FilterState;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  fill?: boolean;
}

export interface TrendData {
  date: string;
  value: number;
  label?: string;
}

export interface ComparisonData {
  category: string;
  current: number;
  previous: number;
  target?: number;
}

// Cache related types
export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number; // time to live in milliseconds
}

export interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  cleanupInterval: number;
}
