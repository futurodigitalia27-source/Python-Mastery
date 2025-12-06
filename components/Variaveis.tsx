import React from 'react';

const Variaveis: React.FC = () => {
  return (
    <section id="variaveis" className="snap-section flex items-center justify-center p-6 bg-[#081018]">
      <div className="glass-panel w-full max-w-6xl p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Sistema de Variáveis</h2>
          <p className="text-muted text-lg max-w-2xl">
            Variáveis são caixas onde guardamos informações. Em Python, elas são dinâmicas e poderosas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {/* Visual Cards for Types */}
           <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-all group">
             <div className="text-xs font-mono text-blue-400 mb-2">int</div>
             <div className="text-3xl font-bold text-white mb-2">42</div>
             <p className="text-sm text-muted">Números inteiros para contagens e matemática discreta.</p>
           </div>
           
           <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-green-500/50 transition-all group">
             <div className="text-xs font-mono text-green-400 mb-2">str</div>
             <div className="text-3xl font-bold text-white mb-2">"Olá"</div>
             <p className="text-sm text-muted">Textos (Strings) para mensagens e processamento de dados.</p>
           </div>

           <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-yellow-500/50 transition-all group">
             <div className="text-xs font-mono text-yellow-400 mb-2">float</div>
             <div className="text-3xl font-bold text-white mb-2">3.14</div>
             <p className="text-sm text-muted">Números decimais para precisão e cálculos científicos.</p>
           </div>

           <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all group">
             <div className="text-xs font-mono text-purple-400 mb-2">bool</div>
             <div className="text-3xl font-bold text-white mb-2">True</div>
             <p className="text-sm text-muted">Lógica booleana para controle de fluxo e decisões.</p>
           </div>
        </div>

        <div className="mt-12 bg-black/30 p-6 rounded-xl border border-white/5">
           <h3 className="text-white font-bold mb-4 flex items-center gap-2">
             <i className="fas fa-code text-primary"></i> Exemplo Prático
           </h3>
           <code className="block font-mono text-sm text-gray-300">
             <span className="text-blue-400">nome</span> = <span className="text-green-400">"Fole"</span> <span className="text-gray-500"># String</span><br/>
             <span className="text-blue-400">idade</span> = <span className="text-orange-400">2</span> <span className="text-gray-500"># Integer</span><br/>
             <span className="text-blue-400">nivel_bateria</span> = <span className="text-yellow-400">98.5</span> <span className="text-gray-500"># Float</span><br/>
             <span className="text-blue-400">ativo</span> = <span className="text-purple-400">True</span> <span className="text-gray-500"># Boolean</span>
           </code>
        </div>
      </div>
    </section>
  );
};

export default Variaveis;