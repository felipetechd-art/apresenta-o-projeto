import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Plus, LogOut, ShieldCheck, MoreHorizontal, ExternalLink, FileText, Calendar, Search, PlayCircle, Clock, UserPlus, CheckCircle, SlidersHorizontal, X, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PresentationGovernanceDraftRepository } from '../../repositories/PresentationGovernanceDraftRepository';
import { StorageHelper } from '../../repositories/StorageHelper';
import { FirestoreSyncService } from '../../repositories/FirestoreSyncService';
import ClientDetailsModal from './ClientDetailsModal';
import { downloadContract } from '../../domain/commercial/contractGenerator.js';
import { downloadContractFromSnapshot, validateContractData, handleClientContractDownload } from '../../domain/commercial/contractSnapshot.js';
import { diagnosticService } from '../../services/diagnosticService.js';
import { LucroOcultoTab } from '../lucroOculto/LucroOcultoTab.jsx';

export default function ClientManagementView() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [salesStatusFilter, setSalesStatusFilter] = useState('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState('lucro_oculto'); // 'lucro_oculto', 'propostas', 'diagnosticos', 'clientes', 'clientes_ppe'
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const mergeClients = (localList, cloudList) => {
    const map = new Map();

    // 1. Inicia com itens locais
    localList.forEach(c => {
      const key = c.presentationSessionId || c.companyId;
      if (key) map.set(key, c);
    });

    // 2. Mescla com dados da nuvem
    cloudList.forEach(cloudItem => {
      const key = cloudItem.presentationSessionId || cloudItem.companyId;
      if (!key) return;

      if (cloudItem.status === 'archived') {
        map.delete(key);
        return;
      }

      if (!map.has(key)) {
        // Novo item vindo da nuvem (ex: no celular recebendo propostas da web)
        map.set(key, {
          presentationSessionId: cloudItem.presentationSessionId || key,
          name: cloudItem.name || cloudItem.fullData?.clientInfo?.name || 'Cliente',
          company: cloudItem.company || cloudItem.fullData?.clientInfo?.company || '',
          clientEmail: cloudItem.clientEmail || cloudItem.fullData?.clientInfo?.email || null,
          status: cloudItem.status || 'draft',
          companyId: cloudItem.companyId || null,
          updatedAt: cloudItem.updatedAt || new Date().toISOString(),
          fullData: cloudItem.fullData || null,
          cloudData: cloudItem
        });
      } else {
        // Já existe localmente: mescla priorizando versão mais recente ou que tenha fullData
        const existing = map.get(key);
        const localDate = new Date(existing.updatedAt || 0).getTime();
        const cloudDate = new Date(cloudItem.updatedAt || 0).getTime();

        if (cloudDate >= localDate || !existing.fullData) {
          map.set(key, {
            ...existing,
            ...cloudItem,
            fullData: cloudItem.fullData || existing.fullData,
            cloudData: cloudItem
          });
        }
      }
    });

    return Array.from(map.values())
      .filter(c => c.status !== 'archived')
      .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
  };

  const loadClients = async () => {
    const list = PresentationGovernanceDraftRepository.list();
    let arr = Object.values(list)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .map(item => {
        const fullData = PresentationGovernanceDraftRepository.findBySessionId(item.presentationSessionId);
        return {
          ...item,
          fullData
        };
      })
      .filter(c => c.status !== 'archived');
    
    // Mostra os dados locais primeiro para responder rápido
    setClients(prev => mergeClients(prev, arr));
    
    // Auto-repair & Cloud Sync
    try {
      // 1. Envia todos os registros locais para a nuvem (garante que propostas da web vão para o Firestore)
      await FirestoreSyncService.syncAllLocalDraftsToCloud();
      
      // 2. Busca todos os clientes da nuvem para atualizar o painel Admin
      const cloudClients = await FirestoreSyncService.getAllClientsFromCloud();
      if (cloudClients && cloudClients.length > 0) {
        setClients(prevClients => mergeClients(prevClients, cloudClients));
      }
    } catch (e) {
      console.error("Erro ao sincronizar com a nuvem:", e);
    }
  };

  useEffect(() => {
    loadClients();

    // Sincronização em tempo real: qualquer alteração feita no celular ou na web atualiza a outra tela na hora!
    const unsubscribe = FirestoreSyncService.subscribeToAllClients((cloudClients) => {
      if (cloudClients && cloudClients.length > 0) {
        setClients(prevClients => mergeClients(prevClients, cloudClients));
      }
    });

    const handleStorageChange = (e) => {
      if (e.key === PresentationGovernanceDraftRepository.indexKey || (e.key && e.key.includes('@PGE:presentations:'))) {
        loadClients();
      }
    };
    
    // Escuta foco da janela para recarregar quando o admin volta para a aba
    const handleFocus = () => loadClients();

    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleClickOutside);

    return () => {
      if (unsubscribe) unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleDeleteClient = (sessionId) => {
    PresentationGovernanceDraftRepository.update(sessionId, { status: 'archived' });
    setClients(prev => prev.filter(c => c.presentationSessionId !== sessionId));
    setSelectedClient(null);
    FirestoreSyncService.syncDraftToCloud(sessionId, { status: 'archived' }).catch(console.error);
  };

  const handleActivateClient = async (sessionId, email) => {
    const companyId = `client-${crypto.randomUUID()}`;
    const draftScopeId = `draft-${sessionId}`;
    
    const closings = StorageHelper.getItem('monthly_snapshots', [], draftScopeId);
    if (closings && closings.length > 0) {
      StorageHelper.setItem('monthly_snapshots', closings, companyId);
    }
    
    const tasks = StorageHelper.getItem('roadmap_tasks', [], draftScopeId);
    if (tasks && tasks.length > 0) {
      StorageHelper.setItem('roadmap_tasks', tasks, companyId);
    }

    PresentationGovernanceDraftRepository.update(sessionId, { status: 'active', companyId, clientEmail: email });
    setClients(prev => prev.map(c => {
      if (c.presentationSessionId === sessionId) {
        return { ...c, status: 'active', companyId, clientEmail: email, fullData: { ...c.fullData, status: 'active', companyId, clientEmail: email } };
      }
      return c;
    }));
    
    // Cloud Sync (Sincroniza os dados do localStorage para o Firestore)
    await FirestoreSyncService.syncToCloud(companyId);
    setSelectedClient(prev => ({ 
      ...prev, 
      status: 'active', 
      companyId, 
      clientEmail: email,
      fullData: { ...prev.fullData, status: 'active', companyId, clientEmail: email } 
    }));
  };

  const handleActivateClientPPE = async (sessionId, email) => {
    const companyId = `client-${crypto.randomUUID()}`;
    const draftScopeId = `draft-${sessionId}`;
    
    const closings = StorageHelper.getItem('monthly_snapshots', [], draftScopeId);
    if (closings && closings.length > 0) {
      StorageHelper.setItem('monthly_snapshots', closings, companyId);
    }
    
    const tasks = StorageHelper.getItem('roadmap_tasks', [], draftScopeId);
    if (tasks && tasks.length > 0) {
      StorageHelper.setItem('roadmap_tasks', tasks, companyId);
    }

    PresentationGovernanceDraftRepository.update(sessionId, { status: 'active_ppe', companyId, clientEmail: email });
    setClients(prev => prev.map(c => {
      if (c.presentationSessionId === sessionId) {
        return { ...c, status: 'active_ppe', companyId, clientEmail: email, fullData: { ...c.fullData, status: 'active_ppe', companyId, clientEmail: email } };
      }
      return c;
    }));
    
    // Cloud Sync (Sincroniza os dados do localStorage para o Firestore)
    await FirestoreSyncService.syncToCloud(companyId);
    setSelectedClient(prev => ({ 
      ...prev, 
      status: 'active_ppe', 
      companyId, 
      clientEmail: email,
      fullData: { ...prev.fullData, status: 'active_ppe', companyId, clientEmail: email } 
    }));
  };

  const handleStartDiagnostic = async (client) => {
    try {
      let companyId = client.companyId;
      if (!companyId) {
        // Auto-activate for the Diagnostic phase
        companyId = `client-${crypto.randomUUID()}`;
        const email = client.clientEmail || client.fullData?.clientInfo?.email || 'sem-email@cliente.com';
        PresentationGovernanceDraftRepository.update(client.presentationSessionId, { companyId, clientEmail: email });
      }
      
      const kickoffData = client.fullData?.diagnosticData || {};
      const diagId = await diagnosticService.createDiagnostic(companyId, kickoffData);
      
      // Salva o ID do mapa 360 de volta no rascunho do cliente para podermos acessar a devolutiva depois
      PresentationGovernanceDraftRepository.update(client.presentationSessionId, {
        diagnosticData: {
          ...kickoffData,
          currentDiagnosticId: diagId
        }
      });
      
      // Redireciona para o fluxo do mapa 360
      navigate(`/diagnostico/${diagId}`);
    } catch (e) {
      console.error(e);
      alert("Erro ao iniciar o mapa 360.");
    }
  };

  const filteredClients = clients.filter(c => {
    const hasDiagnostic = !!c.fullData?.diagnosticData?.currentDiagnosticId;
    const isDiagnosticSold = c.fullData?.diagnosticData?.salesStatus === 'fechado';
    
    // Aba filter
    if (activeTab === 'propostas') {
      // Mostrar apenas os que não estão ativos E não iniciaram mapa 360 E não tiveram o mapa 360 vendido
      if (c.status === 'active' || c.status === 'active_ppe' || hasDiagnostic || isDiagnosticSold) return false;
    }
    if (activeTab === 'diagnosticos') {
      // Mostrar os que têm mapa 360 vendido ou iniciado, mas não estão ativos (PGE)
      if (c.status === 'active' || c.status === 'active_ppe' || (!hasDiagnostic && !isDiagnosticSold)) return false;
    }
    if (activeTab === 'clientes') {
      if (c.status !== 'active') return false;
    }
    if (activeTab === 'clientes_ppe') {
      if (c.status !== 'active_ppe') return false;
    }

    // Search term
    const sTermMatch = !searchTerm || c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const draftData = c.fullData?.diagnosticData || {};
    const salesStatus = draftData.salesStatus || 'aguardando';
    const leadStatus = draftData.leadStatus || 'qualificado';

    let salesMatch = true;
    if (salesStatusFilter !== 'all') {
      salesMatch = salesStatus === salesStatusFilter;
    }

    let leadMatch = true;
    if (leadStatusFilter !== 'all') {
      leadMatch = leadStatus === leadStatusFilter;
    }

    let dateMatch = true;
    if (dateFilter !== 'all') {
      const date = new Date(c.updatedAt);
      const today = new Date();
      if (dateFilter === 'hoje') {
        dateMatch = date.toDateString() === today.toDateString();
      } else if (dateFilter === '7d') {
        const diff = today - date;
        dateMatch = diff <= 7 * 24 * 60 * 60 * 1000;
      } else if (dateFilter === '30d') {
        const diff = today - date;
        dateMatch = diff <= 30 * 24 * 60 * 60 * 1000;
      }
    }

    return sTermMatch && salesMatch && leadMatch && dateMatch;
  });

  const propostasRealizadasCount = filteredClients.length;

  return (
    <div className="min-h-screen bg-neutral-900 font-sans selection:bg-amber-500/30">
      {/* Topbar */}
      <header className="bg-neutral-800/50 backdrop-blur-xl border-b border-neutral-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-500" />
              <h1 className="text-xl font-semibold text-white tracking-tight">PGE Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-400 hidden sm:block">{user?.email}</span>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-700 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 sm:pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            GESTÃO DE <span className="font-semibold text-amber-500">CLIENTES</span>
          </h2>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap md:flex-nowrap items-center gap-2 sm:gap-3 relative">
            <Link
              to="/mapa-lucro-oculto"
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2 focus:ring-offset-neutral-900 text-center"
            >
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
              <span>Mapa do lucro oculto</span>
            </Link>
            <Link
              to="/conversa"
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2 focus:ring-offset-neutral-900 text-center"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Nova conversa</span>
            </Link>
            <Link
              to="/admin/usuarios"
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2 focus:ring-offset-neutral-900 text-center"
            >
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Acessos</span>
            </Link>
            <Link
              to="/admin/diagnostico/config"
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2 focus:ring-offset-neutral-900 text-center"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">Configurar Mapa 360</span>
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-900 text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900 text-center"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Nova apresentação</span>
            </Link>
            
            <Link
              to="/ppe"
              className="col-span-2 sm:col-span-1 md:col-auto md:absolute md:-bottom-14 md:right-2 flex items-center justify-center gap-2 w-full sm:w-auto md:w-10 md:h-10 py-2 sm:py-2.5 md:py-0 px-3 sm:px-4 md:px-0 bg-[#0a0a0a] text-[#d4af37] text-xs font-black font-heading rounded-xl md:rounded-full transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] border border-[#d4af37]/50 hover:scale-105 md:hover:scale-110 z-10 text-center"
              title="Apresentação PPE"
            >
              <span className="md:hidden text-neutral-300 font-normal">Apresentação</span>
              <span>PPE</span>
            </Link>
          </div>
        </div>

        <div className="flex border-b border-neutral-800 overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5">
          <button
            onClick={() => setActiveTab('lucro_oculto')}
            className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
              activeTab === 'lucro_oculto' 
                ? 'border-amber-500 text-amber-500' 
                : 'border-transparent text-neutral-500 hover:text-white'
            }`}
          >
            Mapa do Lucro Oculto
          </button>
          <button
            onClick={() => setActiveTab('propostas')}
            className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
              activeTab === 'propostas' 
                ? 'border-amber-500 text-amber-500' 
                : 'border-transparent text-neutral-500 hover:text-white'
            }`}
          >
            Apresentações (Nova Conversa)
          </button>
          <button
            onClick={() => setActiveTab('diagnosticos')}
            className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
              activeTab === 'diagnosticos' 
                ? 'border-amber-500 text-amber-500' 
                : 'border-transparent text-neutral-500 hover:text-white'
            }`}
          >
            Mapas 360
          </button>
          <button
            onClick={() => setActiveTab('clientes')}
            className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
              activeTab === 'clientes' 
                ? 'border-amber-500 text-amber-500' 
                : 'border-transparent text-neutral-500 hover:text-white'
            }`}
          >
            Clientes Ativados
          </button>
          <button
            onClick={() => setActiveTab('clientes_ppe')}
            className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
              activeTab === 'clientes_ppe' 
                ? 'border-amber-500 text-amber-500' 
                : 'border-transparent text-neutral-500 hover:text-white'
            }`}
          >
            Clientes PPE
          </button>
        </div>

        {activeTab === 'lucro_oculto' ? (
          <div className="mt-6">
            <LucroOcultoTab />
          </div>
        ) : (
          <>
            {/* Desktop Filters: 4 colunas em linha (100% preservado) */}
            <div className="hidden md:grid md:grid-cols-4 gap-4 mb-6 mt-6">
          <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4 flex flex-col justify-center gap-1">
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
              {activeTab === 'propostas' ? 'Propostas Realizadas' : 'Clientes Ativados'}
            </span>
            <span className="text-3xl font-heading font-extrabold text-white">
              {filteredClients.length}
            </span>
          </div>
          <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4 flex flex-col justify-center gap-2">
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Período</span>
            <select 
              value={dateFilter} 
              onChange={e => setDateFilter(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white px-3 py-1.5 focus:border-amber-500 outline-none w-full cursor-pointer"
            >
              <option value="all">Todo o período</option>
              <option value="hoje">Hoje</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
            </select>
          </div>

          <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4 flex flex-col justify-center gap-2">
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Status da Venda</span>
            <select 
              value={salesStatusFilter} 
              onChange={e => setSalesStatusFilter(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white px-3 py-1.5 focus:border-amber-500 outline-none w-full cursor-pointer"
            >
              <option value="all">Todos</option>
              <option value="aguardando">Aguardando Proposta</option>
              <option value="fechado">Fechado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4 flex flex-col justify-center gap-2">
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Status do Lead</span>
            <select 
              value={leadStatusFilter} 
              onChange={e => setLeadStatusFilter(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white px-3 py-1.5 focus:border-amber-500 outline-none w-full cursor-pointer"
            >
              <option value="all">Todos</option>
              <option value="qualificado">Qualificado</option>
              <option value="nao-qualificado">Não Qualificado</option>
            </select>
          </div>
        </div>

        {/* Mobile Header Compacto: Contador + Botão Redondo de Filtros */}
        <div className="md:hidden flex items-center justify-between bg-neutral-800/40 border border-neutral-700/50 rounded-xl px-4 py-2.5 mb-4 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider leading-none mb-1">
                {activeTab === 'propostas' ? 'Propostas' : 'Clientes'}
              </span>
              <span className="text-lg font-heading font-extrabold text-white leading-none">
                {filteredClients.length}
              </span>
            </div>
          </div>

          {/* Botão Redondo de Filtros no Mobile */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="relative w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 active:scale-95 hover:border-amber-500/80 text-neutral-300 hover:text-amber-500 flex items-center justify-center shadow-md transition-all cursor-pointer shrink-0"
            title="Filtrar"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {(dateFilter !== 'all' || salesStatusFilter !== 'all' || leadStatusFilter !== 'all') && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-neutral-900 flex items-center justify-center text-[7px] font-black text-black">
                •
              </span>
            )}
          </button>
        </div>

        {/* Modal de Filtros Mobile */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
            <div className="w-full sm:max-w-md bg-neutral-900 border border-neutral-800 rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2 text-white font-bold text-base">
                  <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                  <span>Filtros da Lista</span>
                </div>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Período */}
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Período</label>
                <select 
                  value={dateFilter} 
                  onChange={e => setDateFilter(e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white px-3 py-2.5 focus:border-amber-500 outline-none w-full cursor-pointer"
                >
                  <option value="all">Todo o período</option>
                  <option value="hoje">Hoje</option>
                  <option value="7d">Últimos 7 dias</option>
                  <option value="30d">Últimos 30 dias</option>
                </select>
              </div>

              {/* Status da Venda */}
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Status da Venda</label>
                <select 
                  value={salesStatusFilter} 
                  onChange={e => setSalesStatusFilter(e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white px-3 py-2.5 focus:border-amber-500 outline-none w-full cursor-pointer"
                >
                  <option value="all">Todos</option>
                  <option value="aguardando">Aguardando Proposta</option>
                  <option value="fechado">Fechado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              {/* Status do Lead */}
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Status do Lead</label>
                <select 
                  value={leadStatusFilter} 
                  onChange={e => setLeadStatusFilter(e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white px-3 py-2.5 focus:border-amber-500 outline-none w-full cursor-pointer"
                >
                  <option value="all">Todos</option>
                  <option value="qualificado">Qualificado</option>
                  <option value="nao-qualificado">Não Qualificado</option>
                </select>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2 pt-2">
                {(dateFilter !== 'all' || salesStatusFilter !== 'all' || leadStatusFilter !== 'all') && (
                  <button 
                    type="button"
                    onClick={() => {
                      setDateFilter('all');
                      setSalesStatusFilter('all');
                      setLeadStatusFilter('all');
                    }}
                    className="flex-1 py-3 bg-neutral-800 text-neutral-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider border border-neutral-700 cursor-pointer"
                  >
                    Limpar Filtros
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 bg-amber-500 text-neutral-900 hover:bg-amber-400 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Ver Resultados ({filteredClients.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredClients.length === 0 ? (
          <div className="bg-neutral-800/30 border border-neutral-700/50 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-neutral-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              {activeTab === 'propostas' ? 'Nenhuma apresentação encontrada.' : 'Nenhum cliente ativado ainda.'}
            </h3>
            <p className="text-neutral-400 text-sm max-w-md">
              {activeTab === 'propostas' ? 'As apresentações que você salvar aparecerão aqui.' : 'As empresas que forem ativadas no painel aparecerão aqui para a sua gestão.'}
            </p>
          </div>
        ) : (
          <div className="bg-neutral-800/30 border border-neutral-700/50 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-neutral-700/50 flex items-center bg-neutral-800/50">
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Buscar por cliente ou empresa..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-amber-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="overflow-x-auto hidden md:block">
              {activeTab === 'propostas' ? (
                <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-neutral-900/50 border-b border-neutral-700/50 text-[10px] uppercase tracking-wider text-neutral-400">
                    <th className="p-4 font-bold">Cliente / Empresa</th>
                    <th className="p-4 font-bold">Contrato</th>
                    <th className="p-4 font-bold">Data de Início</th>
                    <th className="p-4 font-bold">Status da Venda</th>
                    <th className="p-4 font-bold">Status Lead</th>
                    <th className="p-4 font-bold">Status Atual (IDE)</th>
                    <th className="p-4 font-bold text-center w-16">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map(c => {
                    let ide = c.fullData?.diagnosticData?.ideDependency || 100;
                    if (c.cloudData?.monthly_snapshots?.length > 0) {
                      const latestSnapshot = c.cloudData.monthly_snapshots[c.cloudData.monthly_snapshots.length - 1];
                      if (latestSnapshot.metrics && latestSnapshot.metrics.provisionalIde != null) {
                        ide = latestSnapshot.metrics.provisionalIde;
                      }
                    }
                    
                    const date = c.fullData?.contractData?.startDate || c.updatedAt;
                    const salesStatus = c.fullData?.diagnosticData?.salesStatus || 'aguardando';
                    const leadStatus = c.fullData?.diagnosticData?.leadStatus || 'qualificado';
                    
                    return (
                      <tr key={c.presentationSessionId} className="border-b border-neutral-800 hover:bg-white/[0.02] transition-colors group">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">{c.name}</span>
                            <span className="text-xs text-neutral-500 mb-1">{c.company || 'Empresa não informada'}</span>
                            <span className="text-[10px] text-amber-500/80 mb-2 font-mono">
                              Consultor: {c.fullData?.contractData?.consultant || 'Não informado'}
                            </span>
                            <div className="flex flex-col gap-1.5 mt-1">
                              {activeTab === 'diagnosticos' && c.fullData?.diagnosticData?.currentDiagnosticId ? (
                                <Link 
                                  to={`/diagnostico/${c.fullData.diagnosticData.currentDiagnosticId}`}
                                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded text-[10px] font-bold uppercase tracking-wider transition-colors w-fit"
                                >
                                  Acessar Mapa 360 <ExternalLink className="w-3 h-3" />
                                </Link>
                              ) : (
                                <a 
                                  href={`/?session=${c.presentationSessionId}&view=dashboard`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded text-[10px] font-bold uppercase tracking-wider transition-colors w-fit"
                                >
                                  Acessar Painel <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              <a 
                                href={`/?session=${c.presentationSessionId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[10px] font-bold uppercase tracking-wider transition-colors w-fit"
                              >
                                Voltar à Apresentação <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-top pt-5">
                          {(() => {
                            const isGenerated = c.fullData?.contractData?.contractGenerated === true;
                            return (
                              <div className="flex flex-col gap-1">
                                {isGenerated ? (
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      handleClientContractDownload(
                                        c.fullData,
                                        window.confirm,
                                        window.alert,
                                        { downloadContractFromSnapshot, validateContractData, downloadContract }
                                      );
                                    }}
                                    className="inline-flex items-center gap-2 text-neutral-300 hover:text-amber-500 text-sm font-medium transition-colors cursor-pointer bg-transparent border-none p-0"
                                    title="Baixar contrato gerado"
                                  >
                                    <FileText className="w-4 h-4" /> BAIXAR CONTRATO (.DOC)
                                  </button>
                                ) : (
                                  <div className="inline-flex items-center gap-2 text-neutral-500 text-sm font-medium cursor-not-allowed" title="Contrato não gerado">
                                    <FileText className="w-4 h-4" /> BAIXAR CONTRATO (.DOC)
                                  </div>
                                )}
                                <span className={`text-[10px] uppercase font-bold tracking-wider ${isGenerated ? 'text-emerald-500' : 'text-neutral-500'}`}>
                                  {isGenerated ? '(gerado)' : '(não gerado)'}
                                </span>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="p-4 align-top pt-5">
                          <div className="flex items-center gap-2 text-neutral-400 text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(date).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="p-4 align-top pt-5">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            salesStatus === 'fechado' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                            salesStatus === 'cancelado' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                            'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}>
                            {salesStatus === 'aguardando' ? 'Aguardando Proposta' : salesStatus}
                          </span>
                        </td>
                        <td className="p-4 align-top pt-5">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            leadStatus === 'qualificado' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                            'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20'
                          }`}>
                            {leadStatus.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="p-4 align-top pt-5">
                          <div className="flex items-center gap-2">
                            <div className="w-full max-w-[100px] h-2 bg-neutral-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-red-500 rounded-full" 
                                style={{ width: `${ide}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-neutral-300">{ide}%</span>
                          </div>
                        </td>
                        <td className="p-4 align-top pt-5 text-center">
                          <div className="relative dropdown-container flex justify-center">
                            <button 
                              onClick={() => setOpenDropdownId(openDropdownId === c.presentationSessionId ? null : c.presentationSessionId)}
                              className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-white transition-colors cursor-pointer"
                              title="Ações"
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                            
                            {openDropdownId === c.presentationSessionId && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-neutral-900 border border-neutral-700/80 rounded-xl shadow-2xl z-50 flex flex-col p-1.5 overflow-hidden animate-fade-in">
                                <button
                                  onClick={() => {
                                    setSelectedClient(c);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-[11px] font-bold text-white hover:bg-neutral-800 rounded-lg transition-colors uppercase tracking-wider flex items-center gap-2"
                                >
                                  Ver Detalhes <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                                </button>
                                
                                {c.fullData?.diagnosticData?.currentDiagnosticId ? (
                                  <Link 
                                    to={`/diagnostico/${c.fullData.diagnosticData.currentDiagnosticId}`}
                                    className="w-full text-left px-3 py-2 text-[11px] font-bold text-amber-500 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2 uppercase tracking-wider"
                                  >
                                    Acessar Mapa 360 <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                                  </Link>
                                ) : (
                                  <button
                                    onClick={() => {
                                      handleStartDiagnostic(c);
                                      setOpenDropdownId(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-[11px] font-bold text-emerald-500 hover:bg-neutral-800 rounded-lg transition-colors uppercase tracking-wider flex items-center gap-2"
                                  >
                                    Ativar Mapa 360 <CheckCircle className="w-3 h-3 ml-auto opacity-50" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-neutral-900/50 border-b border-neutral-700/50 text-[10px] uppercase tracking-wider text-neutral-400">
                    <th className="p-4 font-bold">Cliente / Empresa</th>
                    <th className="p-4 font-bold">Agendamento</th>
                    <th className="p-4 font-bold">Contrato</th>
                    <th className="p-4 font-bold">Status da Venda</th>
                    <th className="p-4 font-bold text-center w-32">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map(c => {
                    const personType = c.fullData?.contractData?.personType || 'PF';
                    const kickoffDate = c.fullData?.diagnosticData?.kickoffDate || c.fullData?.contractData?.startDate || c.updatedAt;
                    const kickoffTime = c.fullData?.diagnosticData?.kickoffTime || '--:--';
                    const salesStatus = c.fullData?.diagnosticData?.salesStatus || 'aguardando';
                    const isGenerated = c.fullData?.contractData?.contractGenerated === true;

                    return (
                      <tr key={c.presentationSessionId} className="border-b border-neutral-800 hover:bg-white/[0.02] transition-colors group">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">{c.name}</span>
                            <span className="text-xs text-neutral-500 mb-1">{c.company || 'Empresa não informada'}</span>
                            <span className="text-[10px] text-amber-500/80 mb-2 font-mono">
                              Consultor: {c.fullData?.contractData?.consultant || 'Não informado'}
                            </span>
                            <div className="flex flex-col gap-1.5 mt-1">
                              {activeTab === 'diagnosticos' && c.fullData?.diagnosticData?.currentDiagnosticId ? (
                                <Link 
                                  to={`/diagnostico/${c.fullData.diagnosticData.currentDiagnosticId}`}
                                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded text-[10px] font-bold uppercase tracking-wider transition-colors w-fit"
                                >
                                  Acessar Mapa 360 <ExternalLink className="w-3 h-3" />
                                </Link>
                              ) : (
                                <a 
                                  href={`/?session=${c.presentationSessionId}&view=dashboard`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded text-[10px] font-bold uppercase tracking-wider transition-colors w-fit"
                                >
                                  Acessar Painel <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-top pt-5">
                          <div className="flex flex-col gap-1 text-neutral-300 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-neutral-500" />
                              {new Date(kickoffDate).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                              <Clock className="w-4 h-4" />
                              {kickoffTime}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-top pt-5">
                          <div className="flex flex-col gap-1">
                            {isGenerated ? (
                              <button 
                                type="button"
                                onClick={() => {
                                  handleClientContractDownload(
                                    c.fullData,
                                    window.confirm,
                                    window.alert,
                                    { downloadContractFromSnapshot, validateContractData, downloadContract }
                                  );
                                }}
                                className="inline-flex items-center gap-2 text-neutral-300 hover:text-amber-500 text-sm font-medium transition-colors cursor-pointer bg-transparent border-none p-0"
                                title="Baixar contrato gerado"
                              >
                                <FileText className="w-4 h-4" /> BAIXAR CONTRATO
                              </button>
                            ) : (
                              <div className="inline-flex items-center gap-2 text-neutral-500 text-sm font-medium cursor-not-allowed" title="Contrato não gerado">
                                <FileText className="w-4 h-4" /> BAIXAR CONTRATO
                              </div>
                            )}
                            <span className={`text-[10px] uppercase font-bold tracking-wider ${isGenerated ? 'text-emerald-500' : 'text-neutral-500'}`}>
                              {isGenerated ? '(gerado)' : '(não gerado)'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 align-top pt-5">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            salesStatus === 'fechado' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                            salesStatus === 'cancelado' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                            'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}>
                            {salesStatus === 'aguardando' ? 'Aguardando Proposta' : salesStatus}
                          </span>
                        </td>
                        <td className="p-4 text-center align-top pt-5">
                          <div className="relative dropdown-container flex justify-center">
                            <button 
                              onClick={() => setOpenDropdownId(openDropdownId === c.presentationSessionId ? null : c.presentationSessionId)}
                              className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-white transition-colors cursor-pointer"
                              title="Ações"
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                            
                            {openDropdownId === c.presentationSessionId && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-neutral-900 border border-neutral-700/80 rounded-xl shadow-2xl z-50 flex flex-col p-1.5 overflow-hidden animate-fade-in">
                                {activeTab === 'diagnosticos' && c.fullData?.diagnosticData?.currentDiagnosticId ? (
                                  <Link 
                                    to={`/diagnostico/${c.fullData.diagnosticData.currentDiagnosticId}`}
                                    className="w-full text-left px-3 py-2 text-[11px] font-bold text-amber-500 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2 uppercase tracking-wider"
                                  >
                                    Acessar Mapa 360 <ExternalLink className="w-3 h-3" />
                                  </Link>
                                ) : (
                                  <a 
                                    href={`/?session=${c.presentationSessionId}&view=dashboard`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full text-left px-3 py-2 text-[11px] font-bold text-amber-500 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2 uppercase tracking-wider"
                                  >
                                    Acessar Painel <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                                <div className="h-px w-full bg-neutral-800 my-1" />
                                <button
                                  onClick={() => {
                                    setSelectedClient(c);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-[11px] font-bold text-white hover:bg-neutral-800 rounded-lg transition-colors uppercase tracking-wider flex items-center gap-2"
                                >
                                  <FileText className="w-3 h-3 text-neutral-400" /> Dados do Cliente
                                </button>
                                <div className="h-px w-full bg-neutral-800 my-1" />
                                {c.fullData?.diagnosticData?.currentDiagnosticId ? (
                                  <Link
                                    to={`/admin/diagnostico/${c.fullData.diagnosticData.currentDiagnosticId}/resultados`}
                                    className="w-full text-left px-3 py-2 text-[11px] font-bold text-blue-400 hover:bg-neutral-800 rounded-lg transition-colors uppercase tracking-wider flex items-center gap-2"
                                  >
                                    <FileText className="w-3 h-3" /> Ver Resultados
                                  </Link>
                                ) : (
                                  <button
                                    onClick={() => {
                                      handleStartDiagnostic(c);
                                      setOpenDropdownId(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-[11px] font-bold text-emerald-500 hover:bg-neutral-800 rounded-lg transition-colors uppercase tracking-wider flex items-center gap-2"
                                  >
                                    <PlayCircle className="w-3 h-3" /> Iniciar Mapa 360
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              )}
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden flex flex-col divide-y divide-neutral-800/80 p-3 sm:p-4 gap-3.5">
              {filteredClients.map(c => {
                let ide = c.fullData?.diagnosticData?.ideDependency || 100;
                if (c.cloudData?.monthly_snapshots?.length > 0) {
                  const latestSnapshot = c.cloudData.monthly_snapshots[c.cloudData.monthly_snapshots.length - 1];
                  if (latestSnapshot.metrics && latestSnapshot.metrics.provisionalIde != null) {
                    ide = latestSnapshot.metrics.provisionalIde;
                  }
                }
                
                const date = activeTab === 'propostas' 
                  ? (c.fullData?.contractData?.startDate || c.updatedAt)
                  : (c.fullData?.diagnosticData?.kickoffDate || c.fullData?.contractData?.startDate || c.updatedAt);
                const kickoffTime = c.fullData?.diagnosticData?.kickoffTime || '--:--';
                const salesStatus = c.fullData?.diagnosticData?.salesStatus || 'aguardando';
                const leadStatus = c.fullData?.diagnosticData?.leadStatus || 'qualificado';
                const isGenerated = c.fullData?.contractData?.contractGenerated === true;

                return (
                  <div key={c.presentationSessionId} className="pt-3.5 first:pt-0 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-white text-base leading-snug">{c.name}</h3>
                        <p className="text-xs text-neutral-400">{c.company || 'Empresa não informada'}</p>
                        <span className="text-[10px] text-amber-500/90 font-mono block mt-0.5">
                          Consultor: {c.fullData?.contractData?.consultant || 'Não informado'}
                        </span>
                      </div>

                      {/* Dropdown Menu */}
                      <div className="relative dropdown-container shrink-0">
                        <button 
                          onClick={() => setOpenDropdownId(openDropdownId === c.presentationSessionId ? null : c.presentationSessionId)}
                          className="p-1.5 bg-neutral-800/80 hover:bg-neutral-700 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          title="Ações"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        
                        {openDropdownId === c.presentationSessionId && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-neutral-900 border border-neutral-700/90 rounded-xl shadow-2xl z-50 flex flex-col p-1.5 overflow-hidden animate-fade-in">
                            <button
                              onClick={() => {
                                setSelectedClient(c);
                                setOpenDropdownId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-bold text-white hover:bg-neutral-800 rounded-lg transition-colors uppercase tracking-wider flex items-center justify-between"
                            >
                              <span>Ver Detalhes</span>
                              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                            </button>
                            
                            {activeTab === 'propostas' ? (
                              c.fullData?.diagnosticData?.currentDiagnosticId ? (
                                <Link 
                                  to={`/diagnostico/${c.fullData.diagnosticData.currentDiagnosticId}`}
                                  className="w-full text-left px-3 py-2 text-xs font-bold text-amber-500 hover:bg-neutral-800 rounded-lg transition-colors flex items-center justify-between uppercase tracking-wider"
                                >
                                  <span>Acessar Mapa 360</span>
                                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                                </Link>
                              ) : (
                                <button
                                  onClick={() => {
                                    handleStartDiagnostic(c);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-bold text-emerald-500 hover:bg-neutral-800 rounded-lg transition-colors uppercase tracking-wider flex items-center justify-between"
                                >
                                  <span>Ativar Mapa 360</span>
                                  <CheckCircle className="w-3.5 h-3.5 opacity-60" />
                                </button>
                              )
                            ) : (
                              <>
                                {c.fullData?.diagnosticData?.currentDiagnosticId && (
                                  <Link
                                    to={`/admin/diagnostico/${c.fullData.diagnosticData.currentDiagnosticId}/resultados`}
                                    className="w-full text-left px-3 py-2 text-xs font-bold text-blue-400 hover:bg-neutral-800 rounded-lg transition-colors uppercase tracking-wider flex items-center justify-between"
                                  >
                                    <span>Ver Resultados</span>
                                    <FileText className="w-3.5 h-3.5 opacity-60" />
                                  </Link>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status badges row */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        salesStatus === 'fechado' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        salesStatus === 'cancelado' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {salesStatus === 'aguardando' ? 'Aguardando Proposta' : salesStatus}
                      </span>
                      
                      {activeTab === 'propostas' && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          leadStatus === 'qualificado' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                          'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20'
                        }`}>
                          {leadStatus.replace('-', ' ')}
                        </span>
                      )}

                      <div className="flex items-center gap-1 text-neutral-400 text-[11px] ml-auto">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(date).toLocaleDateString('pt-BR')}</span>
                        {activeTab !== 'propostas' && kickoffTime !== '--:--' && (
                          <span className="text-neutral-500 font-mono">({kickoffTime})</span>
                        )}
                      </div>
                    </div>

                    {/* IDE status bar for propostas */}
                    {activeTab === 'propostas' && (
                      <div className="flex items-center justify-between gap-3 bg-neutral-900/50 p-2 rounded-lg border border-neutral-800 text-xs">
                        <span className="text-neutral-400 text-[11px]">Dependência (IDE):</span>
                        <div className="flex items-center gap-2 flex-1 max-w-[140px]">
                          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${ide}%` }} />
                          </div>
                          <span className="font-bold text-neutral-300 text-[11px]">{ide}%</span>
                        </div>
                      </div>
                    )}

                    {/* Contract Box */}
                    <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-neutral-500 block text-[9px] uppercase font-bold">Investimento</span>
                        <span className="text-white font-mono font-bold text-xs">
                          {c.fullData?.contractData?.totalInvestment || 'Não definido'}
                        </span>
                      </div>
                      <div>
                        {isGenerated ? (
                          <button 
                            type="button"
                            onClick={() => {
                              handleClientContractDownload(
                                c.fullData,
                                window.confirm,
                                window.alert,
                                { downloadContractFromSnapshot, validateContractData, downloadContract }
                              );
                            }}
                            className="inline-flex items-center gap-1.5 text-[11px] text-amber-500 font-bold bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" /> BAIXAR DOC
                          </button>
                        ) : (
                          <span className="text-[10px] text-neutral-500 uppercase font-bold">Sem Contrato</span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      {activeTab === 'diagnosticos' && c.fullData?.diagnosticData?.currentDiagnosticId ? (
                        <Link 
                          to={`/diagnostico/${c.fullData.diagnosticData.currentDiagnosticId}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-center"
                        >
                          Acessar Mapa 360 <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <a 
                          href={`/?session=${c.presentationSessionId}&view=dashboard`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-center"
                        >
                          Painel <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      {activeTab === 'propostas' && (
                        <a 
                          href={`/?session=${c.presentationSessionId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-center"
                        >
                          Apresentação <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <button
                        onClick={() => setSelectedClient(c)}
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-center"
                      >
                        Detalhes
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
          </>
        )}
      </main>

      {/* Modal de Detalhes */}
      {selectedClient && (
        <ClientDetailsModal 
          client={selectedClient} 
          onClose={() => setSelectedClient(null)}
          onUpdate={(updatedData) => {
            // Re-fetch to update list locally
            const list = PresentationGovernanceDraftRepository.list();
            const arr = Object.values(list)
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
              .map(item => {
                const fullData = PresentationGovernanceDraftRepository.findBySessionId(item.presentationSessionId);
                return {
                  ...item,
                  fullData
                };
              })
              .filter(c => c.status !== 'archived');
            setClients(arr);
            setSelectedClient(arr.find(c => c.presentationSessionId === updatedData.presentationSessionId));
          }}
          onDelete={() => handleDeleteClient(selectedClient.presentationSessionId)}
          onActivate={() => handleActivateClient(selectedClient.presentationSessionId)}
          onActivatePPE={() => handleActivateClientPPE(selectedClient.presentationSessionId)}
        />
      )}
    </div>
  );
}
