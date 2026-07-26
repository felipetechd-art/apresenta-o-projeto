// @ts-check
import "./types.js"; // Importa os tipos JSDoc

/**
 * Utilitário para garantir que um valor esteja sempre entre 0 e 100.
 * @param {number} value
 * @returns {number}
 */
export function clampPercentage(value) {
  if (value === undefined || value === null || isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return Number(value.toFixed(2));
}

/**
 * Calcula o Índice de Governo Empresarial (IGE)
 * IGE = 25% * (100 - IDE) + 15% * CLO + 20% * Autonomia + 15% * Processos + 10% * Automação + 15% * Governança
 * @param {Object} params
 * @param {number} params.ide Índice de Dependência do Dono (0-100)
 * @param {number} params.clo Liberdade Operacional (0-100)
 * @param {number} params.autonomy Autonomia das lideranças (0-100)
 * @param {number} params.processMaturity Maturidade dos processos (0-100)
 * @param {number} params.automation Nível de automação (0-100)
 * @param {number} params.governance Nível de governança (0-100)
 * @returns {number} IGE entre 0 e 100
 */
export function calculateIGE({ ide = 0, clo = 0, autonomy = 0, processMaturity = 0, automation = 0, governance = 0 }) {
  const indEmpresario = clampPercentage(100 - ide);
  
  const ige = (
    0.25 * indEmpresario +
    0.15 * clampPercentage(clo) +
    0.20 * clampPercentage(autonomy) +
    0.15 * clampPercentage(processMaturity) +
    0.10 * clampPercentage(automation) +
    0.15 * clampPercentage(governance)
  );

  return clampPercentage(ige);
}

/**
 * Calcula a Liberdade Operacional (CLO)
 * CLO = 100 - (horas operacionais / horas totais * 100)
 * Se horas operacionais > horas totais, resulta em 0 (via clamp)
 * @param {number} operationalHours 
 * @param {number} totalHours 
 * @returns {number} CLO entre 0 e 100
 */
export function calculateCLO(operationalHours, totalHours) {
  if (!totalHours || totalHours <= 0) return 0; // Divisão por zero ou valor inválido
  const opHoursClamped = operationalHours < 0 ? 0 : operationalHours;
  
  const percentage = (opHoursClamped / totalHours) * 100;
  return clampPercentage(100 - percentage);
}

/**
 * Calcula a Autonomia
 * Autonomia = Decisões resolvidas líderes / (Resolvidas líderes + Chegaram empresário) * 100
 * @param {number} decisionsByLeaders 
 * @param {number} decisionsToOwner 
 * @returns {number} Autonomia entre 0 e 100
 */
export function calculateAutonomy(decisionsByLeaders, decisionsToOwner) {
  const leaders = decisionsByLeaders < 0 ? 0 : decisionsByLeaders;
  const owner = decisionsToOwner < 0 ? 0 : decisionsToOwner;
  const total = leaders + owner;

  if (total === 0) return 0; // Divisão por zero
  
  return clampPercentage((leaders / total) * 100);
}

/**
 * Calcula a Taxa de Recentralização
 * Recentralização = Devolvidas / Delegadas * 100
 * @param {number} recentralized 
 * @param {number} delegated 
 * @returns {number} Recentralização entre 0 e 100
 */
export function calculateRecentralization(recentralized, delegated) {
  if (!delegated || delegated <= 0) return 0;
  const rec = recentralized < 0 ? 0 : recentralized;
  
  return clampPercentage((rec / delegated) * 100);
}

/**
 * Calcula a Maturidade dos Processos
 * Maturidade = 50% * cobertura + 50% * aderência real
 * @param {number} priorityProcesses 
 * @param {number} documentedProcesses 
 * @param {number} processAdherence Percentual de 0 a 100
 * @returns {number}
 */
export function calculateProcessMaturity(priorityProcesses, documentedProcesses, processAdherence) {
  let coverage = 0;
  if (priorityProcesses > 0) {
    const doc = documentedProcesses < 0 ? 0 : documentedProcesses;
    // Não permite documentados > prioritários
    const finalDoc = doc > priorityProcesses ? priorityProcesses : doc;
    coverage = (finalDoc / priorityProcesses) * 100;
  }
  
  const adherence = clampPercentage(processAdherence);
  
  return clampPercentage((0.5 * coverage) + (0.5 * adherence));
}

/**
 * Calcula o Progresso Ponderado do Roadmap
 * Considera apenas tarefas validadas ("validated"). Tarefas sem peso recebem peso 1.
 * @param {import("./types").RoadmapTask[]} tasks 
 * @returns {number}
 */
export function calculateRoadmapProgress(tasks) {
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) return 0;

  let totalWeight = 0;
  let validatedWeight = 0;

  for (const task of tasks) {
    const weight = task.weight && task.weight > 0 ? task.weight : 1; // Tarefas sem peso ganham peso 1
    totalWeight += weight;
    
    if (task.status === "validated") {
      validatedWeight += weight;
    }
  }

  if (totalWeight === 0) return 0;
  return clampPercentage((validatedWeight / totalWeight) * 100);
}

/**
 * Calcula o IDE Mensal Provisório
 * IDE = 35% dependência decisões + 30% dependência tempo + 20% dependência processos + 15% recentralização
 * @param {Object} params
 * @param {number} params.decisionsToOwner 
 * @param {number} params.decisionsByLeaders 
 * @param {number} params.operationalHours 
 * @param {number} params.totalHours 
 * @param {number} params.priorityProcesses 
 * @param {number} params.independentProcesses Processos rodando sem o dono
 * @param {number} params.recentralized 
 * @param {number} params.delegated 
 * @returns {number}
 */
export function calculateProvisionalIDE({
  decisionsToOwner = 0,
  decisionsByLeaders = 0,
  operationalHours = 0,
  totalHours = 0,
  priorityProcesses = 0,
  independentProcesses = 0,
  recentralized = 0,
  delegated = 0
}) {
  // Dependência Decisões
  const totalDecisions = Math.max(0, decisionsToOwner) + Math.max(0, decisionsByLeaders);
  const depDecisions = totalDecisions > 0 ? (Math.max(0, decisionsToOwner) / totalDecisions) * 100 : 0;

  // Dependência Tempo
  const opHours = Math.max(0, operationalHours);
  const totHours = Math.max(0, totalHours);
  const depTime = totHours > 0 ? (opHours / totHours) * 100 : 0;

  // Dependência Processos
  const indProc = Math.max(0, independentProcesses);
  const prioProc = Math.max(0, priorityProcesses);
  let depProcesses = 100;
  if (prioProc > 0) {
    depProcesses = 100 - ((Math.min(indProc, prioProc) / prioProc) * 100);
  }

  // Recentralização
  const recent = Math.max(0, recentralized);
  const deleg = Math.max(0, delegated);
  const recRate = deleg > 0 ? (recent / deleg) * 100 : 0;

  const ide = (
    0.35 * clampPercentage(depDecisions) +
    0.30 * clampPercentage(depTime) +
    0.20 * clampPercentage(depProcesses) +
    0.15 * clampPercentage(recRate)
  );

  return clampPercentage(ide);
}

/**
 * Classifica o estágio de maturidade baseado no IGE
 * @param {number} ige 
 * @returns {"Operação" | "Gestão" | "Liderança" | "Governo"}
 */
export function getMaturityLevel(ige) {
  const val = clampPercentage(ige);
  if (val < 25) return "Operação";
  if (val < 50) return "Gestão";
  if (val < 75) return "Liderança";
  return "Governo";
}
