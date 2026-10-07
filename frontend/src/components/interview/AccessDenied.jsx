import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export function AccessDenied() {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center font-sans p-6 text-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
        <ShieldAlert className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-2xl font-light text-white mb-2">Acesso negado</h2>
      <p className="text-neutral-400 max-w-md mb-8 text-sm">
        Os dados da Entrevista Inicial são restritos a administradores ativos do sistema.
      </p>
      <Link
        to="/admin"
        className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl border border-neutral-700 transition-colors text-sm font-medium"
      >
        Voltar ao painel
      </Link>
    </div>
  );
}
