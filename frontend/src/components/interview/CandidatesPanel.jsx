import React, { useMemo, useState } from 'react';
import { Plus, Sparkles, AlertTriangle, Pencil } from 'lucide-react';
import { CLASSIFICATIONS } from '../../domain/interview/interviewSchema';
import { suggestCandidates } from '../../domain/interview/interviewAnalysis';
import { createEmptyNotes, scoreCandidate, eligibility } from '../../domain/interview/priorityEngine';
import { CandidateForm } from './CandidateForm';

function blankCandidate(interview) {
  return {
    id: `cand-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: '',
    description: '',
    understood: '',
    sourceQuestion: '',
    sourceField: '',
    sourceAnswer: '',
    sourceContext: '',
    evidence: '',
    consequence: '',
    relatedOutcome: interview.answers?.q4_mudanca || '',
    whyAttention: '',
    openQuestions: '',
    classification: CLASSIFICATIONS.HYPOTHESIS,
    blocked: false,
    blockAction: '',
    notes: createEmptyNotes(),
    createdAt: new Date().toISOString(),
  };
}

export function CandidatesPanel({ interview, onChange }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);

  const candidates = interview.candidates || [];

  const suggestions = useMemo(() => {
    try {
      return suggestCandidates(interview);
    } catch (e) {
      console.warn(e);
      return [];
    }
  }, [interview]);

  const withHistory = (nextInterview, action, detail) => ({
    ...nextInterview,
    history: [
      { at: new Date().toISOString(), by: interview.consultantEmail || 'consultor', action, detail },
      ...(interview.history || []),
    ].slice(0, 300),
  });

  const updateCandidate = (updated) => {
    onChange(
      withHistory(
        { ...interview, candidates: candidates.map((c) => (c.id === updated.id ? updated : c)) },
        'edicao_candidato',
        `Candidato atualizado: ${updated.title || '(sem título)'}`
      )
    );
  };

  const addCandidate = (candidate) => {
    onChange(
      withHistory(
        { ...interview, candidates: [...candidates, candidate] },
        'novo_candidato',
        `Candidato criado: ${candidate.title || '(sem título)'}`
      )
    );
  };

  const removeCandidate = (id) => {
    if (!window.confirm('Excluir este candidato?')) return;
    const target = candidates.find((c) => c.id === id);
    onChange(
      withHistory(
        {
          ...interview,
          candidates: candidates.filter((c) => c.id !== id),
          manualOrder: (interview.manualOrder || []).filter((x) => x !== id),
        },
        'exclusao_candidato',
        `Candidato removido: ${target?.title || id}`
      )
    );
    setEditingId(null);
    setDraft(null);
  };

  const startEdit = (candidate) => {
    setDraft(candidate);
    setEditingId(candidate.id);
  };

  const closeEditor = () => {
    if (!draft.title.trim()) {
      window.alert('Informe um título específico para o candidato.');
      return;
    }
    if (editingId === 'new') addCandidate(draft);
    else updateCandidate(draft);
    setEditingId(null);
    setDraft(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
            Problemas e oportunidades
            <span className="text-[10px] font-mono text-neutral-500">{candidates.length}</span>
          </h4>
          <p className="text-[11px] text-neutral-500 mt-0.5 max-w-2xl leading-relaxed">
            Sem inteligência artificial disponível no ambiente: as sugestões são geradas por regras
            sobre as respostas gravadas e precisam de revisão. Candidatos só entram no ranking quando
            vinculados a uma resposta ou evidência.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setDraft(blankCandidate(interview));
            setEditingId('new');
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Novo candidato
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-4">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-3">
            <Sparkles className="w-4 h-4" /> Sugestões vinculadas às respostas ({suggestions.length})
          </p>
          <div className="space-y-2">
            {suggestions.map((s) => (
              <div
                key={s.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{s.title}</p>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">{s.evidence || s.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(s);
                    setEditingId('new');
                  }}
                  className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 transition-colors shrink-0"
                >
                  Revisar e usar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {editingId && draft && (
        <CandidateForm
          draft={draft}
          interview={interview}
          onChange={setDraft}
          onRemove={() => (editingId === 'new' ? (setDraft(null), setEditingId(null)) : removeCandidate(editingId))}
          onClose={closeEditor}
          saveLabel={editingId === 'new' ? 'Adicionar candidato' : 'Concluir edição'}
        />
      )}

      {candidates.length === 0 && !editingId && (
        <div className="border border-dashed border-neutral-700 rounded-xl p-8 text-center">
          <p className="text-sm text-neutral-400">Nenhum candidato cadastrado.</p>
          <p className="text-[11px] text-neutral-600 mt-1">
            Cadastre manualmente vinculando cada candidato à resposta que o sustenta.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {candidates
          .filter((c) => c.id !== editingId)
          .map((candidate) => {
            const score = scoreCandidate(candidate, interview.weights || undefined);
            const status = eligibility(candidate);
            const needsReview = Object.values(score.notes).some((n) => n.needsReview);

            return (
              <div key={candidate.id} className="border border-neutral-700/60 bg-neutral-800/40 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          candidate.classification === CLASSIFICATIONS.CONFIRMED
                            ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                            : candidate.classification === CLASSIFICATIONS.CLIENT_REPORT
                            ? 'border-blue-500/40 text-blue-300 bg-blue-500/10'
                            : 'border-neutral-600 text-neutral-300 bg-neutral-700/30'
                        }`}
                      >
                        {candidate.classification}
                      </span>
                      {candidate.blocked && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-red-500/40 text-red-300 bg-red-500/10 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Bloqueado
                        </span>
                      )}
                      {needsReview && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-orange-500/40 text-orange-300 bg-orange-500/10">
                          Precisa de revisão
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-white mt-1.5">{candidate.title}</p>
                    {candidate.description && (
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{candidate.description}</p>
                    )}
                    {candidate.sourceAnswer && (
                      <p className="text-[11px] text-neutral-500 italic mt-2 border-l-2 border-neutral-700 pl-2 line-clamp-2">
                        Evidência: “{candidate.sourceAnswer}”
                      </p>
                    )}
                    {candidate.blocked && candidate.blockAction && (
                      <p className="text-[11px] text-red-300 mt-2">
                        Ação para remover o bloqueio: {candidate.blockAction}
                      </p>
                    )}
                    {!status.eligible && (
                      <p className="text-[10px] text-neutral-500 mt-2 uppercase tracking-wider leading-relaxed">
                        {status.reasons.join(' ')}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="block text-[9px] uppercase tracking-wider text-neutral-500">Importância</span>
                      <span className="block text-base font-heading font-extrabold text-white leading-none">
                        {score.importance ?? '—'}
                      </span>
                      <span className="block text-[9px] uppercase tracking-wider text-neutral-500 mt-1.5">
                        Prioridade
                      </span>
                      <span className="block text-base font-heading font-extrabold text-amber-400 leading-none">
                        {score.priority ?? '—'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => startEdit(candidate)}
                      className="p-2 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-amber-500 text-neutral-300 hover:text-amber-400 transition-colors"
                      title="Editar candidato"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
