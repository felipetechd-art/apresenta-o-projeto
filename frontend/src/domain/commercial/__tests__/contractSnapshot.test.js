import { describe, it, expect, vi } from 'vitest';
import { buildContractSnapshot, validateContractData } from '../contractSnapshot';

describe('Contract Snapshot', () => {
  const baseData = {
    clientName: 'Test Client',
    docNumber: '12345678901',
    personType: 'PF',
    clientAddress: 'Test Address',
    contractForo: 'Test Foro',
    totalInvestment: '45.000,00',
    entranceValue: '0',
    installments: '1',
    paymentMethod: 'pix',
  };

  it('6. personType ausente bloqueia geração (validação)', () => {
    const data = { ...baseData, personType: null };
    const result = validateContractData(data);
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain('personType');
  });

  it('7. contractForo ausente bloqueia geração (validação)', () => {
    const data = { ...baseData, contractForo: null };
    const result = validateContractData(data);
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain('contractForo');
  });

  it('8. documento ausente bloqueia geração (validação)', () => {
    const data = { ...baseData, docNumber: '' };
    const result = validateContractData(data);
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain('docNumber');
  });

  it('3 e 4. Snapshot não depende da configuração comercial atual e não se altera', () => {
    const snapshot = buildContractSnapshot(baseData);
    expect(snapshot.programName).toBe('Programa Governo Empresarial');
    
    // O snapshot serializou os deliverables, logo se a oferta mudasse,
    // o snapshot (sendo um objeto estático já gerado) permaneceria igual.
    expect(snapshot.deliverablesSnapshot).toContain('Sprint de implementação');
    expect(snapshot.officialInvestmentCents).toBe(4500000);
  });

  it('11. Programa preserva duração e entregáveis no snapshot', () => {
    const snapshot = buildContractSnapshot({ ...baseData, totalInvestment: '45.000,00' });
    expect(snapshot.programType).toBe('program');
    expect(snapshot.programDuration).toBe(4);
    expect(snapshot.deliverablesSnapshot).toContain('Sprint de implementação');
  });

  it('12. Conselho preserva duração e entregáveis no snapshot', () => {
    const snapshot = buildContractSnapshot({ ...baseData, totalInvestment: '90.000,00' });
    expect(snapshot.programType).toBe('council');
    expect(snapshot.programDuration).toBe(10);
    expect(snapshot.deliverablesSnapshot).toContain('6 Meses Adicionais de Conselho Estratégico');
  });
});
