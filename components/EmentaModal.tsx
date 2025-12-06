import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';

interface EmentaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const modules = [
  {
    id: 1,
    title: "Módulo 01: O Despertar da Lógica",
    desc: "Fundamentos essenciais. Aprenda a pensar como uma máquina antes de escrever código.",
    topics: ["Configuração do Ambiente (VS Code + Python)", "Algoritmos e Fluxogramas", "Variáveis e Tipos de Dados Primitivos", "Entrada e Saída de Dados"],
    project: "Calculadora de IMC Interativa",
    level: "Iniciante",
    duration: "1 semana"
  },
  {
    id: 2,
    title: "Módulo 02: O Poder da Decisão e Repetição",
    desc: "Controle o fluxo do seu programa. Crie scripts que tomam decisões e automatizam tarefas.",
    topics: ["Estruturas Condicionais (if, elif, else)", "Operadores Lógicos e Relacionais", "Loops (For e Range)", "Loop While e Break/Continue"],
    project: "Jogo de Adivinhação de Números",
    level: "Iniciante",
    duration: "2 semanas"
  },
  {
    id: 3,
    title: "Módulo 03: Estruturas de Dados",
    desc: "Organize grandes volumes de informação de forma eficiente.",
    topics: ["Listas e Métodos Avançados", "Tuplas e Imutabilidade", "Dicionários (Hash Maps)", "Sets e Operações de Conjunto"],
    project: "Sistema de Gerenciamento de Tarefas (To-Do List)",
    level: "Intermediário",
    duration: "2 semanas"
  },
  {
    id: 4,
    title: "Módulo 04: Arquitetura Modular",
    desc: "Escreva código limpo, reutilizável e profissional seguindo o princípio DRY.",
    topics: ["Funções e Escopo", "Parâmetros (*args, **kwargs)", "Módulos e Importações", "Tratamento de Exceções (Try/Except)"],
    project: "Conversor de Moedas com API Real",
    level: "Intermediário",
    duration: "2 semanas"
  },
  {
    id: 5,
    title: "Módulo 05: Programação Orientada a Objetos",
    desc: "O paradigma usado por grandes empresas. Modele o mundo real em código.",
    topics: ["Classes e Objetos", "Atributos e Métodos", "Herança e Polimorfismo", "Encapsulamento"],
    project: "Sistema Bancário Simulado",
    level: "Avançado",
    duration: "3 semanas"
  },
  {
    id: 6,
    title: "Módulo 06: Python no Mundo Real",
    desc: "Aplicações práticas para o mercado de trabalho.",
    topics: ["Automação de Arquivos e Pastas", "Manipulação de CSV e Excel", "Introdução a Análise de Dados (Pandas)", "Web Scraping Básico"],
    project: "Bot de Automação de Relatórios",
    level: "Profissional",
    duration: "3 semanas"
  }
];

// --- MINI GAMES COMPONENTS ---

const GameBMI = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h) return;
    const bmi = w / (h * h);
    let status = '';
    if (bmi < 18.5) status = 'Abaixo do peso';
    else if (bmi < 24.9) status = 'Peso normal';
    else if (bmi < 29.9) status = 'Sobrepeso';
    else status = 'Obesidade';
    setResult(`IMC: ${bmi.toFixed(2)} - ${status}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input type="number" placeholder="Peso (kg)" value={weight} onChange={e => setWeight(e.target.value)} className="bg-white/5 p-3 rounded-lg border border-white/10 w-full" />
        <input type="number" placeholder="Altura (m)" value={height} onChange={e => setHeight(e.target.value)} className="bg-white/5 p-3 rounded-lg border border-white/10 w-full" />
      </div>
      <button onClick={calculate} className="w-full bg-primary text-black font-bold py-2 rounded-lg">Calcular</button>
      {result && <div className="p-4 bg-white/10 rounded-lg text-center font-bold text-lg animate-fadeIn">{result}</div>}
      <div className="text-xs text-muted mt-4 font-mono">Conceitos: input(), float(), operadores matemáticos (/ *)</div>
    </div>
  );
};

const GameGuessing = () => {
  const [target, setTarget] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [msg, setMsg] = useState('Estou pensando em um número entre 1 e 100...');
  const [history, setHistory] = useState<string[]>([]);

  const handleGuess = () => {
    const num = parseInt(guess);
    if (!num) return;
    
    if (num === target) {
      setMsg(`🎉 Parabéns! Era ${target}. Gerando novo número...`);
      setHistory(prev => [`🏆 Acertou (${num})`, ...prev]);
      setTimeout(() => {
        setTarget(Math.floor(Math.random() * 100) + 1);
        setMsg('Novo jogo iniciado! Tente adivinhar.');
        setHistory([]);
      }, 3000);
    } else if (num < target) {
      setMsg(`🔼 O número é MAIOR que ${num}.`);
      setHistory(prev => [`🔼 Maior que ${num}`, ...prev]);
    } else {
      setMsg(`🔽 O número é MENOR que ${num}.`);
      setHistory(prev => [`🔽 Menor que ${num}`, ...prev]);
    }
    setGuess('');
  };

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-primary/10 rounded-xl border border-primary/20 text-primary font-bold">
        {msg}
      </div>
      <div className="flex gap-2">
        <input 
          type="number" 
          value={guess} 
          onChange={e => setGuess(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && handleGuess()}
          placeholder="Seu palpite..." 
          className="flex-1 bg-white/5 p-3 rounded-lg border border-white/10" 
        />
        <button onClick={handleGuess} className="bg-primary text-black font-bold px-6 rounded-lg">Chutar</button>
      </div>
      <div className="h-32 overflow-y-auto bg-black/20 p-2 rounded-lg">
        <div className="text-xs text-muted mb-2">Histórico:</div>
        {history.map((h, i) => (
          <div key={i} className="text-xs text-gray-300 border-b border-white/5 py-1">{h}</div>
        ))}
      </div>
      <div className="text-xs text-muted mt-4 font-mono">Conceitos: random, if/elif/else, loops, comparação</div>
    </div>
  );
};

const GameTodoList = () => {
  const [tasks, setTasks] = useState(['Aprender Python', 'Dominar Lógica']);
  const [input, setInput] = useState('');

  const add = () => {
    if (input.trim()) {
      setTasks([...tasks, input]);
      setInput('');
    }
  };

  const remove = (idx: number) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Nova tarefa..." 
          className="flex-1 bg-white/5 p-3 rounded-lg border border-white/10" 
        />
        <button onClick={add} className="bg-green-600 text-white font-bold px-4 rounded-lg"><i className="fas fa-plus"></i></button>
      </div>
      <ul className="space-y-2">
        {tasks.map((t, i) => (
          <li key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
            <span>{t}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300"><i className="fas fa-trash"></i></button>
          </li>
        ))}
      </ul>
      <div className="text-xs text-muted mt-4 font-mono">Conceitos: listas (append/pop), indexação, manipulação de strings</div>
    </div>
  );
};

const GameConverter = () => {
  const [val, setVal] = useState('');
  const [curr, setCurr] = useState('USD');
  const rates: any = { USD: 5.0, EUR: 5.4, BTC: 350000 };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input type="number" placeholder="Valor em R$" value={val} onChange={e => setVal(e.target.value)} className="bg-white/5 p-3 rounded-lg border border-white/10 w-full" />
        <select value={curr} onChange={e => setCurr(e.target.value)} className="bg-white/5 p-3 rounded-lg border border-white/10 w-full">
          <option value="USD">Dólar (USD)</option>
          <option value="EUR">Euro (EUR)</option>
          <option value="BTC">Bitcoin (BTC)</option>
        </select>
      </div>
      <div className="p-6 bg-green-900/20 border border-green-500/30 rounded-xl text-center">
        <div className="text-sm text-green-300">Convertido:</div>
        <div className="text-3xl font-bold text-white">
          {val ? (parseFloat(val) / rates[curr]).toFixed(4) : '0.00'} {curr}
        </div>
        <div className="text-xs text-muted mt-2">Taxa: 1 {curr} = R$ {rates[curr]}</div>
      </div>
      <div className="text-xs text-muted mt-4 font-mono">Conceitos: Dicionários (chave:valor), funções, retorno de dados</div>
    </div>
  );
};

const GameBank = () => {
  const [balance, setBalance] = useState(1000);
  const [log, setLog] = useState<string[]>(['Conta criada. Saldo inicial: R$ 1000']);

  const action = (type: 'deposit' | 'withdraw') => {
    const amount = Math.floor(Math.random() * 500) + 50;
    if (type === 'withdraw' && amount > balance) {
      setLog(prev => [`❌ Tentativa de saque R$ ${amount} negada (Saldo insuficiente)`, ...prev]);
    } else {
      const newBal = type === 'deposit' ? balance + amount : balance - amount;
      setBalance(newBal);
      setLog(prev => [`${type === 'deposit' ? 'Ct' : 'Dt'} ${type === 'deposit' ? 'Depósito' : 'Saque'} de R$ ${amount} realizado`, ...prev]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl">
        <span className="text-sm">Saldo Disponível</span>
        <span className="text-2xl font-bold text-green-400">R$ {balance.toFixed(2)}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => action('deposit')} className="bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-500/50 py-3 rounded-lg font-bold">Depositar</button>
        <button onClick={() => action('withdraw')} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/50 py-3 rounded-lg font-bold">Sacar</button>
      </div>
      <div className="bg-black/30 p-3 rounded-lg h-32 overflow-y-auto font-mono text-xs">
        {log.map((l, i) => <div key={i} className="mb-1 text-gray-300">{l}</div>)}
      </div>
      <div className="text-xs text-muted mt-4 font-mono">Conceitos: Classes (self.saldo), Métodos (depositar, sacar), Encapsulamento</div>
    </div>
  );
};

const GameBot = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Parado');
  const [logs, setLogs] = useState<string[]>([]);

  const startBot = () => {
    if (progress > 0 && progress < 100) return;
    setStatus('Iniciando automação...');
    setProgress(0);
    setLogs([]);
    
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      
      const fileId = Math.floor(p / 10);
      setLogs(prev => [`Processando planilha_vendas_00${fileId}.xlsx... OK`, ...prev]);

      if (p >= 100) {
        clearInterval(interval);
        setStatus('Automação Finalizada');
        setLogs(prev => [`✅ Relatório consolidado gerado com sucesso!`, ...prev]);
      }
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold uppercase text-muted">Status: <span className="text-primary">{status}</span></span>
        <span className="text-xs">{progress}%</span>
      </div>
      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
        <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>
      <button onClick={startBot} disabled={progress > 0 && progress < 100} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg">
        <i className="fas fa-robot mr-2"></i> Executar Robô
      </button>
      <div className="bg-[#0f1720] p-3 rounded-lg h-32 overflow-y-auto font-mono text-xs border border-white/10">
        {logs.map((l, i) => <div key={i} className="text-green-400 mb-1">{`>`} {l}</div>)}
      </div>
      <div className="text-xs text-muted mt-4 font-mono">Conceitos: Bibliotecas (pandas, os), Time, Loops de processamento</div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const EmentaModal: React.FC<EmentaModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<'syllabus' | 'form' | 'success'>('syllabus');
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    level: 'iniciante'
  });

  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
      setView('syllabus');
      setActiveProject(null);
      setFormData({ name: '', email: '', phone: '', level: 'iniciante' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      setView('success');
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePDF = () => {
    setIsGeneratingPdf(true);
    
    try {
      const doc = new jsPDF();
      let yPos = 20;

      // Header
      doc.setFontSize(24);
      doc.setTextColor(20, 184, 166); // Primary Color (Teal)
      doc.text("Python Mastery", 15, yPos);
      
      yPos += 10;
      doc.setFontSize(14);
      doc.setTextColor(100);
      doc.text("Ementa Completa do Curso - Full Stack Python", 15, yPos);
      
      yPos += 10;
      doc.setDrawColor(200);
      doc.line(15, yPos, 195, yPos);
      yPos += 15;

      // Modules Loop
      modules.forEach((mod) => {
        // Check for page break
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }

        // Module Title
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text(mod.title, 15, yPos);
        yPos += 7;

        // Level & Duration
        doc.setFontSize(10);
        doc.setTextColor(20, 184, 166);
        doc.text(`${mod.level}  |  ${mod.duration}`, 15, yPos);
        yPos += 8;

        // Description
        doc.setFontSize(11);
        doc.setTextColor(80);
        const splitDesc = doc.splitTextToSize(mod.desc, 180);
        doc.text(splitDesc, 15, yPos);
        yPos += (splitDesc.length * 6) + 4;

        // Topics
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text("Tópicos:", 15, yPos);
        yPos += 5;
        
        doc.setFontSize(10);
        doc.setTextColor(60);
        mod.topics.forEach((topic) => {
          doc.text(`• ${topic}`, 20, yPos);
          yPos += 5;
        });
        yPos += 2;

        // Project
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(`Projeto Prático: ${mod.project}`, 15, yPos);
        yPos += 15;
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Página ${i} de ${pageCount} - Gerado por Python Mastery`, 195, 285, { align: 'right' });
      }

      doc.save("Ementa_Python_Mastery.pdf");
    } catch (error) {
      console.error("PDF Generation Error", error);
      alert("Houve um erro ao gerar o PDF. Tente novamente.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const renderProjectGame = () => {
    switch (activeProject) {
      case 1: return <GameBMI />;
      case 2: return <GameGuessing />;
      case 3: return <GameTodoList />;
      case 4: return <GameConverter />;
      case 5: return <GameBank />;
      case 6: return <GameBot />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn p-4">
      <div className="bg-[#0b1220] border border-white/10 rounded-3xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl relative overflow-hidden transition-all duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0f1720]">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {activeProject ? (
                 <><i className="fas fa-gamepad text-secondary"></i> Projeto Prático: Módulo {activeProject}</>
              ) : view === 'syllabus' ? (
                 <><i className="fas fa-book-reader text-primary"></i> Trilha de Formação Python Full Stack</>
              ) : view === 'form' ? (
                 <><i className="fas fa-user-plus text-primary"></i> Inscrição na Turma</>
              ) : (
                 <><i className="fas fa-check-circle text-green-500"></i> Inscrição Confirmada</>
              )}
            </h2>
            <p className="text-muted text-sm mt-1">
              {activeProject ? 'Simulação interativa do projeto final deste módulo.' :
               view === 'syllabus' ? 'Do Zero ao Profissional em 13 semanas' : 
               view === 'form' ? 'Garanta sua vaga para a próxima turma' : 
               'Bem-vindo à comunidade Python Mastery'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 relative">
          
          {/* VIEW: PROJECT PLAYGROUND */}
          {activeProject !== null && (
            <div className="animate-fadeIn max-w-2xl mx-auto">
              <div className="bg-[#131b29] border border-white/5 rounded-2xl p-8 shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                   <h3 className="text-xl font-bold text-white">
                     {modules.find(m => m.id === activeProject)?.project}
                   </h3>
                   <div className="bg-primary/20 text-primary px-3 py-1 rounded text-xs font-bold uppercase">
                     Interativo
                   </div>
                </div>
                
                <div className="bg-black/20 rounded-xl p-6 border border-white/5 mb-6">
                  {renderProjectGame()}
                </div>

                <div className="flex justify-between items-center">
                  <button onClick={() => setActiveProject(null)} className="text-muted hover:text-white text-sm flex items-center gap-2">
                    <i className="fas fa-arrow-left"></i> Voltar para Ementa
                  </button>
                  <button className="text-primary hover:text-teal-300 text-sm font-bold">
                    Ver Código Fonte Completo <i className="fas fa-code ml-1"></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: SYLLABUS */}
          {view === 'syllabus' && activeProject === null && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              {modules.map((mod) => (
                <div key={mod.id} className="group relative bg-[#131b29] border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:bg-[#162030]">
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-[#0b1220] border border-primary/30 rounded-full flex items-center justify-center text-primary font-bold shadow-lg">
                    {mod.id}
                  </div>
                  
                  <div className="ml-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{mod.title}</h3>
                      <span className={`text-[10px] px-2 py-1 rounded border ${
                        mod.level === 'Iniciante' ? 'border-green-500/20 text-green-400' :
                        mod.level === 'Intermediário' ? 'border-yellow-500/20 text-yellow-400' :
                        'border-purple-500/20 text-purple-400'
                      }`}>
                        {mod.level}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                      {mod.desc}
                    </p>

                    <div className="bg-black/20 rounded-xl p-3 mb-4">
                      <h4 className="text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Tópicos:</h4>
                      <ul className="grid grid-cols-1 gap-1">
                        {mod.topics.map((topic, i) => (
                          <li key={i} className="text-xs text-muted flex items-center gap-2">
                            <i className="fas fa-check-circle text-[8px] text-primary/50"></i> {topic}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="text-xs text-muted">
                        <i className="far fa-clock mr-1"></i> {mod.duration}
                      </div>
                      <button 
                        onClick={() => setActiveProject(mod.id)}
                        className="text-xs font-bold text-secondary flex items-center gap-1 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:bg-white/10 group-hover:scale-105"
                      >
                        <i className="fas fa-gamepad"></i> {mod.project}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW: REGISTRATION FORM */}
          {view === 'form' && activeProject === null && (
            <div className="max-w-xl mx-auto animate-fadeIn">
               <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10">
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-bold text-muted uppercase mb-2">Nome Completo</label>
                      <input 
                        required
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ex: João da Silva"
                        className="w-full bg-[#0b1220] border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-bold text-muted uppercase mb-2">E-mail Profissional</label>
                      <input 
                        required
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seu@email.com"
                        className="w-full bg-[#0b1220] border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div className="col-span-1">
                       <label className="block text-xs font-bold text-muted uppercase mb-2">WhatsApp (Opcional)</label>
                       <input 
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(00) 00000-0000"
                        className="w-full bg-[#0b1220] border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div className="col-span-1">
                       <label className="block text-xs font-bold text-muted uppercase mb-2">Nível Atual</label>
                       <select 
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="w-full bg-[#0b1220] border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                       >
                         <option value="iniciante">Iniciante (Nunca programei)</option>
                         <option value="basico">Básico (Sei lógica básica)</option>
                         <option value="intermediario">Intermediário (Já fiz scripts)</option>
                         <option value="avancado">Avançado (Trabalho na área)</option>
                       </select>
                    </div>
                 </div>

                 <div className="pt-4 flex items-center gap-4">
                   <input type="checkbox" required id="terms" className="w-4 h-4 rounded bg-white/10 border-white/20 text-primary focus:ring-0" />
                   <label htmlFor="terms" className="text-sm text-muted">
                     Concordo em receber materiais didáticos e atualizações sobre a turma via e-mail.
                   </label>
                 </div>

                 <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-primary hover:bg-teal-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                 >
                   {loading ? (
                     <><i className="fas fa-circle-notch fa-spin"></i> Processando Inscrição...</>
                   ) : (
                     <><i className="fas fa-paper-plane"></i> Confirmar Inscrição Gratuita</>
                   )}
                 </button>
               </form>

               <div className="text-center mt-6 text-xs text-muted">
                 🔒 Seus dados estão seguros. Não enviamos spam.
               </div>
            </div>
          )}

          {/* VIEW: SUCCESS */}
          {view === 'success' && activeProject === null && (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn p-8">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                <i className="fas fa-check text-4xl text-green-400"></i>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Inscrição Realizada!</h3>
              <p className="text-lg text-muted max-w-md mx-auto mb-8">
                Parabéns, <span className="text-white font-bold">{formData.name}</span>! Você acaba de dar o primeiro passo para dominar Python.
              </p>
              
              <div className="bg-white/5 p-6 rounded-2xl max-w-lg border border-white/10 text-left">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <i className="fas fa-envelope text-primary"></i> Próximos Passos:
                </h4>
                <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
                  <li>Verifique seu e-mail ({formData.email}) nos próximos 5 minutos.</li>
                  <li>Clique no link de confirmação para acessar a Área do Aluno.</li>
                  <li>Entre no nosso grupo exclusivo do Discord.</li>
                </ol>
              </div>

              <div className="mt-8 flex gap-4">
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
                >
                  Fechar
                </button>
                <button className="px-8 py-3 bg-primary hover:bg-teal-400 text-slate-900 rounded-xl font-bold transition-colors shadow-lg shadow-teal-500/20">
                  Acessar Discord Agora
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer (Only visible on Syllabus View) */}
        {view === 'syllabus' && activeProject === null && (
          <div className="p-6 border-t border-white/10 bg-[#0f1720] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="hidden md:block text-xs text-muted">
              * Vagas limitadas para garantir a qualidade da mentoria.
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={generatePDF}
                disabled={isGeneratingPdf}
                className="flex-1 md:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGeneratingPdf ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-file-pdf"></i>} 
                Baixar PDF
              </button>
              <button 
                onClick={() => setView('form')}
                className="flex-1 md:flex-none px-6 py-3 bg-primary hover:bg-teal-400 text-slate-900 rounded-xl font-bold transition-colors shadow-lg shadow-teal-900/20 flex items-center gap-2 justify-center"
              >
                Inscrever-se na Turma <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Footer (Back button for Form View) */}
        {view === 'form' && activeProject === null && (
          <div className="p-4 border-t border-white/10 bg-[#0f1720]">
             <button 
              onClick={() => setView('syllabus')}
              className="text-muted hover:text-white text-sm flex items-center gap-2 transition-colors"
             >
               <i className="fas fa-arrow-left"></i> Voltar para Ementa
             </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default EmentaModal;