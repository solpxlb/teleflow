import React, { useState } from 'react';
import { Task } from '@/lib/mockData';
import { useStore } from '@/lib/store';
import { X, Calendar, Tag, CheckSquare, MessageSquare, Paperclip, Send, Edit2, Save } from 'lucide-react';
import { format } from 'date-fns';

interface TaskDetailModalProps {
    task: Task;
    onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
    const { users, updateTask } = useStore();
    const [activeTab, setActiveTab] = useState<'overview' | 'subtasks' | 'comments'>('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState<Task>(task);
    
    const assignee = users.find(u => u.id === editedTask.assigneeId);
    const reporter = users.find(u => u.id === editedTask.reporterId);

    const handleSave = () => {
        updateTask(editedTask.id, editedTask);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedTask(task);
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-50 w-full max-w-4xl h-[80vh] rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-mono text-slate-500">{editedTask.id}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded border ${editedTask.priority === 'urgent' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                editedTask.priority === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                    editedTask.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                }`}>
                                {editedTask.priority.toUpperCase()}
                            </span>
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedTask.title}
                                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                className="text-2xl font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-slate-900">{editedTask.title}</h2>
                        )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    <Save className="w-4 h-4" />
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="text-slate-500 hover:text-slate-900 transition-colors px-4 py-2"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </button>
                        )}
                        <button onClick={onClose} className="text-slate-500 hover:text-slate-900 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 px-6 bg-slate-50/50">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-600 hover:text-slate-700'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('subtasks')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'subtasks' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-600 hover:text-slate-700'}`}
                    >
                        Subtasks ({task.subtasks?.length || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('comments')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'comments' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-600 hover:text-slate-700'}`}
                    >
                        Comments ({task.comments?.length || 0})
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-white/50">

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-3 gap-8">
                            <div className="col-span-2 space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-600 mb-2">Description</h3>
                                    {isEditing ? (
                                        <textarea
                                            value={editedTask.description}
                                            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-blue-500 resize-none"
                                            rows={4}
                                        />
                                    ) : (
                                        <p className="text-slate-700 leading-relaxed">{editedTask.description}</p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-slate-600 mb-2">Attachments</h3>
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-slate-200 transition-colors cursor-pointer bg-slate-50/50">
                                        <Paperclip className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                                        <p className="text-sm text-slate-500">Drag & drop files here, or click to upload</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                                    {/* Status */}
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Status</label>
                                        {isEditing ? (
                                            <select
                                                value={editedTask.status}
                                                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as Task['status'] })}
                                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="todo">To Do</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="review">Review</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        ) : (
                                            <div className="text-sm text-slate-700 capitalize">{editedTask.status.replace('_', ' ')}</div>
                                        )}
                                    </div>

                                    {/* Priority */}
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Priority</label>
                                        {isEditing ? (
                                            <select
                                                value={editedTask.priority}
                                                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Task['priority'] })}
                                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                                <option value="urgent">Urgent</option>
                                            </select>
                                        ) : (
                                            <div className="text-sm text-slate-700 capitalize">{editedTask.priority}</div>
                                        )}
                                    </div>

                                    {/* Assignee */}
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Assignee</label>
                                        {isEditing ? (
                                            <select
                                                value={editedTask.assigneeId}
                                                onChange={(e) => setEditedTask({ ...editedTask, assigneeId: e.target.value })}
                                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">Unassigned</option>
                                                {users.map(user => (
                                                    <option key={user.id} value={user.id}>{user.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                {assignee?.avatar && <img src={assignee.avatar} className="w-6 h-6 rounded-full" alt={assignee.name} />}
                                                <span className="text-sm text-slate-700">{assignee?.name || 'Unassigned'}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Reporter */}
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Reporter</label>
                                        <div className="flex items-center gap-2">
                                            {reporter?.avatar && <img src={reporter.avatar} className="w-6 h-6 rounded-full" alt={reporter.name} />}
                                            <span className="text-sm text-slate-700">{reporter?.name || 'System'}</span>
                                        </div>
                                    </div>

                                    {/* Due Date */}
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Due Date</label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={editedTask.dueDate.split('T')[0]}
                                                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 text-slate-700">
                                                <Calendar className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm">{format(new Date(editedTask.dueDate), 'MMM d, yyyy')}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Tags</label>
                                        <div className="flex flex-wrap gap-2">
                                            {editedTask.tags.map(tag => (
                                                <span key={tag} className="text-xs bg-white text-slate-600 px-2 py-1 rounded flex items-center gap-1">
                                                    <Tag className="w-3 h-3" /> {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Subtasks Tab */}
                    {activeTab === 'subtasks' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="Add a new subtask..."
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:border-blue-500"
                                />
                                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg">Add</button>
                            </div>

                            {(task.subtasks?.length || 0) === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                    <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No subtasks yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {(task.subtasks || []).map(sub => (
                                        <div key={sub.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg group hover:border-slate-200 transition-colors">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${sub.completed ? 'bg-blue-500 border-blue-500' : 'border-slate-600'}`}>
                                                {sub.completed && <CheckSquare className="w-3 h-3 text-slate-900" />}
                                            </div>
                                            <span className={`text-sm ${sub.completed ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{sub.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Comments Tab */}
                    {activeTab === 'comments' && (
                        <div className="flex flex-col h-full">
                            <div className="flex-1 space-y-6 mb-6">
                                {(task.comments?.length || 0) === 0 ? (
                                    <div className="text-center py-12 text-slate-500">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No comments yet. Start the discussion!</p>
                                    </div>
                                ) : (
                                    (task.comments || []).map(comment => {
                                        const user = users.find(u => u.id === comment.userId);
                                        return (
                                            <div key={comment.id} className="flex gap-4">
                                                <img src={user?.avatar} className="w-8 h-8 rounded-full" />
                                                <div className="flex-1">
                                                    <div className="bg-slate-50 p-4 rounded-xl rounded-tl-none border border-slate-200">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="font-semibold text-slate-700 text-sm">{user?.name}</span>
                                                            <span className="text-xs text-slate-500">{format(new Date(comment.timestamp), 'MMM d, h:mm a')}</span>
                                                        </div>
                                                        <p className="text-slate-600 text-sm">{comment.text}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="relative">
                                <textarea
                                    placeholder="Write a comment..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-700 focus:outline-none focus:border-blue-500 resize-none h-24"
                                />
                                <button className="absolute right-3 bottom-3 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
