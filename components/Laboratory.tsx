import React, { useState, useEffect, useRef } from 'react';
import { Exercise } from '../types';
import { analyzeCodeError } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const exercises: Exercise[] = [
  {
    id: 1,
    title: "1. Hello World",
    description: "Sua jornada começa aqui! Imprima a frase clássica 'Hello, World!'.",
    template: "# Use a função print()\n",
    check: (out) => out.toLowerCase().includes("hello, world") || out.toLowerCase().includes("hello world"),
    solution: 'print("Hello, World!")'
  },
  {
    id: 2,
    title: "2. Variáveis",
    description: "Crie uma variável chamada 'nome' com seu nome e imprima.",
    template: "# Defina a variável 'nome' e imprima\n",
    check: (out) => out.length > 0 && !out.toLowerCase().includes("error"),
    solution: 'nome = "Dev"\nprint(nome)'
  },
  {
    id: 3,
    title: "3. Soma Simples",
    description: "Crie duas variáveis 'a' e 'b' com valores 10 e 20, e imprima a soma.",
    template: "a = 10\nb = 20\n# Imprima a soma\n",
    check: (out) => out.includes("30"),
    solution: 'print(a + b)'
  },
  {
    id: 4,
    title: "4. Par ou Ímpar",
    description: "Verifique se o número 7 é par ou ímpar usando if/else. Imprima 'Par' ou 'Ímpar'.",
    template: "numero = 7\n# Escreva sua lógica if/else aqui\n",
    check: (out) => out.toLowerCase().includes("ímpar") || out.toLowerCase().includes("impar"),
    solution: 'if numero % 2 == 0:\n    print("Par")\nelse:\n    print("Ímpar")'
  },
  {
    id: 5,
    title: "5. Lista de Frutas",
    description: "Crie uma lista com 3 frutas e imprima a segunda fruta da lista.",
    template: "frutas = ['Maçã', 'Banana', 'Uva']\n# Imprima a segunda fruta (índice 1)\n",
    check: (out) => out.toLowerCase().includes("banana"),
    solution: 'print(frutas[1])'
  },
  {
    id: 6,
    title: "6. Loop For",
    description: "Use um loop 'for' para imprimir os números de 0 a 4.",
    template: "# Use range(5)\n",
    check: (out) => out.includes("0") && out.includes("4"),
    solution: 'for i in range(5):\n    print(i)'
  },
  {
    id: 7,
    title: "7. Loop While",
    description: "Crie um contador que começa em 0 e vai até 3 usando 'while'.",
    template: "contador = 0\nwhile contador <= 3:\n    print(contador)\n    # Não esqueça de incrementar!\n",
    check: (out) => out.includes("0") && out.includes("3"),
    solution: 'while contador <= 3:\n    print(contador)\n    contador += 1'
  },
  {
    id: 8,
    title: "8. Funções",
    description: "Defina uma função 'saudacao' que recebe um nome e retorna 'Olá, [nome]'.",
    template: "def saudacao(nome):\n    # retorne a string formatada\n    pass\n\nprint(saudacao('Fole'))",
    check: (out) => out.includes("Olá, Fole") || out.includes("Ola, Fole"),
    solution: 'def saudacao(nome):\n    return f"Olá, {nome}"'
  },
  {
    id: 9,
    title: "9. Dicionários",
    description: "Crie um dicionário 'pessoa' com chaves 'nome' e 'idade'. Imprima a idade.",
    template: "pessoa = {'nome': 'Ana', 'idade': 25}\n# Imprima o valor da chave 'idade'\n",
    check: (out) => out.includes("25"),
    solution: 'print(pessoa["idade"])'
  },
  {
    id: 10,
    title: "10. Tabuada",
    description: "Imprima a tabuada do 5 (de 5x1 até 5x10).",
    template: "numero = 5\nfor i in range(1, 11):\n    # Imprima o resultado da multiplicação\n    pass",
    check: (out) => out.includes("5") && out.includes("50"),
    solution: 'for i in range(1, 11):\n    print(numero * i)'
  },
  {
    id: 11,
    title: "11. Fatorial (Recursão)",
    description: "Complete a função recursiva para calcular o fatorial de 5.",
    template: "def fatorial(n):\n    if n == 0:\n        return 1\n    # Chame fatorial novamente\n    return n * 1\n\nprint(fatorial(5))",
    check: (out) => out.includes("120"),
    solution: 'return n * fatorial(n-1)'
  },
  {
    id: 12,
    title: "12. Manipulação de String",
    description: "Converta a string 'python' para maiúsculas.",
    template: "texto = 'python'\n# Use o método upper()\n",
    check: (out) => out.includes("PYTHON"),
    solution: 'print(texto.upper())'
  },
  {
    id: 13,
    title: "13. Módulos",
    description: "Importe o módulo 'math' e imprima a raiz quadrada de 16.",
    template: "import math\n# Use math.sqrt\n",
    check: (out) => out.includes("4.0") || out.includes("4"),
    solution: 'print(math.sqrt(16))'
  },
  {
    id: 14,
    title: "14. List Comprehension",
    description: "Crie uma lista com os quadrados dos números de 0 a 4 em uma linha.",
    template: "quadrados = [x**2 for x in range(5)]\nprint(quadrados)",
    check: (out) => out.includes("[0, 1, 4, 9, 16]"),
    solution: 'quadrados = [x**2 for x in range(5)]'
  },
  {
    id: 15,
    title: "15. Try / Except",
    description: "Capture o erro de divisão por zero.",
    template: "try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print('Erro capturado')\n",
    check: (out) => out.toLowerCase().includes("erro capturado"),
    solution: 'print("Erro capturado")'
  },
  {
    id: 16,
    title: "16. Tuplas",
    description: "Tuplas são imutáveis. Tente acessar o primeiro elemento da tupla (1, 2, 3).",
    template: "t = (1, 2, 3)\n# Imprima o índice 0\n",
    check: (out) => out.includes("1"),
    solution: 'print(t[0])'
  },
  {
    id: 17,
    title: "17. Sets (Conjuntos)",
    description: "Remova duplicatas da lista [1, 2, 2, 3] convertendo para set.",
    template: "lista = [1, 2, 2, 3]\nunico = set(lista)\nprint(unico)",
    check: (out) => out.includes("{1, 2, 3}") || out.includes("1, 2, 3"),
    solution: 'print(set(lista))'
  },
  {
    id: 18,
    title: "18. Lambda",
    description: "Crie uma função lambda que dobra um número e use-a com 10.",
    template: "dobro = lambda x: x * 2\nprint(dobro(10))",
    check: (out) => out.includes("20"),
    solution: 'dobro = lambda x: x * 2'
  },
  {
    id: 19,
    title: "19. Palíndromo",
    description: "Verifique se 'ana' é palíndromo (igual de trás pra frente).",
    template: "s = 'ana'\nif s == s[::-1]:\n    print('Sim')\nelse:\n    print('Não')",
    check: (out) => out.includes("Sim"),
    solution: 'if s == s[::-1]:'
  },
  {
    id: 20,
    title: "20. Classes",
    description: "Crie uma classe Dog com método bark que imprime 'Woof!'.",
    template: "class Dog:\n    def bark(self):\n        print('Woof!')\n\nd = Dog()\nd.bark()",
    check: (out) => out.includes("Woof!"),
    solution: 'print("Woof!")'
  }
];

const Laboratory: React.FC = () => {
  const [activeExercise, setActiveExercise] = useState<Exercise>(exercises[0]);
  const [code, setCode] = useState(activeExercise.template);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    setCode(activeExercise.template);
    setOutput("");
    setStatus('idle');
    setAiFeedback(null);
  }, [activeExercise]);

  // Scroll to feedback when it appears
  useEffect(() => {
    if (aiFeedback && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiFeedback]);

  const runCode = async () => {
    setOutput("Executando...");
    setStatus('idle');
    setAiFeedback(null);
    
    // Simulação de execução Python no navegador
    setTimeout(async () => {
      try {
        let simulatedOutput = "";
        let hasError = false;

        // Mock simples para exercícios (Execução Simulada)
        // Note: For real Python execution in browser, one would use Pyodide.
        const lines = code.split('\n');
        
        // Simulação básica de outputs baseada em padrões de string para demonstração
        if (code.includes('print("Hello, World!")') || (code.includes('print') && code.toLowerCase().includes('hello world'))) {
          simulatedOutput = "Hello, World!\n";
        } else if (code.includes("10") && code.includes("20") && code.includes("+") && code.includes("print")) {
          simulatedOutput = "30\n";
        } else if (code.includes("% 2") && code.includes("if")) {
          simulatedOutput = "Ímpar\n";
        } else if (code.includes("frutas[1]")) {
          simulatedOutput = "Banana\n";
        } else if (code.includes("range(5)") && code.includes("for")) {
          simulatedOutput = "0\n1\n2\n3\n4\n";
        } else if (code.includes("while") && code.includes("contador")) {
          simulatedOutput = "0\n1\n2\n3\n";
        } else if (code.includes("def saudacao") && code.includes("print")) {
          simulatedOutput = "Olá, Fole\n";
        } else if (code.includes("['idade']") || code.includes('["idade"]')) {
          simulatedOutput = "25\n";
        } else if (code.includes("range(1, 11)") && code.includes("*")) {
           simulatedOutput = "5\n10\n15...50\n";
        } else if (code.includes("fatorial") && code.includes("120")) {
           simulatedOutput = "120\n";
        } else if (code.includes("upper()")) {
           simulatedOutput = "PYTHON\n";
        } else if (code.includes("sqrt")) {
           simulatedOutput = "4.0\n";
        } else if (code.includes("x**2")) {
           simulatedOutput = "[0, 1, 4, 9, 16]\n";
        } else if (code.includes("ZeroDivisionError")) {
           simulatedOutput = "Erro capturado\n";
        } else if (code.includes("t[0]")) {
           simulatedOutput = "1\n";
        } else if (code.includes("set(lista)")) {
           simulatedOutput = "{1, 2, 3}\n";
        } else if (code.includes("lambda")) {
           simulatedOutput = "20\n";
        } else if (code.includes("[::-1]")) {
           simulatedOutput = "Sim\n";
        } else if (code.includes("class Dog")) {
           simulatedOutput = "Woof!\n";
        } else {
          // Fallback generico ou simulação de erro se sintaxe parecer muito errada
          if (!code.includes("print")) {
             simulatedOutput = "Traceback (most recent call last):\n  File 'main.py', line 1\n    (Nenhuma saída detectada. Você esqueceu o print?)\n";
             hasError = true;
          } else if (code.includes("print ") && !code.includes("print(")) {
             // Erro comum python 3
             simulatedOutput = "SyntaxError: Missing parentheses in call to 'print'. Did you mean print(...)?\n";
             hasError = true;
          } else {
             // Tenta extrair o que está dentro do print
             const match = code.match(/print\((.*?)\)/);
             if (match) {
               simulatedOutput = match[1].replace(/['"]/g, '') + "\n";
             } else {
               simulatedOutput = "Erro de execução simulado.\n";
               hasError = true;
             }
          }
        }

        setOutput(simulatedOutput);

        if (!hasError && activeExercise.check && activeExercise.check(simulatedOutput)) {
          setStatus('success');
          setOutput(prev => prev + "\n" + t.lab.success_msg);
        } else {
          setStatus('error');
          // Disparar análise do Robô IA
          setIsAnalyzing(true);
          const feedback = await analyzeCodeError(code, simulatedOutput, activeExercise.title, language);
          setAiFeedback(feedback);
          setIsAnalyzing(false);
        }

      } catch (err: any) {
        setOutput(`Erro crítico: ${err}`);
        setStatus('error');
      }
    }, 600);
  };

  return (
    <section id="lab" className="snap-section flex flex-col items-center justify-center p-4 bg-[#0f1720]">
      <div className="w-full max-w-7xl h-[90vh] flex gap-4">
        
        {/* LEFT COLUMN: EXERCISES + AI ROBOT */}
        <div className="w-80 flex flex-col gap-4 hidden md:flex">
          
          {/* Top: Exercises List */}
          <div className="glass-panel rounded-2xl flex flex-col p-4 h-1/2 overflow-hidden border border-white/10">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2 sticky top-0">
              <i className="fas fa-list-ul text-primary"></i> {t.lab.exercises}
            </h3>
            <ul className="space-y-2 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-white/10">
              {exercises.map(ex => (
                <li key={ex.id}>
                  <button
                    onClick={() => setActiveExercise(ex)}
                    className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all ${
                      activeExercise.id === ex.id 
                        ? 'bg-primary text-slate-900 shadow-lg shadow-teal-500/20' 
                        : 'text-muted hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{ex.title}</span>
                      {activeExercise.id === ex.id && <i className="fas fa-chevron-right text-[10px]"></i>}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom: AI Error Robot */}
          <div className="glass-panel rounded-2xl flex flex-col p-0 h-1/2 border border-white/10 overflow-hidden relative">
            <div className="bg-gradient-to-r from-red-900/40 to-black/60 p-3 border-b border-white/10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 border border-red-500/30">
                 <i className="fas fa-robot"></i>
              </div>
              <div>
                <h3 className="text-white text-sm font-bold">{t.lab.debugger_title}</h3>
                <p className="text-[10px] text-red-300">{t.lab.debugger_sub}</p>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-black/20">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-full text-muted space-y-2">
                   <i className="fas fa-circle-notch fa-spin text-2xl text-primary"></i>
                   <span className="text-xs animate-pulse">{t.lab.analyzing}</span>
                </div>
              ) : aiFeedback ? (
                <div ref={feedbackRef} className="animate-fadeIn">
                   <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                     {aiFeedback.replace(/\*\*/g, '')}
                   </div>
                   <div className="mt-4 pt-4 border-t border-white/5 text-center">
                     <button onClick={() => setAiFeedback(null)} className="text-xs text-muted hover:text-white underline">
                       {t.lab.clear_analysis}
                     </button>
                   </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                  <i className="fas fa-bug text-3xl mb-2"></i>
                  <p className="text-xs max-w-[200px]">{t.lab.empty_state}</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* CENTER & RIGHT: EDITOR AREA */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="glass-panel p-4 rounded-2xl border-l-4 border-primary">
            <h2 className="text-xl font-bold text-white mb-1 flex items-center justify-between">
              {activeExercise.title}
              <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-muted font-normal">Python 3.10</span>
            </h2>
            <p className="text-muted text-sm">{activeExercise.description}</p>
          </div>

          <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
            {/* Code Input */}
            <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden border border-white/10 shadow-2xl">
              <div className="bg-[#0b1220] p-2 px-4 flex justify-between items-center border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <span className="text-xs font-mono text-muted absolute left-1/2 -translate-x-1/2">main.py</span>
                <button 
                  onClick={runCode} 
                  className="bg-green-600 hover:bg-green-500 text-white font-bold text-xs px-4 py-1.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-green-900/20"
                >
                  <i className="fas fa-play"></i> {t.lab.run}
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-[#0f1720] p-4 font-mono text-sm text-blue-300 focus:outline-none resize-none leading-6"
                spellCheck={false}
              />
            </div>

            {/* Output */}
            <div className="md:w-1/3 glass-panel rounded-2xl flex flex-col overflow-hidden border border-white/10 shadow-2xl">
              <div className="bg-[#0b1220] p-3 px-4 border-b border-white/5 flex justify-between items-center">
                <span className="text-xs font-mono text-muted uppercase tracking-wider">Terminal</span>
                <button onClick={() => setOutput("")} className="text-[10px] text-muted hover:text-white">
                  <i className="fas fa-ban"></i> {t.lab.clear_console}
                </button>
              </div>
              <pre className={`flex-1 p-4 font-mono text-xs overflow-auto whitespace-pre-wrap ${
                status === 'success' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-gray-300'
              }`}>
                {output || <span className="text-gray-600 italic">{t.lab.ready}</span>}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Laboratory;
