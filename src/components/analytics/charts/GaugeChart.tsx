import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
    value: number;
    max?: number;
    label: string;
    target?: number;
    size?: number;
    colors?: {
        low: string;
        medium: string;
        high: string;
    };
}

const GaugeChart: React.FC<GaugeChartProps> = ({
    value,
    max = 100,
    label,
    target,
    size = 200,
    colors = {
        low: '#ef4444',
        medium: '#f59e0b',
        high: '#10b981',
    },
}) => {
    const percentage = (value / max) * 100;

    // Determine color based on value
    const getColor = () => {
        if (target) {
            if (value >= target) return colors.high;
            if (value >= target * 0.7) return colors.medium;
            return colors.low;
        }
        if (percentage >= 80) return colors.high;
        if (percentage >= 50) return colors.medium;
        return colors.low;
    };

    const data = [
        { name: 'value', value: value, color: getColor() },
        { name: 'remaining', value: Math.max(0, max - value), color: '#1e293b' },
    ];

    return (
        <div className="flex flex-col items-center">
            <ResponsiveContainer width={size} height={size}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={size * 0.35}
                        outerRadius={size * 0.45}
                        paddingAngle={0}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="text-center -mt-16 mb-8">
                <div className="text-3xl font-bold text-slate-900">{Math.round(value)}</div>
                <div className="text-sm text-slate-600">{label}</div>
                {target && (
                    <div className="text-xs text-slate-500 mt-1">Target: {target}</div>
                )}
            </div>
        </div>
    );
};

export default GaugeChart;
