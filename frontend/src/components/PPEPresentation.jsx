import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, Maximize2, Minimize2, ArrowLeft, ArrowRight,
  Compass, Landmark, ShieldCheck, TrendingUp, Target, 
  Users, Diamond, Magnet, Monitor, UserCheck, Crown
} from 'lucide-react';

const PPEHeader = () => (
  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-8">
    <div className="text-3xl sm:text-5xl font-black text-[#d4af37] tracking-tighter">PPE</div>
    <div className="h-8 sm:h-10 w-px bg-white/20"></div>
    <div className="flex flex-col">
      <span className="text-white/60 text-[10px] sm:text-xs tracking-widest uppercase leading-tight">Programa</span>
      <span className="text-white text-xs sm:text-sm tracking-[0.2em] font-medium uppercase leading-tight">Potência Empresarial</span>
    </div>
  </div>
);

export default function PPEPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = 5;
  const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(curr => curr + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(curr => curr - 1);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.error("Error attempting to enable fullscreen:", err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Touch Swipe Handlers for mobile navigation
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 60) {
      nextSlide();
    } else if (diff < -60) {
      prevSlide();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const renderSlideContent = () => {
    switch (currentSlide) {
      case 0:
        return (
          <div className="flex flex-col min-h-full justify-between animate-fade-in px-4 sm:px-8 max-w-6xl mx-auto">
            <div className="flex-1 flex flex-col justify-center">
              <PPEHeader />
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4 sm:mb-8">
                EMPRESAS FORTES.<br/>
                PRINCÍPIOS INEGOCIÁVEIS.<br/>
                <span className="text-[#d4af37]">RESULTADOS QUE<br/>GERAM LEGADO.</span>
              </h1>
              <p className="text-neutral-400 text-sm sm:text-lg md:text-xl max-w-2xl leading-relaxed">
                Um ecossistema completo para o empresário governar sua empresa, validar seus princípios, 
                monetizar seu conhecimento, gerar negócios, vender com previsibilidade e entregar resultados extraordinários.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 py-6 sm:py-8 border-t border-white/10 mt-6 sm:mt-auto">
              <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] bg-[#d4af37]/10">
                  <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Propósito<br/>e Reino</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] bg-[#d4af37]/10">
                  <Landmark className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Gestão e<br/>Governança</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] bg-[#d4af37]/10">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Conhecimento<br/>e Expansão</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] bg-[#d4af37]/10">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Negócios<br/>e Escala</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex flex-col items-center text-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] bg-[#d4af37]/10">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Impacto<br/>e Legado</span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 md:absolute md:right-8 md:bottom-32 text-center md:text-right">
              <p className="text-[#d4af37] text-sm sm:text-base md:text-xl font-medium tracking-widest leading-relaxed max-w-sm mx-auto md:ml-auto">
                "UM CAMINHO.<br/>MÚLTIPLOS ATIVOS.<br/>RESULTADOS QUE PERMANECEM."
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="flex flex-col min-h-full pt-4 md:pt-8 animate-fade-in px-4 sm:px-8 max-w-[1400px] mx-auto w-full">
            <div className="flex flex-col md:flex-row items-start justify-between mb-6 md:mb-12 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-2 md:mb-4">
                  4 GRANDES MOVIMENTOS. <span className="text-[#d4af37]">1 TRANSFORMAÇÃO COMPLETA.</span>
                </h2>
                <p className="text-neutral-400 text-sm sm:text-lg">
                  O PPE organiza toda a jornada do empresário em quatro pilares que se conectam e geram crescimento sustentável.
                </p>
              </div>
              <PPEHeader />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 flex-1">
              {/* GOVERNO */}
              <div className="bg-gradient-to-b from-[#1a1500] to-neutral-900 border border-amber-500/30 rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden group hover:border-amber-500/80 transition-all">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-500/20 blur-[50px] rounded-full"></div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/10 border border-amber-500 flex items-center justify-center text-amber-500 mb-4 sm:mb-6 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                  <Landmark className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500 text-black font-black flex items-center justify-center -mt-8 sm:-mt-10 mb-4 z-10 border-4 border-neutral-900 text-xs sm:text-sm">1</div>
                <h3 className="text-xl sm:text-2xl font-black text-amber-500 tracking-wider mb-2 sm:mb-4">GOVERNO</h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-auto">
                  Organizamos sua empresa e fortalecemos sua liderança para uma gestão sólida, estratégica e escalável.
                </p>
                <div className="w-full space-y-2 sm:space-y-3 mt-4 sm:mt-6">
                  <div className="w-full border border-amber-500/50 rounded-lg py-1.5 sm:py-2 font-bold text-amber-500 tracking-widest text-xs sm:text-sm">PGE</div>
                  <div className="w-full border border-amber-500/50 rounded-lg py-1.5 sm:py-2 font-bold text-amber-500 tracking-widest text-xs sm:text-sm">MFR</div>
                </div>
              </div>

              {/* VALIDAÇÃO */}
              <div className="bg-gradient-to-b from-[#001a08] to-neutral-900 border border-green-500/30 rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden group hover:border-green-500/80 transition-all">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-green-500/20 blur-[50px] rounded-full"></div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/10 border border-green-500 flex items-center justify-center text-green-500 mb-4 sm:mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500 text-black font-black flex items-center justify-center -mt-8 sm:-mt-10 mb-4 z-10 border-4 border-neutral-900 text-xs sm:text-sm">2</div>
                <h3 className="text-xl sm:text-2xl font-black text-green-500 tracking-wider mb-2 sm:mb-4">VALIDAÇÃO</h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-auto">
                  Validamos sua empresa através de princípios biblicamente responsáveis e geramos confiança no mercado.
                </p>
                <div className="w-full space-y-2 sm:space-y-3 mt-4 sm:mt-6">
                  <div className="w-full border border-green-500/50 rounded-lg py-1.5 sm:py-2 font-bold text-green-500 tracking-widest text-xs sm:text-sm">EBR</div>
                </div>
              </div>

              {/* EXPANSÃO */}
              <div className="bg-gradient-to-b from-[#00122e] to-neutral-900 border border-blue-500/30 rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden group hover:border-blue-500/80 transition-all">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full"></div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-500/10 border border-blue-500 flex items-center justify-center text-blue-500 mb-4 sm:mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500 text-black font-black flex items-center justify-center -mt-8 sm:-mt-10 mb-4 z-10 border-4 border-neutral-900 text-xs sm:text-sm">3</div>
                <h3 className="text-xl sm:text-2xl font-black text-blue-500 tracking-wider mb-2 sm:mb-4">EXPANSÃO</h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-auto">
                  Transformamos seu conhecimento em ativos digitais e estruturamos a jornada comercial que conduz à decisão.
                </p>
                <div className="w-full space-y-2 sm:space-y-3 mt-4 sm:mt-6">
                  <div className="w-full border border-blue-500/50 rounded-lg py-1.5 sm:py-2 font-bold text-blue-500 tracking-widest text-xs sm:text-sm">VND EXPERT</div>
                  <div className="w-full border border-blue-500/50 rounded-lg py-1.5 sm:py-2 font-bold text-blue-500 tracking-widest text-xs sm:text-sm">SGN</div>
                </div>
              </div>

              {/* ESCALA */}
              <div className="bg-gradient-to-b from-[#1a002e] to-neutral-900 border border-purple-500/30 rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden group hover:border-purple-500/80 transition-all">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full"></div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-500/10 border border-purple-500 flex items-center justify-center text-purple-500 mb-4 sm:mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-500 text-black font-black flex items-center justify-center -mt-8 sm:-mt-10 mb-4 z-10 border-4 border-neutral-900 text-xs sm:text-sm">4</div>
                <h3 className="text-xl sm:text-2xl font-black text-purple-500 tracking-wider mb-2 sm:mb-4">ESCALA</h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-auto">
                  Geramos demanda, operamos vendas com excelência e entregamos resultados que encantam e fidelizam.
                </p>
                <div className="w-full space-y-2 sm:space-y-3 mt-4 sm:mt-6">
                  <div className="w-full border border-purple-500/50 rounded-lg py-1.5 sm:py-2 font-bold text-purple-500 tracking-widest text-xs sm:text-sm">PGC</div>
                  <div className="w-full border border-purple-500/50 rounded-lg py-1.5 sm:py-2 font-bold text-purple-500 tracking-widest text-xs sm:text-sm">SIA</div>
                  <div className="w-full border border-purple-500/50 rounded-lg py-1.5 sm:py-2 font-bold text-purple-500 tracking-widest text-xs sm:text-sm">MJA</div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 mb-4 border border-[#d4af37]/30 rounded-xl sm:rounded-full py-3 sm:py-4 px-4 text-center bg-black/40 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              <p className="text-[#d4af37] text-xs sm:text-sm md:text-base font-bold tracking-widest flex items-center justify-center gap-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>PROPÓSITO + GESTÃO + TECNOLOGIA + PESSOAS = EMPRESAS QUE TRANSFORMAM</span>
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col min-h-full pt-4 md:pt-8 animate-fade-in px-4 sm:px-8 max-w-[1400px] mx-auto w-full">
            <div className="flex flex-col md:flex-row items-start justify-between mb-6 md:mb-8 gap-4">
              <PPEHeader />
              <div className="text-left md:text-right">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2">A JORNADA EM 8 ETAPAS</h2>
                <p className="text-neutral-400 text-xs sm:text-sm md:text-base max-w-xl md:ml-auto">
                  Cada etapa entrega um ativo estratégico para sua empresa crescer com propósito e previsibilidade.
                </p>
              </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center">
              {/* Timeline grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-6 sm:gap-y-16 w-full max-w-5xl mx-auto relative z-10">
                {/* Top Row: 1 to 4 */}
                {[
                  { num: 1, title: 'PGE', sub: 'GOVERNO EMPRESARIAL', color: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-500', icon: Landmark, desc: 'Diagnóstico, estratégia, indicadores, processos, pessoas e equity.' },
                  { num: 2, title: 'MFR', sub: 'FORMAÇÃO DE REINANTE', color: 'text-green-500', bg: 'bg-green-500', border: 'border-green-500', icon: Crown, desc: 'Formação em identidade, propósito, princípios, Reino e influência.' },
                  { num: 3, title: 'EBR', sub: 'SELO EMPRESA BÍBLICA RESPONSÁVEL', color: 'text-green-500', bg: 'bg-green-500', border: 'border-green-500', icon: ShieldCheck, desc: 'Avaliação, adequação e certificação que gera confiança e credibilidade.' },
                  { num: 4, title: 'VND EXPERT', sub: 'MONETIZAÇÃO DO CONHECIMENTO', color: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500', icon: Diamond, desc: 'Estruturamos seu método, oferta e produto digital de alto valor.' },
                ].map(step => (
                  <div key={step.num} className="flex flex-col items-center text-center relative group">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${step.bg}/10 border-2 ${step.border} flex items-center justify-center ${step.color} mb-3 sm:mb-4 relative z-10 shadow-[0_0_20px_currentColor] transition-transform group-hover:scale-110`}>
                      <step.icon className="w-7 h-7 sm:w-8 sm:h-8" />
                      <div className={`absolute -top-2.5 sm:-top-3 w-5 h-5 sm:w-6 sm:h-6 rounded-full ${step.bg} text-black font-black flex items-center justify-center text-[10px] sm:text-xs border-2 border-neutral-900`}>{step.num}</div>
                    </div>
                    <h4 className={`font-black ${step.color} tracking-wider mb-1 text-sm sm:text-base`}>{step.title}</h4>
                    <h5 className={`text-[9px] font-bold ${step.color} tracking-widest uppercase mb-2 sm:mb-3 leading-tight sm:h-6`}>{step.sub}</h5>
                    <p className="text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
                    
                    {step.num < 4 && (
                      <div className="absolute top-8 left-[60%] w-full h-[2px] bg-gradient-to-r from-neutral-700 to-neutral-700 -z-0 hidden md:block">
                         <div className={`absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full ${step.bg}`}></div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Connection Right */}
                <div className="absolute top-8 right-[-2rem] w-[2px] h-[16rem] bg-neutral-700 -z-0 hidden md:block"></div>
                <div className="absolute top-[16.5rem] right-[-2rem] w-full max-w-[20rem] h-[2px] bg-neutral-700 -z-0 hidden md:block"></div>
                
                {/* Bottom Row: 8 to 5 (Reversed for visual flow) */}
                {[
                  { num: 5, title: 'SGN', sub: 'SISTEMA DE GERAÇÃO DE NEGÓCIOS', color: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500', icon: Target, desc: 'Apresentações que elevam a consciência e conduzem à decisão.' },
                  { num: 6, title: 'PGC', sub: 'GERAÇÃO DE DEMANDA E GESTÃO COMERCIAL', color: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-500', icon: Magnet, desc: 'Atração, nutrição, CRM, automação e gestão de oportunidades.' },
                  { num: 7, title: 'SIA', sub: 'SISTEMA INTELIGENTE DE ATENDIMENTO', color: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-500', icon: Monitor, desc: 'Rotina dos vendedores, indicadores, gestão e alta produtividade.' },
                  { num: 8, title: 'MJA', sub: 'MINHA JORNADA DE ALUNO/CLIENTE', color: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-500', icon: Users, desc: 'Onboarding, tarefas, acompanhamento e entrega de resultados.' },
                ].reverse().map((step, idx) => (
                  <div key={step.num} className="flex flex-col items-center text-center relative group">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${step.bg}/10 border-2 ${step.border} flex items-center justify-center ${step.color} mb-3 sm:mb-4 relative z-10 shadow-[0_0_20px_currentColor] transition-transform group-hover:scale-110`}>
                      <step.icon className="w-7 h-7 sm:w-8 sm:h-8" />
                      <div className={`absolute -top-2.5 sm:-top-3 w-5 h-5 sm:w-6 sm:h-6 rounded-full ${step.bg} text-black font-black flex items-center justify-center text-[10px] sm:text-xs border-2 border-neutral-900`}>{step.num}</div>
                    </div>
                    <h4 className={`font-black ${step.color} tracking-wider mb-1 text-sm sm:text-base`}>{step.title}</h4>
                    <h5 className={`text-[9px] font-bold ${step.color} tracking-widest uppercase mb-2 sm:mb-3 leading-tight sm:h-6`}>{step.sub}</h5>
                    <p className="text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
                    
                    {idx < 3 && (
                      <div className="absolute top-8 right-[60%] w-full h-[2px] bg-neutral-700 -z-0 hidden md:block">
                         <div className={`absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full ${step.bg}`}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 sm:mt-auto mb-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
               <div className="w-full sm:w-64 text-center sm:text-left">
                 <p className="text-[#d4af37] text-xs font-bold leading-relaxed tracking-wider border-l-0 sm:border-l-2 border-[#d4af37] pl-0 sm:pl-4">
                   UMA JORNADA.<br/>TRANSFORMAÇÃO<br/>COM PROPÓSITO.<br/>RESULTADOS QUE PERMANECEM.
                 </p>
               </div>
               <div className="w-full sm:flex-1 border border-[#d4af37]/30 rounded-xl sm:rounded-full py-3 sm:py-4 px-4 sm:px-8 text-center bg-black/40">
                <p className="text-[#d4af37] text-[10px] sm:text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span>DO PROPÓSITO À ENTREGA. UM CICLO COMPLETO DE TRANSFORMAÇÃO.</span>
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col min-h-full pt-4 md:pt-8 animate-fade-in px-4 sm:px-8 max-w-[1400px] mx-auto w-full">
             <div className="flex flex-col md:flex-row items-start justify-between mb-6 md:mb-8 gap-4">
              <PPEHeader />
              <div className="text-left md:text-right">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2">ENTREGAS DO ECOSSISTEMA PPE</h2>
                <p className="text-neutral-400 text-xs sm:text-sm md:text-base max-w-xl md:ml-auto">
                  Cada solução possui um valor próprio. Juntas, geram transformação exponencial.
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full max-w-5xl bg-black/40 border border-[#d4af37]/30 rounded-2xl overflow-x-auto backdrop-blur-sm shadow-2xl">
                <table className="w-full text-left min-w-[600px] md:min-w-full">
                  <thead>
                    <tr className="border-b border-[#d4af37]/30 text-[#d4af37] text-xs tracking-widest uppercase">
                      <th className="py-3 sm:py-4 px-4 sm:px-6 font-medium w-1/3">Solução</th>
                      <th className="py-3 sm:py-4 px-4 sm:px-6 font-medium w-1/2">O que entrega</th>
                      <th className="py-3 sm:py-4 px-4 sm:px-6 font-medium text-right">Valor Avulso</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs sm:text-sm">
                    {[
                      { icon: Landmark, title: 'PGE - Programa Governo Empresarial', desc: 'Gestão, estratégia, processos, indicadores, pessoas e equity.', val: 'R$ 120.000', color: 'text-amber-500' },
                      { icon: Crown, title: 'MFR - Método Formação de Reinante', desc: 'Formação contínua em Reino, identidade e princípios.', val: 'R$ 1.200/ano', color: 'text-green-500' },
                      { icon: ShieldCheck, title: 'EBR - Empresa Biblicamente Responsável', desc: 'Avaliação, adequação e certificação.', val: 'R$ 15.000', color: 'text-green-500' },
                      { icon: Diamond, title: 'VND EXPERT - Monetização de Conhecimento', desc: 'Método, produto, oferta e estrutura de monetização.', val: 'R$ 90.000', color: 'text-blue-500' },
                      { icon: Target, title: 'SGN - Sistema de Geração de Negócios', desc: 'Jornada de apresentações que eleva consciência e conduz à decisão.', val: 'R$ 45.000', color: 'text-blue-500' },
                      { icon: Magnet, title: 'PGC - Geração de Demanda e Gestão Comercial', desc: 'Marketing, CRM, automações e gestão de oportunidades.', val: 'R$ 8.364/ano', color: 'text-purple-500' },
                      { icon: Monitor, title: 'SIA - Sistema Inteligente de Atendimento', desc: 'Rotina do time comercial, indicadores e gestão de performance.', val: 'R$ 45.000/ano', color: 'text-purple-500' },
                      { icon: Users, title: 'MJA - Minha Jornada de Aluno/Cliente', desc: 'Onboarding, tarefas, acompanhamento e entrega de resultados.', val: 'R$ 35.000/ano', color: 'text-purple-500' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 sm:py-4 px-4 sm:px-6 font-bold text-white flex items-center gap-3 sm:gap-4">
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border border-current ${row.color} bg-current/10 shrink-0`}>
                            <row.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <span className="text-xs sm:text-sm">{row.title}</span>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6 text-neutral-400 text-xs sm:text-sm">{row.desc}</td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6 text-right font-bold text-[#d4af37] whitespace-nowrap text-xs sm:text-sm">{row.val}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#d4af37]/10">
                      <td colSpan={2} className="py-4 sm:py-6 px-4 sm:px-6 font-black text-[#d4af37] text-base sm:text-xl tracking-widest uppercase flex items-center gap-3">
                         <div className="w-6 h-6 flex flex-col gap-1 items-center justify-end shrink-0">
                           <div className="w-4 h-2 bg-[#d4af37] rounded-sm"></div>
                           <div className="w-5 h-2 bg-[#d4af37] rounded-sm"></div>
                           <div className="w-6 h-2 bg-[#d4af37] rounded-sm"></div>
                         </div>
                         VALOR TOTAL AVULSO
                      </td>
                      <td className="py-4 sm:py-6 px-4 sm:px-6 text-right font-black text-[#d4af37] text-lg sm:text-2xl whitespace-nowrap">R$ 359.564</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 mb-4 border border-[#d4af37]/30 rounded-2xl p-4 sm:p-6 bg-black/40 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 shadow-xl max-w-5xl mx-auto w-full">
               <div className="flex items-center gap-3 sm:gap-4 border-b sm:border-b-0 sm:border-r border-white/20 pb-3 sm:pb-0 pr-0 sm:pr-8 w-full sm:w-auto justify-center sm:justify-start">
                 <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-[#d4af37] shrink-0" />
                 <div>
                   <div className="text-white text-[10px] sm:text-xs tracking-widest uppercase">Investimento Individual</div>
                   <div className="text-[#d4af37] text-lg sm:text-xl font-bold uppercase tracking-wider">Impacto Multiplicado</div>
                 </div>
               </div>
               <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed flex-1 text-center sm:text-left">
                 Soluções que trabalham juntas para gerar crescimento sustentável, previsibilidade e resultados extraordinários.
               </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col min-h-full pt-4 md:pt-8 animate-fade-in px-4 sm:px-8 max-w-[1400px] mx-auto w-full">
            <div className="flex flex-col md:flex-row items-start justify-between mb-6 md:mb-8 gap-4">
              <PPEHeader />
              <div className="text-left md:text-right">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2">INVESTIMENTO QUE GERA <span className="text-[#d4af37]">ATIVOS</span> PARA A VIDA TODA</h2>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch justify-center w-full max-w-6xl mx-auto">
              {/* Left Column (Table Summary) */}
              <div className="w-full md:w-[45%] bg-black/40 border border-[#d4af37]/30 rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col">
                <div className="py-3 sm:py-4 text-center border-b border-[#d4af37]/30 bg-[#d4af37]/5">
                  <span className="text-[#d4af37] font-bold tracking-widest text-xs sm:text-sm uppercase">SEPARADO, CUSTARIA:</span>
                </div>
                <div className="flex-1 p-4 sm:p-6">
                  <table className="w-full text-left h-full">
                    <tbody className="text-xs">
                      {[
                        { icon: Landmark, title: 'PGE', val: 'R$ 120.000', color: 'text-amber-500' },
                        { icon: Crown, title: 'MFR', val: 'R$ 1.200/ano', color: 'text-green-500' },
                        { icon: ShieldCheck, title: 'EBR', val: 'R$ 15.000', color: 'text-green-500' },
                        { icon: Diamond, title: 'VND EXPERT', val: 'R$ 90.000', color: 'text-blue-500' },
                        { icon: Target, title: 'SGN', val: 'R$ 45.000', color: 'text-blue-500' },
                        { icon: Magnet, title: 'PGC', val: 'R$ 8.364/ano', color: 'text-purple-500' },
                        { icon: Monitor, title: 'SIA', val: 'R$ 45.000/ano', color: 'text-purple-500' },
                        { icon: Users, title: 'MJA', val: 'R$ 35.000/ano', color: 'text-purple-500' },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="py-2 sm:py-3 text-white flex items-center gap-2 sm:gap-3">
                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border border-current ${row.color} bg-current/10 shrink-0`}>
                              <row.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            </div>
                            <span className="font-bold text-xs sm:text-sm">{row.title}</span>
                          </td>
                          <td className="py-2 sm:py-3 text-right font-bold text-[#d4af37] text-xs sm:text-sm">{row.val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="py-3 sm:py-4 px-4 sm:px-6 bg-[#d4af37]/10 flex justify-between items-center border-t border-[#d4af37]/30">
                  <span className="font-black text-[#d4af37] tracking-widest uppercase text-xs sm:text-sm">TOTAL AVULSO</span>
                  <span className="font-black text-[#d4af37] text-lg sm:text-xl">R$ 359.564</span>
                </div>
              </div>

              {/* Center X */}
              <div className="flex flex-col items-center justify-center py-2 md:py-0">
                <span className="text-[#d4af37] text-3xl md:text-5xl font-black font-heading opacity-50">X</span>
              </div>

              {/* Right Column (The Package) */}
              <div className="w-full md:w-[50%] bg-gradient-to-b from-[#1a1130] to-neutral-950 border border-purple-500/50 rounded-2xl overflow-hidden flex flex-col relative shadow-[0_0_50px_rgba(107,33,168,0.2)]">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
                <div className="py-4 sm:py-6 text-center border-b border-white/10 bg-black/20">
                  <span className="text-white/70 font-medium tracking-[0.2em] text-xs sm:text-sm uppercase">TUDO JUNTO, DURANTE 12 MESES:</span>
                </div>
                <div className="flex-1 p-5 sm:p-8 flex flex-col items-center text-center justify-center">
                  
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
                    <div className="text-5xl sm:text-7xl font-black text-[#d4af37] tracking-tighter drop-shadow-lg">PPE</div>
                    <div className="h-12 sm:h-16 w-px bg-white/20"></div>
                    <div className="flex flex-col text-left">
                      <span className="text-white/60 text-xs sm:text-sm tracking-widest uppercase leading-tight">Programa</span>
                      <span className="text-[#d4af37] text-sm sm:text-lg tracking-[0.2em] font-medium uppercase leading-tight">Potência<br/>Empresarial</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap">
                    {[Landmark, ShieldCheck, Diamond, Target, Magnet, Monitor, Users].map((Icon, idx) => (
                      <div key={idx} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 bg-white/5">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    ))}
                  </div>

                  <p className="text-white font-medium tracking-widest text-xs sm:text-sm mb-6 sm:mb-12 uppercase">
                    IMPLEMENTAÇÃO COMPLETA E INTEGRADA<br/>DURANTE 12 MESES
                  </p>

                  <div className="text-4xl sm:text-6xl md:text-7xl font-black text-[#d4af37] mb-6 sm:mb-8 tracking-tight drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                    R$ 250.000
                  </div>

                  <p className="text-neutral-400 text-xs sm:text-sm tracking-wider uppercase">
                    VOCÊ ECONOMIZA <span className="text-[#d4af37] font-bold">R$ 109.564</span><br/>E ACELERA SUA <span className="text-[#d4af37] font-bold">TRANSFORMAÇÃO</span>.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 mb-4 border border-[#d4af37]/30 rounded-xl sm:rounded-full py-3 sm:py-4 px-4 text-center bg-black/40 w-full max-w-4xl mx-auto shadow-lg">
              <p className="text-white text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 sm:gap-3">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-[#d4af37] shrink-0" />
                <span>MAIS QUE PRODUTOS. UM PROPÓSITO. MAIS QUE GESTÃO. <span className="text-[#d4af37]">UM LEGADO.</span></span>
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-[#0a1120] font-sans overflow-hidden flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800/20 via-[#0a1120] to-[#0a1120] -z-10"></div>
      
      {/* Header Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-[#0a1120]/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-24">
            <button
              onClick={() => window.location.href = '/admin'}
              className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all cursor-pointer group"
              title="Voltar ao Painel"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleFullscreen}
                className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all cursor-pointer"
                title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-1 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/5 mb-2 sm:mb-4">
            <div 
              className="h-full bg-gradient-to-r from-[#d4af37]/50 via-[#d4af37] to-[#f3e5ab] transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full pt-16 sm:pt-20 md:pt-32 pb-20 sm:pb-24 overflow-y-auto">
        {renderSlideContent()}
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-4 bg-[#0a1120]/80 backdrop-blur-md border-t border-white/5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${currentSlide === 0 ? 'opacity-0 cursor-default pointer-events-none' : 'text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 border border-gray-800 cursor-pointer'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>
          
          <button 
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className={`flex items-center gap-2 px-6 py-3 font-heading font-extrabold text-xs rounded-xl uppercase tracking-wider transition-all duration-300 ${currentSlide === totalSlides - 1 ? 'opacity-0 cursor-default pointer-events-none' : 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black hover:opacity-90 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.25)]'}`}
          >
            Avançar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
    </div>
  );
}
