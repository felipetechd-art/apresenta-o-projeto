import React, { useEffect, useState } from 'react';
import { GovernanceAppShell } from './dashboard/GovernanceAppShell.jsx';
import { useGovernanceDashboard } from '../hooks/useGovernanceDashboard.js';
import { PresentationGovernanceDraftRepository } from '../repositories/PresentationGovernanceDraftRepository.js';
import { FirestoreSyncService } from '../repositories/FirestoreSyncService.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import ClientLoginView from './ClientLoginView.jsx';

export function NewGovernancePanelWrapper({ presentationSessionId, clientName, onClose, isMagicLink }) {
  const { user, isAdmin } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [companyId, setCompanyId] = useState(null);
  const [clientEmail, setClientEmail] = useState(null);
  const [status, setStatus] = useState('draft');

  useEffect(() => {
    async function loadData() {
      // 1. Tenta achar localmente (quando é o Admin acessando da própria máquina)
      let draft = PresentationGovernanceDraftRepository.findBySessionId(presentationSessionId);
      let foundCompanyId = draft?.companyId || null;
      let foundEmail = draft?.clientEmail || null;
      let foundStatus = draft?.status || 'draft';

      // 2. Busca na nuvem para garantir que outra máquina acesse ou para manter atualizado
      const cloudData = await FirestoreSyncService.getCompanyBySessionId(presentationSessionId);
      
      if (cloudData) {
        foundCompanyId = cloudData.companyId;
        foundEmail = cloudData.clientEmail;
        foundStatus = cloudData.status;
        
        // Baixa os dados de roadmap e monthly_closing para o localStorage desta máquina
        await FirestoreSyncService.syncFromCloud(foundCompanyId);
      }

      setCompanyId(foundCompanyId);
      setClientEmail(foundEmail);
      setStatus(foundStatus);
      setLoading(false);
    }
    
    loadData();
  }, [presentationSessionId]);

  const dashboardData = useGovernanceDashboard({ clientName, companyId, presentationSessionId, isMagicLink });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-lg font-bold animate-pulse">Sincronizando painel do cliente...</div>
      </div>
    );
  }

  // Se o painel for ativo, exige autenticação do cliente (ou admin bypass ou magic link)
  if (status === 'active' && !isAdmin && !isMagicLink) {
    if (!user) {
      return <ClientLoginView error={error} />;
    }
    
    if (user.email !== clientEmail) {
      return (
        <ClientLoginView 
          error={`Acesso negado para ${user.email}. Utilize o e-mail autorizado (${clientEmail}) para acessar.`} 
        />
      );
    }
  }

  return (
    <GovernanceAppShell 
      dashboardData={dashboardData} 
      onClose={onClose} 
    />
  );
}
