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
import felipeImg from '../assets/felipe.jpg';

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [slideDirection, setSlideDirection] = useState('next'); // 'next' or 'prev'
  const [radius, setRadius] = useState(165);
  const [activeLayer, setActiveLayer] = useState(0);
  const [activeNode, setActiveNode] = useState(0);
  const [hourlyRate, setHourlyRate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [strategicPercent, setStrategicPercent] = useState('20');
  const [annualGrowth, setAnnualGrowth] = useState('80');
  const [growthFromStrategy, setGrowthFromStrategy] = useState('50');
  const [calcState, setCalcState] = useState('idle'); // 'idle' | 'calculating' | 'done'
  const [calculatedOpportunityCost, setCalculatedOpportunityCost] = useState(0);
  const [calculatedStrategicInvestment, setCalculatedStrategicInvestment] = useState(0);
  const [calculatedActualReturn, setCalculatedActualReturn] = useState(0);
  const [calculatedLostGrowth, setCalculatedLostGrowth] = useState(0);
  
  // Slide 6 Calculator states
  const [delegatedTasks, setDelegatedTasks] = useState('10');
  const [returningTasks, setReturningTasks] = useState('7');
  const [reworkHours, setReworkHours] = useState('2');
  const [slide6CalcState, setSlide6CalcState] = useState('idle'); // 'idle' | 'calculating' | 'done'
  const [slide6HoursLost, setSlide6HoursLost] = useState(0);
  const [slide6TimeDrainPercent, setSlide6TimeDrainPercent] = useState(0);
  const [slide6MonthlyLoss, setSlide6MonthlyLoss] = useState(0);
  const [slide6AutonomyPercent, setSlide6AutonomyPercent] = useState(0);
  
  const totalSlides = 15;
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Monitor orientation and screen width on mobile/desktop
  useEffect(() => {
    const checkOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsPortrait(height > width && width < 768);
      
      if (width < 380) {
        setRadius(80);
      } else if (width < 480) {
        setRadius(95);
      } else if (width < 768) {
        setRadius(120);
      } else if (width < 1024) {
        setRadius(145);
      } else {
        // Desktop
        if (height < 700) {
          setRadius(150);
        } else {
          setRadius(175);
        }
      }
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // Loop highlight for Slide 1 government structure
  useEffect(() => {
    if (currentSlide === 0) {
      const interval = setInterval(() => {
        setActiveLayer((prev) => (prev + 1) % 4);
      }, 1800);
      return () => clearInterval(interval);
    }
  }, [currentSlide]);

  // Loop highlight for Slide 4 radial diagram
  useEffect(() => {
    if (currentSlide === 3) {
      const interval = setInterval(() => {
        setActiveNode((prev) => (prev + 1) % 6);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [currentSlide]);

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

  const handleCalculateCusto = (e) => {
    e.preventDefault();
    if (!hourlyRate || !hoursPerWeek || !annualGrowth) return;
    
    setCalcState('calculating');
    
    setTimeout(() => {
      const rate = parseFloat(hourlyRate);
      const hours = parseFloat(hoursPerWeek);
      const percent = parseFloat(strategicPercent) || 0;
      const growth = parseFloat(annualGrowth);
      const strategyFactor = parseFloat(growthFromStrategy) || 0;
      
      // Time calculations
      const total = rate * hours * 52;
      const strategic = total * (percent / 100);
      const opportunity = total - strategic;
      
      // Growth calculations (percentage-based)
      const strategicGrowthPortion = growth * (strategyFactor / 100);
      const actualReturn = strategicGrowthPortion;
      const lostGrowth = percent > 0 ? strategicGrowthPortion * ((100 - percent) / percent) : 0;
      
      setCalculatedOpportunityCost(opportunity);
      setCalculatedStrategicInvestment(strategic);
      setCalculatedActualReturn(actualReturn);
      setCalculatedLostGrowth(lostGrowth);
      setCalcState('done');
    }, 1500);
  };

  const handleCalculateSlide6 = (e) => {
    e.preventDefault();
    if (!delegatedTasks || !returningTasks || !reworkHours) return;
    
    setSlide6CalcState('calculating');
    
    setTimeout(() => {
      const delegated = parseFloat(delegatedTasks);
      const returning = parseFloat(returningTasks);
      const hours = parseFloat(reworkHours);
      
      const rate = parseFloat(hourlyRate) || 150;
      const totalHours = parseFloat(hoursPerWeek) || 40;
      const stratPercent = parseFloat(strategicPercent) || 20;
      
      const hoursLost = returning * hours;
      const operationalHours = totalHours * (1 - (stratPercent / 100));
      const drainPercent = operationalHours > 0 ? (hoursLost / operationalHours) * 100 : 0;
      const monthlyLoss = hoursLost * rate * 4.33;
      const autonomyPercent = delegated > 0 ? (1 - (returning / delegated)) * 100 : 0;
      
      setSlide6HoursLost(hoursLost);
      setSlide6TimeDrainPercent(drainPercent);
      setSlide6MonthlyLoss(monthlyLoss);
      setSlide6AutonomyPercent(autonomyPercent);
      setSlide6CalcState('done');
    }, 1500);
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

  const radiusX = radius * (typeof window !== 'undefined' && window.innerWidth < 768 ? 1.35 : 1.45);
  const radiusY = radius * (typeof window !== 'undefined' && window.innerWidth < 768 ? 1.05 : 1.15);

  return (
    <div 
      className="w-screen h-[100dvh] overflow-hidden bg-[#060b13] flex flex-col justify-between select-none font-sans relative text-gray-300 animate-fade-in"
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
          from { 
            transform: translateX(30px) scale(0.98); 
            opacity: 0;
            filter: blur(8px);
          }
          to { 
            transform: translateX(0) scale(1); 
            opacity: 1;
            filter: blur(0);
          }
        }
        @keyframes slideInLeft {
          from { 
            transform: translateX(-30px) scale(1.02); 
            opacity: 0;
            filter: blur(8px);
          }
          to { 
            transform: translateX(0) scale(1); 
            opacity: 1;
            filter: blur(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
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

        /* Responsive adjustments for mobile landscape and low viewports */
        @media (max-height: 640px) {
          header {
            padding: 0.5rem 2rem !important;
          }
          footer {
            padding: 0.5rem 2rem !important;
          }
          main {
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
            padding-top: 0.25rem !important;
            padding-bottom: 0.25rem !important;
          }
          
          /* Typography scaling */
          h1 {
            font-size: 2rem !important;
            line-height: 1.15 !important;
            margin-bottom: 0.5rem !important;
          }
          h2 {
            font-size: 1.35rem !important;
            line-height: 1.2 !important;
            margin-bottom: 0.35rem !important;
          }
          p {
            font-size: 0.7rem !important;
            line-height: 1.35 !important;
            margin-bottom: 0.35rem !important;
          }
          
          /* Slide layout cards and grids spacing */
          .premium-card {
            padding: 0.75rem !important;
          }
          .grid {
            gap: 0.75rem !important;
          }
          
          /* Cards scaling for Slide 2, 15 */
          .max-w-\[340px\] {
            max-w: 220px !important;
          }
          .aspect-\[4\/5\] {
            aspect-ratio: auto !important;
            height: 180px !important;
          }
          
          /* Slide 4 Radial Diagram dimensions */
          .aspect-square {
            max-width: 320px !important;
            max-height: 320px !important;
          }
          .gargalo-center-circle {
            width: 4.5rem !important;
            height: 4.5rem !important;
          }
          .gargalo-center-circle span.text-base {
            font-size: 11px !important;
          }
          .gargalo-center-circle span.text-\[9px\] {
            font-size: 7px !important;
          }
          .gargalo-satellite-card {
            width: 6.5rem !important;
            padding: 0.2rem 0.4rem !important;
          }
          .gargalo-satellite-card span {
            font-size: 8px !important;
          }
          .gargalo-satellite-card span.text-\[8px\] {
            font-size: 6.5px !important;
          }
          
          /* Slide 9 pyramid list heights */
          .max-w-\[420px\] {
            max-w: 320px !important;
          }
          .p-3\.5 {
            padding: 0.4rem 0.6rem !important;
          }
          
          /* Slide 10 method process steps */
          .w-10.h-10 {
            width: 1.75rem !important;
            height: 1.75rem !important;
          }
          .w-10.h-10 span {
            font-size: 9px !important;
          }
          .flex-grow.flex.flex-col.items-center span {
            font-size: 7px !important;
          }
          
          /* Slide 13 metrics dashboard mockup */
          .max-w-\[460px\] {
            max-w: 360px !important;
          }
          .p-5 {
            padding: 0.6rem !important;
          }
          .p-3.bg-black\/20 {
            padding: 0.4rem !important;
          }
          .text-xl {
            font-size: 1.1rem !important;
          }
          
          /* General helper utility sizes */
          .space-y-4 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 0.35rem !important;
          }
          .mb-8 {
            margin-bottom: 0.35rem !important;
          }
          .mb-6 {
            margin-bottom: 0.35rem !important;
          }
          .mt-6 {
            margin-top: 0.35rem !important;
          }
          .gap-6 {
            gap: 0.35rem !important;
          }
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
                    {/* Level 4: Governo (Gold Theme) */}
                    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${activeLayer === 0 ? 'bg-[#d4af37]/15 border border-[#d4af37]/60 scale-[1.02] shadow-[0_0_15px_rgba(212,175,55,0.25)]' : 'bg-[#d4af37]/2 border border-[#d4af37]/15'}`}>
                      <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${activeLayer === 0 ? 'text-[#d4af37]' : 'text-[#d4af37]/65'}`}>Governo</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-mono transition-all duration-500 ${activeLayer === 0 ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-[#d4af37]/10 text-[#d4af37]/50'}`}>Conselho / Estratégia</span>
                    </div>
                    
                    {/* Level 3: Liderança (Silver/Slate Theme) */}
                    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${activeLayer === 1 ? 'bg-slate-300/10 border border-slate-400/50 scale-[1.02] shadow-[0_0_15px_rgba(203,213,225,0.2)]' : 'bg-slate-800/5 border border-slate-800/40'}`}>
                      <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${activeLayer === 1 ? 'text-slate-200' : 'text-slate-400/60'}`}>Liderança</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-mono transition-all duration-500 ${activeLayer === 1 ? 'bg-slate-300/20 text-slate-200' : 'bg-slate-800/20 text-slate-500'}`}>Diretores / Gestores</span>
                    </div>
                    
                    {/* Level 2: Processos (Bronze/Amber Theme) */}
                    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${activeLayer === 2 ? 'bg-amber-700/10 border border-amber-500/50 scale-[1.02] shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'bg-amber-800/2 border border-amber-900/30'}`}>
                      <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${activeLayer === 2 ? 'text-amber-300' : 'text-amber-500/60'}`}>Processos</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-mono transition-all duration-500 ${activeLayer === 2 ? 'bg-amber-700/20 text-amber-300' : 'bg-amber-800/10 text-amber-500/40'}`}>Rotinas / Padrões</span>
                    </div>
                    
                    {/* Level 1: Indicadores (Electric Blue Theme) */}
                    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${activeLayer === 3 ? 'bg-[#3b82f6]/15 border border-[#3b82f6]/60 scale-[1.02] shadow-[0_0_15px_rgba(59,130,246,0.25)]' : 'bg-[#3b82f6]/2 border border-[#3b82f6]/15'}`}>
                      <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${activeLayer === 3 ? 'text-[#60a5fa]' : 'text-[#3b82f6]/65'}`}>Indicadores</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-mono transition-all duration-500 ${activeLayer === 3 ? 'bg-[#3b82f6]/20 text-[#3b82f6]' : 'bg-[#3b82f6]/10 text-[#3b82f6]/50'}`}>Dados / Dashboards</span>
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
                <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-xl overflow-hidden border border-gray-800 bg-gradient-to-b from-gray-900 to-black flex flex-col justify-end p-6 group shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                  <img src={felipeImg} className="absolute inset-0 w-full h-full object-cover object-top filter grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500" alt="Felipe Damasceno" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060b13] via-[#060b13]/10 to-transparent z-10 pointer-events-none" />
                  <div className="relative z-20 border-t border-gray-800/80 pt-3">
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
                <div className="relative w-full max-w-[500px] md:max-w-[540px] aspect-square flex items-center justify-center">
                  
                  {/* Central Node: Dono (Enlarged) */}
                  <div className="gargalo-center-circle w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#ffd700] to-[#b8860b] flex flex-col items-center justify-center border border-white/20 shadow-[0_0_35px_rgba(212,175,55,0.45)] z-10 transition-transform duration-500">
                    <span className="text-black font-heading font-extrabold text-base uppercase tracking-wider">DONO</span>
                    <span className="text-black/80 font-mono text-[9px] uppercase tracking-widest mt-0.5">Gargalo</span>
                  </div>

                  {/* Connecting Lines (Ray-based layout from center) */}
                  {[
                    { angle: 0 },
                    { angle: 60 },
                    { angle: 120 },
                    { angle: 180 },
                    { angle: 240 },
                    { angle: 300 }
                  ].map((line, idx) => {
                    const isActive = activeNode === idx;
                    const radian = (line.angle * Math.PI) / 180;
                    const x = Math.cos(radian) * radiusX;
                    const y = Math.sin(radian) * radiusY;
                    
                    const dist = Math.sqrt(x*x + y*y);
                    const lineLength = dist - (isActive ? 18 : 15);
                    const angleInRadians = Math.atan2(y, x);
                    const angleInDegrees = (angleInRadians * 180) / Math.PI;
                    const rotationAngle = angleInDegrees + 90;
                    
                    return (
                      <div
                        key={`line-${idx}`}
                        className={`absolute origin-bottom transition-all duration-500 z-0 ${isActive ? 'bg-gradient-to-t from-[#d4af37] via-[#d4af37]/60 to-[#d4af37]/10 w-[3px] opacity-100 shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'bg-gradient-to-t from-[#1b2a3f]/50 to-transparent w-[1.5px] opacity-40'}`}
                        style={{
                          height: `${lineLength}px`,
                          bottom: '50%',
                          transform: `rotate(${rotationAngle}deg)`,
                          transformOrigin: 'bottom center'
                        }}
                      />
                    );
                  })}

                  {/* Satellite Nodes (Enlarged and animated) */}
                  {[
                    { label: 'Comercial', angle: 0, text: 'Aprovação de propostas' },
                    { label: 'Operação', angle: 60, text: 'Resolvendo problemas' },
                    { label: 'Equipe', angle: 120, text: 'Dúvidas constantes' },
                    { label: 'Financeiro', angle: 180, text: 'Liberação de contas' },
                    { label: 'Clientes', angle: 240, text: 'Atendimento direto' },
                    { label: 'Decisões', angle: 300, text: 'Validações diárias' }
                  ].map((node, idx) => {
                    const radian = (node.angle * Math.PI) / 180;
                    const x = Math.cos(radian) * radiusX;
                    const y = Math.sin(radian) * radiusY;
                    const isActive = activeNode === idx;

                    return (
                      <div 
                        key={idx} 
                        className="absolute flex flex-col items-center z-20"
                        style={{ 
                          transform: `translate(${x}px, ${y}px) scale(${isActive ? 1.12 : 1})`,
                          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        <div className={`gargalo-satellite-card px-2 py-1.5 sm:px-4 sm:py-2.5 rounded-xl border w-24 sm:w-28 md:w-36 text-center transition-all duration-500 shadow-lg ${isActive ? 'bg-[#121c2e] border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.25)]' : 'bg-[#0e1625]/90 border-gray-800 hover:border-[#d4af37]/50'}`}>
                          <span className={`text-[8px] sm:text-[9px] md:text-[11px] font-bold uppercase block transition-colors duration-500 ${isActive ? 'text-[#d4af37]' : 'text-white'}`}>{node.label}</span>
                          <span className="text-[7px] sm:text-[8px] md:text-[9px] text-gray-500 mt-0.5 sm:mt-1 leading-tight block">{node.text}</span>
                        </div>
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
              <div className="mb-3">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-1 block">Cálculo de Risco</span>
                <h2 className="text-2xl lg:text-3xl font-heading font-extrabold text-white">
                  O CUSTO INVISÍVEL DE UMA <br/>
                  <span className="text-gold-premium">EMPRESA DEPENDENTE DO DONO</span>
                </h2>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[
                  { title: 'TEMPO', desc: 'Horas de valor intelectual desperdiçadas resolvendo atritos operacionais diários que poderiam ser automatizados ou delegados.' },
                  { title: 'DECISÕES', desc: 'A velocidade de inovação e entrega fica limitada pela capacidade física da agenda do fundador.' },
                  { title: 'CRESCIMENTO', desc: 'Gargalo comercial. Escalar as vendas gera caos de entrega, forçando o dono a travar novos negócios.' },
                  { title: 'VALOR E RISCO', desc: 'Frágil e não-vendável. Empresas excessivamente dependentes do fundador não constroem equity real.' }
                ].map((cost, idx) => (
                  <div key={idx} className="premium-card p-4 rounded-xl flex flex-col justify-between min-h-[170px] lg:min-h-[185px]">
                    <div>
                      <div className="w-6 h-6 rounded bg-[#d4af37]/5 flex items-center justify-center border border-[#d4af37]/20 mb-2">
                        <span className="text-[10px] font-bold text-[#d4af37]">{idx + 1}</span>
                      </div>
                      <h3 className="font-heading font-bold text-xs text-white mb-1.5 uppercase tracking-wide">{cost.title}</h3>
                      <p className="text-[10px] text-gray-400 font-light leading-relaxed">{cost.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Interactive Risk Calculator */}
              <div className="premium-card p-4 rounded-xl border border-[#d4af37]/20 bg-gradient-to-r from-[#0a1120] to-[#0e172a] shadow-[0_12px_40px_rgba(0,0,0,0.5)] mt-1">
                <div className="flex flex-col gap-4">
                  
                  {/* Title & Formula */}
                  <div className="flex items-center justify-between border-b border-gray-800/80 pb-2 text-left">
                    <div>
                      <span className="text-[9px] font-accent text-[#d4af37] font-bold uppercase tracking-wider">Simulador de Risco e Alavancagem</span>
                      <h4 className="text-xs font-heading font-extrabold text-white mt-0.5 uppercase">Custo de Centralização vs. Retorno Estratégico</h4>
                    </div>
                    <p className="text-[9px] text-gray-500 font-light hidden md:block">
                      Fórmula tempo: (Valor Hora × Horas/Semana) × 52 semanas | Fórmula crescimento: Crescimento Anual × Decisões Estratégicas %
                    </p>
                  </div>

                  {/* Inputs Row / Center Column */}
                  <div className="flex items-center justify-center min-h-[60px] w-full">
                    {calcState === 'idle' && (
                      <form onSubmit={handleCalculateCusto} className="w-full flex flex-col gap-4">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end w-full">
                          
                          {/* Row 1/Col 1: Valor Hora */}
                          <div className="flex flex-col text-left">
                            <label className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Valor da sua hora (R$)</label>
                            <input 
                              type="number" 
                              placeholder="Ex: 150" 
                              value={hourlyRate}
                              onChange={(e) => setHourlyRate(e.target.value)}
                              className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-2.5 py-1.5 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                              required
                            />
                          </div>
                          
                          {/* Row 1/Col 2: Horas Semanais */}
                          <div className="flex flex-col text-left">
                            <label className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Horas trab. / semana</label>
                            <input 
                              type="number" 
                              placeholder="Ex: 44" 
                              value={hoursPerWeek}
                              onChange={(e) => setHoursPerWeek(e.target.value)}
                              className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-2.5 py-1.5 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                              required
                            />
                          </div>

                          {/* Row 1/Col 3: Tempo Estratégico % */}
                          <div className="flex flex-col text-left">
                            <label className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Tempo estratégico (%)</label>
                            <input 
                              type="number" 
                              min="0"
                              max="100"
                              placeholder="Ex: 20" 
                              value={strategicPercent}
                              onChange={(e) => setStrategicPercent(e.target.value)}
                              className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-2.5 py-1.5 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                              required
                            />
                          </div>

                          {/* Row 2/Col 1: Crescimento Faturamento */}
                          <div className="flex flex-col text-left">
                            <label className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Crescimento anual (%)</label>
                            <input 
                              type="number" 
                              placeholder="Ex: 80" 
                              value={annualGrowth}
                              onChange={(e) => setAnnualGrowth(e.target.value)}
                              className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-2.5 py-1.5 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                              required
                            />
                          </div>

                          {/* Row 2/Col 2: Decisões Estratégicas % */}
                          <div className="flex flex-col text-left">
                            <label className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Resp. no resultado (%)</label>
                            <input 
                              type="number" 
                              min="0"
                              max="100"
                              placeholder="Ex: 50" 
                              value={growthFromStrategy}
                              onChange={(e) => setGrowthFromStrategy(e.target.value)}
                              className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-2.5 py-1.5 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                              required
                            />
                          </div>

                        </div>
                        <div className="flex justify-end mt-1">
                          <button 
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-heading font-extrabold text-xs rounded-lg uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                          >
                            Calcular Custo & Impacto
                          </button>
                        </div>
                      </form>
                    )}

                    {calcState === 'calculating' && (
                      <div className="flex items-center gap-3 text-[#d4af37] animate-pulse">
                        <svg className="animate-spin h-5 w-5 text-[#d4af37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-xs font-mono font-bold uppercase tracking-widest">Processando simulação de alavancagem...</span>
                      </div>
                    )}

                    {calcState === 'done' && (
                      <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full animate-fade-in text-left">
                        
                        {/* Column 1: Time Cost Metrics (Left) */}
                        <div className="flex-1 flex flex-col justify-between border-r border-gray-800/80 pr-6 gap-3">
                          <div className="space-y-3">
                            
                            {/* Card 1.1: Custo Operacional de Oportunidade */}
                            <div className="bg-red-500/5 border border-red-500/10 hover:border-red-500/25 rounded-xl p-3 sm:p-4 transition-all duration-300">
                              <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider block mb-1">⚠️ CUSTO OPERACIONAL DE OPORTUNIDADE</span>
                              <span className="text-xl md:text-2xl font-heading font-extrabold text-red-500 tracking-wide drop-shadow-[0_0_10px_rgba(239,68,68,0.25)] animate-pulse block">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculatedOpportunityCost)}
                              </span>
                              <p className="text-[11px] text-gray-300 font-light mt-1.5 leading-relaxed">
                                Horas intelectuais engolidas por burocracias operacionais que deveriam ser delegadas.
                              </p>
                            </div>
                            
                            {/* Card 1.2: Investimento do Tempo */}
                            <div className="bg-[#34d399]/5 border border-[#34d399]/10 hover:border-[#34d399]/25 rounded-xl p-3 sm:p-4 transition-all duration-300">
                              <span className="text-[9px] text-[#34d399] font-bold uppercase tracking-wider block mb-1">💎 INVESTIMENTO DO SEU TEMPO EM ESTRATÉGIA</span>
                              <span className="text-lg md:text-xl font-heading font-extrabold text-[#34d399] tracking-wide block">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculatedStrategicInvestment)}
                              </span>
                              <p className="text-[11px] text-gray-300 font-light mt-1.5 leading-relaxed">
                                Custo do seu tempo intelectual que foi efetivamente dedicado a estruturar o crescimento.
                              </p>
                            </div>

                          </div>
                          
                          <button 
                            onClick={() => { setCalcState('idle'); setHourlyRate(''); setHoursPerWeek(''); setStrategicPercent('20'); setAnnualGrowth('80'); setGrowthFromStrategy('50'); }}
                            className="mt-4 px-4 py-2 border border-gray-800 hover:border-[#d4af37]/50 text-[10px] text-gray-400 hover:text-white uppercase font-bold tracking-wider rounded-lg transition-all cursor-pointer w-fit"
                          >
                            Refazer Simulação
                          </button>
                        </div>

                        {/* Column 2: Growth Impact Metrics (Right) */}
                        <div className="flex-1 flex flex-col justify-between gap-3">
                          <div className="space-y-3">
                            
                            {/* Card 2.1: Crescimento devido a decisões */}
                            <div className="bg-white/5 border border-gray-800/80 hover:border-[#34d399]/20 rounded-xl p-3 transition-all duration-300">
                              <span className="text-[9px] text-[#34d399] font-bold uppercase tracking-wider block mb-1">📈 CRESCIMENTO DEVIDO ÀS SUAS DECISÕES ESTRATÉGICAS</span>
                              <span className="text-base md:text-lg font-heading font-extrabold text-[#34d399] tracking-wide block">
                                {calculatedActualReturn.toFixed(1)}% de crescimento gerado
                              </span>
                              <p className="text-[11px] text-gray-300 font-light mt-1 leading-relaxed">
                                Com apenas {strategicPercent}% das suas horas dedicadas a decisões, você gerou {calculatedActualReturn.toFixed(1)}% do crescimento total.
                              </p>
                            </div>

                            {/* Card 2.2: Dobrando a Dedicação */}
                            <div className="bg-white/5 border border-gray-800/80 hover:border-[#34d399]/20 rounded-xl p-3 transition-all duration-300">
                              <span className="text-[9px] text-[#34d399] font-bold uppercase tracking-wider block mb-1">⚡ DOBRANDO A DEDICAÇÃO (Projeção {parseFloat(strategicPercent) * 2}%)</span>
                              <span className="text-base md:text-lg font-heading font-extrabold text-[#34d399] tracking-wide block">
                                +{calculatedActualReturn.toFixed(1)}% de crescimento projetado
                              </span>
                              <p className="text-[11px] text-gray-300 font-light mt-1 leading-relaxed">
                                Se você passar para {parseFloat(strategicPercent) * 2}% do seu tempo em estratégia, o crescimento projetado ganharia mais +{calculatedActualReturn.toFixed(1)}%.
                              </p>
                            </div>
                            
                            {/* Card 2.3: Potencial Deixado na Mesa */}
                            <div className="bg-red-500/5 border border-red-500/10 hover:border-red-500/25 rounded-xl p-3 transition-all duration-300">
                              <span className="text-[9px] text-orange-500 font-bold uppercase tracking-wider block mb-1">❌ POTENCIAL DEIXADO NA MESA (Operação Centralizada)</span>
                              <span className="text-base md:text-lg font-heading font-extrabold text-orange-500 tracking-wide block animate-pulse">
                                +{calculatedLostGrowth.toFixed(1)}% de crescimento perdido
                              </span>
                              <p className="text-[11px] text-gray-300 font-light mt-1 leading-relaxed">
                                O faturamento incremental que você abriu mão por passar {100 - parseFloat(strategicPercent)}% do tempo focado na operação.
                              </p>
                            </div>

                          </div>

                          <div className="mt-4 border-t border-gray-800/80 pt-2.5 text-left">
                            <span className="text-[9px] text-[#d4af37] font-bold uppercase tracking-wider block">🎯 Como recuperar esse faturamento não-alavancado:</span>
                            <p className="text-[9px] text-gray-400 leading-normal font-light">
                              Ao invés de gastar tempo na operação, direcione suas horas para ajustes de preços/margens, estratégias comerciais de vendas, automação de rotinas e a contratação de gestores.
                            </p>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                </div>
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
              <div className="col-span-7 flex flex-col gap-4">
                
                {/* O Fluxo Ruim */}
                <div className="premium-card p-3 rounded-xl border-l-4 border-l-red-500/50">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-red-500 font-bold block mb-1">FLUXO INADEQUADO</span>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-white">
                    <span className="bg-white/5 px-2 py-1 rounded text-center">Dono centraliza</span>
                    <ArrowRight className="w-3.5 h-3.5 text-red-500" />
                    <span className="bg-white/5 px-2 py-1 rounded text-center">Delega tarefa</span>
                    <ArrowRight className="w-3.5 h-3.5 text-red-500" />
                    <span className="bg-red-500/10 border border-red-500/30 px-2 py-1 rounded text-red-500 text-center">Problema surge</span>
                    <ArrowRight className="w-3.5 h-3.5 text-red-500" />
                    <span className="bg-white/5 px-2 py-1 rounded text-center">Volta ao dono</span>
                  </div>
                </div>

                {/* O Fluxo Correto */}
                <div className="premium-card p-3 rounded-xl border-l-4 border-l-[#d4af37]">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-[#d4af37] font-bold block mb-1">ESTRUTURA DE AUTONOMIA REAL</span>
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-5 gap-1.5 text-[9px] text-center text-gray-400">
                      <div className="p-1.5 bg-white/5 border border-gray-800 rounded flex flex-col justify-between">
                        <span className="font-bold text-white mb-0.5">PAPEL</span>
                        <span>Quem executa</span>
                      </div>
                      <div className="p-1.5 bg-white/5 border border-gray-800 rounded flex flex-col justify-between">
                        <span className="font-bold text-white mb-0.5">ALÇADA</span>
                        <span>Decisão</span>
                      </div>
                      <div className="p-1.5 bg-white/5 border border-gray-800 rounded flex flex-col justify-between">
                        <span className="font-bold text-white mb-0.5">PROCESSO</span>
                        <span>Como fazer</span>
                      </div>
                      <div className="p-1.5 bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded flex flex-col justify-between">
                        <span className="font-bold text-[#3b82f6] mb-0.5">MÉTRICA</span>
                        <span>Avaliar</span>
                      </div>
                      <div className="p-1.5 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded flex flex-col justify-between">
                        <span className="font-bold text-[#d4af37] mb-0.5">CADÊNCIA</span>
                        <span>Acompanhar</span>
                      </div>
                    </div>
                    <div className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-wider bg-white/5 py-1 rounded">
                      = Autonomia Executiva Real
                    </div>
                  </div>
                </div>

                {/* Centralization & Autonomy Calculator */}
                <div className="premium-card p-3 rounded-xl border border-[#d4af37]/20 bg-gradient-to-r from-[#0a1120] to-[#0e172a] shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                  <div className="flex flex-col gap-3">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-800/80 pb-1.5 text-left">
                      <div>
                        <span className="text-[9px] font-accent text-[#d4af37] font-bold uppercase tracking-wider">Simulador de Retrabalho e Autonomia</span>
                        <h4 className="text-[10px] font-heading font-extrabold text-white uppercase">O Custo da Re-centralização Operacional</h4>
                      </div>
                    </div>

                    {/* Inputs or Results */}
                    {slide6CalcState === 'idle' && (
                      <form onSubmit={handleCalculateSlide6} className="w-full flex flex-col gap-3">
                        <div className="grid grid-cols-3 gap-3 items-end w-full">
                          
                          <div className="flex flex-col text-left">
                            <label className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Delegadas / semana</label>
                            <input 
                              type="number" 
                              placeholder="Ex: 10" 
                              value={delegatedTasks}
                              onChange={(e) => setDelegatedTasks(e.target.value)}
                              className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-2 py-1.5 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                              required
                            />
                          </div>

                          <div className="flex flex-col text-left">
                            <label className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Voltam (refugo) / semana</label>
                            <input 
                              type="number" 
                              placeholder="Ex: 7" 
                              value={returningTasks}
                              onChange={(e) => setReturningTasks(e.target.value)}
                              className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-2 py-1.5 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                              required
                            />
                          </div>

                          <div className="flex flex-col text-left">
                            <label className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Tempo refazer / tarefa (h)</label>
                            <input 
                              type="number" 
                              placeholder="Ex: 2" 
                              value={reworkHours}
                              onChange={(e) => setReworkHours(e.target.value)}
                              className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-2 py-1.5 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                              required
                            />
                          </div>

                        </div>
                        <div className="flex justify-end mt-1">
                          <button 
                            type="submit"
                            className="px-5 py-1.5 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-heading font-extrabold text-[10px] rounded-lg uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                          >
                            Calcular Dreno
                          </button>
                        </div>
                      </form>
                    )}

                    {slide6CalcState === 'calculating' && (
                      <div className="flex items-center justify-center gap-3 text-[#d4af37] animate-pulse py-4">
                        <svg className="animate-spin h-4 w-4 text-[#d4af37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Calculando dreno de centralização...</span>
                      </div>
                    )}

                    {slide6CalcState === 'done' && (
                      <div className="flex flex-col gap-3 animate-fade-in text-left">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          
                          {/* Card 1: Autonomia */}
                          <div className="bg-white/5 border border-gray-800 hover:border-[#34d399]/20 rounded-xl p-3 transition-all duration-300">
                            <span className="text-[8px] text-[#34d399] font-bold uppercase tracking-wider block mb-0.5">📊 AUTONOMIA REAL DA EQUIPE</span>
                            <span className={`text-base font-heading font-extrabold tracking-wide block ${slide6AutonomyPercent < 45 ? 'text-red-500 animate-pulse' : 'text-[#34d399]'}`}>
                              {slide6AutonomyPercent.toFixed(0)}% Autonomia
                            </span>
                            <p className="text-[11px] text-gray-300 font-light mt-1 leading-normal">
                              Sua equipe é {100 - slide6AutonomyPercent}% dependente. De cada {delegatedTasks} tarefas, {returningTasks} exigem sua validação.
                            </p>
                          </div>

                          {/* Card 2: Tempo devorado */}
                          <div className="bg-red-500/5 border border-red-500/10 hover:border-red-500/25 rounded-xl p-3 transition-all duration-300">
                            <span className="text-[8px] text-red-500 font-bold uppercase tracking-wider block mb-0.5">⏳ TEMPO DEVORADO POR RETRABALHO</span>
                            <span className="text-base font-heading font-extrabold text-red-500 tracking-wide block">
                              {slide6HoursLost}h / semana
                            </span>
                            <p className="text-[11px] text-gray-300 font-light mt-1 leading-normal">
                              Equivale a {slide6TimeDrainPercent.toFixed(1)}% do seu tempo operacional desperdiçado resolvendo atritos cotidianos.
                            </p>
                          </div>

                          {/* Card 3: Prejuízo financeiro */}
                          <div className="bg-red-500/5 border border-red-500/10 hover:border-red-500/25 rounded-xl p-3 transition-all duration-300">
                            <span className="text-[8px] text-red-500 font-bold uppercase tracking-wider block mb-0.5">❌ PREJUÍZO MENSAL DO RETRABALHO</span>
                            <span className="text-base font-heading font-extrabold text-red-500 tracking-wide block animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.25)]">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(slide6MonthlyLoss)}
                            </span>
                            <p className="text-[11px] text-gray-300 font-light mt-1 leading-normal">
                              O custo financeiro invisível de pagar o valor da sua hora nobre para resolver retrabalhos operacionais.
                            </p>
                          </div>

                        </div>

                        <div className="flex justify-between items-center mt-1 border-t border-gray-800/80 pt-2">
                          <span className="text-[8px] text-gray-500 italic">
                            *Baseado no valor de hora (R$ {hourlyRate || 150}) e horas/sem ({hoursPerWeek || 40}) informados.
                          </span>
                          <button 
                            onClick={() => { setSlide6CalcState('idle'); setDelegatedTasks('10'); setReturningTasks('7'); setReworkHours('2'); }}
                            className="px-2.5 py-1 border border-gray-800 hover:border-[#d4af37]/50 text-[8px] text-gray-400 hover:text-white uppercase font-bold tracking-wider rounded transition-all cursor-pointer"
                          >
                            Refazer Simulação
                          </button>
                        </div>
                      </div>
                    )}

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
