import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Funcoes: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="funcoes" className="snap-section flex items-center justify-center p-6 bg-[#0f1720]">
      <div className="glass-panel w-full max-w-6xl p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
         <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">{t.funcoes.tag}</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{t.funcoes.title}</h2>
              <p className="text-muted text-lg mb-6 leading-relaxed">
                {t.funcoes.desc}
              </p>
              
              <ul className="space-y-4">
                {t.funcoes.list.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mt-1"><i className="fas fa-check text-xs"></i></div>
                        <span className="text-gray-300">{item}</span>
                    </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 w-full">
              <div className="bg-black/40 p-1 rounded-2xl border border-white/10 relative">
                {/* Visual Metaphor */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
                
                <div className="bg-[#0b1220] rounded-xl p-6 font-mono text-sm shadow-xl">
                  <div className="text-purple-400 mb-2">def <span className="text-yellow-200">processar_dados</span><span className="text-white">(entrada):</span></div>
                  <div className="pl-4 text-gray-400 mb-2"># Corpo da função</div>
                  <div className="pl-4 text-white mb-1">resultado = entrada * <span className="text-orange-400">2</span></div>
                  <div className="pl-4 text-purple-400">return <span className="text-white">resultado</span></div>
                </div>

                {/* Flow Lines */}
                <div className="flex justify-between mt-6 px-4 text-xs font-bold uppercase tracking-widest text-muted">
                  <div className="flex flex-col items-center">
                    <span className="mb-2">Input</span>
                    <i className="fas fa-arrow-down text-primary animate-bounce"></i>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="mb-2">Output</span>
                    <i className="fas fa-arrow-down text-green-400 animate-bounce delay-100"></i>
                  </div>
                </div>
              </div>
            </div>
         </div>
      </div>
    </section>
  );
};

export default Funcoes;
