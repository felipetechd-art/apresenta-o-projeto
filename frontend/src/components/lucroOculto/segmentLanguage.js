/**
 * LINGUAGEM COMPLETA POR SEGMENTO — MAPA DO LUCRO OCULTO
 *
 * Define a comunicação adaptada para cada segmento de mercado em:
 *  - Blocos 3, 9, 10, 11 e 12 do diagnóstico (títulos, subtítulos e labels)
 *  - Relatório Executivo completo:
 *    achados (Seção 2), componentes do lucro oculto (Seção 4),
 *    Top 5 (Seção 12), Quick Wins (Seção 13), Plano 90 Dias (Seção 14)
 *    e Recomendações do CEO (Seção 17)
 *
 * Placeholders interpolados pelo LucroOcultoEngine:
 *  {horas}             horas manuais identificadas / mês
 *  {valorHoras}        R$ valor das horas recuperáveis / mês
 *  {horasRec}          horas recuperáveis / mês
 *  {jornadas}          equivalente em jornadas de 160h
 *  {crescimento}       % de crescimento possível sem contratar
 *  {contratacoes}      nº de contratações planejadas
 *  {economiaContratacao}  R$ / mês em folhas evitadas
 *  {horasDono}         horas / mês do dono no operacional
 *  {horasDonoSemana}   horas / semana do dono no operacional
 *  {valorTempoDono}    R$ valor do tempo do dono no operacional
 *  {receitaDestravavel} R$ / mês
 *  {custosEliminaveis} R$ / mês
 *  {custosOtimizaveis} R$ / mês
 *  {custosTotal}       R$ / mês (elimináveis + otimizáveis)
 *  {economiaTecnologia} R$ / mês
 *  {horasAdmComercial} horas / semana do time comercial em tarefas adm.
 */

// ==========================================
// BLOCOS EXTRAS POR CATEGORIA (3, 9, 10, 11, 12)
// ==========================================
const BLOCKS_EXTRA = {
  clinica_saude: {
    b3: {
      titulo: 'Tempo do Dono e Liderança na Clínica',
      subtitulo: 'Quanto tempo do sócio/supervisor fica preso em operação clínica em vez de gestão, agenda estratégica e crescimento.'
    },
    b9: {
      titulo: 'Financeiro da Clínica: Convênios, Particular e Cobrança',
      subtitulo: 'Conciliação de extratos, faturamento de convênios, controle de inadimplência e emissão de boletos.'
    },
    b10: {
      titulo: 'RH e Departamento Pessoal da Clínica',
      subtitulo: 'Recrutamento de equipes de saúde, treinamento, controle de ponto, férias e escala de atendimento.'
    },
    b11: {
      titulo: 'Compras, Estoque e Fornecedores da Clínica',
      subtitulo: 'Insumos clínicos, materiais descartáveis, medicamentos e reposição de estoque.',
      perdasLabel: 'Estimativa mensal de perdas por insumos vencidos, materiais descartáveis não utilizados ou compras erradas (R$)',
      perdasPlaceholder: 'Ex: 800 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos da Clínica',
      subtitulo: 'Aluguel do espaço, equipamentos, taxas de maquininhas, licenças de sistema e contratos antigos.'
    }
  },

  contabilidade: {
    b3: {
      titulo: 'Tempo do Sócio e Liderança no Escritório',
      subtitulo: 'Quanto tempo dos sócios fica preso em rotinas fiscais e de departamento pessoal em vez de novos contratos e gestão.'
    },
    b9: {
      titulo: 'Financeiro do Escritório: Honorários e Cobrança',
      subtitulo: 'Contas a pagar/receber, cobrança de honorários atrasados, conciliação bancária e relatórios de carteira.'
    },
    b10: {
      titulo: 'RH e Departamento Pessoal do Escritório',
      subtitulo: 'Recrutamento de analistas, treinamento, ponto e férias — com picos de demanda nos fechamentos.'
    },
    b11: {
      titulo: 'Compras, Licenças e Fornecedores do Escritório',
      subtitulo: 'Licenças de sistemas contábeis, papelaria, serviços terceirizados e contratos recorrentes.',
      perdasLabel: 'Estimativa mensal de perdas por horas ociosas, serviços não utilizados ou pagamentos duplicados (R$)',
      perdasPlaceholder: 'Ex: 600 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos do Escritório',
      subtitulo: 'Aluguel, licenças de sistema, taxas bancárias e contratos antigos a revisar.'
    }
  },

  industria: {
    b3: {
      titulo: 'Tempo do Dono e Liderança na Fábrica',
      subtitulo: 'Quanto tempo do dono/diretor fica preso no chão de fábrica, PCP e urgências em vez de estratégia e expansão.'
    },
    b9: {
      titulo: 'Financeiro e Controladoria Industrial',
      subtitulo: 'Conciliação bancária, cobrança de clientes, fluxo de caixa e margem por pedido.'
    },
    b10: {
      titulo: 'RH e Departamento Pessoal Industrial',
      subtitulo: 'Recrutamento e turnos do chão de fábrica, ponto, férias, treinamentos e segurança do trabalho.'
    },
    b11: {
      titulo: 'Compras, Estoque e Fornecedores Industriais',
      subtitulo: 'Cotação de insumos e matérias-primas, ruptura de estoque, perdas de material e compras emergenciais.',
      perdasLabel: 'Estimativa mensal de perdas por material parado, refugo, compras emergenciais ou avarias (R$)',
      perdasPlaceholder: 'Ex: 4000 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos Industriais',
      subtitulo: 'Energia, manutenção, aluguel, taxas bancárias e contratos de fornecedores a revisar.'
    }
  },

  comercio_varejo: {
    b3: {
      titulo: 'Tempo do Dono e Liderança na Loja',
      subtitulo: 'Quanto tempo do dono fica preso no balcão, estoque e operação diária em vez de gestão e crescimento.'
    },
    b9: {
      titulo: 'Financeiro do Comércio',
      subtitulo: 'Conciliação de cartões e recebimentos, cobrança de inadimplentes e fluxo de caixa.'
    },
    b10: {
      titulo: 'RH e Departamento Pessoal da Loja',
      subtitulo: 'Recrutamento de vendedores, treinamento, escala de loja e controle de ponto.'
    },
    b11: {
      titulo: 'Compras e Estoque da Loja',
      subtitulo: 'Cotação com fornecedores, ruptura, perdas, giro de mercadoria e compras emergenciais.',
      perdasLabel: 'Estimativa mensal de perdas por mercadoria parada, quebra, vencimentos ou avarias (R$)',
      perdasPlaceholder: 'Ex: 2000 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos da Loja',
      subtitulo: 'Aluguel da loja, taxas de cartão e maquininha, energia e contratos antigos.'
    }
  },

  advocacia: {
    b3: {
      titulo: 'Tempo do Sócio e Liderança no Escritório',
      subtitulo: 'Quanto tempo do advogado sócio fica preso em rotinas administrativas em vez de causas estratégicas e captação.'
    },
    b9: {
      titulo: 'Financeiro do Escritório de Advocacia',
      subtitulo: 'Conciliação bancária, cobrança de honorários, controle de custas e fluxo de caixa.'
    },
    b10: {
      titulo: 'RH e Departamento Pessoal do Escritório',
      subtitulo: 'Estagiários, assessores, triagem de currículos, ponto e férias.'
    },
    b11: {
      titulo: 'Compras, Serviços e Fornecedores do Escritório',
      subtitulo: 'Serviços cartoriais, custas, licenças de sistemas jurídicos e terceirizados.',
      perdasLabel: 'Estimativa mensal de perdas por custas e despesas processuais evitáveis ou serviços não utilizados (R$)',
      perdasPlaceholder: 'Ex: 1200 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos do Escritório',
      subtitulo: 'Aluguel, taxas, licenças de sistema e contratos antigos a revisar.'
    }
  },

  servicos: {
    b3: {
      titulo: 'Tempo do Dono e Liderança na Operação',
      subtitulo: 'Quanto tempo do sócio fica preso em entregas e rotinas do dia a dia em vez de vendas, gestão e crescimento.'
    },
    b9: {
      titulo: 'Financeiro e Controladoria',
      subtitulo: 'Conciliação bancária, cobrança de contratos, fluxo de caixa e margem por projeto.'
    },
    b10: {
      titulo: 'RH e Departamento Pessoal',
      subtitulo: 'Recrutamento de equipes técnicas, terceirizados, treinamento, ponto e férias.'
    },
    b11: {
      titulo: 'Compras, Subcontratações e Fornecedores',
      subtitulo: 'Subcontratações, ferramentas, licenças e custos de entrega dos projetos.',
      perdasLabel: 'Estimativa mensal de perdas por horas ociosas, escopo perdido ou custos de projeto não repassados (R$)',
      perdasPlaceholder: 'Ex: 2500 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos',
      subtitulo: 'Aluguel, ferramentas, licenças, taxas bancárias e contratos antigos.'
    }
  },

  outro: {
    b3: {
      titulo: 'Tempo do Dono e Liderança',
      subtitulo: 'Medição da dependência operacional da liderança e autonomia do time.'
    },
    b9: {
      titulo: 'Financeiro e Controladoria',
      subtitulo: 'Conciliação bancária, cobrança de inadimplência e emissão de notas/boletos.'
    },
    b10: {
      titulo: 'RH e Departamento Pessoal',
      subtitulo: 'Rotinas de recrutamento, triagem de currículos, onboarding e controle de férias.'
    },
    b11: {
      titulo: 'Compras, Estoque e Fornecedores',
      subtitulo: 'Previsibilidade de compras, cotações, perdas de estoque e compras emergenciais.',
      perdasLabel: 'Estimativa mensal de perdas por estoque parado, compras erradas ou avarias (R$)',
      perdasPlaceholder: 'Ex: 1500 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos',
      subtitulo: 'Identificação de contratos antigos, taxas bancárias e serviços pouco utilizados.'
    }
  },

  // ---------- Overrides por segmento (blocos) ----------
  restaurante_bar: {
    b3: {
      titulo: 'Tempo do Dono e Liderança no Restaurante',
      subtitulo: 'Quanto tempo do dono fica preso na cozinha, no salão e em urgências do serviço em vez de gestão e crescimento.'
    },
    b9: {
      titulo: 'Financeiro do Restaurante',
      subtitulo: 'Conciliação de cartões e delivery, fluxo de caixa diário e cobrança de eventos/catering.'
    },
    b10: {
      titulo: 'RH, Escala e Turnos da Equipe',
      subtitulo: 'Rotatividade, montagem de escalas, treinamento e ponto da equipe de cozinha e salão.'
    },
    b11: {
      titulo: 'Compras e Estoque de Insumos',
      subtitulo: 'Cotação de alimentos, validade, desperdício (perdas) e compras emergenciais.',
      perdasLabel: 'Estimativa mensal de desperdício com comida vencida, quebra de insumos ou compras erradas (R$)',
      perdasPlaceholder: 'Ex: 3500 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos do Restaurante',
      subtitulo: 'Aluguel, taxas de maquininha, comissões de delivery e contratos antigos.'
    }
  },

  ecommerce_marketplace: {
    b3: {
      titulo: 'Tempo do Dono e Liderança no E-commerce',
      subtitulo: 'Quanto tempo do dono fica preso em cadastro, pedidos e operação do dia a dia em vez de marketing e crescimento.'
    },
    b9: {
      titulo: 'Financeiro do E-commerce',
      subtitulo: 'Recebimentos dos marketplaces, chargebacks, conciliação de taxas e fluxo de caixa.'
    },
    b10: {
      titulo: 'RH e Equipe da Loja On-line',
      subtitulo: 'Recrutamento, expedição, atendimento e treinamento da equipe de loja virtual.'
    },
    b11: {
      titulo: 'Estoque e Fornecedores Multicanais',
      subtitulo: 'Sincronização de estoque entre canais, ruptura, devoluções e compras de reposição.',
      perdasLabel: 'Estimativa mensal de perdas por ruptura, devoluções, comissões e mercadoria parada (R$)',
      perdasPlaceholder: 'Ex: 2800 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos On-line',
      subtitulo: 'Plataformas, apps da loja, taxas de pagamento e contratos antigos.'
    }
  },

  software_saas: {
    b3: {
      titulo: 'Tempo do Fundador e Liderança no Produto',
      subtitulo: 'Quanto tempo da liderança fica preso em suporte, bugs e operação em vez de produto, vendas e estratégia.'
    },
    b9: {
      titulo: 'Financeiro do SaaS: MRR e Retenção',
      subtitulo: 'Conciliação de assinaturas, churn, inadimplência de cartões (dunning) e fluxo de caixa.'
    },
    b10: {
      titulo: 'RH e Time de Produto/Tecnologia',
      subtitulo: 'Recrutamento de devs, onboarding, ponto e férias do time técnico.'
    },
    b11: {
      titulo: 'Infraestrutura, Licenças e Fornecedores',
      subtitulo: 'Cloud, ferramentas de dev, APIs e serviços terceirizados.',
      perdasLabel: 'Estimativa mensal de perdas por infraestrutura ociosa, APIs pouco usadas ou retrabalho (R$)',
      perdasPlaceholder: 'Ex: 1900 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos',
      subtitulo: 'SaaS de terceiros, infraestrutura, taxas e contratos antigos.'
    }
  },

  academia_personal: {
    b3: {
      titulo: 'Tempo do Dono e Liderança na Academia',
      subtitulo: 'Quanto tempo do dono fica preso na recepção, escala de instrutores e operação diária em gestão e crescimento.'
    },
    b9: {
      titulo: 'Financeiro da Academia',
      subtitulo: 'Cobrança de mensalidades, inadimplência, conciliação e fluxo de caixa.'
    },
    b10: {
      titulo: 'RH e Equipe de Instrutores',
      subtitulo: 'Recrutamento de personal/instrutores, escala de aulas, ponto e férias.'
    },
    b11: {
      titulo: 'Compras, Estoque e Equipamentos',
      subtitulo: 'Manutenção de equipamentos, insumos, suplementos e reposição.',
      perdasLabel: 'Estimativa mensal de perdas por equipamentos parados, insumos vencidos ou manutenção emergencial (R$)',
      perdasPlaceholder: 'Ex: 900 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos da Academia',
      subtitulo: 'Aluguel, energia, taxas de cartão e contratos antigos.'
    }
  },

  imobiliaria: {
    b3: {
      titulo: 'Tempo do Dono e Liderança na Imobiliária',
      subtitulo: 'Quanto tempo do dono/sócio fica preso em vistorias, contratos e rotinas em vez de novos negócios e parcerias.'
    },
    b9: {
      titulo: 'Financeiro da Imobiliária',
      subtitulo: 'Recebimentos de aluguéis, comissões, conciliação e cobrança de inadimplentes.'
    },
    b10: {
      titulo: 'RH e Equipe de Corretores',
      subtitulo: 'Recrutamento de corretores, treinamento, ponto e férias.'
    },
    b11: {
      titulo: 'Serviços, Vistorias e Fornecedores',
      subtitulo: 'Vistorias, fotografia, assessoria jurídica e serviços de manutenção dos imóveis.',
      perdasLabel: 'Estimativa mensal de perdas por imóveis parados, vistorias canceladas ou comissões não recebidas (R$)',
      perdasPlaceholder: 'Ex: 2200 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos da Imobiliária',
      subtitulo: 'Aluguel, portais de anúncios, taxas e contratos antigos.'
    }
  },

  corretora_seguros: {
    b3: {
      titulo: 'Tempo do Dono e Liderança na Corretora',
      subtitulo: 'Quanto tempo do dono fica preso em renovações, siniistros e burocracia em vez de prospecção e parcerias.'
    },
    b9: {
      titulo: 'Financeiro da Corretora',
      subtitulo: 'Comissões, conciliação com seguradoras, cobrança e fluxo de caixa.'
    },
    b10: {
      titulo: 'RH e Equipe Comercial da Corretora',
      subtitulo: 'Recrutamento de corretores, treinamento, ponto e férias.'
    },
    b11: {
      titulo: 'Serviços e Fornecedores da Corretora',
      subtitulo: 'Licenças de sistemas, portais de cotação e serviços terceirizados.',
      perdasLabel: 'Estimativa mensal de perdas por apólices perdidas, renovações atrasadas ou serviços não usados (R$)',
      perdasPlaceholder: 'Ex: 1100 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos da Corretora',
      subtitulo: 'Aluguel, licenças, taxas e contratos antigos.'
    }
  },

  escola_curso: {
    b3: {
      titulo: 'Tempo do Diretor e Liderança na Escola',
      subtitulo: 'Quanto tempo da direção fica presa em rotinas administrativas em vez de metodologia, captação e crescimento.'
    },
    b9: {
      titulo: 'Financeiro da Escola/Curso',
      subtitulo: 'Cobrança de mensalidades, bolsas, inadimplência e fluxo de caixa.'
    },
    b10: {
      titulo: 'RH e Corpo Docente',
      subtitulo: 'Recrutamento de professores, escala de turmas, ponto e férias.'
    },
    b11: {
      titulo: 'Materiais, Estoque e Fornecedores',
      subtitulo: 'Material didático, recursos de sala, plataformas e serviços terceirizados.',
      perdasLabel: 'Estimativa mensal de perdas por materiais parados, vagas ociosas ou serviços não usados (R$)',
      perdasPlaceholder: 'Ex: 700 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos da Escola',
      subtitulo: 'Aluguel, plataformas EAD, taxas e contratos antigos.'
    }
  },

  construcao_civil: {
    b3: {
      titulo: 'Tempo do Dono e Liderança nas Obras',
      subtitulo: 'Quanto tempo do dono/engenheiro fica preso no canteiro em vez de orçamentos, vendas e gestão de obras.'
    },
    b9: {
      titulo: 'Financeiro das Obras',
      subtitulo: 'Medições, conciliação, cobrança de clientes e fluxo de caixa por obra.'
    },
    b10: {
      titulo: 'RH e Equipes de Obra',
      subtitulo: 'Contratação de equipes, ponto, férias e terceirizados do canteiro.'
    },
    b11: {
      titulo: 'Compras e Estoque de Materiais',
      subtitulo: 'Cotação de materiais, compras emergenciais, perdas e roubos de material.',
      perdasLabel: 'Estimativa mensal de perdas por material parado, quebra, furtos ou compras emergenciais (R$)',
      perdasPlaceholder: 'Ex: 5000 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos de Obra',
      subtitulo: 'Locação de equipamentos, energia de canteiro, taxas e contratos antigos.'
    }
  },

  agronegocio: {
    b3: {
      titulo: 'Tempo do Dono e Liderança no Agronegócio',
      subtitulo: 'Quanto tempo do produtor/gestor fica preso na operação do campo em vez de gestão, mercado e expansão.'
    },
    b9: {
      titulo: 'Financeiro do Agronegócio',
      subtitulo: 'Conciliação rural, cobrança de clientes, crédito, insumos a pagar e fluxo de caixa da safra.'
    },
    b10: {
      titulo: 'RH e Mão de Obra Sazonal',
      subtitulo: 'Contratação de safristas, ponto, férias e equipes fixas da propriedade.'
    },
    b11: {
      titulo: 'Compras, Insumos e Estoque',
      subtitulo: 'Cotação de insumos, defensivos, sementes, armazenagem e compras emergenciais.',
      perdasLabel: 'Estimativa mensal de perdas por produto perecível, quebra, armazenagem ou compras emergenciais (R$)',
      perdasPlaceholder: 'Ex: 4500 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos',
      subtitulo: 'Arrendamento, manutenção de máquinas, crédito rural e contratos antigos.'
    }
  },

  automotivo_oficina: {
    b3: {
      titulo: 'Tempo do Dono e Liderança na Oficina',
      subtitulo: 'Quanto tempo do dono fica preso no balcão e na oficina em vez de gestão, vendas e parcerias com frotas.'
    },
    b9: {
      titulo: 'Financeiro da Oficina',
      subtitulo: 'Conciliação de cartões, cobrança de serviços, garantias e fluxo de caixa.'
    },
    b10: {
      titulo: 'RH e Equipe Técnica',
      subtitulo: 'Recrutamento de mecânicos, escala de turnos, ponto e férias.'
    },
    b11: {
      titulo: 'Compras de Peças e Estoque',
      subtitulo: 'Cotação de peças, compra emergencial, peças paradas e devoluções.',
      perdasLabel: 'Estimativa mensal de perdas por peças paradas, compras emergenciais ou devoluções (R$)',
      perdasPlaceholder: 'Ex: 2600 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos da Oficina',
      subtitulo: 'Aluguel, ferramentas, taxas de cartão e contratos antigos.'
    }
  },

  veterinario_petshop: {
    b3: {
      titulo: 'Tempo do Dono e Liderança na Clínica Pet',
      subtitulo: 'Quanto tempo do dono/veterinário fica preso no atendimento e no pet shop em vez de gestão e crescimento.'
    },
    b9: {
      titulo: 'Financeiro da Clínica/Pet Shop',
      subtitulo: 'Conciliação de cartões, cobrança de serviços e produtos, inadimplência e caixa.'
    },
    b10: {
      titulo: 'RH e Equipe de Atendimento',
      subtitulo: 'Recrutamento de veterinários e atendentes, escala, ponto e férias.'
    },
    b11: {
      titulo: 'Compras, Estoque de Produtos e Insumos',
      subtitulo: 'Ração, medicamentos, insumos clínicos, validade e compras emergenciais.',
      perdasLabel: 'Estimativa mensal de perdas por produtos vencidos, quebra ou compras erradas (R$)',
      perdasPlaceholder: 'Ex: 950 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos',
      subtitulo: 'Aluguel, taxas de cartão, licenças e contratos antigos.'
    }
  },

  salao_beleza: {
    b3: {
      titulo: 'Tempo do Dono e Liderança no Salão',
      subtitulo: 'Quanto tempo da dona/ficou presa no atendimento e na administração em vez de gestão e crescimento.'
    },
    b9: {
      titulo: 'Financeiro do Salão',
      subtitulo: 'Conciliação de cartões, comissões da equipe, inadimplência e caixa.'
    },
    b10: {
      titulo: 'RH e Equipe do Salão',
      subtitulo: 'Recrutamento de profissionais, aluguel de cadeira, escala, ponto e férias.'
    },
    b11: {
      titulo: 'Compras de Produtos e Estoque',
      subtitulo: 'Cotação de produtos, validade, perdas e compras emergenciais.',
      perdasLabel: 'Estimativa mensal de perdas por produtos vencidos, quebra ou compras erradas (R$)',
      perdasPlaceholder: 'Ex: 700 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos do Salão',
      subtitulo: 'Aluguel, taxas de cartão, softwares de agendamento e contratos antigos.'
    }
  },

  transporte_logistica: {
    b3: {
      titulo: 'Tempo do Dono e Liderança na Transportadora',
      subtitulo: 'Quanto tempo do dono fica preso em operação, ocorrências e frota em vez de vendas e gestão.'
    },
    b9: {
      titulo: 'Financeiro e Conciliação de Fretes',
      subtitulo: 'Conciliação de pedágios, combustível, cobrança de clientes e fluxo de caixa.'
    },
    b10: {
      titulo: 'RH e Motoristas',
      subtitulo: 'Recrutamento de motoristas, escalas de viagem, ponto, férias e CIPA.'
    },
    b11: {
      titulo: 'Compras, Frota e Estoque de Peças',
      subtitulo: 'Combustível, pneus, peças, manutenção preventiva e compras emergenciais.',
      perdasLabel: 'Estimativa mensal de perdas por manutenção emergencial, pneus/peças paradas ou multas (R$)',
      perdasPlaceholder: 'Ex: 3200 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos',
      subtitulo: 'Aluguel de pátio, pedágio, seguros de frota e contratos antigos.'
    }
  },

  marketing_digital: {
    b3: {
      titulo: 'Tempo do Dono e Liderança na Agência',
      subtitulo: 'Quanto tempo do sócio fica preso em entregas e reuniões operacionais em vendas, produto e crescimento.'
    },
    b9: {
      titulo: 'Financeiro da Agência',
      subtitulo: 'Conciliação, cobrança de clientes, repasse de mídia e fluxo de caixa.'
    },
    b10: {
      titulo: 'RH e Equipe Criativa',
      subtitulo: 'Recrutamento de analistas e criadores, freelancers, ponto e férias.'
    },
    b11: {
      titulo: 'Ferramentas, Licenças e Fornecedores',
      subtitulo: 'Plataformas de mídia, ferramentas de criação, freelancers e serviços terceirizados.',
      perdasLabel: 'Estimativa mensal de perdas por ferramentas ociosas, horas não faturadas ou retrabalho (R$)',
      perdasPlaceholder: 'Ex: 2400 (ou 0 se não se aplicar)'
    },
    b12: {
      titulo: 'Despesas Gerais e Contratos da Agência',
      subtitulo: 'Aluguel, assinaturas, taxas e contratos antigos.'
    }
  }
};

// ==========================================
// RELATÓRIO EXECUTIVO POR CATEGORIA
// ==========================================
const REPORTS = {
  clinica_saude: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas à confirmação manual de consultas, preenchimento de prontuários e conferência de guias de convênio — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo da recepção e dos profissionais que poderia estar focado em atendimento de excelência e agenda cheia. A clínica possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'A clínica tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar a equipe clínica, bastando automatizar agendamento, confirmações e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças de sistema clínico ociosas, anúncios sem mensuração, mensalidades duplicadas)',
      otimizaveis: 'Custos Otimizáveis (taxas de cartão e maquininhas, fornecedores renegociáveis, perdas por faltas)',
      contratacoes: 'Contratações Evitáveis (recepcionistas/administrativos para tarefas que a automação de agenda assume)',
      margem: 'Margem Recuperável (menos faltas, menos retrabalho de faturamento e mais horários ocupados)',
      receita: 'Receita Destravável (agenda otimizada, retorno de pacientes e follow-up automatizado de orçamentos)'
    },
    top5: [
      {
        titulo: 'Retrabalho Manual na Recepção e no Faturamento',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas confirmando consultas manualmente, digitando prontuários e conferindo guias entre agenda, WhatsApp e planilhas.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Agendamento e confirmação automatizados, prontuário digital integrado e faturamento de convênios sem redigitação.',
        comoResolver: 'Gatilhos automáticos entre agenda, WhatsApp e sistema clínico para lembrete, reagendamento e recall de pacientes.',
        tecnologiaNecessaria: 'Automação de agendamento no WhatsApp + integração agenda × faturamento.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações de Recepção e Administrativo Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para dar conta das mensagens e tarefas administrativas antes de automatizar agenda e faturamento.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a capacidade da recepção atual antes de abrir novas vagas operacionais.',
        comoResolver: 'Automatizar confirmações, encaixes e triagem das dúvidas mais frequentes no WhatsApp.',
        tecnologiaNecessaria: 'Assistente no WhatsApp + fluxos automáticos de confirmação e lembrete.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Sócio/Supervisor Preso no Operacional da Clínica',
        oQueEstaAcontecendo: 'A liderança gasta {horasDonoSemana}h semanais ({horasDono}h/mês) resolvendo agendas, escalas, cobranças e urgências do dia a dia.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas claras para encaixes, descontos, escala de equipe e fornecedores serem decididos sem o dono.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com indicadores automáticos de agenda.',
        tecnologiaNecessaria: 'Central de aprovações + painel de ocupação da agenda em tempo real.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Pacientes Interessados Perdidos no Follow-up',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana da equipe gastas respondendo dúvidas repetitivas e fazendo follow-up manual de orçamentos de procedimentos.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em consultas e procedimentos adicionais destraváveis',
        oQueDeveMudar: 'Follow-up automatizado de orçamentos e respostas prontas para as dúvidas mais frequentes.',
        comoResolver: 'Esteira automática de retorno de orçamentos e reativação de pacientes há tempos sem retorno.',
        tecnologiaNecessaria: 'CRM do paciente + disparos automáticos segmentados por tratamento.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Sistemas Duplicados e Despesas Gerais sem Revisão',
        oQueEstaAcontecendo: 'Licenças de sistema clínico, módulos não utilizados e fornecedores sem renegociação periódica.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Corte imediato de licenças redundantes e renegociação de contratos e taxas.',
        comoResolver: 'Auditoria das licenças e consolidação em um único sistema clínico integrado.',
        tecnologiaNecessaria: 'Auditoria de SaaS e consolidação de contratos.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar licenças e módulos de sistema clínico sem uso e renegociar taxas de maquininha',
        responsavel: 'Financeiro / Gestão',
        objetivo: 'Reduzir custos fixos sem impactar o atendimento',
        indicador: 'R$ economizados por mês em softwares e taxas',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Ativar confirmação e lembrete automático de consultas pelo WhatsApp',
        responsavel: 'Recepção',
        objetivo: 'Reduzir faltas (no-show) e liberar a recepção das ligações repetitivas',
        indicador: '% de faltas e horários vagos na agenda',
        prazo: '20 dias',
        resultado: 'Agenda mais cheia e menos horas de confirmação manual por dia.'
      },
      {
        acao: 'Instituir alçadas para encaixes, descontos e escala de equipe',
        responsavel: 'Sócio / Gestor Clínico',
        objetivo: 'Liberar no mínimo 8 horas semanais da liderança do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Menos gargalos de aprovação e decisões mais ágeis no dia a dia.'
      },
      {
        acao: 'Padronizar respostas de dúvidas frequentes e orçamentos no WhatsApp',
        responsavel: 'Atendimento',
        objetivo: 'Cortar o retrabalho de responder as mesmas dúvidas todos os dias',
        indicador: 'Horas semanais da equipe em respostas repetitivas',
        prazo: '30 dias',
        resultado: 'Economia de horas diárias da recepção para focar no presencial.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos da operação da clínica',
        acoes: [
          'Auditar licenças de sistemas, contratos, taxas de cartão e despesas sem retorno.',
          'Definir matriz de alçadas para encaixes, descontos e escala eliminando a dependência do dono.',
          'Mapear e padronizar os 3 processos que mais geram retrabalho: confirmação, cadastro e faturamento.'
        ]
      },
      fase2: {
        foco: 'Automatizar agenda, WhatsApp e faturamento',
        acoes: [
          'Conectar agenda, WhatsApp e sistema clínico para eliminar digitação duplicada de dados do paciente.',
          'Ativar esteira de confirmação, lembrete e recall automatizados.',
          'Implantar conciliação e cobrança automatizadas (particular e convênios).'
        ]
      },
      fase3: {
        foco: 'Consolidar agenda cheia, indicadores e escala',
        acoes: [
          'Criar painel com ocupação da agenda, faltas, retorno de pacientes e DRE em tempo real.',
          'Absorver mais pacientes sem contratar proporcionalmente nova equipe.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações de recepção e administrativo pelos próximos 60 dias até liberar as {horasRec} horas de tarefas manuais mapeadas.',
      'Integrar agenda, WhatsApp e sistema clínico eliminando a redigitação de dados do paciente entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de encaixe, desconto e escala que hoje travam na mesa do dono.'
    ]
  },

  contabilidade: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas à conferência manual de notas, cobrança de documentos dos clientes e digitação entre sistema contábil e planilhas — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo dos sócios e analistas que poderia estar focado em novos contratos, planejamento tributário e relacionamento. O escritório possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'O escritório tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar a equipe, bastando automatizar coleta de documentos, faturamento de honorários e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças de sistemas contábeis ociosas, marketing sem mensuração, serviços duplicados)',
      otimizaveis: 'Custos Otimizáveis (despesas do escritório, serviços terceirizados e contratos de suporte renegociáveis)',
      contratacoes: 'Contratações Evitáveis (analistas para digitação e cobrança que a automação assume)',
      margem: 'Margem Recuperável (menos retrabalho de conferência, fechamentos mais rápidos e mais clientes atendidos)',
      receita: 'Receita Destravável (sócios liberados para novos contratos e follow-up automatizado de propostas)'
    },
    top5: [
      {
        titulo: 'Digitação entre Sistema Contábil, Banco e Planilhas',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas importando notas, conferindo lançamentos e transmitindo dados entre emissor, banco e sistema contábil.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Importação automática de NF-e, integração com o banco e lançamentos padronizados.',
        comoResolver: 'Conectar emissor de notas, Open Finance e sistema contábil via automações.',
        tecnologiaNecessaria: 'APIs de NF-e/Open Finance + automações n8n/Make.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações de Analistas Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para cobrir picos de fechamento e o volume de documentos antes de automatizar a coleta.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Automatizar coleta de documentos e tarefas repetitivas antes de abrir novas vagas.',
        comoResolver: 'Portal/checklist automático com lembretes de envio para os clientes.',
        tecnologiaNecessaria: 'Automação de cobrança de documentos + portal do cliente.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Sócio Preso no Operacional do Escritório',
        oQueEstaAcontecendo: 'O sócio gasta {horasDonoSemana}h semanais ({horasDono}h/mês) resolvendo dúvidas fiscais urgentes, aprovações e problemas da operação.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para os analistas decidirem dúvidas rotineiras e aprovações de propostas.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com indicadores de carteira.',
        tecnologiaNecessaria: 'Central de aprovações + painel de carteira e prazos em tempo real.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Propostas e Follow-up Parados na Gaveta',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana dos sócios gastas montando propostas manualmente e cobrando dados em vez de negociar e fechar novos clientes.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em novos contratos de honorários destraváveis',
        oQueDeveMudar: 'Propostas geradas a partir da base de dados e follow-up automático das propostas enviadas.',
        comoResolver: 'Gerador de propostas automáticas + esteira de follow-up por WhatsApp e e-mail.',
        tecnologiaNecessaria: 'CRM com propostas automáticas + IA para follow-up e qualificação.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Sistemas Duplicados e Despesas sem Renegociação',
        oQueEstaAcontecendo: 'Licenças de sistemas contábeis, módulos não usados e fornecedores sem revisão periódica de preços.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Corte imediato de licenças redundantes e renegociação de contratos.',
        comoResolver: 'Auditoria de tecnologia e consolidação em ferramentas integradas.',
        tecnologiaNecessaria: 'Auditoria de SaaS e consolidação de contratos.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar licenças de sistemas contábeis ociosas e renegociar contratos de suporte',
        responsavel: 'Financeiro / TI',
        objetivo: 'Reduzir custos fixos sem impactar a operação do escritório',
        indicador: 'R$ economizados por mês em softwares',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas para dúvidas fiscais rotineiras e aprovações de propostas',
        responsavel: 'Sócios',
        objetivo: 'Liberar no mínimo 8 horas semanais dos sócios do operacional',
        indicador: 'Horas semanais do sócio no operacional',
        prazo: '20 dias',
        resultado: 'Menos gargalos de aprovação e processos mais ágeis.'
      },
      {
        acao: 'Automatizar cobrança de documentos e follow-up de propostas contábeis',
        responsavel: 'Comercial / Atendimento',
        objetivo: 'Evitar que propostas e documentos fiquem parados mais de 48 horas',
        indicador: 'Taxa de conversão de propostas',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% na conversão sem investir mais em marketing.'
      },
      {
        acao: 'Substituir digitação manual de notas e conciliação por integrações',
        responsavel: 'Financeiro',
        objetivo: 'Acabar com a redigitação entre emissor, banco e sistema contábil',
        indicador: 'Horas semanais do financeiro',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês do time para focar em análise, cobrança e DRE.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar licenças de sistemas, contratos e despesas sem retorno.',
          'Definir matriz de alçadas eliminando a dependência dos sócios para dúvidas de rotina.',
          'Mapear e padronizar os 3 processos que mais geram retrabalho: conferência, faturamento e cobrança de documentos.'
        ]
      },
      fase2: {
        foco: 'Integrar sistemas e automatizar rotinas críticas',
        acoes: [
          'Conectar sistema contábil, banco e emissor de notas para eliminar digitação duplicada.',
          'Ativar portal/checklist automático para coleta de documentos dos clientes.',
          'Implantar régua de cobrança de honorários e conciliação 100% automatizadas.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores e capacidade de escala',
        acoes: [
          'Criar painel com carteira, inadimplência, horas por cliente e DRE em tempo real.',
          'Absorver novos clientes sem contratar proporcionalmente analistas.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações de analistas pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho e digitação mapeadas.',
      'Integrar sistema contábil, banco e emissor de notas eliminando a redigitação de informações entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das dúvidas e aprovações que hoje travam na mesa dos sócios.'
    ]
  },

  industria: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas à digitação manual de pedidos, planilhas de PCP e conferência entre ERP e produção — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo da equipe e da liderança que poderia estar focado em melhoria de processos, qualidade e vendas técnicas. A indústria possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'A fábrica tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar a produção ou a equipe, bastando automatizar o fluxo de pedidos, PCP e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças de ERP e módulos ociosos, energia sem mensuração, marketing sem retorno)',
      otimizaveis: 'Custos Otimizáveis (compras emergenciais, perdas de material e despesas gerais renegociáveis)',
      contratacoes: 'Contratações Evitáveis (operários e administrativos para tarefas que automação e integração assumem)',
      margem: 'Margem Recuperável (menos retrabalho, menos atraso de PCP e maior giro de produção)',
      receita: 'Receita Destravável (vendedores técnicos liberados e cotações respondidas mais rápido)'
    },
    top5: [
      {
        titulo: 'Retrabalho entre Pedidos, PCP e Produção',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas transmitindo pedidos para a fábrica, atualizando planilhas de PCP e conferindo estoque manualmente.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Passagem automática do pedido para a produção e status de entrega em tempo real.',
        comoResolver: 'Integrar ERP, PCP e expedição com gatilhos automáticos de ordem de produção.',
        tecnologiaNecessaria: 'ERP + automações de fluxo (n8n/Make) e status automático para o cliente.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações de Chão de Fábrica e Administrativo Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para cobrir a demanda sem antes eliminar gargalos de PCP e digitação.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a capacidade da estrutura atual antes de abrir novas vagas operacionais.',
        comoResolver: 'Automatizar passagem de pedidos, relatórios de produção e compras recorrentes.',
        tecnologiaNecessaria: 'SOPs digitais, dashboards de produtividade e compras programadas.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Dono/Diretor Preso no Operacional da Fábrica',
        oQueEstaAcontecendo: 'A liderança gasta {horasDonoSemana}h semanais ({horasDono}h/mês) resolvendo urgências de produção, compras e conflitos do dia a dia.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para aprovações de compra, prioridades de PCP e decisões operacionais.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com painel de produção.',
        tecnologiaNecessaria: 'Central de aprovações + painel de indicadores de produção em tempo real.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Cotações e Follow-up Comercial Travados',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana da equipe técnica gastas montando orçamentos manuais e consultando estoque em vez de vender.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em pedidos adicionais destraváveis',
        oQueDeveMudar: 'Orçamentos automáticos a partir da tabela técnica e follow-up de cotações em aberto.',
        comoResolver: 'Gerador de propostas + esteira de follow-up por WhatsApp e e-mail.',
        tecnologiaNecessaria: 'CRM industrial com orçamentos automáticos + IA para follow-up.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Desperdício Tecnológico e Compras sem Gestão',
        oQueEstaAcontecendo: 'Sistemas duplicados, licenças ociosas e compras emergenciais sem tabela de preços negociada com fornecedores.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Cancelamento de ferramentas redundantes e compras programadas com fornecedores homologados.',
        comoResolver: 'Auditoria de stack tecnológica e renegociação de contratos de insumos.',
        tecnologiaNecessaria: 'Auditoria de SaaS + tabela de compras e cotações centralizadas.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar licenças de ERP ociosas e renegociar contratos de energia e insumos',
        responsavel: 'Financeiro / Compras',
        objetivo: 'Reduzir custos fixos sem impactar a produção',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas para aprovações de compra e decisões de PCP',
        responsavel: 'Diretoria / Gerência',
        objetivo: 'Liberar no mínimo 8 horas semanais da liderança do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Menos gargalos de aprovação e produção mais ágil.'
      },
      {
        acao: 'Automatizar follow-up de cotações e orçamentos técnicos',
        responsavel: 'Comercial',
        objetivo: 'Evitar que cotações respondidas fiquem sem retorno',
        indicador: 'Taxa de conversão de cotações',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% na conversão sem investir mais em prospecção.'
      },
      {
        acao: 'Eliminar conferência manual entre pedidos, estoque e notas fiscais',
        responsavel: 'PCP / Financeiro',
        objetivo: 'Acabar com a redigitação entre área comercial, fábrica e financeiro',
        indicador: 'Horas semanais do PCP e financeiro',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês e menos erros de pedido e expedição.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar licenças de sistemas, contratos de energia e despesas sem retorno.',
          'Definir matriz de alçadas para aprovações de compra e prioridades de PCP.',
          'Mapear e padronizar os 3 processos mais críticos: pedido→fábrica, cotação e expedição.'
        ]
      },
      fase2: {
        foco: 'Integrar ERP, PCP e financeiro com automações',
        acoes: [
          'Conectar ERP, PCP e banco para eliminar digitação duplicada de pedidos e notas.',
          'Ativar orçamentos automáticos e esteira de follow-up de cotações.',
          'Implantar conciliação e cobrança 100% automatizadas.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, produtividade e escala',
        acoes: [
          'Criar painel com prazo de entrega, apontamentos, margem por pedido e DRE em tempo real.',
          'Absorver o novo volume de pedidos sem contratar pessoas na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações operacionais pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho e planilhas mapeadas.',
      'Integrar ERP, PCP e financeiro eliminando a digitação manual de informações entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das aprovações de compra e decisões do dia a dia que hoje travam na mesa do dono.'
    ]
  },

  comercio_varejo: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas à conferência manual de preços, atualização de planilhas de estoque e fechamento de caixa — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo da equipe de vendas que poderia estar focado em atender e converter clientes na loja. A operação possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'O comércio tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar a equipe, bastando automatizar estoque, atendimento e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças de sistema ociosas, anúncios sem mensuração, serviços duplicados)',
      otimizaveis: 'Custos Otimizáveis (taxas de cartão, perdas de estoque e despesas gerais renegociáveis)',
      contratacoes: 'Contratações Evitáveis (atendentes para tarefas administrativas que a automação assume)',
      margem: 'Margem Recuperável (menos perdas, menos retrabalho de caixa e maior giro de mercadoria)',
      receita: 'Receita Destravável (vendedores liberados para vender e follow-up de clientes automatizado)'
    },
    top5: [
      {
        titulo: 'Retrabalho no Estoque, Caixa e Planilhas',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas conferindo preços, atualizando planilhas de estoque e fechando o caixa manualmente.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Estoque e caixa unificados no sistema, com entrada de mercadoria digitalizada e preço automático.',
        comoResolver: 'Integrar PDV, estoque e emissor fiscal com leitura de nota de entrada.',
        tecnologiaNecessaria: 'Sistema PDV integrado + automação de entrada de mercadoria.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações de Loja e Administrativo Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para cobrir a operação sem antes automatizar estoque, caixa e reposição.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a capacidade dos vendedores atuais antes de abrir novas vagas.',
        comoResolver: 'Automatizar reposição, etiquetagem e relatórios do caixa.',
        tecnologiaNecessaria: 'Sistema de gestão com reposição sugerida e dashboards automáticos.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Dono Preso no Balcão e na Operação da Loja',
        oQueEstaAcontecendo: 'O dono gasta {horasDonoSemana}h semanais ({horasDono}h/mês) no balcão, resolvendo estoque, preço e problemas do dia a dia.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas de desconto, reposição e troca para a equipe decidir sem o dono.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com indicadores da loja.',
        tecnologiaNecessaria: 'Central de aprovações + painel de vendas e estoque em tempo real.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Vendas Perdidas no Atendimento e no Follow-up',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana da equipe gastas com tarefas burocráticas em vez de atender e vender no balcão e no WhatsApp.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em vendas adicionais destraváveis',
        oQueDeveMudar: 'Respostas rápidas de disponibilidade e follow-up automático de orçamentos e propostas.',
        comoResolver: 'Atendimento automatizado no WhatsApp e recuperação de clientes sem compra há tempo.',
        tecnologiaNecessaria: 'WhatsApp comercial automatizado + CRM de clientes.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Taxas, Sistemas e Despesas sem Revisão',
        oQueEstaAcontecendo: 'Sistemas duplicados, taxas de cartão altas, licenças ociosas e contratos antigos sem renegociação.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Renegociação de maquininhas, corte de licenças e revisão de fornecedores.',
        comoResolver: 'Auditoria de custos fixos e consolidação de contratos.',
        tecnologiaNecessaria: 'Auditoria de SaaS e negociação de adquirência.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar licenças de sistemas ociosas e renegociar taxas de cartão e maquininha',
        responsavel: 'Financeiro',
        objetivo: 'Reduzir custos fixos sem impactar as vendas',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas de desconto e reposição para a equipe de loja',
        responsavel: 'Dono / Gestor da Loja',
        objetivo: 'Liberar no mínimo 8 horas semanais do dono do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Decisões de preço e reposição mais rápidas sem engarrafamento.'
      },
      {
        acao: 'Automatizar follow-up de clientes e orçamentos pelo WhatsApp',
        responsavel: 'Vendas',
        objetivo: 'Evitar que interessados fiquem sem resposta e recuperar clientes antigos',
        indicador: 'Taxa de conversão de atendimentos',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% nas vendas sem investir mais em tráfego.'
      },
      {
        acao: 'Substituir conferência manual de preços e estoque por sistema integrado',
        responsavel: 'Estoque / Caixa',
        objetivo: 'Acabar com planilhas paralelas e divergência de inventário',
        indicador: 'Horas semanais de inventário e conferência',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês e menos divergências de caixa e estoque.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar licenças, taxas de cartão e contratos sem retorno.',
          'Definir matriz de alçadas de desconto e reposição eliminando a dependência do dono.',
          'Mapear e padronizar os 3 processos mais críticos: entrada de mercadoria, caixa e atendimento.'
        ]
      },
      fase2: {
        foco: 'Integrar PDV, estoque e atendimento',
        acoes: [
          'Conectar PDV, estoque e WhatsApp para eliminar digitação duplicada.',
          'Ativar recomendações de reposição e follow-up automático de clientes.',
          'Implantar conciliação de cartões e cobrança automatizadas.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, giro e capacidade de escala',
        acoes: [
          'Criar painel com giro, ruptura, vendas por vendedor e DRE em tempo real.',
          'Absorver crescimento de vendas sem contratar pessoas na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações de loja pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho e planilhas mapeadas.',
      'Integrar PDV, estoque e WhatsApp eliminando a digitação duplicada de informações entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de desconto e reposição que hoje travam na mesa do dono.'
    ]
  },

  advocacia: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas à elaboração manual de minutas repetitivas, cobrança de documentos e conferência de prazos — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo do advogado e da equipe que poderia estar focado em causas estratégicas e novos clientes. O escritório possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'O escritório tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar a equipe, bastando automatizar triagem, minutas padrão e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças de sistemas jurídicos ociosas, marketing sem mensuração, serviços duplicados)',
      otimizaveis: 'Custos Otimizáveis (custas e despesas processuais, serviços cartoriais e despesas gerais renegociáveis)',
      contratacoes: 'Contratações Evitáveis (pessoas para digitação e cobrança que a automação assume)',
      margem: 'Margem Recuperável (menos retrabalho de minutas e menos prazos perdidos)',
      receita: 'Receita Destravável (sócios liberados para fechar honorários e follow-up automatizado de consultas)'
    },
    top5: [
      {
        titulo: 'Retrabalho em Minutas, Documentos e Prazos',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas redigindo minutas repetitivas, cobrando documentos dos clientes e conferindo prazos manualmente.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Minutas padrão automatizadas e controle de prazos com alertas automáticos.',
        comoResolver: 'Biblioteca de cláusulas com preenchimento automático e agenda de prazos integrada.',
        tecnologiaNecessaria: 'Sistema jurídico com minutas automáticas + alertas de prazo.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações Administrativas Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para digitação, cobrança e triagem antes de automatizar essas rotinas.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a capacidade da secretaria e dos assessores atuais antes de abrir vagas.',
        comoResolver: 'Automatizar cobrança de documentos, honorários e triagem inicial de contatos.',
        tecnologiaNecessaria: 'Fluxos automáticos de cobrança + triagem digital de novos contatos.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Sócio Preso no Operacional do Escritório',
        oQueEstaAcontecendo: 'O advogado gasta {horasDonoSemana}h semanais ({horasDono}h/mês) resolvendo cobranças, triagem de clientes e rotinas do escritório.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para a secretaria e assessores decidirem rotinas sem consultar o sócio.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com painel de causas.',
        tecnologiaNecessaria: 'Central de aprovações + painel de prazos e carteira em tempo real.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Consultas e Honorários Perdidos no Follow-up',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana gastas em atendimento e burocracia em vez de negociar e fechar novos contratos de honorários.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em novos contratos destraváveis',
        oQueDeveMudar: 'Follow-up automático das consultas recebidas e propostas enviadas.',
        comoResolver: 'Esteira de retorno de contatos jurídicos e recuperação de consultas sem resposta.',
        tecnologiaNecessaria: 'CRM jurídico + disparos automáticos de follow-up.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Sistemas e Despesas sem Revisão Periódica',
        oQueEstaAcontecendo: 'Licenças de sistemas jurídicos, módulos não usados e despesas gerais sem renegociação.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Corte de ferramentas redundantes e renegociação de contratos.',
        comoResolver: 'Auditoria de tecnologia e despesas do escritório.',
        tecnologiaNecessaria: 'Auditoria de SaaS e consolidação de contratos.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar licenças de sistemas jurídicos ociosas e renegociar contratos',
        responsavel: 'Financeiro / Gestão',
        objetivo: 'Reduzir custos fixos sem impactar a rotina do escritório',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas para cobranças, aprovações e triagem de novos contatos',
        responsavel: 'Sócios',
        objetivo: 'Liberar no mínimo 8 horas semanais dos sócios do operacional',
        indicador: 'Horas semanais do sócio no operacional',
        prazo: '20 dias',
        resultado: 'Menos gargalos e atendimento mais ágil aos clientes.'
      },
      {
        acao: 'Automatizar follow-up de consultas e propostas de honorários',
        responsavel: 'Comercial / Secretaria',
        objetivo: 'Evitar que consultas e propostas fiquem paradas mais de 48 horas',
        indicador: 'Taxa de conversão de propostas',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% no fechamento de novos contratos.'
      },
      {
        acao: 'Padronizar minutas frequentes e controle automático de prazos',
        responsavel: 'Equipe Jurídica',
        objetivo: 'Cortar retrabalho de redação repetitiva e risco de prazo perdido',
        indicador: 'Horas semanais em minutas padrão',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês e zero prazos perdidos por descuido.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar licenças de sistemas, custas e despesas sem retorno.',
          'Definir matriz de alçadas eliminando a dependência dos sócios para rotinas.',
          'Mapear e padronizar os 3 processos mais críticos: triagem, minutas e cobrança de honorários.'
        ]
      },
      fase2: {
        foco: 'Integrar sistemas e automatizar rotinas jurídicas',
        acoes: [
          'Conectar sistema jurídico, banco e agenda de prazos para eliminar digitação duplicada.',
          'Ativar minutas padrão automatizadas e alertas de prazos.',
          'Implantar régua de cobrança de honorários e conciliação automatizadas.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, carteira e escala',
        acoes: [
          'Criar painel com carteira de causas, prazos, inadimplência e DRE em tempo real.',
          'Absorver novos clientes sem contratar proporcionalmente assessores.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações administrativas pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho e minutas mapeadas.',
      'Integrar sistema jurídico, banco e agenda de prazos eliminando a digitação manual entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de cobrança e rotina que hoje travam na mesa do sócio.'
    ]
  },

  servicos: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas à montagem manual de propostas, atualização de planilhas de projeto e cobrança de dados de clientes — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo da equipe técnica e dos sócios que poderia estar focado em entregas de excelência e novos projetos. A empresa possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'A empresa tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar a equipe, bastando automatizar propostas, entregas e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças e ferramentas ociosas, marketing sem mensuração, serviços duplicados)',
      otimizaveis: 'Custos Otimizáveis (subcontratações mal dimensionadas e despesas gerais renegociáveis)',
      contratacoes: 'Contratações Evitáveis (pessoas para tarefas administrativas que a automação assume)',
      margem: 'Margem Recuperável (menos retrabalho, menos atraso de entrega e mais horas faturáveis)',
      receita: 'Receita Destravável (equipe comercial liberada e follow-up automatizado de propostas)'
    },
    top5: [
      {
        titulo: 'Retrabalho na Montagem de Propostas e Planilhas de Projeto',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas montando propostas manualmente, atualizando planilhas de projeto e cobrando dados de clientes.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Propostas e cronogramas gerados automaticamente a partir de modelos padronizados.',
        comoResolver: 'Modelos de proposta com dados automáticos e status de projeto integrado.',
        tecnologiaNecessaria: 'Gerador de propostas + gestão de projetos integrada ao comercial.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações Administrativas Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para suportar a operação antes de automatizar propostas, cobranças e relatórios.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a capacidade da equipe atual antes de abrir novas vagas.',
        comoResolver: 'Automatizar cobrança de dados, relatórios de status e cobrança de clientes.',
        tecnologiaNecessaria: 'Fluxos automáticos + portal do cliente com status em tempo real.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Sócio Preso na Operação e nas Entregas',
        oQueEstaAcontecendo: 'A liderança gasta {horasDonoSemana}h semanais ({horasDono}h/mês) resolvendo entregas, imprevistos e cobranças do dia a dia.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para a equipe técnica e administrativa decidirem sem o sócio.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com painel de projetos.',
        tecnologiaNecessaria: 'Central de aprovações + painel de projetos e capacidade em tempo real.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Propostas e Follow-up Parados no Funil',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana da equipe comercial gastas com tarefas administrativas em vez de prospectar e fechar contratos.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em novos contratos destraváveis',
        oQueDeveMudar: 'Follow-up automático de propostas enviadas e recuperação de contatos frios.',
        comoResolver: 'Esteira de follow-up por WhatsApp e e-mail com gatilhos por etapa do funil.',
        tecnologiaNecessaria: 'CRM + agente de IA para follow-up e qualificação.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Ferramentas e Despesas sem Revisão Periódica',
        oQueEstaAcontecendo: 'Licenças de ferramentas duplicadas, serviços pouco usados e contratos sem renegociação.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Cancelamento de ferramentas redundantes e renegociação de contratos.',
        comoResolver: 'Auditoria de stack de ferramentas e despesas gerais.',
        tecnologiaNecessaria: 'Auditoria de SaaS e consolidação de contratos.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar licenças e ferramentas sem uso e renegociar contratos de terceirizados',
        responsavel: 'Financeiro / TI',
        objetivo: 'Reduzir custos fixos sem impactar as entregas',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas para aprovações, escopo e cobranças',
        responsavel: 'Sócios / Gestor',
        objetivo: 'Liberar no mínimo 8 horas semanais da liderança do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Menos gargalos de aprovação e projetos mais ágeis.'
      },
      {
        acao: 'Automatizar follow-up de propostas e orçamentos enviados',
        responsavel: 'Comercial',
        objetivo: 'Evitar que propostas fiquem paradas mais de 48 horas',
        indicador: 'Taxa de conversão de propostas',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% na conversão sem investir mais em tráfego.'
      },
      {
        acao: 'Eliminar redigitação entre proposta, projeto e financeiro',
        responsavel: 'Operação / Financeiro',
        objetivo: 'Acabar com a cópia manual de dados entre setores',
        indicador: 'Horas semanais de retrabalho',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês e menos erros de escopo e faturamento.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar licenças de ferramentas, contratos e despesas sem retorno.',
          'Definir matriz de alçadas eliminando a dependência do sócio para aprovações.',
          'Mapear e padronizar os 3 processos mais críticos: proposta, entrega e cobrança.'
        ]
      },
      fase2: {
        foco: 'Integrar comercial, projetos e financeiro',
        acoes: [
          'Conectar CRM, gestão de projetos e financeiro para eliminar digitação duplicada.',
          'Ativar propostas automáticas e esteira de follow-up por etapa.',
          'Implantar cobrança e conciliação 100% automatizadas.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, margem e escala',
        acoes: [
          'Criar painel com horas faturáveis, margem por projeto, funil e DRE em tempo real.',
          'Absorver novos contratos sem contratar pessoas na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações administrativas pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho e planilhas mapeadas.',
      'Integrar comercial, projetos e financeiro eliminando a digitação manual de informações entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de escopo, aprovação e cobrança que hoje travam na mesa do sócio.'
    ]
  },

  outro: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas a digitação manual em planilhas, retrabalho e conferências repetitivas entre setores desconectados — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo da equipe e da liderança que poderia estar focado em prospecção, entrega de excelência e fechamento. A operação possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'A empresa possui potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar abrir novas vagas operacionais, bastando automatizar o fluxo de dados e implantar alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças de software ociosas, marketing sem mensuração, serviços duplicados)',
      otimizaveis: 'Custos Otimizáveis (despesas gerais renegociáveis, redução de perdas e compras)',
      contratacoes: 'Contratações Potencialmente Evitáveis (Absorção de demanda com capacidade recuperada)',
      margem: 'Margem Recuperável (Eliminação de retrabalho e agilidade operacional)',
      receita: 'Receita Destravável (Liberação de vendedores para vender + automação de follow-up)'
    },
    top5: [
      {
        titulo: 'Capacidade Ociosa em Tarefas Manuais e Retrabalho',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas em planilhas, digitação duplicada e conferências manuais.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Substituição de rotinas de cópia e conferência por integrações nativas e automações de fluxo.',
        comoResolver: 'Mapeamento de gatilhos automáticos entre CRM, ERP, WhatsApp e Planilhas.',
        tecnologiaNecessaria: 'Webhooks, automações n8n/Make e esteiras digitais.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações Futuras Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para suportar o crescimento sem otimizar a estrutura atual.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a produtividade da equipe existente antes de abrir novas vagas operacionais.',
        comoResolver: 'Eliminação de tarefas inúteis e redistribuição de demandas para os colaboradores liberados.',
        tecnologiaNecessaria: 'SOPs digitais, checklists automatizados e dashboards de produtividade.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Sobrecarga Operacional da Liderança / Dono',
        oQueEstaAcontecendo: 'O empresário gasta {horasDonoSemana}h semanais ({horasDono}h/mês) no operacional resolvendo problemas rotineiros.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas de decisão claras, matriz de delegação e processos que rodam sem aval do dono.',
        comoResolver: 'Automação de aprovações pré-fixadas e implementação de rotinas de governança semanal.',
        tecnologiaNecessaria: 'Central de aprovações assíncrona e relatórios executivos automáticos.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Vazamento de Receita no Funil Comercial',
        oQueEstaAcontecendo: 'Vendedores gastando {horasAdmComercial}h/semana em tarefas administrativas em vez de focar em prospecção e fechamento.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em vendas adicionais destraváveis',
        oQueDeveMudar: 'Automação de follow-up, qualificação por IA e preenchimento de CRM automatizado.',
        comoResolver: 'Assistente de vendas para transcrição, resumo de reuniões e disparo automático de propostas.',
        tecnologiaNecessaria: 'CRM integrado + Agente de IA para follow-up e qualificação.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Desperdício e Duplicação Tecnológica & Geral',
        oQueEstaAcontecendo: 'Softwares duplicados, licenças subutilizadas e despesas gerais com fornecedores sem renegociação periódica.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Cancelamento imediato de ferramentas redundantes e renegociação com fornecedores-chave.',
        comoResolver: 'Auditoria de stack tecnológica e consolidação em ferramentas all-in-one.',
        tecnologiaNecessaria: 'Auditoria de SaaS e consolidação de contratos.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Auditoria e corte de ferramentas duplicadas e licenças ociosas de software',
        responsavel: 'Financeiro / TI',
        objetivo: 'Cortar desperdícios diretos identificados no bloco de tecnologia',
        indicador: 'R$ economizados por mês em SaaS',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas de decisão e central de aprovações para desafogar o Dono',
        responsavel: 'CEO / Diretoria',
        objetivo: 'Liberar no mínimo 8 horas semanais do empresário de tarefas operacionais',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Redução imediata de gargalos de aprovação e maior agilidade na entrega.'
      },
      {
        acao: 'Implementar automação de follow-up e recuperação de orçamentos parados',
        responsavel: 'Líder Comercial',
        objetivo: 'Evitar que leads qualificados fiquem sem contato há mais de 48 horas',
        indicador: 'Taxa de conversão de propostas',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% na taxa de conversão sem investir mais em tráfego.'
      },
      {
        acao: 'Eliminar conferência manual de relatórios e conciliação bancária duplicada',
        responsavel: 'Financeiro',
        objetivo: 'Substituir digitação manual de notas e boletos por integração direta',
        indicador: 'Horas semanais do financeiro',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês de equipe financeira para focar em cobrança e DRE.'
      }
    ],
    plano90Dias: {
      fase1: {
        periodo: '0 a 30 DIAS',
        foco: 'Encontrar e eliminar desperdícios imediatos & Quick Wins',
        acoes: [
          'Auditar custos de tecnologia, ferramentas sem uso e contratos antigos.',
          'Definir matriz de delegação eliminando dependência do dono para decisões de rotina.',
          'Mapear e padronizar os 3 processos mais críticos que geram retrabalho.'
        ]
      },
      fase2: {
        periodo: '31 a 60 DIAS',
        foco: 'Implementar integrações e automações prioritárias',
        acoes: [
          'Conectar CRM, WhatsApp e ERP para acabar com digitação duplicada.',
          'Ativar esteira de atendimento com triagem automatizada e IA assistida.',
          'Implantar rotina de cobrança e conciliação bancária 100% automatizada.'
        ]
      },
      fase3: {
        periodo: '61 a 90 DIAS',
        foco: 'Consolidar indicadores, produtividade e capacidade de escala',
        acoes: [
          'Criar painel de BI com indicadores semanais em tempo real (DRE, CAC, LTV).',
          'Absorver o novo volume de faturamento sem contratar novas pessoas na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações operacionais imediatamente pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho e planilhas mapeadas.',
      'Auditar e integrar a tecnologia (CRM + Financeiro + Operação) eliminando a digitação manual de informações entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões que hoje travam na mesa do dono, focando seu tempo exclusivamente em expansão e parcerias.'
    ]
  }
};

// ==========================================
// RELATÓRIO EXECUTIVO POR SEGMENTO (overrides)
// ==========================================
const SEGMENT_REPORTS = {
  restaurante_bar: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas ao controle manual de estoque da cozinha, montagem de escalas e conciliação de caixas e pedidos de delivery — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo da equipe de salão e cozinha que poderia estar focado em atender bem e girar mais mesas. O restaurante possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'O restaurante tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar a equipe, bastando automatizar compras, escala e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças de sistema ociosas, comissões e anúncios sem mensuração, serviços duplicados)',
      otimizaveis: 'Custos Otimizáveis (desperdício de insumos, taxas de cartão e delivery, despesas gerais renegociáveis)',
      contratacoes: 'Contratações Evitáveis (equipe administrativa para tarefas que a automação assume)',
      margem: 'Margem Recuperável (menos desperdício de comida, menos retrabalho de caixa e mais mesas atendidas)',
      receita: 'Receita Destravável (mais mesas giradas, delivery otimizado e retorno de clientes)'
    },
    top5: [
      {
        titulo: 'Retrabalho no Estoque de Insumos, Escala e Caixa',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas conferindo estoque da cozinha, montando escalas e conciliando caixas e pedidos de delivery manualmente.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Controle de insumos digitalizado, escala automatizada e conciliação de caixa unificada.',
        comoResolver: 'Integrar PDV, estoque da cozinha e aplicativos de delivery em um fluxo só.',
        tecnologiaNecessaria: 'Sistema de gestão para restaurante + automações de caixa e estoque.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações de Equipe Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para administrativo e apoio antes de automatizar compras, escala e caixa.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a capacidade da equipe atual antes de abrir novas vagas.',
        comoResolver: 'Automatizar pedidos de compra, escalas e relatórios de caixa.',
        tecnologiaNecessaria: 'Gestão automática de escala, compras programadas e fechamento de caixa digital.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Dono Preso na Operação do Restaurante',
        oQueEstaAcontecendo: 'O dono gasta {horasDonoSemana}h semanais ({horasDono}h/mês) no salão e na cozinha resolvendo urgências do serviço, fornecedores e conflitos de escala.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para chef, gerente e recepção decidirem sem consultar o dono em cada turno.',
        comoResolver: 'Matriz de alçadas (descontos, compras, troca de escala) e rotina de governança semanal.',
        tecnologiaNecessaria: 'Central de aprovações + painel de ocupação, custo de prato e caixa.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Mesas, Reservas e Clientes Perdidos no Atendimento',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana da equipe gastas com burocracia em vez de atender mesas, responder reservas e recuperar clientes.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em mais giro e pedidos destraváveis',
        oQueDeveMudar: 'Respostas automáticas de reserva/cardápio e recuperação de clientes há tempos sem vir.',
        comoResolver: 'Atendimento automatizado no WhatsApp e campanhas de retorno para base de clientes.',
        tecnologiaNecessaria: 'WhatsApp automatizado + CRM de clientes com histórico de visitas.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Desperdício de Insumos e Despesas sem Revisão',
        oQueEstaAcontecendo: 'Compras emergenciais acima do preço, comida vencida, taxas de delivery altas e contratos antigos.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Compra programada com tabela negociada, controle de validade e renegociação de taxas.',
        comoResolver: 'Auditoria de custo de prato, fornecedores e comissões de aplicativos.',
        tecnologiaNecessaria: 'Gestão de ficha técnica + negociação de adquirência e marketplaces.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar licenças ociosas, revisar comissões de delivery e renegociar taxas de cartão',
        responsavel: 'Financeiro / Dono',
        objetivo: 'Reduzir custos fixos sem impactar o serviço',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas de desconto, compra e troca de escala',
        responsavel: 'Dono / Gerente',
        objetivo: 'Liberar no mínimo 8 horas semanais do dono do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Decisões de turno mais rápidas e serviço menos dependente do dono.'
      },
      {
        acao: 'Automatizar resposta de reservas, cardápio e recuperação de clientes',
        responsavel: 'Salão / Atendimento',
        objetivo: 'Evitar reservas e dúvidas sem resposta e trazer clientes de volta',
        indicador: 'Reservas confirmadas e retorno de clientes',
        prazo: '25 dias',
        resultado: 'Mais mesas ocupadas nos dias fracos sem custo extra de mídia.'
      },
      {
        acao: 'Padronizar ficha técnica, compras programadas e conciliação diária',
        responsavel: 'Cozinha / Financeiro',
        objetivo: 'Reduzir desperdício de insumos e divergência de caixa',
        indicador: 'Custo de comida (%) e horas de fechamento',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês e menos comida jogada fora.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar licenças, comissões de delivery, taxas de cartão e contratos sem retorno.',
          'Definir matriz de alçadas de compra, desconto e escala eliminando a dependência do dono.',
          'Padronizar ficha técnica, fechamento de caixa e montagem de escala.'
        ]
      },
      fase2: {
        foco: 'Integrar PDV, estoque e atendimento',
        acoes: [
          'Conectar PDV, estoque da cozinha e delivery para eliminar digitação duplicada.',
          'Ativar compras programadas e conciliação diária automatizada.',
          'Implantar atendimento automático de reservas e recuperação de clientes.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, ocupação e escala',
        acoes: [
          'Criar painel com custo de prato, ocupação, giro e DRE em tempo real.',
          'Absorver crescimento de pedidos sem contratar pessoas na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar novas contratações pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho de estoque, escala e caixa mapeadas.',
      'Integrar PDV, estoque e delivery eliminando a digitação duplicada de pedidos e insumos.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de compra, desconto e escala que hoje travam na mesa do dono.'
    ]
  },

  ecommerce_marketplace: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas ao cadastro manual de produtos, atualização de estoque entre canais e conferência de pedidos — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo da equipe que poderia estar focado em marketing, conversão e curadoria de produtos. A loja on-line possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'A loja tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar a equipe, bastando automatizar estoque multicanal, follow-up e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (apps e licenças subutilizados, anúncios sem mensuração, serviços duplicados)',
      otimizaveis: 'Custos Otimizáveis (taxas de marketplace e cartão, devoluções, perdas e despesas renegociáveis)',
      contratacoes: 'Contratações Evitáveis (pessoas para cadastro, expedição administrativa e atendimento que a automação assume)',
      margem: 'Margem Recuperável (menos retrabalho, menos divergência de estoque e mais pedidos processados)',
      receita: 'Receita Destravável (recuperação de carrinhos, follow-up e anúncios com melhor retorno)'
    },
    top5: [
      {
        titulo: 'Retrabalho entre Canais, Estoque e Pedidos',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas atualizando estoque e preço entre loja e marketplaces, conferindo pedidos e digitando dados de expedição.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Estoque e preço sincronizados automaticamente em todos os canais.',
        comoResolver: 'Integrar marketplace, loja virtual e sistema de gestão com estoque único.',
        tecnologiaNecessaria: 'Integração multicanal + gestão de estoque unificada.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações de Suporte e Expedição Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para dar conta de pedidos e atendimento antes de automatizar expedição e dúvidas.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Automatizar status de pedido, rastreio e respostas frequentes antes de contratar.',
        comoResolver: 'Notificações automáticas de status e FAQ automatizado no WhatsApp.',
        tecnologiaNecessaria: 'Automação de pedidos + assistente de atendimento.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Dono Preso na Operação da Loja On-line',
        oQueEstaAcontecendo: 'O dono gasta {horasDonoSemana}h semanais ({horasDono}h/mês) resolvendo cadastro, pedidos, reembolsos e urgências do dia a dia.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para trocas, reembolsos e anúncios serem decididos sem o dono.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com painel de vendas.',
        tecnologiaNecessaria: 'Central de aprovações + painel de vendas e anúncios em tempo real.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Carrinhos e Orçamentos Abandonados no Funil',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana da equipe gastas com tarefas administrativas em vez de otimizar anúncios e recuperar vendas perdidas.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em pedidos adicionais destraváveis',
        oQueDeveMudar: 'Recuperação automática de carrinhos abandonados e follow-up de orçamentos.',
        comoResolver: 'Fluxo de recuperação por WhatsApp/e-mail e reativação de clientes antigos.',
        tecnologiaNecessaria: 'Automação de e-commerce + CRM com recuperação de carrinho.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Taxas, Apps e Despesas sem Revisão',
        oQueEstaAcontecendo: 'Apps da loja pouco usados, comissões altas, anúncios sem retorno e contratos antigos.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Corte de apps ociosos, revisão de comissões e renegociação de fornecedores.',
        comoResolver: 'Auditoria de custos por canal e consolidação de ferramentas.',
        tecnologiaNecessaria: 'Auditoria de apps/SaaS e negociação de taxas.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar apps e licenças subutilizados e renegociar comissões/taxas de canal',
        responsavel: 'Financeiro / Dono',
        objetivo: 'Reduzir custos fixos sem impactar as vendas',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas para trocas, reembolsos e mudanças de preço',
        responsavel: 'Dono / Gestor',
        objetivo: 'Liberar no mínimo 8 horas semanais do dono do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Decisões mais rápidas e atendimento mais ágil ao cliente.'
      },
      {
        acao: 'Ativar recuperação automática de carrinhos e follow-up de clientes',
        responsavel: 'Marketing / Vendas',
        objetivo: 'Receber pedidos de clientes que já demonstraram interesse',
        indicador: 'Taxa de recuperação de carrinhos',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% nas vendas sem investir mais em anúncios.'
      },
      {
        acao: 'Sincronizar estoque e preço entre loja e marketplaces',
        responsavel: 'Operação / Estoque',
        objetivo: 'Acabar com venda sem estoque e divergência de preço',
        indicador: 'Pedidos cancelados por ruptura',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês e menos cancelamentos e reputação negativa.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar apps, licenças, anúncios e contratos sem retorno.',
          'Definir matriz de alçadas de troca, reembolso e preço eliminando a dependência do dono.',
          'Padronizar os 3 processos mais críticos: cadastro, expedição e atendimento.'
        ]
      },
      fase2: {
        foco: 'Integrar canais, estoque e automações',
        acoes: [
          'Conectar loja, marketplaces e gestão para estoque e preço unificados.',
          'Ativar recuperação de carrinhos e esteira de follow-up automático.',
          'Implantar conciliação de recebimentos e cobrança automatizadas.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, margem e escala',
        acoes: [
          'Criar painel com conversão, ticket, custo de anúncio (ROAS) e DRE em tempo real.',
          'Absorver crescimento de pedidos sem contratar na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações de suporte e expedição pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho mapeadas.',
      'Integrar loja, marketplaces e gestão eliminando a digitação duplicada de estoque, preço e pedidos.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de troca, reembolso e preço que hoje travam na mesa do dono.'
    ]
  },

  software_saas: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas ao onboarding manual, suporte repetitivo e atualização de planilhas de clientes — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo do time que poderia estar focado em produto, qualidade e vendas. A software house possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'A empresa tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar o time, bastando automatizar onboarding, suporte e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças de ferramentas de dev ociosas, infraestrutura superdimensionada, marketing sem mensuração)',
      otimizaveis: 'Custos Otimizáveis (cloud subutilizada, APIs pouco usadas e despesas gerais renegociáveis)',
      contratacoes: 'Contratações Evitáveis (suporte e operação para tarefas que automação e IA assumem)',
      margem: 'Margem Recuperável (menos retrabalho, menos churn por atrito e mais capacidade de entrega)',
      receita: 'Receita Destravável (onboarding mais rápido, follow-up de trials e upsell automatizado)'
    },
    top5: [
      {
        titulo: 'Retrabalho no Onboarding e no Suporte Repetitivo',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas configurando contas manualmente, respondendo as mesmas dúvidas e atualizando planilhas de clientes.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Onboarding automatizado e base de conhecimento/IA para as dúvidas recorrentes.',
        comoResolver: 'Fluxo de ativação automática + assistente de suporte treinado no produto.',
        tecnologiaNecessaria: 'Onboarding guidado + IA no suporte (chatbot contextual).',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações de Suporte e Operação Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para suporte e operação antes de automatizar ativação e dúvidas frequentes.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Reduzir o volume de tickets antes de escalar o time de suporte.',
        comoResolver: 'IA para primeira resposta, automações de onboarding e documentação viva.',
        tecnologiaNecessaria: 'Helpdesk com IA + automações de produto (n8n/Make).',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Fundador/Líder Preso no Operacional',
        oQueEstaAcontecendo: 'A liderança gasta {horasDonoSemana}h semanais ({horasDono}h/mês) apagando incêndios de suporte, deploy e demandas urgentes do time.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para suporte, infraestrutura e prioridades de produto sem passar pelo fundador.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com métricas de produto.',
        tecnologiaNecessaria: 'Central de aprovações + painel de produto (MRR, churn, tickets).',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Trials e Propostas Perdidos no Funil',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana da equipe comercial gastas com tarefas administrativas em vez de conduzir demos e fechar assinaturas.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em assinaturas adicionais destraváveis',
        oQueDeveMudar: 'Follow-up automático de trials e propostas com gatilhos por comportamento de uso.',
        comoResolver: 'Esteira de nutição por e-mail/WhatsApp e recuperação de trials parados.',
        tecnologiaNecessaria: 'CRM + automação de lifecycle (ativação, trial, expansão).',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Infraestrutura e Ferramentas Ociosas',
        oQueEstaAcontecendo: 'Servidores superdimensionados, licenças de ferramentas de dev sem uso e serviços duplicados.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Otimização de cloud, corte de licenças e consolidação de ferramentas.',
        comoResolver: 'Auditoria de infraestrutura e stack de desenvolvimento.',
        tecnologiaNecessaria: 'FinOps de cloud + auditoria de SaaS.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Otimizar cloud e cortar licenças de ferramentas de dev sem uso',
        responsavel: 'TI / Financeiro',
        objetivo: 'Reduzir custo de infraestrutura e ferramentas sem impactar o produto',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas para suporte, deploy e prioridades do produto',
        responsavel: 'Fundador / Liderança',
        objetivo: 'Liberar no mínimo 8 horas semanais do fundador do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Decisões mais rápidas e time menos engarrafado no fundador.'
      },
      {
        acao: 'Automatizar onboarding e follow-up de trials/propostas',
        responsavel: 'Customer Success / Comercial',
        objetivo: 'Evitar trials parados e ativação manual de clientes',
        indicador: 'Taxa de ativação e conversão de trials',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% na conversão de trials para assinatura paga.'
      },
      {
        acao: 'Criar base de conhecimento e IA para as dúvidas de suporte repetitivas',
        responsavel: 'Suporte / Produto',
        objetivo: 'Reduzir o volume de tickets recorrentes',
        indicador: 'Tickets por cliente e tempo de resposta',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês do time com respostas automáticas de primeira linha.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar cloud, licenças de ferramentas e contratos sem retorno.',
          'Definir matriz de alçadas para suporte, deploy e prioridades.',
          'Mapear e padronizar os 3 processos mais críticos: onboarding, suporte e release.'
        ]
      },
      fase2: {
        foco: 'Automatizar onboarding, suporte e funil',
        acoes: [
          'Conectar produto, CRM e suporte para eliminar digitação duplicada.',
          'Ativar onboarding automatizado e assistente de IA no suporte.',
          'Implantar esteira de follow-up de trials e cobrança/recuperação de cartões (dunning).'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, retenção e escala',
        acoes: [
          'Criar painel com MRR, churn, ativação, tickets e DRE em tempo real.',
          'Absorver crescimento de contas sem contratar na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações de suporte e operação pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho mapeadas.',
      'Integrar produto, CRM e suporte eliminando a digitação manual de dados entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de suporte, infraestrutura e prioridade que hoje travam na mesa do fundador.'
    ]
  },

  academia_personal: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas à cobrança manual de mensalidades, controle de presença e montagem de escalas de aulas — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo da equipe de instrutores e recepção que poderia estar focado em alunos e vendas. A academia possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'A academia tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar a equipe, bastando automatizar matrículas, cobrança e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças de apps ociosos, anúncios sem mensuração, serviços duplicados)',
      otimizaveis: 'Custos Otimizáveis (inadimplência, taxas de cartão e despesas gerais renegociáveis)',
      contratacoes: 'Contratações Evitáveis (recepção/administrativo para tarefas que a automação assume)',
      margem: 'Margem Recuperável (menos inadimplência, menos retrabalho e mais alunos ativos)',
      receita: 'Receita Destravável (matrículas e renovações com follow-up automatizado)'
    },
    top5: [
      {
        titulo: 'Retrabalho na Gestão de Alunos, Escala e Cobrança',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas cobrando mensalidades manualmente, controlando presença em planilha e montando escala de aulas.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Cobrança automática, presença digital e escala de aulas gerada pelo sistema.',
        comoResolver: 'Integrar sistema de gestão da academia com cobrança e app dos alunos.',
        tecnologiaNecessaria: 'Gestão de academia com débito automático + app de presença.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações de Recepção Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para recepção e cobrança antes de automatizar matrículas e débito.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a capacidade da recepção atual antes de abrir vagas.',
        comoResolver: 'Matrícula on-line, débito automático e renovação por fluxo automático.',
        tecnologiaNecessaria: 'Automação de matrícula e cobrança recorrente.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Dono Preso na Operação da Academia',
        oQueEstaAcontecendo: 'O dono gasta {horasDonoSemana}h semanais ({horasDono}h/mês) na recepção, resolvendo escala, inadimplência e problemas do dia a dia.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para recepção decidir descontos, encaixes de aula e escala.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com painel de ocupação.',
        tecnologiaNecessaria: 'Central de aprovações + painel de alunos e ocupação de turmas.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Matrículas e Renovações Perdidas no Follow-up',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana da equipe gastas com burocracia em vez de converter interessados e reter alunos prestes a cancelar.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em matrículas e renovações destraváveis',
        oQueDeveMudar: 'Follow-up automático de interessados e alerta de risco de evasão.',
        comoResolver: 'Esteira de captação no WhatsApp e recuperação de alunos sem retorno.',
        tecnologiaNecessaria: 'CRM da academia + disparos automáticos de matrícula e retenção.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Apps, Licenças e Despesas sem Revisão',
        oQueEstaAcontecendo: 'Licenças de aplicativos, planos de treino pouco usados e contratos antigos sem renegociação.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Corte de ferramentas duplicadas e renegociação de contratos.',
        comoResolver: 'Auditoria de apps e despesas gerais da unidade.',
        tecnologiaNecessaria: 'Auditoria de SaaS e negociação de fornecedores.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar apps e licenças sem uso e renegociar taxas de cartão',
        responsavel: 'Financeiro / Dono',
        objetivo: 'Reduzir custos fixos sem impactar os alunos',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas de desconto, encaixe e escala de aulas',
        responsavel: 'Dono / Gerente',
        objetivo: 'Liberar no mínimo 8 horas semanais do dono do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Decisões mais rápidas e recepção autônoma no dia a dia.'
      },
      {
        acao: 'Automatizar follow-up de interessados e renovação de alunos',
        responsavel: 'Recepção / Vendas',
        objetivo: 'Evitar interessados sem retorno e alunos prestes a cancelar',
        indicador: 'Taxa de conversão de matrículas e evasão',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% nas matrículas sem investir mais em mídia.'
      },
      {
        acao: 'Ativar débito automático e régua de cobrança de mensalidades',
        responsavel: 'Financeiro',
        objetivo: 'Reduzir inadimplência e cobrança manual pelo WhatsApp',
        indicador: '% de inadimplência',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês de cobrança manual e caixa mais previsível.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar apps, licenças, taxas de cartão e contratos sem retorno.',
          'Definir matriz de alçadas de desconto, encaixe e escala.',
          'Padronizar matrícula, cobrança e atendimento de interessados.'
        ]
      },
      fase2: {
        foco: 'Automatizar matrícula, cobrança e relacionamento',
        acoes: [
          'Conectar gestão, cobrança e WhatsApp para eliminar digitação duplicada.',
          'Ativar matrícula on-line e débito automático com régua de cobrança.',
          'Implantar esteira de follow-up de interessados e retenção de alunos.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, ocupação e escala',
        acoes: [
          'Criar painel com ocupação de turmas, evasão, inadimplência e DRE em tempo real.',
          'Absorver crescimento de alunos sem contratar na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações de recepção pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho de cobrança e controle mapeadas.',
      'Integrar sistema de gestão, cobrança e WhatsApp eliminando a digitação duplicada de alunos e pagamentos.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de desconto, encaixe e escala que hoje travam na mesa do dono.'
    ]
  },

  imobiliaria: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas ao cadastro manual de imóveis, montagem de contratos e controle de vistorias — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo do corretor e da equipe que poderia estar focado em mostrar imóveis e fechar negócios. A imobiliária possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'A imobiliária tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar a equipe, bastando automatizar cadastro, follow-up e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças de portais e sistemas ociosos, anúncios sem mensuração, serviços duplicados)',
      otimizaveis: 'Custos Otimizáveis (imóveis parados, comissões não recebidas e despesas renegociáveis)',
      contratacoes: 'Contratações Evitáveis (administrativo para cadastro e contratos que a automação assume)',
      margem: 'Margem Recuperável (menos retrabalho de vistoria/contrato e mais negócios fechados)',
      receita: 'Receita Destravável (corretores liberados e follow-up automatizado de leads e locatários)'
    },
    top5: [
      {
        titulo: 'Retrabalho em Cadastro, Vistoria e Contratos',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas cadastrando imóveis em portais, montando contratos manualmente e controlando vistorias em planilha.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Cadastro único que publica em todos os portais e contratos gerados a partir de modelo.',
        comoResolver: 'Integrar CRM imobiliário, portais e assinatura digital de contratos.',
        tecnologiaNecessaria: 'CRM imobiliário integrado + assinatura digital.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações Administrativas Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para cadastro, contratos e vistorias antes de automatizar essas rotinas.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a capacidade da equipe atual antes de abrir novas vagas.',
        comoResolver: 'Automação de publicação, contratos e agendamento de vistorias.',
        tecnologiaNecessaria: 'Fluxos automáticos de publicação e agendamento.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Sócio/Corretor Preso na Burocracia',
        oQueEstaAcontecendo: 'A liderança gasta {horasDonoSemana}h semanais ({horasDono}h/mês) resolvendo contratos, vistorias, cobranças e conflitos de locação.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para a equipe administrativa decidir vistorias, contratos padrão e cobranças.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com painel de funil.',
        tecnologiaNecessaria: 'Central de aprovações + painel de imóveis e negócios.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Leads e Locatários Perdidos no Follow-up',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana da equipe gastas com burocracia em vez de atender interessados e renovar contratos.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em comissões destraváveis',
        oQueDeveMudar: 'Follow-up automático de leads e alertas de renovação de contratos.',
        comoResolver: 'Esteira de retorno de interessados e recuperação de leads frios.',
        tecnologiaNecessaria: 'CRM imobiliário + disparos automáticos por etapa do funil.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Portais, Sistemas e Despesas sem Revisão',
        oQueEstaAcontecendo: 'Licenças de portais, sistemas e softwares pouco usados e contratos antigos.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Corte de planos de anúncio ociosos e renegociação de contratos.',
        comoResolver: 'Auditoria de custos de divulgação e ferramentas.',
        tecnologiaNecessaria: 'Auditoria de SaaS e negociação de portais.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar planos de portal e licenças sem uso e renegociar contratos',
        responsavel: 'Financeiro / Dono',
        objetivo: 'Reduzir custos fixos sem perder divulgação',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas para contratos padrão, vistorias e descontos de comissão',
        responsavel: 'Sócio / Gestor',
        objetivo: 'Liberar no mínimo 8 horas semanais da liderança do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Contratos e vistorias mais ágeis sem engarrafamento.'
      },
      {
        acao: 'Automatizar follow-up de leads e renovações de contrato',
        responsavel: 'Comercial / Atendimento',
        objetivo: 'Evitar leads sem resposta e renovações perdidas',
        indicador: 'Taxa de conversão de leads e renovações',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% nos negócios fechados sem mais mídia.'
      },
      {
        acao: 'Unificar cadastro de imóveis com publicação automática nos portais',
        responsavel: 'Operação',
        objetivo: 'Eliminar redigitação do mesmo imóvel em cada canal',
        indicador: 'Horas semanais de cadastro',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês e imóveis no ar muito mais rápido.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar portais, licenças e contratos sem retorno.',
          'Definir matriz de alçadas para contratos padrão, vistorias e descontos.',
          'Padronizar os 3 processos mais críticos: cadastro, vistoria e contrato.'
        ]
      },
      fase2: {
        foco: 'Integrar CRM, portais e contratos',
        acoes: [
          'Conectar CRM, portais e assinatura digital para eliminar digitação duplicada.',
          'Ativar follow-up automático de leads por etapa do funil.',
          'Implantar cobrança e conciliação de aluguéis automatizadas.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, funil e escala',
        acoes: [
          'Criar painel com funil de leads, ocupação da carteira, comissões e DRE em tempo real.',
          'Absorver crescimento de negócios sem contratar na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações administrativas pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho de cadastro e contratos mapeadas.',
      'Integrar CRM, portais e assinatura digital eliminando a digitação manual entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de vistoria, contrato e cobrança que hoje travam na mesa do sócio.'
    ]
  },

  corretora_seguros: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas à emissão manual de propostas, cobrança de documentos e controle de renovações — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo do corretor e da equipe que poderia estar focado em prospectar clientes e parcerias. A corretora possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'A corretora tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar a equipe, bastando automatizar propostas, renovações e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças e portais de cotação ociosos, marketing sem mensuração, serviços duplicados)',
      otimizaveis: 'Custos Otimizáveis (apólices mal dimensionadas, comissões perdidas e despesas renegociáveis)',
      contratacoes: 'Contratações Evitáveis (administrativo para emissão e cobrança que a automação assume)',
      margem: 'Margem Recuperável (menos retrabalho de proposta e menos renovações atrasadas)',
      receita: 'Receita Destravável (novas apólices com corretores liberados e follow-up automatizado)'
    },
    top5: [
      {
        titulo: 'Retrabalho em Propostas, Emissão e Renovações',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas montando propostas manualmente, cobrando documentos e acompanhando renovações em planilha.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Cotações e emissão automatizadas com alerta de renovação antecipado.',
        comoResolver: 'Integrar portal de cotação, sistema da corretora e alertas automáticos.',
        tecnologiaNecessaria: 'Sistema de corretora + automações de renovação e follow-up.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações Administrativas Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para emissão, cobrança e atendimento antes de automatizar essas rotinas.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a capacidade da equipe atual antes de abrir vagas.',
        comoResolver: 'Automação de proposta, régua de cobrança e alertas de renovação.',
        tecnologiaNecessaria: 'Fluxos automáticos de emissão e cobrança.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Dono Preso na Burocracia da Corretora',
        oQueEstaAcontecendo: 'O dono gasta {horasDonoSemana}h semanais ({horasDono}h/mês) resolvendo siniistros, renovações, cobranças e urgências dos clientes.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para a equipe decidir propostas padrão, cobranças e atendimentos.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com painel de carteira.',
        tecnologiaNecessaria: 'Central de aprovações + painel de carteira e comissões.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Cotações e Propostas Paradas no Funil',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana da equipe gastas com burocracia em vez de prospectar clientes e parcerias.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em apólices destraváveis',
        oQueDeveMudar: 'Follow-up automático de cotações enviadas e recuperação de propostas sem resposta.',
        comoResolver: 'Esteira de follow-up por WhatsApp e reativação de contatos frios.',
        tecnologiaNecessaria: 'CRM de seguros + disparos automáticos.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Licenças e Despesas sem Revisão',
        oQueEstaAcontecendo: 'Portais de cotação, licenças de sistemas e despesas gerais sem renegociação.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Corte de ferramentas ociosas e renegociação de contratos.',
        comoResolver: 'Auditoria de custos e consolidação de ferramentas.',
        tecnologiaNecessaria: 'Auditoria de SaaS e negociação de fornecedores.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar portais e licenças sem uso e renegociar contratos de serviços',
        responsavel: 'Financeiro / Dono',
        objetivo: 'Reduzir custos fixos sem impactar a carteira',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas para propostas padrão, cobranças e descontos',
        responsavel: 'Dono / Gestor',
        objetivo: 'Liberar no mínimo 8 horas semanais da liderança do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Emissão e cobrança mais rápidas sem depender do dono.'
      },
      {
        acao: 'Automatizar follow-up de cotações e alertas de renovação',
        responsavel: 'Comercial',
        objetivo: 'Evitar cotações paradas e renovações perdidas',
        indicador: 'Taxa de conversão de cotações e retenção',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% na emissão de apólices sem mais prospecção.'
      },
      {
        acao: 'Ativar régua de cobrança e conciliação de comissões automatizadas',
        responsavel: 'Financeiro',
        objetivo: 'Acabar com cobrança manual e divergência de comissões',
        indicador: 'Horas semanais do financeiro',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês e comissionamento sem divergências.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar portais, licenças e contratos sem retorno.',
          'Definir matriz de alçadas para propostas, cobranças e descontos.',
          'Padronizar os 3 processos mais críticos: cotação, emissão e renovação.'
        ]
      },
      fase2: {
        foco: 'Integrar cotação, carteira e cobrança',
        acoes: [
          'Conectar portal de cotação, sistema da corretora e banco para eliminar digitação duplicada.',
          'Ativar alertas de renovação e follow-up automático de cotações.',
          'Implantar régua de cobrança e conciliação automatizadas.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, carteira e escala',
        acoes: [
          'Criar painel com carteira ativa, retenção, conversão de cotações e DRE em tempo real.',
          'Absorver crescimento de apólices sem contratar na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações administrativas pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho de propostas e renovações mapeadas.',
      'Integrar cotação, carteira e financeiro eliminando a digitação manual entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de proposta, cobrança e atendimento que hoje travam na mesa do dono.'
    ]
  },

  escola_curso: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas à rematrícula manual, controle de presença em planilha e cobrança de mensalidades — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo do corpo docente e da secretaria que poderia estar focado em alunos e qualidade do ensino. A escola possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'A escola tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar o corpo docente, bastando automatizar matrículas, cobrança e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças de plataformas ociosas, marketing sem mensuração, serviços duplicados)',
      otimizaveis: 'Custos Otimizáveis (inadimplência, materiais parados e despesas gerais renegociáveis)',
      contratacoes: 'Contratações Evitáveis (secretaria para tarefas que a automação assume)',
      margem: 'Margem Recuperável (menos retrabalho administrativo e mais alunos atendidos)',
      receita: 'Receita Destravável (matrículas e rematrículas com follow-up automatizado)'
    },
    top5: [
      {
        titulo: 'Retrabalho em Matrícula, Presença e Cobrança',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas processando rematrículas, controlando presença em planilha e cobrando mensalidades manualmente.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Matrícula on-line, presença digital e cobrança automática de mensalidades.',
        comoResolver: 'Integrar sistema acadêmico, cobrança e app dos alunos.',
        tecnologiaNecessaria: 'Sistema acadêmico + débito automático e presença digital.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações de Secretaria Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para secretaria antes de automatizar matrícula e cobrança.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a capacidade da secretaria atual antes de abrir vagas.',
        comoResolver: 'Fluxo de matrícula on-line e régua de cobrança automática.',
        tecnologiaNecessaria: 'Automação de matrícula e cobrança recorrente.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Direção Presa no Operacional da Escola',
        oQueEstaAcontecendo: 'A direção gasta {horasDonoSemana}h semanais ({horasDono}h/mês) resolvendo secretaria, cobrança, conflitos e rotinas do dia a dia.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para a secretaria decidir descontos, encaixes e pendências.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com painel da escola.',
        tecnologiaNecessaria: 'Central de aprovações + painel de matrículas e inadimplência.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Interessados e Rematrículas Perdidos no Follow-up',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana da equipe gastas com burocracia em vez de converter interessados e segurar alunos em risco de evasão.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em matrículas destraváveis',
        oQueDeveMudar: 'Follow-up automático de interessados e alerta de evasão.',
        comoResolver: 'Esteira de captação por WhatsApp e reativação de alunos sem retorno.',
        tecnologiaNecessaria: 'CRM educacional + disparos automáticos.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Plataformas e Despesas sem Revisão',
        oQueEstaAcontecendo: 'Licenças de plataformas, materiais pouco usados e contratos antigos sem renegociação.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Corte de licenças ociosas e renegociação de contratos.',
        comoResolver: 'Auditoria de plataformas e despesas gerais.',
        tecnologiaNecessaria: 'Auditoria de SaaS e negociação de fornecedores.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar licenças de plataformas sem uso e renegociar contratos',
        responsavel: 'Financeiro / Direção',
        objetivo: 'Reduzir custos fixos sem impactar as aulas',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas de desconto, encaixe e pendências de secretaria',
        responsavel: 'Direção',
        objetivo: 'Liberar no mínimo 8 horas semanais da direção do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Secretaria autônoma e decisões mais rápidas.'
      },
      {
        acao: 'Automatizar follow-up de interessados e lembrete de rematrícula',
        responsavel: 'Secretaria / Comercial',
        objetivo: 'Evitar interessados sem resposta e rematrículas esquecidas',
        indicador: 'Taxa de conversão e rematrícula',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% nas matrículas sem mais investimento.'
      },
      {
        acao: 'Ativar cobrança automática de mensalidades e presença digital',
        responsavel: 'Financeiro / Secretaria',
        objetivo: 'Reduzir inadimplência e controle manual de presença',
        indicador: '% de inadimplência e horas de secretaria',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês e caixa mais previsível.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar plataformas, licenças e contratos sem retorno.',
          'Definir matriz de alçadas de desconto, encaixe e pendências.',
          'Padronizar matrícula, presença e cobrança.'
        ]
      },
      fase2: {
        foco: 'Integrar sistema acadêmico, cobrança e relacionamento',
        acoes: [
          'Conectar sistema acadêmico, banco e WhatsApp para eliminar digitação duplicada.',
          'Ativar matrícula on-line e régua de cobrança automatizada.',
          'Implantar esteira de follow-up de interessados e evasão.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, retenção e escala',
        acoes: [
          'Criar painel com matrículas, evasão, inadimplência e DRE em tempo real.',
          'Absorver crescimento de alunos sem contratar na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações de secretaria pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho mapeadas.',
      'Integrar sistema acadêmico, cobrança e WhatsApp eliminando a digitação manual entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de desconto, encaixe e pendências que hoje travam na mesa da direção.'
    ]
  },

  construcao_civil: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas à montagem manual de orçamentos, controle de obras em planilha e conferência de medições — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo da equipe e da liderança que poderia estar focado em novas obras e melhoria de processos. A construtora possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'A construtora tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar a equipe, bastando automatizar orçamentos, medições e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças e ferramentas ociosas, equipamentos parados, marketing sem mensuração)',
      otimizaveis: 'Custos Otimizáveis (compras emergenciais, perda de material e despesas renegociáveis)',
      contratacoes: 'Contratações Evitáveis (administrativo de obra para tarefas que a automação assume)',
      margem: 'Margem Recuperável (menos atraso, menos retrabalho e obras mais bem dimensionadas)',
      receita: 'Receita Destravável (orçamentos respondidos mais rápido e follow-up de clientes)'
    },
    top5: [
      {
        titulo: 'Retrabalho em Orçamentos, Medições e Controle de Obra',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas montando orçamentos, controlando avanço de obra em planilha e conferindo medições manualmente.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Orçamentos gerados a partir de tabela e medições com registro fotográfico digital.',
        comoResolver: 'Integrar gestão de obras com comercial e financeiro.',
        tecnologiaNecessaria: 'Software de gestão de obras + assinatura digital de contratos.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações Administrativas Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para escritório de obra antes de automatizar orçamentos e medições.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a capacidade da equipe atual antes de abrir vagas.',
        comoResolver: 'Automação de orçamento, compra programada e medição digital.',
        tecnologiaNecessaria: 'Fluxos automáticos de aprovação e compra por obra.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Dono/Engenheiro Preso no Canteiro',
        oQueEstaAcontecendo: 'A liderança gasta {horasDonoSemana}h semanais ({horasDono}h/mês) no canteiro resolvendo urgências, compras e conflitos de equipe.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para mestre de obra e administrativo decidirem compras e rotinas.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com painel por obra.',
        tecnologiaNecessaria: 'Central de aprovações + painel de avanço e custo por obra.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Orçamentos e Follow-up Parados no Funil',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana da equipe gastas com burocracia em vez de prospectar clientes e fechar obras.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em obras adicionais destraváveis',
        oQueDeveMudar: 'Follow-up automático de orçamentos enviados e recuperação de contatos frios.',
        comoResolver: 'Esteira de retorno de orçamentos por WhatsApp e e-mail.',
        tecnologiaNecessaria: 'CRM de obras + disparos automáticos.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Compras Emergenciais e Despesas sem Revisão',
        oQueEstaAcontecendo: 'Material comprado na correria acima do preço, equipamentos parados e contratos sem renegociação.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Compra programada com tabela negociada e revisão de contratos.',
        comoResolver: 'Auditoria de compras por obra e negociação com fornecedores.',
        tecnologiaNecessaria: 'Gestão de compras centralizada + cotações comparativas.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar ferramentas e licenças ociosas e renegociar contratos de fornecedores',
        responsavel: 'Financeiro / Compras',
        objetivo: 'Reduzir custos fixos sem impactar as obras',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas de compra e aprovação por obra',
        responsavel: 'Dono / Engenheiro Responsável',
        objetivo: 'Liberar no mínimo 8 horas semanais da liderança do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Compras e aprovações mais rápidas sem engarrafamento no canteiro.'
      },
      {
        acao: 'Automatizar follow-up de orçamentos e propostas de obra',
        responsavel: 'Comercial',
        objetivo: 'Evitar orçamentos parados mais de 48 horas',
        indicador: 'Taxa de conversão de orçamentos',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% nas obras fechadas sem mais prospecção.'
      },
      {
        acao: 'Padronizar orçamento, compra programada e medição digital',
        responsavel: 'Escritório de Obras',
        objetivo: 'Eliminar redigitação entre comercial, obra e financeiro',
        indicador: 'Horas semanais de retrabalho',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês e menos erro de orçamento e medição.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar ferramentas, licenças e contratos sem retorno.',
          'Definir matriz de alçadas de compra e aprovação por obra.',
          'Padronizar orçamento, compra e medição.'
        ]
      },
      fase2: {
        foco: 'Integrar comercial, obra e financeiro',
        acoes: [
          'Conectar gestão de obras, comercial e financeiro para eliminar digitação duplicada.',
          'Ativar orçamentos automáticos e esteira de follow-up.',
          'Implantar compra programada e conciliação automatizadas.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, margem e escala',
        acoes: [
          'Criar painel com avanço de obra, custo por obra, margem e DRE em tempo real.',
          'Absorver mais obras sem contratar na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações administrativas pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho de orçamentos e medições mapeadas.',
      'Integrar comercial, obra e financeiro eliminando a digitação manual entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de compra e aprovação que hoje travam na mesa do dono.'
    ]
  },
  agronegocio: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas ao controle manual de insumos, ordenha e custos por talhão em planilha — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo do produtor e da equipe que poderia estar focado no campo e na decisão de custo. A propriedade possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'A operação tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar a equipe, bastando automatizar estoque de insumos, medição de produtividade e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças e equipamentos ociosos, insumos mal dimensionados, serviços duplicados)',
      otimizaveis: 'Custos Otimizáveis (perda de produto, compras emergenciais e despesas renegociáveis)',
      contratacoes: 'Contratações Evitáveis (administrativo rural para tarefas que a automação assume)',
      margem: 'Margem Recuperável (menos perda, menos retrabalho e decisão de custo mais precisa)',
      receita: 'Receita Destravável (mais área produtiva gerida com a mesma estrutura)'
    },
    top5: [
      {
        titulo: 'Retrabalho em Controle de Insumos e Custos',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas lançando insumos, ordenha e custos por talhão em planilha, sem visão consolidada.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Lançamento único de compra e consumo com custo calculado por talhão automaticamente.',
        comoResolver: 'Integrar caderno de campo digital com estoque e financeiro.',
        tecnologiaNecessaria: 'Gestão agropecuária integrada (ERP rural) + app de campo offline.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações Administrativas Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para escritório rural antes de automatizar insumos e custos.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a capacidade da equipe atual antes de abrir vagas.',
        comoResolver: 'Automação de conferência de nota, estoque e conciliação.',
        tecnologiaNecessaria: 'Fluxos automáticos de entrada de nota e alerta de estoque.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Produtor Preso na Rotina Administrativa',
        oQueEstaAcontecendo: 'O produtor gasta {horasDonoSemana}h semanais ({horasDono}h/mês) resolvendo compras, conflitos, entregas e pendências.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para o responsável de campo e administrativo decidirem compras e rotinas.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com painel da fazenda.',
        tecnologiaNecessaria: 'Central de aprovações + painel de custo e produtividade por talhão.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Decisão de Venda e Compra Sem Dados',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana da equipe gastas com burocracia em vez de negociar preço e escoamento.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em margem destravável',
        oQueDeveMudar: 'Custo real por talhão na mesa antes de vender ou comprar insumo.',
        comoResolver: 'Conciliação de cotação de insumo e venda automatizadas.',
        tecnologiaNecessaria: 'Integração com cotações de mercado + painel de margem.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Insumos, Equipamentos e Contratos sem Revisão',
        oQueEstaAcontecendo: 'Manutenção de máquina parada, licenças sem uso e contratos antigos sem renegociação.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Manutenção preventiva programada e renegociação de contratos.',
        comoResolver: 'Auditoria de insumos, equipamentos e fornecedores.',
        tecnologiaNecessaria: 'Gestão de manutenção + cotações comparativas.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar licenças e insumos ociosos e renegociar contratos de fornecedores',
        responsavel: 'Financeiro / Produtor',
        objetivo: 'Reduzir custos fixos sem impactar a safra',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas de compra e aprovação por unidade produtiva',
        responsavel: 'Produtor / Gerente',
        objetivo: 'Liberar no mínimo 8 horas semanais da liderança do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Compras e rotinas mais rápidas sem travar no produtor.'
      },
      {
        acao: 'Automatizar alerta de estoque mínimo e follow-up de cotações',
        responsavel: 'Compras / Comercial',
        objetivo: 'Evitar compra emergencial e venda abaixo do mercado',
        indicador: 'Horas semanais em cotação',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% na margem negociada.'
      },
      {
        acao: 'Padronizar caderno de campo digital com custo por talhão',
        responsavel: 'Campo / Administração',
        objetivo: 'Eliminar redigitação entre campo e escritório',
        indicador: 'Horas semanais de retrabalho',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês e decisão de custo em tempo real.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar insumos, licenças e contratos sem retorno.',
          'Definir matriz de alçadas de compra e aprovação.',
          'Padronizar caderno de campo e conferência de nota.'
        ]
      },
      fase2: {
        foco: 'Integrar campo, estoque e financeiro',
        acoes: [
          'Conectar caderno de campo, estoque e financeiro para eliminar digitação duplicada.',
          'Ativar alerta de estoque e esteira de cotação automática.',
          'Implantar conciliação de compra e venda automatizadas.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, custo e escala',
        acoes: [
          'Criar painel com custo por talhão, produtividade, estoque e DRE em tempo real.',
          'Absorver crescimento de área e rebanho sem contratar na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações administrativas pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho mapeadas.',
      'Integrar campo, estoque e financeiro eliminando a digitação manual entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de compra e rotina que hoje travam na mesa do produtor.'
    ]
  },

  automotivo_oficina: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas ao orçamento manual de serviços, controle de peças em planilha e abertura de OS por papel — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo do mecânico e da equipe que poderia estar focado no atendimento e na execução do serviço. A oficina possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'A oficina tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar a equipe, bastando automatizar orçamento, peças e follow-up de clientes.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças de sistemas ociosos, marketing sem mensuração, serviços duplicados)',
      otimizaveis: 'Custos Otimizáveis (peça errada, peça parada no estoque e despesas renegociáveis)',
      contratacoes: 'Contratações Evitáveis (administrativo de oficina para tarefas que a automação assume)',
      margem: 'Margem Recuperável (menos retrabalho, menos peça errada e mais serviços fechados)',
      receita: 'Receita Destravável (mais veículos atendidos e revisões agendadas)'
    },
    top5: [
      {
        titulo: 'Retrabalho em Orçamento, Peças e Ordens de Serviço',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas montando orçamento no papel, conferindo peça em planilha e reabrindo OS por retrabalho.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Orçamento aprovado digitalmente e estoque de peças sincronizado com a OS.',
        comoResolver: 'Integrar sistema de oficina com estoque e financeiro.',
        tecnologiaNecessaria: 'Software de gestão de oficina + assinatura digital de orçamento.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações Administrativas Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para recepção e peças antes de automatizar OS e estoque.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a capacidade da equipe atual antes de abrir vagas.',
        comoResolver: 'Fluxo de OS digital e alerta de estoque mínimo.',
        tecnologiaNecessaria: 'Automação de OS, estoque e cobrança.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Dono Preso na Burocracia da Oficina',
        oQueEstaAcontecendo: 'O dono gasta {horasDonoSemana}h semanais ({horasDono}h/mês) resolvendo orçamentos, cobranças, reclamações e urgências.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para recepção e mecânico responsável decidirem orçamentos padrão.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com painel da oficina.',
        tecnologiaNecessaria: 'Central de aprovações + painel de OS e faturamento.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Orçamentos e Retorno de Cliente Perdidos',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana da equipe gastas com burocracia em vez de converter orçamentos em serviços.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em serviços destraváveis',
        oQueDeveMudar: 'Retorno automático de orçamento e lembrete de revisão periódica.',
        comoResolver: 'Esteira de follow-up por WhatsApp e reativação de clientes parados.',
        tecnologiaNecessaria: 'CRM de oficina + disparos automáticos.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Peças e Despesas sem Revisão',
        oQueEstaAcontecendo: 'Peça parada no estoque, compra emergencial acima do preço e contratos sem renegociação.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Giro de estoque monitorado e compra programada.',
        comoResolver: 'Auditoria de estoque e negociação com distribuidores.',
        tecnologiaNecessaria: 'Gestão de estoque + cotações comparativas.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar licenças e serviços sem uso e renegociar contratos',
        responsavel: 'Financeiro / Dono',
        objetivo: 'Reduzir custos fixos sem impactar a operação',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas para orçamentos padrão, descontos e cobranças',
        responsavel: 'Dono / Gerente',
        objetivo: 'Liberar no mínimo 8 horas semanais da liderança do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Orçamentos e cobranças mais rápidos sem depender do dono.'
      },
      {
        acao: 'Automatizar retorno de orçamento e lembrete de revisão',
        responsavel: 'Recepção / Comercial',
        objetivo: 'Evitar orçamentos parados e cliente sem retorno',
        indicador: 'Taxa de conversão de orçamentos',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% nos serviços fechados sem mais mídia.'
      },
      {
        acao: 'Digitalizar OS e sincronizar estoque de peças',
        responsavel: 'Operação',
        objetivo: 'Eliminar papel e peça errada na montagem',
        indicador: 'Horas semanais de retrabalho',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês e menos OS reabertas.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar licenças, estoque ocioso e contratos sem retorno.',
          'Definir matriz de alçadas de orçamento, desconto e cobrança.',
          'Padronizar orçamento, OS e cobrança.'
        ]
      },
      fase2: {
        foco: 'Integrar oficina, estoque e financeiro',
        acoes: [
          'Conectar sistema de oficina, estoque e financeiro para eliminar digitação duplicada.',
          'Ativar orçamento digital com assinatura e follow-up automático.',
          'Implantar alerta de estoque mínimo e régua de cobrança.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, margem e escala',
        acoes: [
          'Criar painel com OS abertas, taxa de conversão, peças e DRE em tempo real.',
          'Absorver crescimento de veículos sem contratar na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações administrativas pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho de orçamento e OS mapeadas.',
      'Integrar oficina, estoque e financeiro eliminando a digitação manual entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de orçamento, desconto e cobrança que hoje travam na mesa do dono.'
    ]
  },

  veterinario_petshop: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas ao agendamento manual de consultas, cadastro de tutores em planilha e cobrança manual de serviços — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo do veterinário e da equipe que poderia estar focado no atendimento clínico. O consultório possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'A clínica tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar a equipe, bastando automatizar agenda, retorno e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças de sistemas ociosos, marketing sem mensuração, serviços duplicados)',
      otimizaveis: 'Custos Otimizáveis (estoque de produtos parado, insumos vencendo e despesas renegociáveis)',
      contratacoes: 'Contratações Evitáveis (recepção para tarefas que a automação assume)',
      margem: 'Margem Recuperável (menos falta de agenda e mais serviços realizados)',
      receita: 'Receita Destravável (mais consultas, exames e pet shop vendido)'
    },
    top5: [
      {
        titulo: 'Retrabalho em Agenda, Cadastro e Cobrança',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas confirmando consulta por telefone, regravando tutor em planilha e cobrando serviço na mão.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Agendamento on-line com confirmação automática e cobrança integrada.',
        comoResolver: 'Integrar agenda veterinária, WhatsApp e financeiro.',
        tecnologiaNecessaria: 'Sistema veterinário com agendamento + confirmação automática.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações de Recepção Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para recepção antes de automatizar agenda e retorno.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a capacidade da equipe atual antes de abrir vagas.',
        comoResolver: 'Fluxo de agendamento e lembrete automático de retorno.',
        tecnologiaNecessaria: 'Automação de agenda e lembretes por WhatsApp.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Veterinário Preso na Administração',
        oQueEstaAcontecendo: 'O profissional gasta {horasDonoSemana}h semanais ({horasDono}h/mês) resolvendo agenda, cobrança, estoque e conflitos.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para recepção decidirem descontos, encaixes e pendências.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com painel da clínica.',
        tecnologiaNecessaria: 'Central de aprovações + painel de agenda e faturamento.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Consultas e Produtos Perdidos no Follow-up',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana da equipe gastas com burocracia em vez de tratar, agendar e vender.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em serviços destraváveis',
        oQueDeveMudar: 'Lembrete automático de retorno, vacinação e pet shop.',
        comoResolver: 'Esteira de campanhas de retorno e reativação de tutores ausentes.',
        tecnologiaNecessaria: 'CRM veterinário + disparos automáticos.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Estoque e Despesas sem Revisão',
        oQueEstaAcontecendo: 'Produto parado no pet shop, insumo perto do vencimento e contratos sem renegociação.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Giro de estoque monitorado e renegociação de fornecedores.',
        comoResolver: 'Auditoria de estoque e despesas gerais.',
        tecnologiaNecessaria: 'Gestão de estoque com alerta de validade.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar licenças e serviços sem uso e renegociar contratos',
        responsavel: 'Financeiro / Dono',
        objetivo: 'Reduzir custos fixos sem impactar o atendimento',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas de desconto, encaixe e pendências',
        responsavel: 'Dono / Veterinário',
        objetivo: 'Liberar no mínimo 8 horas semanais da liderança do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Recepção autônoma e agenda mais fluida.'
      },
      {
        acao: 'Automatizar confirmação de consulta e lembrete de retorno',
        responsavel: 'Recepção',
        objetivo: 'Reduzir falta em consulta e turva de horário',
        indicador: 'Taxa de ocupação da agenda',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% na agenda ocupada sem mais operador.'
      },
      {
        acao: 'Digitalizar cadastro de tutor e cobrança integrada',
        responsavel: 'Operação',
        objetivo: 'Eliminar redigitação e cobrança manual',
        indicador: 'Horas semanais de retrabalho',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês e caixa mais previsível.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar licenças, estoque e contratos sem retorno.',
          'Definir matriz de alçadas de desconto e encaixe.',
          'Padronizar agenda, cadastro e cobrança.'
        ]
      },
      fase2: {
        foco: 'Integrar agenda, WhatsApp e financeiro',
        acoes: [
          'Conectar agenda veterinária, WhatsApp e financeiro para eliminar digitação duplicada.',
          'Ativar confirmação e lembrete automático de retorno.',
          'Implantar alerta de estoque e validade.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, retenção e escala',
        acoes: [
          'Criar painel com agenda ocupada, retorno, vendas e DRE em tempo real.',
          'Absorver crescimento de pacientes sem contratar na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações de recepção pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho mapeadas.',
      'Integrar agenda, WhatsApp e financeiro eliminando a digitação manual entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de desconto, encaixe e pendência que hoje travam na mesa do veterinário.'
    ]
  },

  salao_beleza: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas ao agendamento manual por telefone, controle de comissão em planilha e cobrança sem integração — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo do profissional e da equipe que poderia estar focado no atendimento. O salão possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'O salão tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar a equipe, bastando automatizar agenda, comissão e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças de apps ociosos, marketing sem mensuração, serviços duplicados)',
      otimizaveis: 'Custos Otimizáveis (produto parado, comissão mal calculada e despesas renegociáveis)',
      contratacoes: 'Contratações Evitáveis (recepção para tarefas que a automação assume)',
      margem: 'Margem Recuperável (menos horário vago e menos erro de comissão)',
      receita: 'Receita Destravável (mais horários ocupados e venda de produtos)'
    },
    top5: [
      {
        titulo: 'Retrabalho em Agenda, Comissão e Cobrança',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas atendendo telefone para agendar, calcular comissão em planilha e conciliar caixa manualmente.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Agendamento on-line e comissão calculada automaticamente no fechamento.',
        comoResolver: 'Integrar agenda do salão, comissão e financeiro.',
        tecnologiaNecessaria: 'Software de salão + pagamento integrado.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações de Recepção Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para recepção antes de automatizar agenda e comissão.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a capacidade da equipe atual antes de abrir vagas.',
        comoResolver: 'Agendamento on-line com confirmação automática.',
        tecnologiaNecessaria: 'Agenda digital + lembretes automáticos.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Dono/Profissional Preso na Administração',
        oQueEstaAcontecendo: 'A liderança gasta {horasDonoSemana}h semanais ({horasDono}h/mês) resolvendo agenda, comissão, estoque e conflitos de equipe.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para recepção decidirem descontos, trocas e pendências.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com painel do salão.',
        tecnologiaNecessaria: 'Central de aprovações + painel de agenda e faturamento.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Horário Vago e Cliente Sem Retorno',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana da equipe gastas com burocracia em vez de preencher a agenda.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em serviços destraváveis',
        oQueDeveMudar: 'Lembrete automático de retorno e lista de espera inteligente.',
        comoResolver: 'Régua de reativação e preenchimento de horário vago.',
        tecnologiaNecessaria: 'Agenda digital + disparos automáticos.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Produtos e Despesas sem Revisão',
        oQueEstaAcontecendo: 'Produto parado no consumo, comissão mal dimensionada e contratos sem renegociação.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Giro de produto monitorado e renegociação de contratos.',
        comoResolver: 'Auditoria de estoque e despesas gerais.',
        tecnologiaNecessaria: 'Gestão de estoque + cotações comparativas.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar apps e serviços sem uso e renegociar contratos',
        responsavel: 'Financeiro / Dono',
        objetivo: 'Reduzir custos fixos sem impactar o atendimento',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas de desconto, troca e pendências',
        responsavel: 'Dono / Gerente',
        objetivo: 'Liberar no mínimo 8 horas semanais da liderança do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Recepção autônoma e atendimento mais rápido.'
      },
      {
        acao: 'Automatizar lembrete de retorno e lista de espera',
        responsavel: 'Recepção',
        objetivo: 'Reduzir falta e horário vago na agenda',
        indicador: 'Taxa de ocupação da agenda',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% na agenda ocupada sem mais mídia.'
      },
      {
        acao: 'Integrar agenda, comissão e caixa',
        responsavel: 'Operação',
        objetivo: 'Eliminar cálculo manual de comissão e conciliação',
        indicador: 'Horas semanais de retrabalho',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês e comissão sem divergência.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar apps, licenças e contratos sem retorno.',
          'Definir matriz de alçadas de desconto e troca.',
          'Padronizar agenda, comissão e cobrança.'
        ]
      },
      fase2: {
        foco: 'Integrar agenda, comissão e caixa',
        acoes: [
          'Conectar agenda, comissão e caixa para eliminar digitação duplicada.',
          'Ativar agendamento on-line e lembrete automático.',
          'Implantar lista de espera inteligente e régua de reativação.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, retenção e escala',
        acoes: [
          'Criar painel com agenda ocupada, faturamento por profissional e DRE em tempo real.',
          'Absorver crescimento de clientes sem contratar na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações de recepção pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho mapeadas.',
      'Integrar agenda, comissão e caixa eliminando a digitação manual entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de desconto e pendência que hoje travam na mesa do dono.'
    ]
  },

  transporte_logistica: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas ao roteiramento manual, controle de frota em planilha e conferência de documentos de carga — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo do dispatcher e da equipe que poderia estar focado na operação e no cliente. A transportadora possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'A operação tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar a equipe, bastando automatizar rota, documentação e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças e equipamentos ociosos, serviços duplicados, marketing sem mensuração)',
      otimizaveis: 'Custos Otimizáveis (rota mal otimizada, manutenção reativa e despesas renegociáveis)',
      contratacoes: 'Contratações Evitáveis (administrativo para tarefas que a automação assume)',
      margem: 'Margem Recuperável (menos parada ociosa, menos retrabalho documental e mais viagem por veículo)',
      receita: 'Receita Destravável (mais frete executado com a mesma frota)'
    },
    top5: [
      {
        titulo: 'Retrabalho em Rota, Documentos e Conciliação',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas montando rota manualmente, conferindo canhoto e conciliando frete em planilha.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Rota otimizada automática e comprovante de entrega digital.',
        comoResolver: 'Integrar TMS, GPS e financeiro.',
        tecnologiaNecessaria: 'TMS/rota automatizada + coleta digital de POD.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações Administrativas Evitáveis',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} pessoas para despacho antes de automatizar rota e documentação.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a capacidade da equipe atual antes de abrir vagas.',
        comoResolver: 'Automação de rota, canhoto e conciliação de frete.',
        tecnologiaNecessaria: 'Fluxos automáticos de despacho e POD digital.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Gestor Preso na Operação',
        oQueEstaAcontecendo: 'A liderança gasta {horasDonoSemana}h semanais ({horasDono}h/mês) resolvendo ocorrência de viagem, atraso, cliente e manutenção.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para despacho decidirem desvio, atraso e manutenção padrão.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com painel da frota.',
        tecnologiaNecessaria: 'Central de aprovações + painel de frota e entregas.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Cotações e Follow-up Parados',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana da equipe gastas com burocracia em vez de fechar fretes recorrentes.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em fretes destraváveis',
        oQueDeveMudar: 'Follow-up automático de cotação enviada e recuperação de cliente ocioso.',
        comoResolver: 'Esteira de follow-up e reativação de clientes sem embarque.',
        tecnologiaNecessaria: 'CRM logístico + disparos automáticos.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Frota e Despesas sem Revisão',
        oQueEstaAcontecendo: 'Manutenção reativa cara, licenças ociosas e contratos sem renegociação.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Manutenção preventiva programada e renegociação de contratos.',
        comoResolver: 'Auditoria de custos de frota e fornecedores.',
        tecnologiaNecessaria: 'Gestão de manutenção + cotações comparativas.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar licenças e serviços ociosos e renegociar contratos',
        responsavel: 'Financeiro / Gestor',
        objetivo: 'Reduzir custos fixos sem impactar a operação',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas de desvio de rota, atraso e manutenção',
        responsavel: 'Gestor / Dono',
        objetivo: 'Liberar no mínimo 8 horas semanais da liderança do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Ocorrências resolvidas sem passar pela mesa do gestor.'
      },
      {
        acao: 'Automatizar follow-up de cotação e reativação de clientes',
        responsavel: 'Comercial',
        objetivo: 'Evitar cotação parada e cliente sem embarque',
        indicador: 'Taxa de conversão de cotações',
        prazo: '25 dias',
        resultado: 'Aumento de 3% a 8% nos fretes fechados.'
      },
      {
        acao: 'Digitalizar rota e comprovante de entrega (POD)',
        responsavel: 'Despacho / Operação',
        objetivo: 'Eliminar papel e conferência manual de canhoto',
        indicador: 'Horas semanais de retrabalho',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês e conciliação de frete automática.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar licenças, manutenção e contratos sem retorno.',
          'Definir matriz de alçadas de rota, atraso e manutenção.',
          'Padronizar rota, POD e conciliação de frete.'
        ]
      },
      fase2: {
        foco: 'Integrar rota, frota e financeiro',
        acoes: [
          'Conectar TMS, GPS e financeiro para eliminar digitação duplicada.',
          'Ativar rota otimizada e POD digital com follow-up automático.',
          'Implantar manutenção preventiva e conciliação automatizada.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, ocupação e escala',
        acoes: [
          'Criar painel com ocupação da frota, atrasos, custo por km e DRE em tempo real.',
          'Absorver crescimento de fretes sem contratar na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações administrativas pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho de rota e documentação mapeadas.',
      'Integrar rota, frota e financeiro eliminando a digitação manual entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de desvio, atraso e manutenção que hoje travam na mesa do gestor.'
    ]
  },

  marketing_digital: {
    achados: {
      desperdicio: 'Na sobrecarga com {horas} horas mensais dedicadas à produção manual de relatórios para cliente, controle de peças em planilha e aprovação de campanha por e-mail — drenando aproximadamente R$ {valorHoras}/mês em folha improdutiva.',
      capacidade: 'No tempo do time que poderia estar focado em criar, testar e otimizar campanhas. A agência possui {horasRec}h/mês recuperáveis (equivalente a {jornadas} colaboradores em tempo integral).',
      crescimento: 'A agência tem potencial para crescer aproximadamente +{crescimento}% em faturamento antes de precisar ampliar o time, bastando automatizar relatórios, aprovações e alçadas de decisão.'
    },
    componentes: {
      eliminaveis: 'Custos Elimináveis (licenças de ferramentas ocias, tráfego pago mal configurado, serviços duplicados)',
      otimizaveis: 'Custos Otimizáveis (plataformas sobrepostas, horas não faturadas e despesas renegociáveis)',
      contratacoes: 'Contratações Evitáveis (analista para tarefas que a automação assume)',
      margem: 'Margem Recuperável (menos retrabalho de relatório e mais horas faturáveis)',
      receita: 'Receita Destravável (mais clientes atendidos e upsell de serviços)'
    },
    top5: [
      {
        titulo: 'Retrabalho em Relatórios e Aprovações',
        oQueEstaAcontecendo: '{horas} horas mensais consumidas montando relatório manual para cada cliente e colhendo aprovação de peça por e-mail.',
        quantoRepresenta: 'R$ {valorHoras} / mês em capacidade drenada ({horasRec}h)',
        oQueDeveMudar: 'Relatório gerado automaticamente e aprovação de peça em um link.',
        comoResolver: 'Integrar plataformas de mídia, BI e ferramenta de aprovação.',
        tecnologiaNecessaria: 'BI automatizado + plataforma de aprovação criativa.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Contratações Evitáveis no Time',
        oQueEstaAcontecendo: 'Intenção de contratar {contratacoes} analistas para relatórios e suporte antes de automatizar essas rotinas.',
        quantoRepresenta: 'R$ {economiaContratacao} / mês em novas folhas evitadas',
        oQueDeveMudar: 'Alavancar a capacidade do time atual antes de abrir vagas.',
        comoResolver: 'Automação de relatório, aprovação e cobrança recorrente.',
        tecnologiaNecessaria: 'Fluxos automáticos de report e aprovação.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Sócio Preso no Operacional',
        oQueEstaAcontecendo: 'O sócio gasta {horasDonoSemana}h semanais ({horasDono}h/mês) resolvendo crise de cliente, aprovação, cobrança e retrabalho do time.',
        quantoRepresenta: 'R$ {valorTempoDono} / mês em tempo executivo de alto valor subutilizado',
        oQueDeveMudar: 'Alçadas para líder de projeto decidirem peça padrão, ajuste e escopo.',
        comoResolver: 'Matriz de alçadas e rotina de governança semanal com painel da agência.',
        tecnologiaNecessaria: 'Central de aprovações + painel de horas e margem por cliente.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        titulo: 'Horas Não Faturadas e Follow-up Parado',
        oQueEstaAcontecendo: '{horasAdmComercial}h/semana do time gastas com burocracia em vez de produzir e vender.',
        quantoRepresenta: 'R$ {receitaDestravavel} / mês em horas faturáveis destravadas',
        oQueDeveMudar: 'Time capturado por projeto e follow-up automático de proposta enviada.',
        comoResolver: 'Time tracking integrado e esteira de proposta por cliente.',
        tecnologiaNecessaria: 'Time tracking + CRM de agência.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        titulo: 'Ferramentas e Despesas sem Revisão',
        oQueEstaAcontecendo: 'Licenças de plataformas sobrepostas, plano de ferramentas pouco usado e contratos antigos.',
        quantoRepresenta: 'R$ {custosTotal} / mês em economia direta de caixa',
        oQueDeveMudar: 'Consolidação de ferramentas e renegociação de contratos.',
        comoResolver: 'Auditoria de SaaS e despesas da agência.',
        tecnologiaNecessaria: 'Auditoria de ferramentas + negociação de fornecedores.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ],
    quickWins: [
      {
        acao: 'Cortar licenças de ferramentas ociosas e renegociar contratos',
        responsavel: 'Financeiro / Sócio',
        objetivo: 'Reduzir custos fixos sem impactar a entrega',
        indicador: 'R$ economizados por mês',
        prazo: '15 dias',
        resultado: 'Economia de até R$ {economiaTecnologia}/mês imediata no caixa.'
      },
      {
        acao: 'Instituir alçadas de peça, ajuste e escopo por cliente',
        responsavel: 'Sócio / Líder',
        objetivo: 'Liberar no mínimo 8 horas semanais da liderança do operacional',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Aprovações e escopo mais rápidos sem travar no sócio.'
      },
      {
        acao: 'Automatizar relatório mensal de campanhas por cliente',
        responsavel: 'Analistas / Data',
        objetivo: 'Eliminar montagem manual de relatório',
        indicador: 'Horas mensais montando relatório',
        prazo: '25 dias',
        resultado: 'Economia de 60h/mês e relatório entregue sempre no prazo.'
      },
      {
        acao: 'Captura de horas integrada e follow-up de proposta automático',
        responsavel: 'Operação / Comercial',
        objetivo: 'Acabar com horas não faturadas e proposta parada',
        indicador: 'Margem por cliente',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês e aumento de horas faturáveis.'
      }
    ],
    plano90Dias: {
      fase1: {
        foco: 'Eliminar desperdícios imediatos e quick wins',
        acoes: [
          'Auditar licenças, ferramentas e contratos sem retorno.',
          'Definir matriz de alçadas de peça, ajuste e escopo.',
          'Padronizar relatório, aprovação e cobrança de clientes.'
        ]
      },
      fase2: {
        foco: 'Integrar mídia, BI, aprovação e financeiro',
        acoes: [
          'Conectar plataformas de mídia, BI e financeiro para eliminar digitação duplicada.',
          'Ativar relatório automatizado e aprovação de peça em link.',
          'Implantar time tracking e cobrança recorrente automatizadas.'
        ]
      },
      fase3: {
        foco: 'Consolidar indicadores, margem e escala',
        acoes: [
          'Criar painel com margem por cliente, horas faturáveis, churn e DRE em tempo real.',
          'Absorver crescimento de clientes sem contratar na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    },
    recomendacoesCeo: [
      'Congelar contratações pelos próximos 60 dias até liberar as {horasRec} horas de retrabalho de relatórios e aprovações mapeadas.',
      'Integrar mídia, BI e financeiro eliminando a digitação manual entre setores.',
      'Delegar com alçadas pré-estabelecidas 50% das decisões de peça, ajuste e escopo que hoje travam na mesa do sócio.'
    ]
  }
};

// ==========================================
// INTEGRAÇÃO — LINGUAGEM POR SEGMENTO
// ==========================================
const has = (v) => v !== null && v !== undefined;

const deepMerge = (base, extra) => {
  if (Array.isArray(base) || Array.isArray(extra)) return extra !== undefined ? extra : base;
  if (typeof base === 'object' && base !== null && typeof extra === 'object' && extra !== null) {
    const out = { ...base };
    for (const key of Object.keys(extra)) {
      out[key] = has(base[key]) ? deepMerge(base[key], extra[key]) : extra[key];
    }
    return out;
  }
  return extra !== undefined ? extra : base;
};

const mergeBlock = (baseBlock, extraBlock) => {
  if (!extraBlock) return baseBlock;
  return deepMerge(baseBlock, extraBlock);
};

/**
 * Constrói a linguagem completa do segmento escolhido.
 * @param {string} segmentoId id do segmento (ex.: 'clinica_saude')
 * @param {Object} categoryMap NICHO_CATEGORY_MAP
 * @returns {{blocks: Object, report: Object}} blocos extras e relatório prontos
 */
export const buildSegmentLanguage = (segmentoId, categoryMap) => {
  const categoria = (categoryMap && categoryMap[segmentoId]) || segmentoId;
  const blocksCat = BLOCKS_EXTRA[categoria] || BLOCKS_EXTRA.outro;
  const blocksSeg = BLOCKS_EXTRA[segmentoId];
  const reportCat = REPORTS[categoria] || REPORTS.outro;
  const reportSeg = SEGMENT_REPORTS[segmentoId];

  const blocks = {};
  for (const b of ['b3', 'b9', 'b10', 'b11', 'b12']) {
    blocks[b] = mergeBlock(blocksCat[b], blocksSeg && blocksSeg[b]);
  }

  const report = deepMerge(reportCat, reportSeg);

  return { blocks, report };
};

export default buildSegmentLanguage;
