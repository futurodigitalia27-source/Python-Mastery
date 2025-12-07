import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Fundamentos: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="fundamentos" className="snap-section flex items-center justify-center p-6 bg-gradient-to-b from-[#0f1720] to-[#081018]">
      <div className="glass-panel w-full max-w-6xl p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t.fundamentos.title}</h2>
          <p className="text-muted text-lg max-w-2xl">
            {t.fundamentos.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-card/50 p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 group">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <i className="fas fa-list-ol text-xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.fundamentos.card1_title}</h3>
            <p className="text-muted text-sm mb-4">
              {t.fundamentos.card1_desc}
            </p>
            <div className="bg-black/30 p-3 rounded-lg font-mono text-xs text-green-400">
              <div>1. Acordar</div>
              <div>2. Tomar café</div>
              <div>3. Codar</div>
            </div>
          </div>

          {/* Card 2: Interactive Flowchart Mockup */}
          <div className="bg-card/50 p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 group">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <i className="fas fa-project-diagram text-xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.fundamentos.card2_title}</h3>
            <p className="text-muted text-sm mb-4">
              {t.fundamentos.card2_desc}
            </p>
            {/* Simple SVG Flow */}
            <svg viewBox="0 0 200 100" className="w-full h-24 opacity-70 group-hover:opacity-100 transition-opacity">
              <rect x="70" y="0" width="60" height="20" rx="5" fill="#3b82f6" fillOpacity="0.4" />
              <line x1="100" y1="20" x2="100" y2="40" stroke="#64748b" strokeWidth="2" />
              <polygon points="100,40 130,60 100,80 70,60" fill="#a855f7" fillOpacity="0.4" />
              <line x1="70" y1="60" x2="40" y2="60" stroke="#64748b" strokeWidth="2" />
              <line x1="130" y1="60" x2="160" y2="60" stroke="#64748b" strokeWidth="2" />
              <text x="100" y="14" textAnchor="middle" fontSize="8" fill="white">Início</text>
              <text x="100" y="62" textAnchor="middle" fontSize="6" fill="white">Condição</text>
            </svg>
          </div>

          {/* Card 3 */}
          <div className="bg-card/50 p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 group">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <i className="fas fa-sync-alt text-xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.fundamentos.card3_title}</h3>
            <p className="text-muted text-sm mb-4">
              {t.fundamentos.card3_desc}
            </p>
             <div className="bg-black/30 p-3 rounded-lg font-mono text-xs text-pink-400">
              <div>while not success:</div>
              <div className="pl-4">try_again()</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Fundamentos;
