import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Target, Users, Settings, BarChart2, Briefcase, Activity, CheckCircle2, ChevronRight, ChevronLeft, Play, Maximize, Calendar as CalendarIcon, FileText, Smartphone } from 'lucide-react';
import { PresentationGovernanceDraftRepository } from '../repositories/PresentationGovernanceDraftRepository';
import { downloadContract } from '../domain/commercial/contractGenerator.js';
import { mapPresentationToGovernanceDraft } from '../domain/governance/presentationMapper';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

const applyCpfCnpjMask = (value) => {
  if (!value) return '';
  const v = value.replace(/\D/g, '');
  if (v.length <= 11) {
    return v.replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    return v.substring(0, 14)
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2');
  }
};

const formatBRLInput = (value) => {
  if (!value) return '';
  let v = value.replace(/\D/g, '');
  if (v === '') return '';
  v = (parseInt(v, 10) / 100).toFixed(2);
  v = v.replace('.', ',');
  v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  return 'R$ ' + v;
};

const ConversationPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 14; 
  
  // Extract sessionId from URL if present
  const [presentationSessionId, setPresentationSessionId] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('session');
  });

  useEffect(() => {
    if (!presentationSessionId) {
      const sid = crypto.randomUUID();
      const newUrl = `${window.location.pathname}?session=${sid}`;
      window.history.replaceState({ path: newUrl }, '', newUrl);
      setPresentationSessionId(sid);
    } else {
      // Tenta carregar dados existentes
      const draft = PresentationGovernanceDraftRepository.findBySessionId(presentationSessionId);
      if (draft && draft.diagnosticData) {
        setSessionData(prev => ({
          ...prev,
          ...draft.diagnosticData,
          clientName: draft.clientInfo?.name || prev.clientName,
          clientEmail: draft.clientInfo?.email || prev.clientEmail,
          clientPhone: draft.clientInfo?.phone || prev.clientPhone,
          clientDoc: draft.clientInfo?.docNumber || prev.clientDoc,
          companyName: draft.clientInfo?.company || prev.companyName,
        }));
      }
    }
  }, [presentationSessionId]);

  const [sessionData, setSessionData] = useState({
    impactos_30_dias: [],
    prioridades_atuais: [],
    dependencia_notas: {},
    clareza_respostas: {},
    lideranca_respostas: {},
    operacao_respostas: {},
    acesso_indicadores: {},
    confianca_numeros: '',
    tempo_operacao: 80,
    tempo_governo: 20,
    areas_atuacao: [],
    mapa_decisoes: {},
    maior_ralo: [],
    nota_preparacao: null,
    precisa_ajuda: '',
    // Vendas fields
    salesStatus: 'aguardando',
    lossReason: '',
    kickoffDate: '',
    kickoffTime: '',
    clientName: '',
    clientDoc: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    repName: '',
    contractForo: 'Ex: Barueri/SP',
    consultantEmail: '',
    totalInvestment: 'R$ 15.200,00',
    entranceValue: 'R$ 3.800,00',
    installments: 4,
    paymentMethod: 'credit',
    devolutiva_pontos_fortes: '',
    devolutiva_contradicao: '',
    devolutiva_frase: ''
  });
  
  const [closingState, setClosingState] = useState(null); // 'payment', 'schedule', 'downsell', 'loss_reason'
  const [contractGenerated, setContractGenerated] = useState(false);
  const [devolutivaStep, setDevolutivaStep] = useState(0);
  const [preliminaryScore, setPreliminaryScore] = useState(null);
  const totalDevolutivaSteps = 6; 

  const calculatePreliminaryScore = () => {
    // 1. Independência (Inverso da Dependência - 10 perguntas, valores 0 a 10)
    // 10 = Muito dependente. Então a nota boa é (10 - valor).
    const depScores = Object.values(sessionData.dependencia_notas || {});
    let independencia = 0;
    if (depScores.length > 0) {
      const avgDep = depScores.reduce((a, b) => a + Number(b), 0) / depScores.length;
      independencia = 10 - avgDep;
    }

    // Função auxiliar para perguntas "Sim", "Parcial", "Não"
    const parseScore = (respostas, positiveValues = ['Sim'], partialValues = ['Parcial', 'Parcialmente']) => {
      const vals = Object.values(respostas || {});
      if (vals.length === 0) return 0;
      let sum = 0;
      vals.forEach(v => {
        if (positiveValues.includes(v)) sum += 10;
        else if (partialValues.includes(v)) sum += 5;
      });
      return sum / vals.length;
    };

    // 2. Clareza
    const clareza = parseScore(sessionData.clareza_respostas);

    // 3. Liderança
    const lideranca = parseScore(sessionData.lideranca_respostas);

    // 4. Operação
    // Para operação, a primeira (idx 0), a sétima (idx 6) e a décima (idx 9) o Sim é positivo.
    // Nas demais o 'Não' é positivo. (Temos 10 perguntas)
    const opVals = sessionData.operacao_respostas || {};
    let opSum = 0;
    let opCount = 0;
    for (let i = 0; i < 10; i++) {
      if (opVals[i] !== undefined) {
        opCount++;
        const val = opVals[i];
        const isGood = [0, 6, 9].includes(i);
        if (isGood) {
          if (val === 'Sim') opSum += 10;
          else if (val === 'Parcialmente' || val === 'Parcial') opSum += 5;
        } else {
          if (val === 'Não') opSum += 10;
          else if (val === 'Parcialmente' || val === 'Parcial') opSum += 5;
        }
      }
    }
    const operacao = opCount > 0 ? opSum / opCount : 0;

    // Geral (Média)
    const geral = (independencia + clareza + lideranca + operacao) / 4;
    
    let nivel = 'Crítico';
    let cor = '#ef4444'; // red
    if (geral >= 8) { nivel = 'Otimizado'; cor = '#22c55e'; }
    else if (geral >= 6) { nivel = 'Organizado'; cor = '#d4af37'; }
    else if (geral >= 4) { nivel = 'Sobrecarga'; cor = '#f97316'; }

    // Textos automáticos da Devolutiva
    let pontosFortes = '';
    const scores = [
      { name: 'INDEPENDÊNCIA', val: independencia },
      { name: 'CLAREZA', val: clareza },
      { name: 'LIDERANÇA', val: lideranca },
      { name: 'OPERAÇÃO', val: operacao }
    ];
    scores.sort((a, b) => b.val - a.val); // Maior para o menor
    const bestScore = scores[0];
    const worstScore = scores[3];

    if (bestScore.name === 'INDEPENDÊNCIA') {
      pontosFortes = 'O ponto mais forte identificado é a INDEPENDÊNCIA do dono. A empresa já consegue rodar algumas áreas sem você, o que é um excelente pilar para a escala futura.';
    } else if (bestScore.name === 'CLAREZA') {
      pontosFortes = 'O ponto mais forte é a CLAREZA. Você (e possivelmente a equipe) sabem para onde a empresa está indo, mesmo que ainda faltem processos perfeitamente azeitados para chegar lá.';
    } else if (bestScore.name === 'LIDERANÇA') {
      pontosFortes = 'O ponto mais forte é a LIDERANÇA e o time. Você já tem pessoas chave que puxam responsabilidade. O desafio agora é dar a elas os processos certos.';
    } else {
      pontosFortes = 'A empresa tem um pilar interessante na MATURIDADE OPERACIONAL. Mesmo com dependências, as engrenagens rodam e o produto/serviço é entregue.';
    }

    const desejo = sessionData.visao_futuro || sessionData.prioridades_atuais?.[0] || 'crescer e expandir';
    let contradicao = '';
    if (worstScore.name === 'INDEPENDÊNCIA') {
      contradicao = `Deseja alcançar: "${desejo}", mas o modelo de gestão atual ainda é extremamente centralizador. O crescimento vai gerar sobrecarga imediata no dono, travando a operação.`;
    } else if (worstScore.name === 'OPERAÇÃO') {
      contradicao = `Deseja alcançar: "${desejo}", mas a operação atual não suporta escala. Falta padronização, o que significa que mais vendas vão gerar mais caos e perda de margem.`;
    } else if (worstScore.name === 'LIDERANÇA') {
      contradicao = `Quer alcançar "${desejo}", mas não possui líderes autônomos. Toda decisão estratégica precisa voltar para o dono, criando um teto invisível de crescimento.`;
    } else {
      contradicao = `Quer alcançar "${desejo}", mas não existe clareza ou metas compartilhadas com a equipe. A equipe rema, mas sem um norte métrico claro de onde devem chegar.`;
    }

    const obs = sessionData.principal_obstaculo ? `Sobre o seu maior obstáculo: "${sessionData.principal_obstaculo}".` : '';
    const fraseMarcante = `${obs} Se não implementarmos um Governo Empresarial agora, seu teto de crescimento será sempre o seu limite de horas no dia. O risco é continuar operando na exaustão sem capturar o lucro real que a empresa pode dar.`;

    setSessionData(prev => ({
      ...prev,
      devolutiva_pontos_fortes: prev.devolutiva_pontos_fortes || pontosFortes,
      devolutiva_contradicao: prev.devolutiva_contradicao || contradicao,
      devolutiva_frase: prev.devolutiva_frase || fraseMarcante
    }));

    setPreliminaryScore({
      independencia: Math.max(0, independencia).toFixed(1),
      clareza: Math.max(0, clareza).toFixed(1),
      lideranca: Math.max(0, lideranca).toFixed(1),
      operacao: Math.max(0, operacao).toFixed(1),
      geral: Math.max(0, geral).toFixed(1),
      nivel,
      cor
    });
  };

  useEffect(() => {
    // Quando chegar no slide de devolutiva, simular um tempo real de processamento e gerar o cálculo
    if (currentSlide === 13 && devolutivaStep === 0) {
      calculatePreliminaryScore();
      const timer = setTimeout(() => {
        setDevolutivaStep(1);
      }, 3500); // 3.5 segundos de "processamento" real
      return () => clearTimeout(timer);
    }
  }, [currentSlide, devolutivaStep]);

  const toggleArrayItem = (key, item, max = null) => {
    setSessionData(prev => {
      const arr = prev[key] || [];
      if (arr.includes(item)) {
        return { ...prev, [key]: arr.filter(i => i !== item) };
      } else {
        if (max && arr.length >= max) return prev;
        return { ...prev, [key]: [...arr, item] };
      }
    });
  };

  const updateNestedData = (key, subKey, value) => {
    setSessionData(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [subKey]: value
      }
    }));
  };

  const updateData = (key, value) => {
    setSessionData(prev => ({ ...prev, [key]: value }));
  };

  const saveDraftToDB = (dataToSave = sessionData) => {
    if (presentationSessionId) {
      const pData = {
        clientName: dataToSave.clientName,
        clientEmail: dataToSave.clientEmail,
        clientPhone: dataToSave.clientPhone,
        docNumber: dataToSave.clientDoc,
        repName: dataToSave.repName,
        clientAddress: dataToSave.clientAddress,
        totalInvestment: dataToSave.totalInvestment,
        entranceValue: dataToSave.entranceValue,
        installments: dataToSave.installments,
        paymentMethod: dataToSave.paymentMethod,
        consultantEmail: dataToSave.consultantEmail,
        contractForo: dataToSave.contractForo,
        salesStatus: dataToSave.salesStatus || 'em negociação',
        lossReason: dataToSave.lossReason,
        kickoffDate: dataToSave.kickoffDate,
        kickoffTime: dataToSave.kickoffTime,
        personType: dataToSave.clientDoc?.length > 14 ? 'PJ' : 'PF'
      };
      
      const draft = mapPresentationToGovernanceDraft(pData);
      
      draft.diagnosticData = {
        ...draft.diagnosticData,
        impactos_30_dias: dataToSave.impactos_30_dias,
        prioridades_atuais: dataToSave.prioridades_atuais,
        dependencia_notas: dataToSave.dependencia_notas,
        clareza_respostas: dataToSave.clareza_respostas,
        lideranca_respostas: dataToSave.lideranca_respostas,
        operacao_respostas: dataToSave.operacao_respostas,
        acesso_indicadores: dataToSave.acesso_indicadores
      };
      
      PresentationGovernanceDraftRepository.save(presentationSessionId, draft);
    }
  };

  const nextSlide = () => {
    saveDraftToDB();
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      // É o último slide e clicou em Finalizar (Isso significa que NÃO comprou o mapa 360)
      if (!closingState || closingState === 'downsell') {
         setClosingState('downsell');
      }
    }
  };

  const prevSlide = () => {
    saveDraftToDB();
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Touch Swipe Handlers for mobile navigation
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    if (e.target.closest('input') || e.target.closest('textarea') || e.target.closest('select')) return;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (e.target.closest('input') || e.target.closest('textarea') || e.target.closest('select')) return;
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

  // Keypress navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <div 
      className="min-h-screen bg-[#0a1120] text-gray-100 font-sans selection:bg-[#d4af37]/30"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-amber-500/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#d4af37]/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Header / Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 md:px-8 py-3 md:py-6 pointer-events-none bg-[#0a1120]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <a 
                href="/admin" 
                className="pointer-events-auto flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all border border-transparent hover:border-gray-800"
                title="Voltar ao Painel Admin"
              >
                <ChevronLeft className="w-4 h-4" />
              </a>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)] pointer-events-auto shrink-0">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-white text-xs sm:text-sm tracking-widest uppercase pointer-events-auto">
                  PGE <span className="text-gray-500 font-light hidden sm:inline">| ANÁLISE DE NEGÓCIO</span>
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
              <div className="flex items-center gap-1.5 md:gap-2 bg-white/5 border border-white/10 rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 backdrop-blur-sm">
                <span className="text-[#d4af37] font-mono text-xs sm:text-sm font-bold">
                  {String(currentSlide + 1).padStart(2, '0')}
                </span>
                <span className="text-gray-600 font-mono text-xs sm:text-sm">/</span>
                <span className="text-gray-500 font-mono text-xs sm:text-sm">
                  {String(totalSlides).padStart(2, '0')}
                </span>
              </div>
              <button 
                onClick={toggleFullScreen}
                className="hidden sm:block p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-[#d4af37] hover:border-[#d4af37]/50 transition-colors"
                title="Tela Cheia"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="h-1 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-[#d4af37]/50 via-[#d4af37] to-[#f3e5ab] transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-[100dvh] overflow-hidden flex flex-col pt-20 sm:pt-24 md:pt-32">
        <div className="flex-1 w-full max-w-[1400px] mx-auto px-3 sm:px-4 md:px-8 h-full overflow-y-auto custom-scrollbar flex flex-col">
          <div className="w-full mt-auto mb-auto flex flex-col pt-4 md:pt-8 pb-24 md:pb-32">

            {/* SLIDE 1: ABERTURA */}
            {currentSlide === 0 && (
              <div className="flex flex-col justify-start max-w-4xl animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-[1.1] mb-6 uppercase tracking-tight">
                  ANÁLISE DE <br />
                  <span className="text-[#d4af37]">NEGÓCIO</span>
                </h1>
                
                <h2 className="text-xl md:text-2xl font-light text-gray-300 mb-12 max-w-2xl leading-relaxed">
                  Sua empresa possui um sistema para funcionar ou você ainda é parte importante demais desse sistema?
                </h2>

                <div className="bg-black/30 border border-[#d4af37]/20 p-6 rounded-2xl max-w-2xl mb-12 backdrop-blur-sm border-l-4 border-l-[#d4af37]">
                  <p className="text-sm text-gray-400 font-light leading-relaxed italic">
                    "Esta não é uma auditoria e não é uma apresentação comercial. O objetivo desta conversa é entender como sua empresa funciona hoje, onde existem possíveis gargalos e quanto da operação ainda depende diretamente de você."
                  </p>
                </div>

                <div className="flex">
                  <button 
                    onClick={nextSlide}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-heading font-extrabold text-sm rounded-xl uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                  >
                    Começar conversa
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* SLIDE 2: CADASTRO DO EMPRESÁRIO */}
            {currentSlide === 1 && (
              <div className="flex flex-col justify-start max-w-5xl animate-fade-in w-full">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-4 block">Contexto</span>
                <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white leading-tight mb-8">
                  DADOS DO <span className="text-[#d4af37]">EMPRESÁRIO E EMPRESA</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  {/* Empresário */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-heading font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2"><Users className="w-5 h-5 text-[#d4af37]"/> Sobre você</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 md:col-span-1"><label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">Nome</label><input type="text" className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none transition-all" /></div>
                      <div className="col-span-2 md:col-span-1"><label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">Sobrenome</label><input type="text" className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none transition-all" /></div>
                      <div className="col-span-2"><label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">Cargo</label><input type="text" className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none transition-all" /></div>
                      <div className="col-span-2 md:col-span-1"><label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">Telefone</label><input type="text" className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none transition-all" /></div>
                      <div className="col-span-2 md:col-span-1"><label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">E-mail</label><input type="email" className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none transition-all" /></div>
                    </div>
                  </div>

                  {/* Empresa */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-heading font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2"><Briefcase className="w-5 h-5 text-[#d4af37]"/> Sobre o negócio</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2"><label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">Empresa</label><input type="text" className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none transition-all" /></div>
                      <div className="col-span-2 md:col-span-1"><label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">Segmento</label><input type="text" className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none transition-all" /></div>
                      <div className="col-span-2 md:col-span-1"><label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">Tempo de Mercado</label><input type="text" className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none transition-all" /></div>
                      <div className="col-span-2 md:col-span-1"><label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">Nº de Funcionários</label><input type="number" className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none transition-all" /></div>
                      <div className="col-span-2 md:col-span-1"><label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">Nº de Gestores</label><input type="number" className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none transition-all" /></div>
                      <div className="col-span-2"><label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">Faturamento Anual Aprox.</label>
                        <select className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none transition-all">
                          <option value="">Selecione...</option>
                          <option value="ate_1m">Até R$ 1 Milhão</option>
                          <option value="1m_5m">R$ 1M a R$ 5 Milhões</option>
                          <option value="5m_15m">R$ 5M a R$ 15 Milhões</option>
                          <option value="15m_50m">R$ 15M a R$ 50 Milhões</option>
                          <option value="mais_50m">Acima de R$ 50 Milhões</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 3: A GRANDE PERGUNTA */}
            {currentSlide === 2 && (
              <div className="flex flex-col justify-start w-full animate-fade-in">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">Reflexão Inicial</span>
                <h2 className="text-3xl md:text-5xl lg:text-[42px] font-heading font-extrabold text-white leading-tight mb-4 w-full">
                  Se você ficasse <span className="text-[#d4af37]">30 dias</span> sem participar da operação da empresa, <span className="text-gray-400">o que aconteceria?</span>
                </h2>

                <div className="mb-4">
                  <textarea 
                    placeholder="Resposta do empresário..." 
                    className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-sm p-4 rounded-xl outline-none transition-all min-h-[120px] resize-none"
                  ></textarea>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-sm font-heading font-bold text-white mb-4 uppercase tracking-wider">O que provavelmente pararia ou sofreria impacto? (Múltipla escolha)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Vendas', 'Decisões', 'Pagamentos', 'Compras', 'Atendimento', 'Operações', 'Projetos', 'Gestão de Pessoas', 'Negociação', 'Clientes Importantes', 'Fornecedores', 'Marketing', 'Financeiro', 'Nada Relevante'].map((item) => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${sessionData.impactos_30_dias?.includes(item) ? 'bg-[#d4af37] border-[#d4af37]' : 'border-gray-700 group-hover:border-[#d4af37]'}`}>
                          <input 
                            type="checkbox" 
                            className="opacity-0 absolute" 
                            checked={sessionData.impactos_30_dias?.includes(item)}
                            onChange={() => toggleArrayItem('impactos_30_dias', item)}
                          />
                          {sessionData.impactos_30_dias?.includes(item) && <CheckCircle2 className="w-3 h-3 text-black" />}
                        </div>
                        <span className={`text-xs transition-colors ${sessionData.impactos_30_dias?.includes(item) ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 4: O QUE O EMPRESÁRIO QUER? */}
            {currentSlide === 3 && (
              <div className="flex flex-col justify-start max-w-5xl animate-fade-in">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-4 block">Objetivo do Empresário</span>
                <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white leading-tight mb-8">
                  VISÃO DE <span className="text-[#d4af37]">FUTURO</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className="text-sm text-gray-300 font-bold mb-3 block">Onde você quer que sua empresa esteja daqui a 12 meses?</label>
                    <textarea 
                      placeholder="Visão de futuro (Ex: Faturar 20 Milhões, expandir filial, etc)..." 
                      value={sessionData.visao_futuro || ''}
                      onChange={(e) => updateData('visao_futuro', e.target.value)}
                      className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-sm p-4 rounded-xl outline-none transition-all min-h-[100px] resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 font-bold mb-3 block">Qual é hoje a principal coisa que impede isso?</label>
                    <textarea 
                      placeholder="Principal obstáculo..." 
                      value={sessionData.principal_obstaculo || ''}
                      onChange={(e) => updateData('principal_obstaculo', e.target.value)}
                      className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-sm p-4 rounded-xl outline-none transition-all min-h-[100px] resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-sm font-heading font-bold text-white mb-4 uppercase tracking-wider">Escolha até 3 prioridades atuais:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      'Aumentar faturamento', 'Aumentar lucro', 'Reduzir custos', 'Formar lideranças', 
                      'Melhorar processos', 'Vender mais', 'Organizar comercial', 'Organizar financeiro', 
                      'Reduzir dependência', 'Contratar', 'Delegar', 'Criar indicadores', 
                      'Automatizar', 'Melhorar produtividade', 'Preparar sucessão', 'Preparar para venda'
                    ].map((item) => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${sessionData.prioridades_atuais?.includes(item) ? 'bg-[#d4af37] border-[#d4af37]' : 'border-gray-700 group-hover:border-[#d4af37]'}`}>
                          <input 
                            type="checkbox" 
                            className="opacity-0 absolute" 
                            checked={sessionData.prioridades_atuais?.includes(item)}
                            onChange={() => toggleArrayItem('prioridades_atuais', item, 3)}
                          />
                          {sessionData.prioridades_atuais?.includes(item) && <CheckCircle2 className="w-3 h-3 text-black" />}
                        </div>
                        <span className={`text-xs transition-colors ${sessionData.prioridades_atuais?.includes(item) ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 5: DEPENDÊNCIA DO DONO */}
            {currentSlide === 4 && (
              <div className="flex flex-col justify-start w-full animate-fade-in">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">1. Dependência</span>
                <h2 className="text-3xl md:text-5xl lg:text-[42px] font-heading font-extrabold text-white leading-tight mb-4 w-full">
                  Quanto da sua empresa <span className="text-[#d4af37]">ainda passa por você?</span>
                </h2>

                <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
                  {[
                    'Sua equipe precisa de você para tomar decisões importantes?',
                    'Problemas operacionais chegam até você?',
                    'Clientes importantes dependem da sua participação?',
                    'Você precisa cobrar para as coisas acontecerem?',
                    'Existem informações que somente você possui?',
                    'Algumas decisões ficam paradas esperando você?',
                    'Seus gestores pedem autorização frequentemente?',
                    'Você é necessário para fechar vendas importantes?',
                    'Você resolve problemas que acredita que outras pessoas poderiam resolver?',
                    'Quando você se afasta, sente necessidade de acompanhar o WhatsApp constantemente?'
                  ].map((pergunta, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <span className="text-xs md:text-sm text-gray-200 font-medium flex-1 leading-tight">{pergunta}</span>
                      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
                        <span className="text-[9px] text-gray-500 font-bold uppercase w-9 sm:w-10 text-right shrink-0">Nunca</span>
                        <div className="flex gap-1 shrink-0">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                            <button 
                              key={val} 
                              onClick={() => updateNestedData('dependencia_notas', idx, val)}
                              className={`w-6 h-6 md:w-7 md:h-7 rounded-lg border text-[10px] md:text-xs font-mono transition-colors flex items-center justify-center shrink-0 ${sessionData.dependencia_notas?.[idx] === val ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/20' : 'border-gray-700 text-gray-400 hover:border-[#d4af37] hover:text-[#d4af37] hover:bg-[#d4af37]/10'}`}>
                              {val}
                            </button>
                          ))}
                        </div>
                        <span className="text-[9px] text-red-500/80 font-bold uppercase w-9 sm:w-10 ml-0.5 sm:ml-1 shrink-0">Sempre</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE 6: CLAREZA */}
            {currentSlide === 5 && (
              <div className="flex flex-col justify-start w-full animate-fade-in">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">2. Clareza Organizacional</span>
                <h2 className="text-3xl md:text-5xl lg:text-[42px] font-heading font-extrabold text-white leading-tight mb-4 w-full">
                  A empresa pode ter pessoas competentes e ainda assim perder velocidade por <span className="text-[#d4af37]">falta de clareza.</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-4 w-full">
                  <div>
                    <label className="text-sm text-gray-300 font-bold mb-2 block">Quais são as 3 maiores prioridades da empresa atualmente?</label>
                    <textarea 
                      placeholder="Prioridades..." 
                      className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-sm p-3 rounded-xl outline-none transition-all min-h-[60px] resize-none"
                    ></textarea>
                    
                    <div className="mt-3">
                      <label className="text-xs text-gray-400 font-bold mb-2 block uppercase tracking-wider">Você acredita que seus gestores responderiam a mesma coisa?</label>
                      <div className="flex gap-2">
                        {['Sim', 'Talvez', 'Não'].map(opt => (
                          <button 
                            key={opt} 
                            onClick={() => updateData('gestores_mesma_resposta', opt)}
                            className={`flex-1 py-1.5 rounded-lg border text-[10px] uppercase tracking-wider transition-all ${sessionData.gestores_mesma_resposta === opt ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : 'border-gray-700 text-gray-300 hover:border-[#d4af37] hover:text-[#d4af37]'}`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                    {[
                      'Existe meta anual clara?',
                      'Existe meta por área?',
                      'Cada gestor sabe exatamente pelo que responde?',
                      'Existe clareza sobre quem decide o quê?',
                      'Existem indicadores por área?',
                      'Existe reunião regular de acompanhamento?',
                      'As decisões das reuniões viram tarefas com responsáveis e prazo?'
                    ].map((pergunta, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-2 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs text-gray-300 flex-1 leading-tight">{pergunta}</span>
                        <div className="flex gap-1 shrink-0">
                          {['Sim', 'Parcial', 'Não'].map(opt => (
                            <button 
                              key={opt} 
                              onClick={() => updateNestedData('clareza_respostas', idx, opt)}
                              className={`px-2 py-1.5 rounded-md border text-[9px] uppercase tracking-wider transition-colors ${sessionData.clareza_respostas?.[idx] === opt ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : 'border-gray-700 text-gray-400 hover:border-[#d4af37] hover:text-[#d4af37]'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 7: LIDERANÇA */}
            {currentSlide === 6 && (
              <div className="flex flex-col justify-start w-full animate-fade-in">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">3. Liderança e Autonomia</span>
                <h2 className="text-3xl md:text-5xl lg:text-[42px] font-heading font-extrabold text-white leading-tight mb-4">
                  Como funciona o seu <span className="text-[#d4af37]">primeiro escalão?</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-sm flex flex-col gap-4">
                    <div>
                      <label className="text-sm text-gray-300 font-bold mb-2 block">Quantos gestores respondem diretamente a você?</label>
                      <input type="number" className="w-24 bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-lg font-mono text-center px-4 py-2 rounded-xl outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 font-bold mb-2 block">Quantos deles você considera <span className="text-[#d4af37]">realmente autônomos</span>?</label>
                      <input type="number" className="w-24 bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-lg font-mono text-center px-4 py-2 rounded-xl outline-none transition-all" />
                    </div>
                    <div className="pt-3 border-t border-gray-800">
                       <label className="text-xs text-gray-300 font-bold mb-3 block">Você sente que possui líderes ou apenas pessoas que coordenam atividades?</label>
                       <div className="flex items-center gap-3">
                         <span className="text-[9px] text-gray-500 font-bold uppercase">Apenas Coordenam</span>
                         <input type="range" min="0" max="10" className="flex-1 accent-[#d4af37] bg-gray-800 h-2 rounded-full appearance-none outline-none" />
                         <span className="text-[9px] text-[#d4af37] font-bold uppercase">Líderes Fortes</span>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                    {[
                      'Seus gestores conseguem resolver problemas sem escalar para você?',
                      'Eles possuem indicadores claros?',
                      'Eles possuem autoridade compatível com a responsabilidade?',
                      'Eles sabem até onde podem decidir?',
                      'Existem reuniões individuais de acompanhamento?',
                      'Existe cobrança por resultado (e não só por tarefas)?'
                    ].map((pergunta, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-2 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs text-gray-300 flex-1 leading-tight">{pergunta}</span>
                        <div className="flex gap-1 shrink-0">
                          {['Sim', 'Parcial', 'Não'].map(opt => (
                            <button 
                              key={opt} 
                              onClick={() => updateNestedData('lideranca_respostas', idx, opt)}
                              className={`px-2 py-1.5 rounded-md border text-[9px] uppercase tracking-wider transition-colors ${sessionData.lideranca_respostas?.[idx] === opt ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : 'border-gray-700 text-gray-400 hover:border-[#d4af37] hover:text-[#d4af37]'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 8: OPERAÇÃO */}
            {currentSlide === 7 && (
              <div className="flex flex-col justify-start w-full animate-fade-in">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">4. Maturidade Operacional</span>
                <h2 className="text-3xl md:text-5xl lg:text-[42px] font-heading font-extrabold text-white leading-tight mb-4">
                  Como as coisas <span className="text-[#d4af37]">acontecem de verdade</span> na empresa?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 w-full max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    'Se uma pessoa importante sair amanhã, existe processo documentado para outra continuar?',
                    'Existem processos que estão somente na cabeça das pessoas?',
                    'As tarefas são frequentemente passadas por WhatsApp?',
                    'Existe retrabalho frequente?',
                    'Existem atividades repetitivas que poderiam ser automatizadas?',
                    'Existem várias ferramentas diferentes para controlar a operação?',
                    'É fácil descobrir quem é responsável por cada entrega?',
                    'Existem tarefas sem responsável definido?',
                    'Existem projetos atrasados por falta de acompanhamento?',
                    'Existe um lugar central onde a gestão consegue enxergar o que está acontecendo?'
                  ].map((pergunta, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between gap-3">
                      <span className="text-xs text-gray-200 leading-tight">{pergunta}</span>
                      <div className="flex gap-2">
                        {['Sim', 'Parcialmente', 'Não'].map(opt => (
                          <button 
                            key={opt} 
                            onClick={() => updateNestedData('operacao_respostas', idx, opt)}
                            className={`flex-1 py-1.5 rounded-lg border text-[9px] uppercase tracking-wider transition-colors ${sessionData.operacao_respostas?.[idx] === opt ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : 'border-gray-700 text-gray-400 hover:border-[#d4af37] hover:text-[#d4af37]'}`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE 9: INDICADORES */}
            {currentSlide === 8 && (
              <div className="flex flex-col justify-start w-full animate-fade-in">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">5. Governabilidade e Indicadores</span>
                <h2 className="text-3xl md:text-5xl lg:text-[42px] font-heading font-extrabold text-white leading-tight mb-4">
                  Você dirige a empresa olhando para a <span className="text-[#d4af37]">estrada</span> ou para o <span className="text-gray-400">retrovisor?</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-2">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                      <h3 className="text-sm font-heading font-bold text-white mb-4 uppercase tracking-wider">Com que facilidade você acessa hoje:</h3>
                      <div className="space-y-2">
                        {[
                          'Margem de lucro real dos produtos/serviços',
                          'Custo de Aquisição de Clientes (CAC)',
                          'Tempo médio do ciclo de vendas',
                          'Taxa de conversão do comercial',
                          'Custo da folha em relação ao faturamento',
                          'Nível de satisfação/retenção de clientes'
                        ].map((indicador, idx) => (
                          <div key={idx} className="flex flex-col gap-1 border-b border-white/5 pb-2">
                            <span className="text-[11px] text-gray-300 leading-tight">{indicador}</span>
                            <div className="flex gap-2">
                              {['Tenho na hora', 'Demora um pouco', 'Não tenho'].map(opt => (
                                <button 
                                  key={opt} 
                                  onClick={() => updateNestedData('acesso_indicadores', idx, opt)}
                                  className={`px-2 py-1 rounded border text-[9px] uppercase tracking-wider transition-colors ${sessionData.acesso_indicadores?.[idx] === opt ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : 'border-gray-700 text-gray-400 hover:border-[#d4af37] hover:text-[#d4af37]'}`}>
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 border border-[#d4af37]/20 p-4 md:p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-center text-center">
                    <BarChart2 className="w-8 h-8 md:w-10 md:h-10 text-[#d4af37] mx-auto mb-4 opacity-80" />
                    <h3 className="text-lg md:text-xl font-heading font-bold text-white mb-2">Qualidade da Informação</h3>
                    <p className="text-[11px] md:text-xs text-gray-400 mb-6 leading-relaxed">
                      "Quando você precisa tomar uma decisão financeira ou estratégica importante, você confia 100% nos números que sua equipe apresenta?"
                    </p>
                    <div className="flex flex-col gap-2">
                      {['Confio 100%', 'Confio desconfiando (Preciso checar)', 'Tomo decisões mais por intuição'].map(opt => (
                        <button 
                          key={opt} 
                          onClick={() => updateData('confianca_numeros', opt)}
                          className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all ${sessionData.confianca_numeros === opt ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : 'border-gray-700 bg-white/5 text-gray-300 hover:border-[#d4af37] hover:text-[#d4af37] hover:bg-[#d4af37]/10'}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 10: TEMPO DO EMPRESÁRIO */}
            {currentSlide === 9 && (
              <div className="flex flex-col justify-start w-full animate-fade-in">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">Análise de Foco</span>
                <h2 className="text-3xl md:text-5xl lg:text-[42px] font-heading font-extrabold text-white leading-tight mb-4">
                  Como está distribuído o seu <span className="text-[#d4af37]">Tempo?</span>
                </h2>

                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start w-full">
                  <div className="w-full md:w-1/2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-sm font-heading font-bold text-white mb-6 uppercase tracking-wider text-center">Deslize para ajustar</h3>
                    
                    <div className="mb-6">
                      <div className="flex justify-between text-xs font-bold uppercase mb-2">
                        <span className="text-gray-400">Tempo na Operação (Apagar fogo)</span>
                        <span className="text-[#d4af37]">80%</span>
                      </div>
                      <input type="range" min="0" max="100" defaultValue="80" className="w-full accent-[#d4af37] bg-gray-800 h-3 rounded-full appearance-none outline-none" />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold uppercase mb-2">
                        <span className="text-gray-400">Tempo no Governo (Estratégia/Crescimento)</span>
                        <span className="text-[#d4af37]">20%</span>
                      </div>
                      <input type="range" min="0" max="100" defaultValue="20" className="w-full accent-[#d4af37] bg-gray-800 h-3 rounded-full appearance-none outline-none" />
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="text-lg md:text-xl font-heading font-bold text-white mb-4">Em quais destas áreas você ainda atua diretamente?</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Vendas Clientes VIP', 'Aprovação Financeira', 'Recrutamento', 'Marketing', 'Produção/Entrega', 'Suporte/Atendimento', 'Compras', 'Treinamento de Equipe', 'Resolução de Conflitos', 'Reuniões de Alinhamento'].map(area => (
                        <label key={area} className="cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={sessionData.areas_atuacao?.includes(area)}
                            onChange={() => toggleArrayItem('areas_atuacao', area)}
                          />
                          <div className={`px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all uppercase tracking-wider ${sessionData.areas_atuacao?.includes(area) ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : 'border-gray-700 text-gray-400 group-hover:border-[#d4af37] group-hover:text-[#d4af37]'}`}>
                            {area}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 11: MAPA DE DECISÕES */}
            {currentSlide === 10 && (
              <div className="flex flex-col justify-start w-full animate-fade-in">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">Centralização</span>
                <h2 className="text-3xl md:text-5xl lg:text-[42px] font-heading font-extrabold text-white leading-tight mb-4">
                  Mapa de <span className="text-[#d4af37]">Decisões</span>
                </h2>

                <p className="text-sm text-gray-400 mb-4 max-w-3xl">
                  Na rotina da empresa, quem aprova as seguintes situações? (Você, Gestores, ou Processo/Sistema)
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar w-full">
                  {[
                    'Descontos comerciais acima do padrão',
                    'Contratação de novos funcionários operacionais',
                    'Pagamentos não previstos no orçamento',
                    'Devolução de dinheiro a clientes insatisfeitos',
                    'Definição de preço de novos produtos/serviços',
                    'Compra de suprimentos rotineiros',
                    'Mudança em horários ou escalas de trabalho',
                    'Investimento em campanhas de marketing'
                  ].map((decisao, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-2 px-3 flex flex-col xl:flex-row xl:items-center justify-between gap-2">
                      <span className="text-xs text-gray-200 flex-1 pr-2 leading-tight">{decisao}</span>
                      <div className="flex gap-1 shrink-0">
                        {['Sempre Eu', 'Gestores', 'Processo/Sistema'].map(opt => (
                          <button 
                            key={opt} 
                            onClick={() => updateNestedData('mapa_decisoes', idx, opt)}
                            className={`px-2 py-1.5 rounded border text-[8px] uppercase tracking-wider transition-colors ${sessionData.mapa_decisoes?.[idx] === opt ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : 'border-gray-700 text-gray-400 hover:border-[#d4af37] hover:text-[#d4af37]'}`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE 12: CAPACIDADE ESCONDIDA */}
            {currentSlide === 11 && (
              <div className="flex flex-col justify-start w-full animate-fade-in">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">Custo da Desorganização</span>
                <h2 className="text-3xl md:text-5xl lg:text-[42px] font-heading font-extrabold text-white leading-tight mb-4">
                  Capacidade Escondida e <span className="text-red-500/80">Desperdício</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="col-span-1 md:col-span-2 space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6">
                      <label className="text-sm text-gray-300 font-bold mb-2 block">Se a sua empresa estivesse rodando como um relógio hoje, sem os gargalos atuais, quanto você estima que poderia faturar a mais (ou lucrar a mais) com a mesma estrutura?</label>
                      <textarea 
                        placeholder="Estimativa de valor ou percentual..." 
                        className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-sm p-3 rounded-xl outline-none transition-all min-h-[60px] resize-none"
                      ></textarea>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6">
                      <h3 className="text-sm font-heading font-bold text-white mb-3 uppercase tracking-wider">Onde está o maior ralo de dinheiro/tempo hoje?</h3>
                      <div className="flex flex-wrap gap-2">
                        {['Retrabalho', 'Vendas perdidas por desorganização', 'Multas/Atrasos', 'Clientes cancelando', 'Equipe ociosa/improdutiva', 'Falta de estoque', 'Estoque parado', 'Gastos desnecessários', 'Erro na precificação'].map(item => (
                          <button 
                            key={item} 
                            onClick={() => toggleArrayItem('maior_ralo', item)}
                            className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase tracking-wider transition-colors ${sessionData.maior_ralo?.includes(item) ? 'border-red-500 text-red-400 bg-red-500/20' : 'border-gray-700 text-gray-400 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10'}`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 bg-gradient-to-b from-red-500/10 to-transparent border border-red-500/20 rounded-2xl p-4 md:p-6 flex flex-col justify-center items-center text-center">
                    <Activity className="w-10 h-10 md:w-12 md:h-12 text-red-500/80 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">A Conta Chega</h3>
                    <p className="text-[11px] md:text-xs text-gray-400 leading-relaxed italic">
                      "Uma empresa desorganizada consome a energia do dono, corrói a margem de lucro e limita o crescimento. O preço de não organizar a casa é pago todos os dias."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 13: PERCEPÇÃO DO EMPRESÁRIO */}
            {currentSlide === 12 && (
              <div className="flex flex-col justify-start w-full mx-auto text-center animate-fade-in">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">Reflexão Final</span>
                <h2 className="text-3xl md:text-5xl lg:text-[42px] font-heading font-extrabold text-white leading-tight mb-4">
                  De 0 a 10, o quanto a sua empresa <span className="text-[#d4af37]">está preparada</span> para dobrar de tamanho amanhã?
                </h2>

                <div className="flex justify-center gap-2 mb-6 flex-wrap">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                    <button 
                      key={val} 
                      onClick={() => updateData('nota_preparacao', val)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-xl border-2 text-sm sm:text-base md:text-xl font-heading font-bold transition-all flex items-center justify-center ${sessionData.nota_preparacao === val ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/20 scale-105 sm:scale-110 shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'border-gray-700 text-gray-400 hover:border-[#d4af37] hover:text-[#d4af37] hover:bg-[#d4af37]/10'}`}>
                      {val}
                    </button>
                  ))}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm max-w-2xl mx-auto w-full">
                  <h3 className="text-base md:text-lg font-heading font-bold text-white mb-4">Você sente que precisa de ajuda para organizar o crescimento do negócio?</h3>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => updateData('precisa_ajuda', 'Ainda consigo sozinho')}
                      className={`px-6 py-3 md:px-8 md:py-4 rounded-xl border text-xs md:text-sm font-bold transition-all ${sessionData.precisa_ajuda === 'Ainda consigo sozinho' ? 'border-gray-500 bg-gray-800 text-white' : 'border-gray-700 bg-black/40 text-gray-300 hover:border-gray-500 hover:text-white'}`}>
                      Ainda consigo sozinho
                    </button>
                    <button 
                      onClick={() => updateData('precisa_ajuda', 'Sim, é o momento de estruturar')}
                      className={`px-6 py-3 md:px-8 md:py-4 rounded-xl border text-xs md:text-sm font-bold transition-all ${sessionData.precisa_ajuda === 'Sim, é o momento de estruturar' ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'border-[#d4af37]/50 bg-[#d4af37]/5 text-[#d4af37]/70 hover:bg-[#d4af37]/10 hover:border-[#d4af37] hover:text-[#d4af37]'}`}>
                      Sim, é o momento de estruturar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 14: DEVOLUTIVA E PITCH */}
            {currentSlide === 13 && (
              <div className="flex flex-col justify-start w-full mx-auto relative animate-fade-in">
                
                {devolutivaStep === 0 && (
                  <div className="flex flex-col items-center justify-center text-center animate-pulse h-[60vh]">
                    <Settings className="w-16 h-16 text-[#d4af37] animate-spin-slow mb-6 opacity-80" />
                    <h2 className="text-2xl font-heading font-bold text-white mb-2">Analisando o cenário...</h2>
                    <p className="text-gray-400 text-sm">Cruzando respostas e identificando padrões de governo empresarial</p>
                  </div>
                )}

                {devolutivaStep === 1 && (
                  <div className="animate-fade-in w-full">
                    <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">Leitura do Negócio</span>
                    <h2 className="text-3xl md:text-5xl lg:text-[42px] font-heading font-extrabold text-white leading-tight mb-4">
                      O que vimos de mais <span className="text-[#d4af37]">Forte</span>
                    </h2>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                      <p className="text-gray-400 text-sm mb-4 italic">Anotações do consultor sobre os pontos fortes identificados na conversa:</p>
                      <textarea 
                        className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-base p-4 rounded-xl outline-none transition-all min-h-[150px] resize-none custom-scrollbar"
                        placeholder="Ex: O empresário tem muita clareza do produto, a margem é boa e o mercado é aquecido..."
                        value={sessionData.devolutiva_pontos_fortes || ''}
                        onChange={(e) => updateData('devolutiva_pontos_fortes', e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                )}

                {devolutivaStep === 2 && (
                  <div className="animate-fade-in w-full">
                    <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">Observação Crítica</span>
                    <h2 className="text-3xl md:text-5xl lg:text-[42px] font-heading font-extrabold text-white leading-tight mb-4">
                      O que mais <span className="text-red-500/80">Chamou a Atenção</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">A grande contradição:</h3>
                        <textarea 
                          className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-sm p-4 rounded-xl outline-none transition-all min-h-[120px] resize-none"
                          placeholder="Ex: Quer dobrar o faturamento, mas ainda é quem aprova os pagamentos diários..."
                          value={sessionData.devolutiva_contradicao || ''}
                          onChange={(e) => updateData('devolutiva_contradicao', e.target.value)}
                        ></textarea>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Frase marcante que você disse:</h3>
                        <textarea 
                          className="w-full bg-black/40 border border-[#d4af37]/30 focus:border-[#d4af37] text-[#d4af37] text-lg p-4 rounded-xl outline-none transition-all min-h-[120px] resize-none italic"
                          placeholder='"Se eu não olhar, as coisas saem do trilho..."'
                          value={sessionData.devolutiva_frase || ''}
                          onChange={(e) => updateData('devolutiva_frase', e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {devolutivaStep === 3 && (
                  <div className="animate-fade-in w-full text-center">
                    <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">Mapa 360 Preliminar</span>
                    <h2 className="text-3xl md:text-5xl lg:text-[42px] font-heading font-extrabold text-white leading-tight mb-6">
                      Índice de <span className="text-[#d4af37]">Governo Empresarial</span>
                    </h2>
                    
                    <div className="flex justify-center mb-6">
                      <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#1f2937" strokeWidth="8" />
                          <circle 
                            cx="50" cy="50" r="45" fill="none" stroke={preliminaryScore?.cor || "#d4af37"} strokeWidth="8" 
                            strokeDasharray="283" 
                            strokeDashoffset={283 - (283 * (Number(preliminaryScore?.geral || 0) / 10))} 
                            className="transition-all duration-1000 ease-out" 
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold text-white mb-1" style={{ color: preliminaryScore?.cor || '#fff' }}>{preliminaryScore?.geral || '0.0'}</span>
                          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Nível {preliminaryScore?.nivel || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                      {[
                        { label: 'Independência', val: preliminaryScore?.independencia || '0.0' },
                        { label: 'Clareza', val: preliminaryScore?.clareza || '0.0' },
                        { label: 'Liderança', val: preliminaryScore?.lideranca || '0.0' },
                        { label: 'Operação', val: preliminaryScore?.operacao || '0.0' }
                      ].map(ind => (
                        <div key={ind.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                          <div className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-bold">{ind.label}</div>
                          <div className="text-lg font-bold text-white">{ind.val} <span className="text-[10px] text-gray-500 font-normal">/ 10</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {devolutivaStep === 4 && (
                  <div className="animate-fade-in w-full text-center flex flex-col items-center justify-center h-[60vh]">
                    <Target className="w-12 h-12 md:w-16 md:h-16 text-[#d4af37] mb-6" />
                    <h2 className="text-3xl md:text-5xl lg:text-[42px] font-heading font-extrabold text-white leading-tight mb-6 max-w-4xl mx-auto">
                      Para a sua empresa alcançar sua Visão de Futuro: <br/>
                      <span className="text-[#d4af37] block mt-4 text-2xl md:text-4xl leading-relaxed">"{sessionData.visao_futuro || 'Crescer de forma sustentável e faturar mais'}"</span>
                    </h2>
                    <h3 className="text-lg md:text-2xl font-light text-gray-300 max-w-4xl mx-auto leading-relaxed mt-4">
                      Você acha que pode continuar sendo engolido pela operação, sofrendo com <span className="text-red-400 font-bold">{sessionData.principal_obstaculo || 'a falta de processos e gargalos'}</span>, perdendo tempo e dinheiro rodando <span className="text-gray-400">exatamente do jeito que está hoje?</span>
                    </h3>
                  </div>
                )}

                {devolutivaStep === 5 && (
                  <div className="animate-fade-in w-full">
                    <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block text-center">O Próximo Passo</span>
                    <h2 className="text-3xl md:text-5xl lg:text-[42px] font-heading font-extrabold text-white leading-tight mb-6 text-center">
                      Mapa 360 de <span className="text-[#d4af37]">Governo Empresarial</span>
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center max-w-5xl mx-auto">
                      <div className="space-y-4">
                        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                          Nós vamos entrar na sua empresa por 4 semanas, mapear cada processo crítico, entrevistar seus líderes e criar o <strong className="text-white">Mapa do Governo Empresarial</strong>.
                        </p>
                        <ul className="space-y-3">
                          {[
                            'Raio-X de gargalos e desperdícios',
                            'Mapa de Riscos de Dependência',
                            'Avaliação técnica do 1º Escalão',
                            'Plano de Ação para os próximos 6 meses'
                          ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3">
                              <CheckCircle2 className="w-5 h-5 text-[#d4af37]" />
                              <span className="text-xs md:text-sm text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gradient-to-br from-[#d4af37]/20 to-black/40 border border-[#d4af37]/30 rounded-2xl p-8 backdrop-blur-sm text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 blur-3xl"></div>
                        <h3 className="text-sm font-bold text-gray-300 mb-2 uppercase tracking-widest">Investimento</h3>
                        <div className="flex items-baseline justify-center gap-2 mb-6">
                          <span className="text-2xl text-gray-400">4x R$</span>
                          <span className="text-5xl font-heading font-black text-white">3.800</span>
                        </div>
                        
                        <div className="flex flex-col gap-3 relative z-10">
                          <button 
                            onClick={() => setClosingState('payment_info')}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-extrabold uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                          >
                            Fechar Mapa 360
                          </button>
                          <button className="w-full py-3 rounded-xl border border-gray-700 bg-black/40 text-xs font-bold text-gray-400 hover:text-white transition-all uppercase tracking-wider">
                            Gerar PDF Resumo para o Sócio
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Controles Internos da Devolutiva */}
                <div className="mt-12 flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map(step => (
                    <button 
                      key={step}
                      onClick={() => setDevolutivaStep(step)}
                      className={`w-3 h-3 rounded-full transition-all ${devolutivaStep === step ? 'bg-[#d4af37] scale-125' : 'bg-gray-700 hover:bg-gray-500'}`}
                    />
                  ))}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* OVERLAYS DE FECHAMENTO / DOWNSELL */}
      {closingState && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a1120] border border-[#d4af37]/30 p-8 rounded-3xl w-full max-w-4xl shadow-[0_0_50px_rgba(212,175,55,0.15)] relative overflow-y-auto max-h-[90vh]">
            
            {/* 1. FLUXO DE PAGAMENTO - INFO DO CLIENTE */}
            {closingState === 'payment_info' && (
              <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-heading font-bold text-white mb-4">Dados do Cliente</h2>
                  <p className="text-gray-400">Precisamos dessas informações para gerar o contrato e o grupo.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nome / Empresa</label>
                    <input 
                      type="text" 
                      value={sessionData.clientName || ''}
                      onChange={(e) => updateData('clientName', e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-[#d4af37] outline-none"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">CPF / CNPJ</label>
                    <input 
                      type="text" 
                      value={sessionData.clientDoc || ''}
                      onChange={(e) => updateData('clientDoc', applyCpfCnpjMask(e.target.value))}
                      placeholder="000.000.000-00"
                      className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-[#d4af37] outline-none"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">WhatsApp</label>
                    <PhoneInput
                      international
                      defaultCountry="BR"
                      value={sessionData.clientPhone}
                      onChange={(val) => updateData('clientPhone', val)}
                      className="bg-black/50 border border-gray-700 focus-within:border-[#d4af37] text-white text-sm px-4 py-3 rounded-lg w-full transition-all duration-300 font-mono"
                      numberInputProps={{
                        className: "bg-transparent outline-none w-full border-none text-white",
                        required: true
                      }}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">E-mail</label>
                    <input 
                      type="email" 
                      value={sessionData.clientEmail || ''}
                      onChange={(e) => updateData('clientEmail', e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-[#d4af37] outline-none"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">E-mail do Consultor (Você)</label>
                    <input 
                      type="email" 
                      value={sessionData.consultantEmail || ''}
                      onChange={(e) => updateData('consultantEmail', e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-[#d4af37] outline-none"
                      placeholder="seu-email@empresa.com"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Endereço Completo</label>
                    <input 
                      type="text" 
                      value={sessionData.clientAddress || ''}
                      onChange={(e) => updateData('clientAddress', e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-[#d4af37] outline-none"
                      placeholder="Rua, Número, Bairro, CEP, Cidade/UF"
                    />
                  </div>
                  {sessionData.clientDoc?.length > 14 && (
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nome do Representante Legal (Assinante do CNPJ)</label>
                      <input 
                        type="text" 
                        value={sessionData.repName || ''}
                        onChange={(e) => updateData('repName', e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-[#d4af37] outline-none"
                        placeholder="Ex: João da Silva"
                      />
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Foro / Comarca Eleita</label>
                    <input 
                      type="text" 
                      value={sessionData.contractForo || ''}
                      onChange={(e) => updateData('contractForo', e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-[#d4af37] outline-none"
                      placeholder="Ex: Barueri/SP"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6 mt-6 border-t border-white/10">
                  <button 
                    onClick={() => setClosingState(null)}
                    className="w-1/3 py-4 rounded-xl border border-gray-700 text-gray-400 font-bold uppercase tracking-wider hover:text-white hover:bg-white/5 transition-all text-xs"
                  >
                    Voltar
                  </button>
                  <button 
                    onClick={() => setClosingState('payment_financial')}
                    disabled={!sessionData.clientName || !sessionData.clientEmail?.includes('@')}
                    className="w-2/3 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-extrabold uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Avançar
                  </button>
                </div>
              </div>
            )}

            {/* 1.1 FLUXO DE PAGAMENTO - INFO FINANCEIRA */}
            {closingState === 'payment_financial' && (() => {
              const parseBRL = (v) => parseFloat(String(v || '').replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
              const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
              
              const total = parseBRL(sessionData.totalInvestment);
              const entrada = parseBRL(sessionData.entranceValue);
              const saldo = Math.max(0, total - entrada);

              return (
                <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-heading font-bold text-white mb-4">Condições de Pagamento</h2>
                    <p className="text-gray-400">Confirme os valores do Mapa 360 para emissão do contrato.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Investimento Total</label>
                      <input 
                        type="text" 
                        value={sessionData.totalInvestment}
                        onChange={(e) => updateData('totalInvestment', formatBRLInput(e.target.value))}
                        className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-[#d4af37] outline-none font-mono"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Forma de Pag. do Saldo</label>
                      <select 
                        value={sessionData.paymentMethod}
                        onChange={(e) => updateData('paymentMethod', e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-[#d4af37] outline-none cursor-pointer"
                      >
                        <option value="credit">Cartão de Crédito</option>
                        <option value="pix">PIX</option>
                      </select>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Valor Sinal de Entrada</label>
                      <input 
                        type="text" 
                        value={sessionData.entranceValue}
                        onChange={(e) => updateData('entranceValue', formatBRLInput(e.target.value))}
                        className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-[#d4af37] outline-none font-mono"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Parcelamento do Saldo</label>
                      <select 
                        value={sessionData.installments}
                        onChange={(e) => updateData('installments', Number(e.target.value))}
                        className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-[#d4af37] outline-none cursor-pointer font-mono text-sm"
                      >
                        {[1, 2, 3].map(n => (
                          <option key={n} value={n}>{n}x de {formatBRL(saldo / n)}</option>
                        ))}
                      </select>
                    </div>
                    
                    {sessionData.paymentMethod === 'credit' && (
                      <div className="col-span-2 mt-2">
                        <p className="text-[#d4af37] text-[11px] italic font-bold text-center opacity-90">
                          *Valores sujeitos a acréscimo de juros da operadora do cartão conforme o número de parcelas.
                        </p>
                      </div>
                    )}
                  </div>

                <div className="flex gap-4 pt-6 mt-6 border-t border-white/10">
                  <button 
                    onClick={() => setClosingState('payment_info')}
                    className="w-1/3 py-4 rounded-xl border border-gray-700 text-gray-400 font-bold uppercase tracking-wider hover:text-white hover:bg-white/5 transition-all text-xs"
                  >
                    Voltar
                  </button>
                  <button 
                    onClick={() => setClosingState('payment_actions')}
                    className="w-2/3 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-extrabold uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  >
                    Avançar
                  </button>
                </div>
              </div>
            );
            })()}

            {/* 1.2 FLUXO DE PAGAMENTO - AÇÕES (CONTRATO/GRUPO) */}
            {closingState === 'payment_actions' && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-heading font-bold text-white mb-4">Parabéns pelo Fechamento, {sessionData.clientName}!</h2>
                  <p className="text-gray-400">Aqui estão os próximos passos para iniciar o Mapa 360 de Governo Empresarial.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-[#d4af37] font-bold uppercase tracking-wider text-sm mb-6 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Entregáveis do Mapa 360
                    </h3>
                    <ul className="space-y-4">
                      {[
                        'Raio-X de gargalos e desperdícios',
                        'Mapa de Riscos de Dependência',
                        'Avaliação técnica do 1º Escalão',
                        'Plano de Ação para os próximos 6 meses'
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-gray-500 shrink-0" />
                          <span className="text-sm text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <a 
                      href={`https://wa.me/5581994691175?text=Oi%2C%20vamos%20criar%20o%20grupo.%20Nome%3A%20${encodeURIComponent(sessionData.clientName || '')}%20-%20Tel%3A%20${encodeURIComponent(sessionData.clientPhone || '')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-[#d4af37]/50 rounded-xl transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="text-left">
                          <span className="block text-white font-bold text-sm">Criar Grupo no WhatsApp</span>
                          <span className="block text-gray-500 text-xs">Conectar equipe e cliente</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#d4af37] transition-colors" />
                    </a>

                    <button 
                      className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-[#d4af37]/50 rounded-xl transition-all group"
                      onClick={() => {
                        const isCNPJ = sessionData.clientDoc?.length > 14;
                        const cData = {
                          clientName: sessionData.clientName,
                          docNumber: sessionData.clientDoc,
                          personType: isCNPJ ? 'PJ' : 'PF',
                          repName: sessionData.repName || sessionData.clientName,
                          clientAddress: sessionData.clientAddress,
                          totalInvestment: sessionData.totalInvestment,
                          entranceValue: sessionData.entranceValue,
                          installments: sessionData.installments,
                          paymentMethod: sessionData.paymentMethod,
                          contractForo: sessionData.contractForo,
                          consultantEmail: sessionData.consultantEmail,
                          isDiagnostic: true
                        };
                        downloadContract(cData);
                        setContractGenerated(true);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="text-left">
                          <span className="block text-white font-bold text-sm">Gerar Contrato ({sessionData.clientDoc})</span>
                          <span className="block text-gray-500 text-xs">{contractGenerated ? 'Contrato Baixado ✅' : 'Emitir via D4Sign/Doc'}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#d4af37] transition-colors" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-white/10">
                  <button 
                    onClick={() => setClosingState('payment_financial')}
                    className="w-1/3 py-4 rounded-xl border border-gray-700 text-gray-400 font-bold uppercase tracking-wider hover:text-white hover:bg-white/5 transition-all text-xs"
                  >
                    Voltar
                  </button>
                  <button 
                    onClick={() => {
                      updateData('salesStatus', 'ganho');
                      setClosingState('schedule');
                    }}
                    className="w-2/3 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-extrabold uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  >
                    Avançar para Agendamento
                  </button>
                </div>
              </div>
            )}

            {/* 1.1 AGENDA (PÓS-FECHAMENTO) */}
            {closingState === 'schedule' && (
              <div className="space-y-8 animate-fade-in max-w-lg mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#d4af37]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-8 h-8 text-[#d4af37]" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-white mb-2">Agendar Mapa 360</h2>
                  <p className="text-gray-400 text-sm">Defina a data de início ou a primeira reunião de Kickoff.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Data</label>
                    <input 
                      type="date" 
                      value={sessionData.kickoffDate || ''}
                      onChange={(e) => updateData('kickoffDate', e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-[#d4af37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Horário</label>
                    <input 
                      type="time" 
                      value={sessionData.kickoffTime || ''}
                      onChange={(e) => updateData('kickoffTime', e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-[#d4af37] outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-8">
                  <button 
                    onClick={() => setClosingState('payment_actions')}
                    className="w-1/3 py-4 rounded-xl border border-gray-700 text-gray-400 font-bold uppercase tracking-wider hover:text-white hover:bg-white/5 transition-all text-xs"
                  >
                    Voltar
                  </button>
                  <button 
                    onClick={() => {
                      saveDraftToDB({ ...sessionData, salesStatus: 'fechado' });
                      window.location.href = '/admin';
                    }}
                    className="w-2/3 py-4 rounded-xl bg-green-600 text-white font-extrabold uppercase tracking-wider hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(22,163,74,0.3)]"
                  >
                    Salvar e Voltar
                  </button>
                </div>
              </div>
            )}

            {/* 2. DOWNSELL (PGC) */}
            {closingState === 'downsell' && (
              <div className="space-y-8 animate-fade-in text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-white mb-4">Ainda não é o momento ideal para o Mapa 360?</h2>
                <p className="text-gray-400 text-lg">
                  Entendemos. Se a estrutura completa ainda não faz sentido agora, nós temos uma solução desenhada para organizar a base comercial da sua empresa.
                </p>
                
                <div className="bg-gradient-to-br from-blue-900/40 to-black/40 border border-blue-500/30 rounded-2xl p-8 my-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Conheça o PGC</h3>
                  <p className="text-blue-300 font-medium">Programa de Gestão Comercial</p>
                </div>

                <div className="flex flex-col gap-4">
                  <a 
                    href="file:///D:/2026/POTENCIA%20EMPRESARIAL/PRODUTOS/PARA%20CLIENTES/PGC%20OFICIAL.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => updateData('salesStatus', 'downsell_pgc')}
                    className="w-full py-4 rounded-xl bg-blue-600 text-white font-extrabold uppercase tracking-wider hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex justify-center items-center gap-2"
                  >
                    Quero saber mais <ArrowRight className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={() => setClosingState('loss_reason')}
                    className="w-full py-3 rounded-xl border border-gray-700 bg-transparent text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wider"
                  >
                    Não é meu momento
                  </button>
                  <button 
                    onClick={() => setClosingState(null)}
                    className="w-full mt-2 py-2 text-[10px] font-bold text-gray-500 hover:text-gray-300 transition-all uppercase tracking-wider"
                  >
                    Voltar para Apresentação
                  </button>
                </div>
              </div>
            )}

            {/* 3. MOTIVO DE PERDA */}
            {closingState === 'loss_reason' && (
              <div className="space-y-6 animate-fade-in max-w-lg mx-auto">
                <h2 className="text-2xl font-heading font-bold text-white mb-2 text-center">Motivo da Perda</h2>
                <p className="text-gray-400 text-sm text-center mb-6">Registre por que o cliente decidiu não avançar neste momento.</p>
                
                <textarea 
                  value={sessionData.lossReason || ''}
                  onChange={(e) => updateData('lossReason', e.target.value)}
                  placeholder="Ex: Achou o investimento alto no momento, prefere esperar virada do semestre..."
                  className="w-full h-40 bg-black/50 border border-gray-700 text-white rounded-xl p-4 focus:border-[#d4af37] outline-none resize-none"
                />

                <div className="flex gap-4">
                  <button 
                    onClick={() => setClosingState('downsell')}
                    className="w-1/3 py-4 rounded-xl border border-gray-700 text-gray-400 font-bold uppercase tracking-wider hover:text-white hover:bg-white/5 transition-all text-xs"
                  >
                    Voltar
                  </button>
                  <button 
                    onClick={() => {
                      updateData('salesStatus', 'perdido');
                      saveDraftToDB({ ...sessionData, salesStatus: 'perdido' });
                      window.location.href = '/admin';
                    }}
                    disabled={!sessionData.lossReason}
                    className="w-2/3 py-4 rounded-xl bg-gray-600 text-white font-extrabold uppercase tracking-wider hover:bg-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    OK (Salvar)
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-4 bg-[#0a1120]/95 backdrop-blur-md border-t border-white/5 pointer-events-none">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between pointer-events-auto">
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${currentSlide === 0 ? 'opacity-0 cursor-default' : 'text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 border border-gray-800'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>
          
          <button 
            onClick={nextSlide}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-heading font-extrabold text-xs rounded-xl uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.25)]"
          >
            {currentSlide === totalSlides - 1 ? 'Finalizar' : 'Avançar'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default ConversationPresentation;
