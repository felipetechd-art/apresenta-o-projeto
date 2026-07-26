export function mapPresentationToGovernanceDraft(presentationData) {
  return {
    clientInfo: {
      name: presentationData.clientName || null,
      email: presentationData.clientEmail || null,
      phone: presentationData.clientPhone || null,
      company: presentationData.companyName || null,
      segment: presentationData.segment || null,
      revenue: presentationData.revenue || null,
      employeeCount: presentationData.employeeCount || null,
      leaderCount: presentationData.leaderCount || null,
      docNumber: presentationData.docNumber || null,
      repName: presentationData.repName || null,
      clientAddress: presentationData.clientAddress || null,
    },
    contractData: {
      totalInvestment: presentationData.totalInvestment || null,
      entranceValue: presentationData.entranceValue || null,
      installments: presentationData.installments || null,
      paymentMethod: presentationData.paymentMethod || null,
      contractStatus: 'pending',
      paymentStatus: 'pending',
      program: 'Governo Empresarial (PGE)',
      startDate: new Date().toISOString(),
      consultant: presentationData.consultantEmail || null,
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
    }
  };
}
