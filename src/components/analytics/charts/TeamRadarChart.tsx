import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

interface TeamRadarChartProps {
    data: Array<{
        skill: string;
        current: number;
        required: number;
    }>;
    title: string;
}

const TeamRadarChart: React.FC<TeamRadarChartProps> = ({ data, title }) => {
    return (
        <div>
            <h4 className="text-sm font-medium text-slate-600 mb-4">{title}</h4>
            <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={data}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis
                        dataKey="skill"
                        stroke="#94a3b8"
                        style={{ fontSize: '11px' }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        stroke="#94a3b8"
                        style={{ fontSize: '10px' }}
                    />
                    <Radar
                        name="Current Level"
                        dataKey="current"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                    />
                    <Radar
                        name="Required Level"
                        dataKey="required"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                        strokeDasharray="5 5"
                    />
                    <Legend />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TeamRadarChart;
