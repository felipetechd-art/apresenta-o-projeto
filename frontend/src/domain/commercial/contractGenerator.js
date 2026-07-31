import { getCommercialOffer, COMMERCIAL_OFFERS } from './commercialOffer.js';

/**
 * Converte um valor formatado em BRL (ex: "45.000,00" ou "R$ 45.000,00") para número.
 * @param {string} value
 * @returns {number}
 */
function getNumericValue(value) {
  if (!value) return 0;
  const cleaned = String(value).replace(/[R$\s.]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

/**
 * Gera o HTML do contrato e dispara o download como .doc.
 * 
 * Recebe um objeto com os dados do cliente (pode vir do state da Presentation
 * ou dos dados salvos no draft da Gestão de Clientes).
 * 
 * @param {Object} params
 * @param {string} params.clientName
 * @param {string} params.docNumber
 * @param {string} params.personType - 'PF' | 'PJ'
 * @param {string} params.repName
 * @param {string} params.clientAddress
 * @param {string} params.totalInvestment - Valor formatado em BRL (ex: "45.000,00")
 * @param {string} params.entranceValue - Valor formatado em BRL
 * @param {string|number} params.installments
 * @param {string} params.paymentMethod - 'credit' | 'pix'
 * @param {string} params.contractForo
 * @param {string} params.consultantEmail
 * @param {string} [params.contractDate] - Data ISO opcional; se ausente, usa a data atual.
 */
export function downloadContract({
  clientName = '',
  docNumber = '',
  personType = 'PJ',
  repName = '',
  clientAddress = '',
  totalInvestment = '0',
  entranceValue = '0',
  installments = '1',
  paymentMethod = 'credit',
  contractForo = 'Barueri/SP',
  consultantEmail = '',
  contractDate = null,
}) {
  const today = contractDate ? new Date(contractDate) : new Date();
  const dateStr = today.toLocaleDateString('pt-BR');

  const investmentVal = getNumericValue(totalInvestment);
  const offerConfig = getCommercialOffer(Math.round(investmentVal * 100));
  const entranceVal = getNumericValue(entranceValue);
  const balanceVal = Math.max(0, investmentVal - entranceVal);
  const instCount = parseInt(installments) || 1;
  const instValue = instCount > 0 ? (balanceVal / instCount) : 0;

  const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const fmtTotal = fmt(investmentVal);
  const fmtEntrance = fmt(entranceVal);
  const fmtBalance = fmt(balanceVal);
  const fmtInst = fmt(instValue);

  const cardSuffix = paymentMethod === 'pix' ? 'PIX' : 'Cartão de Crédito (mais juros da plataforma)';
  const paymentLine = entranceVal > 0
    ? `[ ] Integral [X] Entrada de ${fmtEntrance} + saldo de ${fmtBalance} em ${instCount} parcelas de ${fmtInst} no ${cardSuffix}`
    : `[X] Integral de ${fmtTotal} no ${cardSuffix} [ ] Entrada + Saldo`;

  const contratanteLabel = personType === 'PF'
    ? `${clientName} - CPF: ${docNumber}`
    : `${clientName} - CNPJ: ${docNumber}`;

  const contratanteQualif = personType === 'PF'
    ? `${clientName.toUpperCase()}, inscrito(a) no CPF sob nº ${docNumber}, com endereço em ${clientAddress || '[PREENCHER]'}, doravante denominada "CONTRATANTE".`
    : `${clientName.toUpperCase()}, inscrita no CNPJ sob nº ${docNumber}, com sede em ${clientAddress || '[PREENCHER]'}, representada por ${repName || '[NOME DO REPRESENTANTE]'}, doravante denominada "CONTRATANTE".`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Contrato PGE - ${clientName}</title>
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
    <td>${offerConfig.contractDescription}</td>
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
    <td>${paymentLine}</td>
  </tr>
  <tr>
    <td><strong>Vencimentos</strong></td>
    <td>Entrada em ${dateStr} e saldo subsequente conforme faturamento do método escolhido.</td>
  </tr>
  <tr>
    <td><strong>Foro</strong></td>
    <td>${contractForo || 'Barueri/SP'}</td>
  </tr>
</table>

<p><strong>1. PARTES E ACEITE</strong></p>
<p><strong>CONTRATANTE:</strong> ${contratanteQualif}</p>
<p><strong>CONTRATADA:</strong> PEO CONSULTING PRESTACAO DE SERVICOS LTDA, inscrita no CNPJ sob nº 54.765.988/0001-09, com sede em Rua Marte, 429, Cruz Preta, CEP 06414-000, Barueri, São Paulo, representada por Felipe Rodrigues Damasceno, inscrito no CPF sob o nº 309.750.998-41, doravante denominada "CONTRATADA".</p>
<p>A assinatura deste instrumento ou o pagamento do valor integral ou da entrada indicada no Quadro da Contratação, o que ocorrer primeiro, representa aceite expresso de todas as condições e torna este Contrato válido e eficaz entre as Partes.</p>

<p><strong>2. OBJETO E ESCOPO</strong></p>
<p>A CONTRATADA prestará serviços de consultoria combinados com implementação, execução e acompanhamento das ações acordadas para o projeto.</p>
<p>O escopo específico é aquele definido pelas Partes na reunião virtual indicada no Quadro da Contratação. A gravação, o resumo da reunião, propostas, mensagens e confirmações escritas relacionadas ao projeto poderão ser reunidos posteriormente no Anexo I e passam a integrar este Contrato como prova do que foi combinado.</p>
<p>Solicitações que não estejam claramente compreendidas no escopo acordado serão consideradas serviços adicionais e dependerão de nova aprovação comercial.</p>

<p><strong>ENTREGÁVEIS DO PROJETO</strong></p>
${(offerConfig.deliverableGroups || COMMERCIAL_OFFERS[offerConfig.baseProgram].deliverableGroups).map(g => `<p><strong>${g.title}:</strong> ${g.description}</p><ul>${g.items.map(item => `<li>${item}</li>`).join('')}</ul>`).join('')}
${offerConfig.additionalDeliverables ? offerConfig.additionalDeliverables.map(g => `<p><strong>${g.title}:</strong> ${g.description}</p><ul>${g.items.map(item => `<li>${item}</li>`).join('')}</ul>`).join('') : ''}

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

<p>${contractForo || 'Barueri/SP'}, ${dateStr}.</p>

<table class="signature-table">
  <tr>
    <td style="width: 50%;">
      ________________________________________<br/>
      <strong>CONTRATANTE</strong><br/>
      Nome/Razão Social: ${clientName}<br/>
      Representante: ${personType === 'PJ' ? repName : clientName}<br/>
      CPF/CNPJ: ${docNumber}
    </td>
    <td style="width: 50%;">
      ________________________________________<br/>
      <strong>CONTRATADA</strong><br/>
      PEO CONSULTING PRESTACAO DE SERVICOS LTDA<br/>
      Representante: Felipe Rodrigues Damasceno<br/>
      CPF/CNPJ: 309.750.998-41 / 54.765.988/0001-09
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
  link.download = `contrato_pge_${clientName.replace(/\s+/g, '_').toLowerCase() || 'cliente'}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
