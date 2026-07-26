import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MonthlyClosingRepository } from '../../../repositories/MonthlyClosingRepository.js';
import { StorageHelper } from '../../../repositories/StorageHelper.js';
import { ROLES } from '../../governance/auth.js';

// Mocks
vi.mock('../../../repositories/StorageHelper.js', () => ({
  StorageHelper: {
    getItem: vi.fn(),
    setItem: vi.fn()
  }
}));

describe('MonthlyClosingRepository', () => {
  let mockStorage = [];
  const mentor = { id: 'm1', role: ROLES.MENTOR };
  const mentorado = { id: 'u1', role: ROLES.MENTORADO };

  beforeEach(() => {
    mockStorage = [];
    vi.mocked(StorageHelper.getItem).mockImplementation(() => mockStorage);
    vi.mocked(StorageHelper.setItem).mockImplementation((key, val) => { mockStorage = val; });
  });

  it('cria um rascunho', () => {
    const snap = { id: 'snap-1', month: 1, status: 'draft', metrics: { clo: 10 } };
    MonthlyClosingRepository.saveSnapshot(snap, mentorado);
    expect(mockStorage.length).toBe(1);
    expect(mockStorage[0].status).toBe('draft');
  });

  it('atualiza o mesmo rascunho (sem duplicar)', () => {
    const snap = { id: 'snap-1', month: 1, status: 'draft', metrics: { clo: 10 } };
    MonthlyClosingRepository.saveSnapshot(snap, mentorado);
    
    const snapUpdated = { id: 'snap-1', month: 1, status: 'submitted', metrics: { clo: 20 } };
    MonthlyClosingRepository.saveSnapshot(snapUpdated, mentorado);
    
    expect(mockStorage.length).toBe(1);
    expect(mockStorage[0].status).toBe('submitted');
    expect(mockStorage[0].metrics.clo).toBe(20);
  });

  it('valida o fechamento apenas se for mentor', () => {
    const snap = { id: 'snap-1', month: 1, status: 'submitted' };
    MonthlyClosingRepository.saveSnapshot(snap, mentorado);
    
    expect(() => MonthlyClosingRepository.validateSnapshot('snap-1', mentorado)).toThrow('Acesso Negado');
    MonthlyClosingRepository.validateSnapshot('snap-1', mentor);
    
    expect(mockStorage[0].status).toBe('validated');
  });

  it('bloqueia sobrescrita de fechamento validado pelo mentorado', () => {
    const snap = { id: 'snap-1', month: 1, status: 'submitted' };
    MonthlyClosingRepository.saveSnapshot(snap, mentorado);
    MonthlyClosingRepository.validateSnapshot('snap-1', mentor);

    const snapUpdated = { id: 'snap-1', month: 1, status: 'submitted', metrics: { clo: 50 } };
    expect(() => MonthlyClosingRepository.saveSnapshot(snapUpdated, mentorado))
      .toThrow('Não é possível alterar um fechamento validado sem criar uma nova revisão autorizada.');
  });

  it('devolve o fechamento (mentor)', () => {
    const snap = { id: 'snap-1', month: 1, status: 'submitted' };
    MonthlyClosingRepository.saveSnapshot(snap, mentorado);
    
    MonthlyClosingRepository.returnSnapshot('snap-1', mentor, 'Falta documentar horas');
    expect(mockStorage[0].status).toBe('returned');
    expect(mockStorage[0].returnReason).toBe('Falta documentar horas');
  });

  it('cria nova revisão e preserva o histórico', () => {
    const snap = { id: 'snap-1', month: 1, status: 'submitted', revision: 1 };
    MonthlyClosingRepository.saveSnapshot(snap, mentorado);
    MonthlyClosingRepository.validateSnapshot('snap-1', mentor);

    // Mentorado não pode criar revisão
    expect(() => MonthlyClosingRepository.createRevision(1, mentorado)).toThrow('Acesso Negado');

    // Mentor cria nova revisão
    const rev2 = MonthlyClosingRepository.createRevision(1, mentor);
    
    expect(mockStorage.length).toBe(2);
    expect(rev2.supersedesId).toBe('snap-1');
    expect(rev2.revision).toBe(2);
    expect(rev2.status).toBe('draft');

    // getSnapshots() deve retornar a revisão mais recente
    const latest = MonthlyClosingRepository.getSnapshots();
    expect(latest.length).toBe(1);
    expect(latest[0].revision).toBe(2);
  });

  it('preserva meses anteriores', () => {
    const snap1 = { id: 'snap-1', month: 1, status: 'validated', revision: 1 };
    const snap2 = { id: 'snap-2', month: 2, status: 'draft', revision: 1 };
    MonthlyClosingRepository.saveSnapshot(snap1, mentorado);
    MonthlyClosingRepository.saveSnapshot(snap2, mentorado);
    
    expect(mockStorage.length).toBe(2);
    expect(MonthlyClosingRepository.getSnapshots().length).toBe(2);
  });

  it('fechamentos mensais permanecem isolados por companyId', () => {
    vi.mocked(StorageHelper.getItem).mockReturnValue([]);
    
    const snap1 = { id: 'snap-1', month: 1, status: 'draft', revision: 1 };
    MonthlyClosingRepository.saveSnapshot(snap1, mentorado, 'company-A');
    
    const snap2 = { id: 'snap-2', month: 1, status: 'draft', revision: 1 };
    MonthlyClosingRepository.saveSnapshot(snap2, mentorado, 'company-B');
    
    const setItemCalls = vi.mocked(StorageHelper.setItem).mock.calls;
    const callsForA = setItemCalls.filter(call => call[2] === 'company-A');
    const callsForB = setItemCalls.filter(call => call[2] === 'company-B');
    
    expect(callsForA.length).toBeGreaterThan(0);
    expect(callsForB.length).toBeGreaterThan(0);
  });
});
