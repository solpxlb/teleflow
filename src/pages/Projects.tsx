import React, { useState, useMemo } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '@/lib/store';
import { Task } from '@/lib/mockData';
import { Plus, MoreHorizontal, Calendar, LayoutGrid, List, GitBranch, CalendarDays, Filter, SlidersHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import TaskDetailModal from '@/components/projects/TaskDetailModal';
import TaskListView from '@/components/tasks/TaskListView';
import TaskCalendarView from '@/components/tasks/TaskCalendarView';
import TaskTimelineView from '@/components/tasks/TaskTimelineView';
import DependencyGraph from '@/components/tasks/DependencyGraph';
import TaskFilters, { TaskFilterState } from '@/components/tasks/TaskFilters';
import BulkActions from '@/components/tasks/BulkActions';

type ViewMode = 'kanban' | 'list' | 'calendar' | 'timeline' | 'dependencies';

const SortableTask = ({ task, onClick }: { task: Task; onClick: () => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, data: { type: 'Task', task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-slate-800/50 p-4 rounded-lg border border-blue-500/50 opacity-50 h-[120px]"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-purple-500/50 shadow-sm group cursor-grab active:cursor-grabbing"
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded border ${task.priority === 'urgent' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                    task.priority === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                        task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                    {task.priority.toUpperCase()}
                </span>
                <button className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>
            <h4 className="text-sm font-medium text-slate-200 mb-1">{task.title}</h4>
            <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                </div>
                {task.assigneeId && (
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                        {task.assigneeId.substring(1)}
                    </div>
                )}
            </div>
        </div>
    );
};

const Column = ({ id, title, tasks, onTaskClick }: { id: string; title: string; tasks: Task[]; onTaskClick: (task: Task) => void }) => {
    const { setNodeRef } = useSortable({ id });

    return (
        <div className="flex flex-col h-full min-w-[300px] w-[300px] bg-slate-900/50 rounded-xl border border-slate-800/50">
            <div className="p-4 border-b border-slate-800/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-200">{title}</h3>
                    <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">{tasks.length}</span>
                </div>
                <button className="text-slate-500 hover:text-slate-300">
                    <Plus className="w-4 h-4" />
                </button>
            </div>
            <div ref={setNodeRef} className="flex-1 p-3 space-y-3 overflow-y-auto">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <SortableTask key={task.id} task={task} onClick={() => onTaskClick(task)} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};

const Projects: React.FC = () => {
    const { tasks, moveTask } = useStore();
    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('kanban');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<TaskFilterState>({
        assignees: [],
        priorities: [],
        statuses: [],
        sites: [],
        stories: [],
        tags: [],
        dateRange: {},
    });
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Apply filters to tasks
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            if (filters.assignees.length > 0 && !filters.assignees.includes(task.assigneeId)) return false;
            if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) return false;
            if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) return false;
            if (filters.sites.length > 0 && !filters.sites.includes(task.siteId)) return false;
            if (filters.stories.length > 0 && task.storyId && !filters.stories.includes(task.storyId)) return false;
            if (filters.tags.length > 0 && !filters.tags.some(tag => task.tags.includes(tag))) return false;
            if (filters.dateRange.start && new Date(task.dueDate) < new Date(filters.dateRange.start)) return false;
            if (filters.dateRange.end && new Date(task.dueDate) > new Date(filters.dateRange.end)) return false;
            return true;
        });
    }, [tasks, filters]);

    const columns = [
        { id: 'todo', title: 'To Do', status: 'todo' },
        { id: 'in_progress', title: 'In Progress', status: 'in_progress' },
        { id: 'review', title: 'Review', status: 'review' },
        { id: 'completed', title: 'Completed', status: 'completed' },
    ];

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeTask = tasks.find(t => t.id === active.id);
        if (!activeTask) return;

        const overColumn = columns.find(c => c.id === over.id);
        if (overColumn && activeTask.status !== overColumn.status) {
            moveTask(activeTask.id, overColumn.status as Task['status']);
        }

        setActiveId(null);
    };

    const handleToggleSelect = (taskId: string) => {
        setSelectedTasks(prev =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        );
    };

    const viewIcons = {
        kanban: LayoutGrid,
        list: List,
        dependencies: GitBranch,
        timeline: SlidersHorizontal,
        calendar: CalendarDays,
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tasks & Projects</h1>
                    <p className="text-slate-400">{filteredTasks.length} tasks</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${showFilters
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <Plus className="w-4 h-4" />
                        New Task
                    </button>
                </div>
            </div>

            {/* View Mode Selector */}
            <div className="flex gap-2 mb-6 bg-slate-900 p-1 rounded-lg border border-slate-800 w-fit">
                {(Object.keys(viewIcons) as ViewMode[]).map(mode => {
                    const Icon = viewIcons[mode];
                    return (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors capitalize ${viewMode === mode
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {mode}
                        </button>
                    );
                })}
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="mb-6">
                    <TaskFilters onFilterChange={setFilters} />
                </div>
            )}

            {/* View Content */}
            <div className="flex-1 overflow-hidden">
                {viewMode === 'kanban' && (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex gap-4 h-full overflow-x-auto pb-4">
                            <SortableContext items={columns.map(c => c.id)}>
                                {columns.map(column => (
                                    <Column
                                        key={column.id}
                                        id={column.id}
                                        title={column.title}
                                        tasks={filteredTasks.filter(t => t.status === column.status)}
                                        onTaskClick={setSelectedTask}
                                    />
                                ))}
                            </SortableContext>
                        </div>
                        <DragOverlay>
                            {activeId ? (
                                <div className="bg-slate-800 p-4 rounded-lg border border-blue-500 shadow-xl opacity-90">
                                    <div className="text-sm font-medium text-white">
                                        {tasks.find(t => t.id === activeId)?.title}
                                    </div>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                )}

                {viewMode === 'list' && (
                    <TaskListView
                        tasks={filteredTasks}
                        onTaskClick={setSelectedTask}
                        selectedTasks={selectedTasks}
                        onToggleSelect={handleToggleSelect}
                    />
                )}

                {viewMode === 'calendar' && (
                    <TaskCalendarView
                        tasks={filteredTasks}
                        onTaskClick={setSelectedTask}
                    />
                )}

                {viewMode === 'timeline' && (
                    <TaskTimelineView
                        tasks={filteredTasks}
                        onTaskClick={setSelectedTask}
                    />
                )}

                {viewMode === 'dependencies' && (
                    <DependencyGraph
                        tasks={filteredTasks}
                        onTaskClick={(taskId) => {
                            const task = tasks.find(t => t.id === taskId);
                            if (task) setSelectedTask(task);
                        }}
                    />
                )}
            </div>

            {/* Bulk Actions */}
            <BulkActions
                selectedTasks={selectedTasks}
                onClearSelection={() => setSelectedTasks([])}
            />

            {/* Task Detail Modal */}
            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
};

export default Projects;
