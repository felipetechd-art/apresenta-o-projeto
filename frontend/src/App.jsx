import React, { useState, useEffect, useCallback } from 'react';
import Chart from 'react-apexcharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Users,
  Percent,
  Activity,
  Calendar,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Phone,
  FileText,
  Layers,
  Menu,
  X,
  Crown,
  Award,
  Info,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Bell,
  ShieldCheck,
  Search,
  ArrowRight,
  UserPlus,
  CalendarPlus,
  FilePlus,
  FileSpreadsheet,
  PlusCircle,
  HelpCircle,
  Sparkles,
  Headphones,
  PlayCircle,
  Clock
} from 'lucide-react';
import FunnelChart from './components/FunnelChart';
import CommercialTab from './components/CommercialTab';
import MarketingTab from './components/MarketingTab';
import PreVendasTab from './components/PreVendasTab';
import CloserTab from './components/CloserTab';
import FinanceiroTab from './components/FinanceiroTab';
import OperacaoTab from './components/OperacaoTab';
import ClientesTab from './components/ClientesTab';
import ConfiguracoesTab from './components/ConfiguracoesTab';
import ApresentacoesTab from './components/ApresentacoesTab';
import {
  ArrowUpRight,
  ArrowDownRight,
  LineChart,
  Briefcase,
  Wallet
} from 'lucide-react';

function App() {
  // Navigation States
  const [activeMenu, setActiveMenu] = useState('clientes'); // 'dashboard-ceo', 'comercial', 'marketing', 'pre-vendas', 'closer', 'financeiro', 'operacao', 'clientes' or 'configuracoes'
  
  // Data States
  const [ceoData, setCeoData] = useState(null);
  const [commercialData, setCommercialData] = useState(null);
  const [marketingData, setMarketingData] = useState(null);
  const [preVendasData, setPreVendasData] = useState(null);
  const [closerData, setCloserData] = useState(null);
  const [financeiroData, setFinanceiroData] = useState(null);
  const [operacaoData, setOperacaoData] = useState(null);
  const [clientesData, setClientesData] = useState(null);
  const [configuracoesData, setConfiguracoesData] = useState(null);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI Interaction States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Filter States
  const [selectedPeriod, setSelectedPeriod] = useState("01/05/2025 - 16/05/2025");
  const [selectedComparison, setSelectedComparison] = useState("01/04/2025 - 16/04/2025");

  // Predefined periods (with 16/05/2025 single-date added)
  const periods = [
    { label: "16/05/2025", compare: "15/05/2025" },
    { label: "01/05/2025 - 16/05/2025", compare: "01/04/2025 - 16/04/2025" },
    { label: "17/05/2025 - 31/05/2025", compare: "17/04/2025 - 30/04/2025" },
    { label: "01/06/2025 - 15/06/2025", compare: "01/05/2025 - 15/05/2025" }
  ];

  // Menu items (as per user request: "Visão Geral" removed)
  const menuItems = [
    { id: 'dashboard-ceo', label: 'Dashboard CEO', icon: Crown },
    { id: 'apresentacoes', label: 'Apresentações', icon: PlayCircle },
    { id: 'comercial', label: 'Comercial', icon: Award },
    { id: 'marketing', label: 'Marketing', icon: Target },
    { id: 'pre-vendas', label: 'Pré-vendas (SDR)', icon: Headphones },
    { id: 'closer', label: 'Closer', icon: Users },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'operacao', label: 'Operação', icon: Layers },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  // Dynamic Sidebar Shortcuts (ATALHOS)
  const getShortcuts = () => {
    if (activeMenu === 'marketing') {
      return [
        { label: 'Nova Campanha', icon: PlusCircle },
        { label: 'Criar Landing Page', icon: Layers },
        { label: 'Agenda de Conteúdo', icon: CalendarPlus },
        { label: 'Relatório de ROI', icon: FileText },
      ];
    }
    if (activeMenu === 'pre-vendas') {
      return [
        { label: 'Novo Lead', icon: UserPlus },
        { label: 'Leads Sem Contato', icon: Users },
        { label: 'Agenda de Reuniões', icon: Calendar },
        { label: 'Cadências', icon: Activity },
        { label: 'Relatório SDR', icon: FileText },
      ];
    }
    if (activeMenu === 'closer') {
      return [
        { label: 'Nova Proposta', icon: FilePlus },
        { label: 'Minhas Reuniões', icon: Calendar },
        { label: 'Playbooks', icon: FileText },
        { label: 'Calculadora ROI', icon: DollarSign },
        { label: 'Central de Materiais', icon: Layers }
      ];
    }
    if (activeMenu === 'financeiro') {
      return [
        { label: 'Contas a Receber', icon: ArrowUpRight },
        { label: 'Contas a Pagar', icon: ArrowDownRight },
        { label: 'Fluxo de Caixa', icon: LineChart },
        { label: 'DRE Gerencial', icon: FileText },
        { label: 'Inadimplência', icon: AlertTriangle },
        { label: 'Centro de Custos', icon: Briefcase }
      ];
    }
    if (activeMenu === 'operacao') {
      return [
        { label: 'Mapa de Produção', icon: Layers },
        { label: 'Agenda de Entregas', icon: Calendar },
        { label: 'Meus Clientes', icon: Users },
        { label: 'Central de Tarefas', icon: CheckCircle2 },
        { label: 'Base de Conhecimento', icon: FileText }
      ];
    }
    if (activeMenu === 'clientes') {
      return [
        { label: 'Novo Cliente', icon: PlusCircle },
        { label: 'Clientes em Risco', icon: AlertTriangle },
        { label: 'Renovações', icon: Calendar },
        { label: 'Importar Clientes', icon: FileText },
        { label: 'Mapa da Carteira', icon: Layers }
      ];
    }
    if (activeMenu === 'configuracoes') {
      return [];
    }
    // Default/Comercial/CEO
    return [
      { label: 'Novo Lead', icon: UserPlus },
      { label: 'Agendar Reunião', icon: CalendarPlus },
      { label: 'Nova Proposta', icon: FilePlus },
      { label: 'Relatório de Vendas', icon: FileSpreadsheet },
    ];
  };

  const shortcuts = getShortcuts();

  // API Fetch Function
  const fetchData = useCallback(async (tab, period, compare) => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = tab === 'dashboard-ceo' ? '/api/dashboard' 
                     : tab === 'comercial' ? '/api/comercial' 
                     : tab === 'marketing' ? '/api/marketing' 
                     : tab === 'pre-vendas' ? '/api/prevendas'
                     : tab === 'closer' ? '/api/closer'
                     : tab === 'financeiro' ? '/api/financeiro'
                     : tab === 'operacao' ? '/api/operacao'
                     : tab === 'clientes' ? '/api/clientes'
                     : '/api/configuracoes';
      
      const url = `${endpoint}?period=${encodeURIComponent(period)}&compareWith=${encodeURIComponent(compare)}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do servidor backend.');
      }
      
      const json = await response.json();
      
      if (tab === 'dashboard-ceo') {
        setCeoData(json);
      } else if (tab === 'comercial') {
        setCommercialData(json);
      } else if (tab === 'marketing') {
        setMarketingData(json);
      } else if (tab === 'pre-vendas') {
        setPreVendasData(json);
      } else if (tab === 'closer') {
        setCloserData(json);
      } else if (tab === 'financeiro') {
        setFinanceiroData(json);
      } else if (tab === 'operacao') {
        setOperacaoData(json);
      } else if (tab === 'clientes') {
        setClientesData(json);
      } else if (tab === 'configuracoes') {
        setConfiguracoesData(json);
      }
    } catch (err) {
      console.error(err);
      setError('Não foi possível conectar com o backend. Certifique-se de que o servidor Node.js está rodando na porta 5000.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data when active menu, period, or comparison changes
  useEffect(() => {
    if (activeMenu === 'dashboard-ceo') {
      fetchData('dashboard-ceo', selectedPeriod, selectedComparison);
    } else if (activeMenu === 'comercial') {
      fetchData('comercial', selectedPeriod, selectedComparison);
    } else if (activeMenu === 'marketing') {
      fetchData('marketing', selectedPeriod, selectedComparison);
    } else if (activeMenu === 'pre-vendas') {
      fetchData('pre-vendas', selectedPeriod, selectedComparison);
    } else if (activeMenu === 'closer') {
      fetchData('closer', selectedPeriod, selectedComparison);
    } else if (activeMenu === 'financeiro') {
      fetchData('financeiro', selectedPeriod, selectedComparison);
    } else if (activeMenu === 'operacao') {
      fetchData('operacao', selectedPeriod, selectedComparison);
    } else if (activeMenu === 'clientes') {
      fetchData('clientes', selectedPeriod, selectedComparison);
    } else if (activeMenu === 'configuracoes') {
      fetchData('configuracoes', selectedPeriod, selectedComparison);
    } else {
      setLoading(false);
    }
  }, [activeMenu, selectedPeriod, selectedComparison, fetchData]);

  // Handle period change
  const handlePeriodChange = (e) => {
    const val = e.target.value;
    setSelectedPeriod(val);
    const matched = periods.find(p => p.label === val);
    if (matched) {
      setSelectedComparison(matched.compare);
    }
  };

  // Manual refresh trigger
  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (activeMenu === 'dashboard-ceo' || activeMenu === 'comercial' || activeMenu === 'marketing' || activeMenu === 'pre-vendas' || activeMenu === 'closer' || activeMenu === 'financeiro' || activeMenu === 'operacao' || activeMenu === 'clientes' || activeMenu === 'configuracoes') {
      await fetchData(activeMenu, selectedPeriod, selectedComparison);
    } else {
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Formatting helpers
  const formatValue = (val, type) => {
    if (val === undefined || val === null) return '';
    if (type === 'currency') {
      if (val >= 1000000) {
        return `R$ ${(val / 1000000).toFixed(3).replace('.', ',')}M`;
      }
      if (val >= 1000) {
        const kVal = val / 1000;
        const decimals = kVal % 1 === 0 ? 0 : 1;
        return `R$ ${kVal.toFixed(decimals).replace('.', ',')}K`;
      }
      return `R$ ${val.toLocaleString('pt-BR')}`;
    }
    if (type === 'currency-full') {
      return `R$ ${val.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;
    }
    if (type === 'percent') {
      return `${val.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
    }
    return val.toLocaleString('pt-BR');
  };

  // ApexCharts Configs for CEO Dashboard (Baseline)
  const getCeoChartConfigs = () => {
    if (!ceoData) return null;
    const { revenueEvolution, commercialHealth, leadSources, followUps } = ceoData;

    const revenueChartOptions = {
      chart: {
        type: 'line',
        background: 'transparent',
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      colors: ['#3b82f6', '#475569'],
      stroke: { width: [4, 2], dashArray: [0, 5], curve: 'smooth' },
      markers: {
        size: [5, 0],
        colors: ['#3b82f6'],
        strokeWidth: 2,
        strokeColors: '#060b13',
        hover: { size: 7 }
      },
      grid: {
        borderColor: 'rgba(27, 42, 63, 0.3)',
        strokeDashArray: 2,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } }
      },
      xaxis: {
        categories: revenueEvolution.dates,
        labels: { style: { colors: '#94a3b8', fontSize: '9px', fontFamily: 'Inter' } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: '#94a3b8', fontSize: '9px', fontFamily: 'Inter' },
          formatter: (val) => {
            if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
            if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
            return val;
          }
        }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        offsetY: -5,
        labels: { colors: '#f3f4f6', fontFamily: 'Inter' }
      },
      tooltip: {
        theme: 'dark',
        x: { show: true },
        y: { formatter: (val) => val ? `R$ ${val.toLocaleString('pt-BR')}` : 'N/A' }
      },
      annotations: {
        points: [
          {
            x: '16/05',
            y: 1280000,
            marker: { size: 6, fillColor: '#3b82f6', strokeColor: '#fff' },
            label: {
              borderColor: '#3b82f6',
              borderWidth: 1,
              style: { color: '#fff', background: '#3b82f6', fontSize: '9px', fontWeight: 'bold' },
              text: 'R$ 1,280M'
            }
          },
          {
            x: '31/05',
            y: 2000000,
            marker: { size: 0 },
            label: {
              borderColor: '#475569',
              borderWidth: 1,
              style: { color: '#fff', background: '#475569', fontSize: '9px', fontWeight: 'bold' },
              text: 'R$ 2,000M'
            }
          }
        ]
      }
    };

    const healthChartOptions = {
      chart: { type: 'radialBar', offsetY: -10, sparkline: { enabled: true } },
      plotOptions: {
        radialBar: {
          startAngle: -95,
          endAngle: 95,
          track: { background: 'rgba(27, 42, 63, 0.4)', strokeWidth: '97%', margin: 5 },
          hollow: { size: '62%' },
          dataLabels: {
            name: { show: false },
            value: { offsetY: -6, fontSize: '32px', color: '#fff', fontWeight: '800', fontFamily: 'Outfit', formatter: (val) => `${val}` }
          }
        }
      },
      grid: { padding: { top: -10, bottom: -10 } },
      fill: {
        type: 'gradient',
        gradient: { shade: 'dark', type: 'horizontal', shadeIntensity: 0.5, gradientToColors: ['#10b981'], inverseColors: true, opacityFrom: 1, opacityTo: 1, stops: [0, 100] }
      },
      colors: ['#f59e0b'],
      stroke: { dashArray: 3 }
    };

    const donutChartOptions = {
      chart: { type: 'donut' },
      labels: leadSources.map(item => item.source),
      colors: leadSources.map(item => item.color),
      stroke: { colors: ['#0f172a'], width: 2 },
      legend: { show: false },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: '72%',
            labels: {
              show: true,
              name: { show: true, fontSize: '11px', color: '#94a3b8', offsetY: -6, fontFamily: 'Inter' },
              value: { show: true, fontSize: '18px', fontWeight: 'bold', color: '#fff', offsetY: 6, fontFamily: 'Outfit', formatter: (val) => `${val}%` },
              total: { show: true, label: 'Leads', color: '#94a3b8', fontSize: '11px', formatter: () => '1.250' }
            }
          }
        }
      },
      tooltip: { theme: 'dark', y: { formatter: (val) => `${val}%` } }
    };

    const followUpChartOptions = {
      chart: { type: 'bar', toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 4, horizontal: true, barHeight: '52%', distributed: true } },
      colors: followUps.stages.map(item => item.color),
      dataLabels: { enabled: true, textAnchor: 'end', style: { colors: ['#fff'], fontSize: '10px', fontWeight: 'bold', fontFamily: 'Inter' }, formatter: (val) => val },
      xaxis: {
        categories: followUps.stages.map(item => item.stage.replace('Follow-up ', 'F-up ')),
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px', fontWeight: 500, fontFamily: 'Inter' } } },
      grid: { show: false },
      legend: { show: false },
      tooltip: { theme: 'dark', y: { formatter: (val) => `${val} leads` } }
    };

    return {
      revenueChartOptions,
      revenueChartSeries: [{ name: 'Receita (R$)', data: revenueEvolution.receita }, { name: 'Meta (R$)', data: revenueEvolution.meta }],
      healthChartOptions,
      healthChartSeries: [commercialHealth.score],
      donutChartOptions,
      donutChartSeries: leadSources.map(item => item.percentage),
      followUpChartOptions,
      followUpChartSeries: [{ data: followUps.stages.map(item => item.count) }]
    };
  };

  const sparklineConfig = (color) => ({
    chart: { type: 'line', sparkline: { enabled: true }, animations: { enabled: false } },
    stroke: { curve: 'smooth', width: 2 },
    colors: [color],
    tooltip: { enabled: false }
  });

  const ceoConfigs = getCeoChartConfigs();

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col md:flex-row relative">
      
      {/* Sidebar Mobile Toggle Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 glass-card shrink-0 flex flex-col justify-between p-5 border-r border-dark-border z-50 transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between border-b border-dark-border pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-gold-start to-brand-gold-end flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.4)]">
                <Crown className="w-5 h-5 text-dark-bg stroke-[2]" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-lg text-gold-gradient tracking-wide uppercase">AXION</span>
                <span className="block text-[8px] text-gray-500 uppercase tracking-widest font-semibold">Business Intelligence</span>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg bg-white/5 border border-dark-border text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 overflow-y-auto max-h-[42vh] pr-1">
            {/* Menus */}
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm text-left transition-all duration-200 group ${
                    activeMenu === item.id
                      ? 'bg-gradient-to-r from-brand-gold-start/15 to-transparent text-brand-gold-end border-l-2 border-brand-gold-start font-semibold'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    activeMenu === item.id ? 'text-brand-gold-start' : 'text-gray-400 group-hover:text-gray-300'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Shortcuts & Filters & Training */}
        {activeMenu === 'configuracoes' ? (
          <div className="flex flex-col gap-3.5 border-t border-dark-border pt-3.5 mt-3 select-none flex-grow justify-between">
            {/* CONFIGURAÇÕES Vertical Menu */}
            <div className="flex flex-col gap-1 pr-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-2 block">Configurações</span>
              {[
                { label: 'Empresa', icon: Briefcase },
                { label: 'Usuários', icon: Users },
                { label: 'Equipes', icon: Users },
                { label: 'Permissões', icon: ShieldCheck },
                { label: 'Produtos e Serviços', icon: Briefcase },
                { label: 'Funis', icon: Layers },
                { label: 'Automações', icon: Settings },
                { label: 'IA & Prompts', icon: Sparkles },
                { label: 'Notificações', icon: AlertTriangle },
                { label: 'Integrações', icon: Layers, active: true },
                { label: 'API & Webhooks', icon: FileText },
                { label: 'Segurança', icon: Briefcase },
                { label: 'Logs de Atividades', icon: Clock },
                { label: 'Planos e Assinaturas', icon: Wallet }
              ].map((cfg, idx) => {
                const CfgIcon = cfg.icon;
                const isActive = cfg.active;
                return (
                  <button
                    key={idx}
                    className={`flex items-center justify-between py-1.5 px-3 rounded-lg text-[10.5px] font-medium text-left transition-colors truncate ${
                      isActive
                        ? 'bg-[#1062e6]/15 text-white font-bold border-l-2 border-[#1062e6]'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <CfgIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#1062e6]' : 'text-gray-400'}`} />
                      <span className="truncate">{cfg.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Help Assistente Card */}
            <div className="glass-card p-3.5 rounded-xl border border-[#3b82f6]/20 bg-[#0c182b] text-[10.5px] flex flex-col gap-2 relative overflow-hidden mt-auto -mb-1">
              <div className="absolute inset-0 bg-radial-at-t from-[#3b82f6]/10 via-transparent to-transparent pointer-events-none" />
              <h4 className="font-heading font-black text-xs text-white flex items-center gap-1.5 z-10">
                <Sparkles className="w-3.5 h-3.5 text-status-cyan" />
                Precisa de ajuda?
              </h4>
              <p className="text-gray-400 font-medium leading-relaxed z-10">Nossa IA pode te ajudar a configurar integrações.</p>
              <button className="w-full bg-[#1062e6] hover:bg-[#1a73e8] text-white font-extrabold text-[9px] py-1.5 rounded transition-all flex items-center justify-center gap-1 z-10 shadow">
                Abrir assistente IA
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5 border-t border-dark-border pt-3.5 mt-3">
            
            {/* Shortcuts (ATALHOS) Section */}
            {shortcuts.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Atalhos</span>
                <div className="grid grid-cols-2 gap-1.5 text-[9px] font-medium text-gray-300">
                  {shortcuts.map((sc, idx) => {
                    const Icon = sc.icon;
                    return (
                      <button
                        key={idx}
                        className="flex items-center gap-1.5 bg-black/20 hover:bg-white/5 border border-dark-border/40 py-1.5 px-2 rounded-lg text-left transition-colors truncate"
                      >
                        <Icon className="w-3.5 h-3.5 text-brand-gold-start shrink-0" />
                        <span className="truncate">{sc.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dynamic Sidebar Training Card */}
            {activeMenu === 'closer' && (
              <div className="bg-[#0b1329]/65 border border-dark-border/50 rounded-xl p-3 select-none flex flex-col justify-between min-h-[95px] -mb-1 shadow-inner">
                <span className="text-[8px] text-brand-gold-start font-extrabold uppercase tracking-wider block">Treinamento</span>
                <span className="text-[10px] text-white font-bold leading-snug mt-1 block">Assista agora ao treinamento de objeções</span>
                <div className="flex items-center justify-between mt-2.5 gap-2">
                  <button className="bg-brand-gold-start hover:bg-brand-gold-end text-dark-bg text-[9px] font-extrabold py-1 px-3.5 rounded-md transition-colors shadow">
                    Assistir
                  </button>
                  <div className="w-8 h-6.5 rounded bg-white/5 border border-dark-border flex items-center justify-center shrink-0">
                    <PlayCircle className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Sidebar IA Financeira Card */}
            {activeMenu === 'financeiro' && (
              <div className="bg-[#0c182b] border border-[#3b82f6]/20 rounded-xl p-3 select-none flex flex-col justify-between min-h-[105px] -mb-1 shadow-inner relative overflow-hidden animate-fade-in">
                <div className="absolute inset-0 bg-radial-at-t from-[#3b82f6]/10 via-transparent to-transparent pointer-events-none" />
                <span className="text-[8px] text-[#3b82f6] font-extrabold uppercase tracking-wider block z-10 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  IA Financeira
                </span>
                <span className="text-[10px] text-white font-bold leading-snug mt-1.5 block z-10">
                  Pergunte algo sobre seu financeiro
                </span>
                <div className="flex items-center justify-between mt-2.5 gap-2 z-10">
                  <button className="bg-[#1062e6] hover:bg-[#1a73e8] text-white text-[9px] font-bold py-1 px-4 rounded-md transition-colors shadow">
                    Perguntar
                  </button>
                  <div className="w-8 h-6.5 rounded bg-white/5 border border-dark-border flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-status-blue">
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <circle cx="12" cy="5" r="2" />
                      <path d="M12 7v4" />
                      <line x1="8" y1="15" x2="8" y2="15.01" />
                      <line x1="16" y1="15" x2="16" y2="15.01" />
                      <path d="M9 18h6" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Sidebar IA Operacional Card */}
            {activeMenu === 'operacao' && (
              <div className="bg-[#0c182b] border border-[#3b82f6]/20 rounded-xl p-3 select-none flex flex-col justify-between min-h-[105px] -mb-1 shadow-inner relative overflow-hidden animate-fade-in">
                <div className="absolute inset-0 bg-radial-at-t from-[#3b82f6]/10 via-transparent to-transparent pointer-events-none" />
                <span className="text-[8px] text-status-cyan font-extrabold uppercase tracking-wider block z-10 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  IA Operacional
                  <span className="bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30 text-[6px] font-black px-1 rounded">BETA</span>
                </span>
                <span className="text-[10px] text-white font-bold leading-snug mt-1.5 block z-10">
                  Receba insights e recomendações para melhorar sua operação.
                </span>
                <div className="flex items-center justify-between mt-2.5 gap-2 z-10">
                  <button className="bg-[#1062e6] hover:bg-[#1a73e8] text-white text-[9px] font-bold py-1 px-4 rounded-md transition-colors shadow">
                    Ver insights
                  </button>
                  <div className="w-8 h-6.5 rounded bg-white/5 border border-dark-border flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-status-cyan">
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <circle cx="12" cy="5" r="2" />
                      <path d="M12 7v4" />
                      <line x1="8" y1="15" x2="8" y2="15.01" />
                      <line x1="16" y1="15" x2="16" y2="15.01" />
                      <path d="M9 18h6" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Filters Block */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Filtros</span>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] text-gray-400">Período</label>
                <div className="relative">
                  <select
                    value={selectedPeriod}
                    onChange={handlePeriodChange}
                    className="w-full bg-[#0d1726] border border-dark-border text-gray-200 text-xs rounded-lg py-1.5 pl-2 pr-7 focus:outline-none focus:border-brand-gold-start transition-colors appearance-none cursor-pointer"
                  >
                    {periods.map(p => (
                      <option key={p.label} value={p.label}>{p.label}</option>
                    ))}
                  </select>
                  <Calendar className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Sync status */}
            <div className="flex items-center justify-between bg-black/25 p-2 rounded-lg border border-dark-border/40 mt-auto">
              <div className="flex flex-col">
                <span className="text-[8px] text-gray-500 uppercase font-semibold">Última atualização</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-green pulse-dot"></span>
                  <span className="text-[9px] font-mono text-gray-300 font-semibold">
                    {ceoData?.lastUpdate || commercialData?.lastUpdate || marketingData?.lastUpdate || preVendasData?.lastUpdate || closerData?.lastUpdate || financeiroData?.lastUpdate || operacaoData?.lastUpdate || clientesData?.lastUpdate || configuracoesData?.lastUpdate || "16/05/2025 09:45"}
                  </span>
                </div>
                <span className="text-[8px] text-gray-500 font-semibold uppercase mt-0.5 block">
                  {activeMenu === 'pre-vendas' || activeMenu === 'closer' ? 'Dados em tempo real' : activeMenu === 'operacao' ? 'Dados sincronizados' : activeMenu === 'clientes' ? 'Dados sincronizados' : 'Dados atualizados'}
                </span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-1.5 rounded-lg bg-white/5 border border-dark-border text-gray-300 hover:text-brand-gold-start hover:border-brand-gold-start/50 transition-all active:scale-95"
                title="Sincronizar dados"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-brand-gold-start' : ''}`} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN VIEW CONTENT AREA */}
      <main className="flex-1 min-w-0 flex flex-col p-4 md:p-6 overflow-y-auto max-h-screen">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-border pb-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg bg-white/5 border border-dark-border text-gray-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div>
              <h1 className="font-heading font-black text-xl md:text-2xl text-white uppercase tracking-tight flex items-center gap-2">
                {activeMenu === 'dashboard-ceo' ? 'Dashboard do CEO' 
                  : activeMenu === 'comercial' ? 'Central Comercial' 
                  : activeMenu === 'marketing' ? 'Marketing' 
                  : activeMenu === 'pre-vendas' ? 'Pré-vendas (SDR)'
                  : activeMenu === 'closer' ? 'Cockpit do Closer'
                  : activeMenu === 'financeiro' ? 'Financeiro'
                  : activeMenu === 'operacao' ? 'Operação'
                  : activeMenu === 'clientes' ? 'Clientes'
                  : activeMenu === 'configuracoes' ? 'Configurações'
                  : 'Painel Axion'}
                {activeMenu === 'dashboard-ceo' ? (
                  <Crown className="w-5 h-5 text-brand-gold-start fill-brand-gold-start/20 pulse-dot" />
                ) : activeMenu === 'comercial' ? (
                  <Activity className="w-5 h-5 text-status-blue pulse-dot" />
                ) : activeMenu === 'marketing' ? (
                  <Target className="w-5 h-5 text-status-green pulse-dot" />
                ) : activeMenu === 'pre-vendas' ? (
                  <Headphones className="w-5 h-5 text-status-cyan pulse-dot" />
                ) : activeMenu === 'financeiro' ? (
                  <Wallet className="w-5 h-5 text-status-blue pulse-dot" />
                ) : activeMenu === 'operacao' ? (
                  <Settings className="w-5 h-5 text-status-blue pulse-dot" />
                ) : activeMenu === 'clientes' ? (
                  <Users className="w-5 h-5 text-status-blue pulse-dot" />
                ) : activeMenu === 'configuracoes' ? (
                  <Settings className="w-5 h-5 text-status-blue pulse-dot" />
                ) : (
                  <Target className="w-5 h-5 text-brand-gold-start pulse-dot" />
                )}
              </h1>
              <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest font-semibold block mt-0.5">
                {activeMenu === 'dashboard-ceo' ? 'Visão Geral do Negócio' 
                  : activeMenu === 'comercial' ? 'Visão completa da operação comercial' 
                  : activeMenu === 'marketing' ? 'Visão completa das estratégias de aquisição' 
                  : activeMenu === 'pre-vendas' ? 'Gestão e performance da prospecção e agendamentos'
                  : activeMenu === 'closer' ? 'Seu centro de operações para gerar e fechar negócios'
                  : activeMenu === 'financeiro' ? 'Visão completa da saúde financeira da empresa'
                  : activeMenu === 'operacao' ? 'Centro de controle da operação e entrega de valor'
                  : activeMenu === 'clientes' ? 'Centro de Sucesso do Cliente'
                  : activeMenu === 'configuracoes' ? 'Gerencie sua empresa, usuários, integrações e preferências da plataforma'
                  : 'Módulo em Desenvolvimento'}
              </span>
            </div>
          </div>

          {/* User profile / Search / Bell indicator */}
          <div className="flex items-center justify-end gap-3 self-end md:self-center">
            
            {/* Search Input Widget */}
            <div className="hidden md:flex items-center relative w-44 lg:w-56 select-none">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full bg-[#090e1a]/80 text-gray-300 placeholder-gray-500 border border-dark-border/40 py-1 px-8 rounded-lg text-[10px] focus:outline-none focus:border-[#3b82f6]/60 transition-colors"
              />
              <kbd className="absolute right-2.5 top-1.5 bg-white/5 border border-dark-border/60 text-[8px] font-mono px-1 rounded text-gray-500">⌘K</kbd>
            </div>

            {/* Help Circle Button */}
            <button className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors shrink-0">
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Notification Bell Button */}
            <button className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors relative shrink-0">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-status-red text-[7.5px] font-black text-white rounded-full flex items-center justify-center border border-[#090e1a] shadow">12</span>
            </button>

            {/* Calendar Indicator (only for CEO/Comercial/Marketing/SDR/Closer/Financeiro/Operacao) */}
            {activeMenu !== 'configuracoes' && activeMenu !== 'clientes' && (
              <div className="hidden lg:flex items-center gap-2 bg-dark-card border border-dark-border rounded-lg py-1.5 px-3 text-xs shrink-0 select-none">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-300 font-mono font-medium">{selectedPeriod}</span>
              </div>
            )}
            
            {activeMenu !== 'configuracoes' && activeMenu !== 'clientes' && (activeMenu === 'comercial' || activeMenu === 'marketing' || activeMenu === 'pre-vendas' || activeMenu === 'closer') && (
              <div className="hidden lg:flex items-center gap-1 bg-dark-card border border-dark-border rounded-lg py-1.5 px-3 text-xs text-gray-400 cursor-pointer hover:border-dark-border-hover transition-colors shrink-0 select-none">
                <span>Filtros</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            )}

            {/* User Profile Button */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 bg-dark-card border border-dark-border rounded-xl p-1 pr-3 hover:border-dark-border-hover transition-colors"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden border border-brand-gold-start/50 bg-[#122136] flex items-center justify-center shadow-lg shrink-0">
                  <span className="text-brand-gold-start font-black text-[11px] font-heading">FD</span>
                </div>
                <div className="text-left hidden sm:block leading-none">
                  <span className="text-[10px] font-bold text-white block">Felipe Damasceno</span>
                  <span className="text-[7.5px] text-gray-500 block font-bold uppercase mt-0.5">CEO</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform shrink-0 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl border border-[#3b82f6]/20 bg-[#070e1b] p-1 shadow-2xl z-20">
                    <div className="px-3 py-2 border-b border-dark-border/60">
                      <span className="text-xs font-semibold text-white block">Felipe Damasceno</span>
                      <span className="text-[9px] text-brand-gold-start block">felipedamasceno.1</span>
                    </div>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 rounded-lg hover:text-white text-left transition-colors">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      Perfil de Usuário
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 rounded-lg hover:text-white text-left transition-colors">
                      <Settings className="w-3.5 h-3.5 text-gray-400" />
                      Configurações
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-status-red hover:bg-status-red/10 rounded-lg text-left transition-colors border-t border-dark-border/40 mt-1">
                      <LogOut className="w-3.5 h-3.5" />
                      Encerrar Sessão
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="flex-1 flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-brand-gold-start animate-spin" />
          </div>
        )}

        {/* ERROR SCREEN */}
        {!loading && error && (
          <div className="glass-card max-w-md mx-auto p-6 rounded-xl border-status-red/50 text-center my-12">
            <AlertTriangle className="w-10 h-10 text-status-red mx-auto mb-3" />
            <h3 className="text-white font-heading font-bold text-sm mb-1">Módulo Offline</h3>
            <p className="text-gray-400 text-xs mb-4">{error}</p>
            <button onClick={handleRefresh} className="btn-gold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 mx-auto">
              <RefreshCw className="w-3 h-3" /> Sincronizar
            </button>
          </div>
        )}

        {/* RENDER ACTIVE TAB CONTENT */}
        {!loading && !error && (
          <>
            {activeMenu === 'dashboard-ceo' && ceoData && (
              /* RENDER CEO DASHBOARD CONTENT */
              <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                {/* 8 KPI Cards */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Receita Contratada */}
                  <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[96px]">
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Receita Contratada</span>
                      <TrendingUp className="w-4 h-4 text-status-green" />
                    </div>
                    <div className="my-2">
                      <span className="text-lg md:text-2xl font-heading font-black text-white font-mono block">
                        {formatValue(ceoData.kpis.receitaContratada.value, 'currency')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] md:text-xs">
                      <span className="text-status-green font-bold">▲ {ceoData.kpis.receitaContratada.change}%</span>
                      <span className="text-gray-500 font-medium">vs anterior</span>
                    </div>
                  </div>

                  {/* Card 2: Receita Recebida */}
                  <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[96px]">
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Receita Recebida</span>
                      <div className="w-4 h-4 rounded-full border-2 border-status-green flex items-center justify-center">
                        <DollarSign className="w-2.5 h-2.5 text-status-green" />
                      </div>
                    </div>
                    <div className="my-2">
                      <span className="text-lg md:text-2xl font-heading font-black text-white font-mono block">
                        {formatValue(ceoData.kpis.receitaRecebida.value, 'currency')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] md:text-xs">
                      <span className="text-status-green font-bold">▲ {ceoData.kpis.receitaRecebida.change}%</span>
                      <span className="text-gray-500 font-medium">vs anterior</span>
                    </div>
                  </div>

                  {/* Card 3: ROI Comercial */}
                  <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[96px]">
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="text-[10px] font-bold uppercase tracking-wider">ROI Comercial</span>
                      <Target className="w-4 h-4 text-status-purple" />
                    </div>
                    <div className="my-2">
                      <span className="text-lg md:text-2xl font-heading font-black text-white font-mono block">
                        {ceoData.kpis.roiComercial.value}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] md:text-xs">
                      <span className="text-status-green font-bold">▲ {ceoData.kpis.roiComercial.change} p.p.</span>
                      <span className="text-gray-500 font-medium">vs anterior</span>
                    </div>
                  </div>

                  {/* Card 4: CAC */}
                  <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[96px]">
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="text-[10px] font-bold uppercase tracking-wider">CAC (Custo por Cliente)</span>
                      <Users className="w-4 h-4 text-status-blue" />
                    </div>
                    <div className="my-2">
                      <span className="text-lg md:text-2xl font-heading font-black text-white font-mono block">
                        {formatValue(ceoData.kpis.cac.value, 'currency-full')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] md:text-xs">
                      <span className="text-status-green font-bold">▼ {Math.abs(ceoData.kpis.cac.change)}%</span>
                      <span className="text-gray-500 font-medium">vs anterior</span>
                    </div>
                  </div>

                  {/* Card 5: Ticket Médio */}
                  <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[96px]">
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Ticket Médio</span>
                      <Award className="w-4 h-4 text-status-yellow" />
                    </div>
                    <div className="my-2">
                      <span className="text-lg md:text-2xl font-heading font-black text-white font-mono block">
                        {formatValue(ceoData.kpis.ticketMedio.value, 'currency')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] md:text-xs">
                      <span className="text-status-green font-bold">▲ {ceoData.kpis.ticketMedio.change}%</span>
                      <span className="text-gray-500 font-medium">vs anterior</span>
                    </div>
                  </div>

                  {/* Card 6: Entrada Média */}
                  <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[96px]">
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Entrada Média</span>
                      <DollarSign className="w-4 h-4 text-status-green" />
                    </div>
                    <div className="my-2">
                      <span className="text-lg md:text-2xl font-heading font-black text-white font-mono block">
                        {formatValue(ceoData.kpis.entradaMedia.value, 'currency')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] md:text-xs">
                      <span className="text-status-green font-bold">▲ {ceoData.kpis.entradaMedia.change}%</span>
                      <span className="text-gray-500 font-medium">vs anterior</span>
                    </div>
                  </div>

                  {/* Card 7: Pipeline */}
                  <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[96px]">
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Pipeline (R$)</span>
                      <Layers className="w-4 h-4 text-status-blue" />
                    </div>
                    <div className="my-2">
                      <span className="text-lg md:text-2xl font-heading font-black text-white font-mono block">
                        {formatValue(ceoData.kpis.pipeline.value, 'currency')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] md:text-xs">
                      <span className="text-status-green font-bold">▲ {ceoData.kpis.pipeline.change}%</span>
                      <span className="text-gray-500 font-medium">vs anterior</span>
                    </div>
                  </div>

                  {/* Card 8: Meta do Mês Progress */}
                  <div className="glass-card p-3.5 rounded-xl flex items-center justify-between min-h-[96px]">
                    <div className="flex flex-col justify-between h-full flex-grow">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Meta do Mês</span>
                      <div className="my-1">
                        <span className="text-sm font-bold text-white block">{ceoData.kpis.metaMes.percentage}%</span>
                        <span className="text-[9px] text-gray-500 font-mono block">
                          {formatValue(ceoData.kpis.metaMes.current, 'currency')} / {formatValue(ceoData.kpis.metaMes.target, 'currency')}
                        </span>
                      </div>
                    </div>
                    <div className="w-[64px] h-[64px] shrink-0">
                      <Chart
                        options={{
                          chart: { type: 'radialBar', sparkline: { enabled: true } },
                          plotOptions: {
                            radialBar: {
                              hollow: { size: '58%' },
                              dataLabels: {
                                name: { show: false },
                                value: { offsetY: 4, fontSize: '11px', color: '#fff', fontWeight: 'bold', formatter: (val) => `${val}%` }
                              },
                              track: { background: '#111b27' }
                            }
                          },
                          colors: ['#06b6d4'],
                          stroke: { lineCap: 'round' }
                        }}
                        series={[ceoData.kpis.metaMes.percentage]}
                        type="radialBar"
                        height="100%"
                        width="100%"
                      />
                    </div>
                  </div>
                </section>

                {/* Section: Funnel, Line chart, Health Radial */}
                <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Funil */}
                  <div className="glass-card p-5 rounded-xl flex flex-col justify-between min-h-[380px]">
                    <div className="border-b border-dark-border pb-3 mb-3">
                      <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">Funil Comercial</h3>
                    </div>
                    <div className="flex-grow">
                      <FunnelChart data={ceoData.funnel} generalConversionRate={ceoData.generalConversionRate} />
                    </div>
                  </div>

                  {/* Revenue Line Chart */}
                  {ceoConfigs && (
                    <div className="glass-card p-5 rounded-xl flex flex-col justify-between min-h-[380px]">
                      <div className="border-b border-dark-border pb-3 mb-3 flex items-center justify-between">
                        <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">Evolução de Receita</h3>
                        <div className="flex gap-4 text-[9px] text-gray-500 font-mono">
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-status-blue"></span> Receita</span>
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span> Meta</span>
                        </div>
                      </div>
                      <div className="flex-grow flex items-center">
                        <div className="w-full h-[280px]">
                          <Chart options={ceoConfigs.revenueChartOptions} series={ceoConfigs.revenueChartSeries} type="line" height="100%" width="100%" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Saúde & Payback */}
                  {ceoConfigs && (
                    <div className="flex flex-col gap-6 justify-between min-h-[380px]">
                      <div className="glass-card p-5 rounded-xl flex-grow flex flex-col justify-between">
                        <div className="border-b border-dark-border pb-2.5 mb-2.5">
                          <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">Saúde Comercial (ISC)</h3>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="w-5/12 h-[120px] flex items-center justify-center relative overflow-hidden mt-2">
                            <Chart options={ceoConfigs.healthChartOptions} series={ceoConfigs.healthChartSeries} type="radialBar" height={160} width={160} />
                            <div className="absolute bottom-2 text-center">
                              <span className="text-[10px] text-gray-500 font-bold font-mono">/ 100</span>
                            </div>
                          </div>
                          <div className="w-7/12 flex flex-col gap-1.5 text-[10px]">
                            {ceoData.commercialHealth.details.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between py-0.5 border-b border-dark-border/40 last:border-0">
                                <div className="flex items-center gap-1.5 text-gray-400">
                                  <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'good' ? 'bg-status-green' : 'bg-status-yellow'}`}></span>
                                  <span className="truncate max-w-[110px] font-medium">{item.name}</span>
                                </div>
                                <span className="font-mono text-white font-bold">{item.value}/100</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="border-t border-dark-border pt-2.5 mt-2 flex items-center text-xs text-status-green font-bold gap-1">
                          <span>▲ {ceoData.commercialHealth.change} pts</span>
                          <span className="text-gray-500 font-medium text-[10px] normal-case ml-1">vs anterior</span>
                        </div>
                      </div>

                      <div className="glass-card p-4 rounded-xl flex items-center justify-between min-h-[96px] shrink-0">
                        <div className="flex flex-col justify-between h-full">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payback Comercial</span>
                          <div className="my-1">
                            <span className="text-xl font-heading font-black text-white font-mono block">
                              {ceoData.payback.months} {ceoData.payback.months === 1 ? 'mês' : 'meses'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-status-green font-bold">
                            <span>▲ {ceoData.payback.change} mês</span>
                            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-status-green/10 border border-status-green/30 flex items-center justify-center shadow-lg">
                          <div className="relative">
                            <Calendar className="w-6 h-6 text-status-green" />
                            <DollarSign className="w-3 h-3 text-status-green absolute top-[6px] left-[6px] font-bold stroke-[3]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Conversions grid, Lead origins donut, followups */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Conversions Mini Cards */}
                  <div className="glass-card p-5 rounded-xl lg:col-span-6 flex flex-col justify-between">
                    <div className="border-b border-dark-border pb-3 mb-4">
                      <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">Métricas de Conversão</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {ceoData.conversionMetrics.map((item) => {
                        const isDown = item.trend === 'down';
                        const isPositive = (isDown && item.positiveDown) || (!isDown && !item.positiveDown);
                        return (
                          <div key={item.id} className="bg-black/20 p-2.5 rounded-lg border border-dark-border/40 flex flex-col justify-between min-h-[110px]">
                            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wide leading-tight min-h-[20px] block">{item.title}</span>
                            <div className="my-1.5">
                              <span className="text-sm font-black text-white font-mono block">
                                {item.isPercent ? formatValue(item.value, 'percent') : formatValue(item.value, 'currency')}
                              </span>
                            </div>
                            <div className="w-full h-[22px] my-1">
                              <Chart options={sparklineConfig(isPositive ? '#10b981' : '#ef4444')} series={[{ data: item.sparkline }]} type="line" height="100%" width="100%" />
                            </div>
                            <div className={`text-[9px] font-bold flex items-center gap-0.5 mt-1 ${isPositive ? 'text-status-green' : 'text-status-red'}`}>
                              {isDown ? '▼' : '▲'} {Math.abs(item.change)}{item.isPp ? ' p.p.' : '%'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lead Origins Donut */}
                  {ceoConfigs && (
                    <div className="glass-card p-5 rounded-xl lg:col-span-3 flex flex-col justify-between">
                      <div className="border-b border-dark-border pb-3 mb-3">
                        <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">Origem dos Leads</h3>
                      </div>
                      <div className="w-full h-[150px] flex items-center justify-center mt-2 relative">
                        <Chart options={ceoConfigs.donutChartOptions} series={ceoConfigs.donutChartSeries} type="donut" height="100%" width="100%" />
                      </div>
                      <div className="flex flex-col gap-1.5 mt-3 text-[10px]">
                        {ceoData.leadSources.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between border-b border-dark-border/30 pb-1 last:border-0">
                            <div className="flex items-center gap-2 text-gray-400">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                              <span className="font-medium truncate max-w-[100px]">{item.source}</span>
                            </div>
                            <div className="flex gap-2 font-mono">
                              <span className="text-gray-500">{item.count}</span>
                              <span className="text-white font-bold">{item.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Followups Horizontal Bars */}
                  {ceoConfigs && (
                    <div className="glass-card p-5 rounded-xl lg:col-span-3 flex flex-col justify-between">
                      <div className="border-b border-dark-border pb-3 mb-3 flex items-center justify-between">
                        <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">Status dos Follow-ups</h3>
                        <span className="text-[10px] font-mono text-status-blue font-bold">Total: {ceoData.followUps.total}</span>
                      </div>
                      <div className="w-full h-[220px]">
                        <Chart options={ceoConfigs.followUpChartOptions} series={ceoConfigs.followUpChartSeries} type="bar" height="100%" width="100%" />
                      </div>
                    </div>
                  )}
                </section>

                {/* Activities & Alerts */}
                <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  {/* Activities Row list */}
                  <div className="glass-card p-5 rounded-xl xl:col-span-8 flex flex-col justify-between">
                    <div className="border-b border-dark-border pb-3 mb-4">
                      <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">Atividades Recentes</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                      {ceoData.recentActivities.map((activity, idx) => {
                        let Icon = Calendar;
                        let colorClass = 'text-status-blue bg-status-blue/10 border-status-blue/30';
                        if (activity.type === 'venda') {
                          Icon = CheckCircle2;
                          colorClass = 'text-status-green bg-status-green/10 border-status-green/30';
                        } else if (activity.type === 'proposta') {
                          Icon = FileText;
                          colorClass = 'text-status-purple bg-status-purple/10 border-status-purple/30';
                        } else if (activity.type === 'ligacao') {
                          Icon = Phone;
                          colorClass = 'text-status-yellow bg-status-yellow/10 border-status-yellow/30';
                        } else if (activity.type === 'lead') {
                          Icon = Users;
                          colorClass = 'text-status-cyan bg-status-cyan/10 border-status-cyan/30';
                        }
                        return (
                          <div key={idx} className="flex flex-row sm:flex-col sm:items-center sm:text-center items-start gap-3 bg-black/15 p-3 rounded-xl border border-dark-border/40 hover:border-dark-border transition-all duration-150 group cursor-pointer">
                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${colorClass}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-grow sm:mt-1 truncate w-full">
                              <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">{activity.label}</span>
                              <span className="block text-xs font-semibold text-white my-0.5 truncate">{activity.detail}</span>
                              <span className="block text-[9px] text-gray-400 font-mono">{activity.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Alerts & Opportunities */}
                  <div className="glass-card p-5 rounded-xl xl:col-span-4 flex flex-col justify-between min-h-[170px]">
                    <div>
                      <div className="border-b border-dark-border pb-3 mb-3">
                        <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">Alertas e Oportunidades</h3>
                      </div>
                      <div className="flex flex-col gap-2">
                        {ceoData.alerts.map((alert, idx) => {
                          let alertColor = 'border-status-blue/30 bg-status-blue/5 text-gray-300';
                          let iconColor = 'text-status-blue';
                          if (alert.type === 'danger') {
                            alertColor = 'border-status-red/30 bg-status-red/5 text-gray-300';
                            iconColor = 'text-status-red';
                          } else if (alert.type === 'warning') {
                            alertColor = 'border-status-yellow/30 bg-status-yellow/5 text-gray-300';
                            iconColor = 'text-status-yellow';
                          }
                          return (
                            <div key={idx} className={`flex items-start gap-3 p-2.5 rounded-lg border text-[11px] leading-relaxed transition-colors hover:bg-white/5 cursor-pointer ${alertColor}`}>
                              <AlertTriangle className={`w-4.5 h-4.5 shrink-0 ${iconColor} mt-0.5`} />
                              <span className="font-medium">{alert.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <button className="flex items-center justify-between text-xs text-gray-400 hover:text-brand-gold-start transition-colors font-medium border-t border-dark-border/40 pt-3 mt-4 w-full">
                      <span>Ver todos os alertas</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </section>
              </div>
            )}

            {activeMenu === 'comercial' && commercialData && (
              /* RENDER COMMERCIAL TAB CONTENT */
              <div className="animate-in fade-in duration-200">
                <CommercialTab data={commercialData} formatValue={formatValue} />
              </div>
            )}

            {activeMenu === 'marketing' && marketingData && (
              /* RENDER MARKETING TAB CONTENT */
              <div className="animate-in fade-in duration-200">
                <MarketingTab data={marketingData} formatValue={formatValue} />
              </div>
            )}

            {activeMenu === 'pre-vendas' && preVendasData && (
              /* RENDER PRE-VENDAS TAB CONTENT */
              <div className="animate-in fade-in duration-200">
                <PreVendasTab data={preVendasData} formatValue={formatValue} />
              </div>
            )}

            {activeMenu === 'closer' && closerData && (
              /* RENDER CLOSER TAB CONTENT */
              <div className="animate-in fade-in duration-200">
                <CloserTab data={closerData} formatValue={formatValue} />
              </div>
            )}

            {activeMenu === 'financeiro' && financeiroData && (
              /* RENDER FINANCEIRO TAB CONTENT */
              <div className="animate-in fade-in duration-200">
                <FinanceiroTab data={financeiroData} formatValue={formatValue} />
              </div>
            )}

            {activeMenu === 'operacao' && operacaoData && (
              /* RENDER OPERACAO TAB CONTENT */
              <div className="animate-in fade-in duration-200">
                <OperacaoTab data={operacaoData} formatValue={formatValue} />
              </div>
            )}

            {activeMenu === 'clientes' && clientesData && (
              /* RENDER CLIENTES TAB CONTENT */
              <div className="animate-in fade-in duration-200">
                <ClientesTab data={clientesData} formatValue={formatValue} />
              </div>
            )}

            {activeMenu === 'configuracoes' && configuracoesData && (
              /* RENDER CONFIGURACOES TAB CONTENT */
              <div className="animate-in fade-in duration-200">
                <ConfiguracoesTab data={configuracoesData} formatValue={formatValue} />
              </div>
            )}

            {/* PLACEHOLDER MOCK CONTENT FOR OTHER MODULES */}
            {activeMenu !== 'dashboard-ceo' && activeMenu !== 'comercial' && activeMenu !== 'marketing' && activeMenu !== 'pre-vendas' && activeMenu !== 'closer' && activeMenu !== 'financeiro' && activeMenu !== 'operacao' && activeMenu !== 'clientes' && activeMenu !== 'configuracoes' && (
              <div className="glass-card p-12 rounded-xl text-center border-dashed border-dark-border my-6">
                <Sparkles className="w-12 h-12 text-brand-gold-start mx-auto mb-4 animate-bounce" />
                <h3 className="text-white font-heading font-bold text-lg mb-2">Módulo em Desenvolvimento</h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                  O painel para a seção <strong>{menuItems.find(item => item.id === activeMenu)?.label || activeMenu}</strong> está em fase de design corporativo. O link com a API do Node.js será estabelecido na próxima etapa.
                </p>
                <button
                  onClick={() => setActiveMenu('closer')}
                  className="btn-gold py-2 px-5 rounded-lg text-xs flex items-center gap-2 mx-auto"
                >
                  Ir para Closer
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

      </main>

    </div>
  );
}

export default App;
