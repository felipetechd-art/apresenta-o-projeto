// @ts-check
import { StorageHelper } from "./StorageHelper.js";
import { getDefaultRoadmapTasks } from "../domain/governance/roadmapData.js";
import { canValidateRoadmapTask, canEditValidatedTask } from "../domain/governance/auth.js";
import { createAuditEvent } from "../domain/governance/audit.js";

const KEY = "roadmap_tasks";

export class RoadmapRepository {
  /**
   * Obtém todas as tarefas. Se estiver vazio, popula com as tarefas padrão (seed).
   * @returns {import("../domain/governance/types.js").RoadmapTask[]}
   */
  static getTasks() {
    let tasks = StorageHelper.getItem(KEY, []);
    
    if (!tasks || tasks.length === 0) {
      tasks = getDefaultRoadmapTasks();
      StorageHelper.setItem(KEY, tasks);
    }
    
    return tasks;
  }

  /**
   * Salva a lista completa de tarefas.
   * @param {import("../domain/governance/types.js").RoadmapTask[]} tasks 
   */
  static saveTasks(tasks) {
    StorageHelper.setItem(KEY, tasks);
  }

  /**
   * Atualiza uma única tarefa, gerando evento de auditoria.
   * @param {import("../domain/governance/types.js").RoadmapTask} updatedTask 
   * @param {import("../domain/governance/auth.js").Actor} actor
   * @param {string} action
   * @param {string} [comment]
   */
  static updateTask(updatedTask, actor, action = 'edited', comment = '') {
    const tasks = this.getTasks();
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
      this.saveTasks(tasks);
    }
  }

  /**
   * Valida uma tarefa. Apenas mentores podem validar e ela exige checklist e evidência.
   * @param {string} taskId 
   * @param {import("../domain/governance/auth.js").Actor} actor 
   */
  static validateTask(taskId, actor) {
    if (!canValidateRoadmapTask(actor)) {
      throw new Error("Acesso Negado: Apenas o mentor pode validar uma tarefa do Roadmap.");
    }

    const tasks = this.getTasks();
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
    this.saveTasks(tasks);
  }

  /**
   * Adiciona uma tarefa personalizada ao roadmap (sem alterar o seed original).
   * @param {import("../domain/governance/types.js").RoadmapTask} newTask 
   * @param {import("../domain/governance/auth.js").Actor} actor
   */
  static addTask(newTask, actor) {
    const tasks = this.getTasks();
    
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
    this.saveTasks(tasks);
  }
}
