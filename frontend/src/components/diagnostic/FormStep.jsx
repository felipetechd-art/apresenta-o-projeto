import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronRight, Save, Loader2, Users, FileText, Link as LinkIcon, Copy } from 'lucide-react';
import { questionnaireService } from '../../services/questionnaireService';
import { useAuth } from '../../contexts/AuthContext';

export default function FormStep({ diagnostic, onComplete, onBack }) {
  const { user } = useAuth(); // Assume admin/consultant ou dono logado
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('DONO');
  
  // Respostas (apenas para o dono)
  const [responses, setResponses] = useState({});
  const [saving, setSaving] = useState(false);
  const [allAnswers, setAllAnswers] = useState([]);

  // Targets de colaboradores/sócios (mock para UI, deveria idealmente vir do firebase)
  const [targets, setTargets] = useState({
    OPERACAO: 20,
    SOCIO: 2,
    LIDERANCA: 5
  });

  const roles = ['DONO', 'OPERACAO', 'SOCIO', 'LIDERANCA'];

  useEffect(() => {
    loadData();
  }, [diagnostic.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const allTemplates = await questionnaireService.getTemplates();
      // Remove duplicates se houver
      const uniqueTemplates = Array.from(new Map(allTemplates.map(t => [t.targetRole, t])).values());
      setTemplates(uniqueTemplates);
      
      const answers = await questionnaireService.getAnswersByDiagnostic(diagnostic.id);
      setAllAnswers(answers || []);
      
      // Se já houver respostas do DONO, carrega
      if (user?.uid && answers) {
        const myAnswers = answers.find(a => a.userId === user.uid && a.roleId === 'DONO');
        if (myAnswers) {
          setResponses(myAnswers.responses || {});
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.uid) return alert("Usuário não identificado");
    
    setSaving(true);
    try {
      await questionnaireService.saveAnswers(diagnostic.id, user.uid, 'DONO', responses);
      alert("Respostas salvas com sucesso!");
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar respostas");
    } finally {
      setSaving(false);
    }
  };

  const copyLink = (role) => {
    const link = `${window.location.origin}/responder/${diagnostic.id}?role=${role}`;
    navigator.clipboard.writeText(link);
    alert(`Link para ${role} copiado: ${link}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
      </div>
    );
  }

  // O dono responde ele mesmo, os outros são links
  const donoTemplate = templates.find(t => t.targetRole === 'DONO');
  const donoQuestions = donoTemplate?.questions || [];

  return (
    <div className="flex flex-col h-full animate-fade-in pb-20 px-4 md:px-8 pt-8 max-w-6xl mx-auto w-full">
      
      <div className="mb-10">
        <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-4 block">Fase 3 a 5</span>
        <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white leading-tight mb-4">
          Coleta de <span className="text-[#d4af37]">Percepções</span>
        </h2>
        <p className="text-gray-400">
          Gerencie o envio dos links para a equipe e responda a avaliação do Dono.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
        {roles.map(role => (
          <button 
            key={role}
            onClick={() => setActiveTab(role)}
            className={`px-4 py-2 rounded-lg text-sm font-bold tracking-wider uppercase transition-all ${
              activeTab === role 
                ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/50' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {role === 'SOCIO' ? 'SÓCIOS' : role === 'OPERACAO' ? 'OPERAÇÃO' : role}
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 mb-8 min-h-[400px]">
        {activeTab === 'DONO' && (
          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-8 flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#d4af37]" /> Questionário do Dono
            </h3>
            
            <p className="text-gray-400 mb-8 text-sm">Estas perguntas devem ser respondidas diretamente pelo empresário (ou feitas a ele durante a reunião).</p>

            <div className="space-y-12">
              {donoQuestions.map((q, idx) => (
                <div key={q.id} className="group">
                  <label className="block text-sm md:text-base font-bold text-gray-200 mb-4">
                    <span className="text-[#d4af37] mr-2">{idx + 1}.</span> 
                    {q.text}
                  </label>

                  {q.type === 'escala_0_10' && (
                    <div className="flex flex-wrap gap-2">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                        <button 
                          key={val}
                          onClick={() => handleAnswerChange(q.id, val)}
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 text-sm md:text-base font-bold transition-all flex items-center justify-center ${
                            responses[q.id] === val 
                              ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#d4af37] transform scale-110' 
                              : 'border-gray-700 text-gray-400 hover:border-[#d4af37] hover:text-[#d4af37] bg-black/40'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  )}

                  {(q.type === 'texto_curto' || q.type === 'texto_longo') && (
                    <textarea 
                      value={responses[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className={`w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-sm p-4 rounded-xl outline-none transition-all resize-none ${q.type === 'texto_longo' ? 'min-h-[120px]' : 'min-h-[60px]'}`}
                      placeholder="Sua resposta..."
                    />
                  )}

                  {q.type === 'multipla_escolha' && (
                    <div className="flex flex-wrap gap-3">
                      {(q.options || ['Sim', 'Não']).map(opt => (
                        <button 
                          key={opt}
                          onClick={() => handleAnswerChange(q.id, opt)}
                          className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                            responses[q.id] === opt 
                              ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]' 
                              : 'border-gray-700 text-gray-400 hover:border-[#d4af37] bg-black/40'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {donoQuestions.length === 0 && (
                <p className="text-gray-500 italic">Nenhuma pergunta configurada para o DONO.</p>
              )}
            </div>
          </div>
        )}

        {activeTab !== 'DONO' && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-3">
              <LinkIcon className="w-5 h-5 text-[#d4af37]" /> Link de Pesquisa - {activeTab === 'SOCIO' ? 'Sócios' : activeTab === 'OPERACAO' ? 'Operação' : 'Liderança'}
            </h3>
            
            <p className="text-gray-400 mb-8 text-sm max-w-2xl">
              {activeTab === 'SOCIO' 
                ? 'Este link pedirá o nome do sócio antes de iniciar a pesquisa. As respostas ficarão identificadas.'
                : 'Este link é TOTALMENTE OCULTO e ANÔNIMO. Peça que respondam com total sinceridade.'}
            </p>

            <div className="bg-black/30 border border-gray-800 rounded-xl p-6 mb-12 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 w-full">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 block">Link de envio</label>
                <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                  <input 
                    type="text" 
                    readOnly 
                    value={`${window.location.origin}/responder/${diagnostic.id}?role=${activeTab}`}
                    className="bg-transparent flex-1 px-4 py-3 text-sm text-gray-300 outline-none"
                  />
                  <button 
                    onClick={() => copyLink(activeTab)}
                    className="bg-neutral-800 hover:bg-neutral-700 px-6 py-3 flex items-center gap-2 text-white font-bold text-sm transition-colors border-l border-neutral-800"
                  >
                    <Copy className="w-4 h-4" /> Copiar
                  </button>
                </div>
              </div>

              <div className="w-full md:w-48">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 block">Meta de Respostas</label>
                <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                  <input 
                    type="number" 
                    value={targets[activeTab]}
                    onChange={(e) => setTargets(prev => ({...prev, [activeTab]: parseInt(e.target.value) || 0}))}
                    className="bg-transparent w-full px-4 py-3 text-sm text-white outline-none font-bold text-center"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Resultados / Status */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Status do Preenchimento</h4>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] px-4 py-2 rounded-lg font-bold text-2xl">
                  {allAnswers.filter(a => a.roleId === activeTab).length} <span className="text-sm font-normal text-gray-400">/ {targets[activeTab]} respostas</span>
                </div>
                <div className="text-sm text-gray-500">
                  O link será bloqueado automaticamente após atingir {targets[activeTab]} respostas.
                </div>
              </div>

              {allAnswers.filter(a => a.roleId === activeTab).length === 0 ? (
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 text-center">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">Aguardando respostas da equipe...</p>
                  <p className="text-xs text-gray-600 mt-2">Assim que a equipe começar a preencher, o consolidado aparecerá aqui.</p>
                </div>
              ) : (
                <div className="bg-white/5 border border-[#d4af37]/20 rounded-xl p-6">
                  <p className="text-[#d4af37] font-bold mb-4">
                    Temos {allAnswers.filter(a => a.roleId === activeTab).length} pessoa(s) que já responderam.
                  </p>
                  {/* Future feature: Render actual charts or tables here based on answers */}
                  <p className="text-sm text-gray-400">O cruzamento automático das respostas estará disponível no final do módulo de coleta.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 mt-auto pt-8 border-t border-white/5">
        <button 
          onClick={onBack}
          className="w-full md:w-auto px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors"
        >
          Voltar
        </button>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {activeTab === 'DONO' && (
            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all border border-gray-700 text-gray-300 hover:bg-white/5"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar Rascunho
            </button>
          )}

          <button 
            onClick={onComplete}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all bg-[#d4af37] text-black hover:bg-[#b5952f] shadow-[0_0_20px_rgba(212,175,55,0.3)] transform hover:scale-105"
          >
            Finalizar Módulo
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
