import React, { useState } from 'react';
import { Clock, Calendar, Zap, Webhook } from 'lucide-react';

interface WorkflowTriggersProps {
    onSave: (trigger: any) => void;
}

const WorkflowTriggers: React.FC<WorkflowTriggersProps> = ({ onSave }) => {
    const [triggerType, setTriggerType] = useState<'manual' | 'scheduled' | 'event' | 'webhook'>('manual');
    const [config, setConfig] = useState<any>({});

    const handleSave = () => {
        onSave({
            type: triggerType,
            config,
        });
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-4">Workflow Triggers</h3>

            {/* Trigger Type Selection */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                    onClick={() => setTriggerType('manual')}
                    className={`p-3 rounded-lg border transition-all ${triggerType === 'manual'
                            ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                >
                    <Zap className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">Manual</div>
                </button>

                <button
                    onClick={() => setTriggerType('scheduled')}
                    className={`p-3 rounded-lg border transition-all ${triggerType === 'scheduled'
                            ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                >
                    <Clock className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">Scheduled</div>
                </button>

                <button
                    onClick={() => setTriggerType('event')}
                    className={`p-3 rounded-lg border transition-all ${triggerType === 'event'
                            ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                >
                    <Calendar className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">Event-Based</div>
                </button>

                <button
                    onClick={() => setTriggerType('webhook')}
                    className={`p-3 rounded-lg border transition-all ${triggerType === 'webhook'
                            ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                >
                    <Webhook className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">Webhook</div>
                </button>
            </div>

            {/* Configuration based on type */}
            <div className="space-y-3">
                {triggerType === 'manual' && (
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                        <p className="text-sm text-slate-400">
                            This workflow will be triggered manually by users.
                        </p>
                    </div>
                )}

                {triggerType === 'scheduled' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Schedule Type
                            </label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                                value={config.scheduleType || 'daily'}
                                onChange={(e) => setConfig({ ...config, scheduleType: e.target.value })}
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="custom">Custom (Cron)</option>
                            </select>
                        </div>

                        {config.scheduleType === 'custom' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Cron Expression
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono text-sm"
                                    value={config.cronExpression || ''}
                                    onChange={(e) => setConfig({ ...config, cronExpression: e.target.value })}
                                    placeholder="0 0 * * *"
                                />
                                <p className="text-xs text-slate-500 mt-1">Example: 0 0 * * * (daily at midnight)</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Time
                            </label>
                            <input
                                type="time"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                                value={config.time || '09:00'}
                                onChange={(e) => setConfig({ ...config, time: e.target.value })}
                            />
                        </div>
                    </>
                )}

                {triggerType === 'event' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Event Type
                            </label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                                value={config.eventType || 'site_status_change'}
                                onChange={(e) => setConfig({ ...config, eventType: e.target.value })}
                            >
                                <option value="site_status_change">Site Status Change</option>
                                <option value="battery_low">Battery Low</option>
                                <option value="lease_expiring">Lease Expiring</option>
                                <option value="task_completed">Task Completed</option>
                                <option value="document_uploaded">Document Uploaded</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Condition
                            </label>
                            <input
                                type="text"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                                value={config.condition || ''}
                                onChange={(e) => setConfig({ ...config, condition: e.target.value })}
                                placeholder="e.g., battery < 20%"
                            />
                        </div>
                    </>
                )}

                {triggerType === 'webhook' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Webhook URL
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono text-sm"
                                    value={`https://api.teleflow.com/webhooks/${Math.random().toString(36).substr(2, 9)}`}
                                    readOnly
                                />
                                <button
                                    onClick={() => navigator.clipboard.writeText(`https://api.teleflow.com/webhooks/${Math.random().toString(36).substr(2, 9)}`)}
                                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors text-sm"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Authentication
                            </label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                                value={config.auth || 'api_key'}
                                onChange={(e) => setConfig({ ...config, auth: e.target.value })}
                            >
                                <option value="api_key">API Key</option>
                                <option value="bearer">Bearer Token</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                    </>
                )}

                <button
                    onClick={handleSave}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Save Trigger Configuration
                </button>
            </div>
        </div>
    );
};

export default WorkflowTriggers;
