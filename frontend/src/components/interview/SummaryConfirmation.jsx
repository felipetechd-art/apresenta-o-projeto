import React, { useState } from 'react';
import { Check, FileSignature, RefreshCw, AlertTriangle, Info } from 'lucide-react';
import {
  CONFIRMATION_QUESTIONS,
  CONFIRMATION_OPTIONS,
  INTERVIEW_STATUS,
  CLOSING_MESSAGE,
} from '../../domain/interview/interviewSchema';
import { buildSummary, summaryText } from '../../domain/interview/interviewAnalysis';

const inputClass =
  'w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 text-white text-sm rounded-lg px-4 py-2.5 outline-none';
const labelClass = 'block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2';

function ContextToggle({ checked, text, onChecked, onText }) {
  return (
    <div className="mt-2">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChecked(e.target.checked)}
          className="w-4 h-4 accent-amber-500 rounded"
        />
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          Incluir contexto
        </span>
      </label>
      {checked ? (
        <textarea
          rows={2}
          value={text}
          onChange={(e) => onText(e.target.value)}
          placeholder="Contexto adicional desta resposta (opcional)"
          className={`${inputClass} mt-2 resize-y`}
        />
      ) : (
        text?.trim() && (
          <p className="mt-2 text-[11px] text-neutral-500 leading-relaxed">
            Contexto preservado e ocultado por enquanto: <span className="text-neutral-400">{text}</span>
          </p>
        )
      )}
    </div>
  );
}

export function SummaryConfirmation({ interview, onChange, onStatusChange, canEdit = true }) {
  const [regenWarning, setRegenWarning] = useState('');

  const confirmation = interview.confirmation || { answers: {}, contexts: {}, contextFlags: {} };
  const summary = interview.summary;

  const updateConfirmation = (patch) => {
    onChange({ ...interview, confirmation: { ...confirmation, ...patch } });
  };

  const regenerate = () => {
    const hasCustom = (summary?.sections || []).some((s) => s.edited === true);
    if (hasCustom && !window.confirm('Isso substitui edições manuais já feitas no resumo. Continuar?')) {
      return;
    }
    const fresh = buildSummary(interview);
    onChange({
      ...interview,
      summary: {
        ...fresh,
        sections: (fresh.sections || []).map((s) => ({ ...s, edited: false })),
        version: (summary?.version || 0) + 1,
        author: interview.consultantEmail || 'consultor',
        updatedAt: new Date().toISOString(),
      },
      history: [
        {
          at: new Date().toISOString(),
          by: interview.consultantEmail || 'consultor',
          action: 'resumo_gerado',
          detail: `Resumo do entendimento gerado (versão ${(summary?.version || 0) + 1}).`,
        },
        ...(interview.history || []),
      ],
    });
    setRegenWarning('');
  };

  const editSection = (sectionId, text) => {
    onChange({
      ...interview,
      summary: {
        ...summary,
        sections: (summary.sections || []).map((s) =>
          s.id === sectionId ? { ...s, text, edited: true } : s
        ),
        author: interview.consultantEmail || 'consultor',
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const divergences = CONFIRMATION_QUESTIONS.filter((q) => {
    const a = confirmation.answers?.[q.id];
    return (a === 'em_parte' || a === 'nao') && !confirmation.corrections?.trim();
  });

  const setAnswer = (questionId, value) => {
    const answers = { ...(confirmation.answers || {}), [questionId]: value };
    updateConfirmation({ answers });
  };

  const registerConfirmation = (mode) => {
    if (divergences.length > 0) {
      setRegenWarning('Corrija as divergências abertas antes de registrar o alinhamento.');
      return;
    }
    if (!confirmation.clientName?.trim()) {
      setRegenWarning('Informe o nome do cliente que confirmou o entendimento.');
      return;
    }
    const next = {
      ...interview,
      confirmation: {
        ...confirmation,
        confirmedAt: new Date().toISOString(),
        presentedVersion: summary?.version || 1,
        mode,
      },
    };
    onStatusChange(
      INTERVIEW_STATUS.CONFIRMED,
      `Entendimento confirmado pelo cliente (${mode === 'cliente' ? 'preenchida pelo cliente' : 'registrada pelo entrevistador'}).`,
      next
    );
    setRegenWarning('');
  };

  const requestChanges = () => {
    onStatusChange(
      INTERVIEW_STATUS.CHANGES,
      'Ajustes solicitados pelo cliente.',
      { ...interview, confirmation: { ...confirmation, confirmedAt: null } }
    );
  };

  const sendForConfirmation = () => {
    if (!summary) {
      setRegenWarning('Gere o resumo do entendimento antes de enviar para confirmação.');
      return;
    }
    onStatusChange(
      INTERVIEW_STATUS.WAITING,
      'Resumo enviado para confirmação do cliente.',
      { ...interview, confirmation: { ...confirmation, confirmedAt: null } }
    );
    setRegenWarning('');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-heading font-bold text-white">Resumo do entendimento</h4>
          <p className="text-[11px] text-neutral-500 mt-0.5 max-w-2xl leading-relaxed">
            Gerado a partir das respostas fechadas, escritas e dos contextos registrados. Relatos do
            cliente e hipóteses ainda não verificadas aparecem identificados.
          </p>
        </div>
        <button
          type="button"
          onClick={regenerate}
          disabled={!canEdit}
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors disabled:opacity-40"
        >
          <RefreshCw className="w-4 h-4" />
          {summary ? 'Regenerar rascunho' : 'Gerar rascunho'}
        </button>
      </div>

      {regenWarning && (
        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {regenWarning}
        </div>
      )}

      {!summary ? (
        <div className="border border-dashed border-neutral-700 rounded-xl p-8 text-center">
          <Info className="w-6 h-6 text-neutral-600 mx-auto mb-2" />
          <p className="text-sm text-neutral-400">Resumo ainda não gerado.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
            <span>Versão {summary.version || 1}</span>
            <span>Atualizado em {new Date(summary.updatedAt || Date.now()).toLocaleString('pt-BR')}</span>
            <span>Autor: {summary.author || interview.consultantEmail || '—'}</span>
          </div>

          {(summary.sections || []).map((section) => (
            <div key={section.id} className="bg-neutral-900/60 border border-neutral-700/60 rounded-xl p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">{section.label}</span>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    section.basis === 'relato'
                      ? 'border-blue-500/40 text-blue-300 bg-blue-500/10'
                      : section.basis === 'hipotese'
                      ? 'border-orange-500/40 text-orange-300 bg-orange-500/10'
                      : 'border-neutral-600 text-neutral-400 bg-neutral-700/30'
                  }`}
                >
                  {section.basis === 'relato'
                    ? 'Relato do cliente'
                    : section.basis === 'hipotese'
                    ? 'Hipótese a confirmar'
                    : 'Ainda a confirmar'}
                </span>
              </div>
              <textarea
                rows={3}
                disabled={!canEdit}
                value={section.text || ''}
                onChange={(e) => editSection(section.id, e.target.value)}
                className={`${inputClass} resize-y disabled:opacity-60`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Confirmação */}
      <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-2xl p-5 space-y-5">
        <div>
          <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
            <FileSignature className="w-4 h-4 text-amber-500" /> Confirmação do entendimento pelo
            cliente
          </h4>
          <p className="text-[11px] text-neutral-500 mt-1 max-w-2xl leading-relaxed">
            Representa alinhamento de entendimento. Não é aceite contratual, aprovação de plano de
            execução nem garantia de resultado.
          </p>
        </div>

        <div className="space-y-5">
          {CONFIRMATION_QUESTIONS.map((question) => {
            const value = confirmation.answers?.[question.id];
            const needsCorrection = value === 'em_parte' || value === 'nao';
            return (
              <div key={question.id} className="border border-neutral-700/60 rounded-xl p-4">
                <p className="text-sm text-white font-medium mb-3">{question.text}</p>
                <div className="flex flex-wrap gap-2">
                  {CONFIRMATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={!canEdit}
                      onClick={() => setAnswer(question.id, value === opt.value ? '' : opt.value)}
                      className={`px-4 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 ${
                        value === opt.value
                          ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                          : 'border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <ContextToggle
                  checked={confirmation.contextFlags?.[question.id] === true}
                  text={confirmation.contexts?.[question.id] || ''}
                  onChecked={(checked) =>
                    updateConfirmation({
                      contextFlags: { ...(confirmation.contextFlags || {}), [question.id]: checked },
                    })
                  }
                  onText={(text) =>
                    updateConfirmation({
                      contexts: { ...(confirmation.contexts || {}), [question.id]: text },
                    })
                  }
                />

                {needsCorrection && (
                  <div className="mt-3">
                    <label className={labelClass}>
                      O que precisamos corrigir ou acrescentar?{' '}
                      <span className="text-amber-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      disabled={!canEdit}
                      value={confirmation.corrections || ''}
                      onChange={(e) => updateConfirmation({ corrections: e.target.value })}
                      className={`${inputClass} resize-y disabled:opacity-60`}
                    />
                  </div>
                )}
              </div>
            );
          })}

          <div>
            <label className={labelClass}>
              Existe algum ponto importante que ainda não foi considerado?
            </label>
            <textarea
              rows={2}
              disabled={!canEdit}
              value={confirmation.extra || ''}
              onChange={(e) => updateConfirmation({ extra: e.target.value })}
              className={`${inputClass} resize-y disabled:opacity-60`}
              placeholder="Opcional"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nome do cliente</label>
              <input
                type="text"
                disabled={!canEdit}
                value={confirmation.clientName || ''}
                onChange={(e) => updateConfirmation({ clientName: e.target.value })}
                className={`${inputClass} disabled:opacity-60`}
              />
            </div>
            <div>
              <label className={labelClass}>Observações e correções</label>
              <input
                type="text"
                disabled={!canEdit}
                value={confirmation.notes || ''}
                onChange={(e) => updateConfirmation({ notes: e.target.value })}
                className={`${inputClass} disabled:opacity-60`}
                placeholder="Opcional"
              />
            </div>
          </div>

          {confirmation.confirmedAt && (
            <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-xs text-emerald-300">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Entendimento confirmado em{' '}
                {new Date(confirmation.confirmedAt).toLocaleString('pt-BR')} — versão{' '}
                {confirmation.presentedVersion} apresentada · forma:{' '}
                {confirmation.mode === 'cliente' ? 'preenchida pelo cliente' : 'registrada pelo entrevistador'}.
              </span>
            </div>
          )}

          {divergences.length > 0 && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-xs text-red-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                {divergences.length} divergência(s) aberta(s). Atualize o resumo e as prioridades e
                submeta novamente à confirmação.
              </span>
            </div>
          )}
        </div>

        {canEdit && (
          <div className="flex flex-wrap gap-3 pt-3 border-t border-neutral-700/60">
            <button
              type="button"
              onClick={sendForConfirmation}
              className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
            >
              Enviar para confirmação
            </button>
            <button
              type="button"
              onClick={() => registerConfirmation('entrevistador')}
              className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
            >
              Registrar confirmação (entrevistador)
            </button>
            <button
              type="button"
              onClick={() => registerConfirmation('cliente')}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
            >
              <Check className="w-4 h-4" /> Registrar confirmação (cliente preencheu)
            </button>
            <button
              type="button"
              onClick={requestChanges}
              className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 border border-orange-500/40 hover:bg-orange-500/10 text-orange-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
            >
              Registrar ajustes solicitados
            </button>
          </div>
        )}

        <p className="text-[11px] text-neutral-500 leading-relaxed">
          {summaryText(summary) ? 'Resumo apresentado para confirmação.' : 'Gere o resumo antes de confirmar.'}
        </p>
      </div>

      <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2">
          Encerramento
        </p>
        <p className="text-sm text-neutral-200 leading-relaxed">{CLOSING_MESSAGE}</p>
      </div>
    </div>
  );
}
