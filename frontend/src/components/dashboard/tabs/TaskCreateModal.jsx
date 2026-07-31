import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

export function TaskCreateModal({ onClose, onSave, phase }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pillar, setPillar] = useState('governance');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSave({
      id: `custom-${crypto.randomUUID()}`,
      title,
      description,
      pillar,
      phase,
      month: phase === 1 ? 1 : phase === 2 ? 4 : 7, // Mês padrão base na fase
      status: 'not_started',
      type: 'custom',
      weight: 1,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#080f1e] border border-gray-800 rounded-xl z-[70] shadow-2xl flex flex-col">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/40">
          <h3 className="text-white font-bold">Adicionar Tarefa Personalizada</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Título da Tarefa</label>
            <input 
              required
              autoFocus
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-[var(--color-primary-yellow)] outline-none" 
              placeholder="Ex: Treinar equipe..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descrição</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-[var(--color-primary-yellow)] outline-none resize-none h-24" 
              placeholder="Descreva o objetivo e passos da tarefa..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Pilar</label>
            <select 
              value={pillar} 
              onChange={e => setPillar(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-[var(--color-primary-yellow)] outline-none cursor-pointer"
            >
              <option value="governance">Governança</option>
              <option value="people">Pessoas e Lideranças</option>
              <option value="processes">Processos e Rotinas</option>
              <option value="delegation">Delegação e Alçadas</option>
            </select>
          </div>
          <button type="submit" className="mt-2 w-full py-2 bg-[var(--color-primary-yellow)] text-black rounded font-bold uppercase hover:bg-yellow-500 flex items-center justify-center gap-2 cursor-pointer shadow-lg">
            <Save className="w-4 h-4" /> Salvar Tarefa
          </button>
        </form>
      </div>
    </>
  );
}
