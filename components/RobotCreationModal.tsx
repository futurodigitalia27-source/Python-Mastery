
import React, { useState, useEffect } from 'react';

interface RobotCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const quizData = [
  {
    q: "Qual componente funciona como o 'cérebro' do robô?",
    options: ["Estrutura mecânica", "Microcontrolador", "Bateria"],
    correct: 1,
    explanation: "O microcontrolador (como Arduino) processa informações e controla todas as ações do robô."
  },
  {
    q: "Sensores servem para:",
    options: [
      "Deixar o robô mais pesado",
      "Enfeitar o robô",
      "Perceber o ambiente (luz, obstáculos, etc.)"
    ],
    correct: 2,
    explanation: "Sensores são os 'sentidos' do robô, permitindo que ele interaja com o ambiente."
  },
  {
    q: "O que faz um motor no robô?",
    options: ["Envia Wi‑Fi", "Gera movimento", "Armazena energia"],
    correct: 1,
    explanation: "Motores convertem energia elétrica em movimento físico, permitindo locomoção."
  },
  {
    q: "Qual é a primeira etapa na criação de um robô?",
    options: ["Comprar componentes", "Programar", "Planejar o objetivo"],
    correct: 2,
    explanation: "Planejar o objetivo é essencial para definir o que o robô fará antes de construir."
  },
  {
    q: "O que é um Arduino?",
    options: ["Um tipo de bateria", "Uma placa de microcontrolador", "Um sensor de luz"],
    correct: 1,
    explanation: "Arduino é uma plataforma de microcontrolador popular para prototipagem de robôs."
  }
];

const RobotCreationModal: React.FC<RobotCreationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('planejar');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState("Selecione uma resposta para ver o feedback.");
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null); // Index of selected answer
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [highlightedCard, setHighlightedCard] = useState<string | null>(null); // Info string as ID

  // Load random quiz on open
  useEffect(() => {
    if (isOpen) {
      loadRandomQuiz();
    }
  }, [isOpen]);

  const loadRandomQuiz = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * quizData.length);
    } while (newIndex === currentQuizIndex && quizData.length > 1);
    
    setCurrentQuizIndex(newIndex);
    setQuizFeedback("Selecione uma resposta para ver o feedback.");
    setQuizAnswered(null);
    setIsCorrect(null);
  };

  const handleQuizAnswer = (optionIndex: number) => {
    const quiz = quizData[currentQuizIndex];
    const correct = quiz.correct === optionIndex;
    
    setQuizAnswered(optionIndex);
    setIsCorrect(correct);
    
    if (correct) {
      setQuizFeedback(`✅ Correto! ${quiz.explanation}`);
    } else {
      setQuizFeedback(`❌ Não é essa. ${quiz.explanation}`);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2400);
  };

  const handleCardClick = (info: string) => {
    setHighlightedCard(info);
    triggerToast(info);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn p-4 overflow-y-auto">
      {/* Container simulating the specific styles provided */}
      <div className="relative w-full max-w-[480px] bg-[#111418] rounded-[18px] p-3 flex flex-col gap-2 shadow-2xl border border-white/10"
           style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
        
        {/* Close Button specific to Modal */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 z-50 w-8 h-8 bg-black/50 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Header */}
        <header className="flex items-center gap-3 p-2 bg-gradient-to-br from-[#0c1016] to-[#12171e] rounded-[18px] border border-[rgba(255,255,255,0.08)] shadow-lg">
          <div className="w-[34px] h-[34px] rounded-[14px] bg-[radial-gradient(circle_at_30%_20%,#ffe8b8,#f5a623_45%,#c06a00_100%)] flex items-center justify-center font-extrabold text-lg text-[#241300] shadow-[0_0_0_2px_rgba(0,0,0,0.4)]">
            R
          </div>
          <div>
            <h1 className="m-0 text-lg tracking-wide font-normal text-[#f4f4f4]">Criação de Robôs</h1>
            <p className="m-0 mt-[2px] text-[11px] text-[#9ba1aa]">Do conceito ao protótipo em três etapas.</p>
          </div>
        </header>

        <main className="flex-1 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-2 min-h-0">
          
          {/* Left Panel */}
          <section className="bg-[rgba(9,12,18,0.9)] rounded-[18px] border border-[rgba(255,255,255,0.08)] p-2 flex flex-col gap-[6px] shadow-lg">
            <nav className="flex gap-[6px] bg-[rgba(0,0,0,0.3)] p-[3px] rounded-full">
              {['planejar', 'montar', 'programar'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 border-none rounded-full py-[6px] text-[11px] cursor-pointer transition-all duration-200 capitalize ${
                    activeTab === tab 
                      ? 'bg-[radial-gradient(circle_at_top,#f9c35e,#f5a623_40%,#b16300_100%)] text-[#201000] font-semibold shadow-lg translate-y-[-0.5px]' 
                      : 'bg-transparent text-[#9ba1aa]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>

            <div className="flex-1 rounded-[14px] bg-gradient-to-br from-[#0f121a] to-[#0a0d13] p-2 relative overflow-hidden min-h-[200px]">
              
              {activeTab === 'planejar' && (
                <article className="animate-fadeIn">
                  <h2 className="m-0 mb-[6px] text-sm text-[#f4f4f4]">Defina o objetivo</h2>
                  <ul className="list-none m-0 p-0 grid grid-cols-1 gap-1">
                    {[
                      "Que problema o robô resolve?",
                      "Ambiente: mesa, chão, ar ou água?",
                      "O que ele precisa sentir (sensores)?",
                      "Como ele interage: rodas, braços, voz?",
                      "Quanto tempo disponível para o projeto?",
                      "Orçamento disponível para materiais?"
                    ].map((step, i) => (
                      <li key={i} className="flex items-center gap-[6px] text-[11px] text-[#9ba1aa] bg-[rgba(0,0,0,0.35)] rounded-full p-[6px_8px] border border-[rgba(255,255,255,0.04)]">
                        <span className="w-4 h-4 rounded-full bg-[rgba(245,166,35,0.12)] text-[#f5a623] text-[10px] flex items-center justify-center font-semibold">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </article>
              )}

              {activeTab === 'montar' && (
                <article className="animate-fadeIn">
                  <h2 className="m-0 mb-[6px] text-sm text-[#f4f4f4]">Escolha os componentes</h2>
                  <ul className="list-none m-0 p-0 grid grid-cols-1 gap-1">
                    {[
                      "Controlador: Arduino, ESP32, etc.",
                      "Atuação: motores DC, servos, rodas.",
                      "Estrutura: impressão 3D, MDF, LEGO.",
                      "Energia: pilhas, baterias Li‑ion.",
                      "Conectividade: Bluetooth, Wi-Fi.",
                      "Fixação: parafusos, cola, fitas."
                    ].map((step, i) => (
                      <li key={i} className="flex items-center gap-[6px] text-[11px] text-[#9ba1aa] bg-[rgba(0,0,0,0.35)] rounded-full p-[6px_8px] border border-[rgba(255,255,255,0.04)]">
                        <span className="w-4 h-4 rounded-full bg-[rgba(245,166,35,0.12)] text-[#f5a623] text-[10px] flex items-center justify-center font-semibold">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </article>
              )}

              {activeTab === 'programar' && (
                <article className="animate-fadeIn">
                  <h2 className="m-0 mb-[6px] text-sm text-[#f4f4f4]">Dê inteligência ao robô</h2>
                  <ul className="list-none m-0 p-0 grid grid-cols-1 gap-1">
                    {[
                      "Leia sensores com segurança.",
                      "Crie regras simples: se → então.",
                      "Teste em ciclos curtos.",
                      "Registre erros e melhorias.",
                      "Implemente algoritmos básicos.",
                      "Otimize o código para eficiência."
                    ].map((step, i) => (
                      <li key={i} className="flex items-center gap-[6px] text-[11px] text-[#9ba1aa] bg-[rgba(0,0,0,0.35)] rounded-full p-[6px_8px] border border-[rgba(255,255,255,0.04)]">
                        <span className="w-4 h-4 rounded-full bg-[rgba(245,166,35,0.12)] text-[#f5a623] text-[10px] flex items-center justify-center font-semibold">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </article>
              )}
            </div>
          </section>

          {/* Right Panel */}
          <section className="bg-[rgba(9,12,18,0.9)] rounded-[18px] border border-[rgba(255,255,255,0.08)] p-2 flex flex-col gap-2">
            <div className="text-[12px] uppercase tracking-widest text-[#9ba1aa]">MONTANDO UM ROBÔ MÓVEL</div>

            <div className="flex-1 grid grid-cols-2 gap-[6px]">
              {[
                { 
                  title: "Cérebro", 
                  sub: "Microcontrolador", 
                  info: "Controla todo o robô. Pode ser um Arduino Uno ou similar. Processa informações e toma decisões." 
                },
                { 
                  title: "Movimento", 
                  sub: "Motores + rodas", 
                  info: "Motores com caixa de redução e rodas para locomoção. Permitem que o robô se mova em qualquer direção." 
                },
                { 
                  title: "Sentidos", 
                  sub: "Sensores", 
                  info: "Sensores identificam obstáculos, luz, linha no chão e muito mais. São os 'sentidos' do robô." 
                },
                { 
                  title: "Corpo", 
                  sub: "Estrutura", 
                  info: "Suporte, chassi e carcaça protegem e organizam os módulos. Dão forma e resistência ao robô." 
                }
              ].map((item, i) => (
                <button 
                  key={i}
                  onClick={() => handleCardClick(item.info)}
                  className={`border border-[rgba(255,255,255,0.06)] rounded-[14px] p-[7px_8px] bg-[radial-gradient(circle_at_top_left,rgba(245,166,35,0.18),rgba(10,13,19,0.98))] text-left cursor-pointer relative overflow-hidden transition-all duration-150 active:scale-95 ${
                    highlightedCard === item.info ? 'border-[#f5a623] shadow-[0_0_0_1px_rgba(245,166,35,0.4)]' : ''
                  }`}
                >
                  <h3 className="m-0 text-[12px] text-[#f4f4f4] font-bold">{item.title}</h3>
                  <p className="m-[2px_0_0] text-[11px] text-[#9ba1aa]">{item.sub}</p>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-[6px]">
              <button 
                onClick={loadRandomQuiz}
                className="rounded-full border-none p-[8px_14px] text-[11px] font-semibold tracking-wide uppercase bg-[linear-gradient(135deg,#f34f4f,#ff8e5b)] text-[#1c0504] cursor-pointer shadow-lg active:scale-95 transition-transform"
              >
                Novo Quiz
              </button>
              <p className="flex-1 m-0 text-[10px] text-[#9ba1aa] text-right">
                {highlightedCard ? highlightedCard.substring(0, 30) + '...' : "Toque em um componente para ver sua função."}
              </p>
            </div>
          </section>
        </main>

        {/* Permanent Quiz */}
        <section className="bg-[rgba(16,20,26,0.95)] rounded-[18px] border border-[rgba(255,255,255,0.08)] p-3 shadow-lg mt-2">
          <h2 className="m-[0_0_8px] text-sm text-[#f5a623] font-bold">Mini-quiz rápido</h2>
          <p className="m-[0_0_10px] text-[12px] text-[#f4f4f4]">{quizData[currentQuizIndex].q}</p>
          
          <div className="grid gap-2 mb-3">
            {quizData[currentQuizIndex].options.map((option, idx) => {
              let btnClass = "bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.1)] text-[#f4f4f4]";
              if (quizAnswered !== null) {
                if (idx === quizData[currentQuizIndex].correct) {
                  btnClass = "bg-[rgba(63,191,90,0.25)] border-[#3fbf5a] text-[#a8ffb8]";
                } else if (idx === quizAnswered) {
                  btnClass = "bg-[rgba(255,75,92,0.25)] border-[#ff4b5c] text-[#ffb4b9]";
                }
              }

              return (
                <button 
                  key={idx}
                  disabled={quizAnswered !== null}
                  onClick={() => handleQuizAnswer(idx)}
                  className={`rounded-full p-[10px_12px] text-[12px] text-left cursor-pointer transition-all ${btnClass} ${quizAnswered === null ? 'hover:bg-[rgba(255,255,255,0.05)] hover:border-[#f5a623]' : ''}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          
          <div className="text-[11px] text-center p-2 rounded-full bg-[rgba(0,0,0,0.3)] mt-2 text-[#9ba1aa] min-h-[20px]">
            {quizFeedback}
          </div>
          
          <button 
            onClick={loadRandomQuiz}
            className="w-full rounded-full border-none p-2 bg-[linear-gradient(135deg,#3498db,#2ecc71)] text-white text-[11px] font-semibold cursor-pointer mt-2 active:scale-95 transition-transform"
          >
            Próxima Pergunta
          </button>
        </section>

        {/* Professional Footer */}
        <div className="mt-2 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
           <div className="flex items-center gap-2">
             <i className="fas fa-microchip text-[#f5a623] text-xs"></i>
             <span className="text-[10px] text-[#9ba1aa] uppercase tracking-wider font-medium">Engenharia Robótica v1.0</span>
           </div>
           <button 
             onClick={onClose}
             className="bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] text-[#f4f4f4] text-[11px] font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
           >
             <i className="fas fa-arrow-left"></i> Voltar
           </button>
        </div>

        {/* Toast */}
        <div 
          className={`fixed left-1/2 bottom-3 -translate-x-1/2 min-w-[200px] max-w-[80vw] p-[8px_12px] rounded-full bg-[rgba(8,12,18,0.96)] border border-[rgba(255,255,255,0.06)] text-[#f4f4f4] text-[11px] text-center shadow-lg transition-all duration-200 pointer-events-none z-[130] ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[40px]'}`}
        >
          {toastMessage}
        </div>
      </div>
    </div>
  );
};

export default RobotCreationModal;
