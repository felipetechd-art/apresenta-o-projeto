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

  it('empresa com roadmap vazio recebe o seed', () => {
    mockStorage = [];
    vi.mocked(StorageHelper.getItem).mockImplementation(() => mockStorage);
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

  it('empresa com parte do seed recebe apenas tarefas ausentes (reconciliação)', () => {
    const defaultTasks = getDefaultRoadmapTasks();
    // Simulando que o usuário tem apenas a primeira tarefa no storage
    mockStorage = [defaultTasks[0]];
    vi.mocked(StorageHelper.getItem).mockImplementation(() => mockStorage);
    
    const tasks = RoadmapRepository.getTasks();
    // Deve ter adicionado todas as outras obrigatórias
    expect(tasks.length).toBe(defaultTasks.length);
    // Mas não duplicou a primeira
    const duplicates = tasks.filter(t => t.id === defaultTasks[0].id);
    expect(duplicates.length).toBe(1);
  });

  it('tarefas personalizadas são preservadas', () => {
    const customTask = { id: 'custom-1', type: 'custom', title: 'Minha tarefa' };
    mockStorage = getDefaultRoadmapTasks().concat(customTask);
    vi.mocked(StorageHelper.getItem).mockImplementation(() => mockStorage);
    
    const tasks = RoadmapRepository.getTasks();
    const found = tasks.find(t => t.id === 'custom-1');
    expect(found).toBeDefined();
    expect(found.title).toBe('Minha tarefa');
  });

  it('tarefas validadas são preservadas integralmente', () => {
    const defaultTasks = getDefaultRoadmapTasks();
    const task = { ...defaultTasks[0], status: 'validated', validatedBy: 'Mentor', evidences: [{ url: 'http://test' }] };
    mockStorage = [task]; // Storage só tem essa tarefa
    vi.mocked(StorageHelper.getItem).mockImplementation(() => mockStorage);
    
    const tasks = RoadmapRepository.getTasks();
    const found = tasks.find(t => t.id === task.id);
    expect(found.status).toBe('validated');
    expect(found.evidences.length).toBe(1);
  });

  it('migração de schema antigo para novo', () => {
    const oldTask = { id: 'old-1', title: 'Old Task', phaseId: 'padronizacao', methodStage: 'delegar', ownerId: 'leader', type: 'mandatory' };
    mockStorage = [oldTask];
    vi.mocked(StorageHelper.getItem).mockImplementation(() => mockStorage);
    
    const tasks = RoadmapRepository.getTasks();
    const migrated = tasks.find(t => t.id === 'old-1');
    expect(migrated.phase).toBe(2);
    expect(migrated.stage).toBe('Delegar');
    expect(migrated.responsible).toBe('Liderança');
  });

  it('atualiza uma tarefa e gera auditoria', () => {
    mockStorage = [{ id: 'seed-m1-t1', title: 'Task 1', status: 'not_started' }];
    vi.mocked(StorageHelper.getItem).mockImplementation(() => mockStorage);
    const task = RoadmapRepository.getTasks().find(t => t.id === 'seed-m1-t1');
    
    task.status = 'in_progress';
    RoadmapRepository.updateTask(task, mentorado, 'edited', 'Comentário');
    
    // As in test environment storage is mocked, we check the function side effect
    expect(StorageHelper.setItem).toHaveBeenCalled();
    const saveCall = vi.mocked(StorageHelper.setItem).mock.calls;
    const savedTasks = saveCall[saveCall.length - 1][1];
    const savedTask = savedTasks.find(t => t.id === 'seed-m1-t1');
    
    expect(savedTask.status).toBe('in_progress');
    expect(savedTask.auditLog).toBeDefined();
    expect(savedTask.auditLog[0].comment).toBe('Comentário');
  });

  it('mentorado é impedido de validar uma tarefa', () => {
    mockStorage = [{ id: 'seed-m1-t1', type: 'mandatory', status: 'not_started' }];
    vi.mocked(StorageHelper.getItem).mockImplementation(() => mockStorage);
    
    expect(() => RoadmapRepository.validateTask('seed-m1-t1', mentorado))
      .toThrow('Apenas o mentor pode validar');
  });

  it('mentor pode validar uma tarefa, mas exige evidência se for obrigatória', () => {
    mockStorage = [{ id: 'seed-m1-t1', type: 'mandatory', status: 'not_started' }];
    vi.mocked(StorageHelper.getItem).mockImplementation(() => mockStorage);
    
    // Sem evidência falha
    expect(() => RoadmapRepository.validateTask('seed-m1-t1', mentor))
      .toThrow('exigem ao menos uma evidência');
      
    // Com evidência passa
    mockStorage = [{ id: 'seed-m1-t1', type: 'mandatory', status: 'not_started', evidences: [{ url: 'test.jpg' }] }];
    vi.mocked(StorageHelper.getItem).mockImplementation(() => mockStorage);
    
    RoadmapRepository.validateTask('seed-m1-t1', mentor);
    expect(StorageHelper.setItem).toHaveBeenCalled();
  });

  it('adiciona tarefa personalizada preservando o seed original', () => {
    mockStorage = getDefaultRoadmapTasks();
    vi.mocked(StorageHelper.getItem).mockImplementation(() => mockStorage);
    const newTask = { id: 'custom1', type: 'custom', status: 'not_started' };
    
    RoadmapRepository.addTask(newTask, mentorado);
    expect(mockStorage.length).toBe(getDefaultRoadmapTasks().length + 1);
    const added = mockStorage.find(t => t.id === 'custom1');
    expect(added).toBeDefined();
    expect(added.auditLog.length).toBe(1);
  });

  it('roadmap legado com IDs dinâmicos é migrado para IDs estáveis sem duplicar tarefas', () => {
    // Old dynamic ID from previous version
    const oldTask = { id: 'task-1', title: 'Realizar diagnóstico IDE.', month: 1, type: 'mandatory', phaseId: 'fundacao' };
    mockStorage = [oldTask];
    vi.mocked(StorageHelper.getItem).mockImplementation(() => mockStorage);
    
    const tasks = RoadmapRepository.getTasks();
    const defaultTasksLength = getDefaultRoadmapTasks().length;
    
    // Deve ter o mesmo número de tarefas do seed
    expect(tasks.length).toBe(defaultTasksLength);
    // A tarefa task-1 deve ter sido migrada para seed-m1-t1
    expect(tasks.find(t => t.id === 'task-1')).toBeUndefined();
    expect(tasks.find(t => t.id === 'seed-m1-t1')).toBeDefined();
    expect(tasks.find(t => t.id === 'seed-m1-t1').title).toBe('Realizar diagnóstico IDE.');
  });

  it('duas empresas possuem roadmaps independentes pelo companyId', () => {
    // Se o getItem retorna vazio para ambas, cada uma receberá o seed isolado.
    vi.mocked(StorageHelper.getItem).mockReturnValue([]);
    RoadmapRepository.getTasks('company-A');
    RoadmapRepository.getTasks('company-B');
    
    const setItemCalls = vi.mocked(StorageHelper.setItem).mock.calls;
    const callsForA = setItemCalls.filter(call => call[2] === 'company-A');
    const callsForB = setItemCalls.filter(call => call[2] === 'company-B');
    
    expect(callsForA.length).toBeGreaterThan(0);
    expect(callsForB.length).toBeGreaterThan(0);
  });
});
