import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Cpu, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Share2, 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  ChevronRight,
  Sparkles,
  BarChart3,
  Layers,
  Zap,
  Building2,
  Calendar
} from 'lucide-react';

export function LucroOcultoReport({ report, onBack }) {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link do relatório copiado para a área de transferência!');
  };

  const formatCurrency = (val) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  };

  // Destaca números e valores no texto do segmento
  const emphasize = (text) => {
    if (!text) return text;
    const parts = String(text).split(/(R\$ ?[\d.,]+(?:\/mês)?|\d[\d.,]*h\/mês|\d[\d.,]* horas?|\+?\d+(?:\.\d+)?%|\d[\d.,]*h)/g);
    return parts.map((part, i) => (
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <React.Fragment key={i}>{part}</React.Fragment>
    ));
  };

  const achados = report.achados || {};
  const componentes = report.componentes || {};

  return (
    <div className="min-h-screen bg-[#070b12] text-gray-100 flex flex-col print:bg-white print:text-black">
      
      {/* Action Bar (oculta na impressão) */}
      <div className="print:hidden border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Início
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartilhar</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12">
        
        {/* ==================================================
            CABEÇALHO OFICIAL DO RELATÓRIO
            ================================================== */}
        <div className="border-b border-neutral-800 pb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Relatório Executivo Oficial • {report.dataCalculo}
            </div>
            <div className="text-xs text-neutral-400 font-mono">
              Responsável: <strong className="text-white">{report.empresario}</strong>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-heading font-black text-white tracking-tight uppercase">
              MAPA DO LUCRO OCULTO • <span className="text-amber-400">{report.empresa}</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-300">
              Onde sua empresa está consumindo dinheiro, tempo e capacidade — e como transformar eficiência operacional em crescimento sustentável.
            </p>
          </div>
        </div>

        {/* ==================================================
            SEÇÃO 1 — RESUMO EXECUTIVO
            ================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <BarChart3 className="w-4 h-4" />
            <span>Seção 1 • Resumo Executivo</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Faturamento / Mês</span>
              <span className="text-lg font-heading font-extrabold text-white mt-1">
                {formatCurrency(report.faturamentoMensal)}
              </span>
              <span className="text-[9px] text-neutral-500 mt-1">
                Ano: {formatCurrency(report.faturamento12Meses)}
              </span>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Equipe Total</span>
              <span className="text-lg font-heading font-extrabold text-white mt-1">
                {report.totalColaboradores} pessoas
              </span>
              <span className="text-[9px] text-neutral-500 mt-1">
                Folha: {formatCurrency(report.custoPessoalTotal)}/mês
              </span>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Receita / Colaborador</span>
              <span className="text-lg font-heading font-extrabold text-white mt-1">
                {formatCurrency(report.receitaPorFuncionario)}
              </span>
              <span className="text-[9px] text-neutral-500 mt-1">
                Folha/Receita: {report.custoPessoalSobreReceita.toFixed(1)}%
              </span>
            </div>

            <div className="bg-gradient-to-br from-amber-500/15 to-transparent border border-amber-500/30 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Lucro Oculto / Mês</span>
              <span className="text-xl font-heading font-black text-amber-400 mt-1">
                {formatCurrency(report.lucroOcultoTotalMes)}
              </span>
              <span className="text-[9px] text-amber-300 font-bold mt-1">
                Ano: {formatCurrency(report.lucroOcultoTotalAno)}
              </span>
            </div>

            <div className="bg-gradient-to-br from-blue-500/15 to-transparent border border-blue-500/30 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Capacidade Oculta</span>
              <span className="text-xl font-heading font-black text-blue-400 mt-1">
                {report.horasRecuperaveisMes}h / mês
              </span>
              <span className="text-[9px] text-blue-300 font-bold mt-1">
                ≈ {report.equivalenteJornadas} jornadas de 160h
              </span>
            </div>
          </div>

          {report.produtosServicos && (
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider shrink-0">Produtos & Serviços</span>
              <span className="text-xs text-neutral-300 leading-relaxed">{report.produtosServicos}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Índice IEO</span>
                <div className="text-2xl font-black text-white">{report.ieoTotal}/100</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-400 block">{report.ieoClassificacao}</span>
                <span className="text-[10px] text-neutral-500">Escalabilidade</span>
              </div>
            </div>

            <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Dependência do Dono</span>
                <div className="text-2xl font-black text-white">{report.notaDependenciaDono}/100</div>
              </div>
              <div className="text-right text-[10px] text-neutral-400">
                <span className="block font-bold text-white">{report.horasDonoOperacionalMes}h/mês no operacional</span>
                <span>(0 = dependente, 100 = autônomo)</span>
              </div>
            </div>

            <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Dependência Humana</span>
                <div className="text-2xl font-black text-white">{report.indiceDependenciaHumana}%</div>
              </div>
              <div className="text-right text-[10px] text-neutral-400">
                <span className="block font-bold text-amber-400">Tarefas manuais e repetitivas</span>
                <span>Risco operacional</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SEÇÃO 2 — OS 3 PRINCIPAIS ACHADOS
            ================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Zap className="w-4 h-4" />
            <span>Seção 2 • Os 3 Principais Achados</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-black text-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Onde está o maior desperdício?
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {achados.desperdicio ? emphasize(achados.desperdicio) : (
                  <>Na sobrecarga com <strong>{report.horasManuaisIdentificadas} horas mensais</strong> dedicadas a digitação manual em planilhas, retrabalho e conferências repetitivas entre setores desconectados, drenando aproximadamente <strong>{formatCurrency(report.horasRecuperaveisMes * 35)}/mês</strong> em folha improdutiva.</>
                )}
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Onde está a maior capacidade não aproveitada?
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {achados.capacidade ? emphasize(achados.capacidade) : (
                  <>No tempo da equipe e liderança que poderia estar focado em prospecção, entrega de excelência e fechamento. A operação possui <strong>{report.horasRecuperaveisMes}h/mês recuperáveis</strong> (equivalente a <strong>{report.equivalenteJornadas} colaboradores em tempo integral</strong>).</>
                )}
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 font-black text-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Oportunidade de crescimento sem contratação proporcional
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {achados.crescimento ? emphasize(achados.crescimento) : (
                  <>A empresa possui potencial para crescer aproximadamente <strong>+{report.crescimentoPossivelSemContratar}% em faturamento</strong> antes de precisar abrir novas vagas operacionais, bastando automatizar o fluxo de dados e implantar alçadas de decisão.</>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            SEÇÃO 4 — LUCRO OCULTO FINANCEIRO DETALHADO
            ================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <DollarSign className="w-4 h-4" />
            <span>Seção 4 • Detalhamento do Lucro Oculto Financeiro</span>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold text-white">Composição Econômica Sem Dupla Contagem</h4>
                <p className="text-xs text-neutral-400">Valores classificados entre custos elimináveis, otimizáveis, contratações evitáveis e receita destravável.</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400 uppercase font-bold block">Total Anual Identificado</span>
                <span className="text-2xl font-black text-amber-400">{formatCurrency(report.lucroOcultoTotalAno)}</span>
              </div>
            </div>

            <div className="divide-y divide-neutral-800/80 text-xs">
              <div className="p-4 flex items-center justify-between hover:bg-neutral-800/20">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">1. {componentes.eliminaveis || 'Custos Elimináveis (SaaS ociosos, licenças duplicadas, marketing sem mensuração)'}</span>
                  <span className="text-neutral-400 text-[11px]">Classificação: CÁLCULO INFORMADO • Confiança: ALTA</span>
                </div>
                <span className="font-bold text-white text-sm">{formatCurrency(report.custosEliminaveisMes)} / mês</span>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-neutral-800/20">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">2. {componentes.otimizaveis || 'Custos Otimizáveis (Despesas gerais renegociáveis, redução de perdas)'}</span>
                  <span className="text-neutral-400 text-[11px]">Classificação: ESTIMATIVA CONSERVADORA • Confiança: MÉDIA</span>
                </div>
                <span className="font-bold text-white text-sm">{formatCurrency(report.custosOtimizaveisMes)} / mês</span>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-neutral-800/20">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">3. {componentes.contratacoes || 'Contratações Potencialmente Evitáveis (Absorção de demanda com capacidade recuperada)'}</span>
                  <span className="text-neutral-400 text-[11px]">Classificação: ESTIMATIVA ECONÔMICA • Confiança: ALTA</span>
                </div>
                <span className="font-bold text-white text-sm">{formatCurrency(report.contratacoesEvitaveisMes)} / mês</span>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-neutral-800/20">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">4. {componentes.margem || 'Margem Recuperável (Eliminação de retrabalho e agilidade operacional)'}</span>
                  <span className="text-neutral-400 text-[11px]">Classificação: HIPÓTESE VALIDÁVEL • Confiança: MÉDIA</span>
                </div>
                <span className="font-bold text-white text-sm">{formatCurrency(report.margemRecuperavelMes)} / mês</span>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-neutral-800/20">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">5. {componentes.receita || 'Receita Destravável (Liberação de vendedores para vender + automação de follow-up)'}</span>
                  <span className="text-neutral-400 text-[11px]">Classificação: PROJEÇÃO COMERCIAL • Confiança: MÉDIA</span>
                </div>
                <span className="font-bold text-white text-sm">{formatCurrency(report.receitaDestravavelMes)} / mês</span>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-sm font-bold text-white uppercase tracking-wider">Total Mensal Identificado</span>
              <span className="text-xl font-black text-amber-400">{formatCurrency(report.lucroOcultoTotalMes)} / mês</span>
            </div>
          </div>
        </section>

        {/* ==================================================
            SEÇÃO 5 — CAPACIDADE OCULTA
            ================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Clock className="w-4 h-4" />
            <span>Seção 5 • Capacidade Oculta & Horas Recuperáveis</span>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-neutral-800/40 rounded-xl p-4 border border-neutral-700/50">
                <span className="text-xs text-neutral-400 uppercase font-bold block">Horas Manuais Mapeadas</span>
                <span className="text-2xl font-black text-white mt-1 block">{report.horasManuaisIdentificadas}h / mês</span>
                <span className="text-[11px] text-neutral-500">Planilhas, conferências e retrabalho</span>
              </div>

              <div className="bg-neutral-800/40 rounded-xl p-4 border border-neutral-700/50">
                <span className="text-xs text-neutral-400 uppercase font-bold block">Horas Potencialmente Recuperáveis</span>
                <span className="text-2xl font-black text-amber-400 mt-1 block">{report.horasRecuperaveisMes}h / mês</span>
                <span className="text-[11px] text-amber-300 font-medium">Com automação e padronização</span>
              </div>

              <div className="bg-neutral-800/40 rounded-xl p-4 border border-neutral-700/50">
                <span className="text-xs text-neutral-400 uppercase font-bold block">Equivalente Operacional</span>
                <span className="text-2xl font-black text-blue-400 mt-1 block">≈ {report.equivalenteJornadas} Jornadas</span>
                <span className="text-[11px] text-neutral-500">Base: 160h úteis/mês</span>
              </div>
            </div>

            {/* Aviso ético obrigatório do Prompt Mestre */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3 text-xs text-neutral-300">
              <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-white block font-bold">Nota de Integridade do Diagnóstico:</strong>
                <p className="leading-relaxed">
                  “Capacidade recuperada não é automaticamente redução de folha ou demissão. Ela representa potencial direto para produzir mais, eliminar sobrecarga dos colaboradores e crescer sem contratar na mesma proporção.”
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SEÇÃO 6 — IEO (ÍNDICE DE ESCALABILIDADE OPERACIONAL)
            ================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Cpu className="w-4 h-4" />
            <span>Seção 6 • IEO — Índice de Escalabilidade Operacional</span>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h4 className="text-xl font-black text-white">Pontuação Geral: {report.ieoTotal} / 100</h4>
                <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mt-0.5">
                  Classificação: {report.ieoClassificacao}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-neutral-400 block font-medium">Meta para os Próximos 90 Dias</span>
                <span className="text-xs text-white font-bold">{report.ieoProximoPatamar}</span>
              </div>
            </div>

            {/* Barras de progresso dos pilares */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-neutral-300">1. Processos e Rotinas</span>
                  <span className="text-amber-400">{report.scoreProcessos} / 20</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(report.scoreProcessos / 20) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-neutral-300">2. Tecnologia & Integração</span>
                  <span className="text-amber-400">{report.scoreTecnologia} / 20</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(report.scoreTecnologia / 20) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-neutral-300">3. Produtividade & Capacidade</span>
                  <span className="text-amber-400">{report.scoreProdutividade} / 20</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(report.scoreProdutividade / 20) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-neutral-300">4. Gestão & Indicadores</span>
                  <span className="text-amber-400">{report.scoreGestao} / 15</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(report.scoreGestao / 15) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-neutral-300">5. Independência da Liderança</span>
                  <span className="text-amber-400">{report.scoreLideranca} / 15</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(report.scoreLideranca / 15) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-neutral-300">6. Automação & IA</span>
                  <span className="text-amber-400">{report.scoreAutomacao} / 10</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(report.scoreAutomacao / 10) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SEÇÃO 7 — DESEMPENHO COMERCIAL (LINGUAGEM DO SEGMENTO)
            ================================================== */}
        {report.comercial && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <TrendingUp className="w-4 h-4" />
            <span>Seção 7 • {report.comercialTitle || 'Desempenho Comercial'}</span>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-neutral-800/40 border border-neutral-700/60 rounded-xl p-3.5 flex flex-col justify-between">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{report.leadsTermo || 'Leads / Contatos'}</span>
                <span className="text-xl font-heading font-extrabold text-white mt-1">{report.comercial.leadsMes}</span>
                <span className="text-[9px] text-neutral-500 mt-1">por mês</span>
              </div>

              <div className="bg-neutral-800/40 border border-neutral-700/60 rounded-xl p-3.5 flex flex-col justify-between">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{report.vendasTermo || 'Vendas / Contratos'}</span>
                <span className="text-xl font-heading font-extrabold text-white mt-1">{report.comercial.vendasMes}</span>
                <span className="text-[9px] text-neutral-500 mt-1">por mês</span>
              </div>

              <div className="bg-neutral-800/40 border border-neutral-700/60 rounded-xl p-3.5 flex flex-col justify-between">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Taxa de Conversão</span>
                <span className="text-xl font-heading font-extrabold text-amber-400 mt-1">{report.comercial.taxaConversao}%</span>
                <span className="text-[9px] text-neutral-500 mt-1">contato → venda</span>
              </div>

              <div className="bg-neutral-800/40 border border-neutral-700/60 rounded-xl p-3.5 flex flex-col justify-between">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Receita por Vendedor</span>
                <span className="text-xl font-heading font-extrabold text-white mt-1">{formatCurrency(report.comercial.receitaPorVendedor)}</span>
                <span className="text-[9px] text-neutral-500 mt-1">por mês</span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed border-t border-neutral-800 pt-4">
              {emphasize(
                `Atendimento/vendas mensais: ~${report.clientesMes || 0} ${report.clienteTermo || 'clientes'} (${report.unidadeVenda || 'unidade de venda'}). ` +
                `Time comercial: ${report.comercial.vendedores} ${report.comercial.vendedores === 1 ? 'vendedor' : 'vendedores'}` +
                `${report.comercial.sdrs > 0 ? ` e ${report.comercial.sdrs} SDR(s)` : ''} — conversão atual de ${report.leadsTermo || 'leads'} em ${report.vendasTermo || 'vendas'}: ${report.comercial.taxaConversao}%.`
              )}
            </p>
          </div>
        </section>
        )}

        {/* ==================================================
            SEÇÃO 12 — TOP 5 LUCROS OCULTOS DETALHADOS
            ================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Target className="w-4 h-4" />
            <span>Seção 12 • Top 5 Lucros Ocultos da Sua Operação</span>
          </div>

          <div className="space-y-3">
            {report.top5.map((item) => (
              <div 
                key={item.ranking}
                className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 space-y-3 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-xs flex items-center justify-center">
                      #{item.ranking}
                    </span>
                    <h4 className="text-base font-bold text-white">{item.titulo}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md w-fit">
                    {item.quantoRepresenta}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-500 font-bold uppercase text-[10px] block">O que está acontecendo</span>
                    <p className="text-neutral-300 mt-0.5">{item.oQueEstaAcontecendo}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-bold uppercase text-[10px] block">O que deve mudar</span>
                    <p className="text-neutral-300 mt-0.5">{item.oQueDeveMudar}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-bold uppercase text-[10px] block">Como resolver</span>
                    <p className="text-neutral-300 mt-0.5">{item.comoResolver}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-bold uppercase text-[10px] block">Tecnologia & Prazo</span>
                    <p className="text-amber-400 font-medium mt-0.5">{item.tecnologiaNecessaria}</p>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block font-mono">Prazo: {item.prazo} • {item.nivelConfianca}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================
            SEÇÃO 13 — QUICK WINS (PRIMEIROS 30 DIAS)
            ================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Zap className="w-4 h-4" />
            <span>Seção 13 • Quick Wins — Plano dos Primeiros 30 Dias</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {report.quickWins.map((qw, idx) => (
              <div key={idx} className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    Prazo: {qw.prazo}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-400">
                    Resp: {qw.responsavel}
                  </span>
                </div>
                <h5 className="text-sm font-bold text-white">{qw.acao}</h5>
                <div className="text-xs text-neutral-300 space-y-1 pt-1 border-t border-neutral-800/80">
                  <p><strong>Objetivo:</strong> {qw.objetivo}</p>
                  <p className="text-amber-300 font-medium"><strong>Resultado esperado:</strong> {qw.resultado}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================
            SEÇÃO 14 — PLANO ESTRUTURADO DE 90 DIAS
            ================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Calendar className="w-4 h-4" />
            <span>Seção 14 • Esteira de Execução — Plano de 90 Dias</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Fase 1 • 0 a 30 Dias</span>
                <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">Eliminar</span>
              </div>
              <h5 className="text-sm font-bold text-white">{report.plano90Dias.fase1.foco}</h5>
              <ul className="text-xs text-neutral-300 space-y-2 list-disc pl-4">
                {report.plano90Dias.fase1.acoes.map((ac, i) => (
                  <li key={i}>{ac}</li>
                ))}
              </ul>
            </div>

            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Fase 2 • 31 a 60 Dias</span>
                <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">Integrar</span>
              </div>
              <h5 className="text-sm font-bold text-white">{report.plano90Dias.fase2.foco}</h5>
              <ul className="text-xs text-neutral-300 space-y-2 list-disc pl-4">
                {report.plano90Dias.fase2.acoes.map((ac, i) => (
                  <li key={i}>{ac}</li>
                ))}
              </ul>
            </div>

            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Fase 3 • 61 a 90 Dias</span>
                <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">Escalar</span>
              </div>
              <h5 className="text-sm font-bold text-white">{report.plano90Dias.fase3.foco}</h5>
              <ul className="text-xs text-neutral-300 space-y-2 list-disc pl-4">
                {report.plano90Dias.fase3.acoes.map((ac, i) => (
                  <li key={i}>{ac}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ==================================================
            SEÇÃO 15 — CENÁRIO ATUAL VS POTENCIAL
            ================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <TrendingUp className="w-4 h-4" />
            <span>Seção 15 • Comparativo: Cenário Atual vs Cenário Potencial</span>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-900 border-b border-neutral-800 text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                  <th className="p-3.5">Métrica Operacional</th>
                  <th className="p-3.5 text-neutral-300">Cenário Atual</th>
                  <th className="p-3.5 text-amber-400">Cenário Potencial (Após 90 Dias)</th>
                  <th className="p-3.5 text-green-400">Ganho Econômico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                <tr className="hover:bg-neutral-800/20">
                  <td className="p-3.5 font-bold text-white">Faturamento Mensal</td>
                  <td className="p-3.5">{formatCurrency(report.faturamentoMensal)}</td>
                  <td className="p-3.5 font-bold text-amber-400">{formatCurrency(report.faturamentoMensal + report.receitaDestravavelMes)}</td>
                  <td className="p-3.5 font-bold text-green-400">+{formatCurrency(report.receitaDestravavelMes)}/mês</td>
                </tr>
                <tr className="hover:bg-neutral-800/20">
                  <td className="p-3.5 font-bold text-white">Horas Manuais / Retrabalho</td>
                  <td className="p-3.5">{report.horasManuaisIdentificadas}h / mês</td>
                  <td className="p-3.5 font-bold text-amber-400">{Math.round(report.horasManuaisIdentificadas * 0.35)}h / mês</td>
                  <td className="p-3.5 font-bold text-green-400">-{report.horasRecuperaveisMes}h livres/mês</td>
                </tr>
                <tr className="hover:bg-neutral-800/20">
                  <td className="p-3.5 font-bold text-white">Receita por Colaborador</td>
                  <td className="p-3.5">{formatCurrency(report.receitaPorFuncionario)}</td>
                  <td className="p-3.5 font-bold text-amber-400">{formatCurrency(Math.round((report.faturamentoMensal + report.receitaDestravavelMes) / report.totalColaboradores))}</td>
                  <td className="p-3.5 font-bold text-green-400">+15% a 25% de produtividade</td>
                </tr>
                <tr className="hover:bg-neutral-800/20">
                  <td className="p-3.5 font-bold text-white">Horas do Dono no Operacional</td>
                  <td className="p-3.5">{report.horasDonoOperacionalMes}h / mês</td>
                  <td className="p-3.5 font-bold text-amber-400">&lt; 20h / mês</td>
                  <td className="p-3.5 font-bold text-green-400">+{Math.max(10, report.horasDonoOperacionalMes - 20)}h para estratégia</td>
                </tr>
                <tr className="hover:bg-neutral-800/20">
                  <td className="p-3.5 font-bold text-white">Índice IEO</td>
                  <td className="p-3.5">{report.ieoTotal}/100 ({report.ieoClassificacao})</td>
                  <td className="p-3.5 font-bold text-amber-400">{Math.min(95, report.ieoTotal + 25)}/100 (OPERAÇÃO ESCALÁVEL)</td>
                  <td className="p-3.5 font-bold text-green-400">+25 pontos em alavancagem</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ==================================================
            SEÇÃO 17 — RECOMENDAÇÃO EXECUTIVA (SE EU FOSSE O CEO...)
            ================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Building2 className="w-4 h-4" />
            <span>Seção 17 • Recomendação Executiva do Especialista</span>
          </div>

          <div className="bg-gradient-to-r from-amber-500/10 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-2xl p-6 space-y-4">
            <h4 className="text-base sm:text-lg font-bold text-white">
              “Se eu fosse o CEO desta empresa hoje, estas seriam as 3 primeiras decisões imediatas:”
            </h4>

            <div className="space-y-3">
              {report.recomendacoesCeo.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 bg-neutral-900/80 border border-neutral-800 rounded-xl p-4">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-neutral-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================
            SEÇÃO 18 — CONCLUSÃO & PRÓXIMOS PASSOS
            ================================================== */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 text-center">
          <div className="max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              O seu próximo nível de escala começa agora.
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              “Seu próximo patamar de crescimento não depende necessariamente de adicionar mais estrutura. O primeiro passo é extrair mais capacidade da estrutura que sua empresa já possui.”
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2">
            <div className="bg-neutral-800/50 rounded-xl p-3 border border-neutral-700/50">
              <span className="text-[10px] text-neutral-400 font-bold uppercase block">Lucro Oculto / Ano</span>
              <span className="text-base font-black text-amber-400">{formatCurrency(report.lucroOcultoTotalAno)}</span>
            </div>
            <div className="bg-neutral-800/50 rounded-xl p-3 border border-neutral-700/50">
              <span className="text-[10px] text-neutral-400 font-bold uppercase block">Capacidade Recuperável</span>
              <span className="text-base font-black text-blue-400">{report.horasRecuperaveisMes}h / mês</span>
            </div>
            <div className="bg-neutral-800/50 rounded-xl p-3 border border-neutral-700/50">
              <span className="text-[10px] text-neutral-400 font-bold uppercase block">IEO Atual</span>
              <span className="text-base font-black text-white">{report.ieoTotal} / 100</span>
            </div>
            <div className="bg-neutral-800/50 rounded-xl p-3 border border-neutral-700/50">
              <span className="text-[10px] text-neutral-400 font-bold uppercase block">IEO Alvo 90 Dias</span>
              <span className="text-base font-black text-green-400">{Math.min(95, report.ieoTotal + 25)} / 100</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Relatório Completo</span>
            </button>
            <button
              onClick={onBack}
              className="py-3 px-6 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-neutral-700 cursor-pointer"
            >
              Voltar ao Início
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
