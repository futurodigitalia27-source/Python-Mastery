
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { explainQuizConcept, getContextualHelp, generateLogicPuzzle, generateQuizQuestions } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

interface EmentaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- DATA DEFINITIONS ---

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
    title: "Módulo 06: Python para Data Science",
    desc: "Aplicações práticas para o mercado de trabalho.",
    topics: ["Automação de Arquivos e Pastas", "Manipulação de CSV e Excel", "Introdução a Análise de Dados (Pandas)", "Web Scraping Básico"],
    project: "Bot de Automação de Relatórios",
    level: "Profissional",
    duration: "3 semanas",
    pdfLink: "https://drive.google.com/uc?export=download&id=1aZGxxQO0sjfOqjdQOuG7sB0P8ezs3IYq"
  }
];

const libraryItems = [
  {
    title: "100 Exercícios de Python",
    desc: "Lista completa de enunciados e gabarito.",
    icon: "fa-dumbbell",
    color: "text-green-400",
    bg: "bg-green-500/10",
    link: "https://drive.google.com/uc?export=download&id=16ppKGR1qDWKcanelXR64WW8PmuxaPOvQ",
    answerLink: "https://drive.google.com/uc?export=download&id=1VLqoFYB_Tj2yCt44Bcn6kHsEOih1Vn-W"
  },
  {
    title: "Python para Data Science",
    desc: "Guia completo com aplicações práticas e análise de dados.",
    icon: "fa-table",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    link: "https://drive.google.com/uc?export=download&id=1aZGxxQO0sjfOqjdQOuG7sB0P8ezs3IYq"
  },
  {
    title: "Manual Instalação Thonny",
    desc: "Passo a passo para configurar seu ambiente de desenvolvimento.",
    icon: "fa-laptop-code",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    link: "https://drive.google.com/uc?export=download&id=1aR0cFRqUCcFXkv5W4pRdVbcGN0conmtn"
  },
  {
    title: "Guia de Estruturas de Dados",
    desc: "Entenda Listas, Tuplas, Sets e Dicionários em profundidade.",
    icon: "fa-layer-group",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    link: "https://drive.google.com/uc?export=download&id=18w5SxT7f1t7VnWOhmOnEErBUTyOvAfW8"
  },
  {
    title: "Guia Rápido Pandas",
    desc: "Resumo prático das principais funções para manipulação de DataFrames.",
    icon: "fa-database",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    link: "https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf",
    extraPDF: "https://drive.google.com/uc?export=download&id=1pQZuAadDjzEj8RC5NtxqhXfYZfVeg4Rl"
  },
  {
      title: "Introdução ao GitHub",
      desc: "Domine o versionamento de código e colabore em projetos open source.",
      icon: "fa-code-branch",
      color: "text-white",
      bg: "bg-white/10"
  },
  {
      title: "Python Patterns",
      desc: "Design patterns mais comuns aplicados na linguagem Python.",
      icon: "fa-cubes",
      color: "text-orange-400",
      bg: "bg-orange-500/10"
  }
];

const initialQuizQuestions = [
  // 1-5 (Basics)
  {
    id: 1,
    question: "Qual é a saída de `print(2 ** 3)`?",
    options: ["6", "8", "9", "5"],
    correct: 1,
    explanation: "O operador `**` realiza a exponenciação. 2 elevado ao cubo (2 * 2 * 2) é 8."
  },
  {
    id: 2,
    question: "Qual símbolo inicia um comentário em Python?",
    options: ["//", "/*", "#", "<!--"],
    correct: 2,
    explanation: "Em Python, utilizamos o símbolo `#` para comentários de uma linha."
  },
  {
    id: 3,
    question: "Qual estrutura é usada para repetir um bloco de código?",
    options: ["if", "for", "def", "import"],
    correct: 1,
    explanation: "O `for` é uma estrutura de repetição usada para iterar sobre sequências."
  },
  {
    id: 4,
    question: "O que a função `len()` retorna?",
    options: ["Cria uma lista", "O tamanho de um objeto", "Converte para inteiro", "Imprime na tela"],
    correct: 1,
    explanation: "`len()` retorna o comprimento (length) de objetos como strings, listas, tuplas, etc."
  },
  {
    id: 5,
    question: "Qual é o tipo de dado de `False`?",
    options: ["int", "str", "bool", "float"],
    correct: 2,
    explanation: "`False` e `True` são os dois valores possíveis do tipo Booleano (`bool`)."
  },
  // ... (More static questions could be here) ...
];

// --- HELPER COMPONENT FOR ASSISTANT OVERLAY ---
const AssistantOverlay: React.FC<{ 
  onAskHelp: () => void; 
  isLoading: boolean; 
  hint: string | null; 
  onCloseHint: () => void;
}> = ({ onAskHelp, isLoading, hint, onCloseHint }) => {
  return (
    <>
      <button 
        onClick={onAskHelp}
        disabled={isLoading}
        className="absolute top-4 right-4 z-50 bg-primary hover:bg-teal-400 text-slate-900 px-3 py-2 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 transition-all active:scale-95"
      >
        {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-robot"></i>}
        Ajuda do Fole
      </button>

      {hint && (
        <div className="absolute top-16 right-4 z-50 w-64 bg-[#0b1220]/95 backdrop-blur-md border border-primary/30 p-4 rounded-xl shadow-2xl animate-fadeIn">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-slate-900 text-xs">
                <i className="fas fa-robot"></i>
              </div>
              <span className="text-xs font-bold text-white">Dica do Fole</span>
            </div>
            <button onClick={onCloseHint} className="text-muted hover:text-white text-xs">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <p className="text-sm text-gray-200 leading-relaxed">{hint}</p>
        </div>
      )}
    </>
  );
};


// --- ROBOT BRIEFING COMPONENT ---
interface BriefingProps {
  title: string;
  mission: string;
  instructions: string[];
  color: string;
  icon: string;
  onStart: () => void;
  onExit: () => void;
}

const GameBriefing: React.FC<BriefingProps> = ({ title, mission, instructions, color, icon, onStart, onExit }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-fadeIn max-w-lg mx-auto">
      <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-4xl shadow-2xl mb-8 animate-float-slow`}>
        <i className={`fas ${icon} text-white`}></i>
      </div>
      
      <div className="glass-panel p-6 rounded-2xl border border-white/10 w-full relative overflow-hidden">
        {/* Decorative Robot Head */}
        <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
          <i className="fas fa-robot text-9xl text-white"></i>
        </div>

        <div className="flex items-center gap-3 mb-4">
           <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
             <i className="fas fa-robot text-primary"></i>
           </div>
           <div>
             <div className="text-[10px] text-primary font-bold uppercase tracking-wider">Fole AI • Game Master</div>
             <h2 className="text-xl font-bold text-white">{title}</h2>
           </div>
        </div>

        <div className="bg-black/30 rounded-xl p-4 mb-4 border-l-2 border-primary">
           <h3 className="text-sm font-bold text-white mb-1">🎯 Sua Missão</h3>
           <p className="text-sm text-gray-300 leading-relaxed">{mission}</p>
        </div>

        <div className="space-y-2 mb-6">
           <h3 className="text-xs font-bold text-muted uppercase">Instruções</h3>
           {instructions.map((inst, i) => (
             <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
               <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
               {inst}
             </div>
           ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onExit} className="flex-1 py-3 rounded-xl border border-white/10 text-muted hover:bg-white/5 hover:text-white transition-colors text-sm font-bold">
            Cancelar
          </button>
          <button onClick={onStart} className="flex-[2] py-3 rounded-xl bg-primary hover:bg-teal-400 text-slate-900 font-bold transition-all shadow-lg shadow-teal-500/20 text-sm flex items-center justify-center gap-2 group">
            Começar Missão <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- GAME COMPONENTS ---

// 1. SNAKE GAME COMPONENT
const SnakeGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const GRID_SIZE = 20;
  const INITIAL_SPEED = 150;
  
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); 
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Assistant State
  const [hint, setHint] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const requestHelp = async () => {
    setIsAsking(true);
    const context = `Jogo da Cobrinha (Snake). O jogador controla uma cobra em um grid ${GRID_SIZE}x${GRID_SIZE}.`;
    const gameState = { score, snakeLength: snake.length, snakeHead: snake[0], foodPos: food };
    const help = await getContextualHelp(context, gameState);
    setHint(help);
    setIsAsking(false);
  };

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setHint(null);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if(['ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault();
      
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake(prev => {
        const head = { ...prev[0] };
        
        switch (direction) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        if (
          head.x < 0 || head.x >= GRID_SIZE || 
          head.y < 0 || head.y >= GRID_SIZE ||
          prev.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true);
          setIsPlaying(false);
          setHighScore(curr => Math.max(curr, score));
          return prev;
        }

        const newSnake = [head, ...prev];
        
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    gameLoopRef.current = setInterval(moveSnake, Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10));
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, direction, food, score, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-fadeIn relative">
      <AssistantOverlay onAskHelp={requestHelp} isLoading={isAsking} hint={hint} onCloseHint={() => setHint(null)} />

      <div className="flex justify-between w-full max-w-md mb-4 items-center">
        <button onClick={onExit} className="text-muted hover:text-white text-sm flex items-center gap-2">
          <i className="fas fa-arrow-left"></i> Sair
        </button>
        <div className="text-white font-mono font-bold">SCORE: {score} <span className="text-muted text-xs ml-2">HI: {highScore}</span></div>
      </div>

      <div 
        className="bg-black/40 border-2 border-green-500/30 rounded-lg relative shadow-[0_0_20px_rgba(34,197,94,0.1)]"
        style={{ width: '300px', height: '300px' }}
      >
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 p-6 text-center animate-fadeIn">
            <i className="fas fa-skull text-4xl text-red-500 mb-4"></i>
            <h2 className="text-xl font-bold text-white mb-2">Game Over!</h2>
            <p className="text-sm text-gray-300 mb-4">Pontuação Final: <span className="text-green-400 font-bold">{score}</span></p>
            <button 
              onClick={resetGame}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-bold transition-all border border-white/10"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {Array.from({ length: GRID_SIZE }).map((_, row) => (
          <div key={row} className="flex h-[15px]">
            {Array.from({ length: GRID_SIZE }).map((_, col) => {
              const isSnake = snake.some(s => s.x === col && s.y === row);
              const isHead = snake[0].x === col && snake[0].y === row;
              const isFood = food.x === col && food.y === row;
              
              return (
                <div 
                  key={`${row}-${col}`} 
                  className={`w-[15px] h-[15px] border-[0.5px] border-white/5 ${
                    isHead ? 'bg-green-400' : 
                    isSnake ? 'bg-green-600' : 
                    isFood ? 'bg-red-500 rounded-full scale-75' : 'bg-transparent'
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex gap-2 text-[10px] text-muted uppercase tracking-widest">
         <span><i className="fas fa-arrow-up"></i> Use Setas</span>
         <span>•</span>
         <span>Listas & Coordenadas</span>
      </div>
    </div>
  );
};

// 2. BINARY BLITZ GAME COMPONENT
const BinaryGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [targetNumber, setTargetNumber] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100);
  const [isPlaying, setIsPlaying] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Assistant
  const [hint, setHint] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const requestHelp = async () => {
    setIsAsking(true);
    const context = `Binary Blitz. O jogador deve converter o número decimal ${targetNumber} para binário.`;
    const help = await getContextualHelp(context, { target: targetNumber, currentInput: input });
    setHint(help);
    setIsAsking(false);
  };

  const generateProblem = useCallback(() => {
    const max = Math.pow(2, Math.min(3 + difficulty, 8)) - 1;
    const num = Math.floor(Math.random() * max) + 1;
    setTargetNumber(num);
    setInput('');
  }, [difficulty]);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            setGameOver(true);
            setIsPlaying(false);
            return 0;
          }
          return prev - (0.2 * difficulty);
        });
      }, 50);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, gameOver, difficulty]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const binaryString = targetNumber.toString(2);
    
    if (input === binaryString) {
      setScore(s => s + (10 * difficulty));
      setFeedback('correct');
      setTimeLeft(prev => Math.min(prev + 20, 100));
      setDifficulty(d => d + 0.5);
      setTimeout(() => {
        setFeedback('none');
        generateProblem();
        setHint(null);
      }, 200);
    } else {
      setFeedback('wrong');
      setTimeLeft(prev => prev - 15);
      setInput('');
      setTimeout(() => setFeedback('none'), 300);
    }
  };

  const restartGame = () => {
    setScore(0);
    setDifficulty(1);
    setTimeLeft(100);
    setGameOver(false);
    setIsPlaying(true);
    generateProblem();
    setHint(null);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-fadeIn font-mono relative">
      <AssistantOverlay onAskHelp={requestHelp} isLoading={isAsking} hint={hint} onCloseHint={() => setHint(null)} />
      
      <div className="flex justify-between w-full max-w-md mb-8 items-center">
        <button onClick={onExit} className="text-muted hover:text-white text-sm flex items-center gap-2">
          <i className="fas fa-arrow-left"></i> Sair
        </button>
        <div className="text-white font-bold">SCORE: <span className="text-blue-400">{Math.floor(score)}</span></div>
      </div>

      {gameOver && (
        <div className="text-center animate-fadeIn absolute inset-0 bg-[#0b1220] z-20 flex flex-col items-center justify-center">
          <div className="text-6xl mb-4">💥</div>
          <h2 className="text-2xl font-bold text-white mb-2">Tempo Esgotado!</h2>
          <p className="text-muted mb-6">Você atingiu o nível {Math.floor(difficulty)}</p>
          <div className="text-4xl font-bold text-blue-400 mb-8">{Math.floor(score)} pts</div>
          <div className="flex gap-4">
             <button onClick={onExit} className="text-muted hover:text-white px-6 py-3">Sair</button>
             <button 
                onClick={restartGame}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
             >
                Jogar Novamente
             </button>
          </div>
        </div>
      )}

      {isPlaying && (
        <div className="w-full max-w-sm">
          {/* Timer Bar */}
          <div className="w-full h-2 bg-gray-800 rounded-full mb-8 overflow-hidden">
            <div 
              className={`h-full transition-all duration-75 ${timeLeft < 30 ? 'bg-red-500' : 'bg-blue-500'}`} 
              style={{ width: `${Math.max(0, timeLeft)}%` }}
            ></div>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-8 text-center mb-6 relative overflow-hidden">
            {feedback === 'correct' && <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-2xl animate-pulse">CORRETO!</div>}
            {feedback === 'wrong' && <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-2xl animate-pulse">ERRADO!</div>}
            
            <div className="text-xs text-muted uppercase tracking-widest mb-2">Converta para Binário</div>
            <div className="text-6xl font-bold text-white mb-2">{targetNumber}</div>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value.replace(/[^0-1]/g, ''))} // Only allow 0 and 1
              className="w-full bg-[#0b1220] border-2 border-blue-500/30 rounded-xl p-4 text-center text-2xl text-blue-400 tracking-[0.5em] focus:outline-none focus:border-blue-500 placeholder-blue-900/50"
              placeholder="0101"
              autoFocus
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-blue-500 hover:bg-blue-400 text-white px-4 rounded-lg font-bold transition-colors"
            >
              <i className="fas fa-check"></i>
            </button>
          </form>
          
          <div className="mt-8 grid grid-cols-4 gap-2">
            {[128, 64, 32, 16, 8, 4, 2, 1].map((n) => (
               <div key={n} className="text-center">
                 <div className="text-[10px] text-muted mb-1">{n}</div>
               </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 3. BUG HUNTER GAME COMPONENT
const BugHunterGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [problems, setProblems] = useState<any[]>([
    {
      id: 1,
      code: `def saudacao(nome)\n    print("Olá " + nome)`,
      error: "SyntaxError",
      desc: "Faltam os dois pontos (:) no final da definição da função.",
      options: ["Falta ':' no final da linha 1", "Indentação errada", "Print escrito errado", "Falta parenteses"],
      correct: 0
    },
    {
      id: 2,
      code: `numero = 10\nif numero = 10:\n    print("Igual")`,
      error: "SyntaxError",
      desc: "Em comparações deve-se usar '==' e não '='.",
      options: ["Faltam aspas no 10", "Deve ser '==' no if", "Indentação errada", "Variavel indefinida"],
      correct: 1
    }
  ]);

  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Assistant
  const [hint, setHint] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const requestHelp = async () => {
    setIsAsking(true);
    const problem = problems[currentLevel];
    const context = `Bug Hunter. O aluno precisa achar o erro no código Python. Código: ${problem.code}`;
    const help = await getContextualHelp(context, { errorType: problem.error });
    setHint(help);
    setIsAsking(false);
  };

  const handleAnswer = (index: number) => {
    if (showFeedback) return;

    if (index === problems[currentLevel].correct) {
      setShowFeedback('correct');
      setTimeout(() => {
        setScore(s => s + 100);
        if (currentLevel < problems.length - 1) {
          setCurrentLevel(l => l + 1);
          setShowFeedback(null);
          setHint(null);
        } else {
          setGameOver(true);
        }
      }, 1000);
    } else {
      setShowFeedback('wrong');
      setLives(l => l - 1);
      setTimeout(() => {
        if (lives <= 1) {
          setGameOver(true);
        }
        setShowFeedback(null);
      }, 1000);
    }
  };

  const restart = () => {
    setCurrentLevel(0);
    setScore(0);
    setLives(3);
    setGameOver(false);
    setShowFeedback(null);
    setHint(null);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-fadeIn font-mono relative">
      <AssistantOverlay onAskHelp={requestHelp} isLoading={isAsking} hint={hint} onCloseHint={() => setHint(null)} />
      
      <div className="flex justify-between w-full max-w-lg mb-6 items-center">
        <button onClick={onExit} className="text-muted hover:text-white text-sm flex items-center gap-2">
          <i className="fas fa-arrow-left"></i> Sair
        </button>
        <div className="flex gap-4">
           <div className="text-red-400 font-bold"><i className="fas fa-heart"></i> {lives}</div>
           <div className="text-white font-bold">SCORE: {score}</div>
        </div>
      </div>

      {gameOver ? (
        <div className="text-center bg-[#0b1220] p-8 rounded-2xl border border-white/10 shadow-2xl">
           <div className="text-6xl mb-4">{lives > 0 ? '🎉' : '💀'}</div>
           <h2 className="text-2xl font-bold text-white mb-2">{lives > 0 ? 'Missão Cumprida!' : 'Game Over'}</h2>
           <p className="text-muted mb-6">Você encontrou {currentLevel + (lives > 0 ? 1 : 0)} bugs.</p>
           <button onClick={restart} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold transition-all">
             Jogar Novamente
           </button>
        </div>
      ) : (
        <div className="w-full max-w-lg">
           <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/10 shadow-2xl mb-6 relative">
             <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-xs text-gray-400">buggy_script.py</span>
             </div>
             <pre className="p-6 text-sm text-gray-300 overflow-x-auto">
               <code>{problems[currentLevel].code}</code>
             </pre>
             {showFeedback === 'correct' && (
               <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-sm animate-fadeIn">
                 <div className="text-green-400 font-bold text-xl"><i className="fas fa-check-circle"></i> Bug Corrigido!</div>
               </div>
             )}
             {showFeedback === 'wrong' && (
               <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center backdrop-blur-sm animate-fadeIn">
                 <div className="text-red-400 font-bold text-xl"><i className="fas fa-times-circle"></i> Erro incorreto!</div>
               </div>
             )}
           </div>

           <h3 className="text-white font-bold mb-4 flex items-center gap-2">
             <i className="fas fa-search text-red-500 animate-pulse"></i> Qual é o erro?
           </h3>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             {problems[currentLevel].options.map((opt, i) => (
               <button 
                 key={i}
                 onClick={() => handleAnswer(i)}
                 disabled={showFeedback !== null}
                 className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left text-sm text-gray-300 transition-all hover:border-red-500/30"
               >
                 {opt}
               </button>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

// 4. MEMORY TYPES GAME
const MemoryTypesGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  interface Card { id: number; content: string; type: string; isFlipped: boolean; isMatched: boolean; isValue: boolean }
  
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  
  // Assistant
  const [hint, setHint] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const requestHelp = async () => {
    setIsAsking(true);
    const visibleCards = cards.filter(c => c.isFlipped || c.isMatched).map(c => c.content).join(", ");
    const help = await getContextualHelp("Jogo da Memória. O jogador deve combinar Tipos de Dados Python com seus Valores.", { visible: visibleCards, matches });
    setHint(help);
    setIsAsking(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const data = [
      { type: 'int', val: '42' },
      { type: 'str', val: '"Ola"' },
      { type: 'bool', val: 'True' },
      { type: 'float', val: '3.14' },
      { type: 'list', val: '[]' },
      { type: 'dict', val: '{}' }
    ];

    let deck: Card[] = [];
    data.forEach((item, index) => {
      deck.push({ id: index * 2, content: item.type, type: item.type, isFlipped: false, isMatched: false, isValue: false });
      deck.push({ id: index * 2 + 1, content: item.val, type: item.type, isFlipped: false, isMatched: false, isValue: true });
    });

    // Shuffle
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setMatches(0);
    setMoves(0);
    setFlippedCards([]);
    setHint(null);
  };

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves(m => m + 1);
      checkForMatch(newFlipped[0], newFlipped[1]);
    }
  };

  const checkForMatch = (idx1: number, idx2: number) => {
    if (cards[idx1].type === cards[idx2].type) {
      setTimeout(() => {
        const newCards = [...cards];
        newCards[idx1].isMatched = true;
        newCards[idx2].isMatched = true;
        setCards(newCards);
        setFlippedCards([]);
        setIsLocked(false);
        setMatches(m => m + 1);
      }, 500);
    } else {
      setTimeout(() => {
        const newCards = [...cards];
        newCards[idx1].isFlipped = false;
        newCards[idx2].isFlipped = false;
        setCards(newCards);
        setFlippedCards([]);
        setIsLocked(false);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-fadeIn relative">
      <AssistantOverlay onAskHelp={requestHelp} isLoading={isAsking} hint={hint} onCloseHint={() => setHint(null)} />
      
      <div className="flex justify-between w-full max-w-lg mb-6 items-center">
        <button onClick={onExit} className="text-muted hover:text-white text-sm flex items-center gap-2">
          <i className="fas fa-arrow-left"></i> Sair
        </button>
        <div className="flex gap-4 text-sm font-bold text-white">
          <span>Moves: {moves}</span>
          <span>Pairs: {matches}/6</span>
        </div>
      </div>

      {matches === 6 ? (
        <div className="text-center bg-[#0b1220] p-8 rounded-2xl border border-white/10 shadow-2xl">
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-2xl font-bold text-white mb-2">Memória Excelente!</h2>
          <p className="text-muted mb-6">Você dominou os Tipos de Dados.</p>
          <button onClick={initializeGame} className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-xl font-bold transition-all">
            Jogar Novamente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 w-full max-w-lg">
           {cards.map((card, index) => (
             <div 
               key={card.id}
               onClick={() => handleCardClick(index)}
               className={`aspect-square rounded-xl cursor-pointer transition-all duration-300 transform perspective-1000 relative ${card.isFlipped || card.isMatched ? 'rotate-y-180' : 'hover:scale-105'}`}
             >
               <div className={`w-full h-full flex items-center justify-center rounded-xl border font-bold text-sm md:text-lg shadow-lg transition-all ${
                 card.isFlipped || card.isMatched 
                   ? (card.isValue ? 'bg-white text-slate-900 border-white' : 'bg-purple-500 text-white border-purple-500')
                   : 'bg-white/5 border-white/10 hover:border-purple-500/50'
               }`}>
                 {card.isFlipped || card.isMatched ? card.content : <i className="fas fa-question text-white/20"></i>}
               </div>
             </div>
           ))}
        </div>
      )}
       <div className="mt-6 text-xs text-muted">Combine o TIPO (ex: int) com o VALOR (ex: 42)</div>
    </div>
  );
};

// 5. DYNAMIC LOGIC PUZZLE GAME (Generative AI Levels)
const LogicPuzzleGame: React.FC<{ level: number; onExit: () => void }> = ({ level, onExit }) => {
  const [puzzle, setPuzzle] = useState<{ title: string; desc: string; code: string; options: string[]; correct: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  
  // Assistant
  const [hint, setHint] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    const loadLevel = async () => {
      setLoading(true);
      const data = await generateLogicPuzzle(level);
      setPuzzle(data);
      setLoading(false);
    };
    loadLevel();
  }, [level]);

  const requestHelp = async () => {
    if (!puzzle) return;
    setIsAsking(true);
    const context = `Desafio de Lógica Nível ${level}. Pergunta: ${puzzle.desc}. Código: ${puzzle.code}`;
    const help = await getContextualHelp(context, {});
    setHint(help);
    setIsAsking(false);
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null || !puzzle) return;
    setSelected(idx);
    if (idx === puzzle.correct) {
      setResult('correct');
      setTimeout(() => setCompleted(true), 1500);
    } else {
      setResult('wrong');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full animate-fadeIn text-white gap-4">
        <i className="fas fa-circle-notch fa-spin text-4xl text-primary"></i>
        <p className="text-sm text-muted">Gerando Desafio Nível {level} com IA...</p>
      </div>
    );
  }

  if (completed) {
    return (
       <div className="flex flex-col items-center justify-center h-full w-full animate-fadeIn text-center">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-2xl font-bold text-white mb-2">Nível {level} Concluído!</h2>
          <p className="text-muted mb-6">Você ganhou +150 XP</p>
          <button onClick={onExit} className="bg-primary text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-teal-400">
             Voltar ao Mapa
          </button>
       </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-fadeIn relative max-w-2xl mx-auto">
      <AssistantOverlay onAskHelp={requestHelp} isLoading={isAsking} hint={hint} onCloseHint={() => setHint(null)} />
      
      <div className="w-full mb-6 flex items-center justify-between">
         <button onClick={onExit} className="text-muted hover:text-white"><i className="fas fa-arrow-left"></i> Sair</button>
         <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded border border-primary/20">Nível {level}</div>
      </div>

      <div className="bg-[#1e1e1e] w-full rounded-xl border border-white/10 p-6 mb-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-2">{puzzle?.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{puzzle?.desc}</p>
        
        {puzzle?.code && (
           <pre className="bg-black/30 p-4 rounded-lg font-mono text-sm text-blue-300 border border-white/5 mb-4 overflow-x-auto">
             {puzzle.code}
           </pre>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
           {puzzle?.options.map((opt, i) => {
             let btnClass = "bg-white/5 hover:bg-white/10 border-white/5";
             if (selected === i) {
               btnClass = result === 'correct' ? "bg-green-500/20 border-green-500 text-green-400" : "bg-red-500/20 border-red-500 text-red-400";
             }
             return (
               <button 
                 key={i} 
                 onClick={() => handleAnswer(i)}
                 className={`p-3 rounded-lg border text-left text-sm transition-all ${btnClass}`}
               >
                 {opt}
               </button>
             )
           })}
        </div>
        
        {result === 'wrong' && <div className="mt-4 text-center text-red-400 text-sm animate-shake font-bold">Resposta Incorreta. Tente novamente!</div>}
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---

const EmentaModal: React.FC<EmentaModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('trilha');
  
  // Game State
  const [activeGame, setActiveGame] = useState<'snake' | 'binary' | 'bug' | 'memory' | 'logic' | null>(null);
  const [logicLevel, setLogicLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false); // Controls Briefing vs Game
  const { language } = useLanguage();
  
  // Quiz State
  const [questions, setQuestions] = useState(initialQuizQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  
  // AI Explanation State
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [quizHint, setQuizHint] = useState<string | null>(null);
  const [isAskingQuiz, setIsAskingQuiz] = useState(false);

  // --- QUIZ HANDLERS ---
  const handleAnswerClick = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);
    
    if (optionIndex === questions[currentQuestionIndex].correct) {
      setScore(score + 1);
    }
  };

  const generateMoreQuiz = async () => {
    setIsGeneratingQuestions(true);
    const newQuestions = await generateQuizQuestions(5);
    // Add unique IDs to avoid conflict
    const processedNew = newQuestions.map((q, i) => ({...q, id: questions.length + i + 100 }));
    setQuestions(prev => [...prev, ...processedNew]);
    setIsGeneratingQuestions(false);
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setAiExplanation(null);
      setIsExplaining(false);
      setQuizHint(null);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setAiExplanation(null);
    setIsExplaining(false);
    setQuizHint(null);
  };

  const requestAiExplanation = async () => {
    if (selectedAnswer === null) return;
    setIsExplaining(true);
    const q = questions[currentQuestionIndex];
    const wrongOption = q.options[selectedAnswer];
    const correctOption = q.options[q.correct];
    const explanation = await explainQuizConcept(q.question, wrongOption, correctOption, language);
    setAiExplanation(explanation);
    setIsExplaining(false);
  };

  const requestQuizHint = async () => {
    setIsAskingQuiz(true);
    const q = questions[currentQuestionIndex];
    const hint = await getContextualHelp(`Quiz Question: ${q.question}`, { options: q.options });
    setQuizHint(hint);
    setIsAskingQuiz(false);
  };

  const selectGame = (game: 'snake' | 'binary' | 'bug' | 'memory' | 'logic', level: number = 1) => {
    setActiveGame(game);
    setLogicLevel(level);
    setGameStarted(false); // Show Briefing first
  };

  const exitGame = () => {
    setActiveGame(null);
    setGameStarted(false);
  };

  if (!isOpen) return null;

  const renderContent = () => {
    switch(activeTab) {
      case 'trilha':
        return (
          <div className="space-y-6 animate-fadeIn">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Sua Trilha de Aprendizado</h2>
                <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  Progresso: 15%
                </div>
             </div>
             {modules.map((mod) => (
                <div key={mod.id} className="bg-[#0b1220] border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-all group relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 text-8xl font-bold text-white/5 select-none group-hover:text-primary/5 transition-colors">
                    {mod.id}
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        mod.level === 'Iniciante' ? 'bg-green-500/20 text-green-400' : 
                        mod.level === 'Intermediário' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {mod.level}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-muted flex items-center gap-1">
                        <i className="far fa-clock"></i> {mod.duration}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{mod.title}</h3>
                    <p className="text-muted text-sm mb-4 leading-relaxed">{mod.desc}</p>
                    
                    <div className="bg-black/30 rounded-lg p-4 mb-4 border border-white/5">
                      <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wide">Tópicos:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {mod.topics.map((topic, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                             {topic}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                       <div className="flex items-center gap-2">
                         <i className="fas fa-project-diagram text-primary"></i>
                         <span className="text-sm font-medium text-white">{mod.project}</span>
                       </div>
                       {mod.pdfLink && (
                         <a href={mod.pdfLink} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:text-white transition-colors flex items-center gap-1">
                           <i className="fas fa-file-download"></i> PDF
                         </a>
                       )}
                    </div>
                  </div>
                </div>
             ))}
          </div>
        );
      
      case 'biblioteca':
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">Biblioteca de Recursos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraryItems.map((item, i) => (
                <div key={i} className="bg-[#0b1220] border border-white/5 rounded-xl p-6 hover:border-white/20 transition-all flex flex-col">
                  <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center text-xl mb-4`}>
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-muted mb-6 flex-1">{item.desc}</p>
                  <div className="flex gap-2 mt-auto">
                     {item.link && (
                       <a href={item.link} target="_blank" rel="noreferrer" className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2 rounded-lg text-center transition-colors border border-white/5">
                         <i className="fas fa-download mr-1"></i> Baixar
                       </a>
                     )}
                     {(item as any).extraPDF && (
                       <a href={(item as any).extraPDF} target="_blank" rel="noreferrer" className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2 rounded-lg text-center transition-colors border border-white/5">
                         <i className="fas fa-file-pdf mr-1"></i> Extra
                       </a>
                     )}
                     {item.answerLink && (
                       <a href={item.answerLink} target="_blank" rel="noreferrer" className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2 rounded-lg text-center transition-colors border border-primary/20">
                         <i className="fas fa-key mr-1"></i> Gabarito
                       </a>
                     )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'arcade':
        if (activeGame) {
          if (!gameStarted) {
            // SHOW BRIEFING ROBOT
            let briefingData = { title: "", mission: "", instructions: [""], color: "", icon: "" };
            if (activeGame === 'snake') {
               briefingData = {
                 title: "Snake Logic",
                 mission: "Entenda o conceito de Listas (Arrays) e Coordenadas Cartesianas enquanto alimenta a serpente de dados.",
                 instructions: ["Use as SETAS para mover.", "Coma os itens para crescer a lista.", "Não bata nas paredes (limites do Array)!"],
                 color: "from-green-600 to-green-900",
                 icon: "fa-staff-snake"
               };
            } else if (activeGame === 'binary') {
               briefingData = {
                 title: "Binary Blitz",
                 mission: "O computador só entende 0 e 1. Sua missão é traduzir números decimais para binários antes que o sistema caia.",
                 instructions: ["Veja o número decimal na tela.", "Digite a sequência de 0s e 1s correspondente.", "Seja rápido, o tempo é curto!"],
                 color: "from-blue-600 to-blue-900",
                 icon: "fa-microchip"
               };
            } else if (activeGame === 'bug') {
               briefingData = {
                 title: "Bug Hunter",
                 mission: "O código está quebrado! Atue como um compilador humano e encontre os erros de sintaxe escondidos.",
                 instructions: ["Analise o trecho de código Python.", "Identifique o erro (Syntax, Indentation, Type).", "Escolha a correção certa para ganhar pontos."],
                 color: "from-red-600 to-red-900",
                 icon: "fa-bug"
               };
            } else if (activeGame === 'memory') {
               briefingData = {
                 title: "Memory Types",
                 mission: "Associe corretamente os valores aos seus Tipos de Dados em Python.",
                 instructions: ["Vire duas cartas por vez.", "Combine o TIPO (ex: int) com o VALOR (ex: 42).", "Memorize as posições!"],
                 color: "from-purple-600 to-purple-900",
                 icon: "fa-brain"
               };
            } else if (activeGame === 'logic') {
              briefingData = {
                title: `Desafio Lógico Nível ${logicLevel}`,
                mission: "Resolva quebra-cabeças de lógica de programação gerados por IA.",
                instructions: ["Analise o problema.", "Selecione a opção correta.", "Ganhe XP e avance!"],
                color: "from-indigo-600 to-indigo-900",
                icon: "fa-puzzle-piece"
              };
            }

            return <GameBriefing {...briefingData} onStart={() => setGameStarted(true)} onExit={exitGame} />;
          }

          // SHOW ACTUAL GAME
          if (activeGame === 'snake') return <SnakeGame onExit={exitGame} />;
          if (activeGame === 'binary') return <BinaryGame onExit={exitGame} />;
          if (activeGame === 'bug') return <BugHunterGame onExit={exitGame} />;
          if (activeGame === 'memory') return <MemoryTypesGame onExit={exitGame} />;
          if (activeGame === 'logic') return <LogicPuzzleGame level={logicLevel} onExit={exitGame} />;
        }

        return (
          <div className="space-y-6 animate-fadeIn h-full">
            <h2 className="text-2xl font-bold text-white mb-6">Python Arcade: Campanha 50 Níveis</h2>
            
            {/* Main Interactive Games (Levels 1-4) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#0b1220] border border-white/5 rounded-xl p-6 hover:border-green-500/50 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 rounded-bl-xl border-l border-b border-white/5 bg-black/30 backdrop-blur-sm text-green-400 font-bold text-xs">Nível 1</div>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-green-500/10 text-green-400 border border-green-500/30 flex items-center justify-center text-2xl shadow-lg">
                    <i className="fas fa-staff-snake"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-green-400 transition-colors">Snake Logic</h3>
                    <div className="inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-2 bg-green-500/10 text-green-400">Listas & Arrays</div>
                  </div>
                </div>
                <button onClick={() => selectGame('snake')} className="w-full mt-6 bg-white/5 hover:bg-green-600 hover:text-white text-white text-sm font-bold py-3 rounded-lg transition-all border border-white/5">Jogar</button>
              </div>

              <div className="bg-[#0b1220] border border-white/5 rounded-xl p-6 hover:border-blue-500/50 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 rounded-bl-xl border-l border-b border-white/5 bg-black/30 backdrop-blur-sm text-blue-400 font-bold text-xs">Nível 2</div>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center text-2xl shadow-lg">
                    <i className="fas fa-microchip"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Binary Blitz</h3>
                    <div className="inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-2 bg-blue-500/10 text-blue-400">Sistema Binário</div>
                  </div>
                </div>
                <button onClick={() => selectGame('binary')} className="w-full mt-6 bg-white/5 hover:bg-blue-600 hover:text-white text-white text-sm font-bold py-3 rounded-lg transition-all border border-white/5">Jogar</button>
              </div>

              <div className="bg-[#0b1220] border border-white/5 rounded-xl p-6 hover:border-red-500/50 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 rounded-bl-xl border-l border-b border-white/5 bg-black/30 backdrop-blur-sm text-red-400 font-bold text-xs">Nível 3</div>
                <div className="flex items-start gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center text-2xl shadow-lg">
                     <i className="fas fa-bug"></i>
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-white mb-1 group-hover:text-red-400 transition-colors">Bug Hunter</h3>
                     <div className="inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-2 bg-red-500/10 text-red-400">Debugging</div>
                   </div>
                </div>
                <button onClick={() => selectGame('bug')} className="w-full mt-6 bg-white/5 hover:bg-red-600 hover:text-white text-white text-sm font-bold py-3 rounded-lg transition-all border border-white/5">Jogar</button>
              </div>

              <div className="bg-[#0b1220] border border-white/5 rounded-xl p-6 hover:border-purple-500/50 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 rounded-bl-xl border-l border-b border-white/5 bg-black/30 backdrop-blur-sm text-purple-400 font-bold text-xs">Nível 4</div>
                <div className="flex items-start gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center text-2xl shadow-lg">
                     <i className="fas fa-brain"></i>
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">Memory Types</h3>
                     <div className="inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-2 bg-purple-500/10 text-purple-400">Tipos de Dados</div>
                   </div>
                </div>
                <button onClick={() => selectGame('memory')} className="w-full mt-6 bg-white/5 hover:bg-purple-600 hover:text-white text-white text-sm font-bold py-3 rounded-lg transition-all border border-white/5">Jogar</button>
              </div>
            </div>

            {/* AI Generated Levels (5-50) */}
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <i className="fas fa-robot text-primary"></i> Desafios Gerados por IA (Níveis 5-50)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 46 }).map((_, i) => {
                const level = i + 5;
                return (
                  <button 
                    key={level}
                    onClick={() => selectGame('logic', level)}
                    className="aspect-square bg-[#151b26] border border-white/5 rounded-xl hover:border-primary/50 hover:bg-[#1a202c] transition-all flex flex-col items-center justify-center group"
                  >
                    <span className="text-xs text-muted font-bold group-hover:text-primary mb-1">LVL {level}</span>
                    <i className="fas fa-lock-open text-white/20 group-hover:text-white"></i>
                  </button>
                )
              })}
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="flex flex-col h-full animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">Quiz de Conhecimento</h2>
            
            <AssistantOverlay onAskHelp={requestQuizHint} isLoading={isAskingQuiz} hint={quizHint} onCloseHint={() => setQuizHint(null)} />

            {showScore ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-teal-600 rounded-full flex items-center justify-center text-4xl text-white shadow-2xl mb-6 animate-bounce">
                  <i className="fas fa-trophy"></i>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Quiz Completado!</h3>
                <p className="text-muted mb-8">Você acertou <span className="text-primary font-bold text-xl">{score}</span> de <span className="text-white font-bold text-xl">{questions.length}</span> questões.</p>
                <div className="flex gap-4">
                   <button 
                    onClick={resetQuiz}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                   >
                    Refazer
                   </button>
                   <button 
                    onClick={async () => {
                      resetQuiz();
                      await generateMoreQuiz();
                    }}
                    disabled={isGeneratingQuestions}
                    className="px-8 py-3 bg-primary hover:bg-teal-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-teal-500/20"
                   >
                    {isGeneratingQuestions ? <i className="fas fa-spinner fa-spin"></i> : "Próximo Nível (IA)"}
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                {/* Progress Bar */}
                <div className="w-full bg-white/10 h-2 rounded-full mb-8 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-500"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>

                {/* Question Card */}
                <div className="bg-[#0f1720] border border-white/10 rounded-2xl p-8 shadow-xl flex-1 flex flex-col">
                  <div className="mb-6">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Questão {currentQuestionIndex + 1} / {questions.length}</span>
                    <h3 className="text-xl md:text-2xl font-bold text-white mt-2 leading-relaxed">
                      {questions[currentQuestionIndex].question.includes('`') ? 
                        questions[currentQuestionIndex].question.split('`').map((part, i) => i % 2 === 1 ? <code key={i} className="bg-black/30 px-1 py-0.5 rounded text-primary font-mono text-sm">{part}</code> : part) 
                        : questions[currentQuestionIndex].question
                      }
                    </h3>
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    {questions[currentQuestionIndex].options.map((option, index) => {
                      let btnClass = "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300";
                      
                      if (isAnswered) {
                        if (index === questions[currentQuestionIndex].correct) {
                          btnClass = "bg-green-500/20 border-green-500/50 text-green-400";
                        } else if (index === selectedAnswer) {
                          btnClass = "bg-red-500/20 border-red-500/50 text-red-400";
                        } else {
                          btnClass = "opacity-50 border-transparent";
                        }
                      } else if (selectedAnswer === index) {
                         btnClass = "bg-primary/20 border-primary text-white";
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerClick(index)}
                          disabled={isAnswered}
                          className={`w-full text-left p-4 rounded-xl border transition-all font-medium flex justify-between items-center ${btnClass}`}
                        >
                          {option}
                          {isAnswered && index === questions[currentQuestionIndex].correct && <i className="fas fa-check"></i>}
                          {isAnswered && index === selectedAnswer && index !== questions[currentQuestionIndex].correct && <i className="fas fa-times"></i>}
                        </button>
                      );
                    })}
                  </div>

                  {/* ERROR ROBOT DETECTION SECTION */}
                  {isAnswered && selectedAnswer !== questions[currentQuestionIndex].correct && (
                    <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-xl mb-6 animate-fadeIn relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5">
                         <i className="fas fa-robot text-8xl text-red-500"></i>
                       </div>
                       
                       <div className="flex items-start gap-4 relative z-10">
                         <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 text-2xl animate-bounce">
                           <i className="fas fa-robot"></i>
                         </div>
                         <div className="flex-1">
                           <h4 className="text-red-400 font-bold mb-2">Erro Detectado!</h4>
                           
                           {aiExplanation ? (
                             <div className="text-sm text-gray-200 leading-relaxed bg-black/30 p-3 rounded-lg border border-red-500/10 animate-fadeIn">
                               <div className="mb-2 whitespace-pre-line">{aiExplanation.replace(/\*\*/g, '')}</div>
                             </div>
                           ) : (
                             <div className="text-sm text-gray-300 mb-3">
                               {questions[currentQuestionIndex].explanation}
                             </div>
                           )}

                           {!aiExplanation && !isExplaining && (
                             <button 
                               onClick={requestAiExplanation}
                               className="mt-2 text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                             >
                               <i className="fas fa-brain"></i> Robô, me explique melhor
                             </button>
                           )}

                           {isExplaining && (
                             <div className="flex items-center gap-2 text-xs text-red-300 mt-2">
                               <i className="fas fa-circle-notch fa-spin"></i> Gerando explicação detalhada...
                             </div>
                           )}
                         </div>
                       </div>
                    </div>
                  )}

                  {/* CORRECT ANSWER SECTION */}
                  {isAnswered && selectedAnswer === questions[currentQuestionIndex].correct && (
                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl mb-6 animate-fadeIn flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                         <i className="fas fa-check"></i>
                       </div>
                       <div>
                         <h4 className="text-green-400 font-bold text-sm">Resposta Correta!</h4>
                         <p className="text-xs text-gray-300">{questions[currentQuestionIndex].explanation}</p>
                       </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                    <button 
                      onClick={generateMoreQuiz} 
                      disabled={isGeneratingQuestions}
                      className="text-primary text-xs font-bold hover:underline flex items-center gap-2"
                    >
                      {isGeneratingQuestions ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-plus"></i> Gerar +5 Questões (IA)</>}
                    </button>

                    <button
                      onClick={handleNextQuestion}
                      disabled={!isAnswered}
                      className="px-6 py-3 bg-primary hover:bg-teal-400 disabled:bg-white/5 disabled:text-gray-600 text-slate-900 font-bold rounded-xl transition-all"
                    >
                      {currentQuestionIndex === questions.length - 1 ? 'Ver Resultado' : 'Próxima'} <i className="fas fa-arrow-right ml-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-[#0b1220] border border-white/10 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col md:flex-row shadow-2xl relative overflow-hidden">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-white/10 text-muted hover:text-white rounded-lg transition-colors md:hidden"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-[#081018] border-b md:border-b-0 md:border-r border-white/10 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
          <div className="hidden md:flex items-center gap-3 px-4 py-6 mb-4 border-b border-white/5">
             <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
               <i className="fas fa-user-graduate"></i>
             </div>
             <div>
               <h3 className="font-bold text-white text-sm">Área do Aluno</h3>
               <p className="text-[10px] text-muted">Bem-vindo(a)</p>
             </div>
          </div>
          
          {[
            { id: 'trilha', label: 'Trilha', icon: 'fa-map-signs' },
            { id: 'biblioteca', label: 'Biblioteca', icon: 'fa-book-open' },
            { id: 'arcade', label: 'Arcade (50+ Jogos)', icon: 'fa-gamepad' },
            { id: 'quiz', label: 'Quiz Infinito', icon: 'fa-question-circle' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setActiveGame(null); // Reset game if changing main tabs
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap md:whitespace-normal ${
                activeTab === tab.id 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-muted hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <i className={`fas ${tab.icon} w-5 text-center`}></i>
              {tab.label}
            </button>
          ))}
          
          <div className="hidden md:block mt-auto pt-4 border-t border-white/5">
             <button 
               onClick={onClose} 
               className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted hover:text-white hover:bg-red-500/10 hover:text-red-400 transition-colors"
             >
               <i className="fas fa-sign-out-alt w-5 text-center"></i>
               Fechar
             </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative">
           {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default EmentaModal;
