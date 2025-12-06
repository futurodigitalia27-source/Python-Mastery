

import React from 'react';

interface FooterProps {
  onOpenLiveClass: () => void;
  onOpenRoadmap: () => void;
  onOpenCommunity: () => void;
  onOpenCertificate: () => void;
  onOpenBlog: () => void;
  onOpenStatus: () => void;
  onOpenAuth: () => void;
  onOpenRobotCreation: () => void;
}

const Footer: React.FC<FooterProps> = ({ 
  onOpenLiveClass, 
  onOpenRoadmap, 
  onOpenCommunity, 
  onOpenCertificate, 
  onOpenBlog, 
  onOpenStatus,
  onOpenAuth,
  onOpenRobotCreation
}) => {
  return (
    <footer className="snap-start bg-[#0b1220] border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="text-2xl font-bold text-white mb-4">Python<span className="text-primary">Mastery</span><span className="text-xs text-muted font-normal block mt-1">www.pythonmastery.com</span></div>
          <p className="text-muted text-sm leading-relaxed">
            A plataforma definitiva para dominar Python. Tecnologia imersiva, mentoria IA e prática real.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4">Plataforma</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <button onClick={onOpenRoadmap} className="hover:text-primary transition-colors text-left">
                Trilhas de Aprendizado
              </button>
            </li>
            <li>
              <button onClick={onOpenLiveClass} className="hover:text-primary transition-colors text-left">
                Mentoria ao Vivo
              </button>
            </li>
            <li>
              <button onClick={onOpenCommunity} className="hover:text-primary transition-colors text-left">
                Comunidade Global
              </button>
            </li>
            <li>
              <button onClick={onOpenCertificate} className="hover:text-primary transition-colors text-left">
                Certificação Oficial
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Recursos</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <a href="https://docs.python.org/pt-br/3/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors block">
                Documentação Python <i className="fas fa-external-link-alt text-[10px] ml-1 opacity-50"></i>
              </a>
            </li>
            <li>
              <button onClick={onOpenBlog} className="hover:text-primary transition-colors text-left">
                Blog Técnico
              </button>
            </li>
            <li>
              <button onClick={onOpenStatus} className="hover:text-primary transition-colors text-left">
                Status do Servidor <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-1"></span>
              </button>
            </li>
            <li>
              <button onClick={onOpenRobotCreation} className="hover:text-primary transition-colors text-left text-yellow-400">
                Criação de Robôs <i className="fas fa-robot text-[10px] ml-1"></i>
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Contato</h4>
          <a href="mailto:futurodigitalia@gmail.com" className="text-muted text-sm mb-4 block hover:text-primary transition-colors">
            futurodigitalia@gmail.com
          </a>
          <button 
            onClick={onOpenAuth}
            className="px-4 py-2 border border-primary/50 text-primary rounded-lg text-sm hover:bg-primary/10 transition-colors w-full md:w-auto flex items-center justify-center gap-2"
          >
            <i className="fas fa-lock"></i> Área do Assinante
          </button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-xs text-muted">
        &copy; {new Date().getFullYear()} Python Mastery. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
