import React from 'react';
import { AutoCADFile, AIInsight } from '@/lib/mockData';
import { AlertTriangle, CheckCircle, Info, TrendingUp, DollarSign, Shield, Zap, AlertCircle } from 'lucide-react';

interface AIInsightsPanelProps {
    autocadFile: AutoCADFile;
}

const severityColors = {
    low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    critical: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

const severityIcons = {
    low: Info,
    medium: AlertCircle,
    high: AlertTriangle,
    critical: AlertTriangle,
};

const typeIcons = {
    structural: Shield,
    cost: DollarSign,
    compliance: CheckCircle,
    optimization: TrendingUp,
    risk: AlertTriangle,
};

const typeColors = {
    structural: 'text-purple-500',
    cost: 'text-emerald-500',
    compliance: 'text-blue-500',
    optimization: 'text-cyan-500',
    risk: 'text-rose-500',
};

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ autocadFile }) => {
    const insights = autocadFile.aiInsights || [];

    const insightsByType = insights.reduce((acc, insight) => {
        if (!acc[insight.type]) acc[insight.type] = [];
        acc[insight.type].push(insight);
        return acc;
    }, {} as Record<string, AIInsight[]>);

    const criticalCount = insights.filter(i => i.severity === 'critical').length;
    const highCount = insights.filter(i => i.severity === 'high').length;
    const avgConfidence = insights.length > 0
        ? Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)
        : 0;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-bold text-white">AI Analysis Results</h3>
                    </div>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30">
                        {insights.length} Insights
                    </span>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                        <div className="text-xs text-slate-400 mb-1">Critical/High</div>
                        <div className="text-xl font-bold text-white">{criticalCount + highCount}</div>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                        <div className="text-xs text-slate-400 mb-1">Avg Confidence</div>
                        <div className="text-xl font-bold text-white">{avgConfidence}%</div>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                        <div className="text-xs text-slate-400 mb-1">Categories</div>
                        <div className="text-xl font-bold text-white">{Object.keys(insightsByType).length}</div>
                    </div>
                </div>
            </div>

            {/* Insights List */}
            <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                {insights.length === 0 ? (
                    <div className="text-center py-12">
                        <Zap className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">No AI insights available</p>
                        <p className="text-slate-500 text-xs mt-1">Upload an AutoCAD file to generate insights</p>
                    </div>
                ) : (
                    insights.map((insight) => {
                        const SeverityIcon = severityIcons[insight.severity];
                        const TypeIcon = typeIcons[insight.type];
                        const typeColor = typeColors[insight.type];

                        return (
                            <div
                                key={insight.id}
                                className={`p-4 rounded-lg border ${severityColors[insight.severity]} bg-slate-800/50`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 bg-slate-900 rounded-lg ${typeColor}`}>
                                            <TypeIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-white">{insight.title}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-slate-400 capitalize">{insight.type}</span>
                                                <span className="text-xs text-slate-600">•</span>
                                                <span className={`text-xs capitalize flex items-center gap-1 ${insight.severity === 'critical' ? 'text-rose-400' :
                                                        insight.severity === 'high' ? 'text-orange-400' :
                                                            insight.severity === 'medium' ? 'text-amber-400' :
                                                                'text-blue-400'
                                                    }`}>
                                                    <SeverityIcon className="w-3 h-3" />
                                                    {insight.severity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500">Confidence</div>
                                        <div className="text-sm font-bold text-white">{insight.confidence}%</div>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-300 mb-3">{insight.description}</p>

                                {insight.recommendation && (
                                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                                        <div className="text-xs font-medium text-slate-400 mb-1">💡 Recommendation</div>
                                        <p className="text-sm text-slate-300">{insight.recommendation}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer Actions */}
            {insights.length > 0 && (
                <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        Export Report
                    </button>
                    <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm transition-colors">
                        Share Insights
                    </button>
                </div>
            )}
        </div>
    );
};

export default AIInsightsPanel;
