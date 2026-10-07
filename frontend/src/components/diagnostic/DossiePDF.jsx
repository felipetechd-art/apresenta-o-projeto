import React from 'react';
import { ActionPlanEngine } from '../../domain/governance/actionPlanEngine';

export default function DossiePDF({ data }) {
  if (!data || !data.diagnostic) return null;

  const { diagnostic, results, allAnswers, templates } = data;
  const scores = results.scores || {};
  const gaps = results.gapsIdentificados || [];
  
  const kickoffData = diagnostic.kickoffData || diagnostic.fullData?.diagnosticData || {};
  const clientName = diagnostic.clientName || diagnostic.companyName || 'Cliente';

  // Roda o motor para gerar o plano
  const plan = ActionPlanEngine.generatePlan(diagnostic, allAnswers, templates, results);
  const { summary, initiatives } = plan;

  // Agrupando respostas por papel
  const rolesMap = {
    'DONO': 'Visão do Dono',
    'SOCIO': 'Visão do Sócio',
    'LIDERANCA': 'Visão da Liderança',
    'OPERACAO': 'Visão da Operação'
  };

  const getKickoffLabel = (key) => {
    const map = {
      visao_futuro: 'Visão de Futuro',
      principal_obstaculo: 'Gargalo Crítico',
      atuacao: 'Cenário e Atuação',
      publico_alvo: 'Público Alvo',
      modelo_negocio: 'Modelo de Negócio',
      faturamento: 'Faturamento Atual'
    };
    return map[key] || key.replace(/_/g, ' ');
  };

  // Seção 1: Campos preenchidos
  const fields = ['modelo_negocio', 'faturamento', 'atuacao', 'publico_alvo', 'principal_obstaculo', 'visao_futuro'];
  const filledFields = fields.filter(k => kickoffData[k]);

  // Seção 2: Cálculos e Respostas da Apresentação
  const presentationCalculations = [
    { label: 'Custo de Oportunidade', value: kickoffData.calculatedOpportunityCost ? `R$ ${kickoffData.calculatedOpportunityCost.toLocaleString('pt-BR')}` : null },
    { label: 'Crescimento Perdido', value: kickoffData.calculatedLostGrowth ? `R$ ${kickoffData.calculatedLostGrowth.toLocaleString('pt-BR')}` : null },
    { label: 'Horas de Retrabalho', value: kickoffData.reworkHours ? `${kickoffData.reworkHours}h` : null },
    { label: 'Meta de Crescimento Anual', value: kickoffData.annualGrowth ? `${kickoffData.annualGrowth}%` : null },
  ].filter(i => i.value != null);

  // Helper para renderizar arrays ou strings de respostas da apresentação
  const renderArrayOrString = (val) => {
    if (Array.isArray(val)) return val.join(', ');
    return val;
  };

  const presentationAnswers = [
    { label: 'Grau de Dependência (1-10)', value: kickoffData.ideDependency },
    { label: 'Liberdade Operacional (1-10)', value: kickoffData.cloOperationalFreedom },
    { label: 'Nível de Preparação (0-10)', value: kickoffData.nota_preparacao },
    { label: 'Áreas de Atuação', value: renderArrayOrString(kickoffData.areas_atuacao) },
    { label: 'Maior Ralo', value: renderArrayOrString(kickoffData.maior_ralo) },
    { label: 'Precisa de ajuda?', value: kickoffData.precisa_ajuda },
  ].filter(i => i.value != null && i.value !== '');

  // Respostas da equipe agrupadas
  const validRoles = Object.keys(rolesMap).filter(role => (allAnswers || []).some(a => a.role === role));
  
  let sectionCounter = 1;

  return (
    <div 
      id="dossie-pdf-root" 
      className="bg-white text-neutral-900 font-sans leading-relaxed"
      style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '40px', position: 'absolute', left: '-9999px', top: 0, minHeight: '100vh' }}
    >
      {/* CAPA */}
      <div className="text-center pb-16 mb-16 border-b border-neutral-200 mt-10">
        <h1 className="text-5xl font-black text-neutral-900 tracking-tight mb-4">Dossiê Executivo</h1>
        <p className="text-xl text-[#b5952f] font-bold tracking-widest uppercase mb-6">Governo Empresarial</p>
        <div className="inline-block bg-neutral-100 px-8 py-4 rounded-xl">
          <p className="text-neutral-800 font-bold text-2xl mb-1">{clientName}</p>
          <p className="text-neutral-500 font-mono text-xs uppercase">ID: {diagnostic.id.split('-')[0]}</p>
        </div>
      </div>

      {/* 1. ANÁLISE DE NEGÓCIO */}
      {filledFields.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#b5952f] mb-8 uppercase tracking-widest flex items-center gap-3">
            <span className="text-neutral-300">0{sectionCounter++}.</span> Análise de Negócio
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {filledFields.map((key) => (
              <div key={key} className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 break-inside-avoid">
                <span className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">{getKickoffLabel(key)}</span>
                <p className="text-neutral-800 font-medium text-base">{kickoffData[key]}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. RESULTADOS DOS CÁLCULOS (APRESENTAÇÃO) */}
      {(presentationCalculations.length > 0 || presentationAnswers.length > 0) && (
        <div className="mb-16 html2pdf__page-break">
          <h2 className="text-2xl font-bold text-[#b5952f] mb-8 uppercase tracking-widest flex items-center gap-3">
            <span className="text-neutral-300">0{sectionCounter++}.</span> Resumo da Conversa (Dono)
          </h2>
          
          {presentationCalculations.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-black text-neutral-800 border-b border-neutral-200 pb-3 mb-6 uppercase tracking-wider">Cálculos e Projeções</h3>
              <div className="grid grid-cols-2 gap-4">
                {presentationCalculations.map((calc, i) => (
                  <div key={i} className="bg-neutral-50 p-6 rounded-xl border border-neutral-100">
                    <span className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">{calc.label}</span>
                    <p className="text-xl font-bold text-neutral-900">{calc.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {presentationAnswers.length > 0 && (
            <div>
              <h3 className="text-lg font-black text-neutral-800 border-b border-neutral-200 pb-3 mb-6 uppercase tracking-wider">Percepções do Empresário</h3>
              <div className="grid grid-cols-1 gap-4">
                {presentationAnswers.map((ans, i) => (
                  <div key={i} className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 flex justify-between items-center break-inside-avoid">
                    <span className="text-sm font-bold text-neutral-600">{ans.label}</span>
                    <span className="text-base font-bold text-[#b5952f] text-right max-w-[50%]">{ans.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. RESULTADOS DETALHADOS (MAPA 360) */}
      {validRoles.length > 0 && (
        <div className="mb-16 html2pdf__page-break">
          <h2 className="text-2xl font-bold text-[#b5952f] mb-8 uppercase tracking-widest flex items-center gap-3">
            <span className="text-neutral-300">0{sectionCounter++}.</span> Coleta de Percepções (Mapa 360)
          </h2>
          
          {validRoles.map((role) => {
            const roleAnswers = (allAnswers || []).filter(a => a.role === role);
            return (
              <div key={role} className="mb-12">
                <h3 className="text-lg font-black text-neutral-800 border-b border-neutral-200 pb-3 mb-6 uppercase tracking-wider">
                  {rolesMap[role]} <span className="text-neutral-400 font-normal text-sm lowercase">({roleAnswers.length} avaliações)</span>
                </h3>
                
                {roleAnswers.map((ans, i) => {
                  const template = templates.find(t => t.id === ans.templateId);
                  const questionsList = template ? template.questions : [];

                  return (
                    <div key={i} className="mb-8 bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm break-inside-avoid">
                      <div className="bg-neutral-100 px-6 py-4 border-b border-neutral-200">
                        <span className="font-bold text-sm text-[#b5952f] uppercase tracking-wider">
                          Avaliação {i + 1} {ans.nome ? " • " + ans.nome : ' • Anônimo'}
                        </span>
                      </div>
                      <div className="divide-y divide-neutral-100">
                        {questionsList.map((q, idx) => {
                          const val = ans.answers ? ans.answers[q.id] : undefined;
                          return (
                            <div key={q.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="flex-1">
                                <span className="text-xs font-bold text-neutral-400 mb-1 block">PERGUNTA {idx + 1}</span>
                                <p className="text-sm font-medium text-neutral-800">{q.text}</p>
                              </div>
                              <div className="md:w-1/3 md:text-right shrink-0">
                                <span className="text-xs font-bold text-neutral-400 mb-1 block">RESPOSTA</span>
                                <div className="inline-block bg-neutral-100 px-4 py-2 rounded-lg">
                                  {val !== undefined && val !== "" ? (
                                    <span className="text-base font-bold text-[#b5952f]">{val}</span>
                                  ) : (
                                    <span className="text-neutral-400 italic text-sm">Em branco</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* 4. MAPA 360 E GAPS */}
      {(results.classification || gaps.length > 0) && (
        <div className="mb-16 html2pdf__page-break">
          <h2 className="text-2xl font-bold text-[#b5952f] mb-8 uppercase tracking-widest flex items-center gap-3">
            <span className="text-neutral-300">0{sectionCounter++}.</span> Triangulação e Gaps
          </h2>
          
          <div className="flex gap-6 mb-8 break-inside-avoid">
            <div className="flex-1 bg-neutral-50 border border-neutral-200 p-8 rounded-xl text-center">
              <p className="text-neutral-500 uppercase tracking-widest font-bold text-xs mb-3">Classificação Final</p>
              <p className="text-2xl font-extrabold text-neutral-900">{results.classification || 'N/A'}</p>
            </div>
            <div className="flex-1 bg-[#b5952f]/10 border border-[#b5952f]/20 p-8 rounded-xl text-center">
              <p className="text-[#b5952f] uppercase tracking-widest font-bold text-xs mb-3">Score Geral Mapa 360</p>
              <p className="text-5xl font-black text-[#b5952f]">{summary.scoreGeral}</p>
            </div>
          </div>

          <div className="border border-neutral-200 rounded-xl p-8 mb-8 bg-white shadow-sm break-inside-avoid">
            <h3 className="text-lg font-bold text-neutral-900 mb-6 border-b border-neutral-100 pb-4">
              Principais Gaps Encontrados (Dono vs Time)
            </h3>
            {gaps.length === 0 ? (
              <p className="text-neutral-500 italic bg-neutral-50 p-4 rounded-lg">Nenhuma divergência grave identificada.</p>
            ) : (
              <div className="space-y-4">
                {gaps.map((gap, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                    <div className="flex-1">
                      <p className="font-bold text-sm text-neutral-900 mb-1">{gap.title}</p>
                      <p className="text-xs text-neutral-500">{gap.description}</p>
                    </div>
                    <div className="flex items-center gap-6 shrink-0 ml-6">
                      <div className="text-center">
                        <span className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Dono</span>
                        <span className="text-lg font-bold text-[#b5952f]">{gap.donoScore}</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Time</span>
                        <span className="text-lg font-bold text-neutral-900">{gap.equipeScore}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. PLANO DE AÇÃO */}
      {initiatives && initiatives.length > 0 && (
        <div className="mb-16 html2pdf__page-break">
          <h2 className="text-2xl font-bold text-[#b5952f] mb-8 uppercase tracking-widest flex items-center gap-3">
            <span className="text-neutral-300">0{sectionCounter++}.</span> Plano de Governo 90 Dias
          </h2>
          
          <div className="mb-10 break-inside-avoid">
            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-4">Resumo Estratégico</h3>
            <p className="text-2xl text-neutral-400 leading-relaxed font-light mb-8">
              "{summary.principalConclusao}"
            </p>
            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100">
              <span className="block text-xs font-bold text-[#b5952f] uppercase tracking-widest mb-2">Meta Central dos 90 Dias</span>
              <p className="text-neutral-600 font-bold text-lg">{summary.principalOportunidade}</p>
            </div>
          </div>

          <div className="space-y-8">
            {initiatives.map((init, i) => (
              <div key={i} className="border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-sm break-inside-avoid">
                <div className="bg-neutral-50 border-b border-neutral-200 px-8 py-6">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-xs font-black text-neutral-800 uppercase tracking-widest">Dias {init.timeframe}</span>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{init.movement}</span>
                  </div>
                  <h4 className="text-xl font-bold text-neutral-900">{init.initiativeName}</h4>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="bg-neutral-50 p-6 rounded-xl">
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Achado (Mapa 360)</span>
                      <p className="text-sm text-neutral-700">{init.achado}</p>
                    </div>
                    <div className="bg-neutral-50 p-6 rounded-xl">
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Causa Provável</span>
                      <p className="text-sm text-red-500">{init.causaRaiz}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <span className="block text-[10px] font-bold text-[#b5952f] uppercase tracking-widest mb-2">Ação Implementada</span>
                    <p className="text-neutral-900 text-lg">{init.description}</p>
                  </div>

                  <div className="flex gap-8 border-t border-neutral-100 pt-6 mt-6">
                    <div className="w-1/3">
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Responsável</span>
                      <p className="text-neutral-900 font-bold">{init.responsavel}</p>
                    </div>
                    <div className="w-2/3">
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Indicador / Meta (90D)</span>
                      <p className="text-neutral-700 text-sm mb-3">{init.indicador}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-red-500 font-bold px-3 py-1 bg-red-50 rounded text-sm">{init.metaAtual}</span>
                        <span className="text-neutral-300">→</span>
                        <span className="text-emerald-600 font-bold px-3 py-1 bg-emerald-50 rounded text-sm">{init.metaFutura}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
