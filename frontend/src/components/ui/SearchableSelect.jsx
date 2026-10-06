import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Digite para buscar...',
  emptyLabel = '— Selecione —',
  className = ''
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const selected = options.find(o => o.value === value);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return options.filter(o =>
      o.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q)
    );
  }, [options, query]);

  // Fecha ao clicar fora
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Abre e foca no input
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSelect = (opt) => {
    onChange(opt.value);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Campo display / gatilho */}
      <button
        type="button"
        onClick={() => { setOpen(prev => !prev); setQuery(''); }}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-left text-white outline-none focus:border-amber-500 transition-colors cursor-pointer flex items-center justify-between gap-2"
      >
        <span className={`truncate ${selected ? 'text-white' : 'text-neutral-500'}`}>
          {selected ? selected.label : emptyLabel}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown com busca */}
      {open && (
        <div className="absolute z-50 mt-1.5 left-0 right-0 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Input de busca */}
          <div className="p-2.5 border-b border-neutral-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Escape') { setOpen(false); setQuery(''); }
                  if (e.key === 'Enter' && filtered.length > 0) {
                    e.preventDefault();
                    handleSelect(filtered[0]);
                  }
                }}
                placeholder={placeholder}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white outline-none focus:border-amber-500 placeholder:text-neutral-500"
              />
            </div>
          </div>

          {/* Lista */}
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-center text-xs text-neutral-500">
                Nenhum segmento encontrado. Tente outro termo ou escolha "Outro".
              </div>
            )}
            {filtered.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer
                  ${opt.value === value
                    ? 'bg-amber-500/15 text-amber-400 font-medium'
                    : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
              >
                <span className="truncate">{opt.label}</span>
                {opt.value === value && <Check className="w-3.5 h-3.5 shrink-0 text-amber-400" />}
              </button>
            ))}
          </div>

          {/* Rodapé */}
          <div className="px-4 py-2 border-t border-neutral-800 text-[10px] text-neutral-500 flex items-center justify-between">
            <span>{filtered.length} de {options.length} segmentos</span>
            <span>Enter seleciona o 1º resultado</span>
          </div>
        </div>
      )}
    </div>
  );
}
