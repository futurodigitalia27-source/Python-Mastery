
import { useState, FC } from 'react';
import { User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface NavigationProps {
  user: User | null;
  activeSection: string;
  scrollToSection: (id: string) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

const Navigation: FC<NavigationProps> = ({ user, activeSection, scrollToSection, onLogout, onOpenAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const links = [
    { id: 'hero', label: t.nav.home },
    { id: 'fundamentos', label: t.nav.fundamentals },
    { id: 'variaveis', label: t.nav.variables },
    { id: 'funcoes', label: t.nav.functions },
    { id: 'lab', label: t.nav.lab },
    { id: 'dashboard', label: t.nav.progress },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-6xl z-50">
      <div className="glass-panel rounded-2xl p-3 shadow-2xl border border-white/10">
        <div className="flex items-center justify-between px-2">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-teal-500/20">
              P
            </div>
            <span className="font-bold text-lg tracking-wide hidden sm:block">Python Mastery</span>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/5">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === link.id
                    ? 'bg-white/10 text-primary shadow-sm'
                    : 'text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* User / Auth / Lang */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white transition-colors border border-white/5"
              title="Mudar Idioma / Change Language"
            >
              {language === 'pt' ? '🇧🇷' : '🇺🇸'}
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-white">{user.name}</div>
                  <div className="text--[10px] text-primary uppercase tracking-wider font-bold">{user.level}</div>
                </div>
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button 
                  onClick={onLogout}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-muted hover:text-red-400 transition-colors"
                  title={t.nav.logout}
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                {t.nav.login}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden w-10 h-10 flex items-center justify-center text-white bg-white/5 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-2 animate-fadeIn">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  scrollToSection(link.id);
                  setIsMenuOpen(false);
                }}
                className={`p-3 rounded-xl text-left font-medium transition-colors ${
                  activeSection === link.id
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
    