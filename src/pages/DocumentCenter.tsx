import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Document } from '@/lib/mockData';
import { Upload, Search, FileText, Image, FileCode, FileCheck, Download, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const typeIcons = {
    autocad: FileCode,
    pdf: FileText,
    image: Image,
    contract: FileCheck,
    permit: FileCheck,
    report: FileText,
};

const DocumentCenter: React.FC = () => {
    const { documents, addDocument, deleteDocument } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
        const matchesType = selectedType === 'all' || doc.type === selectedType;
        return matchesSearch && matchesCategory && matchesType;
    });

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const newDoc: Document = {
                    id: `d-${Date.now()}-${Math.random()}`,
                    name: file.name,
                    type: file.name.endsWith('.dwg') || file.name.endsWith('.dxf') ? 'autocad' :
                        file.name.endsWith('.pdf') ? 'pdf' : 'image',
                    category: 'design',
                    uploadedBy: 'current-user',
                    uploadedAt: new Date().toISOString(),
                    version: 1,
                    url: URL.createObjectURL(file),
                    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                    tags: [],
                };
                addDocument(newDoc);
            });
        }
    };

    const categories = [
        { id: 'all', label: 'All Categories' },
        { id: 'design', label: 'Design' },
        { id: 'legal', label: 'Legal' },
        { id: 'compliance', label: 'Compliance' },
        { id: 'photo', label: 'Photos' },
        { id: 'report', label: 'Reports' },
    ];

    const types = [
        { id: 'all', label: 'All Types' },
        { id: 'autocad', label: 'AutoCAD' },
        { id: 'pdf', label: 'PDF' },
        { id: 'image', label: 'Images' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Document Center</h1>
                    <p className="text-slate-400">Manage project documents and AutoCAD files</p>
                </div>
                <label className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Upload Documents
                    <input
                        type="file"
                        multiple
                        accept=".dwg,.dxf,.pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                </label>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{documents.length}</div>
                            <div className="text-xs text-slate-400">Total Documents</div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                            <FileCode className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">
                                {documents.filter(d => d.type === 'autocad').length}
                            </div>
                            <div className="text-xs text-slate-400">AutoCAD Files</div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-500/10 rounded-lg">
                            <Image className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">
                                {documents.filter(d => d.type === 'image').length}
                            </div>
                            <div className="text-xs text-slate-400">Photos</div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-500/10 rounded-lg">
                            <FileCheck className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">
                                {documents.filter(d => d.category === 'compliance').length}
                            </div>
                            <div className="text-xs text-slate-400">Compliance Docs</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <select
                            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>

                        <select
                            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            {types.map(type => (
                                <option key={type.id} value={type.id}>{type.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Document Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDocuments.map(doc => {
                    const TypeIcon = typeIcons[doc.type] || FileText;
                    const isImage = doc.type === 'image';

                    return (
                        <div
                            key={doc.id}
                            className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500/50 transition-all group"
                        >
                            {/* Preview */}
                            <div className="aspect-video bg-slate-900 flex items-center justify-center relative overflow-hidden">
                                {isImage ? (
                                    <img src={doc.url} alt={doc.name} className="w-full h-full object-cover" />
                                ) : (
                                    <TypeIcon className="w-12 h-12 text-slate-600" />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">
                                        <Eye className="w-4 h-4 text-white" />
                                    </button>
                                    <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                                        <Download className="w-4 h-4 text-white" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('Delete this document?')) {
                                                deleteDocument(doc.id);
                                            }
                                        }}
                                        className="p-2 bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-3">
                                <h4 className="text-sm font-semibold text-white truncate mb-1">{doc.name}</h4>
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <span className="capitalize">{doc.category}</span>
                                    <span>{doc.size}</span>
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                    {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                                </div>
                                {doc.tags && doc.tags.length > 0 && (
                                    <div className="flex gap-1 mt-2 flex-wrap">
                                        {doc.tags.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredDocuments.length === 0 && (
                <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
                    <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">No documents found</p>
                    <p className="text-slate-500 text-xs mt-1">Upload documents to get started</p>
                </div>
            )}
        </div>
    );
};

export default DocumentCenter;
