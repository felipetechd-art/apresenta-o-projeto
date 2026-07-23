import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  Layers,
  ArrowRight,
  Info,
  ChevronDown,
  Sparkles,
  Rocket,
  ShieldCheck,
  Star,
  Settings,
  Clock,
  Heart,
  XCircle,
  HelpCircle,
  MoreHorizontal,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  RefreshCw,
  Power,
  Lock,
  X
} from 'lucide-react';

const ConfiguracoesTab = ({ data, formatValue }) => {
  const { kpis, integracoes } = data;

  const [selectedId, setSelectedId] = useState('whatsapp');
  const [activeTab, setActiveTab] = useState('visao-geral'); // 'visao-geral', 'dados', etc.
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const selectedIntegration = integracoes.find(item => item.id === selectedId);

  // Sparkline chart data for synchronization
  const sparklineOptions = {
    chart: { type: 'line', sparkline: { enabled: true } },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#3b82f6'],
    tooltip: { enabled: false }
  };
  const sparklineSeries = [{ data: [12, 19, 15, 24, 18, 30, 22, 28, 35, 25, 40] }];

  const filteredIntegrations = integracoes.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 relative">
      
      {/* Horizontal Page Tabs */}
      <div className="border-b border-dark-border flex gap-4 text-[10.5px] font-bold uppercase tracking-wider text-gray-400 select-none overflow-x-auto pb-1 mb-2">
        <button className="pb-2 border-b-2 border-[#3b82f6] text-white">
          Visão Geral
        </button>
        <button className="pb-2 border-b-2 border-transparent hover:text-white">
          Todas as Integrações
        </button>
        <button className="pb-2 border-b-2 border-transparent hover:text-white">
          Conectadas
        </button>
        <button className="pb-2 border-b-2 border-transparent hover:text-white">
          Disponíveis
        </button>
        <button className="pb-2 border-b-2 border-transparent hover:text-white">
          Logs de Sincronização
        </button>
        <button className="pb-2 border-b-2 border-transparent hover:text-white">
          Mapeamentos
        </button>
      </div>

      {/* 5 CONFIG TOP LEVEL KPI CARDS */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* KPI 1: Integrações conectadas */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Integrações conectadas</span>
            <Layers className="w-3.5 h-3.5 text-status-green" />
          </div>
          <div className="my-1.5 flex items-baseline gap-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.integracoesConectadas.value}
            </span>
            <span className="text-[9px] text-gray-500 font-mono font-medium">De {kpis.integracoesConectadas.total} disponíveis</span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>{kpis.integracoesConectadas.percentage}%</span>
            <span className="text-gray-500 font-medium normal-case">ativas na plataforma</span>
          </div>
        </div>

        {/* KPI 2: Sincronizações hoje */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Sincronizações hoje</span>
            <RefreshCw className="w-3.5 h-3.5 text-status-blue" />
          </div>
          <div className="my-1 flex items-center justify-between gap-2">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block shrink-0">
              {kpis.sincronizacoesHoje.value}
            </span>
            <div className="w-[50px] h-[20px] overflow-hidden shrink-0">
              <Chart options={sparklineOptions} series={sparklineSeries} type="line" height={20} width={50} />
            </div>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-gray-500 font-bold">
            <span>Última há {kpis.sincronizacoesHoje.lastTime}</span>
          </div>
        </div>

        {/* KPI 3: Dados sincronizados */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Dados sincronizados</span>
            <Activity className="w-3.5 h-3.5 text-status-cyan" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.dadosSincronizados.value}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ +{kpis.dadosSincronizados.change}%</span>
            <span className="text-gray-500 font-medium normal-case">Registros totais</span>
          </div>
        </div>

        {/* KPI 4: Integrações com erro */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Integrações com erro</span>
            <AlertTriangle className="w-3.5 h-3.5 text-status-red" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-status-red font-mono block animate-pulse">
              {kpis.integracoesErro.value}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-red font-bold">
            <span className="normal-case">Requerem atenção imediata</span>
          </div>
        </div>

        {/* KPI 5: Próxima sincronização */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Próxima sincronização</span>
            <Clock className="w-3.5 h-3.5 text-status-cyan" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.proximaSincronizacao.value}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-gray-500 font-bold truncate max-w-[130px]">
            <span className="truncate">{kpis.proximaSincronizacao.targets}</span>
          </div>
        </div>

      </section>

      {/* SEARCH AND GRID BLOCK */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Integrations Grid (Left side, takes 8 columns if selected, 12 if not) */}
        <div className={`flex flex-col gap-4 ${selectedId ? 'xl:col-span-8' : 'xl:col-span-12'}`}>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-dark-border/40 pb-3">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Minhas integrações</h3>
            
            <div className="flex items-center gap-2 text-[9.5px]">
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-black/35 text-white font-bold border border-dark-border/40 py-1.5 px-3 rounded-lg focus:outline-none focus:border-[#3b82f6] cursor-pointer"
              >
                <option value="all">Todas categorias</option>
                <option value="ads">Tráfego Pago</option>
                <option value="crm">Sistemas CRM</option>
                <option value="finance">Financeiro</option>
              </select>

              <div className="relative">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar integração..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/35 text-white placeholder-gray-500 border border-dark-border/40 py-1.5 pl-8 pr-3 rounded-lg focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <button className="bg-brand-gold-start hover:bg-brand-gold-end text-dark-bg font-extrabold py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1 shrink-0">
                <Plus className="w-3.5 h-3.5" />
                Nova integração
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations.map((item) => {
              const isSelected = selectedId === item.id;
              
              let cardBorder = 'border-dark-border/40 bg-black/25';
              let badgeStyle = 'bg-gray-700/10 text-gray-400 border-gray-700/30';
              let syncLabel = 'Última sincronização';
              let syncColor = 'text-gray-400';
              let actionButtonLabel = 'Configurar';
              let actionButtonClass = 'bg-black/35 hover:bg-white/5 text-white border-dark-border/50';

              if (item.warning) {
                badgeStyle = 'bg-status-yellow/10 text-status-yellow border-status-yellow/20';
                actionButtonLabel = 'Reconectar';
                actionButtonClass = 'bg-status-yellow/10 hover:bg-status-yellow/20 text-status-yellow border-status-yellow/30';
              } else if (item.error) {
                badgeStyle = 'bg-status-red/10 text-status-red border-status-red/20';
                syncLabel = 'Falhou';
                syncColor = 'text-status-red font-bold';
                actionButtonLabel = 'Ver erro';
                actionButtonClass = 'bg-status-red/10 hover:bg-status-red/20 text-status-red border-status-red/30';
              } else if (item.available) {
                badgeStyle = 'bg-status-purple/10 text-status-purple border-status-purple/20';
                actionButtonLabel = 'Conectar';
                actionButtonClass = 'bg-status-purple/10 hover:bg-status-purple/20 text-status-purple border-status-purple/30';
              } else if (item.connected) {
                badgeStyle = 'bg-status-green/10 text-status-green border-status-green/20';
              }

              if (isSelected) {
                cardBorder = 'border-status-green ring-1 ring-status-green bg-white/5';
              }

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`border rounded-xl p-3.5 flex flex-col justify-between min-h-[170px] transition-all cursor-pointer ${cardBorder}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      {/* Logo container */}
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-heading font-black text-sm text-white border border-dark-border/40 shrink-0 shadow-inner">
                        {item.name.charAt(0)}
                      </div>
                      <span className={`px-1.5 py-0.5 rounded-[3px] text-[7.5px] font-extrabold uppercase border tracking-wider ${badgeStyle}`}>
                        {item.status}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-xs text-white leading-tight">{item.name}</h4>
                    <p className="text-gray-400 text-[8.5px] leading-relaxed mt-1 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-dark-border/20 flex flex-col gap-2.5 text-[8px] font-medium text-gray-500">
                    {!item.available && (
                      <div className="flex flex-col gap-1 leading-none">
                        <div>
                          <span>{syncLabel}: </span>
                          <span className={`font-mono ${syncColor}`}>{item.lastSync}</span>
                        </div>
                        {item.syncCount > 0 && (
                          <div className="mt-0.5">
                            <span>Dados sincronizados: </span>
                            <span className="font-mono text-white font-bold">{item.syncCount.toLocaleString('pt-BR')}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <button className={`flex-grow py-1 px-3.5 rounded font-bold text-[8.5px] border transition-all ${actionButtonClass}`}>
                        {actionButtonLabel}
                      </button>
                      <button className="w-6.5 h-6 bg-black/35 hover:bg-white/5 border border-dark-border/50 text-gray-400 hover:text-white rounded flex items-center justify-center transition-all">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom request Banner */}
          <div className="glass-card p-4 rounded-xl border-dashed border-dark-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-status-cyan/10 border border-status-cyan/20 flex items-center justify-center text-status-cyan shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="flex flex-col leading-tight">
                <h5 className="text-white font-bold text-[10.5px]">Não encontrou a integração que precisa?</h5>
                <p className="text-gray-500 text-[9px] mt-0.5">Solicite uma nova integração para nossa equipe de engenharia.</p>
              </div>
            </div>
            <button className="bg-black/35 hover:bg-white/5 border border-dark-border/60 text-white font-bold text-[9px] py-1.5 px-4 rounded-lg transition-colors flex items-center gap-1 shrink-0 uppercase tracking-wider">
              Solicitar integração
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Right Details Drawer (takes 4 columns) */}
        {selectedId && selectedIntegration && (
          <div className="xl:col-span-4 glass-card p-4 rounded-xl flex flex-col justify-between min-h-[480px] border border-[#3b82f6]/20 bg-[#070e1b] animate-fade-in relative">
            
            <div>
              {/* Header drawer controls */}
              <div className="flex items-center justify-between pb-3 border-b border-dark-border/30 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center font-heading font-black text-xs text-white border border-dark-border/30">
                    {selectedIntegration.name.charAt(0)}
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-white font-bold text-[11px]">{selectedIntegration.name}</span>
                    <span className="text-[7.5px] text-[#10b981] font-bold mt-[2px]">Conectado</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedId(null)}
                  className="p-1 hover:bg-white/5 hover:text-white text-gray-500 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer tab triggers */}
              <div className="border-b border-dark-border/20 flex gap-3 text-[8.5px] font-bold uppercase tracking-wider text-gray-500 select-none pb-1.5 mb-3.5">
                <button onClick={() => setActiveTab('visao-geral')} className={`pb-1 transition-colors border-b ${activeTab === 'visao-geral' ? 'border-[#3b82f6] text-white' : 'border-transparent hover:text-white'}`}>
                  Visão Geral
                </button>
                <button onClick={() => setActiveTab('dados')} className={`pb-1 transition-colors border-b ${activeTab === 'dados' ? 'border-[#3b82f6] text-white' : 'border-transparent hover:text-white'}`}>
                  Dados
                </button>
                <button onClick={() => setActiveTab('mapeamentos')} className={`pb-1 transition-colors border-b ${activeTab === 'mapeamentos' ? 'border-[#3b82f6] text-white' : 'border-transparent hover:text-white'}`}>
                  Mapeamentos
                </button>
                <button onClick={() => setActiveTab('logs')} className={`pb-1 transition-colors border-b ${activeTab === 'logs' ? 'border-[#3b82f6] text-white' : 'border-transparent hover:text-white'}`}>
                  Logs
                </button>
              </div>

              {/* Visão Geral Content */}
              {activeTab === 'visao-geral' && (
                <div className="flex flex-col gap-3.5 text-[9.5px]">
                  
                  {/* Sobre a integração */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-500 font-bold uppercase tracking-wider text-[8px]">Sobre a integração</span>
                    <p className="text-gray-300 leading-relaxed font-medium">{selectedIntegration.description}.</p>
                    <div className="flex flex-col gap-1.5 mt-1 border-t border-dark-border/10 pt-2 leading-none text-gray-400">
                      <div className="flex justify-between">
                        <span>Fornecedor</span>
                        <span className="text-white font-medium flex items-center gap-0.5">{selectedIntegration.provider} <ExternalLink className="w-2.5 h-2.5 text-gray-500" /></span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Conectado em</span>
                        <span className="text-white font-mono font-medium">{selectedIntegration.connectedAt}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Status</span>
                        <span className="text-white font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-status-green" /> {selectedIntegration.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* O que está sendo sincronizado */}
                  {selectedIntegration.checklist && (
                    <div className="flex flex-col gap-1.5 border-t border-dark-border/30 pt-3">
                      <span className="text-gray-500 font-bold uppercase tracking-wider text-[8px]">O que está sendo sincronizado</span>
                      <div className="grid grid-cols-2 gap-1.5 text-gray-300 font-medium select-none">
                        {selectedIntegration.checklist.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-status-green shrink-0" />
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Frequência de sincronização */}
                  <div className="flex items-center justify-between border-t border-dark-border/30 pt-3">
                    <div className="flex flex-col">
                      <span className="text-gray-500 font-bold uppercase tracking-wider text-[8px]">Frequência de sincronização</span>
                      <span className="text-white font-bold mt-1">Tempo real</span>
                      <span className="text-gray-500 text-[8px] mt-0.5">Novos dados são sincronizados automaticamente.</span>
                    </div>
                    <button className="bg-black/25 hover:bg-white/5 border border-dark-border/60 text-white font-bold text-[8.5px] py-1 px-2.5 rounded flex items-center gap-1 transition-all">
                      <Edit2 className="w-3 h-3 text-gray-500" />
                      Editar
                    </button>
                  </div>

                  {/* Estatísticas */}
                  {selectedIntegration.stats && (
                    <div className="flex flex-col gap-1.5 border-t border-dark-border/30 pt-3">
                      <span className="text-gray-500 font-bold uppercase tracking-wider text-[8px]">Estatísticas</span>
                      <div className="flex flex-col gap-2 font-mono font-medium text-gray-400">
                        <div className="flex justify-between">
                          <span>Mensagens hoje</span>
                          <span className="text-white font-bold">{selectedIntegration.stats.todayMsg.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Atendimentos hoje</span>
                          <span className="text-white font-bold">{selectedIntegration.stats.todayChats.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Contatos sincronizados</span>
                          <span className="text-white font-bold">{selectedIntegration.stats.totalSync.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Erro na última sincronização</span>
                          <span className={`font-bold ${selectedIntegration.stats.lastError === 'Nenhum' ? 'text-status-green' : 'text-status-red'}`}>{selectedIntegration.stats.lastError}</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* PLACEHOLDER FOR OTHER INTEGRATION TABS */}
              {activeTab !== 'visao-geral' && (
                <div className="p-8 text-center text-gray-500 text-[9.5px] italic">
                  Aba de detalhamento {activeTab} em carregamento automático.
                </div>
              )}

            </div>

            {/* Bottom Actions Drawer */}
            <div className="flex items-center gap-2 border-t border-dark-border/30 pt-3 mt-4">
              <button className="flex-grow bg-black/25 hover:bg-white/5 border border-dark-border/50 text-white font-bold text-[9px] py-1.5 rounded transition-all uppercase tracking-wider">
                Testar integração
              </button>
              <button className="bg-status-red/10 hover:bg-status-red/20 border border-status-red/30 text-status-red font-bold text-[9px] py-1.5 px-4 rounded transition-all flex items-center gap-1 uppercase tracking-wider">
                <Power className="w-3.5 h-3.5 shrink-0" />
                Desconectar
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Floating help action button at the bottom right */}
      <button className="fixed bottom-6 right-6 w-11 h-11 bg-status-blue hover:bg-[#1a73e8] text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 border border-[#3b82f6]/40 select-none z-50 animate-bounce">
        <HelpCircle className="w-5 h-5" />
      </button>

    </div>
  );
};

export default ConfiguracoesTab;
