import React from 'react';
import { format, eachDayOfInterval, startOfWeek, endOfWeek, subWeeks } from 'date-fns';

interface HeatMapProps {
    data: Array<{ date: string; value: number }>;
    weeks?: number;
    title: string;
}

const HeatMap: React.FC<HeatMapProps> = ({ data, weeks = 12, title }) => {
    // Generate calendar grid
    const endDate = new Date();
    const startDate = subWeeks(endDate, weeks);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Group by weeks
    const weeklyData: Date[][] = [];
    let currentWeek: Date[] = [];

    days.forEach((day, index) => {
        if (index === 0 || day.getDay() === 0) {
            if (currentWeek.length > 0) {
                weeklyData.push(currentWeek);
            }
            currentWeek = [day];
        } else {
            currentWeek.push(day);
        }
    });
    if (currentWeek.length > 0) {
        weeklyData.push(currentWeek);
    }

    // Get value for a specific date
    const getValue = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const found = data.find(d => d.date.startsWith(dateStr));
        return found?.value || 0;
    };

    // Get color intensity based on value
    const getColor = (value: number) => {
        if (value === 0) return 'bg-white';
        if (value <= 2) return 'bg-emerald-900/40';
        if (value <= 4) return 'bg-emerald-700/60';
        if (value <= 6) return 'bg-emerald-500/80';
        return 'bg-emerald-400';
    };

    return (
        <div>
            <h4 className="text-sm font-medium text-slate-600 mb-3">{title}</h4>
            <div className="flex gap-1">
                <div className="flex flex-col gap-1 text-[10px] text-slate-500 pt-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                        <div key={day} className="h-3 flex items-center">
                            {i % 2 === 1 && day.slice(0, 1)}
                        </div>
                    ))}
                </div>
                <div className="flex gap-1 overflow-x-auto">
                    {weeklyData.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                                const day = week.find(d => d.getDay() === dayIndex);
                                const value = day ? getValue(day) : 0;
                                const isToday = day && format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

                                return (
                                    <div
                                        key={dayIndex}
                                        className={`w-3 h-3 rounded-sm ${day ? getColor(value) : 'bg-transparent'} ${isToday ? 'ring-2 ring-blue-500' : ''
                                            }`}
                                        title={day ? `${format(day, 'MMM d')}: ${value} tasks` : ''}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-white" />
                    <div className="w-3 h-3 rounded-sm bg-emerald-900/40" />
                    <div className="w-3 h-3 rounded-sm bg-emerald-700/60" />
                    <div className="w-3 h-3 rounded-sm bg-emerald-500/80" />
                    <div className="w-3 h-3 rounded-sm bg-emerald-400" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default HeatMap;
