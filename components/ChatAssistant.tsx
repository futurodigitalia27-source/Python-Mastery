import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatAssistantProps {
  userName?: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Olá${userName ? ' **' + userName + '**' : ''}! 👋 Sou o Fole, seu assistente inteligente. \n\nEstou pronto para ajudar com Python, revisar código ou responder qualquer dúvida que você tiver sobre o universo! 🌌`,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToGemini(input);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Enhanced content renderer with Markdown-like features
  const renderContent = (content: string) => {
    // Regex matches ```language ... ``` blocks
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        // Extract language (optional) and code
        const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
        const lang = match ? match[1] || 'text' : 'text';
        const code = match ? match[2].trim() : part.replace(/```/g, '').trim();
        
        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden border border-white/10 bg-[#0d1117] shadow-sm">
            <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5">
               <span className="text-[10px] uppercase font-mono text-muted tracking-wider">{lang}</span>
               <button 
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="text-[10px] text-primary hover:text-white transition-colors font-medium flex items-center gap-1"
               >
                 <i className="fas fa-copy"></i> Copiar
               </button>
            </div>
            <pre className="p-3 overflow-x-auto text-xs font-mono text-blue-200 leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
              {code}
            </pre>
          </div>
        );
      }
      
      // Basic bold formatting parser
      return (
        <div key={index} className="whitespace-pre-wrap leading-relaxed mb-1">
            {part.split(/(\*\*.*?\*\*)/g).map((subPart, i) => {
                if (subPart.startsWith('**') && subPart.endsWith('**')) {
                    return <strong key={i} className="text-white font-bold">{subPart.slice(2, -2)}</strong>;
                }
                return subPart;
            })}
        </div>
      );
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all duration-300 hover:scale-110 border border-white/10 ${
          isOpen ? 'bg-red-500/90 rotate-90 hover:bg-red-600' : 'bg-primary hover:bg-teal-400'
        }`}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-robot'} text-white text-xl`}></i>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] glass-panel rounded-2xl shadow-2xl z-40 flex flex-col border border-white/10 transition-all duration-300 origin-bottom-right transform ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-teal-900/40 to-black/40 flex items-center justify-between rounded-t-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-700 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 relative">
              <i className="fas fa-brain text-sm"></i>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#0b1220] rounded-full"></span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm tracking-wide">Fole Assistant</h3>
              <p className="text-[10px] text-muted uppercase tracking-wider font-medium">IA • Python Expert</p>
            </div>
          </div>
          <button 
            onClick={() => setMessages([])} 
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted hover:text-white transition-colors"
            title="Limpar Chat"
          >
            <i className="fas fa-trash-alt text-xs"></i>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3.5 rounded-2xl text-sm shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-slate-900 rounded-tr-sm font-medium'
                      : 'bg-[#1e293b]/80 backdrop-blur-md text-gray-100 rounded-tl-sm border border-white/5'
                  }`}
                >
                  {renderContent(msg.content)}
                </div>
                <div className="text-[10px] mt-1.5 opacity-40 px-1 font-medium">
                  {msg.role === 'model' && <span className="mr-1">Fole •</span>}
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start w-full">
              <div className="bg-[#1e293b]/50 border border-white/5 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <span className="text-xs text-muted font-medium">Pensando</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-black/20 rounded-b-2xl backdrop-blur-md">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua pergunta..."
                rows={1}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 placeholder:text-gray-500 resize-none min-h-[44px] max-h-[120px] scrollbar-hide"
                style={{ height: 'auto', overflow: 'hidden' }}
                onInput={(e) => {
                  e.currentTarget.style.height = 'auto';
                  e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-teal-400 disabled:bg-white/5 disabled:text-gray-500 text-slate-900 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-teal-900/20 transition-all active:scale-95"
            >
              <i className="fas fa-paper-plane text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatAssistant;