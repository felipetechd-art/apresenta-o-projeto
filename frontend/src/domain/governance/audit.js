/**
 * @file audit.js
 * @description Estrutura de eventos de auditoria e registro de histórico.
 */

/**
 * @typedef {import("./auth").Actor} Actor
 */

/**
 * @typedef {Object} AuditEvent
 * @property {string} id - UUID do evento
 * @property {string} entityId - ID da entidade (Snapshot ou Task)
 * @property {"snapshot" | "task"} entityType
 * @property {string} action - Ação executada ("created", "edited", "submitted", "validated", "returned", "blocked", "unblocked", "substituted", "revision_created")
 * @property {string} actorId
 * @property {string} actorName
 * @property {string} actorRole
 * @property {string} previousStatus
 * @property {string} newStatus
 * @property {string} [comment]
 * @property {string} createdAt - Data ISO
 */

/**
 * Gera um evento de auditoria padrão.
 * @param {Object} params
 * @param {string} params.entityId
 * @param {"snapshot" | "task"} params.entityType
 * @param {string} params.action
 * @param {Actor} params.actor
 * @param {string} params.previousStatus
 * @param {string} params.newStatus
 * @param {string} [params.comment]
 * @returns {AuditEvent}
 */
export function createAuditEvent({
  entityId,
  entityType,
  action,
  actor,
  previousStatus,
  newStatus,
  comment = ""
}) {
  return {
    id: `audit-${crypto.randomUUID()}`,
    entityId,
    entityType,
    action,
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    previousStatus,
    newStatus,
    comment,
    createdAt: new Date().toISOString()
  };
}
