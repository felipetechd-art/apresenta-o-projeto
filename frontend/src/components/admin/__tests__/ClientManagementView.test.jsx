import { describe, it, expect, vi } from 'vitest';
import { handleClientContractDownload } from '../../../domain/commercial/contractSnapshot';
import fs from 'fs';
import path from 'path';

describe('ClientManagementView Logic', () => {
  it('10. botão exibe "BAIXAR CONTRATO (.DOC)" no código fonte', () => {
    // Para testar o texto sem montar o componente (e sem @testing-library/react)
    const codePath = path.resolve(__dirname, '../ClientManagementView.jsx');
    const code = fs.readFileSync(codePath, 'utf-8');
    expect(code).toContain('BAIXAR CONTRATO (.DOC)');
    expect(code).not.toContain('Ver contrato');
  });

  it('2. Gestão de Clientes prioriza contractSnapshot e 9. Cliente A não usa snapshot do Cliente B', () => {
    const deps = {
      downloadContractFromSnapshot: vi.fn(),
      validateContractData: vi.fn(),
      downloadContract: vi.fn()
    };
    
    const snapshotA = { clientName: 'Cliente A' };
    const snapshotB = { clientName: 'Cliente B' };

    const clientDataA = { contractSnapshot: snapshotA };
    const clientDataB = { contractSnapshot: snapshotB };

    handleClientContractDownload(clientDataA, vi.fn(), vi.fn(), deps);
    
    expect(deps.downloadContractFromSnapshot).toHaveBeenCalledWith(snapshotA);
    expect(deps.downloadContractFromSnapshot).not.toHaveBeenCalledWith(snapshotB);
    
    vi.clearAllMocks();
    
    handleClientContractDownload(clientDataB, vi.fn(), vi.fn(), deps);
    expect(deps.downloadContractFromSnapshot).toHaveBeenCalledWith(snapshotB);
    expect(deps.downloadContractFromSnapshot).not.toHaveBeenCalledWith(snapshotA);
  });

  it('5. Cliente legado sem snapshot recebe aviso e valida campos', () => {
    const confirmFn = vi.fn().mockReturnValue(true);
    const alertFn = vi.fn();
    const deps = {
      downloadContractFromSnapshot: vi.fn(),
      validateContractData: vi.fn().mockReturnValue({ valid: true, errors: [] }),
      downloadContract: vi.fn()
    };

    const clientDataLegacy = {
      clientInfo: { name: 'Legacy' },
      contractData: { personType: 'PJ' }
    }; // sem contractSnapshot

    handleClientContractDownload(clientDataLegacy, confirmFn, alertFn, deps);
    
    expect(confirmFn).toHaveBeenCalledWith(expect.stringContaining('cadastrado antes da criação do snapshot contratual'));
    expect(deps.validateContractData).toHaveBeenCalled();
    expect(deps.downloadContract).toHaveBeenCalled();
    expect(deps.downloadContractFromSnapshot).not.toHaveBeenCalled();
  });
});
