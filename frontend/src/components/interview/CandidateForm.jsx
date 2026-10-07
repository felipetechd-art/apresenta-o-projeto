import React, { useMemo, useState } from 'react';
import { Link2, ChevronDown, ChevronUp, Trash2, AlertTriangle } from 'lucide-react';
import { CLASSIFICATIONS, INTERVIEW_BLOCKS } from '../../domain/interview/interviewSchema';
import { NotesEditor } from './NotesEditor';

const inputClass =
  'w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 text-white text-sm rounded-lg px-4 py-2.5 outline-none';
const labelClass = 'block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2';

export function AnswerIndex({ interview, selectedQuestion, onSelect }) {
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => {
    const list = [];
    INTERVIEW_BLOCKS.forEach((block) => {
      block.questions.forEach((question) => {
        question.fields.forEach((field) => {
          const value = interview.answers?.[field.id];
          const context = interview.contexts?.[field.id];
          const text = Array.isArray(value) ? value.filter(Boolean).join('; ') : value;
          if (!text && !context) return;
          list.push({
            questionId: question.id,
            fieldId: field.id,
            label: field.label,
            text: String(text || ''),
            context: String(context || ''),
          });
        });
      });
    });
    return list;
  }, [interview]);

  return (
    <div className="border border-neutral-700/60 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-neutral-900/70 hover:bg-neutral-800/70 transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300">
          <Link2 className="w-4 h-4 text-amber-500" />
          Vincular a uma resposta registrada ({rows.length})
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
      </button>

      {open && (
        <div className="max-h-72 overflow-y-auto divide-y divide-neutral-800/80">
          {rows.length === 0 && <p className="p-4 text-xs text-neutral-500">Nenhuma resposta registrada ainda.</p>}
          {rows.map((row) => (
            <button
              key={`${row.questionId}-${row.fieldId}`}
              type="button"
              onClick={() => {
                onSelect(row);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 transition-colors ${
                selectedQuestion === row.questionId ? 'bg-amber-500/10' : 'hover:bg-neutral-800/60'
              }`}
            >
              <span className="block text-[10px] uppercase tracking-wider text-amber-500/80 font-bold">
                {row.label}
              </span>
              <span className="block text-xs text-neutral-300 leading-snug line-clamp-2 mt-0.5">
                {row.text || row.context}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TextField({ label, value, onChange, rows = 2, placeholder }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        rows={rows}
        className={`${inputClass} resize-y`}
        value={value || ''}
        placeholder={placeholder || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function CandidateForm({ draft, interview, onChange, onRemove, onClose, saveLabel = 'Concluir edição' }) {
  const update = (patch) => onChange({ ...draft, ...patch });

  return (
    <div className="border border-amber-500/30 bg-neutral-800/60 rounded-xl p-4 sm:p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>Título específico do problema ou oportunidade</label>
          <input
            type="text"
            className={inputClass}
            value={draft.title || ''}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Ex.: Pendências de atendimento sem responsável definido"
          />
        </div>

        <TextField label="Descrição" value={draft.description} onChange={(v) => update({ description: v })} />
        <TextField label="O que foi entendido" value={draft.understood} onChange={(v) => update({ understood: v })} />
        <TextField label="Consequência relatada" value={draft.consequence} onChange={(v) => update({ consequence: v })} />
        <TextField
          label="Por que merece atenção"
          value={draft.whyAttention}
          onChange={(v) => update({ whyAttention: v })}
        />
        <TextField
          label="Relação com o resultado desejado"
          value={draft.relatedOutcome}
          onChange={(v) => update({ relatedOutcome: v })}
          placeholder="Use a mudança esperada registrada na pergunta 4"
        />
        <TextField
          label="Condições ou dúvidas que precisam ser esclarecidas"
          value={draft.openQuestions}
          onChange={(v) => update({ openQuestions: v })}
        />

        <div>
          <label className={labelClass}>Classificação</label>
          <select
            className={inputClass}
            value={draft.classification || CLASSIFICATIONS.HYPOTHESIS}
            onChange={(e) => update({ classification: e.target.value })}
          >
            {Object.values(CLASSIFICATIONS).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Pergunta de origem</label>
          <select
            className={inputClass}
            value={draft.sourceQuestion || ''}
            onChange={(e) => update({ sourceQuestion: e.target.value })}
          >
            <option value="">Selecione…</option>
            {INTERVIEW_BLOCKS.flatMap((block) =>
              block.questions.map((q) => (
                <option key={q.id} value={q.id}>
                  Pergunta {q.number} — {q.title}
                </option>
              ))
            )}
          </select>
        </div>

        <TextField
          label="Resposta ou evidência de origem"
          rows={3}
          value={draft.sourceAnswer}
          onChange={(v) => update({ sourceAnswer: v })}
          placeholder="Trecho da resposta que sustenta este candidato"
        />
        <TextField
          label="Contexto registrado na origem"
          rows={3}
          value={draft.sourceContext}
          onChange={(v) => update({ sourceContext: v })}
        />
      </div>

      <AnswerIndex
        interview={interview}
        selectedQuestion={draft.sourceQuestion}
        onSelect={(row) =>
          update({
            sourceQuestion: row.questionId,
            sourceField: row.fieldId,
            sourceAnswer: row.text || draft.sourceAnswer,
            sourceContext: row.context || draft.sourceContext,
            evidence: draft.evidence || row.text || row.context,
          })
        }
      />

      <div className="border border-neutral-700/60 rounded-xl p-4 space-y-3">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={draft.blocked === true}
            onChange={(e) => update({ blocked: e.target.checked })}
            className="w-4 h-4 accent-red-500 rounded"
          />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            Há bloqueio que impede a ação proposta
          </span>
        </label>
        {draft.blocked && (
          <div>
            <label className={labelClass}>Ação necessária para avaliar ou remover o bloqueio</label>
            <input
              type="text"
              className={inputClass}
              value={draft.blockAction || ''}
              onChange={(e) => update({ blockAction: e.target.value })}
              placeholder="Ex.: aguardar definição do responsável pelo acesso"
            />
          </div>
        )}
      </div>

      <NotesEditor candidate={draft} interview={interview} onChange={onChange} />

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-700/60">
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300"
        >
          <Trash2 className="w-4 h-4" /> Excluir candidato
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
        >
          {saveLabel}
        </button>
      </div>
      {draft.blocked && (
        <p className="flex items-center gap-1.5 text-[10px] text-red-300 uppercase tracking-wider font-bold">
          <AlertTriangle className="w-3.5 h-3.5" /> Candidato bloqueado fica visível no dashboard
          com a ação necessária registrada.
        </p>
      )}
    </div>
  );
}
