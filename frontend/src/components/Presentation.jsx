import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Users,
  Layers,
  Activity,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Target,
  Award,
  Sparkles,
  Phone,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Briefcase,
  Play,
  RotateCcw,
  Layout
} from 'lucide-react';
import felipeImg from '../assets/felipe.jpg';

const formatBRLInput = (value) => {
  if (value === undefined || value === null) return '';
  const cleanValue = String(value).replace(/\D/g, '');
  if (!cleanValue) return '';
  const numberValue = parseFloat(cleanValue) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numberValue);
};

const getNumericValue = (formattedValue) => {
  if (!formattedValue) return 0;
  const cleanValue = String(formattedValue).replace(/\D/g, '');
  return parseFloat(cleanValue) / 100;
};

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [slideDirection, setSlideDirection] = useState('next'); // 'next' or 'prev'
  const [radius, setRadius] = useState(165);
  const [activeLayer, setActiveLayer] = useState(0);
  const [activeNode, setActiveNode] = useState(0);
  const [hourlyRate, setHourlyRate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [strategicPercent, setStrategicPercent] = useState('20');
  const [annualGrowth, setAnnualGrowth] = useState('80');
  const [growthFromStrategy, setGrowthFromStrategy] = useState('50');
  const [calcState, setCalcState] = useState('idle'); // 'idle' | 'calculating' | 'done'
  const [calculatedOpportunityCost, setCalculatedOpportunityCost] = useState(0);
  const [calculatedStrategicInvestment, setCalculatedStrategicInvestment] = useState(0);
  const [calculatedActualReturn, setCalculatedActualReturn] = useState(0);
  const [calculatedLostGrowth, setCalculatedLostGrowth] = useState(0);
  
  // Slide 6 Calculator states
  const [delegatedTasks, setDelegatedTasks] = useState('10');
  const [returningTasks, setReturningTasks] = useState('7');
  const [reworkHours, setReworkHours] = useState('2');
  const [slide6CalcState, setSlide6CalcState] = useState('idle'); // 'idle' | 'calculating' | 'done'
  const [slide6HoursLost, setSlide6HoursLost] = useState(0);
  const [slide6TimeDrainPercent, setSlide6TimeDrainPercent] = useState(0);
  const [slide6MonthlyLoss, setSlide6MonthlyLoss] = useState(0);
  const [slide6AutonomyPercent, setSlide6AutonomyPercent] = useState(0);

  // Slide 10 sequential path state
  const [potenciaStep, setPotenciaStep] = useState(0);

  // Contract Modal States
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [personType, setPersonType] = useState('PJ'); // 'PF' | 'PJ'
  const [docNumber, setDocNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [repName, setRepName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [totalInvestment, setTotalInvestment] = useState(formatBRLInput('8000000'));
  const [entranceValue, setEntranceValue] = useState('');
  const [installments, setInstallments] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState('credit'); // 'credit' | 'pix'
  const [clientAddress, setClientAddress] = useState('');
  const [contractForo, setContractForo] = useState('Barueri/SP');
  const [consultantEmail, setConsultantEmail] = useState('');
  const [d4signStatus, setD4signStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [d4signMessage, setD4signMessage] = useState('');
  
  const totalSlides = 15;
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Monitor orientation and screen width on mobile/desktop
  useEffect(() => {
    const checkOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsPortrait(height > width && width < 768);
      setIsMobile(width < 768);
      
      if (width < 380) {
        setRadius(80);
      } else if (width < 480) {
        setRadius(95);
      } else if (width < 768) {
        setRadius(120);
      } else if (width < 1024) {
        setRadius(145);
      } else {
        // Desktop
        if (height < 700) {
          setRadius(150);
        } else {
          setRadius(175);
        }
      }
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // Scroll Spy Observer to sync currentSlide index as the user scrolls on mobile portrait
  useEffect(() => {
    if (!isMobile) return;

    const options = {
      root: null, // browser viewport
      rootMargin: '-30% 0px -50% 0px', // detects intersection around the upper middle
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const slideId = entry.target.id;
          const slideIdx = parseInt(slideId.split('-')[1]);
          if (!isNaN(slideIdx)) {
            setCurrentSlide(slideIdx);
          }
        }
      });
    }, options);

    const timer = setTimeout(() => {
      for (let i = 0; i < totalSlides; i++) {
        const el = document.getElementById(`slide-${i}`);
        if (el) observer.observe(el);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isMobile]);

  // Loop highlight for Slide 1 government structure
  useEffect(() => {
    if (currentSlide === 0) {
      const interval = setInterval(() => {
        setActiveLayer((prev) => (prev + 1) % 4);
      }, 1800);
      return () => clearInterval(interval);
    }
  }, [currentSlide]);

  // Loop highlight for Slide 4 radial diagram
  useEffect(() => {
    if (currentSlide === 3) {
      const interval = setInterval(() => {
        setActiveNode((prev) => (prev + 1) % 6);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [currentSlide]);

  // Loop sequential path animation for Slide 10
  useEffect(() => {
    if (currentSlide === 9) {
      const runStep = () => {
        setPotenciaStep((prev) => (prev === 8 ? 0 : prev + 1));
      };
      const delay = potenciaStep === 8 ? 2000 : 600;
      const timer = setTimeout(runStep, delay);
      return () => clearTimeout(timer);
    } else {
      setPotenciaStep(0);
    }
  }, [currentSlide, potenciaStep]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  // Fullscreen event listener to sync state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const nextSlide = () => {
    if (isMobile) {
      const nextIdx = Math.min(totalSlides - 1, currentSlide + 1);
      jumpToSlide(nextIdx);
    } else if (currentSlide < totalSlides - 1) {
      setSlideDirection('next');
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (isMobile) {
      const prevIdx = Math.max(0, currentSlide - 1);
      jumpToSlide(prevIdx);
    } else if (currentSlide > 0) {
      setSlideDirection('prev');
      setCurrentSlide(prev => prev - 1);
    }
  };

  const jumpToSlide = (index) => {
    if (index >= 0 && index < totalSlides) {
      if (isMobile) {
        const element = document.getElementById(`slide-${index}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        setSlideDirection(index > currentSlide ? 'next' : 'prev');
        setCurrentSlide(index);
      }
    }
  };

  const handleCalculateCusto = (e) => {
    e.preventDefault();
    if (!hourlyRate || !hoursPerWeek || !annualGrowth) return;
    
    setCalcState('calculating');
    
    setTimeout(() => {
      const rate = parseFloat(hourlyRate);
      const hours = parseFloat(hoursPerWeek);
      const percent = parseFloat(strategicPercent) || 0;
      const growth = parseFloat(annualGrowth);
      const strategyFactor = parseFloat(growthFromStrategy) || 0;
      
      // Time calculations
      const total = rate * hours * 52;
      const strategic = total * (percent / 100);
      const opportunity = total - strategic;
      
      // Growth calculations (percentage-based)
      const strategicGrowthPortion = growth * (strategyFactor / 100);
      const actualReturn = strategicGrowthPortion;
      const lostGrowth = percent > 0 ? strategicGrowthPortion * ((100 - percent) / percent) : 0;
      
      setCalculatedOpportunityCost(opportunity);
      setCalculatedStrategicInvestment(strategic);
      setCalculatedActualReturn(actualReturn);
      setCalculatedLostGrowth(lostGrowth);
      setCalcState('done');
    }, 1500);
  };

  const handleCalculateSlide6 = (e) => {
    e.preventDefault();
    if (!delegatedTasks || !returningTasks || !reworkHours) return;
    
    setSlide6CalcState('calculating');
    
    setTimeout(() => {
      const delegated = parseFloat(delegatedTasks);
      const returning = parseFloat(returningTasks);
      const hours = parseFloat(reworkHours);
      
      const rate = parseFloat(hourlyRate) || 150;
      const totalHours = parseFloat(hoursPerWeek) || 40;
      const stratPercent = parseFloat(strategicPercent) || 20;
      
      const hoursLost = returning * hours;
      const operationalHours = totalHours * (1 - (stratPercent / 100));
      const drainPercent = operationalHours > 0 ? (hoursLost / operationalHours) * 100 : 0;
      const monthlyLoss = hoursLost * rate * 4.33;
      const autonomyPercent = delegated > 0 ? (1 - (returning / delegated)) * 100 : 0;
      
      setSlide6AutonomyPercent(autonomyPercent);
      setSlide6CalcState('done');
    }, 1500);
  };

  const handleDownloadContract = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('pt-BR');
    
    const investmentVal = getNumericValue(totalInvestment);
    const entranceVal = getNumericValue(entranceValue);
    const balanceVal = Math.max(0, investmentVal - entranceVal);
    const instCount = parseInt(installments) || 1;
    const instValue = instCount > 0 ? (balanceVal / instCount) : 0;
    
    const fmtTotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(investmentVal);
    const fmtEntrance = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entranceVal);
    const fmtBalance = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balanceVal);
    const fmtInst = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(instValue);
    
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
    <td>Consultoria e Implementação PGE (Programa Governo Empresarial)</td>
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
    link.download = `contrato_pge_${clientName.replace(/\s+/g, '_').toLowerCase()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSendD4Sign = async () => {
    if (!clientEmail || !clientName || !consultantEmail) {
      alert('Por favor, preencha os e-mails do cliente e do consultor.');
      return;
    }
    
    setD4signStatus('sending');
    setD4signMessage('');
    
    try {
      const today = new Date();
      const dateStr = today.toLocaleDateString('pt-BR');
      
      const investmentVal = getNumericValue(totalInvestment);
      const entranceVal = getNumericValue(entranceValue);
      const balanceVal = Math.max(0, investmentVal - entranceVal);
      const instCount = parseInt(installments) || 1;
      const instValue = instCount > 0 ? (balanceVal / instCount) : 0;
      
      const fmtTotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(investmentVal);
      const fmtEntrance = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entranceVal);
      const fmtBalance = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balanceVal);
      const fmtInst = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(instValue);
      
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
    <td>Consultoria e Implementação PGE (Programa Governo Empresarial)</td>
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

      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      
      const opt = {
        margin: 15,
        filename: `Contrato_PGE_${clientName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      if (typeof html2pdf === 'undefined') {
        throw new Error('Biblioteca html2pdf não carregada. Verifique sua conexão com a internet.');
      }
      
      const pdfBase64 = await html2pdf().from(element).set(opt).outputPdf('datauristring');

      const response = await fetch('/api/contract/send-d4sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pdfBase64,
          docName: `Contrato PGE - ${clientName}.pdf`,
          clientEmail,
          clientName,
          consultantEmail
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar para o D4Sign');
      }

      setD4signStatus('success');
      setD4signMessage('Contrato enviado com sucesso para assinatura no D4Sign!');
      alert('Contrato enviado com sucesso para assinatura no D4Sign!');
      setIsContractModalOpen(false);

    } catch (err) {
      console.error(err);
      setD4signStatus('error');
      setD4signMessage(err.message || 'Erro de conexão.');
      alert('Falha ao enviar para o D4Sign: ' + (err.message || 'Erro desconhecido.'));
    }
  };

  // Fullscreen handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Erro ao ativar tela cheia: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Touch Swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 60) {
      nextSlide();
    } else if (touchStartX.current - touchEndX.current < -60) {
      prevSlide();
    }
  };

  const animationClass = slideDirection === 'next' ? 'animate-slide-in-right' : 'animate-slide-in-left';

  const radiusX = radius * (typeof window !== 'undefined' && window.innerWidth < 768 ? 1.35 : 1.45);
  const radiusY = radius * (typeof window !== 'undefined' && window.innerWidth < 768 ? 1.05 : 1.15);

  return (
    <div 
      className="w-screen h-[100dvh] overflow-hidden bg-[#060b13] flex flex-col justify-between select-none font-sans relative text-gray-300 animate-fade-in"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Inject custom Keyframe animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        
        .font-sans {
          font-family: 'Inter', sans-serif;
        }
        .font-heading {
          font-family: 'Outfit', sans-serif;
        }
        .font-accent {
          font-family: 'Manrope', sans-serif;
        }

        @keyframes slideInRight {
          from { 
            transform: translateX(30px) scale(0.98); 
            opacity: 0;
            filter: blur(8px);
          }
          to { 
            transform: translateX(0) scale(1); 
            opacity: 1;
            filter: blur(0);
          }
        }
        @keyframes slideInLeft {
          from { 
            transform: translateX(-30px) scale(1.02); 
            opacity: 0;
            filter: blur(8px);
          }
          to { 
            transform: translateX(0) scale(1); 
            opacity: 1;
            filter: blur(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        /* Glass Cards */
        .premium-card {
          background: rgba(14, 22, 37, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.1);
          box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.4);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .premium-card:hover {
          border-color: rgba(212, 175, 55, 0.25);
          background: rgba(18, 28, 46, 0.7);
          box-shadow: 0 15px 50px 0 rgba(212, 175, 55, 0.05);
        }

        /* Text Gold Gradient */
        .text-gold-premium {
          background: linear-gradient(135deg, #f9f5e8 0%, #d4af37 50%, #b8860b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Border Gold Gradient */
        .border-gold-grad {
          border-image: linear-gradient(135deg, #d4af37 0%, #b8860b 100%) 1;
        }

        /* Responsive adjustments for mobile landscape and low viewports */
        @media (max-height: 660px), (max-width: 767px) {
          header {
            padding: 0.5rem 2rem !important;
          }
          footer {
            padding: 0.5rem 2rem !important;
          }
          main {
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
            padding-top: 0.25rem !important;
            padding-bottom: 0.25rem !important;
          }
          
          /* Typography scaling */
          h1 {
            font-size: 2rem !important;
            line-height: 1.15 !important;
            margin-bottom: 0.5rem !important;
          }
          h2 {
            font-size: 1.35rem !important;
            line-height: 1.2 !important;
            margin-bottom: 0.35rem !important;
          }
          p {
            font-size: 0.7rem !important;
            line-height: 1.35 !important;
            margin-bottom: 0.35rem !important;
          }
          
          /* Slide layout cards and grids spacing */
          .premium-card {
            padding: 0.75rem !important;
          }
          .grid {
            gap: 0.75rem !important;
          }
          
          /* Cards scaling for Slide 2, 15 */
          .max-w-\[340px\] {
            max-w: 220px !important;
          }
          .aspect-\[4\/5\] {
            aspect-ratio: auto !important;
            height: 180px !important;
          }
          
          /* Slide 4 Radial Diagram dimensions */
          .aspect-square {
            max-width: 320px !important;
            max-height: 320px !important;
          }
          .gargalo-center-circle {
            width: 4.5rem !important;
            height: 4.5rem !important;
          }
          .gargalo-center-circle span.text-base {
            font-size: 11px !important;
          }
          .gargalo-center-circle span.text-\[9px\] {
            font-size: 7px !important;
          }
          .gargalo-satellite-card {
            width: 6.5rem !important;
            padding: 0.2rem 0.4rem !important;
          }
          .gargalo-satellite-card span {
            font-size: 8px !important;
          }
          .gargalo-satellite-card span.text-\[8px\] {
            font-size: 6.5px !important;
          }
          
          /* Slide 9 pyramid list heights */
          .max-w-\[420px\] {
            max-w: 320px !important;
          }
          .p-3\.5 {
            padding: 0.4rem 0.6rem !important;
          }
          
          /* Slide 10 method process steps */
          .w-10.h-10 {
            width: 1.75rem !important;
            height: 1.75rem !important;
          }
          .w-10.h-10 span {
            font-size: 9px !important;
          }
          .flex-grow.flex.flex-col.items-center span {
            font-size: 7px !important;
          }
          
          /* Slide 13 metrics dashboard mockup */
          .max-w-\[460px\] {
            max-w: 360px !important;
          }
          .p-5 {
            padding: 0.6rem !important;
          }
          .p-3.bg-black\/20 {
            padding: 0.4rem !important;
          }
          .text-xl {
            font-size: 1.1rem !important;
          }
          
          /* General helper utility sizes */
          .space-y-4 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 0.35rem !important;
          }
          .mb-8 {
            margin-bottom: 0.35rem !important;
          }
          .mb-6 {
            margin-bottom: 0.35rem !important;
          }
          .mt-6 {
            margin-top: 0.35rem !important;
          }
          .gap-6 {
            gap: 0.35rem !important;
          }
        }
      `}</style>

      {/* Portrait rotation warning on mobile disabled to support portrait presentation */}

      {/* TOP PROGRESS BAR */}
      <div className="w-full h-1 bg-[#101926] relative z-10">
        <div 
          className="h-full bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#ffd700] transition-all duration-300 ease-out" 
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* TOP HEADER CONTROLS */}
      <header className="px-4 md:px-10 py-3.5 md:py-5 flex items-center justify-between z-10 shrink-0 border-b border-[#1b2a3f]/25 bg-gradient-to-b from-[#060b13] to-transparent">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#d4af37] animate-pulse" />
          <span className="text-[9px] md:text-[11px] font-accent uppercase tracking-[0.2em] md:tracking-[0.25em] text-gray-400 font-medium">Felipe Damasceno</span>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <span className="hidden sm:inline text-[9px] md:text-xs font-accent text-gray-500 tracking-[0.1em] font-semibold">
            PROGRAMA GOVERNO EMPRESARIAL
          </span>
          <div className="hidden sm:block h-4 w-[1px] bg-gray-800" />
          <button 
            onClick={toggleFullscreen}
            className="text-gray-400 hover:text-[#d4af37] transition-colors p-1 rounded hover:bg-white/5"
            title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Maximize2 className="w-3.5 h-3.5 md:w-4 md:h-4" />}
          </button>
          <a 
            href="/"
            className="text-[8px] md:text-[10px] font-accent uppercase tracking-wider md:tracking-widest text-gray-400 hover:text-white border border-gray-800 px-2 md:px-3 py-1 rounded-md bg-white/5 transition-all hover:bg-white/10"
          >
            Voltar
          </a>
        </div>
      </header>

      {/* MAIN SLIDE CONTAINER */}
      <main className="flex-grow flex items-center justify-center px-4 md:px-16 relative overflow-y-auto md:overflow-hidden h-full py-4 md:py-0">
        
        {/* BACKGROUND GLOWS FOR PREMIUM FEEL */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#d4af37]/3 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#3b82f6]/2 rounded-full blur-[160px] pointer-events-none" />
 
        {/* INTERACTIVE NAVIGATION AREAS (CLICK EDGES TO NAVIGATE) */}
        <div 
          onClick={prevSlide}
          className={`absolute left-0 top-0 bottom-0 w-8 md:w-16 flex items-center justify-start pl-1 md:pl-4 cursor-pointer group z-20 transition-all ${isMobile || currentSlide === 0 ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
        >
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-800 bg-[#060b13]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:border-[#d4af37]/45 transition-all">
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-[#d4af37]" />
          </div>
        </div>

        <div 
          onClick={nextSlide}
          className={`absolute right-0 top-0 bottom-0 w-8 md:w-16 flex items-center justify-end pr-1 md:pr-4 cursor-pointer group z-20 transition-all ${isMobile || currentSlide === totalSlides - 1 ? 'pointer-events-none opacity-0' : 'opacity-150'}`}
        >
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-800 bg-[#060b13]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:border-[#d4af37]/45 transition-all">
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-[#d4af37]" />
          </div>
        </div>

        {/* SLIDE SWITCHER */}
        <div className={`w-full max-w-6xl ${isMobile ? 'flex flex-col gap-16 py-6' : 'h-full flex flex-col justify-center py-2 md:py-6 ' + animationClass}`} key={isMobile ? 'mobile-folds' : currentSlide}>
          
          {/* SLIDE 1: CAPA */}
          {(isMobile || currentSlide === 0) && (
            <div id="slide-0" className="w-full min-h-[85dvh] md:h-full flex flex-col justify-center py-8 md:py-0 border-b border-[#1b2a3f]/15 md:border-b-0 shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center h-full text-center md:text-left py-4 md:py-0">
              <div className="col-span-12 md:col-span-7 flex flex-col justify-center text-left">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.3em] mb-4 animate-fade-in">Apresentação Comercial</span>
                <h1 className="text-5xl lg:text-6xl font-heading font-extrabold text-white leading-tight mb-6">
                  PROGRAMA <br/>
                  <span className="text-gold-premium">GOVERNO EMPRESARIAL</span>
                </h1>
                <p className="text-lg text-gray-400 max-w-xl font-light mb-8 leading-relaxed">
                  Transformando empresários operacionais em empresários que governam através de pessoas, processos e indicadores estratégicos.
                </p>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={nextSlide}
                    className="px-6 py-3 btn-gold rounded-lg flex items-center gap-3 text-xs uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    Iniciar Apresentação
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="col-span-12 md:col-span-5 flex justify-center items-center mt-6 md:mt-0">
                {/* SVG Structure Representation */}
                <div className="w-full max-w-[360px] premium-card p-8 rounded-2xl border-l-4 border-l-[#d4af37] flex flex-col gap-6">
                  <div className="border-b border-[#1b2a3f] pb-3">
                    <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">Estrutura de Governo</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-mono tracking-widest mt-1">Hierarquia de Escala</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {/* Level 4: Governo (Gold Theme) */}
                    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${activeLayer === 0 ? 'bg-[#d4af37]/15 border border-[#d4af37]/60 scale-[1.02] shadow-[0_0_15px_rgba(212,175,55,0.25)]' : 'bg-[#d4af37]/2 border border-[#d4af37]/15'}`}>
                      <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${activeLayer === 0 ? 'text-[#d4af37]' : 'text-[#d4af37]/65'}`}>Governo</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-mono transition-all duration-500 ${activeLayer === 0 ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-[#d4af37]/10 text-[#d4af37]/50'}`}>Conselho / Estratégia</span>
                    </div>
                    
                    {/* Level 3: Liderança (Silver/Slate Theme) */}
                    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${activeLayer === 1 ? 'bg-slate-300/10 border border-slate-400/50 scale-[1.02] shadow-[0_0_15px_rgba(203,213,225,0.2)]' : 'bg-slate-800/5 border border-slate-800/40'}`}>
                      <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${activeLayer === 1 ? 'text-slate-200' : 'text-slate-400/60'}`}>Liderança</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-mono transition-all duration-500 ${activeLayer === 1 ? 'bg-slate-300/20 text-slate-200' : 'bg-slate-800/20 text-slate-500'}`}>Diretores / Gestores</span>
                    </div>
                    
                    {/* Level 2: Processos (Bronze/Amber Theme) */}
                    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${activeLayer === 2 ? 'bg-amber-700/10 border border-amber-500/50 scale-[1.02] shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'bg-amber-800/2 border border-amber-900/30'}`}>
                      <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${activeLayer === 2 ? 'text-amber-300' : 'text-amber-500/60'}`}>Processos</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-mono transition-all duration-500 ${activeLayer === 2 ? 'bg-amber-700/20 text-amber-300' : 'bg-amber-800/10 text-amber-500/40'}`}>Rotinas / Padrões</span>
                    </div>
                    
                    {/* Level 1: Indicadores (Electric Blue Theme) */}
                    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${activeLayer === 3 ? 'bg-[#3b82f6]/15 border border-[#3b82f6]/60 scale-[1.02] shadow-[0_0_15px_rgba(59,130,246,0.25)]' : 'bg-[#3b82f6]/2 border border-[#3b82f6]/15'}`}>
                      <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${activeLayer === 3 ? 'text-[#60a5fa]' : 'text-[#3b82f6]/65'}`}>Indicadores</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-mono transition-all duration-500 ${activeLayer === 3 ? 'bg-[#3b82f6]/20 text-[#3b82f6]' : 'bg-[#3b82f6]/10 text-[#3b82f6]/50'}`}>Dados / Dashboards</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* SLIDE 2: FELIPE DAMASCENO */}
          {(isMobile || currentSlide === 1) && (
            <div id="slide-1" className="w-full min-h-[85dvh] md:h-full flex flex-col justify-center py-8 md:py-0 border-b border-[#1b2a3f]/15 md:border-b-0 shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center h-full text-center md:text-left py-4 md:py-0">
              <div className="col-span-12 md:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[240px] md:max-w-[340px] aspect-[4/5] rounded-xl overflow-hidden border border-gray-800 bg-gradient-to-b from-gray-900 to-black flex flex-col justify-end p-6 group shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                  <img src={felipeImg} className="absolute inset-0 w-full h-full object-cover object-top filter grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500" alt="Felipe Damasceno" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060b13] via-[#060b13]/10 to-transparent z-10 pointer-events-none" />
                  <div className="relative z-20 border-t border-gray-800/80 pt-3">
                    <span className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider block">Felipe Damasceno</span>
                    <span className="text-[10px] text-gray-400 uppercase block tracking-widest mt-0.5">Conselheiro Estratégico de Escala</span>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-7 flex flex-col justify-center text-left">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-3">A Trajetória</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight mb-3">
                  EU NÃO APRENDI ISSO APENAS ESTUDANDO EMPRESAS.<br/>
                  <span className="text-gold-premium">EU APRENDI CONSTRUINDO.</span>
                </h2>
                <p className="text-sm text-gray-400 mb-6 font-light leading-relaxed">
                  Eu conheço os dois lados da moeda: sei a emoção de crescer um negócio de alta velocidade e sei a dor física e mental de se tornar refém dele.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
                  <div className="border-l border-[#d4af37]/40 pl-4">
                    <span className="block text-2xl font-heading font-extrabold text-white">+15 Anos</span>
                    <span className="block text-[10px] text-gray-500 uppercase tracking-wider mt-1">Negócios, Tech e Educação</span>
                  </div>
                  <div className="border-l border-[#d4af37]/40 pl-4">
                    <span className="block text-2xl font-heading font-extrabold text-white">+R$ 100M</span>
                    <span className="block text-[10px] text-gray-500 uppercase tracking-wider mt-1">Faturados no 1º Ano da Op</span>
                  </div>
                  <div className="border-l border-[#d4af37]/40 pl-4">
                    <span className="block text-2xl font-heading font-extrabold text-white">+2.800</span>
                    <span className="block text-[10px] text-gray-500 uppercase tracking-wider mt-1">Empresários Acelerados</span>
                  </div>
                </div>
                
                {/* Associated Companies Logos */}
                <div className="border-t border-gray-800/80 pt-4">
                  <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-3">Marcas & Projetos Associados</span>
                  <div className="flex flex-wrap items-center justify-start gap-x-4 md:gap-x-6 gap-y-2 opacity-55">
                    {['XGrow', 'EventX', 'D360', 'ADVAI', 'E3T', 'NeuroVerse'].map((logo, idx) => (
                      <span key={idx} className="text-xs font-heading font-bold text-gray-400 uppercase tracking-wider border border-gray-800 px-2 py-0.5 rounded bg-white/5">
                        {logo}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* SLIDE 3: A HISTÓRIA */}
          {(isMobile || currentSlide === 2) && (
            <div id="slide-2" className="w-full min-h-[85dvh] md:h-full flex flex-col justify-center py-8 md:py-0 border-b border-[#1b2a3f]/15 md:border-b-0 shrink-0">
              <div className="flex flex-col justify-center h-full">
              <div className="mb-6">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">O Contraste do Sucesso</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white">
                  EU CONSTRUÍ UMA EMPRESA DE R$100 MILHÕES.<br/>
                  <span className="text-gold-premium">E ME TORNEI REFÉM DELA.</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                <div className="premium-card p-6 rounded-xl border-t-2 border-t-emerald-600/50">
                  <div className="flex items-center gap-2 text-emerald-500 mb-3">
                    <TrendingUp className="w-5 h-5" />
                    <h3 className="font-heading font-bold text-base uppercase tracking-wider">CRESCIMENTO EXCEPCIONAL</h3>
                  </div>
                  <ul className="space-y-2.5 text-xs text-gray-400 font-light">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Equipe contratada e escalada semanalmente.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Milhares de clientes ativos em escala nacional.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Faturamento escalando para os múltiplos 8 dígitos.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Reconhecimento de mercado e prêmios de inovação.
                    </li>
                  </ul>
                </div>

                <div className="premium-card p-6 rounded-xl border-t-2 border-t-red-700/50">
                  <div className="flex items-center gap-2 text-[#d4af37] mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                    <h3 className="font-heading font-bold text-base uppercase tracking-wider text-white">DEPENDÊNCIA EXTREMA</h3>
                  </div>
                  <ul className="space-y-2.5 text-xs text-gray-400 font-light">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Decisões diárias centralizadas 100% no fundador.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Reuniões de alinhamento constantes e urgências.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Gargalos operacionais por falta de autonomia gerencial.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Incapacidade de se afastar sem que o caos se instale.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-l-4 border-[#d4af37] bg-white/2 p-4 rounded-r-lg max-w-3xl mx-auto w-full text-center">
                <p className="text-sm font-heading font-bold text-white italic">
                  "O problema não era falta de sucesso. Era o sucesso depender demais de mim."
                </p>
              </div>
            </div>
          </div>
          )}

          {/* SLIDE 4: O ESPELHO DO EMPRESÁRIO */}
          {(isMobile || currentSlide === 3) && (
            <div id="slide-3" className="w-full min-h-[85dvh] md:h-full flex flex-col justify-center py-8 md:py-0 border-b border-[#1b2a3f]/15 md:border-b-0 shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center h-full text-center md:text-left py-4 md:py-0">
              <div className="col-span-12 md:col-span-5 flex flex-col justify-center text-left">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-3">O Retrato da Operação</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight mb-4">
                  A EMPRESA CRESCEU.<br/>
                  <span className="text-red-500 font-accent">MAS VOCÊ VIROU O SISTEMA</span> QUE FAZ TUDO FUNCIONAR.
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed font-light mb-4">
                  Quando a empresa cresce em faturamento e estrutura, mas mantém a arquitetura de decisões centralizada, a engrenagem suga toda a energia e tempo do fundador.
                </p>
                <div className="p-4 bg-white/2 border border-gray-800 rounded-lg">
                  <p className="text-xs text-gray-300 font-medium">
                    Quando tudo precisa passar pelo dono, crescimento deixa de significar liberdade e começa a gerar complexidade.
                  </p>
                </div>
              </div>
              <div className="col-span-12 md:col-span-7 flex justify-center mt-6 md:mt-0 relative overflow-visible py-10 md:py-0">
                {/* Visual Radial Diagram */}
                <div className="relative w-full max-w-[500px] md:max-w-[540px] aspect-square flex items-center justify-center">
                  
                  {/* Central Node: Dono (Enlarged) */}
                  <div className="gargalo-center-circle w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#ffd700] to-[#b8860b] flex flex-col items-center justify-center border border-white/20 shadow-[0_0_35px_rgba(212,175,55,0.45)] z-10 transition-transform duration-500">
                    <span className="text-black font-heading font-extrabold text-base uppercase tracking-wider">DONO</span>
                    <span className="text-black/80 font-mono text-[9px] uppercase tracking-widest mt-0.5">Gargalo</span>
                  </div>

                  {/* Connecting Lines (Ray-based layout from center) */}
                  {[
                    { angle: 0 },
                    { angle: 60 },
                    { angle: 120 },
                    { angle: 180 },
                    { angle: 240 },
                    { angle: 300 }
                  ].map((line, idx) => {
                    const isActive = activeNode === idx;
                    const radian = (line.angle * Math.PI) / 180;
                    const x = Math.cos(radian) * radiusX;
                    const y = Math.sin(radian) * radiusY;
                    
                    const dist = Math.sqrt(x*x + y*y);
                    const lineLength = dist - (isActive ? 18 : 15);
                    const angleInRadians = Math.atan2(y, x);
                    const angleInDegrees = (angleInRadians * 180) / Math.PI;
                    const rotationAngle = angleInDegrees + 90;
                    
                    return (
                      <div
                        key={`line-${idx}`}
                        className={`absolute origin-bottom transition-all duration-500 z-0 ${isActive ? 'bg-gradient-to-t from-[#d4af37] via-[#d4af37]/60 to-[#d4af37]/10 w-[3px] opacity-100 shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'bg-gradient-to-t from-[#1b2a3f]/50 to-transparent w-[1.5px] opacity-40'}`}
                        style={{
                          height: `${lineLength}px`,
                          bottom: '50%',
                          transform: `rotate(${rotationAngle}deg)`,
                          transformOrigin: 'bottom center'
                        }}
                      />
                    );
                  })}

                  {/* Satellite Nodes (Enlarged and animated) */}
                  {[
                    { label: 'Comercial', angle: 0, text: 'Aprovação de propostas' },
                    { label: 'Operação', angle: 60, text: 'Resolvendo problemas' },
                    { label: 'Equipe', angle: 120, text: 'Dúvidas constantes' },
                    { label: 'Financeiro', angle: 180, text: 'Liberação de contas' },
                    { label: 'Clientes', angle: 240, text: 'Atendimento direto' },
                    { label: 'Decisões', angle: 300, text: 'Validações diárias' }
                  ].map((node, idx) => {
                    const radian = (node.angle * Math.PI) / 180;
                    const x = Math.cos(radian) * radiusX;
                    const y = Math.sin(radian) * radiusY;
                    const isActive = activeNode === idx;

                    return (
                      <div 
                        key={idx} 
                        className="absolute flex flex-col items-center z-20"
                        style={{ 
                          transform: `translate(${x}px, ${y}px) scale(${isActive ? 1.12 : 1})`,
                          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        <div className={`gargalo-satellite-card px-2 py-1.5 sm:px-4 sm:py-2.5 rounded-xl border w-24 sm:w-28 md:w-36 text-center transition-all duration-500 shadow-lg ${isActive ? 'bg-[#121c2e] border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.25)]' : 'bg-[#0e1625]/90 border-gray-800 hover:border-[#d4af37]/50'}`}>
                          <span className={`text-[8px] sm:text-[9px] md:text-[11px] font-bold uppercase block transition-colors duration-500 ${isActive ? 'text-[#d4af37]' : 'text-white'}`}>{node.label}</span>
                          <span className="text-[7px] sm:text-[8px] md:text-[9px] text-gray-500 mt-0.5 sm:mt-1 leading-tight block">{node.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          )}

          {/* SLIDE 5: O CUSTO DA DEPENDÊNCIA */}
          {(isMobile || currentSlide === 4) && (
            <div id="slide-4" className="w-full min-h-[85dvh] md:h-full flex flex-col justify-center py-8 md:py-0 border-b border-[#1b2a3f]/15 md:border-b-0 shrink-0">
              <div className="flex flex-col justify-center h-full">
              <div className="mb-3">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-1 block">Cálculo de Risco</span>
                <h2 className="text-2xl lg:text-3xl font-heading font-extrabold text-white">
                  O CUSTO INVISÍVEL DE UMA <br/>
                  <span className="text-gold-premium">EMPRESA DEPENDENTE DO DONO</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {[
                  { title: 'TEMPO', desc: 'Horas de valor intelectual desperdiçadas resolvendo atritos operacionais diários que poderiam ser automatizados ou delegados.' },
                  { title: 'DECISÕES', desc: 'A velocidade de inovação e entrega fica limitada pela capacidade física da agenda do fundador.' },
                  { title: 'CRESCIMENTO', desc: 'Gargalo comercial. Escalar as vendas gera caos de entrega, forçando o dono a travar novos negócios.' },
                  { title: 'VALOR E RISCO', desc: 'Frágil e não-vendável. Empresas excessivamente dependentes do fundador não constroem equity real.' }
                ].map((cost, idx) => (
                  <div key={idx} className="premium-card p-4 rounded-xl flex flex-col justify-between min-h-[170px] lg:min-h-[185px]">
                    <div>
                      <div className="w-6 h-6 rounded bg-[#d4af37]/5 flex items-center justify-center border border-[#d4af37]/20 mb-2">
                        <span className="text-[10px] font-bold text-[#d4af37]">{idx + 1}</span>
                      </div>
                      <h3 className="font-heading font-bold text-xs text-white mb-1.5 uppercase tracking-wide">{cost.title}</h3>
                      <p className="text-[10px] text-gray-400 font-light leading-relaxed">{cost.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Interactive Risk Calculator */}
              <div className="premium-card p-4 rounded-xl border border-[#d4af37]/20 bg-gradient-to-r from-[#0a1120] to-[#0e172a] shadow-[0_12px_40px_rgba(0,0,0,0.5)] mt-1">
                <div className="flex flex-col gap-4">
                  
                  {/* Title & Formula */}
                  <div className="flex items-center justify-between border-b border-gray-800/80 pb-2 text-left">
                    <div>
                      <span className="text-[9px] font-accent text-[#d4af37] font-bold uppercase tracking-wider">Simulador de Risco e Alavancagem</span>
                      <h4 className="text-xs font-heading font-extrabold text-white mt-0.5 uppercase">Custo de Centralização vs. Retorno Estratégico</h4>
                    </div>
                    <p className="text-[9px] text-gray-500 font-light hidden md:block">
                      Fórmula tempo: (Valor Hora × Horas/Semana) × 52 semanas | Fórmula crescimento: Crescimento Anual × Decisões Estratégicas %
                    </p>
                  </div>

                  {/* Inputs Row / Center Column */}
                  <div className="flex items-center justify-center min-h-[60px] w-full">
                    {calcState === 'idle' && (
                      <form onSubmit={handleCalculateCusto} className="w-full flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end w-full">
                          
                          {/* Row 1/Col 1: Valor Hora */}
                          <div className="flex flex-col text-left">
                            <label className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Valor da sua hora (R$)</label>
                            <input 
                              type="number" 
                              placeholder="Ex: 150" 
                              value={hourlyRate}
                              onChange={(e) => setHourlyRate(e.target.value)}
                              className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-2.5 py-1.5 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                              required
                            />
                          </div>
                          
                          {/* Row 1/Col 2: Horas Semanais */}
                          <div className="flex flex-col text-left">
                            <label className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Horas trab. / semana</label>
                            <input 
                              type="number" 
                              placeholder="Ex: 44" 
                              value={hoursPerWeek}
                              onChange={(e) => setHoursPerWeek(e.target.value)}
                              className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-2.5 py-1.5 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                              required
                            />
                          </div>

                          {/* Row 1/Col 3: Tempo Estratégico % */}
                          <div className="flex flex-col text-left">
                            <label className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Tempo estratégico (%)</label>
                            <input 
                              type="number" 
                              min="0"
                              max="100"
                              placeholder="Ex: 20" 
                              value={strategicPercent}
                              onChange={(e) => setStrategicPercent(e.target.value)}
                              className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-2.5 py-1.5 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                              required
                            />
                          </div>

                          {/* Row 2/Col 1: Crescimento Faturamento */}
                          <div className="flex flex-col text-left">
                            <label className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Crescimento anual (%)</label>
                            <input 
                              type="number" 
                              placeholder="Ex: 80" 
                              value={annualGrowth}
                              onChange={(e) => setAnnualGrowth(e.target.value)}
                              className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-2.5 py-1.5 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                              required
                            />
                          </div>

                          {/* Row 2/Col 2: Decisões Estratégicas % */}
                          <div className="flex flex-col text-left">
                            <label className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Resp. no resultado (%)</label>
                            <input 
                              type="number" 
                              min="0"
                              max="100"
                              placeholder="Ex: 50" 
                              value={growthFromStrategy}
                              onChange={(e) => setGrowthFromStrategy(e.target.value)}
                              className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-2.5 py-1.5 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                              required
                            />
                          </div>

                        </div>
                        <div className="flex justify-end mt-1">
                          <button 
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-heading font-extrabold text-xs rounded-lg uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                          >
                            Calcular Custo & Impacto
                          </button>
                        </div>
                      </form>
                    )}

                    {calcState === 'calculating' && (
                      <div className="flex items-center gap-3 text-[#d4af37] animate-pulse">
                        <svg className="animate-spin h-5 w-5 text-[#d4af37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-xs font-mono font-bold uppercase tracking-widest">Processando simulação de alavancagem...</span>
                      </div>
                    )}

                    {calcState === 'done' && (
                      <div className="flex flex-col lg:flex-row items-stretch gap-4 md:gap-6 w-full animate-fade-in text-left">
                        
                        {/* Column 1: Time Cost Metrics (Left) */}
                        <div className="flex-1 flex flex-col justify-between border-r-0 lg:border-r border-gray-800/80 pr-0 lg:pr-6 gap-3">
                          <div className="space-y-3">
                            
                            {/* Card 1.1: Custo Operacional de Oportunidade */}
                            <div className="bg-red-500/5 border border-red-500/10 hover:border-red-500/25 rounded-xl p-3 sm:p-4 transition-all duration-300">
                              <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider block mb-1">⚠️ CUSTO OPERACIONAL DE OPORTUNIDADE</span>
                              <span className="text-xl md:text-2xl font-heading font-extrabold text-red-500 tracking-wide drop-shadow-[0_0_10px_rgba(239,68,68,0.25)] animate-pulse block">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculatedOpportunityCost)}
                              </span>
                              <p className="text-[11px] text-gray-300 font-light mt-1.5 leading-relaxed">
                                Horas intelectuais engolidas por burocracias operacionais que deveriam ser delegadas.
                              </p>
                            </div>
                            
                            {/* Card 1.2: Investimento do Tempo */}
                            <div className="bg-[#34d399]/5 border border-[#34d399]/10 hover:border-[#34d399]/25 rounded-xl p-3 sm:p-4 transition-all duration-300">
                              <span className="text-[9px] text-[#34d399] font-bold uppercase tracking-wider block mb-1">💎 INVESTIMENTO DO SEU TEMPO EM ESTRATÉGIA</span>
                              <span className="text-lg md:text-xl font-heading font-extrabold text-[#34d399] tracking-wide block">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculatedStrategicInvestment)}
                              </span>
                              <p className="text-[11px] text-gray-300 font-light mt-1.5 leading-relaxed">
                                Custo do seu tempo intelectual que foi efetivamente dedicado a estruturar o crescimento.
                              </p>
                            </div>

                          </div>
                          
                          <button 
                            onClick={() => { setCalcState('idle'); setHourlyRate(''); setHoursPerWeek(''); setStrategicPercent('20'); setAnnualGrowth('80'); setGrowthFromStrategy('50'); }}
                            className="mt-4 px-4 py-2 border border-gray-800 hover:border-[#d4af37]/50 text-[10px] text-gray-400 hover:text-white uppercase font-bold tracking-wider rounded-lg transition-all cursor-pointer w-fit"
                          >
                            Refazer Simulação
                          </button>
                        </div>

                        {/* Column 2: Growth Impact Metrics (Right) */}
                        <div className="flex-1 flex flex-col justify-between gap-3">
                          <div className="space-y-3">
                            
                            {/* Card 2.1: Crescimento devido a decisões */}
                            <div className="bg-white/5 border border-gray-800/80 hover:border-[#34d399]/20 rounded-xl p-3 transition-all duration-300">
                              <span className="text-[9px] text-[#34d399] font-bold uppercase tracking-wider block mb-1">📈 CRESCIMENTO DEVIDO ÀS SUAS DECISÕES ESTRATÉGICAS</span>
                              <span className="text-base md:text-lg font-heading font-extrabold text-[#34d399] tracking-wide block">
                                {calculatedActualReturn.toFixed(1)}% de crescimento gerado
                              </span>
                              <p className="text-[11px] text-gray-300 font-light mt-1 leading-relaxed">
                                Com apenas {strategicPercent}% das suas horas dedicadas a decisões, você gerou {calculatedActualReturn.toFixed(1)}% do crescimento total.
                              </p>
                            </div>

                            {/* Card 2.2: Dobrando a Dedicação */}
                            <div className="bg-white/5 border border-gray-800/80 hover:border-[#34d399]/20 rounded-xl p-3 transition-all duration-300">
                              <span className="text-[9px] text-[#34d399] font-bold uppercase tracking-wider block mb-1">⚡ DOBRANDO A DEDICAÇÃO (Projeção {parseFloat(strategicPercent) * 2}%)</span>
                              <span className="text-base md:text-lg font-heading font-extrabold text-[#34d399] tracking-wide block">
                                +{calculatedActualReturn.toFixed(1)}% de crescimento projetado
                              </span>
                              <p className="text-[11px] text-gray-300 font-light mt-1 leading-relaxed">
                                Se você passar para {parseFloat(strategicPercent) * 2}% do seu tempo em estratégia, o crescimento projetado ganharia mais +{calculatedActualReturn.toFixed(1)}%.
                              </p>
                            </div>
                            
                            {/* Card 2.3: Potencial Deixado na Mesa */}
                            <div className="bg-red-500/5 border border-red-500/10 hover:border-red-500/25 rounded-xl p-3 transition-all duration-300">
                              <span className="text-[9px] text-orange-500 font-bold uppercase tracking-wider block mb-1">❌ POTENCIAL DEIXADO NA MESA (Operação Centralizada)</span>
                              <span className="text-base md:text-lg font-heading font-extrabold text-orange-500 tracking-wide block animate-pulse">
                                +{calculatedLostGrowth.toFixed(1)}% de crescimento perdido
                              </span>
                              <p className="text-[11px] text-gray-300 font-light mt-1 leading-relaxed">
                                O faturamento incremental que você abriu mão por passar {100 - parseFloat(strategicPercent)}% do tempo focado na operação.
                              </p>
                            </div>

                          </div>

                          <div className="mt-4 border-t border-gray-800/80 pt-2.5 text-left">
                            <span className="text-[9px] text-[#d4af37] font-bold uppercase tracking-wider block">🎯 Como recuperar esse faturamento não-alavancado:</span>
                            <p className="text-[9px] text-gray-400 leading-normal font-light">
                              Ao invés de gastar tempo na operação, direcione suas horas para ajustes de preços/margens, estratégias comerciais de vendas, automação de rotinas e a contratação de gestores.
                            </p>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* SLIDE 6: POR QUE DELEGAR NÃO RESOLVEU */}
          {(isMobile || currentSlide === 5) && (
            <div id="slide-5" className="w-full min-h-[85dvh] md:h-full flex flex-col justify-center py-8 md:py-0 border-b border-[#1b2a3f]/15 md:border-b-0 shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center h-full text-center md:text-left py-4 md:py-0">
              <div className="col-span-12 md:col-span-5 flex flex-col justify-center text-left">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-3">Quebra de Objeção</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight mb-4">
                  DELEGAR TAREFAS NÃO É<br/>
                  <span className="text-gold-premium">TRANSFERIR RESPONSABILIDADE.</span>
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed font-light mb-4">
                  Se você simplesmente passa tarefas adiante sem o arcabouço estrutural necessário, cria uma alça de feedback que devolve o problema e gera frustração de que "ninguém faz como eu".
                </p>
                <div className="p-4 bg-white/2 border border-gray-800 rounded-lg">
                  <p className="text-xs text-gray-300 font-medium italic">
                    "Você não precisa simplesmente delegar mais. Precisa construir uma estrutura onde a delegação consiga sobreviver sem você."
                  </p>
                </div>
              </div>
              <div className="col-span-12 md:col-span-7 flex flex-col gap-4">
                
                {/* O Fluxo Ruim */}
                <div className="premium-card p-3 rounded-xl border-l-4 border-l-red-500/50">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-red-500 font-bold block mb-1">FLUXO INADEQUADO</span>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 text-[10px] sm:text-xs font-bold text-white">
                    <span className="bg-white/5 px-2 py-1 rounded text-center w-full sm:w-auto">Dono centraliza</span>
                    <ArrowRight className="w-3.5 h-3.5 text-red-500 rotate-90 sm:rotate-0" />
                    <span className="bg-white/5 px-2 py-1 rounded text-center w-full sm:w-auto">Delega tarefa</span>
                    <ArrowRight className="w-3.5 h-3.5 text-red-500 rotate-90 sm:rotate-0" />
                    <span className="bg-red-500/10 border border-red-500/30 px-2 py-1 rounded text-red-500 text-center w-full sm:w-auto">Problema surge</span>
                    <ArrowRight className="w-3.5 h-3.5 text-red-500 rotate-90 sm:rotate-0" />
                    <span className="bg-white/5 px-2 py-1 rounded text-center w-full sm:w-auto">Volta ao dono</span>
                  </div>
                </div>

                {/* O Fluxo Correto */}
                <div className="premium-card p-3 rounded-xl border-l-4 border-l-[#d4af37]">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-[#d4af37] font-bold block mb-1">ESTRUTURA DE AUTONOMIA REAL</span>
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-5 gap-1.5 text-[9px] text-center text-gray-400">
                      <div className="p-1.5 bg-white/5 border border-gray-800 rounded flex flex-col justify-between">
                        <span className="font-bold text-white mb-0.5">PAPEL</span>
                        <span>Quem executa</span>
                      </div>
                      <div className="p-1.5 bg-white/5 border border-gray-800 rounded flex flex-col justify-between">
                        <span className="font-bold text-white mb-0.5">ALÇADA</span>
                        <span>Decisão</span>
                      </div>
                      <div className="p-1.5 bg-white/5 border border-gray-800 rounded flex flex-col justify-between">
                        <span className="font-bold text-white mb-0.5">PROCESSO</span>
                        <span>Como fazer</span>
                      </div>
                      <div className="p-1.5 bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded flex flex-col justify-between">
                        <span className="font-bold text-[#3b82f6] mb-0.5">MÉTRICA</span>
                        <span>Avaliar</span>
                      </div>
                      <div className="p-1.5 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded flex flex-col justify-between">
                        <span className="font-bold text-[#d4af37] mb-0.5">CADÊNCIA</span>
                        <span>Acompanhar</span>
                      </div>
                    </div>
                    <div className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-wider bg-white/5 py-1 rounded">
                      = Autonomia Executiva Real
                    </div>
                  </div>
                </div>

                {/* Centralization & Autonomy Calculator */}
                <div className="premium-card p-3 rounded-xl border border-[#d4af37]/20 bg-gradient-to-r from-[#0a1120] to-[#0e172a] shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                  <div className="flex flex-col gap-3">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-800/80 pb-1.5 text-left">
                      <div>
                        <span className="text-[9px] font-accent text-[#d4af37] font-bold uppercase tracking-wider">Simulador de Retrabalho e Autonomia</span>
                        <h4 className="text-[10px] font-heading font-extrabold text-white uppercase">O Custo da Re-centralização Operacional</h4>
                      </div>
                    </div>

                    {/* Inputs or Results */}
                    {slide6CalcState === 'idle' && (
                      <form onSubmit={handleCalculateSlide6} className="w-full flex flex-col gap-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end w-full">
                          
                          <div className="flex flex-col text-left">
                            <label className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Delegadas / semana</label>
                            <input 
                              type="number" 
                              placeholder="Ex: 10" 
                              value={delegatedTasks}
                              onChange={(e) => setDelegatedTasks(e.target.value)}
                              className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-2 py-1.5 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                              required
                            />
                          </div>

                          <div className="flex flex-col text-left">
                            <label className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Voltam (refugo) / semana</label>
                            <input 
                              type="number" 
                              placeholder="Ex: 7" 
                              value={returningTasks}
                              onChange={(e) => setReturningTasks(e.target.value)}
                              className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-2 py-1.5 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                              required
                            />
                          </div>

                          <div className="flex flex-col text-left">
                            <label className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Tempo refazer / tarefa (h)</label>
                            <input 
                              type="number" 
                              placeholder="Ex: 2" 
                              value={reworkHours}
                              onChange={(e) => setReworkHours(e.target.value)}
                              className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-2 py-1.5 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                              required
                            />
                          </div>

                        </div>
                        <div className="flex justify-end mt-1">
                          <button 
                            type="submit"
                            className="px-5 py-1.5 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-heading font-extrabold text-[10px] rounded-lg uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                          >
                            Calcular Dreno
                          </button>
                        </div>
                      </form>
                    )}

                    {slide6CalcState === 'calculating' && (
                      <div className="flex items-center justify-center gap-3 text-[#d4af37] animate-pulse py-4">
                        <svg className="animate-spin h-4 w-4 text-[#d4af37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Calculando dreno de centralização...</span>
                      </div>
                    )}

                    {slide6CalcState === 'done' && (
                      <div className="flex flex-col gap-3 animate-fade-in text-left">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          
                          {/* Card 1: Autonomia */}
                          <div className="bg-white/5 border border-gray-800 hover:border-[#34d399]/20 rounded-xl p-3 transition-all duration-300">
                            <span className="text-[8px] text-[#34d399] font-bold uppercase tracking-wider block mb-0.5">📊 AUTONOMIA REAL DA EQUIPE</span>
                            <span className={`text-base font-heading font-extrabold tracking-wide block ${slide6AutonomyPercent < 45 ? 'text-red-500 animate-pulse' : 'text-[#34d399]'}`}>
                              {slide6AutonomyPercent.toFixed(0)}% Autonomia
                            </span>
                            <p className="text-[11px] text-gray-300 font-light mt-1 leading-normal">
                              Sua equipe é {100 - slide6AutonomyPercent}% dependente. De cada {delegatedTasks} tarefas, {returningTasks} exigem sua validação.
                            </p>
                          </div>

                          {/* Card 2: Tempo devorado */}
                          <div className="bg-red-500/5 border border-red-500/10 hover:border-red-500/25 rounded-xl p-3 transition-all duration-300">
                            <span className="text-[8px] text-red-500 font-bold uppercase tracking-wider block mb-0.5">⏳ TEMPO DEVORADO POR RETRABALHO</span>
                            <span className="text-base font-heading font-extrabold text-red-500 tracking-wide block">
                              {slide6HoursLost}h / semana
                            </span>
                            <p className="text-[11px] text-gray-300 font-light mt-1 leading-normal">
                              Equivale a {slide6TimeDrainPercent.toFixed(1)}% do seu tempo operacional desperdiçado resolvendo atritos cotidianos.
                            </p>
                          </div>

                          {/* Card 3: Prejuízo financeiro */}
                          <div className="bg-red-500/5 border border-red-500/10 hover:border-red-500/25 rounded-xl p-3 transition-all duration-300">
                            <span className="text-[8px] text-red-500 font-bold uppercase tracking-wider block mb-0.5">❌ PREJUÍZO MENSAL DO RETRABALHO</span>
                            <span className="text-base font-heading font-extrabold text-red-500 tracking-wide block animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.25)]">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(slide6MonthlyLoss)}
                            </span>
                            <p className="text-[11px] text-gray-300 font-light mt-1 leading-normal">
                              O custo financeiro invisível de pagar o valor da sua hora nobre para resolver retrabalhos operacionais.
                            </p>
                          </div>

                        </div>

                        <div className="flex justify-between items-center mt-1 border-t border-gray-800/80 pt-2">
                          <span className="text-[8px] text-gray-500 italic">
                            *Baseado no valor de hora (R$ {hourlyRate || 150}) e horas/sem ({hoursPerWeek || 40}) informados.
                          </span>
                          <button 
                            onClick={() => { setSlide6CalcState('idle'); setDelegatedTasks('10'); setReturningTasks('7'); setReworkHours('2'); }}
                            className="px-2.5 py-1 border border-gray-800 hover:border-[#d4af37]/50 text-[8px] text-gray-400 hover:text-white uppercase font-bold tracking-wider rounded transition-all cursor-pointer"
                          >
                            Refazer Simulação
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            </div>
          </div>
          )}

          {/* SLIDE 7: A CAUSA-RAIZ */}
          {(isMobile || currentSlide === 6) && (
            <div id="slide-6" className="w-full min-h-[85dvh] md:h-full flex flex-col justify-center py-8 md:py-0 border-b border-[#1b2a3f]/15 md:border-b-0 shrink-0">
              <div className="flex flex-col justify-center h-full">
              <div className="mb-8">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">Diagnóstico de Gestão</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white">
                  SUA EMPRESA CRESCEU.<br/>
                  <span className="text-gold-premium">SEU MODELO DE GESTÃO NÃO CRESCEU JUNTO.</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6">
                <div className="premium-card p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/3 rounded-bl-full pointer-events-none" />
                  <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest block mb-4">MODELO ANTERIOR (Centralizado)</span>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center font-bold text-red-500 text-xs shrink-0">F</div>
                      <div>
                        <span className="block text-xs font-bold text-white uppercase">FAZER</span>
                        <span className="block text-[11px] text-gray-500 font-light mt-0.5">Fundador executa diretamente tarefas táticas.</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center font-bold text-red-500 text-xs shrink-0">C</div>
                      <div>
                        <span className="block text-xs font-bold text-white uppercase">CONTROLAR</span>
                        <span className="block text-[11px] text-gray-500 font-light mt-0.5">Cobranças constantes baseadas em sentimento, sem clareza.</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center font-bold text-red-500 text-xs shrink-0">C</div>
                      <div>
                        <span className="block text-xs font-bold text-white uppercase">CENTRALIZAR</span>
                        <span className="block text-[11px] text-gray-500 font-light mt-0.5">Todas as pendências orbitam a agenda do proprietário.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="premium-card p-6 rounded-xl relative overflow-hidden border-l-2 border-l-[#d4af37]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/3 rounded-bl-full pointer-events-none" />
                  <span className="text-xs font-mono font-bold text-[#d4af37] uppercase tracking-widest block mb-4">MODELO DE GOVERNO (Escalável)</span>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center font-bold text-[#d4af37] text-xs shrink-0">D</div>
                      <div>
                        <span className="block text-xs font-bold text-white uppercase">DIRECIONAR</span>
                        <span className="block text-[11px] text-gray-400 font-light mt-0.5">Definir rumos, prioridades estratégicas e visão da empresa.</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center font-bold text-[#d4af37] text-xs shrink-0">D</div>
                      <div>
                        <span className="block text-xs font-bold text-white uppercase">DELEGAR E ALOCAR</span>
                        <span className="block text-[11px] text-gray-400 font-light mt-0.5">Estabelecer papéis e transferir a responsabilidade total aos líderes.</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center font-bold text-[#3b82f6] text-xs shrink-0">M</div>
                      <div>
                        <span className="block text-xs font-bold text-white uppercase">MEDIR E GOVERNAR</span>
                        <span className="block text-[11px] text-gray-400 font-light mt-0.5">Avaliar o progresso de forma objetiva por indicadores estruturados.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-3">
                <span className="text-xs text-gray-500 uppercase tracking-widest">
                  "Sua empresa não precisa que você trabalhe mais. Ela precisa que você ocupe um novo lugar dentro dela."
                </span>
              </div>
            </div>
          </div>
          )}

          {/* SLIDE 8: A TRANSFORMAÇÃO */}
          {(isMobile || currentSlide === 7) && (
            <div id="slide-7" className="w-full min-h-[85dvh] md:h-full flex flex-col justify-center py-8 md:py-0 border-b border-[#1b2a3f]/15 md:border-b-0 shrink-0">
              <div className="flex flex-col justify-center h-full">
              <div className="mb-6">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">O Alvo do Programa</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white">
                  A TRANSFORMAÇÃO:<br/>
                  <span className="text-gold-premium">DE EMPRESÁRIO OPERACIONAL A EMPRESÁRIO QUE GOVERNA</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-4 md:py-0">
                <div className="col-span-12 md:col-span-4 bg-white/2 border border-gray-800 p-6 rounded-xl min-h-[220px] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block mb-3">PERFIL OPERACIONAL</span>
                    <ul className="space-y-2 text-[11px] text-gray-400">
                      <li className="flex items-center gap-2">❌ Apaga incêndios operacionais diariamente.</li>
                      <li className="flex items-center gap-2">❌ Centraliza todas as chaves de decisão.</li>
                      <li className="flex items-center gap-2">❌ Cobra por sensação ou cansaço.</li>
                      <li className="flex items-center gap-2">❌ É o principal executor da operação.</li>
                      <li className="flex items-center gap-2">❌ Virou o gargalo do crescimento.</li>
                    </ul>
                  </div>
                </div>
                
                <div className="col-span-12 md:col-span-1 flex justify-center">
                  <ArrowRight className="w-6 h-6 text-[#d4af37] rotate-90 md:rotate-0" />
                </div>

                <div className="col-span-12 md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { title: 'PESSOAS', key: 'Liderança', text: 'Lideranças maduras e autônomas assumem responsabilidades operacionais, de contratação e de entrega.' },
                    { title: 'PROCESSOS', key: 'Rotinas', text: 'Engrenagem corporativa funciona com fluxos de processos documentados, alçadas e cadências estratégicas.' },
                    { title: 'INDICADORES', key: 'Decisões', text: 'Visibilidade total da empresa através de dados precisos (IDE, CLO, KPIs). Decisões baseadas em números.' }
                  ].map((pilar, idx) => (
                    <div key={idx} className="premium-card p-4 rounded-xl flex flex-col justify-between min-h-[220px]">
                      <div>
                        <span className="text-[9px] text-[#d4af37] font-mono tracking-wider block mb-2">{pilar.key}</span>
                        <h3 className="font-heading font-bold text-xs text-white uppercase mb-2">{pilar.title}</h3>
                        <p className="text-[10px] text-gray-400 font-light leading-relaxed">{pilar.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-800/80 pt-4 mt-6 text-center">
                <p className="text-xs text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
                  <strong>Governar não é fazer tudo.</strong> É construir uma empresa capaz de funcionar, crescer e executar sem depender de você para tudo.
                </p>
              </div>
            </div>
          </div>
          )}

          {/* SLIDE 9: A SOLUÇÃO */}
          {(isMobile || currentSlide === 8) && (
            <div id="slide-8" className="w-full min-h-[85dvh] md:h-full flex flex-col justify-center py-8 md:py-0 border-b border-[#1b2a3f]/15 md:border-b-0 shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center h-full text-center md:text-left py-4 md:py-0">
              <div className="col-span-12 md:col-span-5 flex flex-col justify-center text-left">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-3">O Programa</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight mb-4">
                  PROGRAMA <br/>
                  <span className="text-gold-premium">GOVERNO EMPRESARIAL</span>
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed font-light mb-4">
                  Uma jornada estratégica presencial e online de 12 meses desenvolvida para remodelar a estrutura executiva em relação à forma como você age dentro da sua empresa, garantindo autonomia, processos sólidos e controle métrico.
                </p>
                <div className="p-4 bg-white/2 border border-gray-800 rounded-lg">
                  <p className="text-xs text-gray-300 font-medium">
                    Não aplicamos uma receita pronta. Cada empresário terá um roadmap diferente, porque cada um está preso à operação por motivos diferentes.
                  </p>
                </div>
              </div>
              <div className="col-span-12 md:col-span-7 flex justify-center mt-6 md:mt-0">
                {/* Visual Pyramid Levels */}
                <div className="w-full max-w-[420px] flex flex-col gap-3">
                  {[
                    { lvl: 'Nível 4', name: 'GOVERNO', desc: 'Conselho Estratégico, Visão, Parcerias, Expansão e Legado', bg: 'bg-[#d4af37]/15 border-[#d4af37]/40 text-[#d4af37]' },
                    { lvl: 'Nível 3', name: 'LIDERANÇA', desc: 'Gestores autônomos, alçadas e responsabilidades táticas', bg: 'bg-white/5 border-gray-800 text-slate-300' },
                    { lvl: 'Nível 2', name: 'GESTÃO', desc: 'Métricas, CRMs, Processos Críticos e Cadências estruturadas', bg: 'bg-white/5 border-gray-800 text-slate-400' },
                    { lvl: 'Nível 1', name: 'OPERAÇÃO', desc: 'Agentes de IA, Automações de dados, Rotinas e POPs operacionais', bg: 'bg-white/5 border-gray-800 text-slate-500' }
                  ].map((level, idx) => (
                    <div key={idx} className={`p-3.5 rounded-xl border flex items-center gap-4 transition-all hover:-translate-y-0.5 ${level.bg}`}>
                      <div className="w-12 text-center border-r border-gray-800 pr-3 font-mono text-[9px] uppercase tracking-wider font-bold shrink-0">
                        {level.lvl}
                      </div>
                      <div className="flex-grow">
                        <span className="block text-xs font-bold uppercase tracking-wider">{level.name}</span>
                        <span className="block text-[10px] opacity-75 font-light mt-0.5 leading-relaxed">{level.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          )}

          {/* SLIDE 10: MÉTODO POTÊNCIA EMPRESARIAL */}
          {(isMobile || currentSlide === 9) && (
            <div id="slide-9" className="w-full min-h-[85dvh] md:h-full flex flex-col justify-center py-8 md:py-0 border-b border-[#1b2a3f]/15 md:border-b-0 shrink-0">
              <div className="flex flex-col justify-center h-full">
              <div className="mb-6">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">O Mecanismo Único</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white">
                  MÉTODO <span className="text-gold-premium">POTÊNCIA EMPRESARIAL</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center py-4 md:py-0">
                <div className="col-span-12 md:col-span-5 flex flex-col gap-4 text-left">
                  <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider border-b border-gray-800 pb-2">Os Instrumentos Diagnósticos</h3>
                  
                  <div className="p-4 bg-white/2 border border-gray-800 rounded-xl">
                    <span className="text-[10px] text-[#3b82f6] font-mono tracking-widest font-bold uppercase block mb-1">Diagnóstico 1</span>
                    <span className="text-xs font-bold text-white uppercase block">IDE — Índice de Dependência Empresarial</span>
                    <p className="text-[10px] text-gray-400 mt-1 font-light leading-relaxed">
                      Mede exatamente quanto e em quais áreas da operação (vendas, finanças, entrega) a empresa ainda depende das decisões do fundador.
                    </p>
                  </div>

                  <div className="p-4 bg-white/2 border border-gray-800 rounded-xl">
                    <span className="text-[10px] text-[#10b981] font-mono tracking-widest font-bold uppercase block mb-1">Diagnóstico 2</span>
                    <span className="text-xs font-bold text-white uppercase block">CLO — Calculadora de Liberdade Operacional</span>
                    <p className="text-[10px] text-gray-400 mt-1 font-light leading-relaxed">
                      Mapeia a agenda, horas semanais e carga mental do fundador que ainda estão sequestradas por rotinas táticas e emergenciais.
                    </p>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-7 flex flex-col gap-6 w-full mt-6 md:mt-0">
                  <div className="text-center p-3 bg-white/3 border border-gray-800 rounded-lg">
                    <span className="font-heading font-bold text-xs text-white">IDE + CLO = MAPA DA DEPENDÊNCIA CORPORATIVA</span>
                  </div>

                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-1 relative pt-2 md:pt-4">
                    {/* Process Steps */}
                    {[
                      { step: '01', title: 'DIAGNOSTICAR', desc: 'Mapear IDE + CLO' },
                      { step: '02', title: 'ORGANIZAR', desc: 'Responsabilidades RACI' },
                      { step: '03', title: 'DELEGAR', desc: 'Papel, alçada e autonomia' },
                      { step: '04', title: 'AUTOMATIZAR', desc: 'Implantação de IAs e CRM' },
                      { step: '05', title: 'GOVERNAR', desc: 'Acompanhar indicadores' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex-grow flex flex-row md:flex-col items-center md:items-center text-left md:text-center px-1.5 relative gap-3 md:gap-0">
                        {/* Grey base line for desktop */}
                        {idx < 4 && (
                          <div className="hidden md:block absolute top-[19px] left-1/2 w-full h-[1.5px] bg-gray-800/80 z-0" />
                        )}
                        
                        {/* Animated energy line for desktop */}
                        {idx < 4 && (
                          <div 
                            className="hidden md:block absolute top-[19px] left-1/2 w-full h-[2.5px] bg-gradient-to-r from-[#d4af37] to-[#ffd700] z-0 origin-left transition-all duration-500 shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                            style={{
                              transform: `scaleX(${potenciaStep >= (idx * 2 + 1) ? 1 : 0})`
                            }}
                          />
                        )}

                        {/* Grey base line for mobile */}
                        {idx < 4 && (
                          <div className="md:hidden absolute left-[19px] top-[40px] w-[1.5px] h-[calc(100%)] bg-gray-800/80 z-0" />
                        )}

                        {/* Animated energy line for mobile */}
                        {idx < 4 && (
                          <div 
                            className="md:hidden absolute left-[19px] top-[40px] w-[2.5px] h-[calc(100%)] bg-gradient-to-b from-[#d4af37] to-[#ffd700] z-0 origin-top transition-all duration-500 shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                            style={{
                              transform: `scaleY(${potenciaStep >= (idx * 2 + 1) ? 1 : 0})`
                            }}
                          />
                        )}

                        {/* Circle */}
                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center relative z-10 shadow-md transition-all duration-500 shrink-0 ${
                          potenciaStep >= idx * 2 
                            ? 'border-[#d4af37] bg-[#121c2e] shadow-[0_0_15px_rgba(212,175,55,0.35)] scale-[1.08]' 
                            : 'border-gray-800 bg-[#0c1625]'
                        }`}>
                          <span className={`text-xs font-bold font-mono transition-colors duration-500 ${potenciaStep >= idx * 2 ? 'text-[#d4af37]' : 'text-white'}`}>{item.step}</span>
                        </div>

                        {/* Titles */}
                        <div className="flex flex-col md:items-center mt-1">
                          <span className={`block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 ${potenciaStep >= idx * 2 ? 'text-white font-extrabold' : 'text-gray-500 font-normal'}`}>{item.title}</span>
                          <span className={`block text-[8px] sm:text-[9px] mt-0.5 max-w-[200px] leading-tight transition-colors duration-500 ${potenciaStep >= idx * 2 ? 'text-gray-300 font-medium' : 'text-gray-600 font-light'}`}>{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* SLIDE 11: ROADMAP ESTRATÉGICO */}
          {(isMobile || currentSlide === 10) && (
            <div id="slide-10" className="w-full min-h-[85dvh] md:h-full flex flex-col justify-center py-8 md:py-0 border-b border-[#1b2a3f]/15 md:border-b-0 shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center h-full text-center md:text-left py-4 md:py-0">
              <div className="col-span-12 md:col-span-5 flex flex-col justify-center text-left">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-3">A Implementação</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight mb-4">
                  O QUE PRECISA SAIR DA<br/>
                  <span className="text-gold-premium">SUA MÃO PRIMEIRO?</span>
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed font-light mb-4">
                  Após o cruzamento do IDE e do CLO, montamos um plano de transição sob medida: o **Roadmap Estratégico**, determinando prioridades e donos de responsabilidades.
                </p>
                <div className="p-4 bg-white/2 border border-gray-800 rounded-lg">
                  <p className="text-xs text-gray-300 font-medium">
                    "Não entregamos uma lista de tarefas. Construímos uma agenda estratégica de transformação para sua governança."
                  </p>
                </div>
              </div>
              <div className="col-span-12 md:col-span-7 flex justify-center mt-6 md:mt-0">
                {/* Visual Roadmap Board Mockup */}
                <div className="w-full max-w-[460px] premium-card p-6 rounded-xl border border-gray-800 flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Prioridades do Roadmap</span>
                    <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded font-mono">12 Meses</span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { area: 'LIDERANÇA', act: 'Formar gestor para o setor de atendimento', status: 'Fase 1' },
                      { area: 'COMERCIAL', act: 'Migrar proposta comercial para o CRM e automatizar alçada', status: 'Fase 1' },
                      { area: 'PROCESSOS', act: 'Documentação dos POPs operacionais de vendas e finanças', status: 'Fase 2' },
                      { area: 'DELEGAÇÃO', act: 'Aplicar Matriz RACI nas decisões de faturamento', status: 'Fase 2' },
                      { area: 'AUTOMAÇÃO', act: 'Integrar agentes de IA para triagem de leads no digital', status: 'Fase 3' },
                      { area: 'INDICADORES', act: 'Implantar dashboard executivo para tomada de decisões', status: 'Fase 3' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-white/2 border border-gray-900 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                          <div>
                            <span className="block text-[8px] font-mono text-[#d4af37] font-bold uppercase tracking-wider">{item.area}</span>
                            <span className="block text-[10px] text-slate-300 font-light mt-0.5">{item.act}</span>
                          </div>
                        </div>
                        <span className="text-[8px] font-mono bg-white/5 text-gray-500 border border-gray-800 px-1.5 py-0.5 rounded">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* SLIDE 12: CONSELHO ESTRATÉGICO DE ESCALA */}
          {(isMobile || currentSlide === 11) && (
            <div id="slide-11" className="w-full min-h-[85dvh] md:h-full flex flex-col justify-center py-8 md:py-0 border-b border-[#1b2a3f]/15 md:border-b-0 shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center h-full text-center md:text-left py-4 md:py-0">
              <div className="col-span-12 md:col-span-5 flex flex-col justify-center text-left">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-3">Acompanhamento</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight mb-3">
                  NÃO ENTREGAMOS UM PLANO <br/>
                  <span className="text-gold-premium">E DESEJAMOS BOA SORTE.</span>
                </h2>
                <span className="text-xs font-heading font-bold text-white mb-4 block">
                  Você tem um Conselheiro Estratégico ao seu lado durante 12 meses.
                </span>
                <p className="text-xs text-gray-400 leading-relaxed font-light mb-4">
                  Eu estarei pessoalmente guiando a implementação operacional e liderando o alinhamento com seus gestores para garantir que a transição ocorra de forma segura e sem perdas de receita.
                </p>
                <div className="p-4 bg-white/2 border border-gray-800 rounded-lg">
                  <p className="text-xs text-gray-300 font-medium italic">
                    "Meu papel não é operar sua empresa por você. É ajudá-lo a construir as pessoas, a estrutura e a cadência para que você não precise continuar operando tudo."
                  </p>
                </div>
              </div>
              <div className="col-span-12 md:col-span-7 flex flex-col gap-6 w-full mt-6 md:mt-0">
                
                {/* Loop Ciclo */}
                <div className="flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between p-4 bg-[#0e1625]/90 border border-gray-800 rounded-xl text-xs font-bold text-white text-center gap-2">
                  {['DECIDIR', 'EXECUTAR', 'MEDIR', 'CORRIGIR', 'AVANÇAR'].map((cycle, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 sm:gap-2">
                      <span className="bg-white/5 border border-gray-800 px-2.5 py-1.5 rounded hover:border-[#d4af37]/50 transition-colors text-[9px] sm:text-xs">
                        {cycle}
                      </span>
                      {idx < 4 && <span className="text-[#d4af37] font-mono text-[9px] sm:text-xs">→</span>}
                    </div>
                  ))}
                </div>

                {/* Key deliveries cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="premium-card p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] text-[#d4af37] font-mono block mb-1">ALINHAMENTO</span>
                      <h4 className="font-bold text-white mb-2 uppercase">Cadência Estratégica</h4>
                      <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                        Reuniões mensais de conselho executivo para analisar prioridades, corrigir rotas e destrancar gargalos.
                      </p>
                    </div>
                  </div>
                  
                  <div className="premium-card p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] text-[#3b82f6] font-mono block mb-1">EXPANSÃO</span>
                      <h4 className="font-bold text-white mb-2 uppercase">Escala e Educação</h4>
                      <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                        Assessoria para expansão do negócio, incluindo a construção do Modelo Educacional da empresa se necessário.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          )}

          {/* SLIDE 13: COMO MEDIMOS A TRANSFORMAÇÃO */}
          {/* SLIDE 13: GOVERNO COM DADOS */}
          {(isMobile || currentSlide === 12) && (() => {
            const initialCLO = parseFloat(strategicPercent) || 20;
            const initialAutonomy = slide6AutonomyPercent || 30;
            const initialIDE = 100 - initialAutonomy;
            const initialDecisions = initialIDE;
            
            const targetIDE = 18;
            const targetCLO = 85;
            const targetDecisions = 12;
            const targetAutonomy = 100;
            
            const decisionsReduction = initialDecisions > 0 
              ? ((targetDecisions - initialDecisions) / initialDecisions) * 100 
              : -88;

            return (
              <div id="slide-12" className="w-full min-h-[85dvh] md:h-full flex flex-col justify-center py-8 md:py-0 border-b border-[#1b2a3f]/15 md:border-b-0 shrink-0">
                <div className="flex flex-col justify-center h-full">
                <div className="mb-4">
                  <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-2 block">Governo com Dados</span>
                  <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white">
                    AQUILO QUE NÃO MEDIMOS VIRA SENSAÇÃO.<br/>
                    <span className="text-gold-premium">AQUILO QUE MEDIMOS VIRA GESTÃO.</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center py-4 md:py-0">
                  <div className="col-span-12 md:col-span-5 flex flex-col gap-3 text-xs text-left">
                    <p className="text-gray-300 font-light leading-relaxed mb-2 text-xs sm:text-[13px]">
                      A evolução do programa não é medida por "sensação de melhora". Nós criamos indicadores de governança que mostram claramente a redução da centralização do fundador.
                    </p>
                    
                    {[
                      { label: 'Índice de Dependência (IDE)', now: `${initialIDE.toFixed(0)}%`, target: `${targetIDE}%`, desc: 'Nota que mede a presença do dono em rotinas críticas.' },
                      { label: 'Liberdade Operacional (CLO)', now: `${initialCLO.toFixed(0)}%`, target: `${targetCLO}%`, desc: 'Porcentagem de tempo livre para planejamento estratégico.' },
                      { label: 'Autonomia das Lideranças', now: `${initialAutonomy.toFixed(0)}%`, target: `${targetAutonomy}%`, desc: 'Capacidade do time de gerir prioridades e alçadas.' }
                    ].map((met, idx) => (
                      <div key={idx} className="p-3 bg-white/2 border border-gray-900 rounded-lg flex flex-col justify-between">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-white text-[11px] uppercase">{met.label}</span>
                          <div className="flex items-center gap-1.5 font-mono text-[10px]">
                            <span className="text-red-500 line-through">{met.now}</span>
                            <span className="text-gray-400">➔</span>
                            <span className="text-[#34d399] font-bold">{met.target}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1 font-light leading-normal">{met.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="col-span-12 md:col-span-7 flex justify-center mt-6 md:mt-0">
                    {/* Conceptual Dashboard Mockup */}
                    <div className="w-full max-w-[460px] premium-card p-5 rounded-xl border border-gray-800 flex flex-col gap-4">
                      <span className="text-[10px] font-mono text-[#3b82f6] uppercase tracking-wider block border-b border-gray-850 pb-2 text-left">
                        Dashboard Conceitual de Governança
                      </span>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Metric 1 */}
                        <div className="p-3 bg-black/20 rounded-lg border border-gray-900 text-left">
                          <span className="block text-[8px] text-gray-500 uppercase font-mono">IDE (Dependência)</span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xl font-heading font-extrabold text-red-500">{targetIDE}%</span>
                            <span className="text-[9px] text-gray-500 line-through">{initialIDE.toFixed(0)}% Inicial</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-900 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-red-500" style={{ width: `${targetIDE}%` }} />
                          </div>
                        </div>
                        
                        {/* Metric 2 */}
                        <div className="p-3 bg-black/20 rounded-lg border border-gray-950 text-left">
                          <span className="block text-[8px] text-gray-500 uppercase font-mono">CLO (Liberdade)</span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xl font-heading font-extrabold text-emerald-500">{targetCLO}%</span>
                            <span className="text-[9px] text-gray-500">{initialCLO.toFixed(0)}% Inicial</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-900 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${targetCLO}%` }} />
                          </div>
                        </div>

                        {/* Metric 3 */}
                        <div className="p-3 bg-black/20 rounded-lg border border-gray-900 text-left">
                          <span className="block text-[8px] text-gray-500 uppercase font-mono">Decisões que Chegam ao Dono</span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xl font-heading font-extrabold text-white">{targetDecisions}%</span>
                            <span className="text-[9px] text-red-500 font-mono">{decisionsReduction.toFixed(0)}%</span>
                          </div>
                        </div>

                        {/* Metric 4 */}
                        <div className="p-3 bg-black/20 rounded-lg border border-gray-900 text-left">
                          <span className="block text-[8px] text-gray-500 uppercase font-mono">Processos Críticos Ativos</span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xl font-heading font-extrabold text-[#d4af37]">{targetAutonomy}%</span>
                            <span className="text-[9px] text-gray-500">Implantados</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[8px] text-gray-500 text-center block mt-1">
                        *Gráficos conceituais. A velocidade e os números exatos dependem da estrutura de cada empresa.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

          {/* SLIDE 14: ROI / CUSTO DE NÃO AGIR */}
          {(isMobile || currentSlide === 13) && (() => {
            const rate = parseFloat(hourlyRate) || 150;
            const totalHours = parseFloat(hoursPerWeek) || 40;
            const stratPercent = parseFloat(strategicPercent) || 20;
            const opPercent = 100 - stratPercent;
            const weeklyOpHours = totalHours * (opPercent / 100);
            const annualOpHours = weeklyOpHours * 52;
            const annualOpCost = annualOpHours * rate;
            const hoursLost = slide6HoursLost || 14;
            const annualReworkCost = hoursLost * rate * 52;
            const totalLoss12Months = annualOpCost + annualReworkCost;

            return (
              <div id="slide-13" className="w-full min-h-[85dvh] md:h-full flex flex-col justify-center py-8 md:py-0 border-b border-[#1b2a3f]/15 md:border-b-0 shrink-0">
                <div className="flex flex-col justify-center h-full">
                <div className="mb-4">
                  <span className="text-xs sm:text-sm font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-1.5 block">Matemática de Escala</span>
                  <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white">
                    QUANTO VALE REDUZIR A <br/>
                    <span className="text-gold-premium">DEPENDÊNCIA DA SUA EMPRESA?</span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch mb-4 py-4 md:py-0">
                  
                  {/* Left Column: Wasted hours details */}
                  <div className="col-span-12 md:col-span-4 flex flex-col gap-3 justify-between">
                    <div className="premium-card p-4 rounded-xl border-l-4 border-l-red-500/50 bg-[#0c0d12]">
                      <span className="text-[10px] text-red-500 font-mono font-bold block mb-1.5">O CUSTO REAL DA OPERAÇÃO</span>
                      <div className="text-xs sm:text-sm text-slate-300 font-light space-y-2">
                        <div className="flex justify-between border-b border-gray-900 pb-1.5">
                          <span>Horas semanais na operação:</span>
                          <strong className="text-white">{weeklyOpHours.toFixed(1)}h</strong>
                        </div>
                        <div className="flex justify-between border-b border-gray-900 pb-1.5">
                          <span>Semanas comerciais/ano:</span>
                          <strong className="text-white">52 semanas</strong>
                        </div>
                        <div className="flex justify-between text-[#d4af37] font-bold pt-0.5">
                          <span>Tempo operacional anual:</span>
                          <span>{annualOpHours.toFixed(0)} horas</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3.5 bg-white/2 border border-gray-800 rounded-lg">
                      <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed font-light">
                        Com o seu tempo intelectual avaliado em <strong className="text-white text-xs sm:text-[13px]">R$ {rate}/h</strong>, você queima <strong className="text-red-400 text-xs sm:text-[13px]">R$ {new Intl.NumberFormat('pt-BR').format(annualOpCost)}/ano</strong> em rotinas operacionais simples, além de <strong className="text-red-400 text-xs sm:text-[13px]">R$ {new Intl.NumberFormat('pt-BR').format(annualReworkCost)}/ano</strong> gerenciando refações.
                      </p>
                    </div>

                    {/* Cost of continuing / Inércia Title */}
                    <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3.5 text-left">
                      <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block mb-1">⚠️ CUSTO TOTAL DE NÃO AGIR</span>
                      <span className="text-xl sm:text-2xl font-heading font-extrabold text-red-500 tracking-wide block animate-pulse">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalLoss12Months)} / ano
                      </span>
                    </div>
                  </div>

                  {/* Center/Right Columns: Scenario comparison boxes */}
                  <div className="col-span-12 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Scenario 1: Inércia (Red background card) */}
                    <div className="premium-card p-4 rounded-xl border border-red-500/10 bg-red-500/2 hover:border-red-500/20 transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] sm:text-[10px] text-red-500 font-mono font-bold block mb-1">CENÁRIO 1: INÉRCIA (Sem agir)</span>
                        <h4 className="font-heading font-extrabold text-sm sm:text-base text-white uppercase mb-2">Continuar Preso na Operação</h4>
                        <ul className="space-y-2.5 text-xs sm:text-[13px] text-gray-400">
                          <li className="flex items-start gap-1.5">
                            <span className="text-red-500">❌</span>
                            <span><strong>R$ {new Intl.NumberFormat('pt-BR').format(totalLoss12Months)}</strong> de capital próprio queimado em tarefas de baixo valor.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-red-500">❌</span>
                            <span><strong>+{calculatedLostGrowth.toFixed(1)}%</strong> de crescimento de faturamento anual que você abre mão.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-red-500">❌</span>
                            <span>Fadiga crônica, apagando incêndios da equipe e sofrendo com re-centralização constante.</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-3 text-[11px] sm:text-xs text-red-400 font-semibold italic">
                        "O custo real da inércia é o lucro que você nunca vai ver."
                      </div>
                    </div>

                    {/* Scenario 2: Alavancagem PGE (Gold border card) */}
                    <div className="premium-card p-4 rounded-xl border border-[#d4af37]/25 bg-[#d4af37]/3 hover:border-[#d4af37]/40 transition-all duration-300 flex flex-col justify-between shadow-[0_0_15px_rgba(212,175,55,0.05)]">
                      <div>
                        <span className="text-[9px] sm:text-[10px] text-[#d4af37] font-mono font-bold block mb-1">CENÁRIO 2: ALAVANCAGEM PGE</span>
                        <h4 className="font-heading font-extrabold text-sm sm:text-base text-white uppercase mb-2">Remodelação Executiva e Autonomia</h4>
                        <ul className="space-y-2.5 text-xs sm:text-[13px] text-gray-300">
                          <li className="flex items-start gap-1.5">
                            <span className="text-[#34d399]">✓</span>
                            <span><strong>+{weeklyOpHours.toFixed(0)} horas/semana</strong> livres para focar em alianças, inovação e expansão.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-[#34d399]">✓</span>
                            <span><strong>100% de Autonomia Real</strong> na equipe com processos e métricas claras (Zera retrabalho).</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-[#34d399]">✓</span>
                            <span><strong>+{calculatedActualReturn.toFixed(1)}%</strong> de crescimento projetado imediato, escalando para <strong>+{(calculatedActualReturn * 2).toFixed(1)}%</strong> ao dobrar o tempo estratégico.</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-3 text-[11px] sm:text-xs text-[#d4af37] font-semibold italic">
                        "Seu tempo é a alavanca mais cara do seu negócio."
                      </div>
                    </div>

                  </div>

                </div>

                {/* Bottom cumulative cost comparison + valuation split */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch mt-4">
                  
                  {/* Left part: Cumulative Loss Projections */}
                  <div className="col-span-12 md:col-span-8 bg-black/50 border border-gray-800 rounded-xl p-3 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-white uppercase tracking-wider">
                      <span>Projeção Acumulada de Desperdício (Inércia operacional)</span>
                      <span className="text-red-500 animate-pulse text-[9px]">Prejuízo acumulado</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                      {[
                        { period: 'Ciclo de 12 Meses', value: totalLoss12Months, bg: 'bg-red-500/10 border-red-500/20' },
                        { period: 'Ciclo de 24 Meses', value: totalLoss12Months * 2, bg: 'bg-red-500/15 border-red-500/30' },
                        { period: 'Ciclo de 36 Meses', value: totalLoss12Months * 3, bg: 'bg-red-500/20 border-red-500/40' }
                      ].map((item, idx) => (
                        <div key={idx} className={`p-2.5 rounded-lg border ${item.bg} flex flex-col justify-center`}>
                          <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider block">{item.period}</span>
                          <span className="text-xs sm:text-sm lg:text-base font-heading font-extrabold text-red-500 mt-0.5">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(item.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right part: Valuation Anchoring Box */}
                  <div className="col-span-12 md:col-span-4 bg-[#d4af37]/5 border border-[#d4af37]/35 rounded-xl p-3.5 flex flex-col justify-center shadow-[0_0_20px_rgba(212,175,55,0.1)] text-left">
                    <div>
                      <span className="text-[9px] text-[#d4af37] font-mono font-bold block mb-1">🎯 VALOR DA SOLUÇÃO</span>
                      <p className="text-[11px] sm:text-xs text-gray-300 leading-normal font-light">
                        Se a sua inércia custa <strong className="text-white">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalLoss12Months)}</strong> nos próximos 12 meses...
                      </p>
                      <p className="text-[11px] sm:text-xs text-[#d4af37] font-semibold leading-normal mt-1.5">
                        Concorda que o PGE vale no mínimo <strong className="text-[#ffd700]">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalLoss12Months / 2)}</strong> para resolver esse problema em definitivo?
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })()}

          {/* SLIDE 15: FECHAMENTO */}
          {(isMobile || currentSlide === 14) && (
            <div id="slide-14" className="w-full min-h-[85dvh] md:h-full flex flex-col justify-center py-8 md:py-0 border-b border-[#1b2a3f]/15 md:border-b-0 shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center h-full text-center md:text-left py-4 md:py-0">
              <div className="col-span-12 md:col-span-7 flex flex-col justify-center text-left">
                <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.35em] mb-3">O Chamado</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight mb-4">
                  SUA EMPRESA JÁ CRESCEU.<br/>
                  <span className="text-gold-premium">AGORA É HORA DE GOVERNAR.</span>
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed font-light mb-6">
                  Assuma o controle de verdade. Não dependa de furos na agenda ou noites em claro para que a empresa continue de pé. Conecte sua verdade com a engrenagem executiva do seu negócio.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      SUA EMPRESA VAI CONTINUAR DEPENDENDO DE VOCÊ PARA CRESER?
                    </span>
                    <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">
                      OU ESTÁ NA HORA DE VOCÊ ASSUMIR O GOVERNO?
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsContractModalOpen(true)}
                    className="px-8 py-3.5 btn-gold rounded-lg flex items-center gap-3 text-xs uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105 transition-all cursor-pointer"
                  >
                    Iniciar Programa de Governo Empresarial
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>

              <div className="col-span-12 md:col-span-5 flex justify-center mt-6 md:mt-0">
                <div className="w-full max-w-[340px] premium-card p-6 rounded-2xl border-2 border-[#d4af37] flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/5 rounded-bl-full pointer-events-none" />
                  
                  <div className="border-b border-gray-800 pb-3">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#d4af37] font-bold">Programa High Ticket</span>
                    <h3 className="text-base font-heading font-extrabold text-white uppercase mt-0.5">GOVERNO EMPRESARIAL</h3>
                    <p className="text-[9px] text-gray-500 font-mono mt-1">12 MESES DE TRANSIÇÃO</p>
                  </div>

                  <div className="space-y-2 text-[10px] text-gray-400">
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                      Método Potência Empresarial
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                      Diagnósticos Iniciais IDE + CLO
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                      Roadmap Estratégico Personalizado
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                      Acompanhamento da Implementação
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                      Conselho Estratégico de Escala
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3 mt-2">
                    <span className="block text-[9px] text-gray-500 uppercase tracking-widest">Investimento Anual</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-heading font-extrabold text-white">R$ 80.000</span>
                      <span className="text-[10px] text-gray-500 font-medium">À vista</span>
                    </div>
                  </div>

                  <span className="text-[9px] text-gray-500 block leading-relaxed italic border-t border-gray-850 pt-3 text-center">
                    "O investimento não é para ter mais informação. É para mudar a estrutura que ainda faz sua empresa depender de você."
                  </span>
                </div>
              </div>
            </div>
          </div>
          )}

        </div>

      </main>

      {/* Contract Generation Modal */}
      {isContractModalOpen && (() => {
        const totalVal = getNumericValue(totalInvestment);
        const entranceVal = getNumericValue(entranceValue);
        const isEntranceTooLow = entranceVal > 0 && entranceVal < totalVal * 0.3;
        const balanceVal = Math.max(0, totalVal - entranceVal);
        const instCount = parseInt(installments) || 1;
        const instValue = instCount > 0 ? (balanceVal / instCount) : 0;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
            <div className="w-full max-w-2xl bg-gradient-to-b from-[#0a1120] to-[#0e172a] border border-[#d4af37]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden max-h-[90vh] flex flex-col">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-800 p-4">
                <div className="text-left">
                  <span className="text-[10px] font-accent text-[#d4af37] font-bold uppercase tracking-wider block">FECHAMENTO COMERCIAL</span>
                  <h3 className="text-base font-heading font-extrabold text-white uppercase">Dados do Programa de Governo Empresarial</h3>
                </div>
                <button 
                  onClick={() => setIsContractModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-4 text-left custom-scrollbar">
                
                {/* Pessoa Selection Toggle */}
                <div className="flex gap-4 items-center justify-start bg-black/40 border border-gray-800 p-2.5 rounded-lg">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Tipo de Contratação:</span>
                  <label className="flex items-center gap-1.5 text-xs text-white cursor-pointer font-medium">
                    <input 
                      type="radio" 
                      name="personType" 
                      value="PJ" 
                      checked={personType === 'PJ'} 
                      onChange={() => { setPersonType('PJ'); setDocNumber(''); setClientName(''); }}
                      className="accent-[#d4af37]"
                    />
                    Pessoa Jurídica (CNPJ)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-white cursor-pointer font-medium">
                    <input 
                      type="radio" 
                      name="personType" 
                      value="PF" 
                      checked={personType === 'PF'} 
                      onChange={() => { setPersonType('PF'); setDocNumber(''); setClientName(''); }}
                      className="accent-[#d4af37]"
                    />
                    Pessoa Física (CPF)
                  </label>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* CPF or CNPJ */}
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                      {personType === 'PJ' ? 'CNPJ' : 'CPF'}
                    </label>
                    <input 
                      type="text" 
                      placeholder={personType === 'PJ' ? '00.000.000/0001-00' : '000.000.000-00'} 
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                      className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                      required
                    />
                  </div>

                  {/* Client Name or Company Name */}
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                      {personType === 'PJ' ? 'Razão Social / Nome da Empresa' : 'Nome Completo'}
                    </label>
                    <input 
                      type="text" 
                      placeholder={personType === 'PJ' ? 'Ex: Empresa LTDA' : 'Ex: João da Silva'} 
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none w-full transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Representative Name (PJ Only) */}
                  {personType === 'PJ' && (
                    <div className="flex flex-col md:col-span-2">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                        Nome do Representante Legal (Signatário)
                      </label>
                      <input 
                        type="text" 
                        placeholder="Ex: Felipe Damasceno (Representante que assina)" 
                        value={repName}
                        onChange={(e) => setRepName(e.target.value)}
                        className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none w-full transition-all duration-300"
                      />
                    </div>
                  )}

                  {/* Email */}
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">E-mail do Cliente</label>
                    <input 
                      type="email" 
                      placeholder="email@cliente.com" 
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none w-full transition-all duration-300"
                      required
                    />
                  </div>

                  {/* E-mail do Consultor */}
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">E-mail do Consultor (Seu E-mail)</label>
                    <input 
                      type="email" 
                      placeholder="seu-email@empresa.com" 
                      value={consultantEmail}
                      onChange={(e) => setConsultantEmail(e.target.value)}
                      className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none w-full transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Phone & Criar Grupo */}
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Telefone</label>
                    <div className="flex gap-2">
                      <input 
                        type="tel" 
                        placeholder="(11) 99999-9999" 
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none flex-grow transition-all duration-300 font-mono"
                        required
                      />
                      <a 
                        href={`https://wa.me/5581994691175?text=Oi%2C%20vamos%20criar%20o%20grupo.%20Nome%3A%20${encodeURIComponent(clientName)}%20-%20Tel%3A%20${encodeURIComponent(clientPhone)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 bg-[#25d366]/10 border border-[#25d366]/30 hover:bg-[#25d366]/25 text-[#25d366] font-bold text-[10px] rounded-lg uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                      >
                        Criar Grupo
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Endereço Completo</label>
                    <input 
                      type="text" 
                      placeholder="Rua, Número, Bairro, CEP, Cidade/UF" 
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none w-full transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Investimento Total */}
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Investimento Total (R$)</label>
                    <input 
                      type="text" 
                      placeholder="R$ 0,00" 
                      value={totalInvestment}
                      onChange={(e) => setTotalInvestment(formatBRLInput(e.target.value))}
                      className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none w-full transition-all duration-300 font-mono"
                      required
                    />
                  </div>

                  {/* Valor Sinal de Entrada */}
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Valor Sinal de Entrada (R$)
                      </label>
                      {isEntranceTooLow && (
                        <span className="text-[10px] text-red-500 font-bold uppercase animate-pulse">
                          Valor calculado não disponível
                        </span>
                      )}
                    </div>
                    <input 
                      type="text" 
                      placeholder="Ex: R$ 24.000,00" 
                      value={entranceValue}
                      onChange={(e) => setEntranceValue(formatBRLInput(e.target.value))}
                      className={`bg-black/40 border text-white text-xs px-3 py-2 rounded-lg outline-none w-full transition-all duration-300 font-mono ${isEntranceTooLow ? 'border-red-500/50 focus:border-red-500' : 'border-gray-800 focus:border-[#d4af37]'}`}
                    />
                  </div>

                  {/* Forma de Pagamento */}
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Forma de Pagamento (Saldo)</label>
                    <select 
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none w-full transition-all duration-300 cursor-pointer"
                    >
                      <option value="credit">Cartão de Crédito</option>
                      <option value="pix">PIX</option>
                    </select>
                  </div>

                  {/* Simulador de Parcela */}
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Parcelamento do Saldo</label>
                    <select 
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none w-full transition-all duration-300 cursor-pointer"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1}x parcelas</option>
                      ))}
                    </select>
                  </div>

                  {/* Foro da comarca */}
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Foro / Comarca Eleita</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Barueri/SP" 
                      value={contractForo}
                      onChange={(e) => setContractForo(e.target.value)}
                      className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none w-full transition-all duration-300"
                      required
                    />
                  </div>

                </div>

                {/* Dynamic Calculation preview box */}
                <div className="bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-xl p-3.5 mt-2">
                  <span className="text-[9px] text-[#d4af37] font-mono font-bold block mb-1">RESUMO DO FLUXO FINANCEIRO</span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-black/40 rounded-lg border border-gray-900">
                      <span className="text-[8px] text-gray-500 block uppercase font-mono">Entrada (Hoje)</span>
                      <span className="text-white font-mono font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entranceVal)}
                      </span>
                    </div>
                    <div className="p-2 bg-black/40 rounded-lg border border-gray-900">
                      <span className="text-[8px] text-gray-500 block uppercase font-mono">Saldo Financiado</span>
                      <span className="text-white font-mono font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balanceVal)}
                      </span>
                    </div>
                    <div className="p-2 bg-[#d4af37]/10 rounded-lg border border-[#d4af37]/20">
                      <span className="text-[8px] text-[#d4af37] block uppercase font-mono">Parcelamento do Saldo</span>
                      <span className="text-[#ffd700] font-mono font-bold">
                        {installments}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(instValue)}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer Buttons */}
              <div className="border-t border-gray-800 p-4 flex justify-end gap-3 bg-black/20">
                <button 
                  type="button" 
                  onClick={() => setIsContractModalOpen(false)}
                  className="px-4 py-2 border border-gray-800 text-gray-400 hover:text-white font-bold text-[10px] rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  onClick={handleDownloadContract}
                  disabled={isEntranceTooLow}
                  className="px-4 py-2 border border-gray-800 hover:border-[#d4af37]/50 text-gray-400 hover:text-white font-bold text-[10px] rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                >
                  Gerar Rascunho (.DOC)
                </button>
                <button 
                  type="button" 
                  onClick={handleSendD4Sign}
                  disabled={isEntranceTooLow || d4signStatus === 'sending'}
                  className="px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-heading font-extrabold text-[10px] rounded-lg uppercase tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 transition-all cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                >
                  {d4signStatus === 'sending' ? 'Enviando para D4Sign...' : 'Enviar p/ Assinatura (D4Sign)'}
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* FOOTER CONTROLS */}
      <footer className="px-4 md:px-10 py-3.5 md:py-5 flex items-center justify-between z-10 shrink-0 border-t border-[#1b2a3f]/25 bg-gradient-to-t from-[#060b13] to-transparent">
        
        {/* Previous Button */}
        <button 
          onClick={prevSlide}
          className={`flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-accent tracking-wider uppercase transition-colors cursor-pointer ${currentSlide === 0 ? 'text-gray-600 pointer-events-none' : 'text-gray-400 hover:text-white'}`}
        >
          <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Anterior
        </button>

        {/* Slide progress index dots */}
        <div className="flex items-center gap-1.5 md:gap-2 max-w-[40%] overflow-x-auto custom-scrollbar-none">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button 
              key={idx}
              onClick={() => jumpToSlide(idx)}
              className={`w-1.5 md:w-2.5 h-1 md:h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-[#d4af37] w-4 md:w-6' : 'bg-gray-850 hover:bg-gray-700'}`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next Button / Slide indicator */}
        <div className="flex items-center gap-3 md:gap-6">
          <span className="text-[10px] md:text-xs font-mono tracking-widest text-[#d4af37] font-bold">
            {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </span>
          <button 
            onClick={nextSlide}
            className={`flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-accent tracking-wider uppercase transition-colors cursor-pointer ${currentSlide === totalSlides - 1 ? 'text-gray-600 pointer-events-none' : 'text-gray-400 hover:text-white'}`}
          >
            Próximo
            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
      </footer>

    </div>
  );
}
