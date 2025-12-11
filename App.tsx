
import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Fundamentos from './components/Fundamentos';
import Variaveis from './components/Variaveis';
import Funcoes from './components/Funcoes';
import Laboratory from './components/Laboratory';
import Dashboard from './components/Dashboard';
import ChatAssistant from './components/ChatAssistant';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import EmentaModal from './components/EmentaModal';
import LiveClassModal from './components/LiveClassModal';
import RobotCreationModal from './components/RobotCreationModal';
import { RoadmapModal, CommunityModal, CertificateModal, BlogModal, ServerStatusModal } from './components/FooterModals';
import { User } from './types';

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [user, setUser] = useState<User | null>(null);
  
  // Auth Modal State - Start true if no user
  const [isAuthOpen, setIsAuthOpen] = useState(true);

  // Other Modal States
  const [isStudentAreaOpen, setIsStudentAreaOpen] = useState(false);
  const [isLiveClassOpen, setIsLiveClassOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isRobotCreationOpen, setIsRobotCreationOpen] = useState(false);

  // Initial Auth Check
  useEffect(() => {
    // Here we enforce the modal to stay open if no user
    if (!user) {
      setIsAuthOpen(true);
    }
  }, [user]);

  // Scroll Spy Logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.snap-section').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = (u: User) => {
    setUser(u);
    setIsAuthOpen(false);
  };

  return (
    <div className={`bg-bg min-h-screen text-white relative ${!user ? 'overflow-hidden h-screen' : ''}`}>
      
      {/* Background is rendered but might be covered by modal */}
      <Navigation 
        user={user} 
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        onLogout={() => {
          setUser(null);
          setIsAuthOpen(true);
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main className={`snap-container h-screen w-full transition-all duration-500 ${!user ? 'blur-sm scale-[0.99] opacity-50 pointer-events-none' : 'blur-0 scale-100 opacity-100'}`}>
        <Hero 
          onStart={() => scrollToSection('fundamentos')} 
          onOpenStudentArea={() => setIsStudentAreaOpen(true)}
        />
        <Fundamentos />
        <Variaveis />
        <Funcoes />
        <Laboratory />
        <Dashboard />
        <Footer 
          onOpenLiveClass={() => setIsLiveClassOpen(true)}
          onOpenRoadmap={() => setIsRoadmapOpen(true)}
          onOpenCommunity={() => setIsCommunityOpen(true)}
          onOpenCertificate={() => setIsCertificateOpen(true)}
          onOpenBlog={() => setIsBlogOpen(true)}
          onOpenStatus={() => setIsStatusOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenRobotCreation={() => setIsRobotCreationOpen(true)}
        />
      </main>

      {/* Chat is only available if logged in to avoid clutter over auth modal */}
      {user && <ChatAssistant userName={user?.name} currentSection={activeSection} />}
      
      {/* Primary Modals */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => user && setIsAuthOpen(false)} // Only closeable if user exists (updates profile mode)
        onLogin={handleLogin}
        canClose={!!user} // Pass prop to control close button visibility
      />
      
      {user && (
        <>
          <EmentaModal 
            isOpen={isStudentAreaOpen} 
            onClose={() => setIsStudentAreaOpen(false)} 
          />
          <LiveClassModal 
            isOpen={isLiveClassOpen}
            onClose={() => setIsLiveClassOpen(false)}
          />
          <RobotCreationModal 
            isOpen={isRobotCreationOpen}
            onClose={() => setIsRobotCreationOpen(false)}
          />
          {/* Footer Resource Modals */}
          <RoadmapModal isOpen={isRoadmapOpen} onClose={() => setIsRoadmapOpen(false)} />
          <CommunityModal isOpen={isCommunityOpen} onClose={() => setIsCommunityOpen(false)} />
          <CertificateModal isOpen={isCertificateOpen} onClose={() => setIsCertificateOpen(false)} />
          <BlogModal isOpen={isBlogOpen} onClose={() => setIsBlogOpen(false)} />
          <ServerStatusModal isOpen={isStatusOpen} onClose={() => setIsStatusOpen(false)} />
        </>
      )}

    </div>
  );
}

export default App;
