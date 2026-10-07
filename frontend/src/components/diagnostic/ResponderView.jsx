import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Loader2, Shield, Send, CheckCircle2 } from 'lucide-react';
import { questionnaireService } from '../../services/questionnaireService';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ResponderView() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'OPERACAO';
  
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState(null);

  const isIdentified = role === 'SOCIO';

  useEffect(() => {
    loadData();
  }, [id, role]);

  const loadData = async () => {
    try {
      // Pega dados do diag
      const diagDoc = await getDoc(doc(db, 'diagnostics', id));
      if (diagDoc.exists()) {
        setDiagnosticInfo(diagDoc.data());
      }

      // Pega template
      const allTemplates = await questionnaireService.getTemplates(role);
      if (allTemplates.length > 0) {
        setQuestions(allTemplates[0].questions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (qId, val) => {
    setResponses(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isIdentified && !name.trim()) {
      return alert("Por favor, informe seu nome.");
    }

    setSaving(true);
    try {
      // Gera um userId aleatório para o anônimo/sócio
      const respondentId = `resp_${crypto.randomUUID()}`;
      
      const payload = {
        ...responses,
        _respondentName: isIdentified ? name : 'Anônimo',
        _submittedAt: new Date().toISOString()
      };

      await questionnaireService.saveAnswers(id, respondentId, role, payload);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      alert("Erro ao enviar respostas. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 max-w-lg w-full text-center animate-fade-in">
          <CheckCircle2 className="w-16 h-16 text-[#d4af37] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Respostas Enviadas!</h2>
          <p className="text-gray-400">
            Agradecemos a sua colaboração. Suas respostas foram computadas com sucesso e ajudarão na construção do nosso planejamento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#d4af37]/30 pb-20">
      <header className="border-b border-white/10 bg-black/50 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
          <div>
            <h1 className="text-[#d4af37] font-heading font-extrabold text-xl tracking-wider">
              GOVERNO EMPRESARIAL
            </h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Coleta de Percepções</p>
          </div>
          {isIdentified ? (
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Identificado
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37] uppercase tracking-wider">
              <Shield className="w-4 h-4" /> 100% Anônimo
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="text-3xl font-heading font-bold mb-4">Pesquisa de {role === 'SOCIO' ? 'Sócios' : role === 'OPERACAO' ? 'Operação' : 'Liderança'}</h2>
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            {isIdentified ? (
              <p className="text-gray-400 leading-relaxed text-sm">
                Esta pesquisa solicita a sua identificação como sócio para cruzamento de dados específicos do corpo societário. Suas respostas ajudarão a entender a visão estratégica atual da empresa.
              </p>
            ) : (
              <p className="text-gray-400 leading-relaxed text-sm">
                Esta é uma pesquisa <strong>absolutamente sigilosa e anônima</strong>. Não é necessário preencher seu nome e ninguém terá acesso às suas respostas individuais. Pedimos a máxima sinceridade possível. É fundamental entendermos a realidade do dia a dia da empresa para propormos melhorias precisas.
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {isIdentified && (
            <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 p-6 rounded-xl">
              <label className="block text-sm font-bold text-[#d4af37] uppercase tracking-wider mb-3">Seu Nome Completo</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-[#d4af37]/50 focus:border-[#d4af37] outline-none rounded-lg p-4 text-white"
                placeholder="Digite seu nome..."
              />
            </div>
          )}

          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white/5 border border-white/10 p-6 rounded-xl">
              <label className="block text-base font-bold text-gray-200 mb-6 leading-relaxed">
                <span className="text-[#d4af37] mr-2">{idx + 1}.</span> 
                {q.text}
              </label>

              {q.type === 'escala_0_10' && (
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                    <button 
                      key={val}
                      type="button"
                      onClick={() => handleAnswerChange(q.id, val)}
                      className={`w-12 h-12 rounded-lg border-2 text-base font-bold transition-all flex items-center justify-center ${
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
                  required
                  value={responses[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  className={`w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-sm p-4 rounded-xl outline-none transition-all resize-none ${q.type === 'texto_longo' ? 'min-h-[120px]' : 'min-h-[60px]'}`}
                  placeholder="Sua resposta..."
                />
              )}

              {q.type === 'multipla_escolha' && (
                <div className="flex flex-col gap-3">
                  {(q.options || ['Sim', 'Não']).map(opt => (
                    <button 
                      key={opt}
                      type="button"
                      onClick={() => handleAnswerChange(q.id, opt)}
                      className={`px-4 py-3 rounded-lg border text-left text-sm transition-all ${
                        responses[q.id] === opt 
                          ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37] font-bold' 
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

          {questions.length === 0 && (
            <p className="text-gray-500 italic text-center py-10">Este questionário ainda não possui perguntas cadastradas.</p>
          )}

          {questions.length > 0 && (
            <div className="pt-8 flex justify-end">
              <button 
                type="submit"
                disabled={saving || Object.keys(responses).length < questions.length}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-xl text-base font-bold uppercase tracking-wider transition-all bg-[#d4af37] text-black hover:bg-[#b5952f] shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Enviar Respostas
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
