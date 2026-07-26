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

  const validateTask = useCallback((taskId, actor) => {
    RoadmapRepository.validateTask(taskId, actor);
    loadTasks();
  }, [loadTasks]);

  const updateTask = useCallback((task, actor, action, comment) => {
    RoadmapRepository.updateTask(task, actor, action, comment);
    loadTasks();
  }, [loadTasks]);

  const addTask = useCallback((task, actor) => {
    RoadmapRepository.addTask(task, actor);
    loadTasks();
  }, [loadTasks]);

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
