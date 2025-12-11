
import React, { useState } from 'react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  canClose: boolean; // Propriedade para controlar se o modal pode ser fechado
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, canClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de delay de rede para sensação profissional e permitir que o navegador capture os dados
    setTimeout(() => {
      const user: User = {
        id: Date.now(),
        name: name || email.split('@')[0],
        email: email,
        level: 'Iniciante',
        avatarColor: '#14b8a6'
      };
      onLogin(user);
      setIsLoading(false);
      if (canClose) onClose();
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    setSocialLoading(provider);
    
    // Simulação de autenticação OAuth
    setTimeout(() => {
      const mockNames: Record<string, string> = {
        'google': 'Usuário Google',
        'github': 'Dev GitHub',
        'linkedin': 'Profissional LinkedIn'
      };

      const user: User = {
        id: Date.now(),
        name: mockNames[provider] || 'Visitante',
        email: `${provider}@exemplo.com`,
        level: 'Iniciante',
        avatarColor: provider === 'google' ? '#DB4437' : provider === 'github' ? '#333' : '#0077b5'
      };

      onLogin(user);
      setSocialLoading(null);
      if (canClose) onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop com Blur Pesado */}
      <div className="absolute inset-0 bg-[#05090e]/90 backdrop-blur-md transition-opacity duration-500"></div>

      {/* Main Card */}
      <div className="relative w-full max-w-4xl bg-[#0b1220] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/10 animate-fadeIn h-[600px] md:h-auto">
        
        {/* Close Button (Só aparece se o usuário já estiver logado/for opcional) */}
        {canClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-muted hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full w-8 h-8 flex items-center justify-center"
          >
            <i className="fas fa-times"></i>
          </button>
        )}

        {/* LEFT SIDE: Visual / Marketing (Estilo da Imagem Referência) */}
        <div className="w-full md:w-1/2 relative bg-black flex flex-col justify-center p-8 md:p-12 overflow-hidden group">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 via-[#0f1720] to-black z-0"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
            
            {/* Animated Blobs */}
            <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px] animate-pulse z-0"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-blue-600/20 rounded-full blur-[60px] animate-float-slow z-0"></div>

            <div className="relative z-10 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-primary uppercase tracking-wider mb-6">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Plataforma Exclusiva
                </div>
                
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                    Domine o <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-200">Futuro.</span>
                </h1>
                
                <p className="text-muted text-sm md:text-base leading-relaxed mb-8 max-w-sm">
                   Junte-se a milhares de desenvolvedores. Acesse mentoria com IA, laboratórios práticos e desafios reais de engenharia.
                </p>

                <div className="flex gap-4">
                    <div className="flex -space-x-3">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0b1220] bg-gray-700 overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i*13}`} alt="User" />
                            </div>
                        ))}
                    </div>
                    <div className="text-xs text-muted flex flex-col justify-center">
                        <span className="font-bold text-white">15k+ Alunos</span>
                        <span>Codando agora</span>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT SIDE: Form (Clean & Professional) */}
        <div className="w-full md:w-1/2 bg-[#0b1220] flex flex-col justify-center p-8 md:p-12 relative">
           <div className="max-w-xs mx-auto w-full">
              <div className="text-center mb-8">
                 <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}</h2>
                 <p className="text-sm text-muted">
                    {isLogin ? 'Digite suas credenciais para acessar o laboratório.' : 'Comece sua jornada gratuitamente hoje.'}
                 </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
                {!isLogin && (
                    <div className="group">
                        <label htmlFor="name" className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1 group-focus-within:text-primary transition-colors">Nome Completo</label>
                        <div className="relative">
                            <i className="fas fa-user absolute left-3 top-3.5 text-gray-500 group-focus-within:text-white transition-colors"></i>
                            <input 
                                id="name"
                                name="name"
                                type="text" 
                                required 
                                value={name}
                                onChange={e => setName(e.target.value)}
                                autoComplete="name"
                                className="w-full bg-[#0f1720] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all placeholder:text-gray-600"
                                placeholder="Ex: Ana Silva"
                            />
                        </div>
                    </div>
                )}

                <div className="group">
                    <label htmlFor="email" className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1 group-focus-within:text-primary transition-colors">E-mail Profissional</label>
                    <div className="relative">
                        <i className="fas fa-envelope absolute left-3 top-3.5 text-gray-500 group-focus-within:text-white transition-colors"></i>
                        <input 
                            id="email"
                            name="email"
                            type="email" 
                            required 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoComplete="username"
                            className="w-full bg-[#0f1720] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all placeholder:text-gray-600"
                            placeholder="nome@exemplo.com"
                        />
                    </div>
                </div>

                <div className="group">
                     <div className="flex justify-between items-center mb-1">
                        <label htmlFor="password" className="block text-[10px] font-bold text-muted uppercase tracking-wider group-focus-within:text-primary transition-colors">Senha</label>
                        {isLogin && <button type="button" className="text-[10px] text-primary hover:underline">Esqueceu a senha?</button>}
                     </div>
                    <div className="relative">
                        <i className="fas fa-lock absolute left-3 top-3.5 text-gray-500 group-focus-within:text-white transition-colors"></i>
                        <input 
                            id="password"
                            name="password"
                            type="password" 
                            required 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            className="w-full bg-[#0f1720] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all placeholder:text-gray-600"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary to-teal-600 hover:from-teal-400 hover:to-primary text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-teal-500/20 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                    {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : (isLogin ? 'Acessar Plataforma' : 'Criar Conta Grátis')}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                 <p className="text-xs text-muted mb-3">Ou continue com</p>
                 <div className="flex gap-3 justify-center">
                    <button 
                      onClick={() => handleSocialLogin('google')}
                      disabled={socialLoading !== null}
                      className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 transition-colors group relative"
                      title="Google"
                    >
                      {socialLoading === 'google' ? <i className="fas fa-spinner fa-spin text-white text-xs"></i> : <i className="fab fa-google text-white group-hover:text-[#DB4437]"></i>}
                    </button>
                    <button 
                      onClick={() => handleSocialLogin('github')}
                      disabled={socialLoading !== null}
                      className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 transition-colors group relative"
                      title="GitHub"
                    >
                      {socialLoading === 'github' ? <i className="fas fa-spinner fa-spin text-white text-xs"></i> : <i className="fab fa-github text-white"></i>}
                    </button>
                    <button 
                      onClick={() => handleSocialLogin('linkedin')}
                      disabled={socialLoading !== null}
                      className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 transition-colors group relative"
                      title="LinkedIn"
                    >
                      {socialLoading === 'linkedin' ? <i className="fas fa-spinner fa-spin text-white text-xs"></i> : <i className="fab fa-linkedin-in text-white group-hover:text-[#0077b5]"></i>}
                    </button>
                 </div>
                 <div className="mt-6 text-xs text-muted">
                    {isLogin ? 'Novo por aqui?' : 'Já possui acesso?'}
                    <button onClick={() => setIsLogin(!isLogin)} className="ml-1 text-primary hover:text-white font-bold transition-colors">
                        {isLogin ? 'Cadastre-se' : 'Fazer Login'}
                    </button>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
