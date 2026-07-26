import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RoadmapRepository } from '../../../repositories/RoadmapRepository.js';
import { StorageHelper } from '../../../repositories/StorageHelper.js';
import { ROLES } from '../../governance/auth.js';
import { getDefaultRoadmapTasks } from '../../governance/roadmapData.js';

vi.mock('../../../repositories/StorageHelper.js', () => ({
  StorageHelper: {
    getItem: vi.fn(),
    setItem: vi.fn()
  }
}));

describe('RoadmapRepository', () => {
  let mockStorage = [];
  const mentor = { id: 'm1', role: ROLES.MENTOR };
  const mentorado = { id: 'u1', role: ROLES.MENTORADO };

  beforeEach(() => {
    mockStorage = [];
    vi.mocked(StorageHelper.getItem).mockImplementation(() => mockStorage);
    vi.mocked(StorageHelper.setItem).mockImplementation((key, val) => { mockStorage = val; });
  });

  it('inicializa o roadmap com as tarefas padrão (seed)', () => {
    const tasks = RoadmapRepository.getTasks();
    expect(tasks.length).toBeGreaterThan(0);
    expect(mockStorage.length).toBeGreaterThan(0);
  });

  it('não duplica o seed do roadmap ao inicializar', () => {
    RoadmapRepository.getTasks();
    const len1 = mockStorage.length;
    
    // Segunda vez já tem dados
    vi.mocked(StorageHelper.getItem).mockImplementation(() => mockStorage);
    RoadmapRepository.getTasks();
    expect(mockStorage.length).toBe(len1); // não duplicou
  });

  it('atualiza uma tarefa e gera auditoria', () => {
    mockStorage = [{ id: 't1', title: 'Task 1', status: 'not_started' }];
    vi.mocked(StorageHelper.getItem).mockImplementation(() => mockStorage);

    const taskToUpdate = { id: 't1', title: 'Task 1', status: 'in_execution' };
    RoadmapRepository.updateTask(taskToUpdate, mentorado, 'execution_started', 'Iniciando...');
    
    expect(mockStorage[0].status).toBe('in_execution');
    expect(mockStorage[0].auditLog).toBeDefined();
    expect(mockStorage[0].auditLog.length).toBe(1);
    expect(mockStorage[0].auditLog[0].action).toBe('execution_started');
  });

  it('mentorado é impedido de validar uma tarefa', () => {
    mockStorage = [{ id: 't1', title: 'Task 1', status: 'awaiting_validation', type: 'mandatory', evidences: [{id: 'e1'}] }];
    expect(() => RoadmapRepository.validateTask('t1', mentorado)).toThrow('Acesso Negado');
  });

  it('mentor pode validar uma tarefa, mas exige evidência se for obrigatória', () => {
    // Sem evidência (deve falhar)
    mockStorage = [{ id: 't1', title: 'Task 1', status: 'awaiting_validation', type: 'mandatory', evidences: [] }];
    expect(() => RoadmapRepository.validateTask('t1', mentor)).toThrow('Validação Rejeitada');

    // Com evidência (deve passar)
    mockStorage = [{ id: 't2', title: 'Task 2', status: 'awaiting_validation', type: 'mandatory', evidences: [{id: 'ev1'}] }];
    RoadmapRepository.validateTask('t2', mentor);
    expect(mockStorage[0].status).toBe('validated');
  });

  it('adiciona tarefa personalizada preservando o seed original', () => {
    mockStorage = [{ id: 'seed1', type: 'mandatory' }];
    const newTask = { id: 'custom1', type: 'custom', status: 'not_started' };
    
    RoadmapRepository.addTask(newTask, mentorado);
    expect(mockStorage.length).toBe(2);
    expect(mockStorage[1].id).toBe('custom1');
    expect(mockStorage[1].auditLog.length).toBe(1);
  });
});
