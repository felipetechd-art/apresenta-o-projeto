import { describe, it, expect } from 'vitest';
import { mapPresentationToGovernanceDraft } from '../presentationMapper';

describe('presentationMapper', () => {
  it('1. Presentation salva contractSnapshot quando o contrato for gerado', () => {
    const data = {
      clientName: 'Teste Snapshot',
      totalInvestment: '45.000,00',
      contractGenerated: true, // Condição para gerar o snapshot
      personType: 'PJ',
      contractForo: 'Barueri/SP'
    };
    
    const draft = mapPresentationToGovernanceDraft(data);
    
    expect(draft.contractSnapshot).toBeDefined();
    expect(draft.contractSnapshot).not.toBeNull();
    expect(draft.contractSnapshot.clientName).toBe('Teste Snapshot');
    expect(draft.contractSnapshot.programName).toBe('Programa Governo Empresarial');
  });

  it('Presentation NÃO salva contractSnapshot se contractGenerated for false', () => {
    const data = {
      clientName: 'Teste Sem Snapshot',
      totalInvestment: '45.000,00',
      contractGenerated: false,
    };
    
    const draft = mapPresentationToGovernanceDraft(data);
    
    expect(draft.contractSnapshot).toBeNull();
  });
});
