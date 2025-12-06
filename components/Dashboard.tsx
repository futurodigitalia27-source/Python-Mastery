import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Seg', xp: 200 },
  { name: 'Ter', xp: 450 },
  { name: 'Qua', xp: 300 },
  { name: 'Qui', xp: 800 },
  { name: 'Sex', xp: 600 },
  { name: 'Sáb', xp: 1000 },
  { name: 'Dom', xp: 950 },
];

const Dashboard: React.FC = () => {
  return (
    <section id="dashboard" className="snap-section flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-white mb-8">Seu Progresso</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="text-muted text-sm mb-1">Nível Atual</div>
            <div className="text-2xl font-bold text-primary">Intermediário</div>
            <div className="w-full bg-white/10 h-1 mt-3 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[65%]"></div>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="text-muted text-sm mb-1">Exercícios</div>
            <div className="text-2xl font-bold text-secondary">12 / 20</div>
            <div className="text-xs text-green-400 mt-1">Completion rate: 60%</div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="text-muted text-sm mb-1">Ofensiva</div>
            <div className="text-2xl font-bold text-orange-400">🔥 5 Dias</div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="text-muted text-sm mb-1">Total XP</div>
            <div className="text-2xl font-bold text-purple-400">4,320</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 h-[300px]">
            <h3 className="text-white font-bold mb-4">Atividade Semanal (XP)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#14b8a6' }}
                />
                <Area type="monotone" dataKey="xp" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 h-[300px] flex flex-col">
             <h3 className="text-white font-bold mb-4">Próximos Passos Recomendados</h3>
             <div className="flex-1 overflow-y-auto space-y-3 pr-2">
               {[
                 { title: "Funções Lambda", time: "15 min", diff: "Médio" },
                 { title: "List Comprehension", time: "20 min", diff: "Fácil" },
                 { title: "Decorators Avançados", time: "30 min", diff: "Difícil" },
                 { title: "Manipulação de Arquivos", time: "25 min", diff: "Médio" },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{item.title}</div>
                        <div className="text-xs text-muted">{item.time}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-md border ${
                      item.diff === 'Fácil' ? 'border-green-500/30 text-green-400' :
                      item.diff === 'Médio' ? 'border-yellow-500/30 text-yellow-400' :
                      'border-red-500/30 text-red-400'
                    }`}>
                      {item.diff}
                    </span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;