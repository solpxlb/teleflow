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
import { Send, Sparkles, Bot, Play, Save, MousePointer2, Box, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

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
    const [mode, setMode] = useState<'ai' | 'manual'>('ai');
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

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

                // check if the dropped element is valid
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
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        border: '1px solid #475569',
                        padding: '10px',
                        borderRadius: '5px',
                        width: 150,
                    },
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

    const handleGenerate = () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);

        // Simulate AI generation delay
        setTimeout(() => {
            const newNodes: Node[] = [
                { id: '1', type: 'input', data: { label: 'Start: ' + prompt.slice(0, 15) + '...' }, position: { x: 250, y: 50 }, style: { background: '#1e293b', color: '#fff', border: '1px solid #475569' } },
                { id: '2', data: { label: 'Assign Technician' }, position: { x: 250, y: 150 }, style: { background: '#1e293b', color: '#fff', border: '1px solid #475569' } },
                { id: '3', data: { label: 'Check Inventory' }, position: { x: 100, y: 250 }, style: { background: '#1e293b', color: '#fff', border: '1px solid #475569' } },
                { id: '4', data: { label: 'Schedule Visit' }, position: { x: 400, y: 250 }, style: { background: '#1e293b', color: '#fff', border: '1px solid #475569' } },
                { id: '5', type: 'output', data: { label: 'Complete' }, position: { x: 250, y: 350 }, style: { background: '#1e293b', color: '#fff', border: '1px solid #475569' } },
            ];

            const newEdges: Edge[] = [
                { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#94a3b8' } },
                { id: 'e2-3', source: '2', target: '3', style: { stroke: '#94a3b8' } },
                { id: 'e2-4', source: '2', target: '4', style: { stroke: '#94a3b8' } },
                { id: 'e3-5', source: '3', target: '5', style: { stroke: '#94a3b8' } },
                { id: 'e4-5', source: '4', target: '5', style: { stroke: '#94a3b8' } },
            ];

            setNodes(newNodes);
            setEdges(newEdges);
            setIsGenerating(false);
            setPrompt('');
        }, 1500);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Workflow Builder</h1>
                    <p className="text-slate-400">Design automated processes</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-slate-700">
                        <Save className="w-4 h-4" />
                        Save Template
                    </button>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <Play className="w-4 h-4" />
                        Test Run
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Left Panel */}
                <div className="w-1/3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
                    {/* Mode Toggle */}
                    <div className="p-2 border-b border-slate-800 bg-slate-950 flex gap-1">
                        <button
                            onClick={() => setMode('ai')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${mode === 'ai' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                }`}
                        >
                            <Sparkles className="w-4 h-4" />
                            AI Assistant
                        </button>
                        <button
                            onClick={() => setMode('manual')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${mode === 'manual' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                }`}
                        >
                            <MousePointer2 className="w-4 h-4" />
                            Manual
                        </button>
                    </div>

                    {mode === 'ai' ? (
                        // AI Mode Content
                        <>
                            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <Bot className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div className="bg-slate-800 p-3 rounded-lg rounded-tl-none text-sm text-slate-300">
                                        Hi! I can help you build automated workflows. Try asking: <br />
                                        <span className="text-blue-400 italic">"Create a maintenance workflow for generator repair."</span>
                                    </div>
                                </div>

                                {isGenerating && (
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                            <Bot className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div className="bg-slate-800 p-3 rounded-lg rounded-tl-none text-sm text-slate-300 animate-pulse">
                                            Generating workflow nodes...
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-slate-800 bg-slate-950">
                                <div className="relative">
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Describe your workflow..."
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-4 pr-12 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-none h-24"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleGenerate();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleGenerate}
                                        disabled={!prompt.trim() || isGenerating}
                                        className="absolute right-3 bottom-3 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Manual Mode Content (Toolbox)
                        <div className="flex-1 p-4 overflow-y-auto">
                            <p className="text-sm text-slate-400 mb-4">Drag nodes to the canvas</p>
                            <div className="space-y-3">
                                <div
                                    className="bg-slate-800 p-4 rounded-lg border border-slate-700 cursor-grab hover:border-blue-500 transition-colors flex items-center gap-3"
                                    onDragStart={(event) => onDragStart(event, 'input')}
                                    draggable
                                >
                                    <div className="p-2 bg-emerald-500/10 rounded">
                                        <Play className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-200">Start Node</h4>
                                        <p className="text-xs text-slate-500">Triggers the workflow</p>
                                    </div>
                                </div>

                                <div
                                    className="bg-slate-800 p-4 rounded-lg border border-slate-700 cursor-grab hover:border-blue-500 transition-colors flex items-center gap-3"
                                    onDragStart={(event) => onDragStart(event, 'default')}
                                    draggable
                                >
                                    <div className="p-2 bg-blue-500/10 rounded">
                                        <Box className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-200">Process Node</h4>
                                        <p className="text-xs text-slate-500">Performs an action</p>
                                    </div>
                                </div>

                                <div
                                    className="bg-slate-800 p-4 rounded-lg border border-slate-700 cursor-grab hover:border-blue-500 transition-colors flex items-center gap-3"
                                    onDragStart={(event) => onDragStart(event, 'default')}
                                    draggable
                                >
                                    <div className="p-2 bg-amber-500/10 rounded">
                                        <ArrowRightLeft className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-200">Decision Node</h4>
                                        <p className="text-xs text-slate-500">Branching logic</p>
                                    </div>
                                </div>

                                <div
                                    className="bg-slate-800 p-4 rounded-lg border border-slate-700 cursor-grab hover:border-blue-500 transition-colors flex items-center gap-3"
                                    onDragStart={(event) => onDragStart(event, 'output')}
                                    draggable
                                >
                                    <div className="p-2 bg-rose-500/10 rounded">
                                        <CheckCircle2 className="w-4 h-4 text-rose-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-200">End Node</h4>
                                        <p className="text-xs text-slate-500">Completes the workflow</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel: Canvas */}
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                    >
                        <Background color="#334155" gap={16} />
                        <Controls className="bg-slate-800 border-slate-700 text-slate-200" />
                        <MiniMap
                            className="bg-slate-800 border-slate-700"
                            nodeColor={() => '#475569'}
                            maskColor="rgba(15, 23, 42, 0.7)"
                        />
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
};

const Workflow: React.FC = () => {
    return (
        <ReactFlowProvider>
            <WorkflowContent />
        </ReactFlowProvider>
    );
};

export default Workflow;
