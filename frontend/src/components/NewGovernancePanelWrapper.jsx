import React from 'react';
import { GovernanceAppShell } from './dashboard/GovernanceAppShell.jsx';
import { useGovernanceDashboard } from '../hooks/useGovernanceDashboard.js';

export function NewGovernancePanelWrapper({ presentationSessionId, clientName, onClose }) {
  const companyId = null; // Prévia administrativa não possui companyId
  const dashboardData = useGovernanceDashboard({ clientName, companyId, presentationSessionId });

  return (
    <GovernanceAppShell 
      dashboardData={dashboardData} 
      onClose={onClose} 
    />
  );
}
