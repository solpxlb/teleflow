import React, { useMemo } from 'react';
import { Task } from '@/lib/mockData';
import { format, differenceInDays } from 'date-fns';
import { Calendar, User } from 'lucide-react';

interface TaskTimelineViewProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

const TaskTimelineView: React.FC<TaskTimelineViewProps> = ({ tasks, onTaskClick }) => {
    // Calculate timeline bounds
    const { minDate, maxDate, totalDays } = useMemo(() => {
        if (tasks.length === 0) {
            return { minDate: new Date(), maxDate: new Date(), totalDays: 30 };
        }

        const dates = tasks.flatMap(t => [
            new Date(t.startDate || t.dueDate),
            new Date(t.dueDate)
        ]);

        const min = new Date(Math.min(...dates.map(d => d.getTime())));
        const max = new Date(Math.max(...dates.map(d => d.getTime())));
        const days = Math.max(differenceInDays(max, min), 30);

        return { minDate: min, maxDate: max, totalDays: days };
    }, [tasks]);

    // Group tasks by assignee
    const tasksByAssignee = useMemo(() => {
        const groups = new Map<string, Task[]>();
        tasks.forEach(task => {
            if (!groups.has(task.assigneeId)) {
                groups.set(task.assigneeId, []);
            }
            groups.get(task.assigneeId)!.push(task);
        });
        return groups;
    }, [tasks]);

    const getTaskPosition = (task: Task) => {
        const start = new Date(task.startDate || task.dueDate);
        const end = new Date(task.dueDate);

        const startOffset = differenceInDays(start, minDate);
        const duration = Math.max(differenceInDays(end, start), 1);

        const left = (startOffset / totalDays) * 100;
        const width = (duration / totalDays) * 100;

        return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
    };

    const priorityColors = {
        urgent: 'bg-rose-500 border-rose-600',
        high: 'bg-orange-500 border-orange-600',
        medium: 'bg-amber-500 border-amber-600',
        low: 'bg-blue-500 border-blue-600',
    };

    const statusOpacity = {
        completed: 'opacity-50',
        blocked: 'opacity-75 border-dashed',
        in_progress: 'opacity-100',
        todo: 'opacity-60',
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Timeline View</h3>
                    <div className="text-sm text-slate-400">
                        {format(minDate, 'MMM d')} - {format(maxDate, 'MMM d, yyyy')}
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="p-4 overflow-x-auto">
                {/* Time Scale */}
                <div className="mb-4 relative h-8 border-b border-slate-800">
                    {Array.from({ length: Math.ceil(totalDays / 7) }).map((_, weekIndex) => {
                        const weekStart = new Date(minDate);
                        weekStart.setDate(weekStart.getDate() + weekIndex * 7);
                        const left = (weekIndex * 7 / totalDays) * 100;

                        return (
                            <div
                                key={weekIndex}
                                className="absolute top-0 flex items-center gap-1 text-xs text-slate-400"
                                style={{ left: `${left}%` }}
                            >
                                <Calendar className="w-3 h-3" />
                                {format(weekStart, 'MMM d')}
                            </div>
                        );
                    })}
                </div>

                {/* Task Rows by Assignee */}
                <div className="space-y-6">
                    {Array.from(tasksByAssignee.entries()).map(([assigneeId, assigneeTasks]) => (
                        <div key={assigneeId}>
                            <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-slate-500" />
                                <span className="text-sm font-medium text-slate-300">User {assigneeId}</span>
                                <span className="text-xs text-slate-500">({assigneeTasks.length} tasks)</span>
                            </div>

                            <div className="relative h-12 bg-slate-950/50 rounded-lg border border-slate-800">
                                {/* Grid lines */}
                                {Array.from({ length: Math.ceil(totalDays / 7) }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute top-0 bottom-0 border-l border-slate-800/50"
                                        style={{ left: `${(i * 7 / totalDays) * 100}%` }}
                                    />
                                ))}

                                {/* Tasks */}
                                {assigneeTasks.map((task, index) => {
                                    const position = getTaskPosition(task);
                                    const offset = index % 2 === 0 ? 'top-1' : 'bottom-1';

                                    return (
                                        <button
                                            key={task.id}
                                            onClick={() => onTaskClick(task)}
                                            className={`absolute ${offset} h-5 rounded border-2 px-2 flex items-center text-xs font-medium text-white hover:scale-105 transition-transform ${priorityColors[task.priority]
                                                } ${statusOpacity[task.status as keyof typeof statusOpacity] || ''}`}
                                            style={position}
                                            title={`${task.title} (${format(new Date(task.dueDate), 'MMM d')})`}
                                        >
                                            <span className="truncate">{task.title}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {tasks.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        No tasks to display
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-rose-500 border-2 border-rose-600"></div>
                        <span className="text-slate-400">Urgent</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-orange-500 border-2 border-orange-600"></div>
                        <span className="text-slate-400">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-amber-500 border-2 border-amber-600"></div>
                        <span className="text-slate-400">Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-blue-500 border-2 border-blue-600"></div>
                        <span className="text-slate-400">Low</span>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-slate-500 opacity-50"></div>
                            <span className="text-slate-400">Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-slate-500 border-2 border-dashed border-slate-600"></div>
                            <span className="text-slate-400">Blocked</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskTimelineView;
