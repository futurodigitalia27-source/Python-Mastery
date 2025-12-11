
import { FC } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  onStart: () => void;
  onOpenStudentArea: () => void;
}

const Hero: FC<HeroProps> = ({ onStart, onOpenStudentArea }) => {
  const { t } = useLanguage();

  return (
    <section id="hero" className="snap-section relative flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl px-6">
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent animate-float-title">
          {t.hero.title_pre} <br/>
          <span className="text-primary">{t.hero.title_high}</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
          {t.hero.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onStart}
            className="px-8 py-4 bg-primary hover:bg-teal-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-teal-500/25 transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2"
          >
            <i className="fas fa-play"></i> {t.hero.btn_start}
          </button>
          <button 
            onClick={onOpenStudentArea}
            className="px-8 py-4 bg-transparent border border-white/10 hover:bg-white/5 text-white font-medium rounded-xl backdrop-blur-sm transition-all duration-200 flex items-center gap-2"
          >
            <i className="fas fa-user-graduate text-primary"></i> {t.hero.btn_student}
          </button>
        </div>
      </div>

      {/* Floating Elements Decoration */}
      <div className="absolute top-32 left-10 md:left-20 animate-float-slow hidden lg:block">
        <div className="glass-panel p-4 rounded-xl border-l-4 border-primary">
          <code className="text-sm font-mono text-secondary">print("Hello World")</code>
        </div>
      </div>
      
      <div className="absolute bottom-32 right-10 md:right-20 animate-float-delayed hidden lg:block">
        <div className="glass-panel w-16 h-16 flex items-center justify-center rounded-2xl">
          <span className="text-3xl">🐍</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
    