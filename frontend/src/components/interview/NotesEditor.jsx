import React from 'react';
import { Sparkles, AlertTriangle, Check } from 'lucide-react';
import { CRITERIA } from '../../domain/interview/interviewSchema';
import {
  NOTE_STATUS,
  UNKNOWN_LABEL,
  calcImportance,
  calcPriority,
} from '../../domain/interview/priorityEngine';

const selectClass =
  'bg-neutral-900 border border-neutral-700 focus:border-amber-500 text-white text-xs rounded-lg px-3 py-2 outline-none w-full';

const CLIENT_CRITERIA = ['I', 'F'];
const CONSULTANT_CRITERIA = ['R', 'V'];

export function NotesEditor({ candidate, interview, onChange, compact }) {
  const notes = candidate.notes || {};

  const setNote = (key, patch) => {
    onChange({
      ...candidate,
      notes: {
        ...notes,
        [key]: {
          status: NOTE_STATUS.PENDING,
          value: null,
          evidence: '',
          source: '',
          suggestion: null,
          suggestionEvidence: '',
          confirmed: false,
          needsReview: false,
          ...(notes[key] || {}),
          ...patch,
          at: new Date().toISOString(),
        },
      },
    });
  };

  const acceptSuggestion = (key) => {
    const current = notes[key] || {};
    setNote(key, {
      status: NOTE_STATUS.SET,
      value: current.suggestion,
      evidence: current.suggestionEvidence || current.evidence || '',
      source: 'sugestao_confirmada',
      confirmed: true,
      suggestion: null,
      suggestionEvidence: '',
    });
  };

  const renderCriterion = (key) => {
    const criterion = CRITERIA.find((c) => c.key === key);
    const note = notes[key] || { status: NOTE_STATUS.PENDING, value: null };
    const isClient = CLIENT_CRITERIA.includes(key);

    return (
      <div
        key={key}
        className={`rounded-xl border p-4 ${
          note.needsReview
            ? 'border-orange-500/40 bg-orange-500/5'
            : 'border-neutral-700/60 bg-neutral-900/50'
        }`}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
              {key} — {criterion.name}
            </span>
            <p className="text-[10px] text-neutral-500 mt-0.5">
              {isClient ? 'Cliente confirma' : 'Consultor registra'}
            </p>
          </div>
          <span className="text-lg font-heading font-extrabold text-white">
            {note.status === NOTE_STATUS.SET ? note.value : <span className="text-neutral-600">—</span>}
          </span>
        </div>

        {note.needsReview && (
          <p className="flex items-center gap-1.5 text-[10px] text-orange-300 mb-2 uppercase tracking-wider font-bold">
            <AlertTriangle className="w-3.5 h-3.5" /> Precisa de revisão
          </p>
        )}

        <select
          className={selectClass}
          value={note.status === NOTE_STATUS.SET ? String(note.value) : note.status}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === 'pending') {
              setNote(key, { status: NOTE_STATUS.PENDING, value: null, confirmed: false });
            } else if (raw === 'unknown') {
              setNote(key, { status: NOTE_STATUS.UNKNOWN, value: null, confirmed: false });
            } else {
              setNote(key, { status: NOTE_STATUS.SET, value: Number(raw), confirmed: true });
            }
          }}
        >
          <option value="pending">Ainda não preenchido</option>
          {criterion.scale.map((text, index) => (
            <option key={index} value={String(index)}>
              {index} — {text}
            </option>
          ))}
          <option value="unknown">{UNKNOWN_LABEL}</option>
        </select>

        {note.suggestion !== null && note.suggestion !== undefined && (
          <div className="mt-3 border border-amber-500/30 bg-amber-500/10 rounded-lg p-3">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Sugestão a partir da resposta
            </p>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              Valor {note.suggestion} — {criterion.scale[note.suggestion]}
            </p>
            {note.suggestionEvidence && (
              <p className="text-[11px] text-neutral-300 italic mt-1.5 border-l-2 border-amber-500/40 pl-2">
                “{note.suggestionEvidence}”
              </p>
            )}
            <button
              type="button"
              onClick={() => acceptSuggestion(key)}
              className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-md bg-amber-500 text-neutral-900 hover:bg-amber-400 transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Confirmar
            </button>
          </div>
        )}

        {!compact && (
          <div className="mt-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              Evidência da nota
            </label>
            <textarea
              rows={2}
              value={note.evidence || ''}
              onChange={(e) => setNote(key, { evidence: e.target.value })}
              placeholder="Texto da resposta ou observação que sustenta esta nota"
              className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 text-white text-xs rounded-lg px-3 py-2 outline-none resize-y"
            />
          </div>
        )}
      </div>
    );
  };

  const importance = calcImportance(candidate, interview.weights || undefined);
  const priority = calcPriority(candidate, interview.weights || undefined);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Impacto e frequência
          </p>
          {CLIENT_CRITERIA.map(renderCriterion)}
        </div>
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Relação com o objetivo e viabilidade
          </p>
          {CONSULTANT_CRITERIA.map(renderCriterion)}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-neutral-900/70 border border-neutral-700/60 rounded-xl px-4 py-3">
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
            Importância
          </span>
          <span className="text-lg font-heading font-extrabold text-white">
            {importance === null ? '—' : importance}
          </span>
        </div>
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
            Prioridade de execução
          </span>
          <span className="text-lg font-heading font-extrabold text-amber-400">
            {priority === null ? '—' : priority}
          </span>
        </div>
        {(importance === null || priority === null) && (
          <p className="text-[11px] text-neutral-400 flex-1 min-w-[200px] leading-relaxed">
            Índice calculado somente com os critérios preenchidos. Dados ausentes não são
            substituídos por zero, média ou valor presumido.
          </p>
        )}
      </div>
    </div>
  );
}
