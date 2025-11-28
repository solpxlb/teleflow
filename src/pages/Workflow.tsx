import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    ReactFlowInstance,
    ReactFlowProvider
} from 'react-flow-renderer';
import { Send, Sparkles, Bot, Play, Save, MousePointer2, Box, ArrowRightLeft, CheckCircle2, Settings, Zap } from 'lucide-react';
import { useStore } from '@/lib/store';
import { WorkflowNode } from '@/lib/mockData';
import WorkflowTemplates from '@/components/workflow/WorkflowTemplates';
import WorkflowNodeEditor from '@/components/workflow/WorkflowNodeEditor';
import WorkflowTriggers from '@/components/workflow/WorkflowTriggers';
import WorkflowExecutionPanel from '@/components/workflow/WorkflowExecutionPanel';

const initialNodes: Node[] = [
    { id: '1', type: 'input', data: { label: 'Start Process' }, position: { x: 250, y: 5 } },
];

const initialEdges: Edge[] = [];

let id = 0;
const getId = () => `dndnode_${id++}`;

const WorkflowContent: React.FC = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [mode, setMode] = useState<'templates' | 'manual' | 'ai'>('templates');
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
    const [showTriggers, setShowTriggers] = useState(false);
    const [showExecution, setShowExecution] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<string>('');

    const { workflowTemplates } = useStore();

    const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            if (reactFlowWrapper.current && reactFlowInstance) {
                const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
                const type = event.dataTransfer.getData('application/reactflow');

                if (typeof type === 'undefined' || !type) {
                    return;
                }

                const position = reactFlowInstance.project({
                    x: event.clientX - reactFlowBounds.left,
                    y: event.clientY - reactFlowBounds.top,
                });

                const newNode: Node = {
                    id: getId(),
                    type,
                    position,
                    data: { label: `${type} node` },
                };

                setNodes((nds) => nds.concat(newNode));
            }
        },
        [reactFlowInstance, setNodes]
    );

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleGenerateWorkflow = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const generatedNodes: Node[] = [
                { id: '1', type: 'input', data: { label: 'Start: Site Survey' }, position: { x: 250, y: 25 } },
                { id: '2', type: 'default', data: { label: 'Assign Survey Team' }, position: { x: 250, y: 125 } },
                { id: '3', type: 'default', data: { label: 'Conduct Site Visit' }, position: { x: 250, y: 225 } },
                { id: '4', type: 'default', data: { label: 'Upload Photos & Data' }, position: { x: 250, y: 325 } },
                { id: '5', type: 'default', data: { label: 'Generate Report' }, position: { x: 250, y: 425 } },
                { id: '6', type: 'output', data: { label: 'Complete Survey' }, position: { x: 250, y: 525 } },
            ];

            const generatedEdges: Edge[] = [
                { id: 'e1-2', source: '1', target: '2', animated: true },
                { id: 'e2-3', source: '2', target: '3', animated: true },
                { id: 'e3-4', source: '3', target: '4', animated: true },
                { id: 'e4-5', source: '4', target: '5', animated: true },
                { id: 'e5-6', source: '5', target: '6', animated: true },
            ];

            setNodes(generatedNodes);
            setEdges(generatedEdges);
            setIsGenerating(false);
        }, 1500);
    };

    const handleLoadTemplate = (template: any) => {
        setCurrentTemplate(template.id);
        const templateNodes: Node[] = template.nodes.map((node: WorkflowNode, index: number) => ({
            id: node.id,
            type: node.type === 'start' ? 'input' : node.type === 'end' ? 'output' : 'default',
            data: { label: node.data.label, config: node.data.config },
            position: { x: 250, y: index * 100 + 25 },
        }));

        const templateEdges: Edge[] = [];
        template.nodes.forEach((node: WorkflowNode) => {
            node.connections?.forEach((targetId: string) => {
                templateEdges.push({
                    id: `e${node.id}-${targetId}`,
                    source: node.id,
                    target: targetId,
                    animated: true,
                });
            });
        });

        setNodes(templateNodes);
        setEdges(templateEdges);
        setMode('manual');
    };

    const handleNodeClick = (event: React.MouseEvent, node: Node) => {
        const workflowNode: WorkflowNode = {
            id: node.id,
            type: node.type as any,
            data: node.data,
            connections: edges.filter(e => e.source === node.id).map(e => e.target),
        };
        setSelectedNode(workflowNode);
    };

    const handleSaveNode = (updatedNode: WorkflowNode) => {
        setNodes(nds => nds.map(n =>
            n.id === updatedNode.id
                ? { ...n, data: updatedNode.data }
                : n
        ));
        setSelectedNode(null);
    };

    const convertNodesToWorkflowNodes = (): WorkflowNode[] => {
        return nodes.map(node => ({
            id: node.id,
            type: node.type as any,
            data: node.data,
            connections: edges.filter(e => e.source === node.id).map(e => e.target),
        }));
    };

    return (
        <div className="flex h-full gap-4">
            {/* Left Sidebar */}
            <div className="w-80 flex flex-col gap-4">
                {/* Mode Selector */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => setMode('templates')}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${mode === 'templates'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                        >
                            Templates
                        </button>
                        <button
                            onClick={() => setMode('manual')}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${mode === 'manual'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                        >
                            Manual
                        </button>
                        <button
                            onClick={() => setMode('ai')}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${mode === 'ai'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                        >
                            AI
                        </button>
                    </div>
                </div>

                {/* Templates Mode */}
                {mode === 'templates' && (
                    <WorkflowTemplates
                        onSelectTemplate={handleLoadTemplate}
                        onCreateNew={() => setMode('manual')}
                    />
                )}

                {/* Manual Mode - Node Palette */}
                {mode === 'manual' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 overflow-y-auto">
                        <h3 className="text-sm font-semibold text-white mb-3">Node Palette</h3>
                        <div className="space-y-2">
                            {[
                                { type: 'task', label: 'Task', icon: CheckCircle2 },
                                { type: 'approval', label: 'Approval', icon: CheckCircle2 },
                                { type: 'condition', label: 'Condition', icon: ArrowRightLeft },
                                { type: 'notification', label: 'Notification', icon: Send },
                                { type: 'delay', label: 'Delay', icon: MousePointer2 },
                                { type: 'document', label: 'Document', icon: Box },
                                { type: 'autocad', label: 'AutoCAD AI', icon: Sparkles },
                            ].map(({ type, label, icon: Icon }) => (
                                <div
                                    key={type}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, type)}
                                    className="bg-slate-800 p-3 rounded-lg border border-slate-700 hover:border-blue-500 cursor-grab active:cursor-grabbing transition-colors flex items-center gap-2"
                                >
                                    <Icon className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm text-slate-200">{label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-800">
                            <button
                                onClick={() => setShowTriggers(!showTriggers)}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 justify-center"
                            >
                                <Settings className="w-4 h-4" />
                                Configure Triggers
                            </button>
                        </div>
                    </div>
                )}

                {/* AI Mode */}
                {mode === 'ai' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <Bot className="w-5 h-5 text-purple-500" />
                            <h3 className="text-sm font-semibold text-white">AI Workflow Generator</h3>
                        </div>
                        <textarea
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 resize-none focus:outline-none focus:border-purple-500"
                            placeholder="Describe your workflow... e.g., 'Create a workflow for tower installation with site survey, equipment delivery, and installation tasks'"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <button
                            onClick={handleGenerateWorkflow}
                            disabled={isGenerating || !prompt}
                            className="mt-4 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 justify-center transition-colors"
                        >
                            {isGenerating ? (
                                <>
                                    <Sparkles className="w-4 h-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Generate Workflow
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Main Canvas */}
            <div className="flex-1 flex flex-col gap-4">
                {/* Toolbar */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between items-center">
                    <div className="flex gap-2">
                        <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Save
                        </button>
                        <button
                            onClick={() => setShowExecution(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Play className="w-4 h-4" />
                            Test Run
                        </button>
                    </div>
                    <div className="text-sm text-slate-400">
                        {nodes.length} nodes, {edges.length} connections
                    </div>
                </div>

                {/* React Flow Canvas */}
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onNodeClick={handleNodeClick}
                        fitView
                    >
                        <Background color="#334155" gap={16} />
                        <Controls className="bg-slate-800 border-slate-700" />
                        <MiniMap
                            nodeColor={(node) => {
                                switch (node.type) {
                                    case 'input': return '#3b82f6';
                                    case 'output': return '#10b981';
                                    default: return '#64748b';
                                }
                            }}
                            className="bg-slate-800 border border-slate-700"
                        />
                    </ReactFlow>
                </div>
            </div>

            {/* Modals */}
            {selectedNode && (
                <WorkflowNodeEditor
                    node={selectedNode}
                    onClose={() => setSelectedNode(null)}
                    onSave={handleSaveNode}
                />
            )}

            {showTriggers && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full">
                        <WorkflowTriggers onSave={(trigger) => {
                            console.log('Trigger saved:', trigger);
                            setShowTriggers(false);
                        }} />
                        <button
                            onClick={() => setShowTriggers(false)}
                            className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showExecution && (
                <WorkflowExecutionPanel
                    templateId={currentTemplate || 'test-workflow'}
                    nodes={convertNodesToWorkflowNodes()}
                    onClose={() => setShowExecution(false)}
                />
            )}
        </div>
    );
};

const Workflow: React.FC = () => {
    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Workflow Builder</h1>
                <p className="text-slate-400">Design automated workflows with AI assistance</p>
            </div>
            <div className="flex-1 overflow-hidden">
                <ReactFlowProvider>
                    <WorkflowContent />
                </ReactFlowProvider>
            </div>
        </div>
    );
};

export default Workflow;
