import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Film,
  Layers,
  HelpCircle
} from 'lucide-react';

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const SUGGESTED_QUERIES = [
  'Trace the adaptation lineage from original novel to live-action BL drama',
  'What are the key differences in KinnPorsche series vs the novel?',
  'Recommend me a heartwarming Japanese BL similar to Cherry Magic',
  'Who played Wei Wuxian and Lan Wangji in The Untamed?',
  'What upcoming BL adaptations are announced for 2026?'
];

export const AiChatModal: React.FC<AiChatModalProps> = ({ isOpen, onClose, initialQuery }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `👋 Hello! I am the **BLVerse Intelligence Concierge**.

I can help you:
- **Trace Adaptations**: Discover how original novels evolved into manhwa, manga, manhua, and live-action series.
- **Actor & Character Insights**: Check actor filmographies, character relationship maps, and casting history.
- **Smart Recommendations**: Find your next favorite BL series or comic by country, trope, or theme.
- **Fact Verification**: Check release dates, official platforms, and production news.

What would you like to explore today?`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      const data = await res.json();
      const replyText = data.reply || data.error || 'No response from assistant.';

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'Sorry, I encountered an error communicating with the server. Please try again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: 'Conversation cleared! What would you like to ask about BL titles, adaptations, or actors?',
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0B0712]/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl h-[85vh] max-h-[750px] bg-[#120A1C] border border-[#241238] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#241238] bg-[#160D20] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#241238] via-[#9F7AEA] to-[#F09BC5] flex items-center justify-center text-[#F8F5FC] shadow-[0_0_15px_rgba(240,155,197,0.35)] border border-[#F09BC5]/30">
              <span className="text-sm">🌙</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#F8F5FC] font-display">
                  BLVerse Concierge
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#241238] text-[#F09BC5] border border-[#F09BC5]/40 shadow-sm flex items-center gap-1">
                  <span>✦</span> Gemini Intelligence
                </span>
              </div>
              <p className="text-xs text-[#B8AFC4]">
                Adaptation mapping, actor trivia, recommendations & romantic lore
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl text-[#B8AFC4] hover:text-white hover:bg-[#241238] transition-colors text-xs flex items-center gap-1"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#B8AFC4] hover:text-white hover:bg-[#241238] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-[#241238] border border-[#9F7AEA]/40 flex items-center justify-center shrink-0 text-[#F09BC5] mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-3xl p-4 text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white rounded-br-none shadow-[0_6px_20px_rgba(240,155,197,0.25)] font-medium'
                    : 'bg-[#180E24] text-[#F8F5FC] border border-[#241238] rounded-bl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {m.text}
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#B8AFC4]">
                  <span>{m.timestamp}</span>
                  {m.sender === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(m.id, m.text)}
                      className="hover:text-white transition-colors flex items-center gap-1 text-[#F09BC5]"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-[#241238] border border-white/10 flex items-center justify-center shrink-0 text-[#F8F5FC] mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-sm text-[#B8AFC4]">
              <div className="w-8 h-8 rounded-xl bg-[#241238] border border-[#9F7AEA]/40 flex items-center justify-center shrink-0 text-[#F09BC5]">
                <Sparkles className="w-4 h-4 animate-spin text-[#F09BC5]" />
              </div>
              <div className="bg-[#180E24] border border-[#241238] rounded-2xl px-4 py-3 rounded-bl-none flex items-center gap-2 shadow-md">
                <span className="inline-block w-2 h-2 rounded-full bg-[#F09BC5] animate-bounce" />
                <span className="inline-block w-2 h-2 rounded-full bg-[#B794F4] animate-bounce [animation-delay:0.2s]" />
                <span className="inline-block w-2 h-2 rounded-full bg-[#9F7AEA] animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-[#B8AFC4] ml-1">Consulting BLVerse archives...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompt Chips */}
        <div className="px-4 py-2.5 border-t border-[#241238] bg-[#160D20] overflow-x-auto flex gap-2 no-scrollbar">
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="text-xs whitespace-nowrap px-3 py-1.5 rounded-xl bg-[#1D112B] hover:bg-[#241238] text-[#B8AFC4] hover:text-[#F09BC5] border border-[#241238] hover:border-[#F09BC5]/40 transition-colors shrink-0 disabled:opacity-50 flex items-center gap-1.5"
            >
              <span className="text-[#F09BC5] text-[10px]">✦</span>
              <span>{q}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#241238] bg-[#120A1C]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about adaptations, novel differences, actors, tropes..."
              disabled={isLoading}
              className="flex-1 bg-[#180E24] text-sm text-[#F8F5FC] placeholder-[#B8AFC4]/60 px-4 py-3 rounded-2xl border border-[#241238] focus:outline-none focus:border-[#F09BC5] focus:ring-1 focus:ring-[#F09BC5] transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] hover:brightness-110 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_18px_rgba(240,155,197,0.3)] shrink-0"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 text-center">
            <span className="text-[11px] text-[#B8AFC4]/60">
              Powered by Google Gemini ✦ Real-time BL adaptation facts & verified sources
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
