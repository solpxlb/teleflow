import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, Node, Edge, Position } from 'react-flow-renderer';
import { Task } from '@/lib/mockData';

import { AlertTriangle, CheckCircle } from 'lucide-react';

interface DependencyGraphProps {
    tasks: Task[];
    onTaskClick?: (taskId: string) => void;
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({ tasks, onTaskClick }) => {
    const { nodes, edges, criticalPath } = useMemo(() => {
        // Create nodes from tasks
        const taskNodes: Node[] = tasks.map((task, index) => ({
            id: task.id,
            type: 'default',
            data: {
                label: (
                    <div className="text-xs">
                        <div className="font-semibold truncate max-w-[150px]">{task.title}</div>
                        <div className="text-slate-500 capitalize">{task.status}</div>
                    </div>
                )
            },
            position: {
                x: (index % 4) * 200,
                y: Math.floor(index / 4) * 120
            },
            style: {
                background: task.status === 'completed' ? '#10b981' :
                    task.status === 'blocked' ? '#ef4444' :
                        task.status === 'in_progress' ? '#3b82f6' : '#64748b',
                color: '#fff',
                border: '2px solid #1e293b',
                borderRadius: '8px',
                padding: '10px',
                width: 180,
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
        }));

        // Create edges from dependencies
        const taskEdges: Edge[] = [];
        tasks.forEach(task => {
            task.dependencies.forEach(depId => {
                taskEdges.push({
                    id: `${depId}-${task.id}`,
                    source: depId,
                    target: task.id,
                    animated: task.status === 'blocked',
                    style: {
                        stroke: task.status === 'blocked' ? '#ef4444' : '#64748b',
                        strokeWidth: 2,
                    },
                    label: task.status === 'blocked' ? 'Blocking' : undefined,
                    labelStyle: { fill: '#ef4444', fontWeight: 600 },
                });
            });
        });

        // Simple critical path calculation (tasks with most dependencies)
        const taskDependencyCounts = new Map<string, number>();
        tasks.forEach(task => {
            const count = task.dependencies.length;
            taskDependencyCounts.set(task.id, count);
        });

        const criticalTasks = Array.from(taskDependencyCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([id]) => id);

        return { nodes: taskNodes, edges: taskEdges, criticalPath: criticalTasks };
    }, [tasks]);

    // Check for circular dependencies
    const hasCircularDependencies = useMemo(() => {
        const visited = new Set<string>();
        const recursionStack = new Set<string>();

        const hasCycle = (taskId: string): boolean => {
            visited.add(taskId);
            recursionStack.add(taskId);

            const task = tasks.find(t => t.id === taskId);
            if (task) {
                for (const depId of task.dependencies) {
                    if (!visited.has(depId)) {
                        if (hasCycle(depId)) return true;
                    } else if (recursionStack.has(depId)) {
                        return true;
                    }
                }
            }

            recursionStack.delete(taskId);
            return false;
        };

        return tasks.some(task => !visited.has(task.id) && hasCycle(task.id));
    }, [tasks]);

    const blockedTasks = tasks.filter(t => t.status === 'blocked').length;

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">Task Dependencies</h3>
                    <div className="flex gap-2">
                        {hasCircularDependencies && (
                            <span className="flex items-center gap-1 text-xs bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full border border-rose-500/20">
                                <AlertTriangle className="w-3 h-3" />
                                Circular Dependencies Detected
                            </span>
                        )}
                        {blockedTasks > 0 && (
                            <span className="flex items-center gap-1 text-xs bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full border border-amber-500/20">
                                <AlertTriangle className="w-3 h-3" />
                                {blockedTasks} Blocked Tasks
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-xs bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full border border-blue-500/20">
                            <CheckCircle className="w-3 h-3" />
                            {tasks.length} Total Tasks
                        </span>
                    </div>
                </div>
            </div>

            {/* Graph */}
            <div className="h-[500px] bg-white">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodeClick={(_, node) => onTaskClick?.(node.id)}
                    fitView
                    attributionPosition="bottom-left"
                >
                    <Background color="#334155" gap={16} />
                    <Controls className="bg-white border-slate-200" />
                </ReactFlow>
            </div>

            {/* Legend */}
            <div className="p-4 border-t border-slate-200 bg-white/50">
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-blue-500"></div>
                        <span className="text-slate-600">In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-emerald-500"></div>
                        <span className="text-slate-600">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-rose-500"></div>
                        <span className="text-slate-600">Blocked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-slate-500"></div>
                        <span className="text-slate-600">Not Started</span>
                    </div>
                    {criticalPath.length > 0 && (
                        <div className="ml-auto text-slate-600">
                            Critical Path: {criticalPath.length} tasks
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DependencyGraph;
