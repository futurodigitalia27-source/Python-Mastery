
import React, { useState } from 'react';

// --- SHARED MODAL WRAPPER ---
const ModalWrapper: React.FC<{ title: string; icon: string; isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ title, icon, isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-[#0b1220] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0f1720]">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <i className={`fas ${icon} text-primary`}></i> {title}
          </h3>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- 1. ROADMAP MODAL ---
export const RoadmapModal: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => (
  <ModalWrapper title="Trilhas de Aprendizado" icon="fa-map-signs" {...props}>
    <div className="space-y-8 relative">
      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-white/10"></div>
      
      {[
        { title: 'Fundamentos Python', status: 'Concluído', color: 'text-green-400', icon: 'fa-check-circle', desc: 'Lógica, Sintaxe, Variáveis, Loops' },
        { title: 'Data Science', status: 'Em Progresso', color: 'text-primary', icon: 'fa-spinner fa-spin', desc: 'Pandas, NumPy, Matplotlib, Jupyter' },
        { title: 'Backend Web', status: 'Bloqueado', color: 'text-muted', icon: 'fa-lock', desc: 'Django, Flask, APIs RESTful, SQL' },
        { title: 'Automação & Bots', status: 'Bloqueado', color: 'text-muted', icon: 'fa-lock', desc: 'Selenium, Requests, Web Scraping' },
        { title: 'Machine Learning', status: 'Bloqueado', color: 'text-muted', icon: 'fa-lock', desc: 'Scikit-learn, TensorFlow, Neural Networks' }
      ].map((step, i) => (
        <div key={i} className="flex gap-4 relative">
          <div className={`w-8 h-8 rounded-full bg-[#0b1220] border border-white/10 flex items-center justify-center z-10 ${step.color}`}>
            <i className={`fas ${step.icon}`}></i>
          </div>
          <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-white">{step.title}</h4>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${step.color}`}>{step.status}</span>
            </div>
            <p className="text-sm text-muted mt-1">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </ModalWrapper>
);

// --- 2. COMMUNITY MODAL ---
export const CommunityModal: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => (
  <ModalWrapper title="Comunidade Global" icon="fa-users" {...props}>
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#5865F2]/20 text-[#5865F2] text-4xl mb-4 border border-[#5865F2]/30">
        <i className="fab fa-discord"></i>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Junte-se ao Squad Python Mastery</h3>
      <p className="text-muted max-w-md mx-auto">Conecte-se com mais de 15.000 desenvolvedores, tire dúvidas em tempo real e participe de hackathons.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
        <div className="text-xl font-bold text-white">15k+</div>
        <div className="text-xs text-muted">Membros</div>
      </div>
      <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
        <div className="text-xl font-bold text-green-400">1.2k</div>
        <div className="text-xs text-muted">Online Agora</div>
      </div>
      <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
        <div className="text-xl font-bold text-primary">24/7</div>
        <div className="text-xs text-muted">Mentoria</div>
      </div>
    </div>

    <button className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
      <i className="fab fa-discord"></i> Entrar no Servidor Discord
    </button>
  </ModalWrapper>
);

// --- 3. CERTIFICATE MODAL ---
export const CertificateModal: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => (
  <ModalWrapper title="Certificação Oficial" icon="fa-certificate" {...props}>
    <div className="bg-gradient-to-br from-[#1a202c] to-[#0f1720] p-1 rounded-xl border border-yellow-500/30 mb-6 shadow-2xl">
      <div className="border border-white/10 p-8 rounded-lg relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <i className="fas fa-ribbon text-6xl text-yellow-500"></i>
        </div>
        <div className="text-center">
          <div className="text-2xl font-serif text-yellow-500 mb-2">Certificado de Excelência</div>
          <div className="text-white text-3xl font-bold mb-4">Python Full Stack Developer</div>
          <div className="w-32 h-0.5 bg-white/20 mx-auto mb-4"></div>
          <p className="text-muted text-sm mb-6">Concedido a [Seu Nome Aqui] por completar com êxito a trilha intensiva de 120 horas.</p>
          <div className="flex justify-center gap-8 text-xs text-muted uppercase tracking-widest">
            <div>Data: --/--/----</div>
            <div>ID: PY-MST-2024</div>
          </div>
        </div>
      </div>
    </div>

    <h4 className="text-white font-bold mb-3">Requisitos para Emissão:</h4>
    <ul className="space-y-3">
      <li className="flex items-center gap-3 text-sm text-gray-300">
        <i className="fas fa-check-circle text-green-400"></i> Completar 100% das videoaulas
      </li>
      <li className="flex items-center gap-3 text-sm text-gray-300">
        <i className="fas fa-circle text-white/20"></i> Entregar os 6 Projetos Práticos
      </li>
      <li className="flex items-center gap-3 text-sm text-gray-300">
        <i className="fas fa-circle text-white/20"></i> Passar no Exame Final (Mín. 80%)
      </li>
    </ul>
  </ModalWrapper>
);

// --- 4. BLOG MODAL ---
interface BlogPost {
  id: number;
  title: string;
  tag: string;
  date: string;
  preview: string;
  content: string;
}

const blogPosts: BlogPost[] = [
  { 
    id: 1,
    title: "O que há de novo no Python 3.12?", 
    tag: "News", 
    date: "2 dias atrás",
    preview: "Descubra as melhorias nas mensagens de erro, f-strings mais flexíveis e o impacto na performance da linguagem.",
    content: `
      O Python 3.12 trouxe mudanças significativas focadas em experiência do desenvolvedor e performance. Aqui estão os destaques:

      ### 1. Mensagens de Erro Melhoradas
      O interpretador agora sugere correções mais precisas. Se você esquecer de importar um módulo ou cometer um erro de digitação ('NameError'), o Python 3.12 aponta qual variável você provavelmente queria usar.

      ### 2. F-strings Mais Flexíveis
      Agora você pode reutilizar as mesmas aspas dentro da f-string que usou para delimitá-la. Isso elimina a necessidade de alternar entre aspas simples e duplas constantemente.
      Exemplo:
      \`\`\`python
      f"O nome do arquivo é {user['name']}"  # Válido no 3.12
      \`\`\`

      ### 3. Performance
      Graças a otimizações no bytecode e na gestão de memória, scripts puros em Python podem rodar até 5-10% mais rápido sem nenhuma alteração no código.

      ### Conclusão
      Atualizar para o 3.12 vale a pena, especialmente para iniciantes que se beneficiarão das mensagens de erro mais didáticas.
    `
  },
  { 
    id: 2,
    title: "Dominando List Comprehensions", 
    tag: "Tutorial", 
    date: "1 semana atrás",
    preview: "Aprenda a escrever código Pythonico substituindo loops tradicionais por compreensões de lista elegantes.",
    content: `
      List Comprehensions são uma das características mais amadas do Python. Elas permitem criar novas listas de forma concisa.

      ### A Sintaxe
      \`[expressão for item in iterável if condição]\`

      ### Exemplo Prático
      Imagine que você quer o quadrado dos números pares de 0 a 9.
      
      **Jeito Tradicional:**
      \`\`\`python
      quadrados = []
      for i in range(10):
          if i % 2 == 0:
              quadrados.append(i**2)
      \`\`\`

      **Com List Comprehension:**
      \`\`\`python
      quadrados = [i**2 for i in range(10) if i % 2 == 0]
      \`\`\`

      ### Quando NÃO usar
      Se a lógica for muito complexa ou tiver muitos loops aninhados, a legibilidade pode ser prejudicada. Nesses casos, prefira o loop \`for\` explícito.
    `
  },
  { 
    id: 3,
    title: "Como usar IA para debugar código", 
    tag: "Dicas", 
    date: "2 semanas atrás",
    preview: "Pare de bater cabeça com tracebacks. Veja como assistentes como o Fole podem acelerar seu aprendizado.",
    content: `
      Debugar é uma arte, mas com IA, virou uma ciência acelerada.

      ### 1. Explique o Erro
      Em vez de apenas colar o erro, diga: "Estou tentando fazer um loop while, mas recebi este IndexError". O contexto ajuda a IA a entender sua intenção.

      ### 2. Rubber Duck Debugging
      Use o chat para explicar seu código linha a linha. Frequentemente, ao explicar para a IA, você mesmo percebe o erro antes dela responder.

      ### 3. Pedindo Refatoração
      Peça: "Este código funciona, mas como posso deixá-lo mais legível ou eficiente?". A IA pode sugerir bibliotecas padrão que você desconhecia.

      **Dica Pro:** Nunca cole senhas ou chaves de API no chat, mesmo que seja para debugar.
    `
  },
  { 
    id: 4,
    title: "Flask vs Django: Qual escolher?", 
    tag: "Backend", 
    date: "3 semanas atrás",
    preview: "Microframework ou Baterias Inclusas? Entenda as diferenças fundamentais para seu próximo projeto web.",
    content: `
      A eterna batalha do ecossistema Python Web.

      ### Flask (O Microframework)
      - **Filosofia:** Minimalista. Te dá o básico (rotas, requisições) e você escolhe o resto (banco de dados, autenticação).
      - **Ideal para:** Microserviços, APIs simples, projetos onde você quer controle total da arquitetura.
      - **Curva de aprendizado:** Mais suave inicialmente.

      ### Django (Baterias Inclusas)
      - **Filosofia:** Tudo pronto. Vem com ORM, Sistema de Admin, Autenticação e Segurança configurados.
      - **Ideal para:** E-commerces, Redes Sociais, sistemas corporativos complexos, MVPs rápidos ("deadline driven development").
      - **Curva de aprendizado:** Mais íngreme, mas alta produtividade depois de dominar.

      ### Veredito
      Comece com Flask para entender como a web funciona "por baixo do capô". Migre para Django quando precisar entregar produtos robustos rapidamente.
    `
  },
];

export const BlogModal: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!props.isOpen) setActivePost(null);
  }, [props.isOpen]);

  return (
    <ModalWrapper title="Blog Técnico" icon="fa-rss" {...props}>
      {activePost ? (
        <div className="animate-fadeIn">
          <button 
            onClick={() => setActivePost(null)}
            className="mb-4 text-xs font-bold text-muted hover:text-white flex items-center gap-2 transition-colors"
          >
            <i className="fas fa-arrow-left"></i> Voltar para a lista
          </button>
          
          <div className="mb-2 flex items-center gap-3">
             <span className="text-xs font-bold bg-primary/20 text-primary px-2 py-1 rounded">{activePost.tag}</span>
             <span className="text-xs text-muted">{activePost.date}</span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-6">{activePost.title}</h2>
          
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line space-y-4">
            {activePost.content.split('```').map((part, index) => {
              // Simple check: odd indices are likely code blocks in this specific format
              if (index % 2 === 1) {
                 const lang = part.split('\n')[0];
                 const code = part.substring(lang.length);
                 return (
                   <div key={index} className="bg-black/30 p-4 rounded-lg border border-white/10 font-mono text-xs text-blue-300 overflow-x-auto my-4">
                     {code.trim()}
                   </div>
                 );
              }
              // Bold formatting for headers in content
              return <span key={index} dangerouslySetInnerHTML={{ __html: part.replace(/### (.*)/g, '<h3 class="text-lg font-bold text-white mt-6 mb-2">$1</h3>').replace(/\*\*(.*)\*\*/g, '<strong class="text-white">$1</strong>') }} />;
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
             <span className="text-xs text-muted">Gostou deste artigo?</span>
             <div className="flex gap-2">
               <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-white transition-colors"><i className="far fa-thumbs-up"></i></button>
               <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-white transition-colors"><i className="far fa-share-square"></i></button>
             </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {blogPosts.map((post) => (
            <div 
              key={post.id} 
              onClick={() => setActivePost(post)}
              className="bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 cursor-pointer transition-colors group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold bg-primary/20 text-primary px-2 py-1 rounded">{post.tag}</span>
                <span className="text-xs text-muted">{post.date}</span>
              </div>
              <h4 className="text-white font-bold text-lg group-hover:text-primary transition-colors">{post.title}</h4>
              <p className="text-sm text-muted mt-2">{post.preview}</p>
              <div className="mt-3 text-xs font-bold text-gray-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                Ler Artigo <i className="fas fa-arrow-right"></i>
              </div>
            </div>
          ))}
        </div>
      )}
    </ModalWrapper>
  );
};

// --- 5. SERVER STATUS MODAL ---
export const ServerStatusModal: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => (
  <ModalWrapper title="Status do Sistema" icon="fa-server" {...props}>
    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-center gap-4 mb-6">
      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]">
        <i className="fas fa-check"></i>
      </div>
      <div>
        <h4 className="text-green-400 font-bold text-lg">Todos os sistemas operacionais</h4>
        <p className="text-xs text-green-300/70">Última atualização: Agora</p>
      </div>
    </div>

    <div className="space-y-4">
      {[
        { name: 'API Principal (Gemini Gateway)', status: 'Operacional', lat: '45ms' },
        { name: 'Banco de Dados (Users & Progress)', status: 'Operacional', lat: '12ms' },
        { name: 'Ambiente de Execução (Sandbox)', status: 'Operacional', lat: '8ms' },
        { name: 'Servidor de Streaming (Aulas)', status: 'Operacional', lat: '24ms' },
        { name: 'Websocket (Chat em Tempo Real)', status: 'Operacional', lat: '15ms' },
      ].map((srv, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span className="text-sm font-medium text-gray-200">{srv.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-muted">{srv.lat}</span>
            <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">{srv.status}</span>
          </div>
        </div>
      ))}
    </div>
  </ModalWrapper>
);
