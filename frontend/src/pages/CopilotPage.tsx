import React, { useState } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Sprout,
  HelpCircle,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

export const CopilotPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your AgriNova AI Farming Copilot. I analyze big data agronomic telemetry, soil chemistry, and ICAR protocols. How can I assist your crop planning or field management today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    'What is the recommended NPK ratio for Wheat?',
    'How do I treat Late Blight on Potato crops?',
    'What are the critical irrigation stages for Rice?',
    'Are wheat Mandi prices expected to rise this month?'
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: q }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.queryCopilot({ question: q });
      setMessages([...newMessages, {
        role: 'assistant',
        content: res.data.response,
        actions: res.data.suggested_actions
      }]);
    } catch (e) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'I encountered an issue connecting to the inference engine. Please ensure the backend is running.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Copilot Header */}
      <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              AgriNova AI Farming Copilot
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Online
              </span>
            </h2>
            <p className="text-xs text-slate-500">Retrieval-Grounded Agronomic Decision Assistant</p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
          ICAR Knowledge Base
        </span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
              m.role === 'user'
                ? 'bg-emerald-600 text-white rounded-tr-none'
                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
            }`}>
              <p className="whitespace-pre-wrap">{m.content}</p>

              {m.actions && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Suggested Field Actions:</p>
                  {m.actions.map((act: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {act}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-tl-none p-3 text-xs italic">
              Consulting agronomic knowledge base...
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-6 py-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto bg-slate-50/50">
        <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="text-[11px] px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 whitespace-nowrap transition"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about fertilizer doses, pest management, soil conditions, or crop choices..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50 shadow-md shadow-emerald-600/30"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
