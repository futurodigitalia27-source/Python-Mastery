
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// --- MINI GAMES FOR VARIABLES ---

const IntGame: React.FC = () => {
  const [count, setCount] = useState(0);
  const target = 10;
  
  const add = (n: number) => setCount(c => c + n);
  const reset = () => setCount(0);

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
      <h4 className="text-blue-300 font-bold"><i className="fas fa-calculator"></i> Desafio Inteiro</h4>
      <p className="text-sm text-gray-300 text-center">Chegue exatamente em <span className="font-bold text-white">{target}</span> somando inteiros. Cuidado para não passar!</p>
      
      <div className="text-4xl font-mono font-bold text-white my-2">{count}</div>
      
      <div className="flex gap-2">
        <button onClick={() => add(1)} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 text-white font-bold">+1</button>
        <button onClick={() => add(3)} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 text-white font-bold">+3</button>
        <button onClick={() => add(5)} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 text-white font-bold">+5</button>
      </div>

      {count === target && <div className="text-green-400 font-bold animate-bounce mt-2">Sucesso! Inteiro exato.</div>}
      {count > target && (
        <div className="text-red-400 font-bold animate-shake mt-2 flex flex-col items-center">
          <span>Passou! (Overflow)</span>
          <button onClick={reset} className="text-xs underline mt-1">Reiniciar</button>
        </div>
      )}
    </div>
  );
};

const FloatGame: React.FC = () => {
  const [level, setLevel] = useState(0.0);
  const target = 7.5;

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-green-900/20 rounded-xl border border-green-500/30">
      <h4 className="text-green-300 font-bold"><i className="fas fa-percent"></i> Precisão Decimal</h4>
      <p className="text-sm text-gray-300 text-center">Encha o tanque até <span className="font-bold text-white">{target}L</span>. Use os decimais.</p>
      
      <div className="w-full bg-black/50 h-8 rounded-full overflow-hidden relative border border-white/10">
        <div 
          className={`h-full transition-all duration-300 ${level > target ? 'bg-red-500' : 'bg-green-500'}`}
          style={{ width: `${(level / 10) * 100}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-white shadow-sm">
          {level.toFixed(1)} L
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setLevel(l => Math.min(10, parseFloat((l + 0.1).toFixed(1))))} className="px-3 py-2 bg-green-600 rounded hover:bg-green-500 text-white font-bold text-xs">+0.1</button>
        <button onClick={() => setLevel(l => Math.min(10, parseFloat((l + 0.5).toFixed(1))))} className="px-3 py-2 bg-green-600 rounded hover:bg-green-500 text-white font-bold text-xs">+0.5</button>
        <button onClick={() => setLevel(l => Math.min(10, parseFloat((l + 2.0).toFixed(1))))} className="px-3 py-2 bg-green-600 rounded hover:bg-green-500 text-white font-bold text-xs">+2.0</button>
        <button onClick={() => setLevel(0)} className="px-3 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded font-bold text-xs border border-red-500/30">Reset</button>
      </div>

      {level === target ? (
        <div className="text-green-400 font-bold animate-bounce">Perfeito!</div>
      ) : level > target ? (
        <div className="text-red-400 font-bold">Transbordou!</div>
      ) : <div className="h-6"></div>}
    </div>
  );
};

const StringGame: React.FC = () => {
  const [parts, setParts] = useState<string[]>([]);
  const target = "Olá Mundo";

  const add = (s: string) => setParts(p => [...p, s]);
  const clear = () => setParts([]);
  const current = parts.join(" ");

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-purple-900/20 rounded-xl border border-purple-500/30">
      <h4 className="text-purple-300 font-bold"><i className="fas fa-font"></i> Concatenação</h4>
      <p className="text-sm text-gray-300 text-center">Monte a frase: <span className="font-mono bg-black/30 px-1 rounded text-purple-200">"{target}"</span></p>
      
      <div className="w-full p-3 bg-black/40 rounded border border-white/10 min-h-[40px] font-mono text-center text-purple-200">
        "{current}"
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {["Olá", "Mundo", "Python", "Dev"].map((word) => (
          <button key={word} onClick={() => add(word)} className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500 text-purple-200 hover:text-white border border-purple-500/50 rounded transition-colors text-sm">
            "{word}"
          </button>
        ))}
        <button onClick={clear} className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-sm hover:bg-red-500/40"><i className="fas fa-trash"></i></button>
      </div>

      {current === target ? (
        <div className="text-green-400 font-bold animate-bounce">Frase correta!</div>
      ) : (
        <div className="text-xs text-muted">Dica: Cuidado com espaços automáticos.</div>
      )}
    </div>
  );
};

const BoolGame: React.FC = () => {
  const [switches, setSwitches] = useState([false, false]);
  const isOn = switches[0] && switches[1]; // AND Logic

  const toggle = (idx: number) => {
    const newSwitches = [...switches];
    newSwitches[idx] = !newSwitches[idx];
    setSwitches(newSwitches);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-orange-900/20 rounded-xl border border-orange-500/30">
      <h4 className="text-orange-300 font-bold"><i className="fas fa-toggle-on"></i> Porta Lógica AND</h4>
      <p className="text-sm text-gray-300 text-center">A luz só acende se <span className="font-bold text-white">A</span> E <span className="font-bold text-white">B</span> forem <span className="font-mono text-orange-400">True</span>.</p>
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={() => toggle(0)}
            className={`w-12 h-6 rounded-full transition-colors relative ${switches[0] ? 'bg-orange-500' : 'bg-gray-700'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${switches[0] ? 'left-7' : 'left-1'}`}></div>
          </button>
          <span className="text-xs font-mono">{switches[0] ? 'True' : 'False'}</span>
        </div>

        <span className="font-bold text-xl text-muted">+</span>

        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={() => toggle(1)}
            className={`w-12 h-6 rounded-full transition-colors relative ${switches[1] ? 'bg-orange-500' : 'bg-gray-700'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${switches[1] ? 'left-7' : 'left-1'}`}></div>
          </button>
          <span className="text-xs font-mono">{switches[1] ? 'True' : 'False'}</span>
        </div>
      </div>

      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${isOn ? 'bg-yellow-400 border-yellow-200 shadow-[0_0_30px_rgba(250,204,21,0.6)]' : 'bg-black/50 border-gray-700'}`}>
        <i className={`fas fa-lightbulb text-3xl ${isOn ? 'text-white' : 'text-gray-600'}`}></i>
      </div>
    </div>
  );
};

// --- DATA STRUCTURE ---

type VariableType = 'int' | 'float' | 'str' | 'bool';

const Variaveis: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeVar, setActiveVar] = useState<VariableType | null>(null);
  const [activeTab, setActiveTab] = useState<'theory' | 'practice' | 'game' | 'quiz'>('theory');

  // Specific Quiz State
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  // Content Data
  const content = {
    int: {
      color: 'blue',
      icon: 'fa-calculator',
      title: 'Inteiros (int)',
      theory: language === 'pt' ? (
        <div className="space-y-4">
          <p>O tipo <code className="text-blue-300">int</code> (integer) representa números inteiros, ou seja, números sem casas decimais. Eles podem ser positivos, negativos ou zero.</p>
          <div className="bg-black/30 p-3 rounded border border-white/5 font-mono text-sm">
            <div>idade = 25</div>
            <div>temperatura = -5</div>
            <div>estrelas = 0</div>
          </div>
          <p><strong>Uso Principal:</strong> Contagens, índices de listas, matemática discreta e loops.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p>The <code className="text-blue-300">int</code> type represents whole numbers, meaning numbers without decimal places. They can be positive, negative, or zero.</p>
          <p><strong>Main Usage:</strong> Counting, list indices, discrete math, and loops.</p>
        </div>
      ),
      practice: {
        task: language === 'pt' ? "Crie uma variável chamada 'ano' com o valor 2024." : "Create a variable named 'year' with value 2024.",
        code: "ano = 2024\nprint(ano)"
      },
      game: <IntGame />,
      quiz: {
        q: language === 'pt' ? "Qual destes é um Inteiro válido?" : "Which of these is a valid Integer?",
        options: ["'10'", "10.5", "10", "True"],
        correct: 2,
        explanation: language === 'pt' ? "10 é um número inteiro. '10' é string, 10.5 é float, True é bool." : "10 is a whole number."
      }
    },
    float: {
      color: 'green',
      icon: 'fa-percent',
      title: 'Ponto Flutuante (float)',
      theory: language === 'pt' ? (
        <div className="space-y-4">
          <p>O tipo <code className="text-green-300">float</code> é usado para números reais, aqueles que possuem partes fracionárias (casas decimais). O separador é o <strong>ponto</strong> (.), não a vírgula.</p>
          <div className="bg-black/30 p-3 rounded border border-white/5 font-mono text-sm">
            <div>preco = 19.99</div>
            <div>pi = 3.14159</div>
            <div>altura = 1.75</div>
          </div>
          <p><strong>Atenção:</strong> Computadores podem ter pequenos erros de precisão com floats muito longos.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p>The <code className="text-green-300">float</code> type is used for real numbers with fractional parts. The separator is the <strong>dot</strong> (.), not the comma.</p>
        </div>
      ),
      practice: {
        task: language === 'pt' ? "Defina a altura como 1.80" : "Set height to 1.80",
        code: "altura = 1.80\nprint(altura)"
      },
      game: <FloatGame />,
      quiz: {
        q: language === 'pt' ? "Como se escreve 2 e meio em Python?" : "How do you write 2 and a half in Python?",
        options: ["2,5", "2.5", "2:5", "2/5"],
        correct: 1,
        explanation: language === 'pt' ? "Em Python (e programação em geral), usamos o ponto para decimais." : "In Python, we use the dot for decimals."
      }
    },
    str: {
      color: 'purple',
      icon: 'fa-font',
      title: 'Strings (str)',
      theory: language === 'pt' ? (
        <div className="space-y-4">
          <p>Uma <code className="text-purple-300">str</code> é uma sequência de caracteres. É usada para representar texto. Deve estar sempre entre aspas (simples ' ou duplas ").</p>
          <div className="bg-black/30 p-3 rounded border border-white/5 font-mono text-sm">
            <div>nome = "Fole"</div>
            <div>msg = 'Python é legal'</div>
            <div>vazio = ""</div>
          </div>
          <p><strong>Concatenação:</strong> Você pode somar strings: <code>"A" + "B" = "AB"</code>.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p>A <code className="text-purple-300">str</code> is a sequence of characters used to represent text. It must always be enclosed in quotes (single ' or double ").</p>
        </div>
      ),
      practice: {
        task: language === 'pt' ? "Crie uma saudação." : "Create a greeting.",
        code: "print('Olá ' + 'Mundo')"
      },
      game: <StringGame />,
      quiz: {
        q: language === 'pt' ? "Qual a forma correta de criar uma string?" : "Correct way to create a string?",
        options: ["nome = Andre", "nome = 'Andre'", "nome = [Andre]", "nome = (Andre)"],
        correct: 1,
        explanation: language === 'pt' ? "Strings precisam de aspas. Sem aspas, o Python acha que é uma variável." : "Strings need quotes."
      }
    },
    bool: {
      color: 'orange',
      icon: 'fa-toggle-on',
      title: 'Booleanos (bool)',
      theory: language === 'pt' ? (
        <div className="space-y-4">
          <p>O tipo <code className="text-orange-300">bool</code> é o mais simples: só tem dois valores possíveis, <strong>True</strong> (Verdadeiro) ou <strong>False</strong> (Falso).</p>
          <div className="bg-black/30 p-3 rounded border border-white/5 font-mono text-sm">
            <div>esta_chovendo = False</div>
            <div>tem_bateria = True</div>
            <div>passou_de_nivel = 5 &gt; 3  # Resultado: True</div>
          </div>
          <p><strong>Uso:</strong> Essencial para tomadas de decisão (If/Else) e loops (While).</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p>The <code className="text-orange-300">bool</code> type is the simplest: it only has two possible values, <strong>True</strong> or <strong>False</strong>.</p>
        </div>
      ),
      practice: {
        task: language === 'pt' ? "Verifique se 10 é maior que 5." : "Check if 10 is greater than 5.",
        code: "resultado = 10 > 5\nprint(resultado)"
      },
      game: <BoolGame />,
      quiz: {
        q: language === 'pt' ? "Qual o resultado de: not True?" : "Result of: not True?",
        options: ["True", "False", "Error", "None"],
        correct: 1,
        explanation: language === 'pt' ? "O operador 'not' inverte o valor booleano." : "'not' inverts the boolean value."
      }
    }
  };

  const handleCardClick = (type: VariableType) => {
    setActiveVar(type);
    setActiveTab('theory');
    setQuizAnswer(null);
    setQuizFinished(false);
  };

  const closeModals = () => {
    setActiveVar(null);
  };

  const renderActiveContent = () => {
    if (!activeVar) return null;
    const data = content[activeVar];
    
    // Determine color classes dynamically
    const colors = {
      blue: 'from-blue-600 to-blue-900 border-blue-500 text-blue-400',
      green: 'from-green-600 to-green-900 border-green-500 text-green-400',
      purple: 'from-purple-600 to-purple-900 border-purple-500 text-purple-400',
      orange: 'from-orange-600 to-orange-900 border-orange-500 text-orange-400'
    };
    const theme = colors[data.color as keyof typeof colors];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn p-4">
        <div className="bg-[#0b1220] border border-white/10 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl relative overflow-hidden">
          
          {/* Header */}
          <div className={`p-6 border-b border-white/10 bg-gradient-to-r ${theme.split(' ')[0]} bg-opacity-20 flex justify-between items-center relative`}>
             <div className="absolute inset-0 bg-black/40"></div>
             <div className="relative flex items-center gap-4 z-10">
                <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl text-white border border-white/20 shadow-lg`}>
                  <i className={`fas ${data.icon}`}></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{data.title}</h2>
                  <p className="text-xs text-white/70 uppercase tracking-widest">{language === 'pt' ? 'Módulo de Variáveis' : 'Variables Module'}</p>
                </div>
             </div>
             <button onClick={closeModals} className="relative z-10 w-8 h-8 rounded-full bg-black/20 hover:bg-white/10 flex items-center justify-center text-white transition-colors">
               <i className="fas fa-times"></i>
             </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 bg-[#0f1720]">
             {['theory', 'practice', 'game', 'quiz'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
                   activeTab === tab ? 'text-white bg-white/5' : 'text-muted hover:text-white hover:bg-white/5'
                 }`}
               >
                 {tab === 'theory' && <i className="fas fa-book mr-2"></i>}
                 {tab === 'practice' && <i className="fas fa-code mr-2"></i>}
                 {tab === 'game' && <i className="fas fa-gamepad mr-2"></i>}
                 {tab === 'quiz' && <i className="fas fa-clipboard-question mr-2"></i>}
                 <span className="hidden md:inline">
                    {tab === 'theory' ? (language === 'pt' ? 'Teoria' : 'Theory') : 
                     tab === 'practice' ? (language === 'pt' ? 'Prática' : 'Practice') : 
                     tab === 'game' ? (language === 'pt' ? 'Mini-Game' : 'Game') : 
                     'Quiz'}
                 </span>
                 {activeTab === tab && <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-current ${theme.split(' ').pop()}`}></div>}
               </button>
             ))}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#0f1720]">
             <div className="max-w-3xl mx-auto animate-fadeIn">
               
               {/* THEORY TAB */}
               {activeTab === 'theory' && (
                 <div className="space-y-6">
                   <h3 className="text-xl font-bold text-white mb-4 border-l-4 pl-4 border-current" style={{ borderColor: 'var(--tw-text-opacity)' }}>{language === 'pt' ? 'Conceito Fundamental' : 'Core Concept'}</h3>
                   <div className="text-gray-300 text-lg leading-relaxed">
                     {data.theory}
                   </div>
                 </div>
               )}

               {/* PRACTICE TAB */}
               {activeTab === 'practice' && (
                 <div className="space-y-6">
                   <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <h4 className="text-sm font-bold text-muted uppercase mb-2">{language === 'pt' ? 'Tarefa' : 'Task'}</h4>
                      <p className="text-white text-lg">{data.practice.task}</p>
                   </div>
                   <div className="bg-black rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                      <div className="bg-[#1e1e1e] px-4 py-2 flex gap-2 border-b border-white/5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <pre className="p-6 font-mono text-sm text-blue-300 overflow-x-auto">
                        <code>{data.practice.code}</code>
                      </pre>
                   </div>
                 </div>
               )}

               {/* GAME TAB */}
               {activeTab === 'game' && (
                 <div className="flex flex-col items-center justify-center min-h-[300px]">
                   {data.game}
                 </div>
               )}

               {/* QUIZ TAB */}
               {activeTab === 'quiz' && (
                 <div className="max-w-xl mx-auto">
                   <div className="bg-[#0b1220] border border-white/10 rounded-2xl p-8 shadow-xl">
                      <h3 className="text-xl font-bold text-white mb-6 text-center">{data.quiz.q}</h3>
                      <div className="grid gap-3">
                        {data.quiz.options.map((opt, idx) => {
                          let btnClass = "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300";
                          if (quizAnswer !== null) {
                            if (idx === data.quiz.correct) btnClass = "bg-green-500/20 border-green-500 text-green-400";
                            else if (idx === quizAnswer) btnClass = "bg-red-500/20 border-red-500 text-red-400 opacity-50";
                            else btnClass = "opacity-30 border-transparent";
                          }
                          
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                setQuizAnswer(idx);
                                setQuizFinished(true);
                              }}
                              disabled={quizAnswer !== null}
                              className={`p-4 rounded-xl border font-medium text-left transition-all ${btnClass}`}
                            >
                              {opt}
                              {quizAnswer !== null && idx === data.quiz.correct && <i className="fas fa-check float-right"></i>}
                            </button>
                          );
                        })}
                      </div>
                      
                      {quizFinished && (
                        <div className={`mt-6 p-4 rounded-xl text-sm animate-fadeIn border ${quizAnswer === data.quiz.correct ? 'bg-green-900/20 border-green-500/30 text-green-300' : 'bg-red-900/20 border-red-500/30 text-red-300'}`}>
                          <strong>{quizAnswer === data.quiz.correct ? (language === 'pt' ? 'Correto!' : 'Correct!') : (language === 'pt' ? 'Incorreto.' : 'Incorrect.')}</strong> {data.quiz.explanation}
                        </div>
                      )}
                   </div>
                 </div>
               )}

             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="variaveis" className="snap-section flex flex-col items-center justify-center p-6 bg-[#081018]">
      <div className="glass-panel w-full max-w-6xl p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {language === 'pt' ? 'Sistema de Variáveis' : 'Variable System'} <span className="text-primary">{language === 'pt' ? 'Essencial' : 'Essentials'}</span>
          </h2>
          <p className="text-muted text-lg max-w-3xl">
            {t.variaveis.desc}
          </p>
        </div>

        {/* 4 Cards Grid - Clickable */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(['int', 'float', 'str', 'bool'] as VariableType[]).map((type) => {
             const item = content[type];
             // Extract color for hover border
             const borderColor = item.color === 'blue' ? 'hover:border-blue-500' : 
                                 item.color === 'green' ? 'hover:border-green-500' :
                                 item.color === 'purple' ? 'hover:border-purple-500' : 'hover:border-orange-500';
             
             const iconColor = item.color === 'blue' ? 'text-blue-400 bg-blue-500/10' : 
                               item.color === 'green' ? 'text-green-400 bg-green-500/10' :
                               item.color === 'purple' ? 'text-purple-400 bg-purple-500/10' : 'text-orange-400 bg-orange-500/10';

             return (
              <button 
                key={type}
                onClick={() => handleCardClick(type)}
                className={`bg-[#0b1220] border border-white/10 rounded-2xl p-6 transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden text-left ${borderColor} hover:shadow-2xl`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-xl group-hover:scale-110 transition-transform ${iconColor}`}>
                  <i className={`fas ${item.icon}`}></i>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-muted mb-6">
                  {language === 'pt' ? 'Clique para explorar teoria, prática e jogos.' : 'Click to explore theory, practice and games.'}
                </p>
                
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-white/50">
                   <i className="fas fa-arrow-right"></i>
                </div>
              </button>
             );
          })}
        </div>

        {/* Render Modal if active */}
        {renderActiveContent()}

      </div>
    </section>
  );
};

export default Variaveis;
