import { getCommercialOffer } from '../commercial/commercialOffer';
import { buildContractSnapshot } from '../commercial/contractSnapshot';

export function mapPresentationToGovernanceDraft(presentationData) {
  // Converte o valor de investimento de string (ex: "R$ 45.000,00") para centavos numéricos (ex: 4500000)
  const rawInvestment = String(presentationData.totalInvestment || '0');
  const numericString = rawInvestment.replace(/[R$\s.]/g, '').replace(',', '.');
  const investmentInCents = Math.round(Number(numericString) * 100);

  const offerConfig = getCommercialOffer(investmentInCents);

  return {
    clientInfo: {
      name: presentationData.clientName || null,
      email: presentationData.clientEmail || null,
      phone: presentationData.clientPhone || null,
      company: presentationData.companyName || null,
      segment: presentationData.segment || null,
      revenue: presentationData.revenue || null,
      leaders: presentationData.leaders || null,
      docNumber: presentationData.docNumber || null,
      repName: presentationData.repName || null,
      clientAddress: presentationData.clientAddress || null,
    },
    contractData: {
      totalInvestment: presentationData.totalInvestment || null,
      investmentInCents: investmentInCents,
      entranceValue: presentationData.entranceValue || null,
      installments: presentationData.installments || null,
      paymentMethod: presentationData.paymentMethod || null,
      contractStatus: 'pending',
      paymentStatus: 'pending',
      personType: presentationData.personType ?? null,
      contractForo: presentationData.contractForo ?? null,
      programType: offerConfig.type,
      programName: offerConfig.programName,
      durationMonths: offerConfig.durationMonths || offerConfig.totalStrategicMonths,
      initialCycleMonths: offerConfig.initialCycleMonths || offerConfig.durationMonths,
      additionalCouncilMonths: offerConfig.additionalCouncilMonths || 0,
      contractDescription: offerConfig.contractDescription,
      startDate: new Date().toISOString(),
      consultant: presentationData.consultantEmail || null,
      contractGenerated: presentationData.contractGenerated || false,
    },
    diagnosticData: {
      ideDependency: presentationData.ideDependency != null ? Number(presentationData.ideDependency) : null,
      cloOperationalFreedom: presentationData.cloOperationalFreedom != null ? Number(presentationData.cloOperationalFreedom) : null,
      strategicPercent: presentationData.strategicPercent != null ? Number(presentationData.strategicPercent) : null,
      hourlyRate: presentationData.hourlyRate != null ? Number(presentationData.hourlyRate) : null,
      hoursPerWeek: presentationData.hoursPerWeek != null ? Number(presentationData.hoursPerWeek) : null,
      calculatedOpportunityCost: presentationData.calculatedOpportunityCost != null ? Number(presentationData.calculatedOpportunityCost) : null,
      calculatedLostGrowth: presentationData.calculatedLostGrowth != null ? Number(presentationData.calculatedLostGrowth) : null,
      delegatedTasks: presentationData.delegatedTasks != null ? Number(presentationData.delegatedTasks) : null,
      returningTasks: presentationData.returningTasks != null ? Number(presentationData.returningTasks) : null,
      reworkHours: presentationData.reworkHours != null ? Number(presentationData.reworkHours) : null,
      annualGrowth: presentationData.annualGrowth != null ? Number(presentationData.annualGrowth) : null,
      growthFromStrategy: presentationData.growthFromStrategy != null ? Number(presentationData.growthFromStrategy) : null,
      salesStatus: presentationData.salesStatus || null,
      leadStatus: presentationData.leadStatus || null,
      notes: presentationData.notes || null,
      // Dados qualitativos do Slide 1 (Kickoff/Visão do Dono)
      modelo_negocio: presentationData.modelo_negocio || null,
      faturamento: presentationData.faturamento || null,
      atuacao: presentationData.atuacao || null,
      publico_alvo: presentationData.publico_alvo || null,
      principal_obstaculo: presentationData.principal_obstaculo || null,
      visao_futuro: presentationData.visao_futuro || null,
      
      // Respostas adicionais do Mapa 360 coletadas na apresentação
      independencia_respostas: presentationData.independencia_respostas || null,
      clareza_respostas: presentationData.clareza_respostas || null,
      lideranca_respostas: presentationData.lideranca_respostas || null,
      operacao_respostas: presentationData.operacao_respostas || null,
      acesso_indicadores: presentationData.acesso_indicadores || null,
      confianca_numeros: presentationData.confianca_numeros || null,
      areas_atuacao: presentationData.areas_atuacao || null,
      mapa_decisoes: presentationData.mapa_decisoes || null,
      maior_ralo: presentationData.maior_ralo || null,
      nota_preparacao: presentationData.nota_preparacao != null ? presentationData.nota_preparacao : null,
      precisa_ajuda: presentationData.precisa_ajuda || null,
      
      // Devolutiva / Pitch
      devolutiva_pontos_fortes: presentationData.devolutiva_pontos_fortes || null,
      devolutiva_contradicao: presentationData.devolutiva_contradicao || null,
      devolutiva_frase: presentationData.devolutiva_frase || null,
    },
    contractSnapshot: presentationData.contractGenerated ? buildContractSnapshot(presentationData) : null
  };
}
