import React, { useState, useEffect } from 'react';
import { PresentationGovernanceDraftRepository } from '../repositories/PresentationGovernanceDraftRepository';
import { PlayCircle, Search, Calendar, User, Clock, ShieldAlert } from 'lucide-react';

export default function ApresentacoesTab() {
  const [presentations, setPresentations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const list = PresentationGovernanceDraftRepository.list();
    const arr = Object.values(list).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    setPresentations(arr);
  }, []);

  const filtered = presentations.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.company && p.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-black text-white uppercase">Apresentações (PGE)</h2>
          <p className="text-sm text-gray-400 mt-1">Gerencie as apresentações e painéis prévios criados para leads e clientes.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary-yellow)] to-[#b8860b] text-black font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer"
        >
          <PlayCircle className="w-5 h-5" />
          Nova Apresentação
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-black/40 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar por cliente ou empresa..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-[var(--color-primary-yellow)] outline-none transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-900/50 border-b border-gray-800 text-[10px] uppercase tracking-wider text-gray-500">
                <th className="p-4 font-bold">Cliente / Empresa</th>
                <th className="p-4 font-bold">Última Atualização</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(p => (
                <tr key={p.presentationSessionId} className="border-b border-gray-800 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black/50 border border-gray-700 flex items-center justify-center text-gray-400 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.company || 'Empresa não informada'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      {new Date(p.updatedAt).toLocaleDateString('pt-BR')}
                      <Clock className="w-3 h-3 text-gray-500 ml-2" />
                      {new Date(p.updatedAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] font-bold uppercase tracking-wider">
                      <ShieldAlert className="w-3 h-3" /> Em Negociação
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => window.location.href = `/?session=${p.presentationSessionId}`}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs font-bold text-gray-300 transition-colors cursor-pointer"
                        title="Retomar Slide de Apresentação"
                      >
                        Retomar Apresentação
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    Nenhuma apresentação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
