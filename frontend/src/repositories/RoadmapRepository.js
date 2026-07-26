// @ts-check
import { StorageHelper } from "./StorageHelper.js";
import { getDefaultRoadmapTasks } from "../domain/governance/roadmapData.js";
import { canValidateRoadmapTask, canEditValidatedTask } from "../domain/governance/auth.js";
import { createAuditEvent } from "../domain/governance/audit.js";

const KEY = "roadmap_tasks";

export class RoadmapRepository {
  /**
   * Obtém todas as tarefas. Se estiver vazio, popula com as tarefas padrão (seed).
   * @param {string} companyId
   * @returns {import("../domain/governance/types.js").RoadmapTask[]}
   */
  static getTasks(companyId = 'demo-company') {
    const storedTasks = StorageHelper.getItem(KEY, [], companyId);
    const seedTasks = getDefaultRoadmapTasks();
    
    // Se não há nada no Storage (primeiro acesso)
    if (!storedTasks || storedTasks.length === 0) {
      StorageHelper.setItem(KEY, seedTasks, companyId);
      return seedTasks;
    }

    // Reconciliação (Migração e inserção de obrigatórias ausentes)
    let needsUpdate = false;
    const reconciledTasks = storedTasks.map(t => {
      // Migração de schema antigo para novo
      let migrated = { ...t };
      if (migrated.phaseId && !migrated.phase) {
        migrated.phase = migrated.phaseId === 'fundacao' ? 1 : migrated.phaseId === 'padronizacao' ? 2 : 3;
        needsUpdate = true;
      }
      if (migrated.methodStage && !migrated.stage) {
        migrated.stage = migrated.methodStage === 'diagnosticar' ? 'Diagnosticar' : migrated.methodStage === 'organizar' ? 'Organizar' : migrated.methodStage === 'delegar' ? 'Delegar' : migrated.methodStage === 'automatizar' ? 'Automatizar' : 'Governar';
        needsUpdate = true;
      }
      if (migrated.ownerId && !migrated.responsible) {
        migrated.responsible = migrated.ownerId === 'owner' ? 'Empreendedor' : migrated.ownerId === 'leader' ? 'Liderança' : 'Time';
        needsUpdate = true;
      }
      return migrated;
    });

    const normalize = (str) => {
      if (!str) return "";
      return str.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    for (const seedTask of seedTasks) {
      // Comparação determinística: fallback para buscar por título igual (para migração de seeds com ID dinâmico legado)
      const exists = reconciledTasks.find(t => 
        t.id === seedTask.id || 
        (t.type === 'mandatory' && t.month === seedTask.month && normalize(t.title) === normalize(seedTask.title))
      );
      
      if (exists) {
        // Se encontramos uma correspondência que usava um ID antigo dinâmico, migramos para o ID estável
        if (exists.id !== seedTask.id) {
          exists.id = seedTask.id; // Migra para o ID estável preservando status, etc
          needsUpdate = true;
        }
      } else if (seedTask.type === 'mandatory') {
        reconciledTasks.push(seedTask);
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      StorageHelper.setItem(KEY, reconciledTasks, companyId);
    }

    return reconciledTasks;
  }

  /**
   * Salva a lista completa de tarefas.
   * @param {import("../domain/governance/types.js").RoadmapTask[]} tasks 
   * @param {string} companyId
   */
  static saveTasks(tasks, companyId = 'demo-company') {
    StorageHelper.setItem(KEY, tasks, companyId);
  }

  /**
   * Atualiza uma única tarefa, gerando evento de auditoria.
   * @param {import("../domain/governance/types.js").RoadmapTask} updatedTask 
   * @param {import("../domain/governance/auth.js").Actor} actor
   * @param {string} action
   * @param {string} [comment]
   * @param {string} companyId
   */
  static updateTask(updatedTask, actor, action = 'edited', comment = '', companyId = 'demo-company') {
    const tasks = this.getTasks(companyId);
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    
    if (index !== -1) {
      const existingTask = tasks[index];

      if (existingTask.status === 'validated' && !canEditValidatedTask(actor, existingTask)) {
        throw new Error("Acesso Negado: Uma tarefa validada não pode ser editada diretamente.");
      }

      // Adicionar log de auditoria
      const auditEvent = createAuditEvent({
        entityId: updatedTask.id,
        entityType: 'task',
        action,
        actor,
        previousStatus: existingTask.status,
        newStatus: updatedTask.status,
        comment
      });

      if (!updatedTask.auditLog) updatedTask.auditLog = [];
      updatedTask.auditLog.push(auditEvent);
      updatedTask.updatedAt = new Date().toISOString();

      tasks[index] = updatedTask;
      this.saveTasks(tasks, companyId);
    }
  }

  /**
   * Valida uma tarefa. Apenas mentores podem validar e ela exige checklist e evidência.
   * @param {string} taskId 
   * @param {import("../domain/governance/auth.js").Actor} actor 
   * @param {string} companyId
   */
  static validateTask(taskId, actor, companyId = 'demo-company') {
    if (!canValidateRoadmapTask(actor)) {
      throw new Error("Acesso Negado: Apenas o mentor pode validar uma tarefa do Roadmap.");
    }

    const tasks = this.getTasks(companyId);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) throw new Error("Tarefa não encontrada.");

    const task = tasks[index];

    // Regra de Negócio: Checklist Obrigatório e Evidências
    if (task.type === 'mandatory' && (!task.evidences || task.evidences.length === 0)) {
       throw new Error("Validação Rejeitada: Tarefas obrigatórias exigem ao menos uma evidência.");
    }

    const auditEvent = createAuditEvent({
        entityId: task.id,
        entityType: 'task',
        action: 'validated',
        actor,
        previousStatus: task.status,
        newStatus: 'validated'
    });

    if (!task.auditLog) task.auditLog = [];
    task.auditLog.push(auditEvent);

    task.status = "validated";
    task.validatedAt = new Date().toISOString();
    task.validatedBy = actor.id || actor.name;
    task.updatedAt = new Date().toISOString();

    tasks[index] = task;
    this.saveTasks(tasks, companyId);
  }

  /**
   * Adiciona uma tarefa personalizada ao roadmap (sem alterar o seed original).
   * @param {import("../domain/governance/types.js").RoadmapTask} newTask 
   * @param {import("../domain/governance/auth.js").Actor} actor
   * @param {string} companyId
   */
  static addTask(newTask, actor, companyId = 'demo-company') {
    const tasks = this.getTasks(companyId);
    
    newTask.createdAt = new Date().toISOString();
    newTask.updatedAt = newTask.createdAt;
    newTask.auditLog = [
      createAuditEvent({
        entityId: newTask.id,
        entityType: 'task',
        action: 'created',
        actor,
        previousStatus: 'none',
        newStatus: newTask.status
      })
    ];

    tasks.push(newTask);
    this.saveTasks(tasks, companyId);
  }
}
