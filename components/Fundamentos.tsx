import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

type LogicTopic = 'sequencia' | 'fluxograma' | 'repeticao';

interface DetailedContent {
  title: string;
  icon: string;
  color: string;
  shortDesc: string;
  definition: string;
  analogy: {
    title: string;
    description: string;
    icon: string;
  };
  techConcept: {
    title: string;
    items: string[];
  };
  visualComponent: React.ReactNode;
}

// --- MINI GAMES COMPONENTS ---

// 1. SEQUENCE GAME
const SequenceGame: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [availableSteps, setAvailableSteps] = useState([
    { id: '3', text: 'Servir na xícara' },
    { id: '1', text: 'Esquentar água' },
    { id: '2', text: 'Passar o café' },
    { id: '0', text: 'Moer os grãos' },
  ]);
  const [userSequence, setUserSequence] = useState<typeof availableSteps>([]);
  const [status, setStatus] = useState<'playing' | 'success' | 'error'>('playing');

  const correctOrder = ['0', '1', '2', '3'];

  const handleAdd = (step: typeof availableSteps[0]) => {
    setUserSequence([...userSequence, step]);
    setAvailableSteps(availableSteps.filter(s => s.id !== step.id));
    setStatus('playing');
  };

  const handleRemove = (step: typeof availableSteps[0]) => {
    setAvailableSteps([...availableSteps, step]);
    setUserSequence(userSequence.filter(s => s.id !== step.id));
    setStatus('playing');
  };

  const checkOrder = () => {
    const currentIds = userSequence.map(s => s.id);
    const isCorrect = JSON.stringify(currentIds) === JSON.stringify(correctOrder);
    
    if (isCorrect) {
      setStatus('success');
      onComplete();
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30">
        <h4 className="text-blue-300 font-bold mb-2"><i className="fas fa-mug-hot"></i> Desafio: Algoritmo do Café</h4>
        <p className="text-sm text-gray-300">O computador precisa de instruções na ordem exata. Organize os passos para fazer um café perfeito.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Available Steps */}
        <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/10">
          <h5 className="text-xs font-bold text-muted uppercase mb-3">Passos Disponíveis (Clique para adicionar)</h5>
          <div className="space-y-2">
            {availableSteps.map(step => (
              <button 
                key={step.id}
                onClick={() => handleAdd(step)}
                className="w-full text-left p-3 rounded-lg bg-[#0f1720] border border-white/10 hover:border-blue-500 transition-colors text-sm flex justify-between items-center group"
              >
                {step.text}
                <i className="fas fa-plus text-blue-500 opacity-0 group-hover:opacity-100"></i>
              </button>
            ))}
            {availableSteps.length === 0 && <div className="text-center text-xs text-muted py-4">Todos os passos selecionados</div>}
          </div>
        </div>

        {/* User Sequence */}
        <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/10 relative">
          <h5 className="text-xs font-bold text-blue-400 uppercase mb-3">Seu Algoritmo (main.py)</h5>
          <div className="space-y-2 min-h-[150px]">
            {userSequence.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2 animate-fadeIn">
                <span className="text-xs text-gray-600 font-mono">{index + 1}.</span>
                <button 
                  onClick={() => handleRemove(step)}
                  className="flex-1 text-left p-2 rounded bg-blue-500/10 border border-blue-500/30 text-blue-200 text-sm hover:bg-red-500/10 hover:border-red-500 hover:text-red-300 transition-all flex justify-between items-center"
                >
                  {step.text}
                  <i className="fas fa-times text-xs opacity-50"></i>
                </button>
                {index < userSequence.length - 1 && <div className="absolute left-6 h-2 w-0.5 bg-blue-500/20 translate-y-6"></div>}
              </div>
            ))}
            {userSequence.length === 0 && <div className="text-center text-sm text-gray-600 italic py-10">Seu código está vazio...</div>}
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-4">
        {status === 'success' && <span className="text-green-400 font-bold animate-pulse">Algoritmo Correto! Parabéns!</span>}
        {status === 'error' && <span className="text-red-400 font-bold">Ordem incorreta. Tente novamente!</span>}
        <button 
          onClick={checkOrder}
          disabled={userSequence.length !== 4}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
        >
          <i className="fas fa-play"></i> Compilar & Executar
        </button>
      </div>
    </div>
  );
};

// 2. FLOWCHART GAME
const FlowchartGame: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [batteryLevel, setBatteryLevel] = useState(50);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState("");

  const generateScenario = () => {
    const randomBat = Math.random() > 0.5 ? 10 : 80;
    setBatteryLevel(randomBat);
    setStatus('idle');
    setFeedback("");
  };

  useEffect(() => {
    generateScenario();
  }, []);

  const handleDecision = (choice: 'yes' | 'no') => {
    // Condition: Battery < 20%
    const conditionTrue = batteryLevel < 20;

    if ((choice === 'yes' && conditionTrue) || (choice === 'no' && !conditionTrue)) {
      setStatus('success');
      setFeedback("Decisão Lógica Correta!");
      onComplete();
    } else {
      setStatus('error');
      setFeedback("Erro de Lógica! Verifique a condição.");
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30 w-full">
        <h4 className="text-purple-300 font-bold mb-2"><i className="fas fa-project-diagram"></i> Desafio: O Gerenciador de Energia</h4>
        <p className="text-sm text-gray-300">Observe o estado da bateria e siga o fluxo correto. O computador só segue o caminho verdadeiro.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
        
        {/* State Panel */}
        <div className="bg-[#0f1720] p-6 rounded-2xl border border-white/10 flex flex-col items-center gap-2 w-40">
           <span className="text-xs text-muted uppercase font-bold">Estado Atual</span>
           <div className={`text-4xl font-bold ${batteryLevel < 20 ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
             {batteryLevel}%
           </div>
           <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
             <div className={`h-full ${batteryLevel < 20 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${batteryLevel}%` }}></div>
           </div>
           <span className="text-[10px] text-gray-500">Variável: bateria</span>
        </div>

        <i className="fas fa-arrow-right text-gray-600 hidden md:block"></i>
        <i className="fas fa-arrow-down text-gray-600 md:hidden"></i>

        {/* Visual Flowchart */}
        <div className="relative flex flex-col items-center">
          {/* Diamond */}
          <div className="w-32 h-32 bg-purple-500/20 border-2 border-purple-400 rotate-45 flex items-center justify-center mb-12 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <div className="-rotate-45 text-center">
              <span className="block text-[10px] text-purple-300">bateria</span>
              <span className="block font-bold text-white text-lg">{'< 20'}</span>
              <span className="block text-[10px] text-purple-300">?</span>
            </div>
          </div>

          {/* Paths */}
          <div className="absolute top-[110px] w-64 flex justify-between px-2">
             <div className="flex flex-col items-center">
               <div className="h-8 w-0.5 bg-green-500/50"></div>
               <button 
                 onClick={() => handleDecision('yes')}
                 className="mt-2 px-4 py-2 bg-green-500/10 border border-green-500 hover:bg-green-500 hover:text-black text-green-400 rounded-lg text-sm font-bold transition-all"
               >
                 Sim (True)
               </button>
               <span className="text-[10px] text-gray-400 mt-1">Carregar</span>
             </div>

             <div className="flex flex-col items-center">
               <div className="h-8 w-0.5 bg-red-500/50"></div>
               <button 
                 onClick={() => handleDecision('no')}
                 className="mt-2 px-4 py-2 bg-red-500/10 border border-red-500 hover:bg-red-500 hover:text-white text-red-400 rounded-lg text-sm font-bold transition-all"
               >
                 Não (False)
               </button>
               <span className="text-[10px] text-gray-400 mt-1">Usar</span>
             </div>
          </div>
        </div>

      </div>

      <div className="h-8 text-center mt-12 md:mt-0">
        {status === 'success' && (
          <div className="animate-fadeIn">
            <span className="text-green-400 font-bold block">{feedback}</span>
            <button onClick={generateScenario} className="text-xs underline text-muted hover:text-white mt-1">Jogar Novamente</button>
          </div>
        )}
        {status === 'error' && <span className="text-red-400 font-bold animate-shake block">{feedback}</span>}
      </div>
    </div>
  );
};

// 3. LOOP GAME
const LoopGame: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [targetApples, setTargetApples] = useState(5);
  const [inputValue, setInputValue] = useState("");
  const [collected, setCollected] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Random target between 3 and 8
    setTargetApples(Math.floor(Math.random() * 6) + 3);
  }, []);

  const runLoop = () => {
    const loops = parseInt(inputValue);
    if (isNaN(loops)) return;

    setIsRunning(true);
    setCollected(0);
    setStatus('idle');

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setCollected(count);

      if (count >= loops) {
        clearInterval(interval);
        setIsRunning(false);
        if (count === targetApples) {
          setStatus('success');
          onComplete();
        } else {
          setStatus('error');
        }
      }
    }, 500);
  };

  return (
    <div className="flex flex-col gap-6">
       <div className="bg-teal-900/20 p-4 rounded-xl border border-teal-500/30">
        <h4 className="text-teal-300 font-bold mb-2"><i className="fas fa-sync"></i> Desafio: O Colhedor Automático</h4>
        <p className="text-sm text-gray-300">Você precisa colher exatamente <strong>{targetApples}</strong> maçãs. Configure o Loop para rodar o número exato de vezes.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        
        {/* Code Editor */}
        <div className="flex-1 w-full bg-[#0f1720] p-6 rounded-xl border border-white/10 shadow-inner font-mono">
           <div className="text-gray-500 mb-2"># Configure o range</div>
           <div className="flex items-center gap-2 text-lg">
             <span className="text-purple-400">for</span>
             <span className="text-white">i</span>
             <span className="text-purple-400">in</span>
             <span className="text-yellow-300">range</span>
             <span className="text-white">(</span>
             <input 
               type="number" 
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               className="w-16 bg-white/10 border border-white/20 rounded text-center text-white focus:outline-none focus:border-teal-500"
               placeholder="?"
               disabled={isRunning}
             />
             <span className="text-white">):</span>
           </div>
           <div className="pl-8 mt-2 text-teal-400">
             robo.colher_maca()
           </div>
           
           <button 
             onClick={runLoop}
             disabled={isRunning || !inputValue}
             className="mt-6 w-full py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
           >
             {isRunning ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-play"></i>} Rodar Loop
           </button>
        </div>

        {/* Visualizer */}
        <div className="flex-1 w-full bg-black/40 p-4 rounded-xl border border-white/10 min-h-[200px] flex flex-col justify-between">
           <div className="flex justify-center gap-2 flex-wrap">
              {Array.from({ length: targetApples }).map((_, i) => (
                <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-500 ${i < collected ? 'bg-transparent scale-0 opacity-0' : 'bg-red-500/20 text-red-500 border border-red-500/50'}`}>
                  <i className="fas fa-apple-alt"></i>
                </div>
              ))}
           </div>
           
           <div className="flex justify-center mt-4">
              <div className="text-center">
                 <div className="text-4xl mb-2">{isRunning ? '🤖' : (status === 'success' ? '😎' : '😐')}</div>
                 <div className="text-sm text-gray-400">Cesta: <span className="text-white font-bold">{collected}</span> / {targetApples}</div>
              </div>
           </div>

           {status === 'error' && (
             <div className="mt-2 text-center text-red-400 text-sm font-bold">
               {collected > targetApples ? "Ops! Você colheu demais (Loop infinito?)." : "Faltaram maçãs! Aumente o range."}
             </div>
           )}
            {status === 'success' && (
             <div className="mt-2 text-center text-green-400 text-sm font-bold">
               Perfeito! Loop calibrado.
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

// --- QUIZ COMPONENT ---
const MiniQuiz: React.FC<{ topic: LogicTopic }> = ({ topic }) => {
  const [answered, setAnswered] = useState<number | null>(null);

  const quizzes = {
    sequencia: {
      q: "Em um algoritmo, o que acontece se invertermos a ordem de passos dependentes (ex: calçar sapatos antes das meias)?",
      options: ["O programa roda mais rápido", "Ocorre um erro de lógica (bug)", "O computador corrige sozinho", "Nada muda"],
      correct: 1,
      feedback: "Exato! A ordem (sequência) é fundamental. Passos invertidos geram resultados inesperados."
    },
    fluxograma: {
      q: "Em um fluxograma, o losango (diamante) representa:",
      options: ["Início/Fim", "Uma ação", "Uma decisão (condicional)", "Uma impressão"],
      correct: 2,
      feedback: "Perfeito! O losango verifica uma condição (Sim/Não) e bifurca o caminho."
    },
    repeticao: {
      q: "Qual é a principal vantagem de usar um Loop?",
      options: ["Deixar o código mais colorido", "Evitar reescrever o mesmo código várias vezes", "Ocupar mais memória", "Não tem vantagem"],
      correct: 1,
      feedback: "Correto! Loops automatizam tarefas repetitivas, economizando linhas de código e esforço."
    }
  };

  const currentQuiz = quizzes[topic];

  return (
    <div className="mt-8 pt-8 border-t border-white/10 animate-fadeIn">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2"><i className="fas fa-question-circle text-yellow-400"></i> Quiz Rápido</h3>
      <p className="text-gray-300 mb-4 text-sm">{currentQuiz.q}</p>
      <div className="grid gap-2">
        {currentQuiz.options.map((opt, idx) => (
          <button
            key={idx}
            disabled={answered !== null}
            onClick={() => setAnswered(idx)}
            className={`text-left p-3 rounded-lg border text-sm transition-all ${
              answered === idx 
                ? (idx === currentQuiz.correct ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-red-500/20 border-red-500 text-red-300')
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
            }`}
          >
            {opt}
            {answered === idx && (idx === currentQuiz.correct ? <i className="fas fa-check float-right"></i> : <i className="fas fa-times float-right"></i>)}
          </button>
        ))}
      </div>
      {answered === currentQuiz.correct && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg text-green-300 text-sm animate-fadeIn">
          {currentQuiz.feedback}
        </div>
      )}
    </div>
  );
};


const Fundamentos: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTopic, setActiveTopic] = useState<LogicTopic | null>(null);
  const [activeTab, setActiveTab] = useState<'theory' | 'practice'>('theory');

  // Reset tab when topic changes
  useEffect(() => {
    setActiveTab('theory');
  }, [activeTopic]);

  // Content Data (Structured for educational depth)
  const contentData: Record<LogicTopic, DetailedContent> = {
    sequencia: {
      title: language === 'pt' ? 'Algoritmos e Sequência' : 'Algorithms & Sequence',
      icon: 'fa-list-ol',
      color: 'blue',
      shortDesc: language === 'pt' 
        ? 'A ordem importa. Aprenda como instruções passo a passo formam a base de qualquer programa.'
        : 'Order matters. Learn how step-by-step instructions form the basis of any program.',
      definition: language === 'pt'
        ? "Um algoritmo é uma sequência finita de ações executáveis que visam obter uma solução para um determinado tipo de problema. O computador não 'adivinha'; ele segue ordens exatas, uma após a outra."
        : "An algorithm is a finite sequence of executable actions aimed at obtaining a solution to a specific type of problem. The computer doesn't 'guess'; it follows exact orders, one after another.",
      analogy: {
        title: language === 'pt' ? 'A Receita de Bolo' : 'The Cake Recipe',
        description: language === 'pt'
          ? "Imagine seguir uma receita. Você não pode 'assar o bolo' antes de 'quebrar os ovos'. Se você inverter a ordem dos passos (sequência), o resultado será desastroso. Na programação, uma linha de código depende do que aconteceu na linha anterior."
          : "Imagine following a recipe. You can't 'bake the cake' before 'breaking the eggs'. If you swap the order of steps (sequence), the result is disastrous. In programming, a line of code depends on what happened in the previous line.",
        icon: 'fa-birthday-cake'
      },
      techConcept: {
        title: language === 'pt' ? 'Conceitos Chave' : 'Key Concepts',
        items: language === 'pt' 
          ? [
              "Top-Down: O código é lido de cima para baixo.",
              "Instrução: A menor unidade de comando (ex: imprima, calcule).",
              "Estado: Como as variáveis mudam a cada passo."
            ]
          : [
              "Top-Down: Code is executed from top to bottom.",
              "Instruction: The smallest unit of command (e.g., print, calculate).",
              "State: How variables change with each step."
            ]
      },
      visualComponent: (
        <div className="bg-black/30 p-4 rounded-lg font-mono text-xs space-y-2 border-l-2 border-blue-500">
          <div className="flex items-center gap-2 opacity-50"><span className="text-gray-500">1.</span> <span className="text-green-400">acordar()</span></div>
          <div className="flex items-center gap-2 opacity-100 bg-blue-500/20 p-1 rounded"><span className="text-gray-500">2.</span> <span className="text-blue-300">tomar_cafe()</span> <i className="fas fa-arrow-left text-xs animate-pulse"></i></div>
          <div className="flex items-center gap-2 opacity-50"><span className="text-gray-500">3.</span> <span className="text-yellow-400">codar()</span></div>
        </div>
      )
    },
    fluxograma: {
      title: language === 'pt' ? 'Lógica Visual (Fluxogramas)' : 'Visual Logic (Flowcharts)',
      icon: 'fa-project-diagram',
      color: 'purple',
      shortDesc: language === 'pt'
        ? 'Visualize decisões. Se (if) estiver chovendo, leve guarda-chuva. Senão (else), vá de óculos.'
        : 'Visualize decisions. If (if) it is raining, take an umbrella. Else (else), wear sunglasses.',
      definition: language === 'pt'
        ? "O fluxograma é a representação gráfica de um algoritmo. Ele usa formas geométricas padronizadas para ilustrar o fluxo de dados e as decisões lógicas, facilitando o entendimento antes de escrevermos o código real."
        : "A flowchart is the graphical representation of an algorithm. It uses standardized geometric shapes to illustrate data flow and logical decisions, making it easier to understand before writing actual code.",
      analogy: {
        title: language === 'pt' ? 'O Mapa do Tesouro' : 'The Treasure Map',
        description: language === 'pt'
          ? "Pense no fluxograma como um mapa de estradas com bifurcações. Quando você chega em uma encruzilhada (Decisão), você deve olhar uma condição ('A placa diz Esquerda?') para saber qual caminho seguir. Não é possível seguir dois caminhos ao mesmo tempo."
          : "Think of a flowchart as a road map with forks. When you reach a crossroads (Decision), you must check a condition ('Does the sign say Left?') to know which path to take. You cannot take two paths simultaneously.",
        icon: 'fa-map-signs'
      },
      techConcept: {
        title: language === 'pt' ? 'Simbologia Padrão' : 'Standard Symbols',
        items: language === 'pt'
          ? [
              "Elipse (Oval): Início e Fim do programa.",
              "Losango (Diamante): Decisão (IF/ELSE). Sempre tem saídas 'Sim' e 'Não'.",
              "Retângulo: Processamento (Cálculos, atribuições).",
              "Paralelogramo: Entrada ou Saída de dados."
            ]
          : [
              "Ellipse (Oval): Start and End of the program.",
              "Diamond: Decision (IF/ELSE). Always has 'Yes' and 'No' outputs.",
              "Rectangle: Processing (Calculations, assignments).",
              "Parallelogram: Input or Output of data."
            ]
      },
      visualComponent: (
        <div className="flex flex-col items-center justify-center h-full gap-2 opacity-90">
          <div className="px-3 py-1 rounded-full border border-gray-400 text-[10px] text-gray-300">Início</div>
          <div className="h-4 w-px bg-gray-500"></div>
          <div className="w-6 h-6 rotate-45 border border-purple-400 flex items-center justify-center bg-purple-500/10">
            <span className="-rotate-45 text-[8px] font-bold text-purple-300">?</span>
          </div>
          <div className="flex w-full justify-between px-8 -mt-2">
            <div className="flex flex-col items-center">
              <div className="text-[8px] text-green-400">Sim</div>
              <div className="h-4 w-px bg-green-500/50"></div>
              <div className="px-2 py-1 border border-green-500/50 text-[8px] rounded text-green-300">Ação A</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-[8px] text-red-400">Não</div>
              <div className="h-4 w-px bg-red-500/50"></div>
              <div className="px-2 py-1 border border-red-500/50 text-[8px] rounded text-red-300">Ação B</div>
            </div>
          </div>
        </div>
      )
    },
    repeticao: {
      title: language === 'pt' ? 'Loops e Repetição' : 'Loops & Repetition',
      icon: 'fa-sync-alt',
      color: 'teal',
      shortDesc: language === 'pt'
        ? 'Automação é poder. Execute tarefas milhares de vezes sem cansar usando Loops.'
        : 'Automation is power. Execute tasks thousands of times without tiring using Loops.',
      definition: language === 'pt'
        ? "Estruturas de repetição permitem executar um bloco de código várias vezes sem reescrevê-lo. Isso é essencial para processar listas, contar itens ou manter um programa rodando até que o usuário decida sair."
        : "Repetition structures allow executing a block of code multiple times without rewriting it. This is essential for processing lists, counting items, or keeping a program running until the user decides to quit.",
      analogy: {
        title: language === 'pt' ? 'O Músico e o Refrão' : 'The Musician and the Chorus',
        description: language === 'pt'
          ? "Em uma partitura, em vez de escrever o refrão 3 vezes, usamos um símbolo de repetição 'Volte ao início e toque mais 2 vezes'. Isso economiza papel e facilita a leitura. Loops fazem o mesmo pelo seu código."
          : "In sheet music, instead of writing the chorus 3 times, we use a repeat symbol 'Go back to start and play 2 more times'. This saves paper and makes reading easier. Loops do the same for your code.",
        icon: 'fa-music'
      },
      techConcept: {
        title: language === 'pt' ? 'Tipos de Loops' : 'Types of Loops',
        items: language === 'pt'
          ? [
              "Ciclo Definido (For): Quando sabemos quantas vezes repetir (ex: 10 vezes).",
              "Ciclo Indefinido (While): Repete ENQUANTO uma condição for verdadeira.",
              "Loop Infinito: O erro clássico onde a condição de parada nunca acontece."
            ]
          : [
              "Definite Loop (For): When we know how many times to repeat (e.g., 10 times).",
              "Indefinite Loop (While): Repeats WHILE a condition is true.",
              "Infinite Loop: The classic error where the stop condition never happens."
            ]
      },
      visualComponent: (
        <div className="bg-black/30 p-3 rounded-lg font-mono text-xs border border-teal-500/30">
          <div className="text-pink-400">while <span className="text-white">bateria</span> {'>'} <span className="text-orange-400">0</span>:</div>
          <div className="pl-4 text-teal-300">andar_para_frente()</div>
          <div className="pl-4 text-teal-300">bateria = bateria - 1</div>
          <div className="text-gray-500 mt-1"># Repete até acabar</div>
        </div>
      )
    }
  };

  const handleCardClick = (topic: LogicTopic) => {
    setActiveTopic(topic);
  };

  const closeModal = () => {
    setActiveTopic(null);
  };

  return (
    <section id="fundamentos" className="snap-section flex items-center justify-center p-6 bg-gradient-to-b from-[#0f1720] to-[#081018]">
      <div className="glass-panel w-full max-w-6xl p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl relative">
        <div className="mb-10 text-center md:text-left">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 border border-primary/20">
            {language === 'pt' ? 'Módulo 1' : 'Module 1'}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t.fundamentos.title}</h2>
          <p className="text-muted text-lg max-w-3xl leading-relaxed">
            {t.fundamentos.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.keys(contentData) as LogicTopic[]).map((key) => {
            const item = contentData[key];
            const isBlue = item.color === 'blue';
            const isPurple = item.color === 'purple';
            
            // Dynamic color classes based on item.color config
            const bgClass = isBlue ? 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500' : 
                            isPurple ? 'bg-purple-500/20 text-purple-400 group-hover:bg-purple-500' : 
                            'bg-teal-500/20 text-teal-400 group-hover:bg-teal-500';
            
            const borderHoverClass = isBlue ? 'hover:border-blue-500/50' : 
                                     isPurple ? 'hover:border-purple-500/50' : 
                                     'hover:border-teal-500/50';

            return (
              <button
                key={key}
                onClick={() => handleCardClick(key)}
                className={`text-left bg-card/50 p-6 rounded-2xl border border-white/5 ${borderHoverClass} transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden h-full flex flex-col`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${bgClass} group-hover:text-white text-2xl`}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-muted text-sm mb-6 flex-1 leading-relaxed">
                  {item.shortDesc}
                </p>

                {/* Mini Preview Component */}
                <div className="mt-auto opacity-60 group-hover:opacity-100 transition-opacity">
                   {item.visualComponent}
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <i className="fas fa-expand-alt text-white/30 hover:text-white"></i>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DETAILED EDUCATIONAL MODAL */}
      {activeTopic && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn p-4">
          <div className="bg-[#0b1220] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className={`p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r 
              ${contentData[activeTopic].color === 'blue' ? 'from-blue-900/20 to-transparent' : 
                contentData[activeTopic].color === 'purple' ? 'from-purple-900/20 to-transparent' : 
                'from-teal-900/20 to-transparent'}`}>
              
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg
                  ${contentData[activeTopic].color === 'blue' ? 'bg-blue-500 text-white' : 
                    contentData[activeTopic].color === 'purple' ? 'bg-purple-500 text-white' : 
                    'bg-teal-500 text-slate-900'}`}>
                  <i className={`fas ${contentData[activeTopic].icon}`}></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{contentData[activeTopic].title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-xs text-muted uppercase tracking-widest font-bold">
                        {language === 'pt' ? 'Fundamentos' : 'Fundamentals'}
                     </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-white transition-colors"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            {/* TABS */}
            <div className="flex border-b border-white/5 bg-[#0f1720]">
              <button 
                onClick={() => setActiveTab('theory')}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'theory' ? 'text-white' : 'text-muted hover:text-white'}`}
              >
                {language === 'pt' ? '📖 Teoria' : '📖 Theory'}
                {activeTab === 'theory' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
              </button>
              <button 
                onClick={() => setActiveTab('practice')}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'practice' ? 'text-white' : 'text-muted hover:text-white'}`}
              >
                {language === 'pt' ? '🎮 Prática Interativa' : '🎮 Interactive Practice'}
                {activeTab === 'practice' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-[#0b1220]">
              
              {/* THEORY TAB */}
              {activeTab === 'theory' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                  
                  {/* Left Column: Theory */}
                  <div className="space-y-8">
                    <section>
                      <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <i className="fas fa-book-open text-primary/70"></i> {language === 'pt' ? 'Definição Técnica' : 'Technical Definition'}
                      </h4>
                      <p className="text-gray-300 leading-relaxed text-base border-l-2 border-white/10 pl-4">
                        {contentData[activeTopic].definition}
                      </p>
                    </section>

                    <section className="bg-white/5 rounded-xl p-5 border border-white/5">
                      <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <i className="fas fa-lightbulb text-yellow-400"></i> {language === 'pt' ? 'Analogia do Mundo Real' : 'Real World Analogy'}
                      </h4>
                      <div className="flex gap-4">
                        <div className="mt-1">
                          <i className={`fas ${contentData[activeTopic].analogy.icon} text-2xl opacity-50`}></i>
                        </div>
                        <div>
                          <strong className="block text-white mb-1">{contentData[activeTopic].analogy.title}</strong>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {contentData[activeTopic].analogy.description}
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Practical */}
                  <div className="space-y-8">
                     <section>
                      <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <i className="fas fa-code text-primary/70"></i> {contentData[activeTopic].techConcept.title}
                      </h4>
                      <ul className="space-y-3">
                        {contentData[activeTopic].techConcept.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-gray-300 bg-black/20 p-3 rounded-lg border border-white/5">
                            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold mt-0.5">{idx + 1}</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="flex flex-col h-full justify-end">
                      <div className="bg-[#080c14] rounded-xl p-6 border border-white/10 shadow-inner flex items-center justify-center min-h-[160px]">
                        <div className="scale-125 transform">
                          {contentData[activeTopic].visualComponent}
                        </div>
                      </div>
                      <p className="text-center text-xs text-muted mt-2">
                        {language === 'pt' ? 'Representação Visual do Conceito' : 'Visual Concept Representation'}
                      </p>
                    </section>
                  </div>
                </div>
              )}

              {/* PRACTICE TAB */}
              {activeTab === 'practice' && (
                <div className="animate-fadeIn max-w-3xl mx-auto">
                   {activeTopic === 'sequencia' && <SequenceGame onComplete={() => {}} />}
                   {activeTopic === 'fluxograma' && <FlowchartGame onComplete={() => {}} />}
                   {activeTopic === 'repeticao' && <LoopGame onComplete={() => {}} />}

                   {/* Mini Quiz embedded at bottom of practice */}
                   <MiniQuiz topic={activeTopic} />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-[#0f1720] flex justify-end">
               <button 
                 onClick={closeModal}
                 className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-colors border border-white/10"
               >
                 {language === 'pt' ? 'Fechar' : 'Close'}
               </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default Fundamentos;