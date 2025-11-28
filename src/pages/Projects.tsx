import React, { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '@/lib/store';
import { Task } from '@/lib/mockData';
import { Plus, MoreHorizontal, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import TaskDetailModal from '@/components/projects/TaskDetailModal';

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
                <span className={`text-[10px] px-2 py-0.5 rounded border ${task.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
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

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const columns = [
        { id: 'planning', title: 'Planning' },
        { id: 'permitting', title: 'Permitting' },
        { id: 'construction', title: 'Construction' },
        { id: 'integration', title: 'Integration' },
        { id: 'live', title: 'Live' },
    ];

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId !== overId) {
            // Find the task and the column it was dropped into
            let newStatus = overId;

            // If dropped on a task, find that task's status
            const overTask = tasks.find(t => t.id === overId);
            if (overTask) {
                newStatus = overTask.status;
            }

            // If active task is different from new status, update it
            const activeTask = tasks.find(t => t.id === activeId);
            // Ensure newStatus is a valid status before moving
            const isValidStatus = columns.some(c => c.id === newStatus);

            if (activeTask && activeTask.status !== newStatus && isValidStatus) {
                moveTask(activeId, newStatus as Task['status']);
            }
        }
        setActiveId(null);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Rollouts & Tasks</h1>
                    <p className="text-slate-400">Manage deployment projects</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" />
                    New Task
                </button>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-4 h-full pb-4 min-w-max">
                        {columns.map(col => (
                            <Column
                                key={col.id}
                                id={col.id}
                                title={col.title}
                                tasks={tasks.filter(t => t.status === col.id)}
                                onTaskClick={setSelectedTask}
                            />
                        ))}
                    </div>

                    <DragOverlay>
                        {activeId ? (
                            <div className="bg-slate-800 p-4 rounded-lg border border-purple-500 shadow-xl cursor-grabbing rotate-2">
                                <h4 className="text-slate-200 font-medium">{tasks.find(t => t.id === activeId)?.title}</h4>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

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
