import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  ClipboardList,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { InterviewRepository } from '../../repositories/InterviewRepository';
import {
  INTERVIEW_BLOCKS,
  OPENING_TEXT,
  INTERVIEW_STATUS,
  STATUS_LABELS,
  createEmptyInterview,
  showField,
} from '../../domain/interview/interviewSchema';
import { markNotesForReview } from '../../domain/interview/priorityEngine';
import { FieldRenderer, WhyBadge, GuidanceBadge, BlockProgress } from './InterviewFields';
import { AccessDenied } from './AccessDenied';
import { useInterviewAccess } from './useInterviewAccess';

const btnPrimary =
  'flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
const btnSecondary =
  'flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors';

export default function EntrevistaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { denied } = useInterviewAccess();

  const [interview, setInterview] = useState(null);
  const [activeBlock, setActiveBlock] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState('');

  const loadedIdRef = useRef(null);
  const saveTimer = useRef(null);
  const interviewRef = useRef(null);
  const dirtyRef = useRef(new Set());

  const applyInterview = (updater) => {
    setInterview((prev) => {
      const nextValue = typeof updater === 'function' ? updater(prev) : updater;
      interviewRef.current = nextValue;
      return nextValue;
    });
  };

  const markDirty = (questionId) => {
    dirtyRef.current.add(questionId);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (id) {
          const existing = await InterviewRepository.getById(id);
          if (existing && !cancelled) {
            loadedIdRef.current = existing.id;
            interviewRef.current = existing;
            setInterview(existing);
            setActiveBlock(existing.currentBlock || 1);
          } else if (!cancelled) {
            setError('Entrevista não encontrada.');
          }
        } else if (!cancelled) {
          const fresh = createEmptyInterview({
            consultantEmail: user?.email || '',
            consultantName: user?.displayName || user?.email || '',
          });
          loadedIdRef.current = null;
          interviewRef.current = fresh;
          setInterview(fresh);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setError('Não foi possível carregar a entrevista.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, user]);

  const block = useMemo(
    () => INTERVIEW_BLOCKS.find((b) => b.id === activeBlock) || INTERVIEW_BLOCKS[0],
    [activeBlock]
  );

  const setAnswer = (fieldId, questionId, value) => {
    applyInterview((prev) => {
      const next = { ...prev, answers: { ...prev.answers, [fieldId]: value } };
      if (value === '' || value === null || (Array.isArray(value) && value.length === 0)) {
        delete next.answers[fieldId];
      }
      return next;
    });
    markDirty(questionId);
    scheduleAutosave();
  };

  const setContext = (fieldId, questionId, value) => {
    applyInterview((prev) => ({ ...prev, contexts: { ...prev.contexts, [fieldId]: value } }));
    markDirty(questionId);
    scheduleAutosave();
  };

  const setContextFlag = (fieldId, questionId, enabled) => {
    applyInterview((prev) => ({
      ...prev,
      contextFlags: { ...prev.contextFlags, [fieldId]: enabled },
    }));
    markDirty(questionId);
    scheduleAutosave();
  };

  const scheduleAutosave = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      persist({ silent: true });
    }, 1500);
  };

  const persist = async ({ silent = false, target = null } = {}) => {
    const current = target || interviewRef.current;
    if (!current) return null;
    setSaving(true);
    setError('');
    try {
      let next = { ...current };
      const changed = Array.from(dirtyRef.current);
      let reviewCount = 0;
      if (changed.length > 0) {
        const reviewed = markNotesForReview(next, changed);
        next = reviewed.interview;
        reviewCount = reviewed.count;
      }
      next.consultantEmail = next.consultantEmail || user?.email || '';
      next.consultantName = next.consultantName || user?.displayName || user?.email || '';
      next.currentBlock = activeBlock;
      next.history = [
        {
          at: new Date().toISOString(),
          by: user?.email || 'consultor',
          action: 'atualizacao_preenchimento',
          detail:
            changed.length > 0
              ? `Respostas alteradas em: ${changed.join(', ')}${
                  reviewCount > 0 ? ` — ${reviewCount} candidato(s) marcado(s) para revisão` : ''
                }`
              : 'Rascunho salvo.',
        },
        ...(next.history || []),
      ].slice(0, 300);

      const saved = await InterviewRepository.save(next);
      loadedIdRef.current = saved.id;
      interviewRef.current = saved;
      setInterview(saved);
      dirtyRef.current = new Set();
      setSavedAt(new Date());
      if (!silent && saved.id !== id) navigate(`/admin/entrevistas/${saved.id}/editar`, { replace: true });
      return saved;
    } catch (e) {
      console.error(e);
      setError('Não foi possível salvar. Tente novamente.');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const goToBlock = async (blockId) => {
    await persist({ silent: true, target: { ...(interviewRef.current || {}), currentBlock: blockId } });
    setActiveBlock(blockId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finish = async () => {
    const saved = await persist({
      silent: true,
      target: { ...(interviewRef.current || {}), status: INTERVIEW_STATUS.ANALYSIS, currentBlock: 4 },
    });
    if (saved) navigate(`/admin/entrevistas/${saved.id}`);
  };

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

  if (!interview) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-neutral-400 text-sm">{error || 'Entrevista não encontrada.'}</p>
        <Link to="/admin" className={btnSecondary}>
          <ArrowLeft className="w-4 h-4" /> Voltar ao painel
        </Link>
      </div>
    );
  }

  const blockIndex = INTERVIEW_BLOCKS.findIndex((b) => b.id === activeBlock);

  return (
    <div className="min-h-screen bg-neutral-900 font-sans selection:bg-amber-500/30">
      <header className="bg-neutral-800/50 backdrop-blur-xl border-b border-neutral-700/50 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <ClipboardList className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                Entrevista Inicial — Governo Empresarial
              </p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider truncate">
                {interview.answers?.q1_empresaNome || 'Nova entrevista'} ·{' '}
                {STATUS_LABELS[interview.status]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {savedAt && (
              <span className="hidden sm:flex items-center gap-1.5 text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Salvo {savedAt.toLocaleTimeString('pt-BR')}
              </span>
            )}
            <button onClick={() => persist()} disabled={saving} className={btnSecondary}>
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Salvar rascunho</span>
            </button>
            <Link to="/admin" className={btnSecondary} title="Voltar ao painel">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Painel</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <div className="bg-gradient-to-r from-amber-500/15 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-2xl p-5 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2">
            Abertura da entrevista
          </p>
          <p className="text-sm sm:text-base text-neutral-200 leading-relaxed">{OPENING_TEXT}</p>
          <p className="text-[11px] text-neutral-500 mt-3 leading-relaxed">
            Não solicite dados de clientes finais, credenciais, documentos ou informações
            financeiras sensíveis nesta entrevista.
          </p>
        </div>

        <BlockProgress interview={interview} activeBlock={activeBlock} onSelectBlock={goToBlock} />

        <section className="bg-neutral-800/40 border border-neutral-700/50 rounded-2xl p-5 sm:p-7">
          <div className="mb-6 pb-5 border-b border-neutral-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
              {block.title}
            </span>
            <p className="text-[11px] text-neutral-500 mt-1">
              Perguntas {block.questions[0].number} a {block.questions[block.questions.length - 1].number}
            </p>
          </div>

          <div className="space-y-8">
            {block.questions.map((question) => (
              <article key={question.id} className="scroll-mt-24">
                <div className="flex items-start gap-3 mb-4">
                  <span className="w-7 h-7 shrink-0 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-heading font-extrabold flex items-center justify-center">
                    {question.number}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-heading font-bold text-white leading-snug">
                      {question.title}
                    </h3>
                    <WhyBadge why={question.why} />
                    <GuidanceBadge guidance={question.guidance} />
                  </div>
                </div>

                <div className="sm:pl-10">
                  {question.fields
                    .filter((field) => showField(field, interview.answers || {}))
                    .map((field) => (
                      <FieldRenderer
                        key={field.id}
                        field={field}
                        value={interview.answers?.[field.id]}
                        context={interview.contexts?.[field.id]}
                        contextEnabled={interview.contextFlags?.[field.id]}
                        otherValue={interview.answers?.[`${field.id}_texto`]}
                        onValueChange={(v) => setAnswer(field.id, question.id, v)}
                        onOtherChange={(v) => setAnswer(`${field.id}_texto`, question.id, v)}
                        onContextChange={(v) => setContext(field.id, question.id, v)}
                        onContextEnabledChange={(v) => setContextFlag(field.id, question.id, v)}
                      />
                    ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-10">
          <button
            type="button"
            disabled={blockIndex === 0}
            onClick={() => goToBlock(INTERVIEW_BLOCKS[blockIndex - 1].id)}
            className={btnSecondary}
          >
            <ArrowLeft className="w-4 h-4" /> Bloco anterior
          </button>

          <button type="button" onClick={() => persist()} disabled={saving} className={btnPrimary}>
            <Save className="w-4 h-4" /> {saving ? 'Salvando…' : 'Salvar rascunho'}
          </button>

          {blockIndex < INTERVIEW_BLOCKS.length - 1 ? (
            <button
              type="button"
              onClick={() => goToBlock(INTERVIEW_BLOCKS[blockIndex + 1].id)}
              className={btnPrimary}
            >
              Próximo bloco <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" onClick={finish} disabled={saving} className={btnPrimary}>
              <CheckCircle2 className="w-4 h-4" /> Concluir preenchimento
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
