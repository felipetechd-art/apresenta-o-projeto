import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, LogOut, ShieldCheck, MoreHorizontal, ExternalLink, FileText, Calendar, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PresentationGovernanceDraftRepository } from '../../repositories/PresentationGovernanceDraftRepository';
import { StorageHelper } from '../../repositories/StorageHelper';
import { FirestoreSyncService } from '../../repositories/FirestoreSyncService';
import ClientDetailsModal from './ClientDetailsModal';
import { downloadContract } from '../../domain/commercial/contractGenerator.js';
import { downloadContractFromSnapshot, validateContractData, handleClientContractDownload } from '../../domain/commercial/contractSnapshot.js';

export default function ClientManagementView() {
  const { signOut, user } = useAuth();
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [salesStatusFilter, setSalesStatusFilter] = useState('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState('propostas'); // 'propostas' or 'clientes'

  const loadClients = () => {
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
  };

  useEffect(() => {
    loadClients();

    const handleStorageChange = (e) => {
      if (e.key === PresentationGovernanceDraftRepository.indexKey || (e.key && e.key.includes('@PGE:presentations:'))) {
        loadClients();
      }
    };

    const handleFocus = () => {
      loadClients();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleDeleteClient = (sessionId) => {
    PresentationGovernanceDraftRepository.update(sessionId, { status: 'archived' });
    setClients(prev => prev.filter(c => c.presentationSessionId !== sessionId));
    setSelectedClient(null);
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

  const filteredClients = clients.filter(c => {
    // Aba filter
    if (activeTab === 'propostas' && c.status === 'active') return false;
    if (activeTab === 'clientes' && c.status !== 'active') return false;

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-light text-white tracking-tight">
            GESTÃO DE <span className="font-semibold text-amber-500">CLIENTES</span>
          </h2>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-900 text-sm font-bold rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
          >
            <Plus className="w-4 h-4" />
            Nova apresentação
          </Link>
        </div>

        <div className="flex items-center gap-6 border-b border-neutral-800 mb-6">
          <button
            onClick={() => setActiveTab('propostas')}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'propostas' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Apresentações & Propostas
          </button>
          <button
            onClick={() => setActiveTab('clientes')}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'clientes' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Clientes Ativados
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              className="bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white px-3 py-1.5 focus:border-amber-500 outline-none w-full"
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
              className="bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white px-3 py-1.5 focus:border-amber-500 outline-none w-full"
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
              className="bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white px-3 py-1.5 focus:border-amber-500 outline-none w-full"
            >
              <option value="all">Todos</option>
              <option value="qualificado">Qualificado</option>
              <option value="nao-qualificado">Não Qualificado</option>
            </select>
          </div>
        </div>

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

            <div className="overflow-x-auto">
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
                    const ide = c.fullData?.diagnosticData?.ideDependency || 100;
                    const date = c.fullData?.contractData?.startDate || c.updatedAt;
                    const salesStatus = c.fullData?.diagnosticData?.salesStatus || 'aguardando';
                    const leadStatus = c.fullData?.diagnosticData?.leadStatus || 'qualificado';
                    
                    return (
                      <tr key={c.presentationSessionId} className="border-b border-neutral-800 hover:bg-white/[0.02] transition-colors group">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">{c.name}</span>
                            <span className="text-xs text-neutral-500 mb-2">{c.company || 'Empresa não informada'}</span>
                            <div className="flex flex-col gap-1.5">
                              <a 
                                href={`/?session=${c.presentationSessionId}&view=dashboard`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded text-[10px] font-bold uppercase tracking-wider transition-colors w-fit"
                              >
                                Acessar Painel <ExternalLink className="w-3 h-3" />
                              </a>
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
                          <button 
                            onClick={() => setSelectedClient(c)}
                            className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-white transition-colors cursor-pointer"
                            title="Ver Mais Detalhes"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
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
                    <th className="p-4 font-bold">Líderes / Acessos</th>
                    <th className="p-4 font-bold">Data de Início</th>
                    <th className="p-4 font-bold text-center w-32">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map(c => {
                    const personType = c.fullData?.contractData?.personType || 'PF';
                    const leaders = c.fullData?.clientInfo?.leaders || [];
                    const clientEmail = c.fullData?.clientInfo?.email || 'Não informado';
                    const date = c.fullData?.contractData?.startDate || c.updatedAt;

                    return (
                      <tr key={c.presentationSessionId} className="border-b border-neutral-800 hover:bg-white/[0.02] transition-colors group">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">{c.name}</span>
                            <span className="text-xs text-neutral-500 mb-2">{c.company || 'Empresa não informada'}</span>
                            <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded text-[10px] font-bold w-fit">{personType}</span>
                          </div>
                        </td>
                        <td className="p-4 align-top pt-5">
                          <div className="flex flex-col gap-3">
                            {personType === 'PJ' && leaders.length > 0 ? (
                              leaders.map((l, i) => (
                                <div key={i} className="flex flex-col">
                                  <span className="text-sm font-bold text-white">{l.name || 'Sem nome'}</span>
                                  <span className="text-xs text-neutral-500">{l.email || 'Sem e-mail'}</span>
                                  {l.collaborators && <span className="text-[10px] text-neutral-600">Colaboradores: {l.collaborators}</span>}
                                </div>
                              ))
                            ) : (
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-white">{c.name}</span>
                                <span className="text-xs text-neutral-500">{clientEmail}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-top pt-5">
                          <div className="flex items-center gap-2 text-neutral-300 text-sm">
                            <Calendar className="w-4 h-4 text-neutral-500" />
                            {new Date(date).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="p-4 text-center align-top pt-5">
                          <a 
                            href={`/?session=${c.presentationSessionId}&view=dashboard`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-900 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-amber-500/10"
                          >
                            Acessar Painel <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              )}
            </div>
          </div>
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
        />
      )}
    </div>
  );
}
