import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface BurndownChartProps {
    data: Array<{
        day: string;
        ideal: number;
        actual: number;
    }>;
    title: string;
}

const BurndownChart: React.FC<BurndownChartProps> = ({ data, title }) => {
    return (
        <div>
            <h4 className="text-sm font-medium text-slate-600 mb-4">{title}</h4>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                        dataKey="day"
                        stroke="#94a3b8"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        style={{ fontSize: '12px' }}
                        label={{ value: 'Tasks Remaining', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: '12px' } }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            borderColor: '#334155',
                            color: '#fff',
                            borderRadius: '8px'
                        }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />
                    <Line
                        type="monotone"
                        dataKey="ideal"
                        stroke="#64748b"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Ideal Burndown"
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        name="Actual Progress"
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BurndownChart;
