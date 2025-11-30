import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Palette, Database, Key, Globe } from 'lucide-react';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General', icon: SettingsIcon },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'integrations', label: 'Integrations', icon: Database },
        { id: 'security', label: 'Security', icon: Key },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-600">Manage your application preferences and configuration</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-slate-200 rounded-xl p-2">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-700'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white mb-4">General Settings</h2>

                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:border-blue-500"
                                        defaultValue="TeleFlow Inc."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">
                                        Default Time Zone
                                    </label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:border-blue-500">
                                        <option>UTC-5 (Eastern Time)</option>
                                        <option>UTC-6 (Central Time)</option>
                                        <option>UTC-7 (Mountain Time)</option>
                                        <option>UTC-8 (Pacific Time)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">
                                        Date Format
                                    </label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:border-blue-500">
                                        <option>MM/DD/YYYY</option>
                                        <option>DD/MM/YYYY</option>
                                        <option>YYYY-MM-DD</option>
                                    </select>
                                </div>

                                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white mb-4">Notification Preferences</h2>

                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div>
                                            <div className="font-medium text-slate-900">Email Notifications</div>
                                            <div className="text-sm text-slate-600">Receive email updates for important events</div>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-600 bg-white text-blue-600" />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div>
                                            <div className="font-medium text-slate-900">Task Assignments</div>
                                            <div className="text-sm text-slate-600">Notify when tasks are assigned to you</div>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-600 bg-white text-blue-600" />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div>
                                            <div className="font-medium text-slate-900">Site Alerts</div>
                                            <div className="text-sm text-slate-600">Critical site status changes</div>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-600 bg-white text-blue-600" />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div>
                                            <div className="font-medium text-slate-900">Workflow Updates</div>
                                            <div className="text-sm text-slate-600">Workflow execution status updates</div>
                                        </div>
                                        <input type="checkbox" className="w-5 h-5 rounded border-slate-600 bg-white text-blue-600" />
                                    </label>
                                </div>

                                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors">
                                    Save Preferences
                                </button>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white mb-4">Appearance</h2>

                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">
                                        Theme
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button className="p-4 bg-slate-50 border-2 border-blue-500 rounded-lg">
                                            <div className="w-full h-20 bg-gradient-to-br from-slate-900 to-slate-800 rounded mb-2"></div>
                                            <div className="text-sm text-slate-900">Dark (Active)</div>
                                        </button>
                                        <button className="p-4 bg-slate-50 border-2 border-slate-200 rounded-lg opacity-50">
                                            <div className="w-full h-20 bg-gradient-to-br from-white to-slate-100 rounded mb-2"></div>
                                            <div className="text-sm text-slate-600">Light (Coming Soon)</div>
                                        </button>
                                        <button className="p-4 bg-slate-50 border-2 border-slate-200 rounded-lg opacity-50">
                                            <div className="w-full h-20 bg-gradient-to-br from-slate-800 to-blue-900 rounded mb-2"></div>
                                            <div className="text-sm text-slate-600">Auto (Coming Soon)</div>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">
                                        Accent Color
                                    </label>
                                    <div className="flex gap-3">
                                        {['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'].map(color => (
                                            <button
                                                key={color}
                                                className="w-10 h-10 rounded-lg border-2 border-slate-200"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'integrations' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white mb-4">Integrations</h2>

                                <div className="space-y-3">
                                    <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                                <Database className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">AutoCAD Cloud</div>
                                                <div className="text-sm text-slate-600">Sync AutoCAD files automatically</div>
                                            </div>
                                        </div>
                                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                            Configure
                                        </button>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                                                <Globe className="w-5 h-5 text-emerald-500" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">Webhook API</div>
                                                <div className="text-sm text-slate-600">External system integrations</div>
                                            </div>
                                        </div>
                                        <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                            View Docs
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white mb-4">Security</h2>

                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">
                                        Change Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Current password"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:border-blue-500 mb-3"
                                    />
                                    <input
                                        type="password"
                                        placeholder="New password"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:border-blue-500 mb-3"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <label className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-slate-900">Two-Factor Authentication</div>
                                            <div className="text-sm text-slate-600">Add an extra layer of security</div>
                                        </div>
                                        <input type="checkbox" className="w-5 h-5 rounded border-slate-600 bg-white text-blue-600" />
                                    </label>
                                </div>

                                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors">
                                    Update Security Settings
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
