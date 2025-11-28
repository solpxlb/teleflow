import React, { useState } from 'react';
import { Task } from '@/lib/mockData';
import { useStore } from '@/lib/store';
import { CheckSquare, Trash2, UserPlus, Tag, Flag } from 'lucide-react';

interface BulkActionsProps {
    selectedTasks: string[];
    onClearSelection: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({ selectedTasks, onClearSelection }) => {
    const { bulkUpdateTasks, bulkDeleteTasks, tasks } = useStore();
    const [, setShowActions] = useState(false);

    if (selectedTasks.length === 0) return null;

    const handleBulkUpdate = (updates: Partial<Task>) => {
        bulkUpdateTasks(selectedTasks, updates);
        onClearSelection();
        setShowActions(false);
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedTasks.length} tasks? This cannot be undone.`)) {
            bulkDeleteTasks(selectedTasks);
            onClearSelection();
        }
    };

    const selectedTasksData = tasks.filter(t => selectedTasks.includes(t.id));
    const totalEstimatedHours = selectedTasksData.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 min-w-[500px]">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-blue-500" />
                            <span className="font-semibold text-white">{selectedTasks.length} tasks selected</span>
                        </div>
                        {totalEstimatedHours > 0 && (
                            <span className="text-sm text-slate-400">
                                ({totalEstimatedHours}h estimated)
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClearSelection}
                        className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                        Clear
                    </button>
                </div>

                <div className="flex gap-2">
                    {/* Assign */}
                    <div className="relative group">
                        <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm">
                            <UserPlus className="w-4 h-4" />
                            Assign
                        </button>
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-2 min-w-[150px]">
                            {['u1', 'u2', 'u3', 'u4', 'u5'].map(userId => (
                                <button
                                    key={userId}
                                    onClick={() => handleBulkUpdate({ assigneeId: userId })}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors"
                                >
                                    User {userId}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Change Status */}
                    <div className="relative group">
                        <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm">
                            <Flag className="w-4 h-4" />
                            Status
                        </button>
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-2 min-w-[150px]">
                            {['todo', 'in_progress', 'review', 'completed', 'blocked'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleBulkUpdate({ status: status as Task['status'] })}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors capitalize"
                                >
                                    {status.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Change Priority */}
                    <div className="relative group">
                        <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm">
                            <Flag className="w-4 h-4" />
                            Priority
                        </button>
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-2 min-w-[150px]">
                            {['low', 'medium', 'high', 'urgent'].map(priority => (
                                <button
                                    key={priority}
                                    onClick={() => handleBulkUpdate({ priority: priority as Task['priority'] })}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors capitalize"
                                >
                                    {priority}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add Tags */}
                    <div className="relative group">
                        <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm">
                            <Tag className="w-4 h-4" />
                            Add Tag
                        </button>
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-2 min-w-[150px]">
                            {['urgent', 'blocked', 'review-needed', 'high-priority'].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => {
                                        selectedTasksData.forEach(task => {
                                            if (!task.tags.includes(tag)) {
                                                handleBulkUpdate({ tags: [...task.tags, tag] });
                                            }
                                        });
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Delete */}
                    <button
                        onClick={handleBulkDelete}
                        className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm ml-auto"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="mt-3 pt-3 border-t border-slate-700 flex gap-4 text-xs text-slate-400">
                    <span>{selectedTasksData.filter(t => t.status === 'completed').length} completed</span>
                    <span>{selectedTasksData.filter(t => t.status === 'in_progress').length} in progress</span>
                    <span>{selectedTasksData.filter(t => t.status === 'blocked').length} blocked</span>
                </div>
            </div>
        </div>
    );
};

export default BulkActions;
