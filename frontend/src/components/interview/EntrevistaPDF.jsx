import React, { useRef, useState } from 'react';
import { Download, Printer, X, FileText } from 'lucide-react';
import {
  INTERVIEW_BLOCKS,
  INTERVIEW_STATUS,
  STATUS_LABELS,
  CONFIRMATION_QUESTIONS,
  CONFIRMATION_OPTIONS,
  CLOSING_MESSAGE,
  formatAnswer,
} from '../../domain/interview/interviewSchema';
import { criteriaExplainedPlain } from '../../domain/interview/interviewAnalysis';

const h2 = 'text-base font-bold text-neutral-900 border-b-2 border-neutral-300 pb-1 mb-3 mt-6';
const h3 = 'text-sm font-bold text-neutral-800 mt-4 mb-1';
const p = 'text-xs text-neutral-700 leading-relaxed';

function AnswerRows({ interview }) {
  return (
    <div className="space-y-5">
      {INTERVIEW_BLOCKS.map((block) => (
        <div key={block.id}>
          <p className="text-sm font-bold text-amber-700 uppercase tracking-wider mt-5 mb-2">
            {block.title}
          </p>
          {block.questions.map((question) => (
            <div key={question.id} className="mb-4">
              <p className="text-xs font-bold text-neutral-900">
                {question.number}. {question.title}
              </p>
              <p className="text-[11px] italic text-neutral-500 mb-1">Por que perguntamos: {question.why}</p>
              {question.fields
                .filter((field) => !field.consultantOnly)
                .map((field) => {
                  const text = formatAnswer(field, interview.answers?.[field.id]);
                  const context = interview.contexts?.[field.id];
                  if (!text && !context) return null;
                  return (
                    <div key={field.id} className="pl-3 border-l border-neutral-200 mb-1.5">
                      <p className="text-[11px] font-semibold text-neutral-600">{field.label}</p>
                      <p className={p}>{text || '—'}</p>
                      {context && (
                        <p className="text-[11px] text-neutral-500 italic">Contexto: {context}</p>
                      )}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function EntrevistaPDFDocument({ interview, ranking, summary, priorities, preliminary }) {
  const confirmation = interview.confirmation || {};
  const date = new Date(interview.updatedAt || interview.createdAt).toLocaleString('pt-BR');
  const optionLabel = (value) => CONFIRMATION_OPTIONS.find((o) => o.value === value)?.label || '—';

  return (
    <div
      id="entrevista-pdf-root"
      className="bg-white text-neutral-900 p-8 sm:p-10 max-w-[820px] mx-auto font-sans"
    >
      <div className="border-b-4 border-amber-500 pb-4 mb-4">
        <p className="text-[10px] uppercase tracking-widest text-amber-600 font-bold">
          Entrevista Inicial — Governo Empresarial
        </p>
        <h1 className="text-2xl font-extrabold text-neutral-900 mt-1">
          {interview.answers?.q1_empresaNome || 'Empresa não informada'}
        </h1>
        {preliminary && (
          <p className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 border border-orange-300 px-2 py-1 rounded">
            Aguardando confirmação do cliente
          </p>
        )}
      </div>

      <section>
        <p className={h2}>1. Identificação</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          <p className={p}>
            <strong>Empresa:</strong> {interview.answers?.q1_empresaNome || '—'}
          </p>
          <p className={p}>
            <strong>Entrevistado:</strong>{' '}
            {interview.answers?.q1_entrevistadoNome || '—'}
            {interview.answers?.q1_entrevistadoFuncao ? ` — ${interview.answers.q1_entrevistadoFuncao}` : ''}
          </p>
          <p className={p}>
            <strong>Consultor:</strong> {interview.consultantEmail || '—'}
          </p>
          <p className={p}>
            <strong>Data:</strong> {date}
          </p>
          <p className={p}>
            <strong>Status:</strong> {STATUS_LABELS[interview.status]}
          </p>
          <p className={p}>
            <strong>Abrangência:</strong>{' '}
            {interview.answers?.q1_abrangencia === 'multiplas'
              ? 'Mais de uma empresa'
              : interview.answers?.q1_abrangencia === 'uma'
              ? 'Uma empresa'
              : 'Ainda precisamos definir'}
          </p>
        </div>
      </section>

      <section>
        <p className={h2}>2. Entrevista completa</p>
        <AnswerRows interview={interview} />
      </section>

      <section className="html2pdf__page-break">
        <p className={h2}>3. Resumo do que foi entendido</p>
        {summary ? (
          (summary.sections || []).map((section) => (
            <div key={section.id} className="mb-3">
              <p className={h3}>
                {section.label}{' '}
                <span className="text-[10px] font-normal text-neutral-500">
                  [{section.basis === 'relato' ? 'relato do cliente' : 'hipótese / a confirmar'}]
                </span>
              </p>
              <p className={p}>{section.text}</p>
            </div>
          ))
        ) : (
          <p className={p}>Resumo ainda não gerado.</p>
        )}
      </section>

      <section className="html2pdf__page-break">
        <p className={h2}>4. Prioridades apresentadas</p>
        {priorities.length === 0 && (
          <p className={p}>
            Nenhum ponto sustentado pelas respostas registradas até o momento.
          </p>
        )}
        {priorities.map((item) => (
          <div key={item.position} className="mb-4 border border-neutral-200 rounded p-3">
            <p className="text-sm font-bold text-neutral-900">
              {item.position}. {item.title}
            </p>
            {item.understood && (
              <p className={p}>
                <strong>O que foi entendido:</strong> {item.understood}
              </p>
            )}
            {item.evidence && (
              <p className={p}>
                <strong>Evidência relatada:</strong> {item.evidence}
              </p>
            )}
            {item.consequence && (
              <p className={p}>
                <strong>Consequência identificada:</strong> {item.consequence}
              </p>
            )}
            {item.whyAttention && (
              <p className={p}>
                <strong>Por que merece atenção:</strong> {item.whyAttention}
              </p>
            )}
            {item.relatedOutcome && (
              <p className={p}>
                <strong>Relação com o resultado desejado:</strong> {item.relatedOutcome}
              </p>
            )}
            {item.openQuestions && (
              <p className={p}>
                <strong>Condições ou dúvidas a esclarecer:</strong> {item.openQuestions}
              </p>
            )}
          </div>
        ))}
        {ranking?.hasFewerThanFive && (
          <p className="text-xs font-semibold text-orange-700">{ranking.missingDataNote}</p>
        )}
      </section>

      <section>
        <p className={h2}>5. Critérios utilizados</p>
        <ul className="pl-4 list-disc space-y-1">
          {criteriaExplainedPlain().map((c) => (
            <li key={c} className={p}>
              {c}
            </li>
          ))}
        </ul>
        <p className={`${p} mt-2 text-neutral-500`}>
          A seleção considera esses quatro aspectos em conjunto. Não representa garantia de prazo ou
          de resultado.
        </p>
      </section>

      <section className="html2pdf__page-break">
        <p className={h2}>6. Confirmação do cliente</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-3">
          <p className={p}>
            <strong>Cliente:</strong> {confirmation.clientName || '—'}
          </p>
          <p className={p}>
            <strong>Data e hora:</strong>{' '}
            {confirmation.confirmedAt
              ? new Date(confirmation.confirmedAt).toLocaleString('pt-BR')
              : 'Ainda não registrada'}
          </p>
          <p className={p}>
            <strong>Versão apresentada:</strong> {confirmation.presentedVersion || summary?.version || 1}
          </p>
          <p className={p}>
            <strong>Forma de confirmação:</strong>{' '}
            {confirmation.mode === 'cliente'
              ? 'preenchida pelo cliente'
              : confirmation.mode === 'entrevistador'
              ? 'registrada pelo entrevistador durante a conversa'
              : '—'}
          </p>
        </div>

        {CONFIRMATION_QUESTIONS.map((question) => (
          <div key={question.id} className="mb-2">
            <p className="text-xs font-bold text-neutral-800">{question.text}</p>
            <p className={p}>
              Resposta: {optionLabel(confirmation.answers?.[question.id])}
              {confirmation.contextFlags?.[question.id] && confirmation.contexts?.[question.id] && (
                <> — Contexto: {confirmation.contexts[question.id]}</>
              )}
            </p>
          </div>
        ))}

        {(confirmation.corrections || '').trim() && (
          <div className="mt-3 border-l-4 border-orange-400 pl-3">
            <p className="text-xs font-bold text-orange-700">Ressalvas e ajustes</p>
            <p className={p}>{confirmation.corrections}</p>
          </div>
        )}
        {(confirmation.extra || '').trim() && (
          <div className="mt-2 border-l-4 border-neutral-400 pl-3">
            <p className="text-xs font-bold text-neutral-700">
              Ponto ainda não considerado
            </p>
            <p className={p}>{confirmation.extra}</p>
          </div>
        )}
        {(confirmation.notes || '').trim() && (
          <p className={`${p} mt-2`}>
            <strong>Observações:</strong> {confirmation.notes}
          </p>
        )}
      </section>

      <section>
        <p className={h2}>7. Pontos ainda pendentes de esclarecimento</p>
        {(interview.pendingInfo || []).length > 0 ? (
          <ul className="pl-4 list-disc space-y-1">
            {interview.pendingInfo.map((item) => (
              <li key={item} className={p}>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className={p}>Nenhum ponto pendente registrado.</p>
        )}
      </section>

      <p className="text-[10px] text-neutral-500 mt-8 border-t border-neutral-200 pt-3 leading-relaxed">
        {CLOSING_MESSAGE}
      </p>
    </div>
  );
}

export function PDFExportOverlay({ interview, ranking, summary, priorities, onClose }) {
  const containerRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const preliminary = interview.status !== INTERVIEW_STATUS.CONFIRMED;

  const generate = async () => {
    setBusy(true);
    try {
      const html2pdf = window.html2pdf;
      if (html2pdf && containerRef.current) {
        await html2pdf()
          .set({
            margin: 10,
            filename: `entrevista-${(interview.answers?.q1_empresaNome || 'empresa')
              .toLowerCase()
              .replace(/[^a-z0-9]+/gi, '-')
              .slice(0, 40)}.pdf`,
            html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          })
          .from(containerRef.current)
          .save();
      } else {
        window.print();
      }
    } catch (e) {
      console.error(e);
      window.print();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fade-in flex flex-col">
      <div className="pdf-exclude bg-neutral-900 border-b border-neutral-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shrink-0">
        <span className="flex items-center gap-2 text-sm font-bold text-white">
          <FileText className="w-4 h-4 text-amber-500" />
          Exportação em PDF {preliminary ? '— versão preliminar' : '— versão final'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={generate}
            disabled={busy}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> {busy ? 'Gerando…' : 'Baixar PDF'}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" /> Imprimir
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div ref={containerRef} className="shadow-2xl">
          <EntrevistaPDFDocument
            interview={{ ...interview, pendingInfo: interview.pendingInfo || [] }}
            ranking={ranking}
            summary={summary}
            priorities={priorities}
            preliminary={preliminary}
          />
        </div>
      </div>
    </div>
  );
}
