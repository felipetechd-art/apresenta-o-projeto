import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Users,
  Layers,
  Activity,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Target,
  Award,
  Sparkles,
  Phone,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Briefcase,
  Play,
  RotateCcw,
  Layout
} from 'lucide-react';

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [slideDirection, setSlideDirection] = useState('next'); // 'next' or 'prev'
  
  const totalSlides = 15;
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Monitor orientation on mobile
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 768);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  // Fullscreen event listener to sync state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setSlideDirection('next');
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setSlideDirection('prev');
      setCurrentSlide(prev => prev - 1);
    }
  };

  const jumpToSlide = (index) => {
    if (index >= 0 && index < totalSlides) {
      setSlideDirection(index > currentSlide ? 'next' : 'prev');
      setCurrentSlide(index);
    }
  };

  // Fullscreen handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Erro ao ativar tela cheia: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Touch Swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 60) {
      nextSlide();
    } else if (touchStartX.current - touchEndX.current < -60) {
      prevSlide();
    }
  };

  const animationClass = slideDirection === 'next' ? 'animate-slide-in-right' : 'animate-slide-in-left';

  return (
    <div 
      className="w-screen h-screen overflow-hidden bg-[#060b13] flex flex-col justify-between select-none font-sans relative text-gray-300 animate-fade-in"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Inject custom Keyframe animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        
        .font-sans {
          font-family: 'Inter', sans-serif;
        }
        .font-heading {
          font-family: 'Outfit', sans-serif;
        }
        .font-accent {
          font-family: 'Manrope', sans-serif;
        }

        @keyframes slideInRight {
          from { transform: translateX(40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        /* Glass Cards */
        .premium-card {
          background: rgba(14, 22, 37, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.1);
          box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.4);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .premium-card:hover {
          border-color: rgba(212, 175, 55, 0.25);
          background: rgba(18, 28, 46, 0.7);
          box-shadow: 0 15px 50px 0 rgba(212, 175, 55, 0.05);
        }

        /* Text Gold Gradient */
        .text-gold-premium {
          background: linear-gradient(135deg, #f9f5e8 0%, #d4af37 50%, #b8860b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Border Gold Gradient */
        .border-gold-grad {
          border-image: linear-gradient(135deg, #d4af37 0%, #b8860b 100%) 1;
        }
      `}</style>

      {/* Portrait rotation warning on mobile */}
      {isPortrait && (
        <div className="absolute inset-0 bg-[#060b13] z-50 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30 mb-6">
            <RotateCcw className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <h2 className="text-xl font-heading font-bold text-white mb-2">Gire seu dispositivo</h2>
          <p className="text-gray-400 text-sm max-w-sm">
            Para desfrutar da experiência cinematográfica executiva 16:9 completa, por favor rotacione o seu celular para a horizontal.
          </p>
        </div>
      )}

      {/* TOP PROGRESS BAR */}
      <div className="w-full h-1 bg-[#101926] relative z-10">
        <div 
          className="h-full bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#ffd700] transition-all duration-300 ease-out" 
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* TOP HEADER CONTROLS */}
      <header className="px-10 py-5 flex items-center justify-between z-10 shrink-0 border-b border-[#1b2a3f]/25 bg-gradient-to-b from-[#060b13] to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse" />
          <span className="text-[11px] font-accent uppercase tracking-[0.25em] text-gray-400 font-medium">Felipe Damasceno</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-xs font-accent text-gray-500 tracking-[0.1em] font-semibold">
            PROGRAMA GOVERNO EMPRESARIAL
          </span>
          <div className="h-4 w-[1px] bg-gray-800" />
          <button 
            onClick={toggleFullscreen}
            className="text-gray-400 hover:text-[#d4af37] transition-colors p-1 rounded hover:bg-white/5"
            title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <a 
            href="/"
            className="text-[10px] font-accent uppercase tracking-widest text-gray-400 hover:text-white border border-gray-800 px-3 py-1 rounded-md bg-white/5 transition-all hover:bg-white/10"
          >
            Voltar ao Dashboard
          </a>
        </div>
      </header>

      {/* MAIN SLIDE CONTAINER */}
      <main className="flex-grow flex items-center justify-center px-16 relative overflow-hidden">
        
        {/* BACKGROUND GLOWS FOR PREMIUM FEEL */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#d4af37]/3 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#3b82f6]/2 rounded-full blur-[160px] pointer-events-none" />

        {/* INTERACTIVE NAVIGATION AREAS (CLICK EDGES TO NAVIGATE) */}
        <div 
          onClick={prevSlide}
          className={`absolute left-0 top-0 bottom-0 w-16 flex items-center justify-start pl-4 cursor-pointer group z-20 transition-all ${currentSlide === 0 ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
        >
          <div className="w-10 h-10 rounded-full border border-gray-800 bg-[#060b13]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:border-[#d4af37]/45 transition-all">
            <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#d4af37]" />
          </div>
        </div>

        <div 
          onClick={nextSlide}
          className={`absolute right-0 top-0 bottom-0 w-16 flex items-center justify-end pr-4 cursor-pointer group z-20 transition-all ${currentSlide === totalSlides - 1 ? 'pointer-events-none opacity-0' : 'opacity-150'}`}
        >
          <div className="w-10 h-10 rounded-full border border-gray-800 bg-[#060b13]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:border-[#d4af37]/45 transition-all">
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#d4af37]" />
          </div>
        </div>

        {/* SLIDE SWITCHER */}
        <div className={`w-full max-w-6xl h-full flex flex-col justify-center py-6 ${animationClass}`} key={currentSlide}>
          
          {/* SLIDE 1: CAPA */}
          {currentSlide === 0 && (
            <div className="grid grid-cols-12 gap-8 items-center h-full">
              <div className="col-span-7 flex flex-col justify-center">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.3em] mb-4 animate-fade-in">Apresentação Comercial</span>
                <h1 className="text-5xl lg:text-6xl font-heading font-extrabold text-white leading-tight mb-6">
                  PROGRAMA <br/>
                  <span className="text-gold-premium">GOVERNO EMPRESARIAL</span>
                </h1>
                <p className="text-lg text-gray-400 max-w-xl font-light mb-8 leading-relaxed">
                  Transformando empresários operacionais em empresários que governam através de pessoas, processos e indicadores estratégicos.
                </p>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={nextSlide}
                    className="px-6 py-3 btn-gold rounded-lg flex items-center gap-3 text-xs uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    Iniciar Apresentação
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="col-span-5 flex justify-center items-center">
                {/* SVG Structure Representation */}
                <div className="w-full max-w-[360px] premium-card p-8 rounded-2xl border-l-4 border-l-[#d4af37] flex flex-col gap-6">
                  <div className="border-b border-[#1b2a3f] pb-3">
                    <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">Estrutura de Governo</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-mono tracking-widest mt-1">Hierarquia de Escala</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between p-3 bg-[#d4af37]/10 rounded-lg border border-[#d4af37]/30">
                      <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">Governo</span>
                      <span className="text-[9px] bg-[#d4af37]/20 px-2 py-0.5 rounded text-[#d4af37] font-mono">Conselho / Estratégia</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-gray-800">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Liderança</span>
                      <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-gray-400 font-mono">Diretores / Gestores</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-gray-800">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Processos</span>
                      <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-gray-400 font-mono">Rotinas / Padrões</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-gray-800">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Indicadores</span>
                      <span className="text-[9px] bg-[#3b82f6]/10 px-2 py-0.5 rounded text-[#3b82f6] font-mono">Dados / Dashboards</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: FELIPE DAMASCENO */}
          {currentSlide === 1 && (
            <div className="grid grid-cols-12 gap-10 items-center h-full">
              <div className="col-span-5 flex justify-center">
                <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-xl overflow-hidden border border-gray-800 bg-gradient-to-b from-gray-900 to-black flex flex-col justify-end p-6 group">
                  <div className="absolute inset-0 bg-cover bg-center bg-no-repeat filter grayscale opacity-40 mix-blend-luminosity" />
                  {/* Subtle placeholder look */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 flex items-center justify-center mb-3">
                      <Users className="w-6 h-6 text-[#d4af37]" />
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37]">Foto de Felipe Damasceno</span>
                    <span className="text-xs text-gray-500 mt-1 max-w-[200px]">A ser substituída por foto oficial do conselheiro</span>
                  </div>
                  <div className="relative z-10 border-t border-gray-800/80 pt-3">
                    <span className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider block">Felipe Damasceno</span>
                    <span className="text-[10px] text-gray-400 uppercase block tracking-widest mt-0.5">Conselheiro Estratégico de Escala</span>
                  </div>
                </div>
              </div>
              <div className="col-span-7 flex flex-col justify-center">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-3">A Trajetória</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight mb-3">
                  EU NÃO APRENDI ISSO APENAS ESTUDANDO EMPRESAS.<br/>
                  <span className="text-gold-premium">EU APRENDI CONSTRUINDO.</span>
                </h2>
                <p className="text-sm text-gray-400 mb-6 font-light leading-relaxed">
                  Eu conheço os dois lados da moeda: sei a emoção de crescer um negócio de alta velocidade e sei a dor física e mental de se tornar refém dele.
                </p>
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="border-l border-[#d4af37]/40 pl-4">
                    <span className="block text-2xl font-heading font-extrabold text-white">+15 Anos</span>
                    <span className="block text-[10px] text-gray-500 uppercase tracking-wider mt-1">Negócios, Tech e Educação</span>
                  </div>
                  <div className="border-l border-[#d4af37]/40 pl-4">
                    <span className="block text-2xl font-heading font-extrabold text-white">+R$ 100M</span>
                    <span className="block text-[10px] text-gray-500 uppercase tracking-wider mt-1">Faturados no 1º Ano da Op</span>
                  </div>
                  <div className="border-l border-[#d4af37]/40 pl-4">
                    <span className="block text-2xl font-heading font-extrabold text-white">+2.800</span>
                    <span className="block text-[10px] text-gray-500 uppercase tracking-wider mt-1">Empresários Acelerados</span>
                  </div>
                </div>
                
                {/* Associated Companies Logos */}
                <div className="border-t border-gray-800/80 pt-4">
                  <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-3">Marcas & Projetos Associados</span>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 opacity-55">
                    {['XGrow', 'EventX', 'D360', 'ADVAI', 'E3T', 'NeuroVerse'].map((logo, idx) => (
                      <span key={idx} className="text-xs font-heading font-bold text-gray-400 uppercase tracking-wider border border-gray-800 px-2 py-0.5 rounded bg-white/5">
                        {logo}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: A HISTÓRIA */}
          {currentSlide === 2 && (
            <div className="flex flex-col justify-center h-full">
              <div className="mb-6">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">O Contraste do Sucesso</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white">
                  EU CONSTRUÍ UMA EMPRESA DE R$100 MILHÕES.<br/>
                  <span className="text-gold-premium">E ME TORNEI REFÉM DELA.</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="premium-card p-6 rounded-xl border-t-2 border-t-emerald-600/50">
                  <div className="flex items-center gap-2 text-emerald-500 mb-3">
                    <TrendingUp className="w-5 h-5" />
                    <h3 className="font-heading font-bold text-base uppercase tracking-wider">CRESCIMENTO EXCEPCIONAL</h3>
                  </div>
                  <ul className="space-y-2.5 text-xs text-gray-400 font-light">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Equipe contratada e escalada semanalmente.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Milhares de clientes ativos em escala nacional.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Faturamento escalando para os múltiplos 8 dígitos.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Reconhecimento de mercado e prêmios de inovação.
                    </li>
                  </ul>
                </div>

                <div className="premium-card p-6 rounded-xl border-t-2 border-t-red-700/50">
                  <div className="flex items-center gap-2 text-[#d4af37] mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                    <h3 className="font-heading font-bold text-base uppercase tracking-wider text-white">DEPENDÊNCIA EXTREMA</h3>
                  </div>
                  <ul className="space-y-2.5 text-xs text-gray-400 font-light">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Decisões diárias centralizadas 100% no fundador.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Reuniões de alinhamento constantes e urgências.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Gargalos operacionais por falta de autonomia gerencial.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Incapacidade de se afastar sem que o caos se instale.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-l-4 border-[#d4af37] bg-white/2 p-4 rounded-r-lg max-w-3xl mx-auto w-full text-center">
                <p className="text-sm font-heading font-bold text-white italic">
                  "O problema não era falta de sucesso. Era o sucesso depender demais de mim."
                </p>
              </div>
            </div>
          )}

          {/* SLIDE 4: O ESPELHO DO EMPRESÁRIO */}
          {currentSlide === 3 && (
            <div className="grid grid-cols-12 gap-8 items-center h-full">
              <div className="col-span-5 flex flex-col justify-center">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-3">O Retrato da Operação</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight mb-4">
                  A EMPRESA CRESCEU.<br/>
                  <span className="text-red-500 font-accent">MAS VOCÊ VIROU O SISTEMA</span> QUE FAZ TUDO FUNCIONAR.
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed font-light mb-4">
                  Quando a empresa cresce em faturamento e estrutura, mas mantém a arquitetura de decisões centralizada, a engrenagem suga toda a energia e tempo do fundador.
                </p>
                <div className="p-4 bg-white/2 border border-gray-800 rounded-lg">
                  <p className="text-xs text-gray-300 font-medium">
                    Quando tudo precisa passar pelo dono, crescimento deixa de significar liberdade e começa a gerar complexidade.
                  </p>
                </div>
              </div>
              <div className="col-span-7 flex justify-center">
                {/* Visual Radial Diagram */}
                <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
                  
                  {/* Central Node: Dono */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ffd700] to-[#b8860b] flex flex-col items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(212,175,55,0.4)] z-10">
                    <span className="text-black font-heading font-extrabold text-sm uppercase tracking-wider">DONO</span>
                    <span className="text-black/80 font-mono text-[8px] uppercase tracking-widest">Gargalo</span>
                  </div>

                  {/* Satellite Nodes */}
                  {[
                    { label: 'Comercial', angle: 0, text: 'Aprovação de propostas' },
                    { label: 'Operação', angle: 60, text: 'Resolvendo problemas' },
                    { label: 'Equipe', angle: 120, text: 'Dúvidas constantes' },
                    { label: 'Financeiro', angle: 180, text: 'Liberação de contas' },
                    { label: 'Clientes', angle: 240, text: 'Atendimento direto' },
                    { label: 'Decisões', angle: 300, text: 'Validações diárias' }
                  ].map((node, idx) => {
                    const radius = 130; // distance from center
                    const radian = (node.angle * Math.PI) / 180;
                    const x = Math.cos(radian) * radius;
                    const y = Math.sin(radian) * radius;

                    return (
                      <div 
                        key={idx} 
                        className="absolute flex flex-col items-center"
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                      >
                        <div className="px-3 py-1.5 rounded-lg bg-[#0e1625]/90 border border-gray-800 flex flex-col items-center shadow-lg w-28 text-center hover:border-[#d4af37]/50 transition-colors">
                          <span className="text-[10px] font-bold text-white uppercase">{node.label}</span>
                          <span className="text-[8px] text-gray-500 mt-0.5 leading-tight">{node.text}</span>
                        </div>
                        {/* Connecting Line (Styled abstractly) */}
                        <div 
                          className="absolute w-[2px] bg-gradient-to-t from-[#d4af37]/45 to-transparent z-0" 
                          style={{
                            height: '60px',
                            top: node.angle < 180 ? '-60px' : '30px',
                            transform: `rotate(${node.angle + 90}deg)`,
                            transformOrigin: 'bottom center'
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: O CUSTO DA DEPENDÊNCIA */}
          {currentSlide === 4 && (
            <div className="flex flex-col justify-center h-full">
              <div className="mb-6">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">Cálculo de Risco</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white">
                  O CUSTO INVISÍVEL DE UMA <br/>
                  <span className="text-gold-premium">EMPRESA DEPENDENTE DO DONO</span>
                </h2>
              </div>
              <div className="grid grid-cols-4 gap-5 mb-8">
                {[
                  { title: 'TEMPO', desc: 'Horas de valor intelectual desperdiçadas resolvendo atritos operacionais diários que poderiam ser automatizados ou delegados.' },
                  { title: 'DECISÕES', desc: 'A velocidade de inovação e entrega fica limitada pela capacidade física da agenda do fundador.' },
                  { title: 'CRESCIMENTO', desc: 'Gargalo comercial. Escalar as vendas gera caos de entrega, forçando o dono a travar novos negócios.' },
                  { title: 'VALOR E RISCO', desc: 'Frágil e não-vendável. Empresas excessivamente dependentes do fundador não constroem equity real.' }
                ].map((cost, idx) => (
                  <div key={idx} className="premium-card p-5 rounded-xl flex flex-col justify-between min-h-[220px]">
                    <div>
                      <div className="w-8 h-8 rounded bg-[#d4af37]/5 flex items-center justify-center border border-[#d4af37]/20 mb-3">
                        <span className="text-xs font-bold text-[#d4af37]">{idx + 1}</span>
                      </div>
                      <h3 className="font-heading font-bold text-sm text-white mb-2 uppercase tracking-wide">{cost.title}</h3>
                      <p className="text-[11px] text-gray-400 font-light leading-relaxed">{cost.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <span className="text-sm font-heading font-bold uppercase tracking-wider text-white">
                  QUANTO CUSTA SUA EMPRESA CONTINUAR DEPENDENDO DE VOCÊ POR MAIS 12 MESES?
                </span>
              </div>
            </div>
          )}

          {/* SLIDE 6: POR QUE DELEGAR NÃO RESOLVEU */}
          {currentSlide === 5 && (
            <div className="grid grid-cols-12 gap-8 items-center h-full">
              <div className="col-span-5 flex flex-col justify-center">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-3">Quebra de Objeção</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight mb-4">
                  DELEGAR TAREFAS NÃO É<br/>
                  <span className="text-gold-premium">TRANSFERIR RESPONSABILIDADE.</span>
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed font-light mb-4">
                  Se você simplesmente passa tarefas adiante sem o arcabouço estrutural necessário, cria uma alça de feedback que devolve o problema e gera frustração de que "ninguém faz como eu".
                </p>
                <div className="p-4 bg-white/2 border border-gray-800 rounded-lg">
                  <p className="text-xs text-gray-300 font-medium italic">
                    "Você não precisa simplesmente delegar mais. Precisa construir uma estrutura onde a delegação consiga sobreviver sem você."
                  </p>
                </div>
              </div>
              <div className="col-span-7 flex flex-col gap-6">
                
                {/* O Fluxo Ruim */}
                <div className="premium-card p-4 rounded-xl border-l-4 border-l-red-500/50">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-red-500 font-bold block mb-2">FLUXO INADEQUADO</span>
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="bg-white/5 px-2.5 py-1 rounded">Dono centraliza</span>
                    <ArrowRight className="w-4 h-4 text-red-500" />
                    <span className="bg-white/5 px-2.5 py-1 rounded">Delega tarefa operacional</span>
                    <ArrowRight className="w-4 h-4 text-red-500" />
                    <span className="bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded text-red-500">Problema surge</span>
                    <ArrowRight className="w-4 h-4 text-red-500" />
                    <span className="bg-white/5 px-2.5 py-1 rounded">Volta ao dono</span>
                  </div>
                </div>

                {/* O Fluxo Correto */}
                <div className="premium-card p-4 rounded-xl border-l-4 border-l-[#d4af37]">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-[#d4af37] font-bold block mb-2">ESTRUTURA DE AUTONOMIA REAL</span>
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-5 gap-2 text-[10px] text-center text-gray-400">
                      <div className="p-2 bg-white/5 border border-gray-800 rounded flex flex-col justify-between">
                        <span className="font-bold text-white mb-1">PAPEL</span>
                        <span>Quem executa</span>
                      </div>
                      <div className="p-2 bg-white/5 border border-gray-800 rounded flex flex-col justify-between">
                        <span className="font-bold text-white mb-1">ALÇADA</span>
                        <span>Poder de decisão</span>
                      </div>
                      <div className="p-2 bg-white/5 border border-gray-800 rounded flex flex-col justify-between">
                        <span className="font-bold text-white mb-1">PROCESSO</span>
                        <span>Como fazer</span>
                      </div>
                      <div className="p-2 bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded flex flex-col justify-between">
                        <span className="font-bold text-[#3b82f6] mb-1">MÉTRICA</span>
                        <span>Como avaliar</span>
                      </div>
                      <div className="p-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded flex flex-col justify-between">
                        <span className="font-bold text-[#d4af37] mb-1">CADÊNCIA</span>
                        <span>Acompanhar</span>
                      </div>
                    </div>
                    <div className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-wider mt-1 bg-white/5 p-1.5 rounded">
                      = Autonomia Executiva Real
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SLIDE 7: A CAUSA-RAIZ */}
          {currentSlide === 6 && (
            <div className="flex flex-col justify-center h-full">
              <div className="mb-8">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">Diagnóstico de Gestão</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white">
                  SUA EMPRESA CRESCEU.<br/>
                  <span className="text-gold-premium">SEU MODELO DE GESTÃO NÃO CRESCEU JUNTO.</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="premium-card p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/3 rounded-bl-full pointer-events-none" />
                  <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest block mb-4">MODELO ANTERIOR (Centralizado)</span>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center font-bold text-red-500 text-xs shrink-0">F</div>
                      <div>
                        <span className="block text-xs font-bold text-white uppercase">FAZER</span>
                        <span className="block text-[11px] text-gray-500 font-light mt-0.5">Fundador executa diretamente tarefas táticas.</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center font-bold text-red-500 text-xs shrink-0">C</div>
                      <div>
                        <span className="block text-xs font-bold text-white uppercase">CONTROLAR</span>
                        <span className="block text-[11px] text-gray-500 font-light mt-0.5">Cobranças constantes baseadas em sentimento, sem clareza.</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center font-bold text-red-500 text-xs shrink-0">C</div>
                      <div>
                        <span className="block text-xs font-bold text-white uppercase">CENTRALIZAR</span>
                        <span className="block text-[11px] text-gray-500 font-light mt-0.5">Todas as pendências orbitam a agenda do proprietário.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="premium-card p-6 rounded-xl relative overflow-hidden border-l-2 border-l-[#d4af37]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/3 rounded-bl-full pointer-events-none" />
                  <span className="text-xs font-mono font-bold text-[#d4af37] uppercase tracking-widest block mb-4">MODELO DE GOVERNO (Escalável)</span>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center font-bold text-[#d4af37] text-xs shrink-0">D</div>
                      <div>
                        <span className="block text-xs font-bold text-white uppercase">DIRECIONAR</span>
                        <span className="block text-[11px] text-gray-400 font-light mt-0.5">Definir rumos, prioridades estratégicas e visão da empresa.</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center font-bold text-[#d4af37] text-xs shrink-0">D</div>
                      <div>
                        <span className="block text-xs font-bold text-white uppercase">DELEGAR E ALOCAR</span>
                        <span className="block text-[11px] text-gray-400 font-light mt-0.5">Estabelecer papéis e transferir a responsabilidade total aos líderes.</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center font-bold text-[#3b82f6] text-xs shrink-0">M</div>
                      <div>
                        <span className="block text-xs font-bold text-white uppercase">MEDIR E GOVERNAR</span>
                        <span className="block text-[11px] text-gray-400 font-light mt-0.5">Avaliar o progresso de forma objetiva por indicadores estruturados.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-3">
                <span className="text-xs text-gray-500 uppercase tracking-widest">
                  "Sua empresa não precisa que você trabalhe mais. Ela precisa que você ocupe um novo lugar dentro dela."
                </span>
              </div>
            </div>
          )}

          {/* SLIDE 8: A TRANSFORMAÇÃO */}
          {currentSlide === 7 && (
            <div className="flex flex-col justify-center h-full">
              <div className="mb-6">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">A Meta do Programa</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white">
                  A TRANSFORMAÇÃO:<br/>
                  <span className="text-gold-premium">DE EMPRESÁRIO OPERACIONAL A EMPRESÁRIO QUE GOVERNA</span>
                </h2>
              </div>
              <div className="grid grid-cols-12 gap-6 items-center">
                <div className="col-span-4 bg-white/2 border border-gray-800 p-6 rounded-xl min-h-[220px] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block mb-3">PERFIL OPERACIONAL</span>
                    <ul className="space-y-2 text-[11px] text-gray-400">
                      <li className="flex items-center gap-2">❌ Apaga incêndios operacionais diariamente.</li>
                      <li className="flex items-center gap-2">❌ Centraliza todas as chaves de decisão.</li>
                      <li className="flex items-center gap-2">❌ Cobra por sensação ou cansaço.</li>
                      <li className="flex items-center gap-2">❌ É o principal executor da operação.</li>
                      <li className="flex items-center gap-2">❌ Virou o gargalo do crescimento.</li>
                    </ul>
                  </div>
                </div>
                
                <div className="col-span-1 flex justify-center">
                  <ArrowRight className="w-6 h-6 text-[#d4af37]" />
                </div>

                <div className="col-span-7 grid grid-cols-3 gap-4">
                  {[
                    { title: 'PESSOAS', key: 'Liderança', text: 'Lideranças maduras e autônomas assumem responsabilidades operacionais, de contratação e de entrega.' },
                    { title: 'PROCESSOS', key: 'Rotinas', text: 'Engrenagem corporativa funciona com fluxos de processos documentados, alçadas e cadências estratégicas.' },
                    { title: 'INDICADORES', key: 'Decisões', text: 'Visibilidade total da empresa através de dados precisos (IDE, CLO, KPIs). Decisões baseadas em números.' }
                  ].map((pilar, idx) => (
                    <div key={idx} className="premium-card p-4 rounded-xl flex flex-col justify-between min-h-[220px]">
                      <div>
                        <span className="text-[9px] text-[#d4af37] font-mono tracking-wider block mb-2">{pilar.key}</span>
                        <h3 className="font-heading font-bold text-xs text-white uppercase mb-2">{pilar.title}</h3>
                        <p className="text-[10px] text-gray-400 font-light leading-relaxed">{pilar.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-800/80 pt-4 mt-6 text-center">
                <p className="text-xs text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
                  <strong>Governar não é fazer tudo.</strong> É construir uma empresa capaz de funcionar, crescer e executar sem depender de você para tudo.
                </p>
              </div>
            </div>
          )}

          {/* SLIDE 9: A SOLUÇÃO */}
          {currentSlide === 8 && (
            <div className="grid grid-cols-12 gap-8 items-center h-full">
              <div className="col-span-5 flex flex-col justify-center">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-3">O Programa</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight mb-4">
                  PROGRAMA <br/>
                  <span className="text-gold-premium">GOVERNO EMPRESARIAL</span>
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed font-light mb-4">
                  Uma jornada estratégica presencial e online de 12 meses desenvolvida para remodelar a estrutura executiva da sua empresa, garantindo autonomia, processos sólidos e controle métrico.
                </p>
                <div className="p-4 bg-white/2 border border-gray-800 rounded-lg">
                  <p className="text-xs text-gray-300 font-medium">
                    Não aplicamos uma receita pronta. Cada empresa terá um roadmap diferente porque cada empresário está preso à operação por motivos diferentes.
                  </p>
                </div>
              </div>
              <div className="col-span-7 flex justify-center">
                {/* Visual Pyramid Levels */}
                <div className="w-full max-w-[420px] flex flex-col gap-3">
                  {[
                    { lvl: 'Nível 4', name: 'GOVERNO', desc: 'Conselho Estratégico, Visão, Parcerias, Expansão e Legado', bg: 'bg-[#d4af37]/15 border-[#d4af37]/40 text-[#d4af37]' },
                    { lvl: 'Nível 3', name: 'LIDERANÇA', desc: 'Gestores autônomos, alçadas e responsabilidades táticas', bg: 'bg-white/5 border-gray-800 text-slate-300' },
                    { lvl: 'Nível 2', name: 'GESTÃO', desc: 'Métricas, CRMs, Processos Críticos e Cadências estruturadas', bg: 'bg-white/5 border-gray-800 text-slate-400' },
                    { lvl: 'Nível 1', name: 'OPERAÇÃO', desc: 'Agentes de IA, Automações de dados, Rotinas e POPs operacionais', bg: 'bg-white/5 border-gray-800 text-slate-500' }
                  ].map((level, idx) => (
                    <div key={idx} className={`p-3.5 rounded-xl border flex items-center gap-4 transition-all hover:-translate-y-0.5 ${level.bg}`}>
                      <div className="w-12 text-center border-r border-gray-800 pr-3 font-mono text-[9px] uppercase tracking-wider font-bold shrink-0">
                        {level.lvl}
                      </div>
                      <div className="flex-grow">
                        <span className="block text-xs font-bold uppercase tracking-wider">{level.name}</span>
                        <span className="block text-[10px] opacity-75 font-light mt-0.5 leading-relaxed">{level.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 10: MÉTODO POTÊNCIA EMPRESARIAL */}
          {currentSlide === 9 && (
            <div className="flex flex-col justify-center h-full">
              <div className="mb-6">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">O Mecanismo Único</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white">
                  MÉTODO <span className="text-gold-premium">POTÊNCIA EMPRESARIAL</span>
                </h2>
              </div>
              <div className="grid grid-cols-12 gap-8 items-center">
                <div className="col-span-5 flex flex-col gap-4">
                  <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider border-b border-gray-800 pb-2">Os Instrumentos Diagnósticos</h3>
                  
                  <div className="p-4 bg-white/2 border border-gray-800 rounded-xl">
                    <span className="text-[10px] text-[#3b82f6] font-mono tracking-widest font-bold uppercase block mb-1">Diagnóstico 1</span>
                    <span className="text-xs font-bold text-white uppercase block">IDE — Índice de Dependência Empresarial</span>
                    <p className="text-[10px] text-gray-400 mt-1 font-light leading-relaxed">
                      Mede exatamente quanto e em quais áreas da operação (vendas, finanças, entrega) a empresa ainda depende das decisões do fundador.
                    </p>
                  </div>

                  <div className="p-4 bg-white/2 border border-gray-800 rounded-xl">
                    <span className="text-[10px] text-[#10b981] font-mono tracking-widest font-bold uppercase block mb-1">Diagnóstico 2</span>
                    <span className="text-xs font-bold text-white uppercase block">CLO — Calculadora de Liberdade Operacional</span>
                    <p className="text-[10px] text-gray-400 mt-1 font-light leading-relaxed">
                      Mapeia a agenda, horas semanais e carga mental do fundador que ainda estão sequestradas por rotinas táticas e emergenciais.
                    </p>
                  </div>
                </div>

                <div className="col-span-7 flex flex-col gap-6">
                  <div className="text-center p-3 bg-white/3 border border-gray-800 rounded-lg">
                    <span className="font-heading font-bold text-xs text-white">IDE + CLO = MAPA DA DEPENDÊNCIA CORPORATIVA</span>
                  </div>

                  <div className="flex items-center justify-between gap-1 relative pt-4">
                    {/* Process Steps */}
                    {[
                      { step: '01', title: 'DIAGNOSTICAR', desc: 'Mapear IDE + CLO' },
                      { step: '02', title: 'ORGANIZAR', desc: 'Responsabilidades RACI' },
                      { step: '03', title: 'DELEGAR', desc: 'Papel, alçada e autonomia' },
                      { step: '04', title: 'AUTOMATIZAR', desc: 'Implantação de IAs e CRM' },
                      { step: '05', title: 'GOVERNAR', desc: 'Acompanhar indicadores' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex-grow flex flex-col items-center text-center px-1.5 relative group">
                        <div className="w-10 h-10 rounded-full border border-gray-850 bg-[#0c1625] flex items-center justify-center group-hover:border-[#d4af37]/60 transition-colors mb-2 relative z-10 shadow-md">
                          <span className="text-xs font-bold font-mono text-[#d4af37]">{item.step}</span>
                        </div>
                        <span className="block text-[9px] font-bold text-white uppercase tracking-wider">{item.title}</span>
                        <span className="block text-[8px] text-gray-500 mt-0.5 max-w-[100px] leading-tight">{item.desc}</span>
                        {idx < 4 && (
                          <div className="absolute top-5 -right-1/2 w-full h-[1px] bg-gray-800 z-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 11: ROADMAP ESTRATÉGICO */}
          {currentSlide === 10 && (
            <div className="grid grid-cols-12 gap-8 items-center h-full">
              <div className="col-span-5 flex flex-col justify-center">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-3">A Implementação</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight mb-4">
                  O QUE PRECISA SAIR DA<br/>
                  <span className="text-gold-premium">SUA MÃO PRIMEIRO?</span>
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed font-light mb-4">
                  Após o cruzamento do IDE e do CLO, montamos um plano de transição sob medida: o **Roadmap Estratégico**, determinando prioridades e donos de responsabilidades.
                </p>
                <div className="p-4 bg-white/2 border border-gray-800 rounded-lg">
                  <p className="text-xs text-gray-300 font-medium">
                    "Não entregamos uma lista de tarefas. Construímos uma agenda estratégica de transformação para sua governança."
                  </p>
                </div>
              </div>
              <div className="col-span-7 flex justify-center">
                {/* Visual Roadmap Board Mockup */}
                <div className="w-full max-w-[460px] premium-card p-6 rounded-xl border border-gray-800 flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Prioridades do Roadmap</span>
                    <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded font-mono">12 Meses</span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { area: 'LIDERANÇA', act: 'Formar gestor para o setor de atendimento', status: 'Fase 1' },
                      { area: 'COMERCIAL', act: 'Migrar proposta comercial para o CRM e automatizar alçada', status: 'Fase 1' },
                      { area: 'PROCESSOS', act: 'Documentação dos POPs operacionais de vendas e finanças', status: 'Fase 2' },
                      { area: 'DELEGAÇÃO', act: 'Aplicar Matriz RACI nas decisões de faturamento', status: 'Fase 2' },
                      { area: 'AUTOMAÇÃO', act: 'Integrar agentes de IA para triagem de leads no digital', status: 'Fase 3' },
                      { area: 'INDICADORES', act: 'Implantar dashboard executivo para tomada de decisões', status: 'Fase 3' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-white/2 border border-gray-900 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                          <div>
                            <span className="block text-[8px] font-mono text-[#d4af37] font-bold uppercase tracking-wider">{item.area}</span>
                            <span className="block text-[10px] text-slate-300 font-light mt-0.5">{item.act}</span>
                          </div>
                        </div>
                        <span className="text-[8px] font-mono bg-white/5 text-gray-500 border border-gray-800 px-1.5 py-0.5 rounded">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 12: CONSELHO ESTRATÉGICO DE ESCALA */}
          {currentSlide === 11 && (
            <div className="grid grid-cols-12 gap-8 items-center h-full">
              <div className="col-span-5 flex flex-col justify-center">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-3">Acompanhamento</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight mb-3">
                  NÃO ENTREGAMOS UM PLANO <br/>
                  <span className="text-gold-premium">E DESEJAMOS BOA SORTE.</span>
                </h2>
                <span className="text-xs font-heading font-bold text-white mb-4 block">
                  Você tem um Conselheiro Estratégico ao seu lado durante 12 meses.
                </span>
                <p className="text-xs text-gray-400 leading-relaxed font-light mb-4">
                  Eu estarei pessoalmente guiando a implementação operacional e liderando o alinhamento com seus gestores para garantir que a transição ocorra de forma segura e sem perdas de receita.
                </p>
                <div className="p-4 bg-white/2 border border-gray-800 rounded-lg">
                  <p className="text-xs text-gray-300 font-medium italic">
                    "Meu papel não é operar sua empresa por você. É ajudá-lo a construir as pessoas, a estrutura e a cadência para que você não precise continuar operando tudo."
                  </p>
                </div>
              </div>
              <div className="col-span-7 flex flex-col gap-6">
                
                {/* Loop Ciclo */}
                <div className="flex items-center justify-between p-4 bg-[#0e1625]/90 border border-gray-800 rounded-xl text-xs font-bold text-white text-center">
                  {['DECIDIR', 'EXECUTAR', 'MEDIR', 'CORRIGIR', 'AVANÇAR'].map((cycle, idx) => (
                    <div key={idx} className="flex-grow flex items-center justify-center gap-2" key={idx}>
                      <span className="bg-white/5 border border-gray-800 px-3 py-1.5 rounded hover:border-[#d4af37]/50 transition-colors">
                        {cycle}
                      </span>
                      {idx < 4 && <span className="text-[#d4af37] font-mono">→</span>}
                    </div>
                  ))}
                </div>

                {/* Key deliveries cards */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="premium-card p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] text-[#d4af37] font-mono block mb-1">ALINHAMENTO</span>
                      <h4 className="font-bold text-white mb-2 uppercase">Cadência Estratégica</h4>
                      <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                        Reuniões mensais de conselho executivo para analisar prioridades, corrigir rotas e destrancar gargalos.
                      </p>
                    </div>
                  </div>
                  
                  <div className="premium-card p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] text-[#3b82f6] font-mono block mb-1">EXPANSÃO</span>
                      <h4 className="font-bold text-white mb-2 uppercase">Escala e Educação</h4>
                      <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                        Assessoria para expansão do negócio, incluindo a construção do Modelo Educacional da empresa se necessário.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SLIDE 13: COMO MEDIMOS A TRANSFORMAÇÃO */}
          {currentSlide === 12 && (
            <div className="flex flex-col justify-center h-full">
              <div className="mb-4">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">Governo com Dados</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white">
                  AQUILO QUE NÃO MEDIMOS VIRA SENSAÇÃO.<br/>
                  <span className="text-gold-premium">AQUILO QUE MEDIMOS VIRA GESTÃO.</span>
                </h2>
              </div>
              <div className="grid grid-cols-12 gap-8 items-center">
                <div className="col-span-5 flex flex-col gap-3 text-xs">
                  <p className="text-gray-400 font-light leading-relaxed mb-2">
                    A evolução do programa não é medida por "sensação de melhora". Nós criamos indicadores de governança que mostram claramente a redução da centralização do fundador.
                  </p>
                  
                  {[
                    { label: 'Índice de Dependência (IDE)', now: '90%', target: 'Abaixo de 20%', desc: 'Nota que mede a presença do dono em rotinas críticas.' },
                    { label: 'Liberdade Operacional (CLO)', now: '15%', target: 'Acima de 80%', desc: 'Porcentagem de tempo livre para planejamento estratégico.' },
                    { label: 'Autonomia das Lideranças', now: 'Muito Baixa', target: 'Nível Avançado', desc: 'Capacidade do time de gerir prioridades e alçadas.' }
                  ].map((met, idx) => (
                    <div key={idx} className="p-3 bg-white/2 border border-gray-900 rounded-lg flex flex-col justify-between">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-white text-[11px] uppercase">{met.label}</span>
                        <span className="text-[#d4af37] text-[10px] font-mono">{met.target}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 font-light">{met.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="col-span-7 flex justify-center">
                  {/* Conceptual Dashboard Mockup */}
                  <div className="w-full max-w-[460px] premium-card p-5 rounded-xl border border-gray-800 flex flex-col gap-4">
                    <span className="text-[10px] font-mono text-[#3b82f6] uppercase tracking-wider block border-b border-gray-850 pb-2">
                      Dashboard Conceitual de Governança
                    </span>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Metric 1 */}
                      <div className="p-3 bg-black/20 rounded-lg border border-gray-900">
                        <span className="block text-[8px] text-gray-500 uppercase font-mono">IDE (Dependência)</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xl font-heading font-extrabold text-red-500">18%</span>
                          <span className="text-[9px] text-gray-600 line-through">92% Inicial</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-900 rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-red-500" style={{ width: '18%' }} />
                        </div>
                      </div>
                      
                      {/* Metric 2 */}
                      <div className="p-3 bg-black/20 rounded-lg border border-gray-950">
                        <span className="block text-[8px] text-gray-500 uppercase font-mono">CLO (Liberdade)</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xl font-heading font-extrabold text-emerald-500">85%</span>
                          <span className="text-[9px] text-gray-600">15% Inicial</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-900 rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: '85%' }} />
                        </div>
                      </div>

                      {/* Metric 3 */}
                      <div className="p-3 bg-black/20 rounded-lg border border-gray-900">
                        <span className="block text-[8px] text-gray-500 uppercase font-mono">Decisões que Chegam ao Dono</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xl font-heading font-extrabold text-white">12%</span>
                          <span className="text-[9px] text-red-500 font-mono">-88%</span>
                        </div>
                      </div>

                      {/* Metric 4 */}
                      <div className="p-3 bg-black/20 rounded-lg border border-gray-900">
                        <span className="block text-[8px] text-gray-500 uppercase font-mono">Processos Críticos Ativos</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xl font-heading font-extrabold text-[#d4af37]">100%</span>
                          <span className="text-[9px] text-gray-500">Implantados</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[8px] text-gray-500 text-center block mt-1">
                      *Gráficos conceituais. A velocidade e os números exatos dependem da estrutura de cada empresa.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 14: ROI / CUSTO DE NÃO AGIR */}
          {currentSlide === 13 && (
            <div className="flex flex-col justify-center h-full">
              <div className="mb-6">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">Matemática de Escala</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white">
                  QUANTO VALE REDUZIR A <br/>
                  <span className="text-gold-premium">DEPENDÊNCIA DA SUA EMPRESA?</span>
                </h2>
              </div>
              <div className="grid grid-cols-12 gap-8 items-center mb-6">
                <div className="col-span-5 flex flex-col justify-center gap-4">
                  <div className="premium-card p-5 rounded-xl border-l-4 border-l-red-500/50">
                    <span className="text-[9px] text-red-500 font-mono block mb-1">O CUSTO DA OPERAÇÃO</span>
                    <div className="text-xs text-slate-300 font-light space-y-1.5">
                      <div className="flex justify-between border-b border-gray-900 pb-1.5">
                        <span>Horas semanais na operação:</span>
                        <strong className="text-white">20 horas</strong>
                      </div>
                      <div className="flex justify-between border-b border-gray-900 pb-1.5">
                        <span>Semanas comerciais por ano:</span>
                        <strong className="text-white">48 semanas</strong>
                      </div>
                      <div className="flex justify-between text-[#d4af37] font-bold pt-1">
                        <span>Total de tempo desperdiçado:</span>
                        <span>960 horas/ano</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white/2 border border-gray-800 rounded-lg">
                    <p className="text-[11px] text-gray-400 leading-relaxed font-light">
                      Se o seu tempo estratégico vale R$ 200/hora, são R$ 192.000 ao ano queimados na operação. Se vale R$ 500/hora, são R$ 480.000.
                    </p>
                  </div>
                </div>

                <div className="col-span-7 grid grid-cols-2 gap-4">
                  {[
                    { title: 'Decisões Rápidas', desc: 'Processo ágil sem precisar que você esteja presente para validar.' },
                    { title: 'Menos Retrabalho', desc: 'POPs claros garantem consistência nas entregas diárias.' },
                    { title: 'Líderes Autônomos', desc: 'Gestores de alto nível capacitados e com poder de decisão.' },
                    { title: 'Expansão e Inovação', desc: 'Tempo livre para você focar no que realmente multiplica o negócio.' }
                  ].map((roi, idx) => (
                    <div key={idx} className="premium-card p-4 rounded-xl flex flex-col justify-between">
                      <div>
                        <div className="w-6 h-6 rounded-full bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/30 mb-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                        </div>
                        <h4 className="font-heading font-bold text-xs text-white uppercase mb-1">{roi.title}</h4>
                        <p className="text-[10px] text-gray-400 font-light leading-relaxed">{roi.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <span className="text-sm font-heading font-bold text-red-500 uppercase tracking-widest">
                  QUAL É O CUSTO DE CONTINUAR ASSIM POR MAIS 12 MESES?
                </span>
              </div>
            </div>
          )}

          {/* SLIDE 15: FECHAMENTO */}
          {currentSlide === 14 && (
            <div className="grid grid-cols-12 gap-8 items-center h-full">
              <div className="col-span-7 flex flex-col justify-center">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.35em] mb-3">O Chamado</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight mb-4">
                  SUA EMPRESA JÁ CRESCEU.<br/>
                  <span className="text-gold-premium">AGORA É HORA DE GOVERNAR.</span>
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed font-light mb-6">
                  Assuma o controle de verdade. Não dependa de furos na agenda ou noites em claro para que a empresa continue de pé. Conecte sua verdade com a engrenagem executiva do seu negócio.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      SUA EMPRESA VAI CONTINUAR DEPENDENDO DE VOCÊ PARA CRESER?
                    </span>
                    <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">
                      OU ESTÁ NA HORA DE VOCÊ ASSUMIR O GOVERNO?
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => alert('Parabéns por iniciar o Diagnóstico. Felipe Damasceno entrará em contato.')}
                    className="px-8 py-3.5 btn-gold rounded-lg flex items-center gap-3 text-xs uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105 transition-all cursor-pointer"
                  >
                    Iniciar Diagnóstico de Governo Empresarial
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>

              <div className="col-span-5 flex justify-center">
                <div className="w-full max-w-[340px] premium-card p-6 rounded-2xl border-2 border-[#d4af37] flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/5 rounded-bl-full pointer-events-none" />
                  
                  <div className="border-b border-gray-800 pb-3">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#d4af37] font-bold">Programa High Ticket</span>
                    <h3 className="text-base font-heading font-extrabold text-white uppercase mt-0.5">GOVERNO EMPRESARIAL</h3>
                    <p className="text-[9px] text-gray-500 font-mono mt-1">12 MESES DE TRANSIÇÃO</p>
                  </div>

                  <div className="space-y-2 text-[10px] text-gray-400">
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                      Método Potência Empresarial
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                      Diagnósticos Iniciais IDE + CLO
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                      Roadmap Estratégico Personalizado
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                      Acompanhamento da Implementação
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                      Conselho Estratégico de Escala
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3 mt-2">
                    <span className="block text-[9px] text-gray-500 uppercase tracking-widest">Investimento Anual</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-heading font-extrabold text-white">R$ 80.000</span>
                      <span className="text-[10px] text-gray-500 font-medium">À vista</span>
                    </div>
                  </div>

                  <span className="text-[9px] text-gray-500 block leading-relaxed italic border-t border-gray-850 pt-3 text-center">
                    "O investimento não é para ter mais informação. É para mudar a estrutura que ainda faz sua empresa depender de você."
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* FOOTER CONTROLS */}
      <footer className="px-10 py-5 flex items-center justify-between z-10 shrink-0 border-t border-[#1b2a3f]/25 bg-gradient-to-t from-[#060b13] to-transparent">
        
        {/* Previous Button */}
        <button 
          onClick={prevSlide}
          className={`flex items-center gap-2 text-xs font-accent tracking-wider uppercase transition-colors cursor-pointer ${currentSlide === 0 ? 'text-gray-600 pointer-events-none' : 'text-gray-400 hover:text-white'}`}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        {/* Slide progress index dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button 
              key={idx}
              onClick={() => jumpToSlide(idx)}
              className={`w-2.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-[#d4af37] w-6' : 'bg-gray-850 hover:bg-gray-700'}`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next Button / Slide indicator */}
        <div className="flex items-center gap-6">
          <span className="text-xs font-mono tracking-widest text-[#d4af37] font-bold">
            {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </span>
          <button 
            onClick={nextSlide}
            className={`flex items-center gap-2 text-xs font-accent tracking-wider uppercase transition-colors cursor-pointer ${currentSlide === totalSlides - 1 ? 'text-gray-600 pointer-events-none' : 'text-gray-400 hover:text-white'}`}
          >
            Próximo
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

    </div>
  );
}
