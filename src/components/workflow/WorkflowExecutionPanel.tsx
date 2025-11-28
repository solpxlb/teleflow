import React, { useState } from 'react';
import { WorkflowExecution, WorkflowNode } from '@/lib/mockData';
import { useStore } from '@/lib/store';
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface WorkflowExecutionPanelProps {
    templateId: string;
    nodes: WorkflowNode[];
    onClose: () => void;
}

const WorkflowExecutionPanel: React.FC<WorkflowExecutionPanelProps> = ({ templateId, nodes, onClose }) => {
    const { workflowExecutions, executeWorkflow, updateWorkflowExecution, addTask } = useStore();
    const [currentExecution, setCurrentExecution] = useState<WorkflowExecution | null>(null);
    const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
    const [executionLog, setExecutionLog] = useState<string[]>([]);
    const [variables, setVariables] = useState<Record<string, any>>({
        siteId: 's1',
        priority: 'medium',
    });

    const handleStartExecution = () => {
        // Create new execution
        executeWorkflow(templateId, variables);

        // Get the newly created execution
        const newExecution = workflowExecutions[workflowExecutions.length - 1];
        setCurrentExecution(newExecution);
        setCurrentNodeIndex(0);
        setExecutionLog([`[${format(new Date(), 'HH:mm:ss')}] Workflow execution started`]);

        // Start processing nodes
        processNextNode(0, newExecution);
    };

    const processNextNode = async (nodeIndex: number, execution: WorkflowExecution) => {
        if (nodeIndex >= nodes.length) {
            // Workflow complete
            updateWorkflowExecution(execution.id, {
                status: 'completed',
                endTime: new Date().toISOString(),
            });
            setExecutionLog(prev => [...prev, `[${format(new Date(), 'HH:mm:ss')}] ✅ Workflow completed successfully`]);
            return;
        }

        const node = nodes[nodeIndex];
        setCurrentNodeIndex(nodeIndex);
        setExecutionLog(prev => [...prev, `[${format(new Date(), 'HH:mm:ss')}] Processing node: ${node.data.label}`]);

        // Simulate node execution based on type
        setTimeout(() => {
            switch (node.type) {
                case 'task':
                    // Create actual task
                    const taskId = `task-${Date.now()}`;
                    addTask({
                        id: taskId,
                        title: node.data.label,
                        description: node.data.config?.description || '',
                        status: 'todo',
                        priority: variables.priority || 'medium',
                        assigneeId: node.data.config?.assigneeId || 'u1',
                        reporterId: 'u1',
                        siteId: variables.siteId || 's1',
                        dueDate: new Date(Date.now() + (node.data.config?.dueDays || 7) * 24 * 60 * 60 * 1000).toISOString(),
                        estimatedHours: node.data.config?.estimatedHours || 8,
                        tags: ['workflow-generated'],
                        dependencies: [],
                        subtasks: [],
                        attachments: [],
                        comments: [],
                        startDate: new Date().toISOString(),
                    });
                    setExecutionLog(prev => [...prev, `[${format(new Date(), 'HH:mm:ss')}] ✓ Task created: ${node.data.label} (assigned to User ${node.data.config?.assigneeId})`]);
                    break;

                case 'approval':
                    setExecutionLog(prev => [...prev, `[${format(new Date(), 'HH:mm:ss')}] ⏳ Approval requested from ${node.data.config?.approverRole}`]);
                    // Simulate auto-approval for test
                    setTimeout(() => {
                        setExecutionLog(prev => [...prev, `[${format(new Date(), 'HH:mm:ss')}] ✓ Approval granted`]);
                        processNextNode(nodeIndex + 1, execution);
                    }, 1000);
                    return;

                case 'notification':
                    setExecutionLog(prev => [...prev, `[${format(new Date(), 'HH:mm:ss')}] 📧 Notification sent via ${node.data.config?.notificationType}`]);
                    break;

                case 'delay':
                    const delayDays = node.data.config?.delayDays || 1;
                    setExecutionLog(prev => [...prev, `[${format(new Date(), 'HH:mm:ss')}] ⏱️ Delay: ${delayDays} days (simulated)`]);
                    break;

                case 'condition':
                    const conditionMet = Math.random() > 0.3; // Simulate condition check
                    setExecutionLog(prev => [...prev, `[${format(new Date(), 'HH:mm:ss')}] 🔀 Condition evaluated: ${conditionMet ? 'TRUE' : 'FALSE'}`]);
                    break;

                case 'document':
                    setExecutionLog(prev => [...prev, `[${format(new Date(), 'HH:mm:ss')}] 📄 Document upload required`]);
                    break;

                case 'autocad':
                    setExecutionLog(prev => [...prev, `[${format(new Date(), 'HH:mm:ss')}] 🤖 AI analysis initiated for AutoCAD file`]);
                    break;

                default:
                    setExecutionLog(prev => [...prev, `[${format(new Date(), 'HH:mm:ss')}] ℹ️ Processing ${node.type} node`]);
            }

            // Move to next node
            processNextNode(nodeIndex + 1, execution);
        }, 800); // Simulate processing time
    };

    const handlePauseExecution = () => {
        if (currentExecution) {
            updateWorkflowExecution(currentExecution.id, { status: 'paused' });
            setExecutionLog(prev => [...prev, `[${format(new Date(), 'HH:mm:ss')}] ⏸️ Execution paused`]);
        }
    };

    const handleResetExecution = () => {
        setCurrentExecution(null);
        setCurrentNodeIndex(0);
        setExecutionLog([]);
    };

    const getNodeStatus = (index: number) => {
        if (!currentExecution) return 'pending';
        if (index < currentNodeIndex) return 'completed';
        if (index === currentNodeIndex) return 'running';
        return 'pending';
    };

    const statusIcons = {
        pending: Clock,
        running: Play,
        completed: CheckCircle,
        failed: XCircle,
    };

    const statusColors = {
        pending: 'text-slate-500',
        running: 'text-blue-500 animate-pulse',
        completed: 'text-emerald-500',
        failed: 'text-rose-500',
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <div>
                        <h3 className="text-lg font-bold text-white">Test Workflow Execution</h3>
                        <p className="text-sm text-slate-400">Simulate workflow with task creation</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Left: Node Progress */}
                    <div className="w-1/3 border-r border-slate-800 p-4 overflow-y-auto bg-slate-950/50">
                        <h4 className="text-sm font-semibold text-slate-300 mb-3">Workflow Nodes</h4>
                        <div className="space-y-2">
                            {nodes.map((node, index) => {
                                const status = getNodeStatus(index);
                                const StatusIcon = statusIcons[status as keyof typeof statusIcons];
                                const colorClass = statusColors[status as keyof typeof statusColors];

                                return (
                                    <div
                                        key={node.id}
                                        className={`p-3 rounded-lg border ${status === 'running'
                                            ? 'bg-blue-500/10 border-blue-500/50'
                                            : status === 'completed'
                                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                                : 'bg-slate-800 border-slate-700'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <StatusIcon className={`w-4 h-4 ${colorClass}`} />
                                            <span className="text-sm font-medium text-white capitalize">
                                                {node.type}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-400">{node.data.label}</div>
                                        {node.data.config?.assigneeId && (
                                            <div className="text-xs text-slate-500 mt-1">
                                                → User {node.data.config.assigneeId}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Execution Log */}
                    <div className="flex-1 flex flex-col">
                        {/* Variables */}
                        <div className="p-4 border-b border-slate-800 bg-slate-950/30">
                            <h4 className="text-sm font-semibold text-slate-300 mb-2">Variables</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-slate-400">Site ID</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-slate-200"
                                        value={variables.siteId}
                                        onChange={(e) => setVariables({ ...variables, siteId: e.target.value })}
                                        disabled={!!currentExecution}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400">Priority</label>
                                    <select
                                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-slate-200"
                                        value={variables.priority}
                                        onChange={(e) => setVariables({ ...variables, priority: e.target.value })}
                                        disabled={!!currentExecution}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Execution Log */}
                        <div className="flex-1 p-4 overflow-y-auto bg-slate-950 font-mono text-xs">
                            {executionLog.length === 0 ? (
                                <div className="text-center text-slate-500 py-8">
                                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                                    <p>Click "Start Test Run" to begin execution</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {executionLog.map((log, index) => (
                                        <div key={index} className="text-slate-300">
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
                    <div className="text-sm text-slate-400">
                        {currentExecution && (
                            <>
                                Progress: {currentNodeIndex}/{nodes.length} nodes
                                {currentExecution.status === 'completed' && (
                                    <span className="ml-2 text-emerald-500">✓ Completed</span>
                                )}
                            </>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleResetExecution}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-2"
                            disabled={!currentExecution}
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                        {!currentExecution ? (
                            <button
                                onClick={handleStartExecution}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Play className="w-4 h-4" />
                                Start Test Run
                            </button>
                        ) : currentExecution.status === 'running' ? (
                            <button
                                onClick={handlePauseExecution}
                                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Pause className="w-4 h-4" />
                                Pause
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkflowExecutionPanel;
