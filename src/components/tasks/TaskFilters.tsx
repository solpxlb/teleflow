import React, { useState } from 'react';

import { useStore } from '@/lib/store';
import { X, Save, User, Calendar, Tag, MapPin, BookOpen } from 'lucide-react';

interface TaskFiltersProps {
    onFilterChange: (filters: TaskFilterState) => void;
    onSavePreset?: (name: string, filters: TaskFilterState) => void;
}

export interface TaskFilterState {
    assignees: string[];
    priorities: string[];
    statuses: string[];
    sites: string[];
    stories: string[];
    tags: string[];
    dateRange: { start?: string; end?: string };
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ onFilterChange, onSavePreset }) => {
    const { tasks, sites, stories } = useStore();
    const [filters, setFilters] = useState<TaskFilterState>({
        assignees: [],
        priorities: [],
        statuses: [],
        sites: [],
        stories: [],
        tags: [],
        dateRange: {},
    });
    const [presetName, setPresetName] = useState('');
    const [showSavePreset, setShowSavePreset] = useState(false);

    // Extract unique values
    const uniqueAssignees = Array.from(new Set(tasks.map(t => t.assigneeId)));
    const uniquePriorities = ['low', 'medium', 'high', 'urgent'];
    const uniqueStatuses = ['todo', 'in_progress', 'review', 'completed', 'blocked', 'planning', 'permitting', 'construction', 'integration', 'live'];
    const uniqueTags = Array.from(new Set(tasks.flatMap(t => t.tags)));

    const handleFilterChange = (key: keyof TaskFilterState, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const toggleArrayFilter = (key: keyof TaskFilterState, value: string) => {
        const currentArray = filters[key] as string[];
        const newArray = currentArray.includes(value)
            ? currentArray.filter(v => v !== value)
            : [...currentArray, value];
        handleFilterChange(key, newArray);
    };

    const clearFilters = () => {
        const emptyFilters: TaskFilterState = {
            assignees: [],
            priorities: [],
            statuses: [],
            sites: [],
            stories: [],
            tags: [],
            dateRange: {},
        };
        setFilters(emptyFilters);
        onFilterChange(emptyFilters);
    };

    const hasActiveFilters = Object.values(filters).some(v =>
        Array.isArray(v) ? v.length > 0 : Object.keys(v).length > 0
    );

    const handleSavePreset = () => {
        if (presetName.trim() && onSavePreset) {
            onSavePreset(presetName, filters);
            setPresetName('');
            setShowSavePreset(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Filters</h3>
                <div className="flex gap-2">
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                        >
                            <X className="w-3 h-3" />
                            Clear All
                        </button>
                    )}
                    <button
                        onClick={() => setShowSavePreset(!showSavePreset)}
                        className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition-colors flex items-center gap-1"
                    >
                        <Save className="w-3 h-3" />
                        Save Preset
                    </button>
                </div>
            </div>

            {showSavePreset && (
                <div className="mb-4 p-3 bg-slate-800 rounded-lg">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Preset name..."
                            className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                            value={presetName}
                            onChange={(e) => setPresetName(e.target.value)}
                        />
                        <button
                            onClick={handleSavePreset}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {/* Assignees */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                        <User className="w-4 h-4" />
                        Assignees
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {uniqueAssignees.map(assigneeId => (
                            <button
                                key={assigneeId}
                                onClick={() => toggleArrayFilter('assignees', assigneeId)}
                                className={`text-xs px-3 py-1 rounded-full border transition-colors ${filters.assignees.includes(assigneeId)
                                    ? 'bg-blue-600 border-blue-500 text-white'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                User {assigneeId}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Priorities */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                        <Tag className="w-4 h-4" />
                        Priority
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {uniquePriorities.map(priority => (
                            <button
                                key={priority}
                                onClick={() => toggleArrayFilter('priorities', priority)}
                                className={`text-xs px-3 py-1 rounded-full border capitalize transition-colors ${filters.priorities.includes(priority)
                                    ? priority === 'urgent' ? 'bg-rose-600 border-rose-500 text-white' :
                                        priority === 'high' ? 'bg-orange-600 border-orange-500 text-white' :
                                            priority === 'medium' ? 'bg-amber-600 border-amber-500 text-white' :
                                                'bg-blue-600 border-blue-500 text-white'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                {priority}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Statuses */}
                <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Status</label>
                    <div className="flex flex-wrap gap-2">
                        {uniqueStatuses.map(status => (
                            <button
                                key={status}
                                onClick={() => toggleArrayFilter('statuses', status)}
                                className={`text-xs px-3 py-1 rounded-full border capitalize transition-colors ${filters.statuses.includes(status)
                                    ? 'bg-blue-600 border-blue-500 text-white'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                {status.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sites */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                        <MapPin className="w-4 h-4" />
                        Sites
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {sites.map(site => (
                            <button
                                key={site.id}
                                onClick={() => toggleArrayFilter('sites', site.id)}
                                className={`text-xs px-3 py-1 rounded-full border transition-colors ${filters.sites.includes(site.id)
                                    ? 'bg-blue-600 border-blue-500 text-white'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                {site.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stories */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                        <BookOpen className="w-4 h-4" />
                        Stories
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {stories.map(story => (
                            <button
                                key={story.id}
                                onClick={() => toggleArrayFilter('stories', story.id)}
                                className={`text-xs px-3 py-1 rounded-full border transition-colors ${filters.stories.includes(story.id)
                                    ? 'bg-blue-600 border-blue-500 text-white'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                {story.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                {uniqueTags.length > 0 && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                            <Tag className="w-4 h-4" />
                            Tags
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {uniqueTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleArrayFilter('tags', tag)}
                                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${filters.tags.includes(tag)
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Date Range */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                        <Calendar className="w-4 h-4" />
                        Due Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="date"
                            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                            value={filters.dateRange.start || ''}
                            onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                            placeholder="Start date"
                        />
                        <input
                            type="date"
                            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                            value={filters.dateRange.end || ''}
                            onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                            placeholder="End date"
                        />
                    </div>
                </div>
            </div>

            {/* Active Filters Count */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                    <div className="text-xs text-slate-400">
                        {Object.entries(filters).reduce((count, [key, value]) => {
                            if (Array.isArray(value)) return count + value.length;
                            if (key === 'dateRange' && (value.start || value.end)) return count + 1;
                            return count;
                        }, 0)} active filters
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskFilters;
