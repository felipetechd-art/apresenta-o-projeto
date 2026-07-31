import { describe, it, expect } from 'vitest';
import { 
  ROLES, 
  canValidateMonthlyClosing, 
  canReturnMonthlyClosing, 
  canCreateRevision, 
  canValidateRoadmapTask, 
  canEditValidatedTask 
} from '../auth.js';

describe('Auth Domain Rules', () => {
  const advisor = { id: 'advisor1', role: ROLES.ADVISOR };
  const client = { id: 'client1', role: ROLES.CLIENT };

  it('Conselheiro pode validar fechamento mensal', () => {
    expect(canValidateMonthlyClosing(advisor)).toBe(true);
  });

  it('Cliente não pode validar fechamento mensal', () => {
    expect(canValidateMonthlyClosing(client)).toBe(false);
  });

  it('Conselheiro pode devolver fechamento mensal', () => {
    expect(canReturnMonthlyClosing(advisor)).toBe(true);
  });

  it('Cliente não pode devolver fechamento mensal', () => {
    expect(canReturnMonthlyClosing(client)).toBe(false);
  });

  it('Conselheiro pode criar revisão', () => {
    expect(canCreateRevision(advisor)).toBe(true);
  });

  it('Cliente não pode criar revisão', () => {
    expect(canCreateRevision(client)).toBe(false);
  });

  it('Conselheiro pode validar tarefa do roadmap', () => {
    expect(canValidateRoadmapTask(advisor)).toBe(true);
  });

  it('Cliente não pode validar tarefa do roadmap', () => {
    expect(canValidateRoadmapTask(client)).toBe(false);
  });

  it('Ninguém pode editar tarefa validada diretamente', () => {
    // Essa é uma regra de negócio que assumimos em auth.js: 
    // "false - se estiver validada, requer fluxo de revisão especial (que será implementado no futuro)"
    expect(canEditValidatedTask(advisor, {})).toBe(false);
    expect(canEditValidatedTask(client, {})).toBe(false);
  });
});
