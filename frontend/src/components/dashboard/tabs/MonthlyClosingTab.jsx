import React, { useState, useEffect } from 'react';
import { Save, Eye, AlertTriangle, ArrowRight, Calendar, CheckCircle, X } from 'lucide-react';
import { calculateProvisionalIDE, calculateCLO, calculateAutonomy, calculateRecentralization, calculateProcessMaturity } from '../../../domain/governance/calculations';

export function MonthlyClosingTab({ dashboardData, onNavigate }) {
  const { snapshots, saveClosing, roadmapProgress, month: currentSystemMonth } = dashboardData;
  
  // O mês ativo que o usuário está fechando (default para o próximo mês a ser fechado)
  const [selectedMonth, setSelectedMonth] = useState(currentSystemMonth);
  
  // Pegar snapshot existente para este mês, se houver
  const existingSnapshot = snapshots.find(s => s.month === selectedMonth);
  const isReadOnly = existingSnapshot?.status === 'validated';
  const isAdvisor = dashboardData.actor?.role === 'advisor';
  
  // Pegar mês anterior para comparação
  const previousSnapshot = snapshots.find(s => s.month === selectedMonth - 1);

  // Form State (Dados Brutos Ojetivos)
  const [formData, setFormData] = useState({
    totalHours: 44,
    operationalHours: 0,
    decisionsToOwner: 0,
    decisionsByLeaders: 0,
    delegatedResponsibilities: 0,
    recentralizedResponsibilities: 0,
    priorityProcesses: 0,
    documentedProcesses: 0,
    processAdherence: 0
  });

  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('draft');
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  // Populate form se existir rascunho
  useEffect(() => {
    if (existingSnapshot) {
      setFormData(existingSnapshot.rawData);
      setNotes(existingSnapshot.notes || '');
      setStatus(existingSnapshot.status);
    } else {
      setFormData({
        totalHours: 44,
        operationalHours: 0,
        decisionsToOwner: 0,
        decisionsByLeaders: 0,
        delegatedResponsibilities: 0,
        recentralizedResponsibilities: 0,
        priorityProcesses: 0,
        documentedProcesses: 0,
        processAdherence: 0
      });
      setNotes('');
      setStatus('draft');
    }
  }, [existingSnapshot, selectedMonth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : Number(value);
    setFormData(prev => ({ ...prev, [name]: numValue }));
    // Clear field error
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const values = { ...formData };

    for (const key in values) {
      if (values[key] === '' || values[key] < 0) {
        newErrors[key] = 'Valor não pode ser negativo ou vazio.';
      }
    }

    if (values.operationalHours > values.totalHours) {
      newErrors.operationalHours = 'Horas operacionais não podem exceder horas totais.';
    }

    if (values.documentedProcesses > values.priorityProcesses) {
      newErrors.documentedProcesses = 'Processos documentados não podem exceder processos prioritários.';
    }

    if (values.recentralizedResponsibilities > values.delegatedResponsibilities) {
      newErrors.recentralizedResponsibilities = 'Responsabilidades recentralizadas não podem exceder as delegadas.';
    }

    if (values.processAdherence > 100) {
      newErrors.processAdherence = 'Aderência não pode exceder 100%.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  const handleSave = (targetStatus) => {
    if (validateForm()) {
      saveClosing(
        selectedMonth, 
        new Date().toISOString(), 
        formData, 
        roadmapProgress, 
        targetStatus, 
        notes
      );
      setShowPreview(false);
      
      if ((targetStatus === 'submitted' || targetStatus === 'validated') && onNavigate) {
        onNavigate('dashboard');
      }
    }
  };

  // Funções para renderizar os campos
  const renderField = (label, name, tooltip, addon = null) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider" title={tooltip}>
          {label}
        </label>
        {tooltip && <span className="text-[10px] text-gray-500 mb-1 leading-tight">{tooltip}</span>}
        <div className="relative">
          <input 
            type="number" 
            name={name}
            value={formData[name]}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full bg-black/40 border ${errors[name] ? 'border-red-500' : 'border-gray-800 focus:border-[var(--color-primary-yellow)]'} rounded-lg px-3 py-2 text-white font-bold outline-none transition-colors`}
          />
          {addon && <span className="absolute right-3 top-2.5 text-xs text-gray-500 font-bold">{addon}</span>}
        </div>
        {errors[name] && <span className="text-[10px] text-red-400">{errors[name]}</span>}
      </div>
    );
  };

  // Preview Calculations
  const calcPreview = () => {
    return {
      clo: calculateCLO(formData.operationalHours, formData.totalHours),
      autonomy: calculateAutonomy(formData.decisionsByLeaders, formData.decisionsToOwner),
      recentralization: calculateRecentralization(formData.recentralizedResponsibilities, formData.delegatedResponsibilities),
      processMaturity: calculateProcessMaturity(formData.priorityProcesses, formData.documentedProcesses, formData.processAdherence),
      ide: calculateProvisionalIDE({
        decisionsToOwner: formData.decisionsToOwner,
        decisionsByLeaders: formData.decisionsByLeaders,
        operationalHours: formData.operationalHours,
        totalHours: formData.totalHours,
        priorityProcesses: formData.priorityProcesses,
        independentProcesses: formData.priorityProcesses - formData.documentedProcesses,
        recentralized: formData.recentralizedResponsibilities,
        delegated: formData.delegatedResponsibilities
      })
    };
  };

  const previewMetrics = showPreview ? calcPreview() : null;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header do Fechamento */}
      <div className="glass-card rounded-xl p-4 flex items-center justify-between border-l-4 border-[var(--color-primary-yellow)]">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--color-primary-yellow)]" />
            Fechamento de Caixa do Empresário
          </h2>
          <p className="text-xs text-gray-400 mt-1">Colete dados absolutos. Os índices serão calculados pelo algoritmo governamental.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-500 uppercase">Mês de Referência:</span>
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-black/50 border border-[var(--color-primary-yellow)]/30 rounded px-3 py-1.5 text-[var(--color-primary-yellow)] font-bold outline-none cursor-pointer"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i+1} value={i+1}>Mês {i+1}</option>
            ))}
          </select>
        </div>
      </div>

      {status === 'validated' && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3 text-green-400">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-bold">Fechamento Mensal Validado. Dados bloqueados para edição para preservar histórico.</span>
        </div>
      )}

      {/* Formulário Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bloco: Tempo do Fundador */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-xs font-bold text-[var(--color-primary-yellow)] uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
            Pilar: Tempo & Liberdade
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {renderField('Horas Trabalhadas', 'totalHours', 'O total de horas brutas que o dono trabalhou no mês.', 'h')}
            {renderField('Horas Operacionais', 'operationalHours', 'Daquelas horas totais, quantas foram gastas apagando incêndio ou no operacional.', 'h')}
          </div>
        </div>

        {/* Bloco: Delegação e Decisões */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-xs font-bold text-[var(--color-primary-yellow)] uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
            Pilar: Delegação & Alçadas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {renderField('Decisões p/ Dono', 'decisionsToOwner', 'Quantas vezes a equipe precisou acionar o dono no mês para perguntar o que fazer.')}
            {renderField('Decisões p/ Líderes', 'decisionsByLeaders', 'Quantas decisões foram tomadas diretamente pela equipe, sem incomodar o dono.')}
            {renderField('Responsabilidades Delegadas', 'delegatedResponsibilities', 'Quantas tarefas ou projetos o dono transferiu para a equipe no mês.')}
            {renderField('Responsabilidades Devolvidas', 'recentralizedResponsibilities', 'Dessas tarefas delegadas, quantas o dono teve que puxar de volta.')}
          </div>
        </div>

        {/* Bloco: Processos */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-xs font-bold text-[var(--color-primary-yellow)] uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
            Pilar: Processos
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {renderField('Processos Prioritários', 'priorityProcesses', 'A quantidade de processos \\"core\\" (principais) que a empresa precisa ter rodando.')}
            {renderField('Processos Documentados', 'documentedProcesses', 'Desses processos prioritários, quantos já estão mapeados/documentados (POP).')}
            <div className="col-span-2">
              {renderField('Aderência aos Processos', 'processAdherence', 'A porcentagem (0 a 100%) que representa o quanto a equipe de fato usa e segue o processo documentado no dia a dia.', '%')}
            </div>
          </div>
        </div>

        {/* Bloco: Roadmap (Read Only) & Observações */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-[var(--color-primary-yellow)] uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              Roadmap & Notas
            </h3>
            <div className="mb-4 bg-black/30 rounded-lg p-3 border border-gray-800 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase">Avanço do Roadmap:</span>
              <span className="text-lg font-bold text-white">
                {roadmapProgress !== null ? `${roadmapProgress.toFixed(1)}%` : <span className="text-sm font-medium text-gray-500 italic">Aguardando medição</span>}
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Observações do Fechamento</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isReadOnly}
                className="w-full bg-black/40 border border-gray-800 focus:border-[var(--color-primary-yellow)] rounded-lg px-3 py-2 text-white text-sm outline-none resize-none h-24"
                placeholder="Ex: Tivemos uma crise no comercial que impactou as horas operacionais..."
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            {!isReadOnly && (
              <>
                <button 
                  onClick={() => handleSave('draft')}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg text-xs uppercase font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-gray-800 cursor-pointer flex items-center justify-center text-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Rascunho
                </button>
                <button 
                  onClick={handlePreview}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg text-xs uppercase font-bold text-black bg-[var(--color-primary-yellow)] hover:bg-[var(--color-primary-yellow-dark)] transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer flex items-center justify-center text-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar Impacto
                </button>
              </>
            )}

            {status === 'submitted' && isAdvisor && (
               <>
                 <button 
                   onClick={() => {
                     const reason = prompt("Motivo da devolução:");
                     if (reason) dashboardData.returnClosing(existingSnapshot.id, reason);
                   }}
                   className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg text-xs uppercase font-bold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer flex justify-center text-center"
                 >
                   Devolver p/ Correção
                 </button>
                 <button 
                   onClick={() => dashboardData.validateClosing(existingSnapshot.id)}
                   className="px-4 py-2 rounded-lg text-xs uppercase font-bold text-white bg-green-600 hover:bg-green-700 transition-colors cursor-pointer"
                 >
                   Validar Fechamento
                 </button>
               </>
            )}

            {isReadOnly && isAdvisor && (
               <button 
                 onClick={() => {
                   if (window.confirm("Isso criará uma nova revisão em Rascunho para este mês. Deseja continuar?")) {
                     dashboardData.createRevision(selectedMonth);
                   }
                 }}
                 className="px-4 py-2 rounded-lg text-xs uppercase font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-gray-800 cursor-pointer"
               >
                 Autorizar Nova Revisão
               </button>
            )}
          </div>
        </div>

      </div>

      {/* Modal de Prévia */}
      {showPreview && previewMetrics && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#080f1e] border border-[var(--color-primary-yellow)]/30 rounded-xl p-6 w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[var(--color-primary-yellow)]" />
                Impacto Gerado no Painel
              </h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-white cursor-pointer"><X className="w-5 h-5"/></button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-black/40 p-4 rounded-lg border border-gray-800 text-center">
                <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1">IDE (Prévia)</span>
                <span className="text-2xl font-bold text-white">{previewMetrics.ide}%</span>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border border-gray-800 text-center">
                <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1">CLO</span>
                <span className="text-2xl font-bold text-white">{previewMetrics.clo}%</span>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border border-gray-800 text-center">
                <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Autonomia</span>
                <span className="text-2xl font-bold text-white">{previewMetrics.autonomy}%</span>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border border-gray-800 text-center">
                <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Processos</span>
                <span className="text-2xl font-bold text-white">{previewMetrics.processMaturity}%</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button 
                onClick={() => setShowPreview(false)}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg text-xs uppercase font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer border border-gray-800 flex justify-center text-center"
              >
                Voltar e Editar
              </button>
              <button 
                onClick={() => handleSave('submitted')}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg text-xs uppercase font-bold text-black bg-[var(--color-primary-yellow)] hover:bg-[#b8860b] transition-colors cursor-pointer flex items-center justify-center text-center gap-2"
              >
                Confirmar Fechamento <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
