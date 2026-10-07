import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Plus,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Building2,
  User,
  CalendarDays,
} from 'lucide-react';
import { InterviewRepository } from '../../repositories/InterviewRepository';
import {
  STATUS_LABELS,
  STATUS_ORDER,
  INTERVIEW_STATUS,
  getPendingInfo,
} from '../../domain/interview/interviewSchema';
import { buildRanking } from '../../domain/interview/priorityEngine';
import { countByClassification, textSummary } from '../../domain/interview/interviewAnalysis';
import { AccessDenied } from './AccessDenied';
import { useInterviewAccess } from './useInterviewAccess';

const statusChip = {
  [INTERVIEW_STATUS.DRAFT]: 'bg-neutral-700/40 text-neutral-300 border-neutral-600',
  [INTERVIEW_STATUS.ANALYSIS]: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  [INTERVIEW_STATUS.WAITING]: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  [INTERVIEW_STATUS.CHANGES]: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
  [INTERVIEW_STATUS.CONFIRMED]: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
};

const PERIODS = [
  { value: 'all', label: 'Todo o período' },
  { value: '7', label: 'Últimos 7 dias' },
  { value: '30', label: 'Últimos 30 dias' },
  { value: '90', label: 'Últimos 90 dias' },
];

function normalize(text) {
  return String(text || '')
    .trim()
    .toLowerCase();
}

export function EntrevistasTab() {
  const navigate = useNavigate();
  const { denied } = useInterviewAccess();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [consultantFilter, setConsultantFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [onlyLatestConfirmed, setOnlyLatestConfirmed] = useState(false);
  const [syncError, setSyncError] = useState(false);

  const load = async () => {
    setLoading(true);
    setSyncError(false);
    try {
      const list = await InterviewRepository.listAll();
      setItems(list);
    } catch (e) {
      console.error(e);
      setSyncError(true);
      setItems(InterviewRepository.listLocal());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const enriched = useMemo(() => {
    return items.map((item) => {
      const ranking = buildRanking(item);
      const pending = getPendingInfo(item);
      return {
        ...item,
        ranking,
        pending,
        firstPriority: ranking.approved[0]?.title || '',
        expectedResult: textSummary(item.answers?.q4_mudanca),
      };
    });
  }, [items]);

  const companies = useMemo(() => {
    const set = new Set();
    enriched.forEach((i) => set.add(normalize(i.companyKey || i.answers?.q1_empresaNome)));
    return Array.from(set).filter(Boolean).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [enriched]);

  const consultants = useMemo(() => {
    const set = new Set();
    enriched.forEach((i) => set.add(i.consultantEmail || '—'));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [enriched]);

  const filtered = useMemo(() => {
    let list = enriched;

    if (onlyLatestConfirmed) {
      const byCompany = new Map();
      list.forEach((item) => {
        const key = normalize(item.companyKey || item.answers?.q1_empresaNome) || item.id;
        const current = byCompany.get(key);
        const isDone =
          item.status === INTERVIEW_STATUS.CONFIRMED ||
          item.status === INTERVIEW_STATUS.WAITING ||
          item.status === INTERVIEW_STATUS.CHANGES;
        if (!isDone) return;
        if (!current) {
          byCompany.set(key, item);
          return;
        }
        const a = new Date(current.updatedAt || current.createdAt || 0).getTime();
        const b = new Date(item.updatedAt || item.createdAt || 0).getTime();
        if (b > a) byCompany.set(key, item);
      });
      list = Array.from(byCompany.values());
    }

    if (companyFilter !== 'all') {
      list = list.filter((i) => normalize(i.companyKey || i.answers?.q1_empresaNome) === companyFilter);
    }
    if (consultantFilter !== 'all') {
      list = list.filter((i) => (i.consultantEmail || '—') === consultantFilter);
    }
    if (statusFilter !== 'all') {
      list = list.filter((i) => i.status === statusFilter);
    }
    if (periodFilter !== 'all') {
      const days = Number(periodFilter);
      const limit = Date.now() - days * 24 * 60 * 60 * 1000;
      list = list.filter((i) => new Date(i.updatedAt || i.createdAt || 0).getTime() >= limit);
    }
    if (searchTerm.trim()) {
      const term = normalize(searchTerm);
      list = list.filter((i) =>
        [i.answers?.q1_empresaNome, i.answers?.q1_entrevistadoNome, i.consultantEmail]
          .map(normalize)
          .some((value) => value.includes(term))
      );
    }

    return list;
  }, [enriched, companyFilter, consultantFilter, statusFilter, periodFilter, searchTerm, onlyLatestConfirmed]);

  const stats = useMemo(() => {
    const byStatus = {};
    STATUS_ORDER.forEach((s) => {
      byStatus[s] = 0;
    });
    let pendingCount = 0;
    let confirmed = 0;
    enriched.forEach((item) => {
      byStatus[item.status] = (byStatus[item.status] || 0) + 1;
      if (item.pending.length > 0) pendingCount += 1;
      if (item.status === INTERVIEW_STATUS.CONFIRMED) confirmed += 1;
    });

    const classifications = countByClassification({ candidates: enriched.flatMap((i) => i.candidates || []) });

    return {
      total: enriched.length,
      byStatus,
      distinctCompanies: new Set(enriched.map((i) => normalize(i.companyKey || i.answers?.q1_empresaNome)).filter(Boolean)).size,
      pendingCount,
      confirmed,
      classifications,
    };
  }, [enriched]);

  const kpi = (label, value, hint, accent = 'text-white') => (
    <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4 flex flex-col justify-center">
      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{label}</span>
      <span className={`text-2xl sm:text-3xl font-heading font-extrabold mt-1 ${accent}`}>{value}</span>
      <span className="text-[10px] text-neutral-500 mt-0.5">{hint}</span>
    </div>
  );

  if (denied) {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ClipboardList className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="text-lg font-heading font-bold text-white">
              Entrevista Inicial — Governo Empresarial
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl">
              Entendimento e confirmação com o cliente. O número de entrevistas não representa o
              número de empresas.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Atualizar
          </button>
          <button
            onClick={() => navigate('/admin/entrevistas/nova')}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Nova entrevista
          </button>
        </div>
      </div>

      {syncError && (
        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Não foi possível sincronizar com o servidor. Exibindo o espelho local desta sessão.
        </div>
      )}

      {/* Indicadores */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpi('Total de entrevistas', stats.total, 'Registros no período')}
        {kpi('Rascunho', stats.byStatus[INTERVIEW_STATUS.DRAFT], 'Em preenchimento')}
        {kpi('Empresas distintas', stats.distinctCompanies, 'Nome normalizado', 'text-amber-400')}
        {kpi('Informações pendentes', stats.pendingCount, 'Entrevistas incompletas', 'text-orange-400')}
        {kpi('Entendimento confirmado', stats.confirmed, 'Confirmado pelo cliente', 'text-emerald-400')}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {STATUS_ORDER.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
            className={`text-left px-3 py-2.5 rounded-xl border transition-colors ${
              statusFilter === status
                ? 'border-amber-500/60 bg-amber-500/10'
                : 'border-neutral-700/60 bg-neutral-800/40 hover:border-neutral-600'
            }`}
          >
            <span className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold leading-tight">
              {STATUS_LABELS[status]}
            </span>
            <span className="block text-xl font-heading font-extrabold text-white mt-0.5">
              {stats.byStatus[status] || 0}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          Problemas e oportunidades por classificação
        </span>
        <div className="flex flex-wrap gap-4 mt-3">
          {Object.entries(stats.classifications).map(([label, count]) => (
            <span key={label} className="text-xs text-neutral-300">
              <span className="font-mono font-bold text-amber-400 mr-1.5">{count}</span>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-neutral-800/30 border border-neutral-700/50 rounded-2xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar empresa, entrevistado ou consultor…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 text-white text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none"
            />
          </div>

          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 text-white text-sm rounded-lg px-4 py-2.5 outline-none"
          >
            <option value="all">Todas as empresas</option>
            {companies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={consultantFilter}
            onChange={(e) => setConsultantFilter(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 text-white text-sm rounded-lg px-4 py-2.5 outline-none"
          >
            <option value="all">Todos os consultores</option>
            {consultants.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-1/2 bg-neutral-900 border border-neutral-700 focus:border-amber-500 text-white text-sm rounded-lg px-3 py-2.5 outline-none"
            >
              <option value="all">Todos os status</option>
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="w-1/2 bg-neutral-900 border border-neutral-700 focus:border-amber-500 text-white text-sm rounded-lg px-3 py-2.5 outline-none"
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 mt-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyLatestConfirmed}
            onChange={(e) => setOnlyLatestConfirmed(e.target.checked)}
            className="w-4 h-4 accent-amber-500 rounded"
          />
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-bold">
            Mostrar apenas a entrevista mais recente concluída de cada empresa
          </span>
        </label>
      </div>

      {/* Lista */}
      <div className="bg-neutral-800/30 border border-neutral-700/50 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-500">
              <ClipboardList className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white">Nenhuma entrevista encontrada</h4>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
              Inicie uma entrevista para registrar o entendimento da empresa, os problemas e os
              pontos prioritários.
            </p>
            <Link
              to="/admin/entrevistas/nova"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider mt-1 hover:bg-amber-400 transition-colors"
            >
              <Plus className="w-4 h-4" /> Iniciar entrevista
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead>
                  <tr className="bg-neutral-900/50 border-b border-neutral-700/50 text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                    <th className="p-4">Empresa</th>
                    <th className="p-4">Entrevistado</th>
                    <th className="p-4">Consultor</th>
                    <th className="p-4">Data</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Principal resultado esperado</th>
                    <th className="p-4">Primeiro ponto prioritário</th>
                    <th className="p-4">Pendências</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80 text-xs">
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => navigate(`/admin/entrevistas/${item.id}`)}
                      className="hover:bg-neutral-800/30 transition-colors cursor-pointer group"
                    >
                      <td className="p-4">
                        <span className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-neutral-500" />
                          {item.answers?.q1_empresaNome || '—'}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-300">
                        <span className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-neutral-600" />
                          {item.answers?.q1_entrevistadoNome || '—'}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-400 font-mono text-[11px]">{item.consultantEmail || '—'}</td>
                      <td className="p-4 text-neutral-400 font-mono text-[11px]">
                        <span className="flex items-center gap-2">
                          <CalendarDays className="w-3.5 h-3.5 text-neutral-600" />
                          {new Date(item.updatedAt || item.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${
                            statusChip[item.status] || statusChip[INTERVIEW_STATUS.DRAFT]
                          }`}
                        >
                          {STATUS_LABELS[item.status]}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-300 max-w-[240px]">
                        <span className="line-clamp-2">{item.expectedResult || '—'}</span>
                      </td>
                      <td className="p-4 text-amber-400 max-w-[220px]">
                        <span className="line-clamp-2">{item.firstPriority || '—'}</span>
                      </td>
                      <td className="p-4">
                        {item.pending.length > 0 ? (
                          <span className="inline-flex items-center gap-1.5 text-orange-300">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {item.pending.length}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 0
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden divide-y divide-neutral-800/80">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/admin/entrevistas/${item.id}`)}
                  className="p-4 cursor-pointer active:bg-neutral-800/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm truncate">
                        {item.answers?.q1_empresaNome || '—'}
                      </p>
                      <p className="text-xs text-neutral-400 truncate">
                        {item.answers?.q1_entrevistadoNome || '—'}
                      </p>
                      <p className="text-[10px] text-neutral-500 font-mono mt-1">
                        {new Date(item.updatedAt || item.createdAt).toLocaleDateString('pt-BR')} ·{' '}
                        {item.consultantEmail || '—'}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex px-2 py-1 rounded-md border text-[9px] font-bold uppercase tracking-wider ${
                        statusChip[item.status] || statusChip[INTERVIEW_STATUS.DRAFT]
                      }`}
                    >
                      {STATUS_LABELS[item.status]}
                    </span>
                  </div>
                  {item.firstPriority && (
                    <p className="text-[11px] text-amber-400 mt-2">
                      1º ponto: {item.firstPriority}
                    </p>
                  )}
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Pendências: {item.pending.length}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
