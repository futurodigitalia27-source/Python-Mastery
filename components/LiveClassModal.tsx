import React from 'react';

interface LiveClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveClassModal: React.FC<LiveClassModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-[#0b1220] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0f1720]">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            🎬 Como você quer assistir?
          </h3>
          <button 
            onClick={onClose}
            className="text-muted hover:text-white transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Main Class Info Card */}
          <div className="bg-gradient-to-r from-teal-900/20 to-teal-800/10 border-l-4 border-primary p-4 rounded-r-xl">
            <h4 className="font-bold text-white mb-1 flex items-center gap-2">
              <i className="fas fa-graduation-cap text-primary"></i> Python Mastery - Aula Principal
            </h4>
            <div className="text-xs text-gray-300 mb-2 flex items-center gap-2">
              <i className="far fa-clock"></i> Segunda a Sexta às 19:00
            </div>
            <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider animate-pulse border border-red-500/20">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Transmissão ao vivo agora
            </div>
          </div>

          {/* Platform Options */}
          <div className="space-y-3">
            <button className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 rounded-xl transition-all group text-left">
              <div className="w-10 h-10 rounded-lg bg-[#282828] flex items-center justify-center text-red-500 text-xl shadow-lg">
                <i className="fab fa-youtube"></i>
              </div>
              <div>
                <div className="font-bold text-white group-hover:text-primary transition-colors">YouTube Live</div>
                <div className="text-xs text-muted">Transmissão pública • Chat ativo</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 rounded-xl transition-all group text-left">
              <div className="w-10 h-10 rounded-lg bg-[#00796b] flex items-center justify-center text-white text-xl shadow-lg">
                <i className="fas fa-video"></i>
              </div>
              <div>
                <div className="font-bold text-white group-hover:text-primary transition-colors">Google Meet</div>
                <div className="text-xs text-muted">Sala interativa • Perguntas ao vivo</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 rounded-xl transition-all group text-left">
              <div className="w-10 h-10 rounded-lg bg-[#2d8cff] flex items-center justify-center text-white text-xl shadow-lg">
                <i className="fas fa-video"></i>
              </div>
              <div>
                <div className="font-bold text-white group-hover:text-primary transition-colors">Zoom</div>
                <div className="text-xs text-muted">Vídeo conferência • Breakout rooms</div>
              </div>
            </button>
          </div>

          {/* Calendar Button */}
          <button 
            className="w-full py-3 border border-white/10 hover:bg-white/5 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
            onClick={() => window.open('https://calendar.google.com', '_blank')}
          >
            <i className="far fa-calendar-alt text-blue-400"></i> Adicionar ao Google Agenda
          </button>

        </div>
      </div>
    </div>
  );
};

export default LiveClassModal;