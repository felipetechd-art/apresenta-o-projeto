import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, isAuthenticated, isAdmin, loading, adminLoading, authEnabled } = useAuth();
  const location = useLocation();

  if (!authEnabled) {
    // Se a autenticação estiver globalmente desativada por feature flag,
    // o acesso não é protegido de forma rígida (idealmente isso seria false em prod).
    return children;
  }

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-4" />
        <p className="text-neutral-400 text-sm">Verificando credenciais...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redireciona para login e guarda a intenção de rota original
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Usuário logado mas sem documento em systemAdmins com active != false
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center font-sans p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <ShieldCheck className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-light text-white mb-2">Acesso Negado</h2>
        <p className="text-neutral-400 max-w-md mb-8">
          Sua conta está autenticada, mas você não possui privilégios de administrador para acessar o Painel de Gestão.
        </p>
        <button
          onClick={() => window.location.href = '/admin/login'}
          className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl border border-neutral-700 transition-colors text-sm font-medium"
        >
          Voltar para o Login
        </button>
      </div>
    );
  }

  // Autorizado
  return children;
}
