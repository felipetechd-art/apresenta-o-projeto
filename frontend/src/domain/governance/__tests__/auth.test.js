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
  const mentor = { id: 'mentor1', role: ROLES.MENTOR };
  const mentorado = { id: 'mentorado1', role: ROLES.MENTORADO };

  it('Mentor pode validar fechamento mensal', () => {
    expect(canValidateMonthlyClosing(mentor)).toBe(true);
  });

  it('Mentorado não pode validar fechamento mensal', () => {
    expect(canValidateMonthlyClosing(mentorado)).toBe(false);
  });

  it('Mentor pode devolver fechamento mensal', () => {
    expect(canReturnMonthlyClosing(mentor)).toBe(true);
  });

  it('Mentorado não pode devolver fechamento mensal', () => {
    expect(canReturnMonthlyClosing(mentorado)).toBe(false);
  });

  it('Mentor pode criar revisão', () => {
    expect(canCreateRevision(mentor)).toBe(true);
  });

  it('Mentorado não pode criar revisão', () => {
    expect(canCreateRevision(mentorado)).toBe(false);
  });

  it('Mentor pode validar tarefa do roadmap', () => {
    expect(canValidateRoadmapTask(mentor)).toBe(true);
  });

  it('Mentorado não pode validar tarefa do roadmap', () => {
    expect(canValidateRoadmapTask(mentorado)).toBe(false);
  });

  it('Ninguém pode editar tarefa validada diretamente', () => {
    // Essa é uma regra de negócio que assumimos em auth.js: 
    // "false - se estiver validada, requer fluxo de revisão especial (que será implementado no futuro)"
    expect(canEditValidatedTask(mentor, {})).toBe(false);
    expect(canEditValidatedTask(mentorado, {})).toBe(false);
  });
});
