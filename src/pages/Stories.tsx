import React from 'react';
import { useStore } from '@/lib/store';
import { Plus, Target } from 'lucide-react';

const Stories: React.FC = () => {
    const { stories } = useStore();

    const columns = [
        { id: 'todo', title: 'To Do', color: 'bg-slate-800' },
        { id: 'in_progress', title: 'In Progress', color: 'bg-blue-900/20' },
        { id: 'completed', title: 'Completed', color: 'bg-emerald-900/20' },
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Stories & Epics</h1>
                    <p className="text-slate-400">High-level project roadmaps</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" />
                    New Story
                </button>
            </div>

            <div className="flex gap-6 h-full overflow-x-auto pb-4">
                {columns.map(col => (
                    <div key={col.id} className={`flex-1 min-w-[350px] rounded-xl border border-slate-800 flex flex-col ${col.color}`}>
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-slate-200">{col.title}</h3>
                            <span className="bg-slate-900 text-slate-400 text-xs px-2 py-1 rounded-full">
                                {stories.filter(s => s.status === col.id).length}
                            </span>
                        </div>

                        <div className="p-4 space-y-4 overflow-y-auto flex-1">
                            {stories.filter(s => s.status === col.id).map(story => (
                                <div key={story.id} className="bg-slate-900 p-5 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer group shadow-lg">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-[10px] px-2 py-0.5 rounded border ${story.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                story.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            }`}>
                                            {story.priority.toUpperCase()}
                                        </span>
                                        <Target className="w-4 h-4 text-slate-600 group-hover:text-purple-500 transition-colors" />
                                    </div>

                                    <h4 className="text-lg font-semibold text-white mb-2">{story.title}</h4>
                                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{story.description}</p>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>Progress</span>
                                            <span>{story.milestones.length} Milestones</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500 w-1/3" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Stories;
