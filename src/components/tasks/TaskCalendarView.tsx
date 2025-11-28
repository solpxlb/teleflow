import React, { useMemo } from 'react';
import { Task } from '@/lib/mockData';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TaskCalendarViewProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({ tasks, onTaskClick }) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Get tasks for each day
    const tasksByDay = useMemo(() => {
        const map = new Map<string, Task[]>();
        tasks.forEach(task => {
            const dateKey = format(new Date(task.dueDate), 'yyyy-MM-dd');
            if (!map.has(dateKey)) {
                map.set(dateKey, []);
            }
            map.get(dateKey)!.push(task);
        });
        return map;
    }, [tasks]);

    const priorityColors = {
        urgent: 'bg-rose-500',
        high: 'bg-orange-500',
        medium: 'bg-amber-500',
        low: 'bg-blue-500',
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <h3 className="text-lg font-bold text-white">
                    {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 text-slate-300" />
                    </button>
                    <button
                        onClick={() => setCurrentMonth(new Date())}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm text-slate-300"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-slate-400 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {/* Days of the month */}
                    {daysInMonth.map(day => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const dayTasks = tasksByDay.get(dateKey) || [];
                        const isToday = isSameDay(day, new Date());

                        return (
                            <div
                                key={dateKey}
                                className={`aspect-square border rounded-lg p-2 ${isToday
                                        ? 'border-blue-500 bg-blue-500/5'
                                        : 'border-slate-800 bg-slate-950/50'
                                    } hover:border-slate-700 transition-colors`}
                            >
                                <div className={`text-xs font-medium mb-1 ${isToday ? 'text-blue-400' : 'text-slate-400'
                                    }`}>
                                    {format(day, 'd')}
                                </div>

                                <div className="space-y-1 overflow-y-auto max-h-[80px]">
                                    {dayTasks.slice(0, 3).map(task => (
                                        <button
                                            key={task.id}
                                            onClick={() => onTaskClick(task)}
                                            className={`w-full text-left px-1.5 py-1 rounded text-[10px] truncate ${priorityColors[task.priority]
                                                } bg-opacity-20 hover:bg-opacity-30 transition-colors text-white`}
                                            title={task.title}
                                        >
                                            {task.title}
                                        </button>
                                    ))}
                                    {dayTasks.length > 3 && (
                                        <div className="text-[10px] text-slate-500 px-1.5">
                                            +{dayTasks.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-rose-500"></div>
                        <span className="text-slate-400">Urgent</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-orange-500"></div>
                        <span className="text-slate-400">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-amber-500"></div>
                        <span className="text-slate-400">Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-blue-500"></div>
                        <span className="text-slate-400">Low</span>
                    </div>
                    <div className="ml-auto text-slate-400">
                        {tasks.length} tasks this month
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCalendarView;
