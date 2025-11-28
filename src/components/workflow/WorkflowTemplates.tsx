import React, { useState } from 'react';
import { WorkflowTemplate } from '@/lib/mockData';
import { useStore } from '@/lib/store';
import { Search, Plus, Copy, Trash2, Play, FileText, Wrench, AlertTriangle, FileCheck, Building, Radio } from 'lucide-react';
import { format } from 'date-fns';

interface WorkflowTemplatesProps {
    onSelectTemplate: (template: WorkflowTemplate) => void;
    onCreateNew: () => void;
}

const categoryIcons = {
    maintenance: Wrench,
    installation: Building,
    survey: FileCheck,
    emergency: AlertTriangle,
    lease: FileText,
    rollout: Radio,
    custom: Plus,
};

const categoryColors = {
    maintenance: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    installation: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    survey: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    emergency: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    lease: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    rollout: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    custom: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
};

const WorkflowTemplates: React.FC<WorkflowTemplatesProps> = ({ onSelectTemplate, onCreateNew }) => {
    const { workflowTemplates, deleteWorkflowTemplate, addWorkflowTemplate } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredTemplates = workflowTemplates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleClone = (template: WorkflowTemplate) => {
        const clonedTemplate: WorkflowTemplate = {
            ...template,
            id: `wt-${Date.now()}`,
            name: `${template.name} (Copy)`,
            isPublic: false,
            createdBy: 'current-user',
            createdAt: new Date().toISOString(),
        };
        addWorkflowTemplate(clonedTemplate);
    };

    const categories = [
        { id: 'all', label: 'All Templates' },
        { id: 'maintenance', label: 'Maintenance' },
        { id: 'installation', label: 'Installation' },
        { id: 'survey', label: 'Survey' },
        { id: 'emergency', label: 'Emergency' },
        { id: 'lease', label: 'Lease' },
        { id: 'rollout', label: 'Rollout' },
        { id: 'custom', label: 'Custom' },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Workflow Templates</h3>
                    <button
                        onClick={onCreateNew}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Template
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Template List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredTemplates.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">No templates found</p>
                    </div>
                ) : (
                    filteredTemplates.map(template => {
                        const Icon = categoryIcons[template.category];
                        const colorClass = categoryColors[template.category];

                        return (
                            <div
                                key={template.id}
                                className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer group"
                                onClick={() => onSelectTemplate(template)}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-lg ${colorClass} border`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                {template.name}
                                            </h4>
                                            <p className="text-xs text-slate-500 capitalize">{template.category}</p>
                                        </div>
                                    </div>
                                    {template.isPublic && (
                                        <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20">
                                            Public
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-slate-400 mb-3 line-clamp-2">{template.description}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <span>{template.nodes.length} nodes</span>
                                        <span>•</span>
                                        <span>{format(new Date(template.createdAt), 'MMM d, yyyy')}</span>
                                    </div>

                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectTemplate(template);
                                            }}
                                            className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded transition-colors"
                                            title="Use Template"
                                        >
                                            <Play className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleClone(template);
                                            }}
                                            className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
                                            title="Clone Template"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                        {!template.isPublic && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm('Delete this template?')) {
                                                        deleteWorkflowTemplate(template.id);
                                                    }
                                                }}
                                                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded transition-colors"
                                                title="Delete Template"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default WorkflowTemplates;
