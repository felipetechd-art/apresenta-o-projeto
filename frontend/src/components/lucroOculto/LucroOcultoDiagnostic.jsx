import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Clock, 
  Layers, 
  Cpu, 
  Target, 
  HelpCircle,
  Building,
  Phone,
  Mail,
  Send,
  Sparkles,
  Copy,
  Check,
  MessageCircle
} from 'lucide-react';
import { LucroOcultoEngine } from './lucroOcultoEngine';
import { LucroOcultoRepository } from '../../repositories/LucroOcultoRepository';
import { LucroOcultoReport } from './LucroOcultoReport';
import { LucroOcultoLanding } from './LucroOcultoLanding';
import { NICHOS_LIST, getNichoConfig } from './nichoContext';
import { SearchableSelect } from '../ui/SearchableSelect';

const STORAGE_DRAFT_KEY = 'lucro_oculto_active_draft';

// Hook: retorna config do nicho a partir do formData
function useNichoConfig(formData) {
  const segId = formData.bloco1.segmento || 'outro';
  return getNichoConfig(segId);
}

export function LucroOcultoDiagnostic() {
  const [viewState, setViewState] = useState('landing'); // 'landing' | 'diagnostic' | 'gate' | 'report'
  const [currentBlock, setCurrentBlock] = useState(1);
  const [stepNotification, setStepNotification] = useState('');
  const [generatedReport, setGeneratedReport] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [sessionId] = useState(() => {
    try {
      const saved = localStorage.getItem('lucro_oculto_session_id');
      if (saved) return saved;
      const newId = `diag-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      localStorage.setItem('lucro_oculto_session_id', newId);
      return newId;
    } catch (e) {
      return `diag-${Date.now()}`;
    }
  });

  const [teamResponses, setTeamResponses] = useState([]);
  const [copiedTeamLink, setCopiedTeamLink] = useState(false);

  // Escutar respostas da equipe em tempo real
  useEffect(() => {
    if (!sessionId) return;
    const unsubscribe = LucroOcultoRepository.subscribeTeamResponses(sessionId, (responses) => {
      if (responses) {
        setTeamResponses(responses);
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [sessionId]);

  // Form State Inicial
  const [formData, setFormData] = useState({
    bloco1: {
      segmento: '',
      segmentoOutro: '',
      tempoMercado: '',
      unidades: '1',
      faturamentoMensal: '',
      faturamento12Meses: '',
      funcionariosClt: '',
      prestadoresPj: '',
      custoFolha: '',
      custoPrestadores: '',
      margemLiquida: '',
      produtosServicos: '',
      ticketMedio: '',
      clientesMes: '',
      objetivoFaturamento: '',
      maiorDesafio: ''
    },
    bloco2: {
      departamentos: '',
      atividadesRepetitivas: '',
      planilhasUso: '',
      whatsAppUso: '',
      retrabalhoFrequente: '',
      horasExtras: '',
      sobrecargaEquipe: 'nao',
      contratacoesFuturas: '',
      ondeContrataria: ''
    },
    bloco3: {
      horasSemana: '50',
      horasOperacionalSemana: '25',
      tempoResolvendoProblemas: '10',
      tempoCobrandoPessoas: '5',
      decisoesDependentesDono: 'muitas',
      processosParamSemDono: 'sim',
      reunioesRecorrentesSemana: '5',
      notaDependenciaDono: '40'
    },
    bloco4: {
      temPlanilhasManuais: 'sim',
      digitacaoDuplicada: 'sim',
      temAprovacoesManuais: 'sim',
      processosPadronizados: 'nao',
      possuiAutomacoes: 'nao',
      horasRetrabalhoSemana: '15',
      ondeMaisTrava: ''
    },
    bloco5: {
      principaisSistemas: '',
      custoMensal: '',
      sistemasIntegrados: 'nao',
      softwaresDuplicados: 'nao',
      temCrmIntegrado: 'nao',
      licencasOciosas: '',
      economiaPotencial: ''
    },
    bloco6: {
      investimentoComercial: '',
      sdrs: '0',
      vendedores: '1',
      leadsMes: '',
      reunioesMes: '',
      propostasMes: '',
      vendasMes: '',
      ticketMedioComercial: '',
      horasAdmSemana: '10'
    },
    bloco7: {
      investimentoTotal: '',
      midiaPaga: '',
      agencia: '',
      ferramentas: '',
      retornoPercebido: 'medio',
      despesasSemMensuracao: ''
    },
    bloco8: {
      equipeAtendimento: '1',
      contatosDia: '',
      canais: 'WhatsApp, E-mail',
      perguntasRepetitivas: 'sim',
      atendimentoAutomatizado: 'nao',
      horasRepetitivasSemana: '15'
    },
    bloco9: {
      contasPagarReceberManual: 'sim',
      conciliacaoBancariaManual: 'sim',
      cobrancaManual: 'sim',
      relatoriosEmTempoReal: 'nao',
      horasManuaisSemana: '10'
    },
    bloco10: {
      recrutamentoManual: 'sim',
      onboardingManual: 'sim',
      pontoFeriasManual: 'sim',
      horasAdmSemana: '8'
    },
    bloco11: {
      comprasManuais: 'sim',
      perdasEstoqueMes: '',
      comprasEmergenciais: 'sim'
    },
    bloco12: {
      tarifasBancariasMes: '',
      taxasCartaoMes: '',
      terceirizadosMes: '',
      despesasOtimizaveisMes: ''
    },
    gate: {
      nomeCompleto: '',
      whatsapp: '',
      email: '',
      nomeEmpresa: '',
      telefoneEmpresa: '',
      emailEmpresa: '',
      instagram: '',
      site: '',
      autorizaContato: 'sim'
    }
  });

  // Carregar rascunho se existir
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.formData) {
          setFormData(parsed.formData);
        }
      }
    } catch (e) {}
  }, []);

  // Salvar rascunho a cada mudança
  const updateBlock = (blockName, field, value) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [blockName]: {
          ...prev[blockName],
          [field]: value
        }
      };
      try {
        localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify({ formData: updated, currentBlock }));
      } catch (e) {}
      return updated;
    });
  };

  const nextBlock = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStepNotification('Dados desta etapa registrados. Vamos para a próxima.');
    setTimeout(() => setStepNotification(''), 3000);

    if (currentBlock < 12) {
      setCurrentBlock(prev => prev + 1);
    } else {
      setViewState('gate');
    }
  };

  const prevBlock = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentBlock > 1) {
      setCurrentBlock(prev => prev - 1);
    } else {
      setViewState('landing');
    }
  };

  const handleFinishDiagnostic = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    const config = getNichoConfig(formData.bloco1.segmento || 'outro');
    try {
      const calculated = LucroOcultoEngine.calculate(formData, config);
      const saved = await LucroOcultoRepository.save(calculated);
      setGeneratedReport(saved || calculated);
      // Limpa rascunho
      localStorage.removeItem(STORAGE_DRAFT_KEY);
      setViewState('report');
    } catch (err) {
      console.error('Erro ao finalizar:', err);
      const calculated = LucroOcultoEngine.calculate(formData, config);
      setGeneratedReport(calculated);
      setViewState('report');
    } finally {
      setIsSaving(false);
    }
  };

  // Configuração do nicho selecionado (adapta labels/placeholders de toda a jornada)
  const nichoConfig = useNichoConfig(formData);

  // Se estiver na landing page
  if (viewState === 'landing') {
    return (
      <LucroOcultoLanding 
        onStart={() => setViewState('diagnostic')}
        hasSavedDraft={Boolean(localStorage.getItem(STORAGE_DRAFT_KEY))}
        onResumeSaved={() => setViewState('diagnostic')}
      />
    );
  }

  // Se já tiver relatório final gerado
  if (viewState === 'report' && generatedReport) {
    return (
      <LucroOcultoReport 
        report={generatedReport} 
        onBack={() => setViewState('landing')} 
      />
    );
  }

  // ==========================================
  // GATE FINAL (Seção 27 do Prompt Mestre)
  // ==========================================
  if (viewState === 'gate') {
    return (
      <div className="min-h-screen bg-[#070b12] text-gray-100 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="max-w-xl w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in relative">
          <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 border-b border-neutral-800 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Etapa Concluída
            </div>
            <h2 className="text-2xl font-heading font-black text-white">
              Seu diagnóstico foi concluído.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Já identificamos os principais pontos de eficiência, capacidade e Lucro Oculto da operação. Para identificar seu relatório e liberar o resultado final, preencha seus dados:
            </p>
          </div>

          <form onSubmit={handleFinishDiagnostic} className="space-y-4 text-xs">
            {/* Dados do Empresário */}
            <div className="space-y-3">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                Dados do Empresário
              </span>
              
              <div>
                <label className="text-neutral-400 block mb-1">Nome Completo *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Seu nome"
                  value={formData.gate.nomeCompleto}
                  onChange={e => updateBlock('gate', 'nomeCompleto', e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Telefone / WhatsApp *</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="(00) 00000-0000"
                    value={formData.gate.whatsapp}
                    onChange={e => updateBlock('gate', 'whatsapp', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">E-mail *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="seuemail@empresa.com.br"
                    value={formData.gate.email}
                    onChange={e => updateBlock('gate', 'email', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Dados da Empresa */}
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                Dados da Empresa
              </span>

              <div>
                <label className="text-neutral-400 block mb-1">Nome da Empresa *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nome fantasia ou razão social"
                  value={formData.gate.nomeEmpresa}
                  onChange={e => updateBlock('gate', 'nomeEmpresa', e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Instagram (opcional)</label>
                  <input 
                    type="text" 
                    placeholder="@suaempresa"
                    value={formData.gate.instagram}
                    onChange={e => updateBlock('gate', 'instagram', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Site (opcional)</label>
                  <input 
                    type="text" 
                    placeholder="www.suaempresa.com.br"
                    value={formData.gate.site}
                    onChange={e => updateBlock('gate', 'site', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Autorização de Contato */}
            <div className="pt-3 border-t border-neutral-800 space-y-2">
              <label className="text-neutral-300 block font-medium">
                Você autoriza que nossa equipe entre em contato para conversar sobre os resultados deste diagnóstico?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input 
                    type="radio" 
                    name="autorizaContato" 
                    value="sim" 
                    checked={formData.gate.autorizaContato === 'sim'}
                    onChange={() => updateBlock('gate', 'autorizaContato', 'sim')}
                    className="accent-amber-500"
                  />
                  <span>SIM, autorizo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-neutral-400">
                  <input 
                    type="radio" 
                    name="autorizaContato" 
                    value="nao" 
                    checked={formData.gate.autorizaContato === 'nao'}
                    onChange={() => updateBlock('gate', 'autorizaContato', 'nao')}
                    className="accent-amber-500"
                  />
                  <span>NÃO, apenas ver relatório</span>
                </label>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setViewState('diagnostic')}
                className="py-3 px-5 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white font-bold cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-heading font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Gerando Relatório...' : 'Gerar Meu Relatório Executivo'}
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // FLUXO PRINCIPAL DOS 12 BLOCOS
  // ==========================================
  const progressPercent = Math.round((currentBlock / 12) * 100);

  return (
    <div className="min-h-screen bg-[#070b12] text-gray-100 flex flex-col">
      
      {/* Top Header & Progress */}
      <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={prevBlock}
              className="p-1.5 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Voltar etapa"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="font-heading font-black text-sm text-white uppercase tracking-wider">
                MAPA DO LUCRO <span className="text-amber-400">OCULTO</span>
              </span>
              <span className="block text-[10px] text-neutral-400">
                Bloco {currentBlock} de 12
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-40 sm:w-56">
            <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
              {progressPercent}%
            </span>
          </div>
        </div>
      </header>

      {/* Floating Step Notification */}
      {stepNotification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-full shadow-2xl text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{stepNotification}</span>
        </div>
      )}

      {/* Form Content Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col justify-between">
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* ==================================================
              BLOCO 1 — RAIO-X EMPRESARIAL
              ================================================== */}
          {currentBlock === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1 border-b border-neutral-800 pb-4">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Bloco 1 de 12</span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">Raio-X Empresarial</h3>
                <p className="text-xs text-neutral-400">Dados base da operação. Quanto mais precisos forem os números, mais preciso será o diagnóstico.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="text-neutral-300 block mb-1 font-medium">Qual o segmento da empresa?</label>
                  <SearchableSelect
                    options={NICHOS_LIST.map(n => ({ value: n.id, label: n.label }))}
                    value={formData.bloco1.segmento}
                    onChange={val => updateBlock('bloco1', 'segmento', val)}
                    placeholder="Digite para buscar o segmento (ex: clínica, oficina, SaaS...)"
                    emptyLabel="— Digite ou selecione o seu segmento —"
                  />
                  {formData.bloco1.segmento === 'outro' && (
                    <input
                      type="text"
                      placeholder="Descreva o seu segmento / nicho"
                      value={formData.bloco1.segmentoOutro}
                      onChange={e => updateBlock('bloco1', 'segmentoOutro', e.target.value)}
                      className="mt-2 w-full bg-neutral-800 border border-amber-500/50 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                    />
                  )}
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Há quanto tempo a empresa existe?</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 5 anos"
                    value={formData.bloco1.tempoMercado}
                    onChange={e => updateBlock('bloco1', 'tempoMercado', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Faturamento médio mensal (R$)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 150000"
                    value={formData.bloco1.faturamentoMensal}
                    onChange={e => updateBlock('bloco1', 'faturamentoMensal', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Faturamento aprox. últimos 12 meses (R$)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 1800000"
                    value={formData.bloco1.faturamento12Meses}
                    onChange={e => updateBlock('bloco1', 'faturamento12Meses', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Quantos funcionários CLT possui?</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 8"
                    value={formData.bloco1.funcionariosClt}
                    onChange={e => updateBlock('bloco1', 'funcionariosClt', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Quantos prestadores / PJs regulares?</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 3"
                    value={formData.bloco1.prestadoresPj}
                    onChange={e => updateBlock('bloco1', 'prestadoresPj', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Custo mensal aproximado da folha CLT (R$)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 35000"
                    value={formData.bloco1.custoFolha}
                    onChange={e => updateBlock('bloco1', 'custoFolha', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Custo mensal aproximado com PJs (R$)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 12000"
                    value={formData.bloco1.custoPrestadores}
                    onChange={e => updateBlock('bloco1', 'custoPrestadores', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Margem líquida aproximada atual (%)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 18"
                    value={formData.bloco1.margemLiquida}
                    onChange={e => updateBlock('bloco1', 'margemLiquida', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">{nichoConfig.b1.ticketMedioLabel}</label>
                  <input 
                    type="number" 
                    placeholder={nichoConfig.b1.ticketMedioPlaceholder}
                    value={formData.bloco1.ticketMedio}
                    onChange={e => updateBlock('bloco1', 'ticketMedio', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1 font-medium">Qual é hoje o maior desafio ou gargalo da empresa?</label>
                <textarea 
                  rows={2}
                  placeholder={nichoConfig.b1.maiorDesafioPlaceholder}
                  value={formData.bloco1.maiorDesafio}
                  onChange={e => updateBlock('bloco1', 'maiorDesafio', e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* ==================================================
              BLOCO 2 — ESTRUTURA E EQUIPE
              ================================================== */}
          {currentBlock === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1 border-b border-neutral-800 pb-4">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Bloco 2 de 12</span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">Estrutura e Equipe</h3>
                <p className="text-xs text-neutral-400">Mapeamento de departamentos, capacidade ociosa e demanda futura de contratação.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    Pergunta Crítica de Escala:
                  </span>
                  <label className="text-white block font-medium">
                    “Se sua empresa dobrasse o faturamento nos próximos meses, aproximadamente quantas pessoas você acredita que precisaria contratar?”
                  </label>
                  <input 
                    type="number" 
                    placeholder="Ex: 4"
                    value={formData.bloco2.contratacoesFuturas}
                    onChange={e => updateBlock('bloco2', 'contratacoesFuturas', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Em quais áreas essas contratações aconteceriam?</label>
                  <input 
                    type="text" 
                    placeholder={nichoConfig.b2.ondeContratariaPlaceholder}
                    value={formData.bloco2.ondeContrataria}
                    onChange={e => updateBlock('bloco2', 'ondeContrataria', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Existe sobrecarga ou realização frequente de horas extras na equipe?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-white">
                      <input 
                        type="radio" 
                        name="sobrecarga" 
                        value="sim" 
                        checked={formData.bloco2.sobrecargaEquipe === 'sim'}
                        onChange={() => updateBlock('bloco2', 'sobrecargaEquipe', 'sim')}
                        className="accent-amber-500"
                      />
                      <span>Sim, a equipe vive no limite</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                      <input 
                        type="radio" 
                        name="sobrecarga" 
                        value="nao" 
                        checked={formData.bloco2.sobrecargaEquipe === 'nao'}
                        onChange={() => updateBlock('bloco2', 'sobrecargaEquipe', 'nao')}
                        className="accent-amber-500"
                      />
                      <span>Não, carga controlada</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <label className="text-neutral-300 font-medium">
                      Quais atividades repetitivas consomem mais tempo das pessoas?
                    </label>
                  </div>

                  {/* Card / Link para encaminhar para a equipe */}
                  <div className="bg-gradient-to-r from-amber-500/10 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-xl p-3.5 sm:p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          Encaminhar para o seu time responder:
                        </span>
                        <p className="text-[11px] text-neutral-400 leading-snug">
                          Envie este link para que seus colaboradores coloquem <strong>Nome, Cargo, Setor</strong> e respondam diretamente sobre as rotinas repetitivas que mais consomem tempo.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const link = `${window.location.origin}/equipe-atividades?session=${sessionId}&empresa=${encodeURIComponent(formData.bloco1.segmento || formData.gate.nomeEmpresa || 'sua-empresa')}`;
                            navigator.clipboard.writeText(link);
                            setCopiedTeamLink(true);
                            setTimeout(() => setCopiedTeamLink(false), 2500);
                          }}
                          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                        >
                          {copiedTeamLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedTeamLink ? 'Link Copiado!' : 'Copiar Link para o Time'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const link = `${window.location.origin}/equipe-atividades?session=${sessionId}&empresa=${encodeURIComponent(formData.bloco1.segmento || formData.gate.nomeEmpresa || 'sua-empresa')}`;
                            const text = encodeURIComponent(
                              `Olá equipe! Por favor, preencham este link rápido com seu nome, cargo, setor e as atividades repetitivas que mais consomem tempo no seu dia a dia:\n\n${link}`
                            );
                            window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                          }}
                          className="px-3.5 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                          title="Enviar no WhatsApp da equipe"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>

                    {/* Respostas já enviadas pelo time */}
                    {teamResponses.length > 0 && (
                      <div className="pt-3 border-t border-neutral-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                            {teamResponses.length} resposta(s) da equipe recebida(s) em tempo real:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const aggregated = teamResponses.map(r => `• [${r.setor || 'Geral'} - ${r.cargo || 'Equipe'}: ${r.nome}]: ${r.atividades}`).join('\n\n');
                              const currentVal = formData.bloco2.atividadesRepetitivas;
                              const newVal = currentVal ? `${currentVal}\n\n${aggregated}` : aggregated;
                              updateBlock('bloco2', 'atividadesRepetitivas', newVal);
                            }}
                            className="text-xs text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                          >
                            Inserir respostas no campo abaixo
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto pr-1">
                          {teamResponses.map((resp, idx) => (
                            <div key={idx} className="bg-neutral-800/80 border border-neutral-700/60 rounded-xl p-3 space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-white">{resp.nome}</span>
                                <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-mono">
                                  {resp.setor} • {resp.cargo}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-300 leading-snug">
                                {resp.atividades}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <textarea 
                    rows={3}
                    placeholder="Ex: Copiar dados do WhatsApp para planilha, emitir notas uma a uma, preencher cadastros, cobrar clientes..."
                    value={formData.bloco2.atividadesRepetitivas}
                    onChange={e => updateBlock('bloco2', 'atividadesRepetitivas', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-colors"
                  />
                  <span className="text-[10px] text-neutral-500 block">
                    Você pode digitar diretamente ou usar o link acima para sua equipe responder.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              BLOCO 3 — TEMPO DO DONO E LIDERANÇA
              ================================================== */}
          {currentBlock === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1 border-b border-neutral-800 pb-4">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Bloco 3 de 12</span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">{nichoConfig.b3?.titulo || 'Tempo do Dono e Liderança'}</h3>
                <p className="text-xs text-neutral-400">{nichoConfig.b3?.subtitulo || 'Medição da dependência operacional da liderança e autonomia do time.'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Quantas horas por semana o empresário trabalha no total?</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 50"
                    value={formData.bloco3.horasSemana}
                    onChange={e => updateBlock('bloco3', 'horasSemana', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Quantas dessas horas ficam presas no operacional?</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 25"
                    value={formData.bloco3.horasOperacionalSemana}
                    onChange={e => updateBlock('bloco3', 'horasOperacionalSemana', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Horas por semana resolvendo problemas e 'apagando incêndios'</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 10"
                    value={formData.bloco3.tempoResolvendoProblemas}
                    onChange={e => updateBlock('bloco3', 'tempoResolvendoProblemas', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Processos travam sem a aprovação do dono?</label>
                  <select 
                    value={formData.bloco3.processosParamSemDono}
                    onChange={e => updateBlock('bloco3', 'processosParamSemDono', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  >
                    <option value="sim">Sim, quase tudo precisa passar pelo dono</option>
                    <option value="parcial">Apenas algumas decisões financeiras/comerciais</option>
                    <option value="nao">Não, o time tem total autonomia com alçadas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1 font-medium">
                  Autoavaliação de Dependência do Dono (0 a 100):
                </label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={formData.bloco3.notaDependenciaDono}
                    onChange={e => updateBlock('bloco3', 'notaDependenciaDono', e.target.value)}
                    className="flex-1 accent-amber-500"
                  />
                  <span className="font-mono text-base font-bold text-amber-400 w-12 text-right">
                    {formData.bloco3.notaDependenciaDono}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  0 = Totalmente dependente do dono | 100 = Operação 100% autônoma
                </span>
              </div>
            </div>
          )}

          {/* ==================================================
              BLOCO 4 — PROCESSOS E ROTINAS
              ================================================== */}
          {currentBlock === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1 border-b border-neutral-800 pb-4">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Bloco 4 de 12</span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">Processos e Rotinas</h3>
                <p className="text-xs text-neutral-400">Identificação de digitação duplicada, retrabalho e gargalos operacionais.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-300 block mb-1 font-medium">A mesma informação é digitada mais de uma vez?</label>
                    <select 
                      value={formData.bloco4.digitacaoDuplicada}
                      onChange={e => updateBlock('bloco4', 'digitacaoDuplicada', e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                    >
                      <option value="sim">Sim, passa de WhatsApp para planilha ou sistema</option>
                      <option value="hibrido">Híbrido (alguns sim, outros não)</option>
                      <option value="nao">Não, informação entra uma única vez</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-neutral-300 block mb-1 font-medium">A operação depende intensamente de planilhas manuais?</label>
                    <select 
                      value={formData.bloco4.temPlanilhasManuais}
                      onChange={e => updateBlock('bloco4', 'temPlanilhasManuais', e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                    >
                      <option value="sim">Sim, várias planilhas espalhadas</option>
                      <option value="hibrido">Híbrido (alguns sim, outros não)</option>
                      <option value="nao">Não, processos em sistemas integrados</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-neutral-300 block mb-1 font-medium">Estimativa de horas gastas com retrabalho por semana</label>
                    <input 
                      type="number" 
                      placeholder="Ex: 15"
                      value={formData.bloco4.horasRetrabalhoSemana}
                      onChange={e => updateBlock('bloco4', 'horasRetrabalhoSemana', e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 block mb-1 font-medium">Existem processos padronizados e documentados (SOPs)?</label>
                    <select 
                      value={formData.bloco4.processosPadronizados}
                      onChange={e => updateBlock('bloco4', 'processosPadronizados', e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                    >
                      <option value="nao">Não, as pessoas fazem como acham melhor</option>
                      <option value="parcial">Alguns processos possuem padrão</option>
                      <option value="sim">Sim, processos 100% documentados</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Onde ocorrem os maiores erros ou retrabalhos atualmente?</label>
                  <input 
                    type="text" 
                    placeholder={nichoConfig.b4.ondeMaisTravaPlaceholder}
                    value={formData.bloco4.ondeMaisTrava}
                    onChange={e => updateBlock('bloco4', 'ondeMaisTrava', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              BLOCO 5 — TECNOLOGIA E INTEGRAÇÃO
              ================================================== */}
          {currentBlock === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1 border-b border-neutral-800 pb-4">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Bloco 5 de 12</span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">Tecnologia e Sistemas</h3>
                <p className="text-xs text-neutral-400">Mapeamento de softwares, custos mensais, licenças ociosas e duplicações.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="text-neutral-300 block mb-1 font-medium">Quais são os principais sistemas ou ferramentas utilizados?</label>
                  <input 
                    type="text" 
                    placeholder={nichoConfig.b5.principaisSistemasPlaceholder}
                    value={formData.bloco5.principaisSistemas}
                    onChange={e => updateBlock('bloco5', 'principaisSistemas', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Custo mensal aproximado com softwares e licenças (R$)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 3500"
                    value={formData.bloco5.custoMensal}
                    onChange={e => updateBlock('bloco5', 'custoMensal', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Os sistemas conversam entre si automaticamente (integrados)?</label>
                  <select 
                    value={formData.bloco5.sistemasIntegrados}
                    onChange={e => updateBlock('bloco5', 'sistemasIntegrados', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  >
                    <option value="nao">Não, precisam de intervenção manual</option>
                    <option value="sim">Sim, totalmente integrados via API/Webhooks</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-neutral-300 block mb-1 font-medium">Existem ferramentas com funções duplicadas ou pouco utilizadas?</label>
                  <select 
                    value={formData.bloco5.softwaresDuplicados}
                    onChange={e => updateBlock('bloco5', 'softwaresDuplicados', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  >
                    <option value="sim">Sim, pagamos por ferramentas subutilizadas</option>
                    <option value="nao">Não, usamos tudo o que contratamos</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              BLOCO 6 — GESTÃO COMERCIAL
              ================================================== */}
          {currentBlock === 6 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1 border-b border-neutral-800 pb-4">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Bloco 6 de 12</span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">{nichoConfig.b6.titulo}</h3>
                <p className="text-xs text-neutral-400">{nichoConfig.b6.subtitulo}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">{nichoConfig.b6.vendedoresLabel}</label>
                  <input 
                    type="number" 
                    placeholder={nichoConfig.b6.vendedoresPlaceholder}
                    value={formData.bloco6.vendedores}
                    onChange={e => updateBlock('bloco6', 'vendedores', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">{nichoConfig.b6.sdrsLabel}</label>
                  <input 
                    type="number" 
                    placeholder={nichoConfig.b6.sdrsPlaceholder}
                    value={formData.bloco6.sdrs}
                    onChange={e => updateBlock('bloco6', 'sdrs', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">{nichoConfig.b6.leadsLabel}</label>
                  <input 
                    type="number" 
                    placeholder={nichoConfig.b6.leadsPlaceholder}
                    value={formData.bloco6.leadsMes}
                    onChange={e => updateBlock('bloco6', 'leadsMes', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">{nichoConfig.b6.vendasLabel}</label>
                  <input 
                    type="number" 
                    placeholder={nichoConfig.b6.vendasPlaceholder}
                    value={formData.bloco6.vendasMes}
                    onChange={e => updateBlock('bloco6', 'vendasMes', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-neutral-300 block mb-1 font-medium">
                    {nichoConfig.b6.horasAdmLabel}
                  </label>
                  <input 
                    type="number" 
                    placeholder="Ex: 12"
                    value={formData.bloco6.horasAdmSemana}
                    onChange={e => updateBlock('bloco6', 'horasAdmSemana', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              BLOCO 7 — MARKETING
              ================================================== */}
          {currentBlock === 7 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1 border-b border-neutral-800 pb-4">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Bloco 7 de 12</span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">{nichoConfig.b7.titulo}</h3>
                <p className="text-xs text-neutral-400">{nichoConfig.b7.subtitulo}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Investimento total em marketing mensal (R$)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 8000"
                    value={formData.bloco7.investimentoTotal}
                    onChange={e => updateBlock('bloco7', 'investimentoTotal', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Quanto disso vai direto para tráfego/mídia paga? (R$)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 5000"
                    value={formData.bloco7.midiaPaga}
                    onChange={e => updateBlock('bloco7', 'midiaPaga', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Como você avalia o retorno do marketing atual?</label>
                  <select 
                    value={formData.bloco7.retornoPercebido}
                    onChange={e => updateBlock('bloco7', 'retornoPercebido', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  >
                    <option value="baixo">Baixo retorno ou difícil mensuração</option>
                    <option value="medio">Retorno razoável, mas poderia ser melhor</option>
                    <option value="alto">Alto retorno, métricas previsíveis</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Despesas em marketing sem mensuração clara (R$/mês)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 1200"
                    value={formData.bloco7.despesasSemMensuracao}
                    onChange={e => updateBlock('bloco7', 'despesasSemMensuracao', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              BLOCO 8 — ATENDIMENTO E SUPORTE
              ================================================== */}
          {currentBlock === 8 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1 border-b border-neutral-800 pb-4">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Bloco 8 de 12</span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">{nichoConfig.b8.titulo}</h3>
                <p className="text-xs text-neutral-400">{nichoConfig.b8.subtitulo}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Pessoas no atendimento / suporte</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 2"
                    value={formData.bloco8.equipeAtendimento}
                    onChange={e => updateBlock('bloco8', 'equipeAtendimento', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Média de atendimentos/mensagens por dia</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 80"
                    value={formData.bloco8.contatosDia}
                    onChange={e => updateBlock('bloco8', 'contatosDia', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Existem perguntas frequentes e repetitivas?</label>
                  <select 
                    value={formData.bloco8.perguntasRepetitivas}
                    onChange={e => updateBlock('bloco8', 'perguntasRepetitivas', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  >
                    <option value="sim">Sim, mais de 50% das dúvidas são iguais</option>
                    <option value="nao">Não, cada atendimento é muito específico</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Horas da equipe em tarefas repetitivas por semana</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 15"
                    value={formData.bloco8.horasRepetitivasSemana}
                    onChange={e => updateBlock('bloco8', 'horasRepetitivasSemana', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              BLOCO 9 — FINANCEIRO E CONTROLADORIA
              ================================================== */}
          {currentBlock === 9 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1 border-b border-neutral-800 pb-4">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Bloco 9 de 12</span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">{nichoConfig.b9?.titulo || 'Financeiro e Controladoria'}</h3>
                <p className="text-xs text-neutral-400">{nichoConfig.b9?.subtitulo || 'Conciliação bancária, cobrança de inadimplência e emissão de notas/boletos.'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">A conciliação bancária é feita manualmente?</label>
                  <select 
                    value={formData.bloco9.conciliacaoBancariaManual}
                    onChange={e => updateBlock('bloco9', 'conciliacaoBancariaManual', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  >
                    <option value="sim">Sim, conferindo extrato manualmente</option>
                    <option value="nao">Não, integração automática via Open Finance / OFX</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">A cobrança de inadimplentes é automatizada?</label>
                  <select 
                    value={formData.bloco9.cobrancaManual}
                    onChange={e => updateBlock('bloco9', 'cobrancaManual', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  >
                    <option value="sim">Não, alguém cobra manualmente pelo WhatsApp/telefone</option>
                    <option value="nao">Sim, régua de cobrança automática por e-mail/WhatsApp</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Os relatórios de DRE e fluxo de caixa são em tempo real?</label>
                  <select 
                    value={formData.bloco9.relatoriosEmTempoReal}
                    onChange={e => updateBlock('bloco9', 'relatoriosEmTempoReal', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  >
                    <option value="nao">Não, dependem de fechamento manual demorado</option>
                    <option value="sim">Sim, acompanhamento atualizado diariamente</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Horas manuais semanais do financeiro em digitação</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 10"
                    value={formData.bloco9.horasManuaisSemana}
                    onChange={e => updateBlock('bloco9', 'horasManuaisSemana', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              BLOCO 10 — RH E DEPARTAMENTO PESSOAL
              ================================================== */}
          {currentBlock === 10 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1 border-b border-neutral-800 pb-4">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Bloco 10 de 12</span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">{nichoConfig.b10?.titulo || 'RH e Departamento Pessoal'}</h3>
                <p className="text-xs text-neutral-400">{nichoConfig.b10?.subtitulo || 'Rotinas de recrutamento, triagem de currículos, onboarding e controle de férias.'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">O recrutamento e triagem de candidatos é manual?</label>
                  <select 
                    value={formData.bloco10.recrutamentoManual}
                    onChange={e => updateBlock('bloco10', 'recrutamentoManual', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  >
                    <option value="sim">Sim, lemos currículos um a um</option>
                    <option value="nao">Não, temos plataforma com triagem/testes</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">O treinamento inicial (onboarding) é padronizado?</label>
                  <select 
                    value={formData.bloco10.onboardingManual}
                    onChange={e => updateBlock('bloco10', 'onboardingManual', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  >
                    <option value="sim">Não, alguém para o trabalho para ensinar tudo do zero</option>
                    <option value="nao">Sim, plataforma com trilha gravada e checklist</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-neutral-300 block mb-1 font-medium">Horas administrativas semanais gastas com rotinas de DP/RH</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 8"
                    value={formData.bloco10.horasAdmSemana}
                    onChange={e => updateBlock('bloco10', 'horasAdmSemana', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              BLOCO 11 — COMPRAS / ESTOQUE / FORNECEDORES
              ================================================== */}
          {currentBlock === 11 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1 border-b border-neutral-800 pb-4">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Bloco 11 de 12</span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">{nichoConfig.b11?.titulo || 'Compras, Estoque e Fornecedores'}</h3>
                <p className="text-xs text-neutral-400">{nichoConfig.b11?.subtitulo || 'Previsibilidade de compras, cotações, perdas de estoque e compras emergenciais.'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">O processo de cotação e compras é manual?</label>
                  <select 
                    value={formData.bloco11.comprasManuais}
                    onChange={e => updateBlock('bloco11', 'comprasManuais', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  >
                    <option value="sim">Sim, orçamos por e-mail/WhatsApp sem histórico</option>
                    <option value="nao">Não, compras programadas e tabelas negociadas</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Acontecem compras emergenciais frequentes com preço mais alto?</label>
                  <select 
                    value={formData.bloco11.comprasEmergenciais}
                    onChange={e => updateBlock('bloco11', 'comprasEmergenciais', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  >
                    <option value="sim">Sim, frequentemente compramos na correria</option>
                    <option value="nao">Raramente ou nunca</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-neutral-300 block mb-1 font-medium">{nichoConfig.b11?.perdasLabel || 'Estimativa mensal de perdas por estoque parado, compras erradas ou avarias (R$)'}</label>
                  <input 
                    type="number" 
                    placeholder={nichoConfig.b11?.perdasPlaceholder || 'Ex: 1500 (ou 0 se não se aplicar)'}
                    value={formData.bloco11.perdasEstoqueMes}
                    onChange={e => updateBlock('bloco11', 'perdasEstoqueMes', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              BLOCO 12 — DESPESAS GERAIS E OPERACIONAIS
              ================================================== */}
          {currentBlock === 12 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1 border-b border-neutral-800 pb-4">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Bloco 12 de 12 • Último Bloco</span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">{nichoConfig.b12?.titulo || 'Despesas Gerais e Contratos'}</h3>
                <p className="text-xs text-neutral-400">{nichoConfig.b12?.subtitulo || 'Identificação de contratos antigos, taxas bancárias e serviços pouco utilizados.'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Tarifas bancárias e taxas de cartão mensais aproximadas (R$)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 2500"
                    value={formData.bloco12.taxasCartaoMes}
                    onChange={e => updateBlock('bloco12', 'taxasCartaoMes', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Gastos mensais com consultorias/terceirizados (R$)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 4000"
                    value={formData.bloco12.terceirizadosMes}
                    onChange={e => updateBlock('bloco12', 'terceirizadosMes', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-neutral-300 block mb-1 font-medium">Estimativa de custos gerais renegociáveis ou otimizáveis por mês (R$)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 1800"
                    value={formData.bloco12.despesasOtimizaveisMes}
                    onChange={e => updateBlock('bloco12', 'despesasOtimizaveisMes', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-neutral-800 flex items-center justify-between gap-4">
            <button
              onClick={prevBlock}
              className="py-3 px-5 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{currentBlock === 1 ? 'Voltar' : 'Bloco Anterior'}</span>
            </button>

            <button
              onClick={nextBlock}
              className="py-3 px-7 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-heading font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer transition-all transform hover:-translate-y-0.5"
            >
              <span>{currentBlock === 12 ? 'Concluir Diagnóstico' : 'Próxima Etapa'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
