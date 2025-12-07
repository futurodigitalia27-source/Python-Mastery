import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { explainQuizConcept } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

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

// --- ROBOT TUTOR COMPONENT ---
const RobotTutor: React.FC<{ title: string; desc: string; concepts: string }> = ({ title, desc, concepts }) => (
  <div className="bg-gradient-to-r from-blue-900/40 to-[#0b1220] p-4 rounded-xl border border-blue-500/30 flex gap-4 items-start mb-6 relative overflow-hidden shadow-lg animate-fadeIn">
    <div className="absolute -right-4 -top-4 text-[80px] text-blue-500/10 rotate-12">
      <i className="fas fa-robot"></i>
    </div>
    <div className="min-w-[50px] h-[50px] bg-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
      <i className="fas fa-robot text-2xl text-blue-400"></i>
    </div>
    <div className="relative z-10">
      <h4 className="text-blue-300 font-bold mb-1 flex items-center gap-2">
        Tutor IA <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded text-blue-200 uppercase">{title}</span>
      </h4>
      <p className="text-sm text-gray-300 mb-2 leading-relaxed">{desc}</p>
      <div className="text-xs text-blue-400 font-mono bg-blue-900/30 px-3 py-1.5 rounded-lg inline-flex items-center gap-2 border border-blue-500/20">
        <i className="fas fa-code"></i> Conceitos: {concepts}
      </div>
    </div>
  </div>
);

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
      <RobotTutor 
        title="Calculadora IMC" 
        desc="Olá! Neste exercício vamos usar inputs numéricos e operadores matemáticos para calcular o Índice de Massa Corporal. Preencha os dados abaixo."
        concepts="float(), input(), operadores (/ *)"
      />
      <div className="grid grid-cols-2 gap-4">
        <input type="number" placeholder="Peso (kg)" value={weight} onChange={e => setWeight(e.target.value)} className="bg-white/5 p-3 rounded-lg border border-white/10 w-full text-white" />
        <input type="number" placeholder="Altura (m)" value={height} onChange={e => setHeight(e.target.value)} className="bg-white/5 p-3 rounded-lg border border-white/10 w-full text-white" />
      </div>
      <button onClick={calculate} className="w-full bg-primary text-black font-bold py-2 rounded-lg hover:bg-teal-400 transition-colors">Calcular</button>
      {result && <div className="p-4 bg-white/10 rounded-lg text-center font-bold text-lg animate-fadeIn text-white">{result}</div>}
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
      <RobotTutor 
        title="Adivinhação" 
        desc="Vou escolher um número aleatório. Use a lógica binária (maior/menor) para encontrar a resposta no menor número de tentativas!"
        concepts="random, if/elif/else, loops"
      />
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
          className="flex-1 bg-white/5 p-3 rounded-lg border border-white/10 text-white" 
        />
        <button onClick={handleGuess} className="bg-primary text-black font-bold px-6 rounded-lg hover:bg-teal-400 transition-colors">Chutar</button>
      </div>
      <div className="h-32 overflow-y-auto bg-black/20 p-2 rounded-lg custom-scrollbar">
        <div className="text-xs text-muted mb-2">Histórico:</div>
        {history.map((h, i) => (
          <div key={i} className="text-xs text-gray-300 border-b border-white/5 py-1">{h}</div>
        ))}
      </div>
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
      <RobotTutor 
        title="To-Do List" 
        desc="Vamos gerenciar uma lista de tarefas. Aprenda a adicionar (append) e remover (pop/remove) itens de uma estrutura de dados."
        concepts="listas, métodos, índices"
      />
      <div className="flex gap-2">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Nova tarefa..." 
          className="flex-1 bg-white/5 p-3 rounded-lg border border-white/10 text-white" 
        />
        <button onClick={add} className="bg-green-600 text-white font-bold px-4 rounded-lg hover:bg-green-500 transition-colors"><i className="fas fa-plus"></i></button>
      </div>
      <ul className="space-y-2">
        {tasks.map((t, i) => (
          <li key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
            <span className="text-white">{t}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300"><i className="fas fa-trash"></i></button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const GameConverter = () => {
  const [val, setVal] = useState('');
  const [curr, setCurr] = useState('USD');
  const rates: any = { USD: 5.0, EUR: 5.4, BTC: 350000 };

  return (
    <div className="space-y-4">
      <RobotTutor 
        title="Conversor Financeiro" 
        desc="Use dicionários para mapear moedas e seus valores. Uma simulação real de como sistemas financeiros processam câmbio."
        concepts="dicionários {k:v}, chaves"
      />
      <div className="grid grid-cols-2 gap-4">
        <input type="number" placeholder="Valor em R$" value={val} onChange={e => setVal(e.target.value)} className="bg-white/5 p-3 rounded-lg border border-white/10 w-full text-white" />
        <select value={curr} onChange={e => setCurr(e.target.value)} className="bg-white/5 p-3 rounded-lg border border-white/10 w-full text-white">
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
      <RobotTutor 
        title="Banco Simulado" 
        desc="Programação Orientada a Objetos na prática. A classe ContaBancaria encapsula o saldo e protege contra saques inválidos."
        concepts="Classes, Métodos, Encapsulamento"
      />
      <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl border border-white/5">
        <span className="text-sm text-gray-300">Saldo Disponível</span>
        <span className="text-2xl font-bold text-green-400">R$ {balance.toFixed(2)}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => action('deposit')} className="bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-500/50 py-3 rounded-lg font-bold transition-colors">Depositar</button>
        <button onClick={() => action('withdraw')} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/50 py-3 rounded-lg font-bold transition-colors">Sacar</button>
      </div>
      <div className="bg-black/30 p-3 rounded-lg h-32 overflow-y-auto font-mono text-xs custom-scrollbar">
        {log.map((l, i) => <div key={i} className="mb-1 text-gray-300">{l}</div>)}
      </div>
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
       <RobotTutor 
        title="Bot de Automação" 
        desc="Simule um script que varre pastas, lê arquivos Excel e gera relatórios. É assim que Python economiza horas de trabalho manual."
        concepts="bibliotecas (pandas, os), automação"
      />
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold uppercase text-muted">Status: <span className="text-primary">{status}</span></span>
        <span className="text-xs text-white">{progress}%</span>
      </div>
      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
        <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>
      <button onClick={startBot} disabled={progress > 0 && progress < 100} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors">
        <i className="fas fa-robot mr-2"></i> Executar Robô
      </button>
      <div className="bg-[#0f1720] p-3 rounded-lg h-32 overflow-y-auto font-mono text-xs border border-white/10 custom-scrollbar">
        {logs.map((l, i) => <div key={i} className="text-green-400 mb-1">{`>`} {l}</div>)}
      </div>
    </div>
  );
};

// --- QUIZ COMPONENT ---
const QuizSection = () => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [robotMessage, setRobotMessage] = useState("Olá! Sou o QuizBot. Selecione uma resposta que eu te digo se está certa!");
  const [isExplaining, setIsExplaining] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { language } = useLanguage();

  const questions = [
    { q: "Qual o tipo de dado de: '10'?", options: ["int", "str", "float", "bool"], a: 1 },
    { q: "Como imprimir no console?", options: ["console.log()", "echo", "print()", "sys.out"], a: 2 },
    { q: "Qual símbolo inicia um comentário?", options: ["//", "#", "<!--", "/*"], a: 1 },
    { q: "Lista é mutável?", options: ["Sim", "Não", "Depende", "Apenas números"], a: 0 },
    { q: "Qual biblioteca é usada para análise de dados?", options: ["Flask", "Pandas", "PyGame", "Django"], a: 1 },
    { q: "Qual o resultado de 3 ** 2?", options: ["6", "9", "5", "1.5"], a: 1 },
    { q: "Como adicionar um item ao final de uma lista?", options: [".push()", ".add()", ".append()", ".insert()"], a: 2 },
    { q: "Qual palavra-chave define uma função?", options: ["func", "def", "function", "lambda"], a: 1 },
    { q: "Tuplas são imutáveis?", options: ["Sim", "Não", "Às vezes", "Apenas vazias"], a: 0 },
    { q: "Qual operador representa 'diferente'?", options: ["<>", "!=", "==", "!=="], a: 1 },
    { q: "Como obter o tamanho de uma lista?", options: ["size()", "count()", "len()", "length"], a: 2 },
    { q: "Qual o tipo de dado de True?", options: ["str", "int", "bool", "float"], a: 2 },
    { q: "Qual o resultado de 10 // 3?", options: ["3.33", "3", "4", "3.0"], a: 1 },
    { q: "Como importar um módulo?", options: ["include", "require", "import", "using"], a: 2 },
    { q: "Qual estrutura usa chave-valor?", options: ["Lista", "Tupla", "Dicionário", "Set"], a: 2 },
    { q: "Como converter string '5' para inteiro?", options: ["int('5')", "str(5)", "float('5')", "parse('5')"], a: 0 },
    { q: "Qual índice acessa o primeiro elemento de uma lista?", options: ["1", "0", "-1", "first"], a: 1 },
    { q: "O que range(3) gera (conceitualmente)?", options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "1, 2"], a: 1 },
    { q: "Qual operador lógico retorna True apenas se ambos forem True?", options: ["or", "not", "and", "xor"], a: 2 },
    { q: "Como capturar exceções em Python?", options: ["try/catch", "try/except", "do/catch", "check/error"], a: 1 },
  ];

  const handleAnswer = (idx: number) => {
    setSelectedOption(idx);
    const correct = idx === questions[current].a;
    
    if (correct) {
      setScore(score + 1);
      setRobotMessage("✅ Exato! Você acertou. Vamos para a próxima!");
      setTimeout(() => {
        const next = current + 1;
        if (next < questions.length) {
          setCurrent(next);
          setSelectedOption(null);
          setRobotMessage("Próxima pergunta: " + questions[next].q);
        } else {
          setShowScore(true);
        }
      }, 1500);
    } else {
      setRobotMessage("❌ Ops! Essa não é a resposta correta. Tente pedir uma dica!");
    }
  };

  const handleHint = async () => {
    setIsExplaining(true);
    setRobotMessage("🤔 Deixe-me analisar a questão para te dar uma dica...");
    const hint = await explainQuizConcept(questions[current].q, questions[current].options, language);
    setRobotMessage("💡 Dica do Robô: " + hint);
    setIsExplaining(false);
  };

  const reset = () => {
    setCurrent(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
    setRobotMessage("Olá! Sou o QuizBot. Selecione uma resposta que eu te digo se está certa!");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 w-full">
      {showScore ? (
        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 animate-fadeIn text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold text-white mb-2">Quiz Finalizado!</h3>
          <p className="text-lg text-muted mb-6">Você acertou <span className="text-primary font-bold">{score}</span> de {questions.length} questões.</p>
          <button onClick={reset} className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-teal-400">Tentar Novamente</button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
          
          {/* Left: Robot & Feedback */}
          <div className="md:w-1/3 flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
               <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/50 mb-3 relative z-10">
                 <i className={`fas fa-robot text-4xl text-blue-400 ${isExplaining ? 'animate-bounce' : ''}`}></i>
               </div>
               
               {/* Speech Bubble */}
               <div className="relative bg-white/10 p-4 rounded-xl text-sm text-gray-200 border border-white/5 w-full">
                 <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/10 border-t border-l border-white/5 rotate-45 transform"></div>
                 {robotMessage}
               </div>

               <button 
                 onClick={handleHint}
                 disabled={isExplaining}
                 className="mt-4 w-full py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
               >
                 {isExplaining ? <i className="fas fa-spinner fa-spin"></i> : <i className="far fa-lightbulb"></i>} Pedir Dica
               </button>
            </div>
            
            <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex justify-between items-center">
               <span className="text-xs text-muted uppercase">Progresso</span>
               <span className="text-lg font-bold text-white">{current + 1} <span className="text-muted text-sm">/ {questions.length}</span></span>
            </div>
          </div>

          {/* Right: Question */}
          <div className="flex-1 bg-white/5 p-6 rounded-2xl border border-white/10 animate-fadeIn flex flex-col justify-center">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-8">{questions[current].q}</h3>
            <div className="grid grid-cols-1 gap-3">
              {questions[current].options.map((opt, i) => {
                 let btnClass = "bg-black/20 hover:bg-white/10 border-white/5 text-gray-300";
                 if (selectedOption !== null) {
                    if (i === questions[current].a) {
                        btnClass = "bg-green-500/20 border-green-500/50 text-green-400"; // Show correct
                    } else if (i === selectedOption) {
                        btnClass = "bg-red-500/20 border-red-500/50 text-red-400"; // Show wrong selection
                    } else {
                        btnClass = "opacity-50 border-white/5"; // Dim others
                    }
                 }

                 return (
                  <button 
                    key={i} 
                    onClick={() => handleAnswer(i)}
                    disabled={selectedOption !== null && selectedOption !== i && i !== questions[current].a}
                    className={`w-full p-4 rounded-xl border transition-all text-left font-medium text-lg flex justify-between items-center ${btnClass}`}
                  >
                    {opt}
                    {selectedOption !== null && i === questions[current].a && <i className="fas fa-check"></i>}
                    {selectedOption !== null && i === selectedOption && i !== questions[current].a && <i className="fas fa-times"></i>}
                  </button>
                 );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

// --- LIBRARY COMPONENT ---
const LibrarySection = () => {
  const downloadPDF = (title: string, content: string) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(20, 184, 166);
    doc.text(title, 20, 30);
    doc.setFontSize(12);
    doc.setTextColor(0);
    const splitText = doc.splitTextToSize(content, 170);
    doc.text(splitText, 20, 50);
    doc.save(`${title.replace(/ /g, "_")}.pdf`);
  };

  const items = [
    { 
      title: "100 Exercícios Python", 
      icon: "fa-dumbbell", 
      desc: "Lista curada do básico ao avançado para treinar lógica.",
      content: "100 Exercícios de Python\n\n1. Hello World\n2. Soma de dois números\n3. Média de notas\n4. Conversor de medidas\n5. Tabuada...\n(Conteúdo completo no curso)"
    },
    { 
      title: "Guia Rápido Pandas", 
      icon: "fa-table", 
      desc: "Cheat sheet com os principais comandos de análise de dados.",
      content: "Guia Pandas\n\nimport pandas as pd\n\n- pd.read_csv('file.csv')\n- df.head()\n- df.describe()\n- df.groupby('col').mean()\n..."
    },
    { 
      title: "Manual Instalação Thonny", 
      icon: "fa-laptop-code", 
      desc: "Passo a passo para configurar seu ambiente de desenvolvimento.",
      content: "Instalação Thonny IDE\n\n1. Acesse thonny.org\n2. Baixe a versão para seu OS\n3. Execute o instalador\n4. Abra e comece a codar!"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {items.map((item, i) => (
        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-primary/40 transition-all group">
          <div className="w-12 h-12 bg-black/30 rounded-xl flex items-center justify-center text-primary text-2xl mb-4 group-hover:scale-110 transition-transform">
            <i className={`fas ${item.icon}`}></i>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
          <p className="text-sm text-muted mb-6">{item.desc}</p>
          <button 
            onClick={() => downloadPDF(item.title, item.content)}
            className="text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <i className="fas fa-download"></i> Baixar PDF
          </button>
        </div>
      ))}
    </div>
  );
};

// --- MAIN COMPONENT ---

const EmentaModal: React.FC<EmentaModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'trilha' | 'arcade' | 'biblioteca' | 'quiz'>('trilha');
  const [activeProject, setActiveProject] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('trilha');
      setActiveProject(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (activeProject !== null) {
      return (
        <div className="animate-fadeIn max-w-2xl mx-auto py-4">
          <div className="bg-[#131b29] border border-white/5 rounded-2xl p-8 shadow-2xl relative">
            <button 
              onClick={() => setActiveProject(null)} 
              className="absolute top-4 right-4 text-muted hover:text-white"
            >
              <i className="fas fa-times"></i>
            </button>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
               <i className="fas fa-gamepad text-secondary"></i> Arcade: Módulo {activeProject}
            </h3>
            <div className="bg-black/20 rounded-xl p-6 border border-white/5 mb-6">
              {activeProject === 1 && <GameBMI />}
              {activeProject === 2 && <GameGuessing />}
              {activeProject === 3 && <GameTodoList />}
              {activeProject === 4 && <GameConverter />}
              {activeProject === 5 && <GameBank />}
              {activeProject === 6 && <GameBot />}
            </div>
            <button onClick={() => setActiveProject(null)} className="text-muted hover:text-white text-sm flex items-center gap-2">
              <i className="fas fa-arrow-left"></i> Voltar para Lista
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'trilha':
        return (
          <div className="grid grid-cols-1 gap-4 animate-fadeIn">
            {modules.map((mod) => (
              <div key={mod.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-black/30 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                  {mod.id}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg">{mod.title}</h4>
                  <p className="text-sm text-muted mt-1 mb-2">{mod.desc}</p>
                  <div className="flex gap-2 flex-wrap">
                    {mod.topics.slice(0, 2).map((t, i) => (
                       <span key={i} className="text-[10px] bg-black/20 px-2 py-1 rounded text-gray-400">{t}</span>
                    ))}
                    <span className="text-[10px] bg-black/20 px-2 py-1 rounded text-gray-400">+ mais</span>
                  </div>
                </div>
                <div className="flex items-center">
                   <button onClick={() => setActiveProject(mod.id)} className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-bold hover:bg-primary hover:text-black transition-all">
                      Ver Projeto
                   </button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'arcade':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-fadeIn p-4">
             {modules.map(mod => (
               <button 
                key={mod.id} 
                onClick={() => setActiveProject(mod.id)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center gap-4 group transition-all"
               >
                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform">
                    <i className="fas fa-gamepad"></i>
                 </div>
                 <div className="text-center">
                   <div className="font-bold text-white">{mod.project}</div>
                   <div className="text-xs text-muted mt-1">{mod.level}</div>
                 </div>
               </button>
             ))}
          </div>
        );
      case 'biblioteca':
        return <LibrarySection />;
      case 'quiz':
        return <QuizSection />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn p-4">
      <div className="bg-[#0b1220] border border-white/10 rounded-3xl w-full max-w-5xl h-[90vh] flex shadow-2xl relative overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-20 md:w-64 bg-[#081018] border-r border-white/5 flex flex-col">
          <div className="p-6 border-b border-white/5 hidden md:block">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <i className="fas fa-user-graduate text-primary"></i> Área do Aluno
            </h2>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
             <button 
               onClick={() => { setActiveTab('trilha'); setActiveProject(null); }}
               className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'trilha' ? 'bg-primary text-black font-bold' : 'text-muted hover:bg-white/5 hover:text-white'}`}
             >
               <i className="fas fa-road w-6 text-center"></i> <span className="hidden md:block">Trilha</span>
             </button>
             <button 
               onClick={() => { setActiveTab('arcade'); setActiveProject(null); }}
               className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'arcade' ? 'bg-primary text-black font-bold' : 'text-muted hover:bg-white/5 hover:text-white'}`}
             >
               <i className="fas fa-gamepad w-6 text-center"></i> <span className="hidden md:block">Arcade</span>
             </button>
             <button 
               onClick={() => { setActiveTab('biblioteca'); setActiveProject(null); }}
               className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'biblioteca' ? 'bg-primary text-black font-bold' : 'text-muted hover:bg-white/5 hover:text-white'}`}
             >
               <i className="fas fa-book w-6 text-center"></i> <span className="hidden md:block">Biblioteca</span>
             </button>
             <button 
               onClick={() => { setActiveTab('quiz'); setActiveProject(null); }}
               className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'quiz' ? 'bg-primary text-black font-bold' : 'text-muted hover:bg-white/5 hover:text-white'}`}
             >
               <i className="fas fa-question-circle w-6 text-center"></i> <span className="hidden md:block">Quiz</span>
             </button>
          </nav>

          <div className="p-4 border-t border-white/5">
            <button onClick={onClose} className="w-full p-3 rounded-xl border border-white/10 hover:bg-white/5 text-muted hover:text-white flex items-center justify-center gap-2 transition-colors">
              <i className="fas fa-sign-out-alt"></i> <span className="hidden md:block">Sair</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
           {/* Mobile Header */}
           <div className="md:hidden p-4 border-b border-white/5 flex justify-between items-center bg-[#081018]">
              <span className="font-bold text-white">Área do Aluno</span>
              <button onClick={onClose}><i className="fas fa-times text-white"></i></button>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f1720]">
             {renderContent()}
           </div>
        </div>

      </div>
    </div>
  );
};


export default EmentaModal;