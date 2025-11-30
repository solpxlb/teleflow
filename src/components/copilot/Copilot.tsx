import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';

const Copilot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
        { role: 'bot', text: 'Hello! I am your TeleFlow assistant. Ask me anything about your sites or tasks.' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { sites } = useStore();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');

        // Simple mock AI logic
        setTimeout(() => {
            let botResponse = "I'm not sure about that. Try asking about 'sites' or 'tasks'.";

            if (userMsg.toLowerCase().includes('site') || userMsg.toLowerCase().includes('map')) {
                const offlineCount = sites.filter(s => s.status === 'offline').length;
                botResponse = `I found ${sites.length} sites in the registry. Currently, ${offlineCount} are offline. I've highlighted them on your map.`;
            } else if (userMsg.toLowerCase().includes('lease') || userMsg.toLowerCase().includes('expire')) {
                botResponse = "I found 3 sites with leases expiring in the next 30 days. Would you like me to draft renewal emails?";
            } else if (userMsg.toLowerCase().includes('task') || userMsg.toLowerCase().includes('work')) {
                botResponse = "You have 5 active tasks assigned to you. The highest priority is '5G Antenna Upgrade' at North Tower Alpha.";
            }

            setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all z-50 ${isOpen ? 'bg-rose-500 rotate-90' : 'bg-blue-600 hover:bg-blue-500'
                    }`}
            >
                {isOpen ? <X className="w-6 h-6 text-slate-900" /> : <Bot className="w-6 h-6 text-slate-900" />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-slate-50 border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-10 fade-in duration-200">
                    {/* Header */}
                    <div className="p-4 bg-white border-b border-slate-200 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">TeleFlow Copilot</h3>
                            <p className="text-xs text-slate-600">AI Assistant • Online</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-slate-200">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask Copilot..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-4 pr-12 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="absolute right-2 top-1.5 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Copilot;
