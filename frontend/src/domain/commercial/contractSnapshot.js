import { getCommercialOffer, COMMERCIAL_OFFERS } from './commercialOffer.js';

export function validateContractData(data) {
  const missingFields = [];
  const errors = [];

  const required = [
    { key: 'clientName', label: 'Nome do Cliente' },
    { key: 'docNumber', label: 'Documento (CPF/CNPJ)' },
    { key: 'personType', label: 'Tipo de Pessoa (PF/PJ)' },
    { key: 'clientAddress', label: 'Endereço do Cliente' },
    { key: 'contractForo', label: 'Foro do Contrato' },
    { key: 'totalInvestment', label: 'Investimento Total' },
    { key: 'entranceValue', label: 'Valor de Entrada' },
    { key: 'installments', label: 'Número de Parcelas' },
    { key: 'paymentMethod', label: 'Método de Pagamento' },
  ];

  for (const field of required) {
    if (data[field.key] == null || String(data[field.key]).trim() === '') {
      missingFields.push(field.key);
      errors.push(`Campo obrigatório ausente: ${field.label}`);
    }
  }

  // Additional validation could be added here (e.g. doc formatting, value > 0)
  return {
    valid: errors.length === 0,
    missingFields,
    errors
  };
}

function getNumericValue(value) {
  if (!value) return 0;
  const cleaned = String(value).replace(/[R$\s.]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

export function buildContractSnapshot(source) {
  const investmentVal = getNumericValue(source.totalInvestment);
  const investmentInCents = Math.round(investmentVal * 100);
  const offerConfig = getCommercialOffer(investmentInCents);

  const entranceVal = getNumericValue(source.entranceValue);
  const entranceCents = Math.round(entranceVal * 100);
  const balanceVal = Math.max(0, investmentVal - entranceVal);
  const balanceCents = Math.round(balanceVal * 100);
  
  const instCount = parseInt(source.installments) || 1;
  const instValue = instCount > 0 ? (balanceVal / instCount) : 0;
  const instCents = Math.round(instValue * 100);

  const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const fmtTotal = fmt(investmentVal);
  const fmtEntrance = fmt(entranceVal);
  const fmtBalance = fmt(balanceVal);
  const fmtInst = fmt(instValue);

  const cardSuffix = source.paymentMethod === 'pix' ? 'PIX' : 'Cartão de Crédito (mais juros da plataforma)';
  const paymentLine = entranceVal > 0
    ? `[ ] Integral [X] Entrada de ${fmtEntrance} + saldo de ${fmtBalance} em ${instCount} parcelas de ${fmtInst} no ${cardSuffix}`
    : `[X] Integral de ${fmtTotal} no ${cardSuffix} [ ] Entrada + Saldo`;

  const dateStr = source.contractDate ? new Date(source.contractDate).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR');

  // Build deliverables snapshot (HTML string or structured data; we'll store HTML chunks for the contract)
  const baseGroups = offerConfig.deliverableGroups || COMMERCIAL_OFFERS[offerConfig.baseProgram].deliverableGroups;
  const deliverableHtml1 = baseGroups.map(g => `<p><strong>${g.title}:</strong> ${g.description}</p><ul>${g.items.map(item => `<li>${item}</li>`).join('')}</ul>`).join('');
  const deliverableHtml2 = offerConfig.additionalDeliverables ? offerConfig.additionalDeliverables.map(g => `<p><strong>${g.title}:</strong> ${g.description}</p><ul>${g.items.map(item => `<li>${item}</li>`).join('')}</ul>`).join('') : '';
  const deliverablesSnapshot = deliverableHtml1 + deliverableHtml2;

  return {
    contractVersion: '1.0',
    presentationSessionId: source.presentationSessionId || null,
    companyId: 'PEO',
    clientName: source.clientName || '',
    clientEmail: source.clientEmail || '',
    clientPhone: source.clientPhone || '',
    personType: source.personType || null,
    clientDocument: source.docNumber || '',
    clientAddress: source.clientAddress || '',
    repName: source.repName || '',
    companyName: 'PEO CONSULTING PRESTACAO DE SERVICOS LTDA',
    companyDocument: '309.750.998-41 / 54.765.988/0001-09',
    contractForo: source.contractForo || null,
    contractDate: new Date().toISOString(),
    programType: offerConfig.type,
    programName: offerConfig.programName,
    programCategory: offerConfig.type,
    programDuration: offerConfig.durationMonths || offerConfig.totalStrategicMonths,
    programDescription: offerConfig.contractDescription,
    officialInvestmentCents: investmentInCents,
    negotiatedInvestmentCents: investmentInCents,
    downPaymentCents: entranceCents,
    remainingBalanceCents: balanceCents,
    paymentMethod: source.paymentMethod || null,
    installmentCount: instCount,
    installmentValueCents: instCents,
    paymentDescription: paymentLine,
    deliverablesSnapshot: deliverablesSnapshot,
    commercialConditionsSnapshot: JSON.stringify(source), // store original source just in case
    createdAt: new Date().toISOString()
  };
}

export function downloadContractFromSnapshot(snapshot) {
  const dateStr = new Date(snapshot.contractDate).toLocaleDateString('pt-BR');
  
  const fmtCents = (cents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((cents || 0) / 100);
  const fmtTotal = fmtCents(snapshot.negotiatedInvestmentCents);

  const contratanteLabel = snapshot.personType === 'PF'
    ? `${snapshot.clientName} - CPF: ${snapshot.clientDocument}`
    : `${snapshot.clientName} - CNPJ: ${snapshot.clientDocument}`;

  const contratanteQualif = snapshot.personType === 'PF'
    ? `${snapshot.clientName.toUpperCase()}, inscrito(a) no CPF sob nº ${snapshot.clientDocument}, com endereço em ${snapshot.clientAddress || '[PREENCHER]'}, doravante denominada "CONTRATANTE".`
    : `${snapshot.clientName.toUpperCase()}, inscrita no CNPJ sob nº ${snapshot.clientDocument}, com sede em ${snapshot.clientAddress || '[PREENCHER]'}, representada por ${snapshot.repName || '[NOME DO REPRESENTANTE]'}, doravante denominada "CONTRATANTE".`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Contrato PGE - ${snapshot.clientName}</title>
<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #000; padding: 20px; }
  h1, h2, h3 { text-align: center; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 12px; }
  th { background-color: #f2f2f2; }
  .signature-table td { border: none; height: 80px; vertical-align: bottom; }
</style>
</head>
<body>

<h3>CONTRATO GERAL DE PRESTAÇÃO DE SERVIÇOS</h3>
<h4>CONSULTORIA + IMPLEMENTAÇÃO</h4>

<h2>QUADRO DA CONTRATAÇÃO</h2>
<table>
  <tr>
    <th>CAMPO</th>
    <th>INFORMACAO</th>
  </tr>
  <tr>
    <td><strong>Contratante</strong></td>
    <td>${contratanteLabel}</td>
  </tr>
  <tr>
    <td><strong>Projeto / referência</strong></td>
    <td>${snapshot.programDescription}</td>
  </tr>
  <tr>
    <td><strong>Reunião de definição</strong></td>
    <td>${dateStr}, ambiente de alinhamento estratégico PGE</td>
  </tr>
  <tr>
    <td><strong>Investimento total</strong></td>
    <td>${fmtTotal}</td>
  </tr>
  <tr>
    <td><strong>Pagamento</strong></td>
    <td>${snapshot.paymentDescription}</td>
  </tr>
  <tr>
    <td><strong>Vencimentos</strong></td>
    <td>Entrada em ${dateStr} e saldo subsequente conforme faturamento do método escolhido.</td>
  </tr>
  <tr>
    <td><strong>Foro</strong></td>
    <td>${snapshot.contractForo || 'Barueri/SP'}</td>
  </tr>
</table>

<p><strong>1. PARTES E ACEITE</strong></p>
<p><strong>CONTRATANTE:</strong> ${contratanteQualif}</p>
<p><strong>CONTRATADA:</strong> ${snapshot.companyName}, inscrita no CNPJ sob nº 54.765.988/0001-09, com sede em Rua Marte, 429, Cruz Preta, CEP 06414-000, Barueri, São Paulo, representada por Felipe Rodrigues Damasceno, inscrito no CPF sob o nº 309.750.998-41, doravante denominada "CONTRATADA".</p>
<p>A assinatura deste instrumento ou o pagamento do valor integral ou da entrada indicada no Quadro da Contratação, o que ocorrer primeiro, representa aceite expresso de todas as condições e torna este Contrato válido e eficaz entre as Partes.</p>

<p><strong>2. OBJETO E ESCOPO</strong></p>
<p>A CONTRATADA prestará serviços de consultoria combinados com implementação, execução e acompanhamento das ações acordadas para o projeto.</p>
<p>O escopo específico é aquele definido pelas Partes na reunião virtual indicada no Quadro da Contratação. A gravação, o resumo da reunião, propostas, mensagens e confirmações escritas relacionadas ao projeto poderão ser reunidos posteriormente no Anexo I e passam a integrar este Contrato como prova do que foi combinado.</p>
<p>Solicitações que não estejam claramente compreendidas no escopo acordado serão consideradas serviços adicionais e dependerão de nova aprovação comercial.</p>

<p><strong>ENTREGÁVEIS DO PROJETO</strong></p>
${snapshot.deliverablesSnapshot}

<p><strong>3. VIGÊNCIA E EXECUÇÃO</strong></p>
<p>Este Contrato não possui prazo global fixo. Ele permanecerá vigente até a conclusão dos serviços acordados ou até seu encerramento na forma da Cláusula 7. Datas e previsões informadas durante o projeto são estimativas e podem ser ajustadas conforme complexidade, aprovações, informações, acessos e dependências da CONTRATANTE ou de terceiros.</p>

<p><strong>4. RESPONSABILIDADES DAS PARTES</strong></p>
<p>A CONTRATADA deverá executar o escopo com diligência profissional, manter comunicação sobre o andamento e preservar a confidencialidade das informações recebidas.</p>
<p>A CONTRATANTE deverá fornecer informações, conteúdos, acessos e aprovações necessários; indicar um responsável pelas decisões; e realizar os pagamentos nas condições combinadas. Atrasos ou omissões da CONTRATANTE poderão suspender ou reprogramar a execução sem caracterizar falha da CONTRATADA.</p>

<p><strong>5. PAGAMENTO E INADIMPLÊNCIA</strong></p>
<p>O investimento, a entrada, o saldo e os vencimentos são os definidos no Quadro da Contratação. O pagamento da entrada autoriza o início da mobilização, da consultoria e da implementação.</p>
<p>Em caso de atraso, poderão incidir multa de 2% sobre a parcela vencida e juros de 1% ao mês, calculados proporcionalmente. A CONTRATADA poderá suspender os serviços enquanto houver valor vencido, retomando-os após a regularização conforme disponibilidade operacional.</p>

<p><strong>6. SERVIÇOS ENTREGUES, APROVAÇÕES E RESULTADOS</strong></p>
<p>Reuniões realizadas, diagnósticos, estratégias, documentos, materiais, configurações, acessos, ativos e implementações já apresentados ou disponibilizados serão considerados serviços entregues. A CONTRATANTE deverá informar eventuais divergências objetivas em prazo razoável, permitindo sua correção quando estiverem dentro do escopo.</p>
<p>A prestação constitui obrigação de meio. A CONTRATADA não garante faturamento, vendas, audiência, aprovação de plataformas, desempenho comercial ou qualquer resultado que dependa de decisões da CONTRATANTE, mercado, mídia, tecnologia ou terceiros.</p>

<p><strong>7. CANCELAMENTO, QUEBRA CONTRATUAL E MULTA</strong></p>
<p>O Contrato poderá ser encerrado por acordo escrito, conclusão do escopo, desistência ou descumprimento contratual. Quando houver descumprimento corrigível, a Parte inadimplente deverá ser notificada e terá 5 (cinco) dias úteis para regularização.</p>
<p>A Parte que causar o encerramento injustificado do Contrato, por desistência ou quebra contratual, pagará à outra multa equivalente a 30% (trinta por cento) do valor restante do contrato, entendido como o valor correspondente aos serviços que ainda não tiverem sido entregues na data do encerramento, observados os limites legais.</p>
<p>Os valores correspondentes aos serviços já entregues não serão reembolsados. Valores pagos antecipadamente relativos a serviços ainda não entregues serão devolvidos de forma proporcional, após a compensação de valores vencidos, custos já autorizados e da multa aplicável.</p>
<p>Se o encerramento injustificado for causado pela CONTRATADA, ela devolverá os valores recebidos pelos serviços não entregues e pagará à CONTRATANTE a multa prevista nesta cláusula. Se for causado pela CONTRATANTE, a multa poderá ser descontada de eventual valor a devolver ou cobrada separadamente.</p>

<p><strong>8. CONFIDENCIALIDADE, LGPD E PROPRIEDADE INTELECTUAL</strong></p>
<p>As Partes manterão sigilo sobre estratégias, documentos, dados, credenciais, gravações e demais informações não públicas recebidas durante o projeto, utilizando-as somente para executar este Contrato.</p>
<p>Cada Parte tratará dados pessoais conforme a Lei Geral de Proteção de Dados - LGPD, adotando medidas razoáveis de segurança e comunicando incidentes relevantes. A gravação das reuniões poderá ser utilizada para registrar o escopo, acompanhar o projeto e comprovar alinhamentos contratuais.</p>
<p>Após a quitação integral, a CONTRATANTE poderá utilizar os materiais personalizados produzidos especificamente para o projeto. Permanecem de titularidade da CONTRATADA seus métodos, modelos, processos, ferramentas, códigos, bibliotecas, estruturas e conhecimentos preexistentes, bem como ativos sujeitos a licenças de terceiros.</p>

<p><strong>9. TERCEIROS E DESPESAS EXTERNAS</strong></p>
<p>Custos de plataformas, licenças, hospedagem, mídia, tráfego, APIs, inteligência artificial, domínios, gateways e outros fornecedores não estão incluídos, salvo indicação expressa no escopo ou no Quadro da Contratação. A CONTRATADA não responde por falhas, alterações, bloqueios ou indisponibilidades causadas por terceiros.</p>

<p><strong>10. COMUNICAÇÕES, ASSINATURA E FORO</strong></p>
<p>E-mails, mensagens em canais oficiais, gravações, comprovantes de pagamento, documentos e assinaturas eletrônicas poderão comprovar aprovações, entregas, alterações e demais comunicações entre as Partes.</p>
<p>Este Contrato não cria sociedade, representação comercial, vínculo trabalhista ou exclusividade entre as Partes. Alterações relevantes deverão ser registradas por escrito.</p>
<p>Fica eleito o foro indicado no Quadro da Contratação, ressalvadas as regras legais obrigatórias. As Partes reconhecem a validade da assinatura eletrônica e do aceite por pagamento previsto neste instrumento.</p>

<p>E, por estarem de acordo, as Partes assinam este instrumento.</p>

<p>${snapshot.contractForo || 'Barueri/SP'}, ${dateStr}.</p>

<table class="signature-table">
  <tr>
    <td style="width: 50%;">
      ________________________________________<br/>
      <strong>CONTRATANTE</strong><br/>
      Nome/Razão Social: ${snapshot.clientName}<br/>
      Representante: ${snapshot.personType === 'PJ' ? snapshot.repName : snapshot.clientName}<br/>
      CPF/CNPJ: ${snapshot.clientDocument}
    </td>
    <td style="width: 50%;">
      ________________________________________<br/>
      <strong>CONTRATADA</strong><br/>
      ${snapshot.companyName}<br/>
      Representante: Felipe Rodrigues Damasceno<br/>
      CPF/CNPJ: ${snapshot.companyDocument}
    </td>
  </tr>
</table>

</body>
</html>
`;

  const blob = new Blob([htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `contrato_pge_${(snapshot.clientName || '').replace(/\s+/g, '_').toLowerCase() || 'cliente'}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function handleClientContractDownload(clientData, confirmFn, alertFn, deps) {
  const snapshot = clientData?.contractSnapshot;
  if (snapshot) {
    deps.downloadContractFromSnapshot(snapshot);
  } else {
    if (confirmFn('Este cliente foi cadastrado antes da criação do snapshot contratual. Revise os dados antes de gerar o documento.')) {
      const ci = clientData?.clientInfo || {};
      const cd = clientData?.contractData || {};
      
      const legacyData = {
        clientName: ci.name || clientData?.name || '',
        docNumber: ci.docNumber || '',
        personType: cd.personType ?? null,
        repName: ci.repName || '',
        clientAddress: ci.clientAddress || '',
        totalInvestment: cd.totalInvestment || '0',
        entranceValue: cd.entranceValue || '0',
        installments: cd.installments || '1',
        paymentMethod: cd.paymentMethod ?? null,
        contractForo: cd.contractForo ?? null,
        consultantEmail: cd.consultant || '',
        contractDate: cd.startDate || null,
      };

      const validation = deps.validateContractData(legacyData);
      if (!validation.valid) {
        alertFn('Dados incompletos para geração de contrato:\\n' + validation.errors.join('\\n'));
        return;
      }
      deps.downloadContract(legacyData);
    }
  }
}
