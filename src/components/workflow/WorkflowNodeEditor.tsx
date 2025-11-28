import React, { useState } from 'react';
import { WorkflowNode } from '@/lib/mockData';
import { USERS } from '@/lib/mockData';
import { X, User, Calendar, Clock, FileText, GitBranch, Bell, Upload, FileCode } from 'lucide-react';

interface WorkflowNodeEditorProps {
    node: WorkflowNode | null;
    onClose: () => void;
    onSave: (node: WorkflowNode) => void;
}

const WorkflowNodeEditor: React.FC<WorkflowNodeEditorProps> = ({ node, onClose, onSave }) => {
    const [label, setLabel] = useState(node?.data.label || '');
    const [config, setConfig] = useState(node?.data.config || {});

    if (!node) return null;

    const handleSave = () => {
        onSave({
            ...node,
            data: {
                ...node.data,
                label,
                config,
            },
        });
        onClose();
    };

    const renderAssigneeSelector = (label: string = 'Assign To', helpText?: string) => (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                {label}
            </label>
            <select
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                value={config.assigneeId || ''}
                onChange={(e) => setConfig({ ...config, assigneeId: e.target.value })}
            >
                <option value="">Select team member...</option>
                {USERS.map(user => (
                    <option key={user.id} value={user.id}>
                        {user.name} ({user.role.replace('_', ' ').toUpperCase()})
                    </option>
                ))}
            </select>
            {config.assigneeId && (
                <div className="mt-2 p-3 bg-slate-900 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3">
                        <img
                            src={USERS.find(u => u.id === config.assigneeId)?.avatar}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                            <div className="text-sm font-medium text-white">
                                {USERS.find(u => u.id === config.assigneeId)?.name}
                            </div>
                            <div className="text-xs text-slate-400">
                                {USERS.find(u => u.id === config.assigneeId)?.email}
                            </div>
                        </div>
                    </div>
                    {helpText && (
                        <div className="text-xs text-slate-400 mt-2">
                            {helpText}
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const renderConfigFields = () => {
        switch (node.type) {
            case 'task':
                return (
                    <>
                        {renderAssigneeSelector('Assign To', 'Task will be automatically created and assigned when workflow executes')}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Due Date (days from start)
                            </label>
                            <input
                                type="number"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                                value={config.dueDays || 7}
                                onChange={(e) => setConfig({ ...config, dueDays: parseInt(e.target.value) })}
                            />
                            <div className="text-xs text-slate-500 mt-1">
                                Task will be due {config.dueDays || 7} days after workflow starts
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                <FileText className="w-4 h-4 inline mr-2" />
                                Description
                            </label>
                            <textarea
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
                                rows={3}
                                value={config.description || ''}
                                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                                placeholder="Task description..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Estimated Hours
                            </label>
                            <input
                                type="number"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                                value={config.estimatedHours || 8}
                                onChange={(e) => setConfig({ ...config, estimatedHours: parseInt(e.target.value) })}
                            />
                        </div>
                    </>
                );

            case 'approval':
                return (
                    <>
                        {renderAssigneeSelector('Approver', 'This team member will be notified to approve this step')}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Fallback Approver Role
                            </label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                                value={config.approverRole || 'pm'}
                                onChange={(e) => setConfig({ ...config, approverRole: e.target.value })}
                            >
                                <option value="pm">Project Manager</option>
                                <option value="team_lead">Team Lead</option>
                                <option value="admin">Admin</option>
                                <option value="super_admin">Super Admin</option>
                            </select>
                            <div className="text-xs text-slate-500 mt-1">
                                Used if assigned approver is unavailable
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                <Clock className="w-4 h-4 inline mr-2" />
                                SLA (hours)
                            </label>
                            <input
                                type="number"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                                value={config.slaHours || 24}
                                onChange={(e) => setConfig({ ...config, slaHours: parseInt(e.target.value) })}
                            />
                        </div>
                    </>
                );

            case 'condition':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                <GitBranch className="w-4 h-4 inline mr-2" />
                                Condition Type
                            </label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                                value={config.conditionType || 'approval'}
                                onChange={(e) => setConfig({ ...config, conditionType: e.target.value })}
                            >
                                <option value="approval">Approval Status</option>
                                <option value="field_value">Field Value</option>
                                <option value="custom">Custom Logic</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Condition Expression
                            </label>
                            <input
                                type="text"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono text-sm"
                                value={config.expression || ''}
                                onChange={(e) => setConfig({ ...config, expression: e.target.value })}
                                placeholder="e.g., status == 'approved'"
                            />
                        </div>
                    </>
                );

            case 'delay':
                return (
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            <Clock className="w-4 h-4 inline mr-2" />
                            Delay Duration (days)
                        </label>
                        <input
                            type="number"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                            value={config.delayDays || 1}
                            onChange={(e) => setConfig({ ...config, delayDays: parseInt(e.target.value) })}
                        />
                    </div>
                );

            case 'notification':
                return (
                    <>
                        {renderAssigneeSelector('Notify Team Member', 'This team member will receive the notification')}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                <Bell className="w-4 h-4 inline mr-2" />
                                Notification Type
                            </label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                                value={config.notificationType || 'email'}
                                onChange={(e) => setConfig({ ...config, notificationType: e.target.value })}
                            >
                                <option value="email">Email</option>
                                <option value="sms">SMS</option>
                                <option value="in_app">In-App</option>
                                <option value="all">All Channels</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Message Template
                            </label>
                            <textarea
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
                                rows={3}
                                value={config.message || ''}
                                onChange={(e) => setConfig({ ...config, message: e.target.value })}
                                placeholder="Notification message..."
                            />
                        </div>
                    </>
                );

            case 'document':
                return (
                    <>
                        {renderAssigneeSelector('Assign Document Upload To', 'This team member will be responsible for uploading required documents')}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                <Upload className="w-4 h-4 inline mr-2" />
                                Required Document Types
                            </label>
                            <div className="space-y-2">
                                {['PDF', 'Image', 'AutoCAD', 'Excel', 'Word'].map(type => (
                                    <label key={type} className="flex items-center gap-2 text-sm text-slate-300">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
                                            checked={config.allowedTypes?.includes(type) || false}
                                            onChange={(e) => {
                                                const types = config.allowedTypes || [];
                                                setConfig({
                                                    ...config,
                                                    allowedTypes: e.target.checked
                                                        ? [...types, type]
                                                        : types.filter((t: string) => t !== type)
                                                });
                                            }}
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </>
                );

            case 'autocad':
                return (
                    <>
                        {renderAssigneeSelector('Assign Review To', 'This team member will review the AI analysis results')}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                <FileCode className="w-4 h-4 inline mr-2" />
                                AI Analysis Type
                            </label>
                            <div className="space-y-2">
                                {['Structural', 'Cost', 'Compliance', 'Optimization'].map(type => (
                                    <label key={type} className="flex items-center gap-2 text-sm text-slate-300">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
                                            checked={config.analysisTypes?.includes(type) || false}
                                            onChange={(e) => {
                                                const types = config.analysisTypes || [];
                                                setConfig({
                                                    ...config,
                                                    analysisTypes: e.target.checked
                                                        ? [...types, type]
                                                        : types.filter((t: string) => t !== type)
                                                });
                                            }}
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm text-slate-300">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
                                    checked={config.autoApprove || false}
                                    onChange={(e) => setConfig({ ...config, autoApprove: e.target.checked })}
                                />
                                Auto-approve if no critical issues
                            </label>
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">
                        Configure {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Node Label
                        </label>
                        <input
                            type="text"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="Enter node label..."
                        />
                    </div>

                    {renderConfigFields()}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkflowNodeEditor;
