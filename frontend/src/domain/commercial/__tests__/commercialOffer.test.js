import { describe, it, expect } from 'vitest';
import { getCommercialOffer, OFFER_TYPES, PROGRAM_MAX_INVESTMENT_CENTS } from '../commercialOffer';

describe('Regras de Nomenclatura e Classificação Comercial (Programa vs Conselho)', () => {
  it('R$ 40.000,00 (4.000.000 centavos) seleciona Programa', () => {
    const config = getCommercialOffer(4000000);
    expect(config.type).toBe(OFFER_TYPES.PROGRAM);
    expect(config.programName).toBe('Programa Governo Empresarial');
  });

  it('R$ 45.000,00 (4.500.000 centavos) seleciona Programa', () => {
    const config = getCommercialOffer(4500000);
    expect(config.type).toBe(OFFER_TYPES.PROGRAM);
    expect(config.programName).toBe('Programa Governo Empresarial');
  });

  it('R$ 45.000,01 (4.500.001 centavos) seleciona Conselho', () => {
    const config = getCommercialOffer(4500001);
    expect(config.type).toBe(OFFER_TYPES.COUNCIL);
    expect(config.programName).toBe('Conselho Governo Empresarial');
    // R$ 45.000,01 não sofre arredondamento para R$ 45.000,00 pela nossa função, 
    // pois ela avalia exatamente o valor em centavos.
  });

  it('R$ 80.000,00 (8.000.000 centavos) seleciona Conselho', () => {
    const config = getCommercialOffer(8000000);
    expect(config.type).toBe(OFFER_TYPES.COUNCIL);
    expect(config.programName).toBe('Conselho Governo Empresarial');
  });

  it('O Programa possui duração de 4 meses', () => {
    const config = getCommercialOffer(4000000);
    expect(config.durationMonths).toBe(4);
  });

  it('O Conselho possui duração de 10 meses', () => {
    const config = getCommercialOffer(5000000);
    expect(config.totalStrategicMonths).toBe(10);
  });

  it('O Conselho inclui o Programa (baseProgram)', () => {
    const config = getCommercialOffer(5000000);
    expect(config.baseProgram).toBe(OFFER_TYPES.PROGRAM);
    expect(config.initialCycleMonths).toBe(4);
  });

  it('O primeiro mês possui implementação e encontros semanais no Programa', () => {
    const config = getCommercialOffer(4000000);
    expect(config.implementationDays).toBe(30);
    expect(config.implementationMeetingFrequency).toBe('semanal');
    expect(config.deliverableGroups[0].title).toContain('Mês 1');
  });

  it('Os meses 2, 3 e 4 possuem acompanhamento mensal no Programa', () => {
    const config = getCommercialOffer(4000000);
    expect(config.followUpMonths).toBe(3);
    expect(config.followUpMeetingFrequency).toBe('mensal');
    expect(config.deliverableGroups[1].title).toContain('Meses 2, 3 e 4');
  });

  it('O Conselho adiciona seis meses', () => {
    const config = getCommercialOffer(6000000);
    expect(config.additionalCouncilMonths).toBe(6);
    expect(config.additionalDeliverables[0].title).toContain('6 Meses Adicionais');
  });

  it('Não existe a palavra "Mentoria" na oferta comercial de Programa', () => {
    const config = getCommercialOffer(4000000);
    const serialized = JSON.stringify(config).toLowerCase();
    expect(serialized).not.toContain('mentoria');
    expect(serialized).not.toContain('mentoring');
  });

  it('Não existe a palavra "Mentoria" na oferta comercial de Conselho', () => {
    const config = getCommercialOffer(6000000);
    const serialized = JSON.stringify(config).toLowerCase();
    expect(serialized).not.toContain('mentoria');
    expect(serialized).not.toContain('mentoring');
  });

  it('Lança erro se o investimento não for número válido', () => {
    expect(() => getCommercialOffer(null)).toThrow();
    expect(() => getCommercialOffer(undefined)).toThrow();
    expect(() => getCommercialOffer('45000')).toThrow();
  });

  it('Verifica o título correto e estrutura nos entregáveis adicionais do Conselho', () => {
    const config = getCommercialOffer(6000000);
    const additional = config.additionalDeliverables[0];
    expect(additional.title).toContain('6 Meses Adicionais de Conselho Estratégico');
    expect(additional.items.length).toBeGreaterThan(0);
    expect(additional.items[0]).toContain('mês');
  });

  it('Valida os itens de implementação previstos no Mês 1 do Programa', () => {
    const config = getCommercialOffer(4500000);
    const mes1 = config.deliverableGroups.find(g => g.title.includes('Mês 1'));
    expect(mes1).toBeDefined();
    expect(mes1.items.length).toBeGreaterThan(1);
    expect(mes1.items.some(item => item.includes('Implantação'))).toBe(true);
  });

  it('Verifica a existência da descrição do contrato (contractDescription) em ambas as ofertas', () => {
    const programConfig = getCommercialOffer(4000000);
    const councilConfig = getCommercialOffer(6000000);
    expect(programConfig.contractDescription).toBe('Consultoria e Implementação PGE (Programa Governo Empresarial)');
    expect(councilConfig.contractDescription).toBe('Consultoria, Implementação e Conselho Estratégico CGE (Conselho Governo Empresarial)');
  });

  it('Garante que a palavra "Mentor" não esteja presente na oferta', () => {
    const config = getCommercialOffer(6000000);
    const serialized = JSON.stringify(config).toLowerCase();
    expect(serialized).not.toContain('mentor');
  });

  it('Garante que a palavra "Mentorado" não esteja presente na oferta', () => {
    const config = getCommercialOffer(4000000);
    const serialized = JSON.stringify(config).toLowerCase();
    expect(serialized).not.toContain('mentorado');
  });
});
