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
 * @typedef {Object} RoadmapTask
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} month - Mês de 1 a 12
 * @property {string} phaseId
 * @property {MethodStage} methodStage
 * @property {Pillar} pillar
 * @property {TaskType} type
 * @property {1 | 2 | 3} weight
 * @property {TaskStatus} status
 * @property {string} ownerId
 * @property {string} [dueDate]
 * @property {number} [baseline]
 * @property {number} [target]
 * @property {string[]} impactedMetricIds
 * @property {string[]} definitionOfDone
 * @property {TaskEvidence[]} evidences
 * @property {string} [blockedReason]
 * @property {string} [validatedAt]
 * @property {string} [validatedBy]
 */

/**
 * @typedef {Object} MonthlySnapshot
 * @property {string} id
 * @property {number} month
 * @property {string} date
 * @property {"draft" | "submitted" | "validated"} status
 * @property {string} [notes]
 * @property {Object} rawData
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
