import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface WaterfallChartProps {
    data: Array<{
        name: string;
        value: number;
        isTotal?: boolean;
    }>;
    title: string;
}

const WaterfallChart: React.FC<WaterfallChartProps> = ({ data, title }) => {
    // Calculate cumulative values for waterfall
    const waterfallData = data.map((item, index) => {
        const previousSum = data.slice(0, index).reduce((sum, d) => sum + d.value, 0);
        return {
            ...item,
            start: item.value >= 0 ? previousSum : previousSum + item.value,
            end: previousSum + item.value,
            displayValue: item.value,
        };
    });

    return (
        <div>
            <h4 className="text-sm font-medium text-slate-600 mb-4">{title}</h4>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={waterfallData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        style={{ fontSize: '11px' }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            borderColor: '#334155',
                            color: '#fff',
                            borderRadius: '8px'
                        }}
                        formatter={(value: any) => {
                            if (typeof value === 'number') {
                                return value.toLocaleString();
                            }
                            return value;
                        }}
                    />
                    <ReferenceLine y={0} stroke="#64748b" />

                    {/* Invisible bar for positioning */}
                    <Bar dataKey="start" stackId="a" fill="transparent" />

                    {/* Visible bar */}
                    <Bar dataKey="displayValue" stackId="a">
                        {waterfallData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.isTotal ? '#8b5cf6' : entry.value >= 0 ? '#10b981' : '#ef4444'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WaterfallChart;
