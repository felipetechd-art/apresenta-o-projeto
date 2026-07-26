// @ts-check
import { useState, useEffect, useCallback } from 'react';
import { RoadmapRepository } from '../repositories/RoadmapRepository.js';
import { calculateRoadmapProgress } from '../domain/governance/calculations.js';

export function useRoadmap(companyId = 'demo-company') {
  const [tasks, setTasks] = useState(/** @type {import("../domain/governance/types.js").RoadmapTask[]} */ ([]));
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(() => {
    setLoading(true);
    const loadedTasks = RoadmapRepository.getTasks(companyId);
    setTasks(loadedTasks);
    setLoading(false);
  }, [companyId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const validateTask = useCallback((taskId, actor) => {
    RoadmapRepository.validateTask(taskId, actor, companyId);
    loadTasks();
  }, [loadTasks, companyId]);

  const updateTask = useCallback((task, actor, action, comment) => {
    RoadmapRepository.updateTask(task, actor, action, comment, companyId);
    loadTasks();
  }, [loadTasks, companyId]);

  const addTask = useCallback((task, actor) => {
    RoadmapRepository.addTask(task, actor, companyId);
    loadTasks();
  }, [loadTasks, companyId]);

  const progress = calculateRoadmapProgress(tasks);

  return {
    tasks,
    loading,
    progress,
    validateTask,
    updateTask,
    addTask,
    refresh: loadTasks
  };
}
