import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Copy, 
  Check, 
  ExternalLink, 
  Plus, 
  Search, 
  Trash2, 
  Eye, 
  Share2, 
  Users, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Sparkles,
  MessageCircle,
  FileText
} from 'lucide-react';
import { LucroOcultoRepository } from '../../repositories/LucroOcultoRepository';
import { LucroOcultoReport } from './LucroOcultoReport';
import { Link } from 'react-router-dom';

export function LucroOcultoTab() {
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  const publicLink = `${window.location.origin}/mapa-lucro-oculto`;

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await LucroOcultoRepository.listAll();
      setDiagnostics(list || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá! Segue o link para o seu diagnóstico do Mapa do Lucro Oculto Empresarial:\n\n${publicLink}\n\nPreencha para descobrir onde sua operação pode estar perdendo dinheiro e tempo, e receber o plano de 90 dias.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este diagnóstico?')) {
      await LucroOcultoRepository.delete(id);
      loadData();
    }
  };

  const filtered = diagnostics.filter(d => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (d.empresa && d.empresa.toLowerCase().includes(term)) ||
      (d.empresario && d.empresario.toLowerCase().includes(term)) ||
      (d.email && d.email.toLowerCase().includes(term))
    );
  });

  // Métricas Consolidadas
  const totalCount = diagnostics.length;
  const totalLucroOcultoAno = diagnostics.reduce((acc, curr) => acc + (curr.lucroOcultoTotalAno || 0), 0);
  const mediaIeo = totalCount > 0 
    ? Math.round(diagnostics.reduce((acc, curr) => acc + (curr.ieoTotal || 0), 0) / totalCount)
    : 0;
  const totalHorasRecuperaveis = diagnostics.reduce((acc, curr) => acc + (curr.horasRecuperaveisMes || 0), 0);

  // Se um relatório individual estiver selecionado para visualização completa
  if (selectedReport) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950">
        <LucroOcultoReport 
          report={selectedReport} 
          onBack={() => setSelectedReport(null)} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Banner Principal com Link Público */}
      <div className="bg-gradient-to-r from-amber-500/15 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Link Público do Diagnóstico
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-white">
              Envie o link do Mapa do Lucro Oculto diretamente para o empresário
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              O empresário acessa a página com sua foto e mensagem de boas-vindas, responde aos blocos interativos e recebe o relatório executivo. Todas as respostas e dados de contato são salvos automaticamente aqui.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="flex items-center bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-neutral-300 select-all overflow-hidden max-w-xs">
              <span className="truncate">{publicLink}</span>
            </div>

            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer shrink-0"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer shrink-0"
              title="Compartilhar pelo WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <Link
              to="/mapa-lucro-oculto"
              target="_blank"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-neutral-700 cursor-pointer shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir Diagnóstico</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Cards de Métricas Consolidadas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Diagnósticos Concluídos</span>
          <span className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-1">
            {totalCount}
          </span>
          <span className="text-[10px] text-neutral-500 mt-0.5">Empresas mapeadas</span>
        </div>

        <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Lucro Oculto Identificado</span>
          <span className="text-xl sm:text-2xl font-heading font-extrabold text-amber-400 mt-1">
            {(totalLucroOcultoAno).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] text-neutral-500 mt-0.5">Soma anual estimada</span>
        </div>

        <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Capacidade Recuperável</span>
          <span className="text-xl sm:text-2xl font-heading font-extrabold text-blue-400 mt-1">
            {totalHorasRecuperaveis}h / mês
          </span>
          <span className="text-[10px] text-neutral-500 mt-0.5">Horas manuais mapeadas</span>
        </div>

        <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">IEO Médio</span>
          <span className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-1">
            {mediaIeo} <span className="text-xs font-normal text-neutral-400">/ 100</span>
          </span>
          <span className="text-[10px] text-neutral-500 mt-0.5">Índice de escalabilidade</span>
        </div>
      </div>

      {/* Lista de Diagnósticos Realizados */}
      <div className="bg-neutral-800/30 border border-neutral-700/50 rounded-2xl overflow-hidden flex flex-col">
        
        {/* Barra de Busca */}
        <div className="p-4 border-b border-neutral-700/50 flex items-center justify-between bg-neutral-800/50 gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar por empresa, empresário ou e-mail..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-amber-500 outline-none transition-colors"
            />
          </div>

          <div className="text-xs text-neutral-400 font-mono">
            {filtered.length} registro(s)
          </div>
        </div>

        {/* Tabela */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-500">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white">Nenhum diagnóstico registrado ainda</h4>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
              Compartilhe o link acima com empresários ou preencha um novo diagnóstico para visualizar os relatórios e métricas de Lucro Oculto nesta tela.
            </p>
            <Link
              to="/mapa-lucro-oculto"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider mt-2 shadow-md hover:bg-amber-400 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Realizar Primeiro Diagnóstico</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-neutral-900/50 border-b border-neutral-700/50 text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                  <th className="p-4">Empresa / Empresário</th>
                  <th className="p-4">Faturamento / Mês</th>
                  <th className="p-4 text-amber-400">Lucro Oculto / Mês</th>
                  <th className="p-4 text-blue-400">Capacidade Oculta</th>
                  <th className="p-4">IEO</th>
                  <th className="p-4">Data</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 text-xs">
                {filtered.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-neutral-800/30 transition-colors cursor-pointer group"
                    onClick={() => setSelectedReport(item)}
                  >
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                          {item.empresa || 'Empresa'}
                        </span>
                        <span className="text-xs text-neutral-400 font-medium">{item.empresario || 'Empresário'}</span>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-500 font-mono">
                          {item.whatsapp && <span>{item.whatsapp}</span>}
                          {item.email && <span>• {item.email}</span>}
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-medium text-neutral-200">
                      {(item.faturamentoMensal || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                    </td>

                    <td className="p-4 font-mono font-bold text-amber-400">
                      {(item.lucroOcultoTotalMes || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                      <span className="block text-[10px] text-neutral-500 font-normal">
                        Ano: {(item.lucroOcultoTotalAno || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                      </span>
                    </td>

                    <td className="p-4 font-mono font-bold text-blue-400">
                      {item.horasRecuperaveisMes || 0}h / mês
                      <span className="block text-[10px] text-neutral-500 font-normal">
                        ≈ {item.equivalenteJornadas || 0} jornadas
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-800 border border-neutral-700 text-white font-bold text-xs font-mono">
                        <span>{item.ieoTotal || 0}</span>
                        <span className="text-[9px] text-neutral-500">/ 100</span>
                      </div>
                      <span className="block text-[9px] text-neutral-400 mt-1">
                        {item.ieoClassificacao}
                      </span>
                    </td>

                    <td className="p-4 text-neutral-400 font-mono text-[11px]">
                      {item.dataCalculo || (item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : '-')}
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedReport(item)}
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
                          title="Ver Relatório Completo"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Excluir Diagnóstico"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
