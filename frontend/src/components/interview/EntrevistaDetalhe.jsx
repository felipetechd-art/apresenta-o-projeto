import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  FileDown,
  Trash2,
  AlertTriangle,
  History,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { InterviewRepository } from '../../repositories/InterviewRepository';
import {
  INTERVIEW_BLOCKS,
  INTERVIEW_STATUS,
  STATUS_LABELS,
  getPendingInfo,
} from '../../domain/interview/interviewSchema';
import { buildRanking } from '../../domain/interview/priorityEngine';
import { buildClientPriorities, countByClassification } from '../../domain/interview/interviewAnalysis';
import { CandidatesPanel } from './CandidatesPanel';
import { RankingPanel } from './RankingPanel';
import { SummaryConfirmation } from './SummaryConfirmation';
import { PDFExportOverlay } from './EntrevistaPDF';
import { AccessDenied } from './AccessDenied';
import { useInterviewAccess } from './useInterviewAccess';

const SECTIONS = [
  { id: 'respostas', label: 'Respostas e contextos' },
  { id: 'entendimento', label: 'Entendimento e confirmação' },
  { id: 'problemas', label: 'Problemas e oportunidades' },
  { id: 'prioridades', label: 'Prioridades' },
  { id: 'pendencias', label: 'Pendências e histórico' },
];

const statusChip = {
  [INTERVIEW_STATUS.DRAFT]: 'bg-neutral-700/40 text-neutral-300 border-neutral-600',
  [INTERVIEW_STATUS.ANALYSIS]: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  [INTERVIEW_STATUS.WAITING]: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  [INTERVIEW_STATUS.CHANGES]: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
  [INTERVIEW_STATUS.CONFIRMED]: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
};

function AnswerBlock({ block, interview }) {
  return (
    <div className="mb-8">
      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-3">{block.title}</p>
      {block.questions.map((question) => {
        const rows = question.fields
          .filter((field) => !field.consultantOnly)
          .map((field) => ({
            field,
            value: interview.answers?.[field.id],
            context: interview.contexts?.[field.id],
            flag: interview.contextFlags?.[field.id],
          }))
          .filter((row) => row.value !== undefined && row.value !== '' && row.value !== null && row.value !== false && !(Array.isArray(row.value) && row.value.length === 0));

        const consultantRows = question.fields
          .filter((field) => field.consultantOnly)
          .map((field) => ({
            field,
            value: interview.answers?.[field.id],
            context: interview.contexts?.[field.id],
            flag: interview.contextFlags?.[field.id],
          }))
          .filter((row) => row.value !== undefined && row.value !== '' && row.value !== null);

        if (rows.length === 0 && consultantRows.length === 0) return null;

        return (
          <div key={question.id} className="border border-neutral-700/60 rounded-xl p-4 mb-3 bg-neutral-900/40">
            <p className="text-sm font-bold text-white">
              <span className="text-amber-500 mr-1.5">{question.number}.</span>
              {question.title}
            </p>
            <p className="text-[11px] text-neutral-500 italic mt-0.5">Por que perguntamos: {question.why}</p>

            {[...rows, ...consultantRows].map((row, index) => (
              <div key={`${row.field.id}-${index}`} className="mt-3 pl-3 border-l-2 border-neutral-800">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                  {row.field.label}
                  {row.field.consultantOnly && (
                    <span className="text-amber-500/70 ml-1 normal-case tracking-normal">(consultor)</span>
                  )}
                </p>
                <p className="text-sm text-neutral-200 whitespace-pre-wrap mt-0.5">{formatRow(row)}</p>
                {row.context && (
                  <div
                    className={`mt-1.5 text-xs leading-relaxed rounded-lg px-3 py-2 border ${
                      row.flag
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        : 'bg-neutral-800/60 border-neutral-700 text-neutral-500'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider font-bold block mb-0.5">
                      Contexto {row.flag ? '' : '(registrado, oculto na marcação)'}
                    </span>
                    {row.context}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function formatRow(row) {
  const { field, value } = row;
  if (value === undefined || value === null || value === '') return 'Não informado';
  if (Array.isArray(value)) {
    if (field.type === 'list') {
      return value
        .map((item, i) =>
          (field.itemFields || [])
            .map((f) => (item[f.id] ? `${f.label}: ${item[f.id]}` : null))
            .filter(Boolean)
            .join(' | ')
            .replace(/^/, `${i + 1}. `)
        )
        .filter(Boolean)
        .join('\n');
    }
    if (field.options) {
      return value.map((v) => field.options.find((o) => o.value === v)?.label || v).join('; ');
    }
    return value.join('; ');
  }
  if (field.options) {
    const option = field.options.find((o) => o.value === value);
    return option ? option.label : String(value);
  }
  return String(value);
}

export default function EntrevistaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { denied } = useInterviewAccess();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [section, setSection] = useState('respostas');
  const [showPDF, setShowPDF] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await InterviewRepository.getById(id);
      if (!data) setError('Entrevista não encontrada ou acesso não autorizado.');
      else setInterview(data);
    } catch (e) {
      console.error(e);
      setError('Não foi possível carregar a entrevista.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const persist = async (next, detail, action) => {
    const componentLogged =
      Array.isArray(next.history) &&
      Array.isArray(interview.history) &&
      next.history !== interview.history &&
      next.history.length > interview.history.length;

    const record = {
      ...next,
      pendingInfo: getPendingInfo(next),
      history: componentLogged
        ? next.history.slice(0, 300)
        : [
            {
              at: new Date().toISOString(),
              by: user?.email || 'consultor',
              action: action || 'atualizacao',
              detail: detail || 'Atualização registrada.',
            },
            ...(next.history || []),
          ].slice(0, 300),
    };
    const saved = await InterviewRepository.save(record);
    setInterview(saved);
    return saved;
  };

  const ranking = useMemo(() => (interview ? buildRanking(interview) : null), [interview]);
  const pending = useMemo(() => (interview ? getPendingInfo(interview) : []), [interview]);
  const priorities = useMemo(
    () => (interview && ranking ? buildClientPriorities(interview, ranking) : []),
    [interview, ranking]
  );
  const classifications = useMemo(
    () => (interview ? countByClassification(interview) : {}),
    [interview]
  );

  if (denied) {
    return <AccessDenied />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-neutral-500 text-sm">
        Carregando entrevista…
      </div>
    );
  }

  if (!interview || !ranking) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-neutral-400 text-sm">{error || 'Entrevista não encontrada.'}</p>
        <Link
          to="/admin"
          className="px-5 py-2.5 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl"
        >
          <span className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar ao painel
          </span>
        </Link>
      </div>
    );
  }

  const changeStatus = (status, detail, base) => {
    const next = { ...(base || interview), status };
    return persist(next, detail, 'mudanca_status');
  };

  return (
    <div className="min-h-screen bg-neutral-900 font-sans selection:bg-amber-500/30">
      <header className="bg-neutral-800/50 backdrop-blur-xl border-b border-neutral-700/50 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/admin"
              className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-neutral-300 shrink-0"
              title="Voltar ao painel"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {interview.answers?.q1_empresaNome || 'Entrevista'}
              </p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider truncate">
                {interview.answers?.q1_entrevistadoNome || '—'} · {interview.consultantEmail || '—'} ·{' '}
                {new Date(interview.updatedAt || interview.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`hidden sm:inline-flex px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${
                statusChip[interview.status]
              }`}
            >
              {STATUS_LABELS[interview.status]}
            </span>
            <button
              onClick={() => navigate(`/admin/entrevistas/${interview.id}/editar`)}
              className="flex items-center gap-2 px-3 py-2 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              <Pencil className="w-4 h-4" />
              <span className="hidden sm:inline">Editar</span>
            </button>
            <button
              onClick={() => setShowPDF(true)}
              className="flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              <FileDown className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={async () => {
                if (!window.confirm('Excluir definitivamente esta entrevista?')) return;
                await InterviewRepository.delete(interview.id);
                navigate('/admin');
              }}
              className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:border-red-500/50 text-neutral-400 hover:text-red-400 transition-colors"
              title="Excluir entrevista"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {interview.status === INTERVIEW_STATUS.DRAFT && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-800/40 border border-neutral-700/50 rounded-xl px-4 py-3">
            <p className="text-xs text-neutral-400">
              Entrevista em preenchimento. Conclua o formulário para iniciar a análise.
            </p>
            <button
              onClick={() => changeStatus(INTERVIEW_STATUS.ANALYSIS, 'Preenchimento concluído.')}
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shrink-0"
            >
              Enviar para análise
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              Prioridades elegíveis
            </span>
            <span className="block text-2xl font-heading font-extrabold text-white mt-1">
              {ranking.top.length}
            </span>
          </div>
          <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              Candidatos
            </span>
            <span className="block text-2xl font-heading font-extrabold text-white mt-1">
              {(interview.candidates || []).length}
            </span>
          </div>
          <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              Pendências
            </span>
            <span className="block text-2xl font-heading font-extrabold text-orange-400 mt-1">
              {pending.length}
            </span>
          </div>
          <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              Entendimento
            </span>
            <span className="block text-sm font-heading font-extrabold text-emerald-400 mt-1.5">
              {interview.confirmation?.confirmedAt
                ? `Confirmado em ${new Date(interview.confirmation.confirmedAt).toLocaleDateString('pt-BR')}`
                : 'Aguardando'}
            </span>
          </div>
        </div>

        <div className="flex border-b border-neutral-800 overflow-x-auto whitespace-nowrap pb-0.5">
          {SECTIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
                section === item.id
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-neutral-500 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="bg-neutral-800/30 border border-neutral-700/50 rounded-2xl p-4 sm:p-6">
          {section === 'respostas' && (
            <div>
              {INTERVIEW_BLOCKS.map((block) => (
                <AnswerBlock key={block.id} block={block} interview={interview} />
              ))}
            </div>
          )}

          {section === 'entendimento' && (
            <SummaryConfirmation
              interview={interview}
              onChange={(next) =>
                persist(next, 'Entendimento e confirmação atualizados.', 'edicao_entendimento')
              }
              onStatusChange={(status, detail, base) => changeStatus(status, detail, base)}
              canEdit={isAdmin !== false}
            />
          )}

          {section === 'problemas' && (
            <CandidatesPanel interview={interview} onChange={(next) => persist(next, 'Candidatos atualizados.', 'edicao_candidatos')} />
          )}

          {section === 'prioridades' && (
            <RankingPanel
              interview={interview}
              ranking={ranking}
              isAdmin={isAdmin !== false}
              onChange={(next) => persist(next, 'Ranking atualizado.', 'edicao_ranking')}
            />
          )}

          {section === 'pendencias' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-heading font-bold text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-400" /> Informações pendentes
                </h4>
                {pending.length === 0 ? (
                  <p className="text-xs text-neutral-400">Nenhuma pendência registrada.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {pending.map((item) => (
                      <li key={item} className="text-xs text-orange-300 bg-orange-500/5 border border-orange-500/20 rounded-lg px-3 py-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h4 className="text-sm font-heading font-bold text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" /> Problemas por classificação
                </h4>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(classifications).map(([label, count]) => (
                    <span key={label} className="text-xs text-neutral-300">
                      <span className="font-mono font-bold text-amber-400 mr-1.5">{count}</span>
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-heading font-bold text-white mb-3 flex items-center gap-2">
                  <History className="w-4 h-4 text-neutral-400" /> Histórico de alterações
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {(interview.history || []).length === 0 && (
                    <p className="text-xs text-neutral-500">Sem registros.</p>
                  )}
                  {(interview.history || []).map((entry, index) => (
                    <div key={`${entry.at}-${index}`} className="bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-3 py-2">
                      <p className="text-[11px] text-neutral-500 font-mono">
                        {new Date(entry.at).toLocaleString('pt-BR')} · {entry.by}
                      </p>
                      <p className="text-xs text-neutral-300 mt-0.5">{entry.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showPDF && (
        <PDFExportOverlay
          interview={{ ...interview, pendingInfo: pending }}
          ranking={ranking}
          summary={interview.summary}
          priorities={priorities}
          onClose={() => setShowPDF(false)}
        />
      )}
    </div>
  );
}
