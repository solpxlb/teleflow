import React from 'react';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { MetricValue } from '@/lib/types/analytics';

interface MetricCardProps {
    title: string;
    value: MetricValue;
    icon?: LucideIcon;
    iconColor?: string;
    format?: 'number' | 'percentage' | 'currency' | 'duration';
    target?: number;
    loading?: boolean;
    className?: string;
    onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    icon: Icon,
    iconColor = 'text-cyan-500',
    format = 'number',
    target,
    loading = false,
    className = '',
    onClick,
}) => {
    // Format the value based on type
    const formatValue = (val: number | string): string => {
        if (typeof val === 'string') return val;

        switch (format) {
            case 'percentage':
                return `${val}%`;
            case 'currency':
                return `$${val.toLocaleString()}`;
            case 'duration':
                return `${val}h`;
            default:
                return val.toLocaleString();
        }
    };

    // Get trend icon and color
    const getTrendIcon = () => {
        if (!value.trend) return null;

        const TrendIcon =
            value.trend.direction === 'up' ? TrendingUp :
                value.trend.direction === 'down' ? TrendingDown :
                    Minus;

        const trendColor =
            value.trend.direction === 'up' ? 'text-emerald-500' :
                value.trend.direction === 'down' ? 'text-rose-500' :
                    'text-slate-600';

        return (
            <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
                <TrendIcon className="w-4 h-4" />
                <span>{value.trend.percentage}%</span>
            </div>
        );
    };

    // Check if value meets target
    const meetsTarget = target !== undefined && typeof value.value === 'number'
        ? value.value >= target
        : null;

    if (loading) {
        return (
            <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm ${className}`}>
                <div className="animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-24 mb-4"></div>
                    <div className="h-8 bg-slate-200 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-32"></div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`bg-white p-6 rounded-xl border border-slate-200 transition-all shadow-sm ${onClick ? 'cursor-pointer hover:border-cyan-400 hover:shadow-md' : ''
                } ${className}`}
            onClick={onClick}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                {Icon && (
                    <div className={`p-3 bg-opacity-10 rounded-lg ${iconColor.replace('text-', 'bg-')}/10`}>
                        <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                )}
                {value.trend && getTrendIcon()}
            </div>

            {/* Value */}
            <div className="mb-2">
                <div className="text-3xl font-bold text-slate-900">
                    {formatValue(value.value)}
                </div>
            </div>

            {/* Title */}
            <div className="text-sm text-slate-600 mb-2">{title}</div>

            {/* Label / Description */}
            {value.label && (
                <div className="text-xs text-slate-500">{value.label}</div>
            )}

            {/* Target Indicator */}
            {target !== undefined && meetsTarget !== null && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500">Target: {formatValue(target)}</span>
                        <span className={meetsTarget ? 'text-emerald-500' : 'text-rose-500'}>
                            {meetsTarget ? '✓ Met' : '✗ Not Met'}
                        </span>
                    </div>
                </div>
            )}

            {/* Trend Comparison Period */}
            {value.trend && (
                <div className="mt-2 text-[10px] text-slate-600">
                    vs {value.trend.comparisonPeriod}
                </div>
            )}
        </div>
    );
};

export default MetricCard;
