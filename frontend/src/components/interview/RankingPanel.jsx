import React, { useState } from 'react';
import { ArrowDown, ArrowUp, AlertTriangle, Lock, Calculator, Info } from 'lucide-react';
import { CRITERIA } from '../../domain/interview/interviewSchema';
import {
  DEFAULT_WEIGHTS,
  NOTE_STATUS,
  UNKNOWN_LABEL,
  describeWeights,
  newVersionedWeights,
} from '../../domain/interview/priorityEngine';

function NotesRow({ candidate }) {
  return (
    <div className="flex flex-wrap gap-3 mt-2">
      {CRITERIA.map((criterion) => {
        const note = candidate.notes?.[criterion.key] || {};
        const known = note.status === NOTE_STATUS.SET;
        const unknown = note.status === NOTE_STATUS.UNKNOWN;
        return (
          <div key={criterion.key} className="text-[10px]">
            <span className="uppercase tracking-wider text-neutral-500 font-bold mr-1">{criterion.key}</span>
            <span className={known ? 'text-white font-bold' : unknown ? 'text-neutral-500 italic' : 'text-neutral-600'}>
              {known ? note.value : unknown ? UNKNOWN_LABEL : '—'}
            </span>
            {note.needsReview && <span className="text-orange-400 ml-1 font-bold">↺</span>}
          </div>
        );
      })}
    </div>
  );
}

function PositionCard({ item, isOverridden, onMoveUp, onMoveDown, canEdit }) {
  return (
    <div className="border border-neutral-700/60 bg-neutral-800/40 rounded-xl p-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-6 h-6 rounded-md bg-amber-500 text-neutral-900 text-xs font-heading font-extrabold flex items-center justify-center shrink-0">
              {item.position}
            </span>
            <span className="text-sm font-bold text-white">{item.title}</span>
            {isOverridden && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-blue-500/40 text-blue-300 bg-blue-500/10">
                Ordem ajustada pelo consultor
              </span>
            )}
          </div>

          {item.description && <p className="text-xs text-neutral-400 mt-1.5">{item.description}</p>}

          {item.sourceAnswer && (
            <p className="text-[11px] text-neutral-500 italic mt-2 border-l-2 border-neutral-700 pl-2">
              Evidência: “{item.sourceAnswer}”
            </p>
          )}

          <NotesRow candidate={item} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-3 text-[11px] text-neutral-400">
            <p>
              <span className="text-neutral-500 font-bold uppercase tracking-wider text-[10px] mr-1.5">
                Responsável:
              </span>
              {item.responsavel || 'A definir'}
            </p>
            <p>
              <span className="text-neutral-500 font-bold uppercase tracking-wider text-[10px] mr-1.5">
                Dependências:
              </span>
              {item.dependencies || (item.blocked ? item.blockAction : '—')}
            </p>
            <p>
              <span className="text-neutral-500 font-bold uppercase tracking-wider text-[10px] mr-1.5">
                Primeira ação sugerida:
              </span>
              {item.firstAction || 'A definir após revisão do consultor'}
            </p>
            <p>
              <span className="text-neutral-500 font-bold uppercase tracking-wider text-[10px] mr-1.5">
                Evidência esperada:
              </span>
              {item.expectedEvidence || item.consequence || '—'}
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-end gap-3 shrink-0">
          <div className="text-right">
            <span className="block text-[9px] uppercase tracking-wider text-neutral-500">Importância</span>
            <span className="block text-lg font-heading font-extrabold text-white leading-none">
              {item.importance ?? '—'}
            </span>
            <span className="block text-[9px] uppercase tracking-wider text-neutral-500 mt-1.5">
              Prioridade
            </span>
            <span className="block text-lg font-heading font-extrabold text-amber-400 leading-none">
              {item.priority ?? '—'}
            </span>
            <span className="block text-[9px] uppercase tracking-wider text-neutral-500 mt-1.5">
              Calculada
            </span>
            <span className="block text-xs font-mono text-neutral-400">{item.calculatedPosition}º</span>
          </div>

          {canEdit && (
            <div className="flex sm:flex-col gap-1">
              <button
                type="button"
                onClick={onMoveUp}
                className="p-1.5 rounded-md border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500"
                title="Subir"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onMoveDown}
                className="p-1.5 rounded-md border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500"
                title="Descer"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WeightsPanel({ interview, isAdmin, onChange }) {
  const [open, setOpen] = useState(false);
  const weights = interview.weights || DEFAULT_WEIGHTS;
  const info = describeWeights(weights);

  const updateWeight = (group, key, value) => {
    const parsed = Math.max(0, Math.min(1, Number(value)));
    if (Number.isNaN(parsed)) return;
    onChange(newVersionedWeights({ [group]: { [key]: parsed } }, weights));
  };

  return (
    <div className="border border-neutral-700/60 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-900/70 hover:bg-neutral-800/70 transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300">
          <Calculator className="w-4 h-4 text-amber-500" /> Como calculamos
          <span className="text-neutral-500 normal-case tracking-normal font-mono">versão {info.version}</span>
        </span>
        <span className="text-neutral-500 text-xs">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="p-4 space-y-4 bg-neutral-900/40">
          <p className="flex items-start gap-2 text-[11px] text-neutral-400 leading-relaxed">
            <Info className="w-4 h-4 shrink-0 text-neutral-500" />
            <span>
              <strong className="text-neutral-300">Índice de prioridade de execução — regra interna
              proposta.</strong> Não é avaliação científica, prova de causalidade ou promessa de
              resultado.
            </span>
          </p>

          <div className="space-y-1 text-[11px] font-mono text-amber-300 bg-neutral-950/60 border border-neutral-800 rounded-lg p-3">
            {info.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Critérios de elegibilidade
              </p>
              <ul className="space-y-1 text-neutral-400">
                {info.eligibility.map((e) => (
                  <li key={e}>• {e}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Desempate
              </p>
              <ul className="space-y-1 text-neutral-400">
                {info.tiebreak.map((e) => (
                  <li key={e}>• {e}</li>
                ))}
              </ul>
            </div>
          </div>

          {isAdmin ? (
            <div className="border-t border-neutral-800 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-2">
                Ajuste de pesos (administrador) — gera nova versão
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
                {['I', 'F', 'R', 'V'].map((key) => (
                  <div key={`p-${key}`}>
                    <label className="block text-[10px] text-neutral-500 mb-1">Prioridade {key}</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={weights.priority[key]}
                      onChange={(e) => updateWeight('priority', key, e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 text-white text-xs rounded-lg px-2 py-1.5 outline-none"
                    />
                  </div>
                ))}
                {['I', 'F', 'R'].map((key) => (
                  <div key={`i-${key}`}>
                    <label className="block text-[10px] text-neutral-500 mb-1">Importância {key}</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={weights.importance[key]}
                      onChange={(e) => updateWeight('importance', key, e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 text-white text-xs rounded-lg px-2 py-1.5 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-neutral-500">
              A alteração dos pesos é permitida apenas para administradores.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function RankingPanel({ interview, ranking, onChange, isAdmin }) {
  const [justification, setJustification] = useState('');

  const approved = ranking.approved;

  const move = (index, delta) => {
    const nextIndex = index + delta;
    if (nextIndex < 0 || nextIndex >= approved.length) return;
    if (!justification.trim()) {
      window.alert('Informe a justificativa para alterar a ordem calculada antes de reordenar.');
      return;
    }
    const ids = approved.map((a) => a.id);
    const order = [...ids];
    [order[index], order[nextIndex]] = [order[nextIndex], order[index]];
    onChange({
      ...interview,
      manualOrder: order,
      rankJustification: justification.trim(),
      history: [
        {
          at: new Date().toISOString(),
          by: interview.consultantEmail || 'consultor',
          action: 'reordenacao_ranking',
          detail: `Ordem aprovada ajustada (posição ${index + 1} ↔ ${nextIndex + 1}). Justificativa: ${justification.trim()}`,
        },
        ...(interview.history || []),
      ].slice(0, 300),
    });
    setJustification('');
  };

  const saveJustification = () => {
    if (!justification.trim()) {
      window.alert('Informe a justificativa para o ajuste da ordem.');
      return;
    }
    onChange({
      ...interview,
      rankJustification: justification.trim(),
      history: [
        {
          at: new Date().toISOString(),
          by: interview.consultantEmail || 'consultor',
          action: 'justificativa_ordem',
          detail: justification.trim(),
        },
        ...(interview.history || []),
      ],
    });
    setJustification('');
  };

  return (
    <div className="space-y-5">
      <WeightsPanel interview={interview} isAdmin={isAdmin} onChange={onChange} />

      <div>
        <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2 mb-1">
          Cinco pontos para atuar com velocidade
        </h4>
        <p className="text-[11px] text-neutral-500 max-w-2xl leading-relaxed">
          O ranking orienta a sequência; não significa executar cinco iniciativas simultaneamente.
          Selecione uma ou duas para início imediato.
        </p>
      </div>

      {ranking.hasFewerThanFive && (
        <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 text-xs text-blue-300">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{ranking.missingDataNote}</span>
        </div>
      )}

      {approved.length === 0 ? (
        <div className="border border-dashed border-neutral-700 rounded-xl p-8 text-center">
          <p className="text-sm text-neutral-400">Nenhum candidato reúne as condições de elegibilidade.</p>
          <p className="text-[11px] text-neutral-600 mt-1">
            Preencha os quatro critérios, registre a evidência e verifique viabilidade e bloqueios.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {approved.map((item, index) => (
            <PositionCard
              key={item.id}
              item={item}
              isOverridden={item.overridden}
              canEdit={true}
              onMoveUp={() => move(index, -1)}
              onMoveDown={() => move(index, 1)}
            />
          ))}
        </div>
      )}

      <div className="bg-neutral-900/60 border border-neutral-700/60 rounded-xl p-4 space-y-3">
        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
          Justificativa para alterar a ordem calculada
        </label>
        <textarea
          rows={2}
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          placeholder="Obrigatória quando a ordem aprovada difere da classificação calculada"
          className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 text-white text-sm rounded-lg px-4 py-2.5 outline-none resize-y"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-neutral-500">
            {interview.rankJustification
              ? `Última justificativa registrada: ${interview.rankJustification}`
              : 'Nenhuma justificativa registrada.'}
          </p>
          <button
            type="button"
            onClick={saveJustification}
            className="px-4 py-2 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
          >
            Registrar justificativa
          </button>
        </div>
      </div>

      {ranking.preparation.length > 0 && (
        <div className="border border-orange-500/30 bg-orange-500/5 rounded-xl p-4">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-orange-300 mb-3">
            <Lock className="w-4 h-4" /> Importantes, mas dependentes de preparação
          </p>
          <ul className="space-y-2">
            {ranking.preparation.map((c) => (
              <li key={c.id} className="bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-3 py-2.5">
                <p className="text-xs font-bold text-white">{c.title}</p>
                <p className="text-[11px] text-neutral-400 mt-1">{c.eligibility.reasons.join(' ')}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {ranking.blocked.length > 0 && (
        <div className="border border-red-500/30 bg-red-500/5 rounded-xl p-4">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-300 mb-3">
            <AlertTriangle className="w-4 h-4" /> Bloqueados — permanecem visíveis no dashboard
          </p>
          <ul className="space-y-2">
            {ranking.blocked.map((c) => (
              <li key={c.id} className="bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-3 py-2.5">
                <p className="text-xs font-bold text-white">{c.title}</p>
                <p className="text-[11px] text-red-300 mt-1">
                  Ação necessária: {c.blockAction || 'Registrar a ação para avaliar ou remover o bloqueio.'}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
