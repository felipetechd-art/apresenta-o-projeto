// @ts-check
import { useState, useEffect, useCallback } from 'react';
import { RoadmapRepository } from '../repositories/RoadmapRepository.js';
import { calculateRoadmapProgress } from '../domain/governance/calculations.js';

export function useRoadmap() {
  const [tasks, setTasks] = useState(/** @type {import("../domain/governance/types.js").RoadmapTask[]} */ ([]));
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(() => {
    setLoading(true);
    const loadedTasks = RoadmapRepository.getTasks();
    setTasks(loadedTasks);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const validateTask = useCallback((taskId, validatedBy) => {
    RoadmapRepository.validateTask(taskId, validatedBy);
    loadTasks(); // recarrega
  }, [loadTasks]);

  const updateTask = useCallback((task) => {
    RoadmapRepository.updateTask(task);
    loadTasks();
  }, [loadTasks]);

  const progress = calculateRoadmapProgress(tasks);

  return {
    tasks,
    loading,
    progress,
    validateTask,
    updateTask,
    refresh: loadTasks
  };
}
