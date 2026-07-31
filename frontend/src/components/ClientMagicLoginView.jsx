import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Target, AlertCircle, Loader } from 'lucide-react';
import { NewGovernancePanelWrapper } from './NewGovernancePanelWrapper.jsx';

export default function ClientMagicLoginView() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [tokenData, setTokenData] = useState(null);
  const [error, setError] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Link de acesso inválido ou expirado.");
      return;
    }
    
    try {
      const decoded = atob(token);
      const parsed = JSON.parse(decoded);
      if (!parsed.sessionId || !parsed.name) {
        throw new Error("Dados inválidos no token.");
      }
      setTokenData(parsed);
    } catch (e) {
      setError("Link de acesso malformado ou inválido.");
    }
  }, [token]);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLogged(true);
    }, 1000);
  };

  if (isLogged && tokenData) {
    return (
      <NewGovernancePanelWrapper 
        presentationSessionId={tokenData.sessionId} 
        clientName={tokenData.name} 
        onClose={() => setIsLogged(false)}
        isMagicLink={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/40 border border-gray-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[var(--color-primary-yellow)]/20 rounded-full blur-[50px] -z-10"></div>
        
        <div className="flex justify-center mb-8">
          <div className="bg-black/50 p-4 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(212,175,55,0.15)] relative group">
            <div className="absolute inset-0 bg-[var(--color-primary-yellow)]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Target className="w-10 h-10 text-[var(--color-primary-yellow)] relative z-10" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-heading font-bold text-white mb-2">Acesso ao Painel</h2>
          <p className="text-gray-400 text-sm">
            Bem-vindo ao Centro de Governança PGE.
          </p>
        </div>

        {error ? (
          <div className="mb-6 bg-red-900/20 border border-red-900/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : tokenData ? (
          <div className="space-y-6">
            <div className="bg-white/5 border border-gray-800 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                  Identificação
                </label>
                <div className="text-white font-medium">{tokenData.name}</div>
              </div>
              {tokenData.email && (
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                    E-mail Vinculado
                  </label>
                  <div className="text-gray-300 text-sm">{tokenData.email}</div>
                </div>
              )}
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-[var(--color-primary-yellow)] hover:bg-[#ffe55c] text-black font-bold uppercase tracking-wider py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Autenticando...
                </>
              ) : (
                'Acessar Painel'
              )}
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center py-8">
            <Loader className="w-8 h-8 text-[#d4af37] animate-spin" />
          </div>
        )}

      </div>
    </div>
  );
}
