// Helper de Contexto por Nicho de Atuação
// Adapta linguagem, termos, perguntas e placeholders para a realidade de cada negócio,
// eliminando jargões de startups (CRM, SDR, closer, leads) em favor da linguagem do empresário tradicional.

import { buildSegmentLanguage } from './segmentLanguage.js';

export const NICHOS_LIST = [
  { id: 'clinica_saude', label: 'Clínica / Consultório (Médico, Odonto, Saúde, Estética)' },
  { id: 'contabilidade', label: 'Escritório de Contabilidade / BPO Financeiro' },
  { id: 'industria', label: 'Indústria / Manufatura / Fábrica' },
  { id: 'comercio_varejo', label: 'Comércio / Loja / Varejo / Distribuidora' },
  { id: 'advocacia', label: 'Escritório de Advocacia / Jurídico' },
  { id: 'servicos', label: 'Prestação de Serviços / Consultoria / Projetos' },
  
  // Novos segmentos - Agro e Alimentos
  { id: 'agronegocio', label: 'Agronegócio / Produtor Rural / Agroindústria' },
  { id: 'alimentos_bebidas', label: 'Alimentos e Bebidas / Indústria Alimentícia' },
  { id: 'restaurante_bar', label: 'Restaurante / Bar / Lanchonete / Food Service' },
  
  // Construção e Engenharia
  { id: 'construcao_civil', label: 'Construção Civil / Incorporadora / Construtora' },
  { id: 'engenharia_arquitetura', label: 'Engenharia / Arquitetura / Projetos Técnicos' },
  { id: 'materiais_construcao', label: 'Materiais de Construção / Loja de Construção' },
  
  // Automotivo e Transporte
  { id: 'automotivo_oficina', label: 'Oficina Mecânica / Auto Center / Funilaria' },
  { id: 'concessionaria', label: 'Concessionária / Revenda de Veículos' },
  { id: 'transporte_logistica', label: 'Transporte / Logística / Frota / Entregas' },
  
  // Educação e Treinamento
  { id: 'escola_curso', label: 'Escola / Curso / Faculdade / Educação' },
  { id: 'treinamento_corporativo', label: 'Treinamento Corporativo / Coaching / Mentoria' },
  
  // Tecnologia e Software
  { id: 'software_saas', label: 'Software / SaaS / Desenvolvimento de Sistemas' },
  { id: 'ti_servicos', label: 'TI / Serviços de Tecnologia / MSP / Suporte' },
  { id: 'ecommerce_marketplace', label: 'E-commerce / Marketplace / Loja Virtual' },
  { id: 'marketing_digital', label: 'Agência de Marketing / Publicidade / Digital' },
  
  // Financeiro e Seguros
  { id: 'corretora_seguros', label: 'Corretora de Seguros / Benefícios' },
  { id: 'fintech_servicos_financeiros', label: 'Fintech / Serviços Financeiros / Crédito / Câmbio' },
  { id: 'assessoria_investimentos', label: 'Assessoria de Investimentos / Wealth Management' },
  
  // Imobiliário
  { id: 'imobiliaria', label: 'Imobiliária / Corretagem de Imóveis' },
  { id: 'incorporadora_imobiliaria', label: 'Incorporadora / Loteadora / Desenvolvimento Imobiliário' },
  
  // Saúde e Bem-estar (além de clínicas)
  { id: 'academia_personal', label: 'Academia / Studio / Personal Trainer / Fitness' },
  { id: 'farmacia_drogaria', label: 'Farmácia / Drogaria / Manipulação' },
  { id: 'veterinario_petshop', label: 'Veterinária / Pet Shop / Clínica Pet' },
  
  // Serviços Especializados
  { id: 'escritorio_engenharia', label: 'Escritório de Engenharia / Projetos / Consultoria Técnica' },
  { id: 'despachante_documentacao', label: 'Despachante / Documentação / Serviços Cartoriais' },
  { id: 'condominio_facilities', label: 'Administradora de Condomínios / Facilities / Síndico Profissional' },
  
  // Indústria Específica
  { id: 'textil_confeccao', label: 'Têxtil / Confecção / Moda / Vestuário Industrial' },
  { id: 'moveis_marcenaria', label: 'Móveis / Marcenaria / Serralharia / Carpintaria' },
  { id: 'metalurgica_usinagem', label: 'Metalúrgica / Usinagem / Caldeiraria / Fundição' },
  { id: 'quimica_cosmeticos', label: 'Química / Cosméticos / Farmacêutica / Tintas' },
  
  // Serviços Pessoais e Domésticos
  { id: 'salao_beleza', label: 'Salão de Beleza / Barbearia / Estética / Spa' },
  { id: 'servicos_domesticos', label: 'Serviços Domésticos / Limpeza / Manutenção Residencial' },
  { id: 'eventos_cerimonial', label: 'Eventos / Cerimonial / Buffet / Organização de Festas' },
  
  // Comércio Especializado
  { id: 'atacado_distribuidor', label: 'Atacado / Distribuidor / Representação Comercial' },
  { id: 'franquia_franqueadora', label: 'Franqueadora / Franquia / Rede de Negócios' },
  
  // Outros
  { id: 'outro', label: 'Outro tipo de negócio (personalizado)' }
];

export const NICHOS_CONFIG = {
  clinica_saude: {
    id: 'clinica_saude',
    nome: 'Clínica / Consultório de Saúde',
    clienteTermo: 'pacientes',
    clienteSingular: 'paciente',
    unidadeVenda: 'consultas / procedimentos',
    
    // Bloco 1
    b1: {
      clientesMesLabel: 'Quantos pacientes são atendidos por mês na clínica?',
      clientesMesPlaceholder: 'Ex: 180',
      ticketMedioLabel: 'Valor médio por consulta ou procedimento (R$)',
      ticketMedioPlaceholder: 'Ex: 350',
      produtosServicosLabel: 'Principais especialidades, procedimentos ou tratamentos oferecidos',
      produtosServicosPlaceholder: 'Ex: Consultas médicas, exames preventivos, tratamentos estéticos, implantes...',
      maiorDesafioPlaceholder: 'Ex: Faltas de pacientes (no-show), fila de espera, glosas de convênio, tempo da recepção no WhatsApp...'
    },

    // Bloco 2
    b2: {
      ondeContratariaPlaceholder: 'Ex: Recepção, Agendamento no WhatsApp, Enfermagem, Financeiro...'
    },

    // Bloco 4
    b4: {
      ondeMaisTravaPlaceholder: 'Ex: Na confirmação de consultas, no cadastro do prontuário, no faturamento de convênios...'
    },

    // Bloco 5
    b5: {
      principaisSistemasPlaceholder: 'Ex: Feegow, Clinicorp, Simples Dental, Amplimed, WhatsApp, Planilhas...'
    },

    // Bloco 6 (Comercial / Atendimento)
    b6: {
      titulo: 'Atendimento, Agendamentos e Captação de Pacientes',
      subtitulo: 'Eficiência da equipe de recepção/agendamento, confirmação de horários e conversão de novos pacientes.',
      vendedoresLabel: 'Pessoas dedicadas ao atendimento, recepção e agendamento',
      vendedoresPlaceholder: 'Ex: 2',
      sdrsLabel: 'Profissionais de saúde / especialistas que atendem (se houver)',
      sdrsPlaceholder: 'Ex: 3',
      leadsLabel: 'Quantos pacientes novos ou contatos para agendamento chegam por mês?',
      leadsPlaceholder: 'Ex: 90',
      vendasLabel: 'Quantas consultas ou procedimentos particulares são fechados por mês?',
      vendasPlaceholder: 'Ex: 70',
      horasAdmLabel: 'Horas por semana que a equipe gasta em tarefas burocráticas (confirmar horários no WhatsApp, encaixes, conferir guias de convênio, preencher prontuários) em vez de atender pacientes:'
    },

    // Bloco 7 (Divulgação / Captação)
    b7: {
      titulo: 'Divulgação, Anúncios e Atração de Pacientes',
      subtitulo: 'Investimento em redes sociais, anúncios no Google, parcerias e indicações.'
    },

    // Bloco 8 (Recepção e Dúvidas)
    b8: {
      titulo: 'Recepção, WhatsApp e Dúvidas de Pacientes',
      subtitulo: 'Volume de mensagens diárias para tirar dúvidas sobre horários, valores, preparo de exames e convênios.',
      canaisPlaceholder: 'Ex: WhatsApp da clínica, Telefone fixo, Recepção presencial'
    },

    // Relatório
    report: {
      comercialTitle: 'Atendimento, Agendamento e Ocupação da Agenda',
      leadsTermo: 'novos contatos de agendamento',
      vendasTermo: 'consultas/procedimentos realizados'
    }
  },

  contabilidade: {
    id: 'contabilidade',
    nome: 'Escritório de Contabilidade',
    clienteTermo: 'empresas clientes',
    clienteSingular: 'cliente',
    unidadeVenda: 'novos contratos de honorários',

    // Bloco 1
    b1: {
      clientesMesLabel: 'Quantas empresas clientes o escritório atende mensalmente?',
      clientesMesPlaceholder: 'Ex: 120',
      ticketMedioLabel: 'Honorário contábil médio mensal por cliente (R$)',
      ticketMedioPlaceholder: 'Ex: 1400',
      produtosServicosLabel: 'Principais serviços prestados (Contábil, Fiscal, DP, BPO Financeiro, Legalização)',
      produtosServicosPlaceholder: 'Ex: Gestão contábil e fiscal para PMEs, BPO Financeiro, Planejamento tributário...',
      maiorDesafioPlaceholder: 'Ex: Clientes atrasando extratos bancários, correria do dia 5 com folha, importação de notas fiscais...'
    },

    // Bloco 2
    b2: {
      ondeContratariaPlaceholder: 'Ex: Fiscal, Contábil, Departamento Pessoal, Onboarding de clientes, BPO...'
    },

    // Bloco 4
    b4: {
      ondeMaisTravaPlaceholder: 'Ex: Cobrar documentos dos clientes, conferência manual de notas, fechamento da folha no dia 5...'
    },

    // Bloco 5
    b5: {
      principaisSistemasPlaceholder: 'Ex: Domínio Sistemas, Questor, Alterdata, Omie, ContaAzul, WhatsApp, Planilhas...'
    },

    // Bloco 6
    b6: {
      titulo: 'Captação Comercial, Propostas e Novos Clientes',
      subtitulo: 'Equipe comercial ou sócios que fecham contratos, emissão de propostas e novos clientes fechados.',
      vendedoresLabel: 'Sócios ou pessoas dedicadas a negociar e fechar novos clientes',
      vendedoresPlaceholder: 'Ex: 2',
      sdrsLabel: 'Pessoas focadas em prospecção inicial / qualificação (se houver)',
      sdrsPlaceholder: 'Ex: 1',
      leadsLabel: 'Quantas empresas interessadas em propostas contábeis chegam por mês?',
      leadsPlaceholder: 'Ex: 25',
      vendasLabel: 'Quantos novos contratos de honorários são fechados por mês?',
      vendasPlaceholder: 'Ex: 5',
      horasAdmLabel: 'Horas por semana gastas em tarefas burocráticas (montar propostas manuais, cobrar documentos, certidões) em vez de negociar e fechar contratos:'
    },

    // Bloco 7
    b7: {
      titulo: 'Divulgação, Indicações e Marketing Contábil',
      subtitulo: 'Investimento em captação de novas empresas, marketing de conteúdo, Google e parcerias.'
    },

    // Bloco 8
    b8: {
      titulo: 'Atendimento a Clientes e Suporte às Empresas',
      subtitulo: 'Volume de mensagens diárias tirando dúvidas de impostos, guias, certidões e holerites.',
      canaisPlaceholder: 'Ex: WhatsApp, E-mail, Portal do Cliente, Telefone'
    },

    // Relatório
    report: {
      comercialTitle: 'Captação de Clientes e Assinatura de Honorários',
      leadsTermo: 'propostas contábeis solicitadas',
      vendasTermo: 'novos contratos de honorários'
    }
  },

  industria: {
    id: 'industria',
    nome: 'Indústria / Manufatura',
    clienteTermo: 'clientes / compradores',
    clienteSingular: 'cliente',
    unidadeVenda: 'pedidos faturados',

    // Bloco 1
    b1: {
      clientesMesLabel: 'Quantos clientes ou pedidos são faturados por mês?',
      clientesMesPlaceholder: 'Ex: 60',
      ticketMedioLabel: 'Valor médio por pedido ou faturamento (R$)',
      ticketMedioPlaceholder: 'Ex: 8500',
      produtosServicosLabel: 'Principais linhas de produtos fabricados ou transformados',
      produtosServicosPlaceholder: 'Ex: Peças usinadas, embalagens plásticas, equipamentos industriais, móveis seriados...',
      maiorDesafioPlaceholder: 'Ex: Atrasos no PCP/produção, cotações demoradas, compras emergenciais de insumos, gargalo na expedição...'
    },

    // Bloco 2
    b2: {
      ondeContratariaPlaceholder: 'Ex: Chão de fábrica, Operação, PCP, Vendas técnicas, Expedição...'
    },

    // Bloco 4
    b4: {
      ondeMaisTravaPlaceholder: 'Ex: Na passagem do pedido de vendas para a fábrica, no PCP, na cotação de insumos...'
    },

    // Bloco 5
    b5: {
      principaisSistemasPlaceholder: 'Ex: Totvs, Bling, Senior, Sankhya, SAP, Planilhas de PCP, WhatsApp...'
    },

    // Bloco 6
    b6: {
      titulo: 'Vendas Técnicas, Orçamentos e Representantes',
      subtitulo: 'Eficiência da equipe de vendas comerciais, orçamentos emitidos e pedidos fechados.',
      vendedoresLabel: 'Vendedores internos, externos ou representantes comerciais ativos',
      vendedoresPlaceholder: 'Ex: 3',
      sdrsLabel: 'Assistentes comerciais ou orçamentistas técnicos (se houver)',
      sdrsPlaceholder: 'Ex: 1',
      leadsLabel: 'Quantas cotações ou pedidos de orçamento chegam por mês?',
      leadsPlaceholder: 'Ex: 80',
      vendasLabel: 'Quantos pedidos de venda / faturamentos são fechados por mês?',
      vendasPlaceholder: 'Ex: 35',
      horasAdmLabel: 'Horas por semana gastas calculando orçamentos manuais, consultando estoque e cobrando dados em vez de vender:'
    },

    // Bloco 7
    b7: {
      titulo: 'Catálogos, Feiras e Prospecção Industrial',
      subtitulo: 'Investimento em anúncios industriais, feiras do setor, prospecção e catálogos.'
    },

    // Bloco 8
    b8: {
      titulo: 'SAC, Pós-Venda e Acompanhamento de Pedidos',
      subtitulo: 'Volume de mensagens sobre prazo de entrega, status de produção, notas fiscais e assistência.',
      canaisPlaceholder: 'Ex: E-mail, WhatsApp comercial, Telefone'
    },

    // Relatório
    report: {
      comercialTitle: 'Vendas Técnicas e Conversão de Cotações',
      leadsTermo: 'cotações e orçamentos recebidos',
      vendasTermo: 'pedidos faturados'
    }
  },

  comercio_varejo: {
    id: 'comercio_varejo',
    nome: 'Comércio / Varejo / Loja',
    clienteTermo: 'clientes',
    clienteSingular: 'cliente',
    unidadeVenda: 'vendas realizadas',

    // Bloco 1
    b1: {
      clientesMesLabel: 'Quantas compras / clientes atendidos por mês na loja?',
      clientesMesPlaceholder: 'Ex: 450',
      ticketMedioLabel: 'Ticket médio por compra (R$)',
      ticketMedioPlaceholder: 'Ex: 180',
      produtosServicosLabel: 'Principais categorias de produtos vendidos na loja ou canais',
      produtosServicosPlaceholder: 'Ex: Vestuário, autopeças, materiais de construção, calçados, cosméticos...',
      maiorDesafioPlaceholder: 'Ex: Ruptura de estoque, dependência do dono no balcão, conferência manual de preços, perdas...'
    },

    // Bloco 2
    b2: {
      ondeContratariaPlaceholder: 'Ex: Vendedores de balcão, Atendimento no WhatsApp, Caixa, Estoque...'
    },

    // Bloco 4
    b4: {
      ondeMaisTravaPlaceholder: 'Ex: Na entrada de mercadorias no estoque, conferência de preços, fechamento do caixa diário...'
    },

    // Bloco 5
    b5: {
      principaisSistemasPlaceholder: 'Ex: Sistema PDV / Caixa, Bling, Tiny, emissor fiscal, WhatsApp, Mercado Livre...'
    },

    // Bloco 6
    b6: {
      titulo: 'Equipe de Loja, Balcão e Vendas em Canais',
      subtitulo: 'Equipe de vendas, fluxo de interessados na loja/WhatsApp e compras fechadas.',
      vendedoresLabel: 'Vendedores de balcão / atendentes de loja ativos',
      vendedoresPlaceholder: 'Ex: 3',
      sdrsLabel: 'Atendentes dedicados ao WhatsApp / redes sociais (se houver)',
      sdrsPlaceholder: 'Ex: 1',
      leadsLabel: 'Quantos clientes entram em contato ou pedem orçamento por mês?',
      leadsPlaceholder: 'Ex: 200',
      vendasLabel: 'Quantas vendas são fechadas por mês?',
      vendasPlaceholder: 'Ex: 140',
      horasAdmLabel: 'Horas por semana gastas com tarefas burocráticas (etiquetar, conferir preços, atualizar planilhas, cadastrar produtos) em vez de vender:'
    },

    // Bloco 7
    b7: {
      titulo: 'Divulgação, Anúncios Locais e Promoções',
      subtitulo: 'Investimento em anúncios nas redes sociais, panfletagem, fachada e promoções.'
    },

    // Bloco 8
    b8: {
      titulo: 'Atendimento ao Cliente, Trocas e Dúvidas',
      subtitulo: 'Volume de mensagens diárias tirando dúvidas de disponibilidade, preço, entrega e trocas.',
      canaisPlaceholder: 'Ex: Balcão presencial, WhatsApp da loja, Instagram Direct'
    },

    // Relatório
    report: {
      comercialTitle: 'Desempenho da Loja e Conversão de Clientes',
      leadsTermo: 'interessados que entram em contato',
      vendasTermo: 'compras concluídas'
    }
  },

  advocacia: {
    id: 'advocacia',
    nome: 'Escritório de Advocacia / Jurídico',
    clienteTermo: 'clientes / causas',
    clienteSingular: 'cliente',
    unidadeVenda: 'novos contratos fechados',

    // Bloco 1
    b1: {
      clientesMesLabel: 'Quantos clientes ativos na carteira do escritório?',
      clientesMesPlaceholder: 'Ex: 90',
      ticketMedioLabel: 'Honorário médio por contrato ou assessoria (R$)',
      ticketMedioPlaceholder: 'Ex: 2500',
      produtosServicosLabel: 'Principais áreas de atuação jurídica',
      produtosServicosPlaceholder: 'Ex: Direito Empresarial, Trabalhista para empresas, Tributário, Cível, Família...',
      maiorDesafioPlaceholder: 'Ex: Prazos apertados, clientes ligando para saber andamento de processo, cobrança manual de honorários...'
    },

    // Bloco 2
    b2: {
      ondeContratariaPlaceholder: 'Ex: Advogados associados, Secretária/Recepção, Estagiários de peças, Controladoria...'
    },

    // Bloco 4
    b4: {
      ondeMaisTravaPlaceholder: 'Ex: Na triagem de novos clientes, elaboração manual de procurações e contratos, conferência de prazos...'
    },

    // Bloco 5
    b5: {
      principaisSistemasPlaceholder: 'Ex: Astrea, SAJ ADV, Projuris, WhatsApp, Google Drive, Planilhas...'
    },

    // Bloco 6
    b6: {
      titulo: 'Atração de Clientes, Consultas e Fechamento de Honorários',
      subtitulo: 'Advogados ou sócios que realizam reuniões e fecham contratos de honorários.',
      vendedoresLabel: 'Advogados ou sócios que realizam consultas e fecham novos clientes',
      vendedoresPlaceholder: 'Ex: 2',
      sdrsLabel: 'Secretárias ou responsáveis pela triagem inicial (se houver)',
      sdrsPlaceholder: 'Ex: 1',
      leadsLabel: 'Quantas consultas ou pessoas procurando assessoria jurídica chegam por mês?',
      leadsPlaceholder: 'Ex: 30',
      vendasLabel: 'Quantos novos contratos de honorários são fechados por mês?',
      vendasPlaceholder: 'Ex: 8',
      horasAdmLabel: 'Horas por semana gastas elaborando minutas repetitivas, cobrando documentos e dados em vez de fechar contratos:'
    },

    // Bloco 7
    b7: {
      titulo: 'Marketing Jurídico, Artigos e Atração',
      subtitulo: 'Investimento em anúncios institucionais, conteúdo jurídico e parcerias.'
    },

    // Bloco 8
    b8: {
      titulo: 'Atendimento a Clientes e Andamento Processual',
      subtitulo: 'Volume de mensagens diárias com clientes solicitando informações sobre o andamento dos processos.',
      canaisPlaceholder: 'Ex: WhatsApp do escritório, Telefone, E-mail'
    },

    // Relatório
    report: {
      comercialTitle: 'Captação e Fechamento de Honorários Advocatícios',
      leadsTermo: 'consultas e contatos jurídicos recebidos',
      vendasTermo: 'contratos de honorários assinados'
    }
  },

  servicos: {
    id: 'servicos',
    nome: 'Prestação de Serviços / Consultoria',
    clienteTermo: 'clientes',
    clienteSingular: 'cliente',
    unidadeVenda: 'projetos / contratos fechados',

    // Bloco 1
    b1: {
      clientesMesLabel: 'Quantos clientes ou contratos ativos atendidos por mês?',
      clientesMesPlaceholder: 'Ex: 40',
      ticketMedioLabel: 'Valor médio por contrato ou projeto (R$)',
      ticketMedioPlaceholder: 'Ex: 3200',
      produtosServicosLabel: 'Principais serviços ou soluções prestadas',
      produtosServicosPlaceholder: 'Ex: Manutenção técnica, consultoria de gestão, projetos de engenharia, TI...',
      maiorDesafioPlaceholder: 'Ex: Montagem manual de propostas, atraso na entrega, desorganização no comercial, planilhas...'
    },

    // Bloco 2
    b2: {
      ondeContratariaPlaceholder: 'Ex: Equipe técnica, Operação, Comercial, Atendimento, Financeiro...'
    },

    // Bloco 4
    b4: {
      ondeMaisTravaPlaceholder: 'Ex: Na emissão e envio de propostas, no início da entrega do serviço, no pós-venda...'
    },

    // Bloco 5
    b5: {
      principaisSistemasPlaceholder: 'Ex: ERP de serviços, emissor de notas fiscais, Trello/Asana, WhatsApp, Planilhas...'
    },

    // Bloco 6
    b6: {
      titulo: 'Comercial, Propostas e Fechamento de Serviços',
      subtitulo: 'Pessoas dedicadas a negociar, emitir propostas e fechar novos clientes.',
      vendedoresLabel: 'Pessoas dedicadas a negociar e fechar novos clientes / projetos',
      vendedoresPlaceholder: 'Ex: 2',
      sdrsLabel: 'Pessoas focadas em qualificação inicial / agendamento (se houver)',
      sdrsPlaceholder: 'Ex: 1',
      leadsLabel: 'Quantos contatos de interessados ou orçamentos chegam por mês?',
      leadsPlaceholder: 'Ex: 40',
      vendasLabel: 'Quantos novos contratos ou projetos são fechados por mês?',
      vendasPlaceholder: 'Ex: 12',
      horasAdmLabel: 'Horas por semana gastas redigitando propostas, atualizando planilhas e cobrando dados em vez de vender:'
    },

    // Bloco 7
    b7: {
      titulo: 'Divulgação, Parcerias e Captação de Clientes',
      subtitulo: 'Investimento em anúncios, indicações de parceiros e presença online.'
    },

    // Bloco 8
    b8: {
      titulo: 'Atendimento, Suporte e Relacionamento',
      subtitulo: 'Volume de mensagens diárias tirando dúvidas de clientes sobre o serviço ou projeto.',
      canaisPlaceholder: 'Ex: WhatsApp, E-mail, Telefone'
    },

    // Relatório
    report: {
      comercialTitle: 'Geração de Propostas e Novos Clientes de Serviços',
      leadsTermo: 'orçamentos e propostas solicitadas',
      vendasTermo: 'contratos de serviços fechados'
    }
  },

  outro: {
    id: 'outro',
    nome: 'Empresa / Negócio Geral',
    clienteTermo: 'clientes',
    clienteSingular: 'cliente',
    unidadeVenda: 'vendas / contratos fechados',

    // Bloco 1
    b1: {
      clientesMesLabel: 'Quantos clientes ou atendimentos são realizados por mês?',
      clientesMesPlaceholder: 'Ex: 60',
      ticketMedioLabel: 'Ticket médio aproximado por venda / cliente (R$)',
      ticketMedioPlaceholder: 'Ex: 2000',
      produtosServicosLabel: 'Principais produtos ou serviços comercializados',
      produtosServicosPlaceholder: 'Ex: Venda de produtos, consultoria, prestação de serviços...',
      maiorDesafioPlaceholder: 'Ex: Falta de tempo dos donos, retrabalho na entrega, desorganização no comercial, planilhas que não batem...'
    },

    // Bloco 2
    b2: {
      ondeContratariaPlaceholder: 'Ex: Atendimento, Vendas, Operação, Financeiro...'
    },

    // Bloco 4
    b4: {
      ondeMaisTravaPlaceholder: 'Ex: Na passagem do cliente para a entrega, na emissão de notas/contratos, no fechamento...'
    },

    // Bloco 5
    b5: {
      principaisSistemasPlaceholder: 'Ex: Sistema de gestão (ERP), WhatsApp, planilhas, emissor de notas fiscais...'
    },

    // Bloco 6 (Sem jargões de startups como SDR, Closer, Lead, CRM sem explicação)
    b6: {
      titulo: 'Comercial, Atendimento e Vendas',
      subtitulo: 'Eficiência da equipe comercial, conversão de interessados e tempo gasto com tarefas burocráticas.',
      vendedoresLabel: 'Pessoas dedicadas a atender, negociar e fechar vendas com clientes',
      vendedoresPlaceholder: 'Ex: 2',
      sdrsLabel: 'Pessoas focadas na triagem inicial / primeiro contato (se houver)',
      sdrsPlaceholder: 'Ex: 1',
      leadsLabel: 'Quantos novos contatos de pessoas interessadas chegam por mês?',
      leadsPlaceholder: 'Ex: 50',
      vendasLabel: 'Quantas vendas ou contratos fechados por mês?',
      vendasPlaceholder: 'Ex: 15',
      horasAdmLabel: 'Horas por semana gastas com tarefas burocráticas (atualizar planilhas, gerar orçamentos manuais, cobrar dados) em vez de vender:'
    },

    // Bloco 7
    b7: {
      titulo: 'Divulgação, Anúncios e Atração de Clientes',
      subtitulo: 'Investimento em anúncios, redes sociais, indicações e parcerias.'
    },

    // Bloco 8
    b8: {
      titulo: 'Atendimento, Suporte e Dúvidas de Clientes',
      subtitulo: 'Volume de mensagens diárias tirando dúvidas de clientes sobre produtos, serviços e pedidos.',
      canaisPlaceholder: 'Ex: WhatsApp, E-mail, Telefone, Presencial'
    },

    // Relatório
    report: {
      comercialTitle: 'Eficiência Comercial e Conversão de Novos Clientes',
      leadsTermo: 'novos contatos de interessados',
      vendasTermo: 'vendas e contratos fechados'
    }
  }
};

// Mapeamento dos novos segmentos para categorias base (reaproveita configs existentes)
export const NICHO_CATEGORY_MAP = {
  // Agro e Alimentos -> industria
  agronegocio: 'industria',
  alimentos_bebidas: 'industria',
  restaurante_bar: 'servicos',

  // Construção
  construcao_civil: 'servicos',
  engenharia_arquitetura: 'servicos',
  materiais_construcao: 'comercio_varejo',

  // Automotivo
  automotivo_oficina: 'servicos',
  concessionaria: 'comercio_varejo',
  transporte_logistica: 'servicos',

  // Educação
  escola_curso: 'servicos',
  treinamento_corporativo: 'servicos',

  // Tecnologia
  software_saas: 'servicos',
  ti_servicos: 'servicos',
  ecommerce_marketplace: 'comercio_varejo',
  marketing_digital: 'servicos',

  // Financeiro
  corretora_seguros: 'servicos',
  fintech_servicos_financeiros: 'servicos',
  assessoria_investimentos: 'servicos',

  // Imobiliário
  imobiliaria: 'servicos',
  incorporadora_imobiliaria: 'industria',

  // Saúde e bem-estar
  academia_personal: 'servicos',
  farmacia_drogaria: 'comercio_varejo',
  veterinario_petshop: 'comercio_varejo',

  // Serviços especializados
  escritorio_engenharia: 'servicos',
  despachante_documentacao: 'servicos',
  condominio_facilities: 'servicos',

  // Indústria específica
  textil_confeccao: 'industria',
  moveis_marcenaria: 'industria',
  metalurgica_usinagem: 'industria',
  quimica_cosmeticos: 'industria',

  // Serviços pessoais
  salao_beleza: 'servicos',
  servicos_domesticos: 'servicos',
  eventos_cerimonial: 'servicos',

  // Comércio especializado
  atacado_distribuidor: 'comercio_varejo',
  franquia_franqueadora: 'servicos'
};

// Configs extras com overrides específicos por segmento
export const NICHO_OVERRIDES = {
  restaurante_bar: {
    b1: {
      clientesMesLabel: 'Quantas pessoas são atendidas por mês no restaurante?',
      clientesMesPlaceholder: 'Ex: 3000',
      ticketMedioLabel: 'Ticket médio por mesa ou pedido (R$)',
      ticketMedioPlaceholder: 'Ex: 90',
      produtosServicosLabel: 'Principais pratos, categorias ou estilo de comida oferecidos',
      produtosServicosPlaceholder: 'Ex: Almoço executivo, rodízio, marmitas, coquetelaria...',
      maiorDesafioPlaceholder: 'Ex: Controle de estoque da cozinha, rotatividade de equipe, fila no horário de pico, desperdício de comida...'
    },
    b5: {
      principaisSistemasPlaceholder: 'Ex: iFood, sistema de PDV, controle de estoque, delivery próprio, planilhas...'
    },
    report: {
      comercialTitle: 'Ocupação de Mesas e Giro do Restaurante',
      leadsTermo: 'reservas e pedidos recebidos',
      vendasTermo: 'comandas fechadas'
    }
  },
  ecommerce_marketplace: {
    b1: {
      clientesMesLabel: 'Quantas vendas on-line são concluídas por mês?',
      clientesMesPlaceholder: 'Ex: 800',
      ticketMedioLabel: 'Ticket médio por pedido on-line (R$)',
      ticketMedioPlaceholder: 'Ex: 150',
      produtosServicosLabel: 'Principais produtos ou categorias vendidos on-line',
      produtosServicosPlaceholder: 'Ex: Roupas, eletrônicos, cosméticos, acessórios...',
      maiorDesafioPlaceholder: 'Ex: Custo de anúncios subindo, devoluções, estoque descompasso entre canais, avaliações negativas...'
    },
    b5: {
      principaisSistemasPlaceholder: 'Ex: Shopify, Nuvemshop, Mercado Livre, Bling, Tiny, Tiny ERP, RD Station...'
    },
    report: {
      comercialTitle: 'Performance das Vendas On-line',
      leadsTermo: 'visitas e carrinhos abandonados',
      vendasTermo: 'pedidos concluídos'
    }
  },
  software_saas: {
    b1: {
      clientesMesLabel: 'Quantos clientes ativos (assinantes) possui?',
      clientesMesPlaceholder: 'Ex: 350',
      ticketMedioLabel: 'Receita média mensal por cliente (MRR) (R$)',
      ticketMedioPlaceholder: 'Ex: 297',
      produtosServicosLabel: 'Principais módulos ou soluções do software',
      produtosServicosPlaceholder: 'Ex: ERP para clínicas, CRM imobiliário, gestão de frota...',
      maiorDesafioPlaceholder: 'Ex: Churn (cancelamentos), onboarding manual, suporte repetitivo, vendas longas...'
    },
    report: {
      comercialTitle: 'Aquisição e Retenção de Assinantes',
      leadsTermo: 'demos e trial iniciados',
      vendasTermo: 'assinaturas ativas'
    }
  },
  academia_personal: {
    b1: {
      clientesMesLabel: 'Quantos alunos / alunos ativos possui?',
      clientesMesPlaceholder: 'Ex: 420',
      ticketMedioLabel: 'Mensalidade média por aluno (R$)',
      ticketMedioPlaceholder: 'Ex: 159',
      produtosServicosLabel: 'Principais modalidades e serviços oferecidos',
      produtosServicosPlaceholder: 'Ex: Musculação, funcional, pilates, personal, crossfit...',
      maiorDesafioPlaceholder: 'Ex: Inadimplência, evasão de alunos, ocupação baixa em horários mortos, captação cara...'
    },
    report: {
      comercialTitle: 'Matrículas, Evasão e Ocupação',
      leadsTermo: 'contatos de matrícula',
      vendasTermo: 'matrículas e renovações'
    }
  },
  imobiliaria: {
    b1: {
      clientesMesLabel: 'Quantas locações ou vendas são fechadas por mês?',
      clientesMesPlaceholder: 'Ex: 20',
      ticketMedioLabel: 'Comissão média por negócio fechado (R$)',
      ticketMedioPlaceholder: 'Ex: 4500',
      produtosServicosLabel: 'Principais tipos de imóveis e serviços',
      produtosServicosPlaceholder: 'Ex: Locação residencial, venda de apartamentos, administracão condominial...',
      maiorDesafioPlaceholder: 'Ex: Leads frios, vistorias manuais, cobrança de aluguel, vacância...'
    },
    report: {
      comercialTitle: 'Funil de Vendas Imobiliárias',
      leadsTermo: 'leads de imóveis',
      vendasTermo: 'negócios fechados'
    }
  },
  corretora_seguros: {
    b1: {
      clientesMesLabel: 'Quantas apólices são contratadas ou renovadas por mês?',
      clientesMesPlaceholder: 'Ex: 60',
      ticketMedioLabel: 'Comissão média por apólice (R$)',
      ticketMedioPlaceholder: 'Ex: 350',
      produtosServicosLabel: 'Principais ramos de seguros comercializados',
      produtosServicosPlaceholder: 'Ex: Auto, residencial, empresarial, saúde, vida...',
      maiorDesafioPlaceholder: 'Ex: Renovações atrasadas, clientes saindo para concorrente, prospecção difícil, burocracia da corretora...'
    },
    report: {
      comercialTitle: 'Contratações e Renovações de Apólices',
      leadsTermo: 'cotações solicitadas',
      vendasTermo: 'apólices contratadas'
    }
  },
  escola_curso: {
    b1: {
      clientesMesLabel: 'Quantos alunos ativos possui?',
      clientesMesPlaceholder: 'Ex: 500',
      ticketMedioLabel: 'Mensalidade ou valor médio do curso (R$)',
      ticketMatriculaPlaceholder: 'Ex: 380',
      ticketMedioPlaceholder: 'Ex: 380',
      produtosServicosLabel: 'Principais cursos ou modalidades oferecidas',
      produtosServicosPlaceholder: 'Ex: Curso técnico, idiomas, preparatório, EAD, pós-graduação...',
      maiorDesafioPlaceholder: 'Ex: Matrículas no fim do semestre, evasão, rematrículas manuais, agenda de turmas...'
    },
    report: {
      comercialTitle: 'Matrículas e Evasão de Alunos',
      leadsTermo: 'interessados em cursos',
      vendasTermo: 'matrículas realizadas'
    }
  },
  construcao_civil: {
    b1: {
      clientesMesLabel: 'Quantas obras ou projetos ativos possui?',
      clientesMesPlaceholder: 'Ex: 8',
      ticketMedioLabel: 'Valor médio por obra ou projeto (R$)',
      ticketMedioPlaceholder: 'Ex: 120000',
      produtosServicosLabel: 'Principais tipos de obra ou serviço executado',
      produtosServicosPlaceholder: 'Ex: Reforma residencial, obra comercial, projetos elétricos...',
      maiorDesafioPlaceholder: 'Ex: Atraso de obra, compras de material, medições manuais, aditivos de contrato...'
    },
    report: {
      comercialTitle: 'Obras Ativas e Conversão de Oportunidades',
      leadsTermo: 'orçamentos solicitados',
      vendasTermo: 'obras/ projetos fechados'
    }
  }
};

export const getNichoConfig = (nichoId) => {
  const { blocks, report: reportLanguage } = buildSegmentLanguage(nichoId, NICHO_CATEGORY_MAP);

  const withLanguage = (config) => ({
    ...config,
    b3: { ...config.b3, ...blocks.b3 },
    b9: { ...config.b9, ...blocks.b9 },
    b10: { ...config.b10, ...blocks.b10 },
    b11: { ...config.b11, ...blocks.b11 },
    b12: { ...config.b12, ...blocks.b12 },
    report: { ...config.report, ...reportLanguage }
  });

  // 1. Config direto existe?
  if (NICHOS_CONFIG[nichoId]) return withLanguage(NICHOS_CONFIG[nichoId]);

  // 2. Tem override específico?
  if (NICHO_OVERRIDES[nichoId]) {
    const categoryId = NICHO_CATEGORY_MAP[nichoId] || 'outro';
    const base = NICHOS_CONFIG[categoryId];
    const override = NICHO_OVERRIDES[nichoId];
    return withLanguage({
      ...base,
      ...override,
      b1: { ...base.b1, ...override.b1 },
      b2: { ...base.b2, ...override.b2 },
      b4: { ...base.b4, ...override.b4 },
      b5: { ...base.b5, ...override.b5 },
      b6: { ...base.b6, ...override.b6 },
      b7: { ...base.b7, ...override.b7 },
      b8: { ...base.b8, ...override.b8 },
      report: { ...base.report, ...override.report }
    });
  }

  // 3. Mapeia para categoria base
  const categoryId = NICHO_CATEGORY_MAP[nichoId];
  if (categoryId && NICHOS_CONFIG[categoryId]) return withLanguage(NICHOS_CONFIG[categoryId]);

  // 4. Fallback
  return withLanguage(NICHOS_CONFIG.outro);
};
