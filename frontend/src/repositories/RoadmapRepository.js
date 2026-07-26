// @ts-check
import { StorageHelper } from "./StorageHelper.js";
import { getDefaultRoadmapTasks } from "../domain/governance/roadmapData.js";

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
   * Atualiza uma única tarefa e persiste.
   * @param {import("../domain/governance/types.js").RoadmapTask} updatedTask 
   */
  static updateTask(updatedTask) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    
    if (index !== -1) {
      tasks[index] = updatedTask;
      this.saveTasks(tasks);
    }
  }

  /**
   * Valida uma tarefa. (Regra de negócio: só avança o status se tiver checklist OK, mas essa validação 
   * mais complexa pode ficar no Hook. Aqui apenas aplicamos a mudança de dados).
   * @param {string} taskId 
   * @param {string} validatedBy 
   */
  static validateTask(taskId, validatedBy) {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = "validated";
      task.validatedAt = new Date().toISOString();
      task.validatedBy = validatedBy;
      this.saveTasks(tasks);
    }
  }

  /**
   * Obtém progresso do roadmap considerando apenas as validadas.
   * Isolamos isso no repository se quisermos enviar isso num request futuro, 
   * ou delegamos o cálculo para o frontend.
   */
}
