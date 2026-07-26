/**
 * @file auth.js
 * @description Lógica de autorização de domínio para o Centro de Governança.
 * Determina permissões de Mentor vs Mentorado independente da UI.
 */

/**
 * @typedef {Object} Actor
 * @property {string} id
 * @property {string} name
 * @property {"mentor" | "mentorado"} role
 */

export const ROLES = {
  MENTOR: 'mentor',
  MENTORADO: 'mentorado'
};

/**
 * Retorna true se o ator pode validar um Fechamento Mensal.
 * Apenas Mentores podem validar.
 * @param {Actor} actor 
 * @returns {boolean}
 */
export function canValidateMonthlyClosing(actor) {
  return actor?.role === ROLES.MENTOR;
}

/**
 * Retorna true se o ator pode devolver um Fechamento Mensal.
 * Apenas Mentores podem devolver.
 * @param {Actor} actor 
 * @returns {boolean}
 */
export function canReturnMonthlyClosing(actor) {
  return actor?.role === ROLES.MENTOR;
}

/**
 * Retorna true se o ator pode submeter um Rascunho para validação.
 * Mentorados submetem os fechamentos.
 * @param {Actor} actor 
 * @returns {boolean}
 */
export function canSubmitMonthlyClosing(actor) {
  return actor?.role === ROLES.MENTORADO;
}

/**
 * Retorna true se o ator pode validar uma Tarefa do Roadmap.
 * Apenas Mentores podem validar.
 * @param {Actor} actor 
 * @returns {boolean}
 */
export function canValidateRoadmapTask(actor) {
  return actor?.role === ROLES.MENTOR;
}

/**
 * Retorna true se o ator pode editar uma Tarefa já validada.
 * Ninguém pode editar tarefas validadas diretamente. Uma nova revisão/histórico deve ser gerado.
 * @param {Actor} actor 
 * @param {import("./types").RoadmapTask} task 
 * @returns {boolean}
 */
export function canEditValidatedTask(actor, task) {
  // Uma tarefa validada é bloqueada. Qualquer mudança exige fluxo específico.
  return false; 
}

/**
 * Retorna true se o ator pode criar uma revisão (ex: após o fechamento estar validado).
 * Apenas Mentores autorizam uma nova revisão de algo já validado.
 * @param {Actor} actor 
 * @returns {boolean}
 */
export function canCreateRevision(actor) {
  return actor?.role === ROLES.MENTOR;
}
