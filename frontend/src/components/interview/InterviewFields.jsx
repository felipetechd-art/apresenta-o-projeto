import React from 'react';
import { Check, HelpCircle } from 'lucide-react';
import { isEmptyValue, showField, QUESTION_LIST, getProgress, INTERVIEW_BLOCKS } from '../../domain/interview/interviewSchema';

const inputClass =
  'w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 text-white text-sm rounded-lg px-4 py-2.5 outline-none transition-colors placeholder:text-neutral-600';

const labelClass = 'block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2';

export function WhyBadge({ why }) {
  if (!why) return null;
  return (
    <p className="flex items-start gap-2 text-[11px] leading-relaxed text-amber-400/80 mb-4">
      <HelpCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
      <span>
        <span className="font-bold uppercase tracking-wider text-amber-500/70">Por que perguntamos: </span>
        {why}
      </span>
    </p>
  );
}

export function GuidanceBadge({ guidance }) {
  if (!guidance) return null;
  return (
    <p className="text-[11px] leading-relaxed text-neutral-400 border-l-2 border-neutral-700 pl-3 mb-4 italic">
      <span className="font-bold not-italic text-neutral-300 uppercase tracking-wider text-[10px]">
        Orientação ao entrevistador:{' '}
      </span>
      {guidance}
    </p>
  );
}

function ContextBlock({ enabled, text, onEnabledChange, onTextChange }) {
  const hasText = !isEmptyValue(text);
  return (
    <div className="mt-3 border-t border-neutral-800 pt-3">
      <label className="flex items-start gap-2.5 cursor-pointer group select-none">
        <span
          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
            enabled ? 'bg-amber-500 border-amber-500' : 'bg-neutral-900 border-neutral-600 group-hover:border-neutral-400'
          }`}
        >
          {enabled && <Check className="w-3 h-3 text-neutral-900" strokeWidth={4} />}
        </span>
        <input
          type="checkbox"
          className="sr-only"
          checked={enabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
        />
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-white transition-colors">
          Incluir contexto
        </span>
      </label>

      {enabled ? (
        <textarea
          rows={2}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Contexto adicional sobre esta resposta (opcional)"
          className={`${inputClass} mt-2 resize-y`}
        />
      ) : (
        hasText && (
          <p className="mt-2 text-[11px] text-neutral-500 leading-relaxed">
            Contexto preservado e ocultado por enquanto:{' '}
            <span className="text-neutral-400">{text}</span>
          </p>
        )
      )}
    </div>
  );
}

function OptionItem({ type, checked, label, onChange }) {
  return (
    <label
      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
        checked
          ? 'border-amber-500/60 bg-amber-500/10'
          : 'border-neutral-700/70 bg-neutral-900/60 hover:border-neutral-600'
      }`}
    >
      <span
        className={`mt-0.5 w-4 h-4 flex items-center justify-center shrink-0 border ${
          type === 'radio' ? 'rounded-full' : 'rounded'
        } ${checked ? 'bg-amber-500 border-amber-500' : 'bg-neutral-900 border-neutral-600'}`}
      >
        {checked && (
          <span className={`w-1.5 h-1.5 ${type === 'radio' ? 'bg-neutral-900 rounded-full' : 'bg-neutral-900 rounded-[2px]'}`} />
        )}
      </span>
      <input
        type={type === 'radio' ? 'radio' : 'checkbox'}
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <span className="text-sm text-neutral-200 leading-snug">{label}</span>
    </label>
  );
}

function QuickOptions({ options, value, onPick }) {
  if (!options || options.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onPick(value === opt ? '' : opt)}
          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border transition-colors ${
            value === opt
              ? 'border-amber-500/60 bg-amber-500/10 text-amber-400'
              : 'border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function ListField({ field, value, onChange }) {
  const rows = Array.isArray(value) && value.length ? value : [{}];
  const update = (index, key, text) => {
    const next = rows.map((row, i) => (i === index ? { ...row, [key]: text } : row));
    onChange(next);
  };
  const addRow = () => onChange([...rows, {}]);
  const removeRow = (index) => onChange(rows.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={index} className="bg-neutral-900/70 border border-neutral-700/60 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500/80">
              Etapa {index + 1}
            </span>
            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300"
              >
                Remover
              </button>
            )}
          </div>
          {(field.itemFields || []).map((itemField) => (
            <div key={itemField.id}>
              <label className={labelClass}>{itemField.label}</label>
              <textarea
                rows={itemField.type === 'textarea' ? 2 : 1}
                value={row[itemField.id] || ''}
                onChange={(e) => update(index, itemField.id, e.target.value)}
                className={`${inputClass} ${itemField.type === 'text' ? 'font-medium' : 'resize-y'}`}
                placeholder={itemField.type === 'text' ? 'Quem executou' : ''}
              />
            </div>
          ))}
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="text-xs font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400"
      >
        + Adicionar etapa
      </button>
    </div>
  );
}

export function FieldRenderer({
  field,
  value,
  context,
  contextEnabled,
  otherValue,
  onValueChange,
  onContextChange,
  onContextEnabledChange,
  onOtherChange,
  disabled,
}) {
  const supportsContext = field.context === true;
  const quickOptions = field.quickOptions;

  const renderInput = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <>
            <textarea
              rows={3}
              disabled={disabled}
              value={value || ''}
              onChange={(e) => onValueChange(e.target.value)}
              className={`${inputClass} resize-y`}
              placeholder={field.placeholder || ''}
            />
            {quickOptions && (
              <QuickOptions options={quickOptions} value={value || ''} onPick={onValueChange} />
            )}
          </>
        );
      case 'number':
        return (
          <input
            type="number"
            min="0"
            disabled={disabled}
            value={value ?? ''}
            onChange={(e) => onValueChange(e.target.value === '' ? '' : Number(e.target.value))}
            className={inputClass}
          />
        );
      case 'single':
      case 'scale':
        return (
          <div className="space-y-2">
            {(field.options || []).map((option) => (
              <OptionItem
                key={option.value}
                type="radio"
                label={option.label}
                checked={value === option.value}
                onChange={() => onValueChange(value === option.value ? '' : option.value)}
              />
            ))}
          </div>
        );
      case 'multi': {
        const list = Array.isArray(value) ? value : [];
        const toggle = (optValue) => {
          const next = list.includes(optValue)
            ? list.filter((v) => v !== optValue)
            : [...list, optValue];
          onValueChange(next);
        };
        return (
          <div className="space-y-2">
            {(field.options || []).map((option) => (
              <OptionItem
                key={option.value}
                type="checkbox"
                label={option.label}
                checked={list.includes(option.value)}
                onChange={() => toggle(option.value)}
              />
            ))}
            {field.otherOption && list.includes('outro') && (
              <div className="pt-1">
                <input
                  type="text"
                  disabled={disabled}
                  value={otherValue || ''}
                  onChange={(e) => onOtherChange(e.target.value)}
                  placeholder={`${field.otherLabel || 'Outro'}: descreva`}
                  className={inputClass}
                />
              </div>
            )}
          </div>
        );
      }
      case 'list':
        return <ListField field={field} value={value} onChange={onValueChange} />;
      default:
        return (
          <>
            <input
              type="text"
              disabled={disabled}
              value={value || ''}
              onChange={(e) => onValueChange(e.target.value)}
              className={inputClass}
              placeholder={field.placeholder || ''}
            />
            {quickOptions && (
              <QuickOptions options={quickOptions} value={value || ''} onPick={onValueChange} />
            )}
          </>
        );
    }
  };

  return (
    <div className="mb-6 last:mb-0">
      <label className={labelClass}>
        {field.label}        {field.required && <span className="text-amber-500 ml-1">*</span>}
        {field.consultantOnly && (
          <span className="ml-2 normal-case tracking-normal text-neutral-500 font-medium">
            (campo exclusivo do consultor)
          </span>
        )}
        {field.optionalLabel && <span className="ml-2 normal-case tracking-normal text-neutral-500 font-medium">(opcional)</span>}
      </label>

      {field.help && <p className="text-[11px] text-neutral-500 mb-2 leading-relaxed">{field.help}</p>}

      {renderInput()}

      {supportsContext && (
        <ContextBlock
          enabled={contextEnabled === true}
          text={context || ''}
          onEnabledChange={onContextEnabledChange}
          onTextChange={onContextChange}
        />
      )}
    </div>
  );
}

export function BlockProgress({ interview, activeBlock, onSelectBlock }) {
  const progress = getProgress(interview);
  return (
    <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3 gap-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          Progresso da entrevista
        </span>
        <span className="text-xs font-mono font-bold text-amber-400">
          {progress.answered}/{progress.total} perguntas · {progress.percent}%
        </span>
      </div>

      <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-amber-500 transition-all duration-500"
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {QUESTION_LIST.reduce((acc, question) => {
          if (!acc.find((q) => q.blockId === question.blockId)) {
            acc.push({ blockId: question.blockId, question });
          }
          return acc;
        }, []).map((entry) => {
          const blockQuestions = QUESTION_LIST.filter((q) => q.blockId === entry.blockId);
          const answered = blockQuestions.filter((q) => {
            return q.fields.some(
              (f) =>
                showField(f, interview.answers || {}) &&
                (!isEmptyValue(interview.answers?.[f.id]) ||
                  (f.context && !isEmptyValue(interview.contexts?.[f.id])))
            );
          }).length;
          const isActive = activeBlock === entry.blockId;
          return (
            <button
              key={entry.blockId}
              type="button"
              onClick={() => onSelectBlock(entry.blockId)}
              className={`text-left px-3 py-2 rounded-lg border transition-colors ${
                isActive
                  ? 'border-amber-500/60 bg-amber-500/10 text-amber-400'
                  : 'border-neutral-700/60 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-600'
              }`}
            >
              <span className="block text-[10px] font-bold uppercase tracking-wider leading-tight">
                {INTERVIEW_BLOCKS.find((b) => b.id === entry.blockId)?.shortTitle ||
                  `Bloco ${entry.blockId}`}
              </span>
              <span className="block text-[11px] font-mono mt-0.5">
                {answered}/{blockQuestions.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
