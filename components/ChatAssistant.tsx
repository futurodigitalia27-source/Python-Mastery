
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini, speakText, Attachment } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ChatAssistantProps {
  userName?: string;
}

interface LocalAttachment extends Attachment {
  name: string;
  preview: string;
  isAudio?: boolean;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceOn, setIsVoiceOn] = useState(false);
  const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  
  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  // Camera Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { t, language } = useLanguage();

  // Dynamic Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === 'pt' ? 'Bom dia' : 'Good morning';
    if (hour < 18) return language === 'pt' ? 'Boa tarde' : 'Good afternoon';
    return language === 'pt' ? 'Boa noite' : 'Good evening';
  };

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
        setMessages([
            {
              id: 'welcome',
              role: 'model',
              content: `${getGreeting()}${userName ? ', **' + userName + '**' : ''}! 🚀\n\nSou **Fole**, seu Mentor de Engenharia de Software.\nEstou aqui para elevar seu código ao próximo nível. Em que posso ajudar hoje?`,
              timestamp: new Date()
            }
        ]);
    }
  }, [t, userName, messages.length, language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, attachments, isRecording]);

  // --- CAMERA HANDLING ---
  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Erro ao acessar a câmera. Verifique as permissões do navegador.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64String = dataUrl.split(',')[1];
        
        setAttachments(prev => [...prev, {
          mimeType: 'image/jpeg',
          data: base64String,
          name: `Foto_${new Date().toLocaleTimeString().replace(/:/g, '-')}.jpg`,
          preview: dataUrl,
          isAudio: false
        }]);
        
        stopCamera();
      }
    }
  };

  useEffect(() => {
    if (!isOpen) stopCamera();
    return () => stopCamera();
  }, [isOpen]);

  // --- FILE HANDLING ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      if (file.size > 5 * 1024 * 1024) {
        alert("Arquivo muito grande. Limite de 5MB.");
        return;
      }

      reader.onloadend = () => {
        const result = reader.result as string;
        const base64String = result.split(',')[1];
        
        setAttachments(prev => [...prev, {
          mimeType: file.type,
          data: base64String,
          name: file.name,
          preview: file.type.startsWith('image/') ? result : '',
          isAudio: file.type.startsWith('audio/')
        }]);
      };
      
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // --- AUDIO RECORDING ---
  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
           const blob = new Blob(chunks, { type: 'audio/webm' });
           const reader = new FileReader();
           reader.onloadend = () => {
             const result = reader.result as string;
             const base64String = result.split(',')[1];
             
             setAttachments(prev => [...prev, {
               mimeType: blob.type,
               data: base64String,
               name: "Mensagem de Voz",
               preview: '',
               isAudio: true
             }]);
           };
           reader.readAsDataURL(blob);
           stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Mic Error:", err);
        alert("Erro ao acessar microfone. Verifique as permissões.");
      }
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    }
  };

  // --- SENDING ---
  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const currentVoiceMode = isVoiceOn;
    const currentAttachments = [...attachments];
    const textToSend = input;

    setInput('');
    setAttachments([]);
    setIsLoading(true);

    let displayContent = textToSend;
    if (currentAttachments.length > 0) {
       const labels = currentAttachments.map(a => {
         if (a.isAudio) return '🎤 [Áudio]';
         if (a.mimeType.startsWith('image/')) return `📷 [Imagem: ${a.name}]`;
         return `📎 [Arquivo: ${a.name}]`;
       }).join('\n');
       displayContent = textToSend ? `${textToSend}\n\n${labels}` : labels;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: displayContent,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    const responseText = await sendMessageToGemini(textToSend, language, currentVoiceMode, currentAttachments);

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

  // --- RENDER HELPERS ---
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
        const lang = match ? match[1] || 'text' : 'text';
        const code = match ? match[2].trim() : part.replace(/```/g, '').trim();
        return (
          <div key={index} className="my-2 rounded-lg overflow-hidden border border-white/5 bg-[#0a0d11] shadow-md group">
            <div className="flex items-center justify-between px-3 py-1 bg-white/5 border-b border-white/5">
               <span className="text-[9px] uppercase font-mono text-muted tracking-widest">{lang}</span>
               <button onClick={() => navigator.clipboard.writeText(code)} className="text-[10px] text-primary/70 hover:text-primary transition-colors font-medium flex items-center gap-1 opacity-50 group-hover:opacity-100">
                 <i className="fas fa-copy"></i>
               </button>
            </div>
            <pre className="p-3 overflow-x-auto text-[11px] font-mono text-blue-100/90 leading-relaxed custom-scrollbar">{code}</pre>
          </div>
        );
      }
      return (
        <div key={index} className="whitespace-pre-wrap leading-relaxed text-sm">
            {part.split(/(\*\*.*?\*\*)/g).map((subPart, i) => {
                if (subPart.startsWith('**') && subPart.endsWith('**')) return <strong key={i} className="text-white font-bold">{subPart.slice(2, -2)}</strong>;
                return subPart;
            })}
        </div>
      );
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-all duration-300 border border-white/20 hover:border-primary/50 ${isOpen ? 'opacity-0 scale-0 pointer-events-none rotate-90' : 'bg-[#0f1720] hover:bg-[#16202c] opacity-100 scale-100 rotate-0'}`}
      >
        <div className="absolute inset-0 rounded-full border border-primary/30 animate-pulse"></div>
        <i className="fas fa-robot text-primary text-xl"></i>
      </button>

      <div className={`fixed bottom-6 right-6 w-[90vw] md:w-[380px] h-[650px] max-h-[85vh] bg-[#0f1720]/95 backdrop-blur-xl rounded-2xl shadow-2xl z-50 flex flex-col border border-white/10 transition-all duration-300 origin-bottom-right transform ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`}>
        
        {/* Camera Overlay */}
        {isCameraOpen && (
          <div className="absolute inset-0 z-[60] bg-black flex flex-col rounded-2xl overflow-hidden animate-fadeIn">
             <div className="relative flex-1 bg-black flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1] md:scale-x-100" />
                <canvas ref={canvasRef} className="hidden" />
             </div>
             <div className="p-6 bg-black/80 backdrop-blur-sm flex items-center justify-between absolute bottom-0 w-full border-t border-white/10">
                <button onClick={stopCamera} className="text-white hover:text-red-400 transition-colors w-10 h-10 flex items-center justify-center">
                   <i className="fas fa-times text-xl"></i>
                </button>
                <button onClick={takePhoto} className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-white/20 hover:bg-white/40 transition-colors active:scale-95">
                   <div className="w-12 h-12 bg-white rounded-full"></div>
                </button>
                <div className="w-10"></div>
             </div>
          </div>
        )}

        {/* Header - Sleek & Professional */}
        <div className="p-3 border-b border-white/5 bg-gradient-to-r from-[#0f1720] to-[#141b25] flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 relative">
              <i className="fas fa-brain text-xs"></i>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
            </div>
            <div>
              <h3 className="font-bold text-white text-xs tracking-wide">Fole Assistant</h3>
              <p className="text-[9px] text-muted uppercase tracking-wider font-medium">AI Mentor v2.1</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex bg-black/20 rounded-md p-0.5 border border-white/5 mr-1">
              <button onClick={() => setIsVoiceOn(false)} className={`w-6 h-6 rounded text-[10px] transition-all flex items-center justify-center ${!isVoiceOn ? 'bg-white/10 text-white shadow-sm' : 'text-muted hover:text-white'}`}>
                <i className="fas fa-comment-alt"></i>
              </button>
              <button onClick={() => setIsVoiceOn(true)} className={`w-6 h-6 rounded text-[10px] transition-all flex items-center justify-center ${isVoiceOn ? 'bg-primary/20 text-primary shadow-sm' : 'text-muted hover:text-white'}`}>
                <i className="fas fa-volume-up"></i>
              </button>
            </div>
            <button onClick={() => { setMessages([]); setAttachments([]); }} className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-muted hover:text-white transition-colors">
              <i className="fas fa-eraser text-[10px]"></i>
            </button>
            <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-md hover:bg-red-500/10 flex items-center justify-center text-muted hover:text-red-400 transition-colors">
              <i className="fas fa-times text-[10px]"></i>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex w-full animate-fadeIn ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-2xl text-sm shadow-sm relative group backdrop-blur-sm border ${
                    msg.role === 'user' 
                    ? 'bg-primary/10 border-primary/20 text-white rounded-tr-sm' 
                    : 'bg-[#151b23]/90 border-white/5 text-gray-200 rounded-tl-sm'
                }`}>
                  {renderContent(msg.content)}
                  <button onClick={(e) => { e.stopPropagation(); speakText(msg.content); }} className={`absolute -bottom-2 ${msg.role === 'user' ? '-left-2' : '-right-2'} w-5 h-5 rounded-full bg-[#0b1220] border border-white/10 text-muted hover:text-primary flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
                     <i className="fas fa-play text-[7px]"></i>
                  </button>
                </div>
                <div className="text-[9px] mt-1 opacity-40 px-1 font-medium tracking-tight">
                  {msg.role === 'model' && <span className="mr-1">Fole AI</span>}
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start w-full animate-fadeIn">
              <div className="bg-[#151b23]/80 border border-white/5 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <i className="fas fa-circle-notch fa-spin text-primary text-xs"></i>
                <span className="text-xs text-muted font-medium tracking-wide">Gerando resposta...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Cleaner */}
        <div className="p-3 border-t border-white/5 bg-[#0a0d11]/80 backdrop-blur-md flex flex-col gap-2 rounded-b-2xl">
          
          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {attachments.map((att, i) => (
                <div key={i} className="relative flex-shrink-0 w-12 h-12 bg-white/5 border border-white/10 rounded-lg overflow-hidden flex items-center justify-center group">
                  {att.preview ? (
                    <img src={att.preview} alt="Preview" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <i className={`fas ${att.isAudio ? 'fa-microphone-lines' : 'fa-file'} text-white/50 text-xs`}></i>
                  )}
                  <button onClick={() => removeAttachment(i)} className="absolute top-0 right-0 w-4 h-4 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-[8px]">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 items-end">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileSelect}
              accept="image/*,audio/*,.pdf,.txt,.py"
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-muted hover:text-white transition-colors border border-white/5"
            >
              <i className="fas fa-plus text-xs"></i>
            </button>

            <button 
              onClick={startCamera}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-muted hover:text-white transition-colors border border-white/5"
            >
              <i className="fas fa-camera text-xs"></i>
            </button>

            <div className="flex-1 relative bg-white/5 rounded-xl border border-white/5 focus-within:border-primary/30 transition-colors">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isRecording ? "Ouvindo..." : (isVoiceOn ? "Modo Voz..." : "Mensagem...")}
                rows={1}
                disabled={isRecording}
                className={`w-full bg-transparent px-3 py-2.5 text-sm text-white focus:outline-none placeholder:text-gray-600 resize-none min-h-[40px] max-h-[100px] scrollbar-hide ${isRecording ? 'text-red-400 placeholder:text-red-500/50' : ''}`}
                style={{ height: 'auto', overflow: 'hidden' }}
                onInput={(e) => {
                  e.currentTarget.style.height = 'auto';
                  e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                }}
              />
            </div>
            
            {(!input.trim() && attachments.length === 0 && !isRecording) ? (
              <button
                onClick={toggleRecording}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-muted hover:text-red-400 transition-colors border border-white/5"
              >
                <i className="fas fa-microphone text-xs"></i>
              </button>
            ) : isRecording ? (
              <button
                onClick={toggleRecording}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse"
              >
                <i className="fas fa-stop text-xs"></i>
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-primary hover:bg-teal-400 text-slate-900 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-teal-900/20 transition-all active:scale-95"
              >
                <i className="fas fa-arrow-up text-xs"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatAssistant;
