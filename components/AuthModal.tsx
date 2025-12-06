import React, { useState } from 'react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    const user: User = {
      id: Date.now(),
      name: name || email.split('@')[0],
      email: email,
      level: 'Iniciante',
      avatarColor: '#14b8a6'
    };
    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b1220] border border-white/10 rounded-2xl w-full max-w-md p-8 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-white"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 text-primary">
            🔐
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </h2>
          <p className="text-muted text-sm mt-2">
            {isLogin ? 'Entre para continuar seu progresso' : 'Comece sua jornada Python hoje'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs text-muted mb-1">Nome</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
                placeholder="Seu nome"
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs text-muted mb-1">E-mail</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">Senha</label>
            <input 
              type="password" 
              required 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-teal-400 text-slate-900 font-bold py-3 rounded-xl transition-colors mt-4"
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted">{isLogin ? 'Não tem conta?' : 'Já tem conta?'}</span>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-primary hover:underline font-medium"
          >
            {isLogin ? 'Cadastre-se' : 'Faça Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;