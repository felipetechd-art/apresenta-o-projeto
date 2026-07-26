// @ts-check

/**
 * @typedef {Object} Company
 * @property {string} id
 * @property {string} name
 * @property {string} cnpj
 * @property {string} legalRepresentative
 */

/**
 * @typedef {Object} ProgramParticipant
 * @property {string} id
 * @property {string} companyId
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} role
 */

/**
 * @typedef {"diagnosticar" | "organizar" | "delegar" | "automatizar" | "governar"} MethodStage
 */

/**
 * @typedef {"people" | "processes" | "delegation" | "automation" | "governance"} Pillar
 */

/**
 * @typedef {"mandatory" | "conditional" | "custom"} TaskType
 */

/**
 * @typedef {"not_started" | "in_preparation" | "in_execution" | "awaiting_validation" | "validated" | "blocked" | "canceled" | "replaced"} TaskStatus
 */

/**
 * @typedef {Object} TaskEvidence
 * @property {string} id
 * @property {string} type - "text", "link", "reference"
 * @property {string} description
 * @property {string} createdAt
 * @property {string} createdBy
 */

/**
 * @typedef {Object} Evidence
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} type - Tipo de evidência (ex: "link", "text", "document")
 * @property {string} fileName
 * @property {string} url - URL ou referência textual
 * @property {string} uploadedBy - actorId
 * @property {string} date - ISO Date
 */

/**
 * @typedef {Object} RoadmapTask
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} [objective] - Objetivo da tarefa
 * @property {number} month - 1 a 12
 * @property {number} phase - 1, 2 ou 3
 * @property {Pillar} pillar
 * @property {MethodStage} stage
 * @property {TaskType} type
 * @property {number} weight - 1 (comum), 2 (importante), 3 (crítica)
 * @property {string} [responsible] - ID ou nome do responsável
 * @property {string[]} [supporters] - Apoiadores
 * @property {string} [dueDate] - ISO Date
 * @property {TaskStatus} status
 * @property {string[]} checklist - Itens obrigatórios
 * @property {string} definitionOfDone - Definição de concluído
 * @property {string} [impactedMetric] - Indicador impactado (ex: "IDE", "CLO")
 * @property {string} [baseline] - Valor atual antes da tarefa
 * @property {string} [target] - Meta da tarefa
 * @property {string[]} [dependencies] - IDs de outras tarefas
 * @property {string[]} [blockers] - Motivos de bloqueio
 * @property {Evidence[]} evidences - Evidências entregues
 * @property {import("./audit").AuditEvent[]} [auditLog] - Histórico de alterações
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} MonthlySnapshot
 * @property {string} id - UUID (Não apenas o mês, para permitir revisões)
 * @property {string} [companyId]
 * @property {number} [year]
 * @property {number} month - 1 a 12
 * @property {number} [revision] - Versão do snapshot (inicia em 1)
 * @property {string} date - Data em formato ISO do momento do preenchimento
 * @property {"draft" | "submitted" | "validated" | "returned"} status - Estado atual do lançamento
 * @property {string} [notes] - Observações gerais
 * @property {Object} rawData - Os dados puros informados pelo cliente
 * @property {number} rawData.totalHours
 * @property {number} rawData.operationalHours
 * @property {number} rawData.strategicHours
 * @property {number} rawData.decisionsToOwner
 * @property {number} rawData.decisionsByLeaders
 * @property {number} rawData.delegatedResponsibilities
 * @property {number} rawData.recentralizedResponsibilities
 * @property {number} rawData.priorityProcesses
 * @property {number} rawData.documentedProcesses
 * @property {number} rawData.processAdherence - 0 a 100
 * @property {Object} metrics
 * @property {number} metrics.clo
 * @property {number} metrics.autonomy
 * @property {number} metrics.recentralizationRate
 * @property {number} metrics.processMaturity
 * @property {number} metrics.provisionalIde
 * @property {number} metrics.roadmapProgress
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 * @property {string} [submittedAt]
 * @property {string} [validatedAt]
 * @property {string} [validatedBy] - ID ou Nome do Mentor
 * @property {string} [returnedAt]
 * @property {string} [returnReason]
 * @property {string} [supersedesId] - Referência ao snapshot anterior que este substituiu
 */

/**
 * @typedef {Object} PillarDefinition
 * @property {Pillar} id
 * @property {string} name
 * @property {string} description
 * @property {number} currentScore - Combinado 50% impl / 50% resultado
 */

/**
 * @typedef {Object} GovernanceAlert
 * @property {string} id
 * @property {string} type - "danger" | "warning" | "info"
 * @property {string} message
 * @property {string} createdAt
 * @property {boolean} resolved
 */

/**
 * @typedef {Object} QuarterlyDiagnostic
 * @property {string} id
 * @property {number} quarter
 * @property {number} ide
 * @property {number} clo
 * @property {number} leadershipMaturity
 * @property {number} processMaturity
 * @property {number} governance
 * @property {number} automation
 * @property {number} ige
 */

export {};
