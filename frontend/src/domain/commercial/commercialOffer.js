export const OFFER_TYPES = {
  PROGRAM: 'program',
  COUNCIL: 'council'
};

export const PROGRAM_MAX_INVESTMENT_CENTS = 4500000; // R$ 45.000,00

export const COMMERCIAL_OFFERS = {
  [OFFER_TYPES.PROGRAM]: {
    type: OFFER_TYPES.PROGRAM,
    programName: 'Programa Governo Empresarial',
    durationMonths: 4,
    implementationDays: 30,
    implementationMeetingFrequency: 'semanal',
    followUpMonths: 3,
    followUpMeetingFrequency: 'mensal',
    groupAccessMonths: 12,
    deliverableGroups: [
      {
        title: 'Mês 1 (R$ 20.000)',
        description: 'Sprint de implementação com condução semanal (4 Encontros)',
        items: [
          'Diagnóstico e priorização - R$ 5.000',
          'Construção do plano e Implantação da estrutura inicial - R$ 5.000',
          'Organização do roadmap e Definição de responsáveis - R$ 5.000',
          'Preparação dos indicadores e Configuração do Painel do Cliente - R$ 5.000'
        ]
      },
      {
        title: 'Meses 2, 3 e 4 (R$ 15.000)',
        description: 'Acompanhamento para consolidar a implementação e evitar retrocessos (3 Encontros)',
        items: [
          'Um encontro estratégico individual por mês (Acompanhamento, Revisão e Correção de rota) - R$ 15.000'
        ]
      },
      {
        title: 'Entregáveis Adicionais (R$ 10.000)',
        description: 'Recursos contínuos',
        items: [
          'Encontros semanais em grupo por 12 meses + Área de Membros - R$ 5.000',
          'Painel do Cliente Exclusivo - R$ 3.000',
          'Plano de ação de 90 dias estruturado - R$ 2.000',
          'Acesso a eventos presenciais (Bônus Incluso)'
        ]
      }
    ],
    contractDescription: 'Consultoria e Implementação PGE (Programa Governo Empresarial)'
  },
  [OFFER_TYPES.COUNCIL]: {
    type: OFFER_TYPES.COUNCIL,
    programName: 'Conselho Governo Empresarial',
    minInvestmentCentsExclusive: PROGRAM_MAX_INVESTMENT_CENTS,
    baseProgram: OFFER_TYPES.PROGRAM,
    initialCycleMonths: 4,
    additionalCouncilMonths: 6,
    totalStrategicMonths: 10,
    councilMeetingFrequency: 'mensal',
    additionalDeliverables: [
      {
        title: '6 Meses Adicionais de Conselho Estratégico (R$ 35.000)',
        description: 'Uma estrutura contínua de apoio à tomada de decisão (6 Encontros + Acompanhamento VIP)',
        items: [
          'Um encontro individual estratégico por mês durante os seis meses adicionais - R$ 30.000',
          'Acompanhamento Contínuo e Prioridade de Agenda - R$ 5.000'
        ]
      }
    ],
    contractDescription: 'Consultoria, Implementação e Conselho Estratégico CGE (Conselho Governo Empresarial)'
  }
};

/**
 * Retorna a configuração da oferta comercial baseada no investimento em centavos.
 * A função é pura e atende regras de domínio de classificação.
 * 
 * @param {number} investmentInCents O valor do investimento total em centavos (ex: R$ 45.000,00 -> 4500000)
 * @returns {Object} Configuração completa da oferta
 */
export function getCommercialOffer(investmentInCents) {
  if (typeof investmentInCents !== 'number' || isNaN(investmentInCents)) {
    throw new Error('Investimento deve ser um número válido em centavos.');
  }

  if (investmentInCents <= PROGRAM_MAX_INVESTMENT_CENTS) {
    return COMMERCIAL_OFFERS[OFFER_TYPES.PROGRAM];
  }
  return COMMERCIAL_OFFERS[OFFER_TYPES.COUNCIL];
}
