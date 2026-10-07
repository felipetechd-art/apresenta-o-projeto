import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ShieldCheck, Plus, Trash2, 
  ChevronDown, ChevronUp, Save, Briefcase, FileText, Maximize, Minimize, ArrowRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { questionnaireService } from '../../services/questionnaireService';
import { useAuth } from '../../contexts/AuthContext';

export default function DiagnosticConfigView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTemplate, setExpandedTemplate] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Formulário para nova pergunta
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'escala_0_10',
    category: 'CLAREZA',
    weight: 1
  });

  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Busca os templates reais do Firestore
      const data = await questionnaireService.getTemplates();
      if (data.length === 0) {
        // Se não houver nenhum, vamos criar os padrões
        await createDefaultTemplates();
      } else {
        // Remove duplicatas (caso tenham sido criadas por erro) e ordena
        const uniqueTemplates = [];
        const seenRoles = new Set();
        
        for (const t of data) {
          if (!seenRoles.has(t.targetRole)) {
            uniqueTemplates.push(t);
            seenRoles.add(t.targetRole);
          }
        }
        
        // Ordem lógica de exibição
        const roleOrder = { 'DONO': 1, 'SOCIO': 2, 'LIDERANCA': 3, 'OPERACAO': 4 };
        uniqueTemplates.sort((a, b) => (roleOrder[a.targetRole] || 99) - (roleOrder[b.targetRole] || 99));
        
        setTemplates(uniqueTemplates);
      }
    } catch (e) {
      console.error(e);
      setErrorMsg(e.message || "Erro desconhecido ao carregar templates");
    } finally {
      setLoading(false);
    }
  };

  const createDefaultTemplates = async () => {
    try {
      const defaultRoles = [
        { role: 'DONO', title: 'Questionário do Dono' },
        { role: 'SOCIO', title: 'Questionário do Sócio' },
        { role: 'LIDERANCA', title: 'Questionário das Lideranças' },
        { role: 'OPERACAO', title: 'Questionário da Operação' }
      ];

      for (const role of defaultRoles) {
        await questionnaireService.createTemplate({
          targetRole: role.role,
          title: role.title,
          questions: []
        });
      }
      
      const data = await questionnaireService.getTemplates();
      setTemplates(data);
    } catch(e) {
      console.error(e);
      setErrorMsg("Erro ao criar templates padrão: " + (e.message || e));
    }
  };

  const handleAddQuestion = async (templateId) => {
    if (!newQuestion.text.trim()) return;

    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const updatedQuestions = [...(template.questions || []), { ...newQuestion, id: crypto.randomUUID() }];
    
    try {
      await questionnaireService.updateTemplate(templateId, { questions: updatedQuestions });
      
      // Atualiza localmente
      setTemplates(prev => prev.map(t => 
        t.id === templateId ? { ...t, questions: updatedQuestions } : t
      ));
      
      // Reseta form
      setNewQuestion({ text: '', type: 'escala_0_10', category: 'CLAREZA', weight: 1 });
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar pergunta");
    }
  };

  const handleDeleteQuestion = async (templateId, questionId) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const updatedQuestions = template.questions.filter(q => q.id !== questionId);
    
    try {
      await questionnaireService.updateTemplate(templateId, { questions: updatedQuestions });
      setTemplates(prev => prev.map(t => 
        t.id === templateId ? { ...t, questions: updatedQuestions } : t
      ));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadDefaultMethodology = async () => {
    if (!window.confirm("Isso irá sobrescrever e preencher os questionários vazios com o Padrão PGE. Confirma?")) return;
    
    setLoading(true);
    try {
            const defaultData = {
        'DONO': [
          { id: crypto.randomUUID(), text: "D01. Como seu tempo de trabalho é majoritariamente distribuído hoje?", type: "multipla_escolha", options: ["Maioria Estratégico", "Maioria Gerencial", "Maioria Apagando Incêndios", "Operacional"], category: "TEMPO", weight: 3 },
          { id: crypto.randomUUID(), text: "D02. Qual é a área ou problema da empresa que você costuma 'levar para casa' e mais ocupa sua cabeça antes de dormir?", type: "texto_longo", category: "CARGA_MENTAL", weight: 1 },
          { id: crypto.randomUUID(), text: "D03. Você gasta muito tempo na semana executando tarefas que já têm (ou deveriam ter) um responsável na equipe?", type: "escala_0_10", category: "EXECUCAO", weight: 2 },
          { id: crypto.randomUUID(), text: "D04. O que aconteceria com o faturamento e a entrega se você ficasse incomunicável por 30 dias?", type: "multipla_escolha", options: ["Cresceria", "Manteria normal", "Cairia um pouco", "Cairia drasticamente", "A empresa pararia"], category: "DEPENDENCIA", weight: 3 },
          { id: crypto.randomUUID(), text: "D05. Minhas lideranças conseguem tomar a maior parte das decisões de suas áreas sem minha participação.", type: "escala_0_10", category: "AUTONOMIA", weight: 3 },
          { id: crypto.randomUUID(), text: "D06. Qual é a decisão operacional mais frequente que as pessoas ainda sobem para você tomar?", type: "texto_curto", category: "DEPENDENCIA", weight: 1 },
          { id: crypto.randomUUID(), text: "D07. Em quais negociações ou fechamentos de vendas você ainda precisa entrar pessoalmente?", type: "multipla_escolha", options: ["Nenhuma", "Apenas grandes contas", "Contas complexas", "Quase todas"], category: "DEPENDENCIA", weight: 2 },
          { id: crypto.randomUUID(), text: "D08. Se um funcionário chave sair amanhã, o conhecimento sobre como ele executa o trabalho está documentado e acessível?", type: "multipla_escolha", options: ["Sim", "Parcialmente", "Não"], category: "SISTEMA", weight: 3 },
          { id: crypto.randomUUID(), text: "D09. A falta de qual ferramenta, sistema ou informação hoje é o maior gargalo para a equipe produzir mais e melhor?", type: "texto_curto", category: "SISTEMA", weight: 2 },
          { id: crypto.randomUUID(), text: "D10. Tenho absoluta certeza de que meus líderes sabem exatamente quais indicadores eu uso para avaliar o trabalho deles.", type: "escala_0_10", category: "CLAREZA", weight: 3 },
          { id: crypto.randomUUID(), text: "D11. Hoje, as vendas da empresa estão abaixo da performance esperada?", type: "multipla_escolha", options: ["Sim", "Não"], category: "EXECUCAO", weight: 2 },
          { id: crypto.randomUUID(), text: "D12. Você precisa frequentemente compensar alguma falha de execução ou gestão de algum dos seus sócios?", type: "multipla_escolha", options: ["Sempre", "Frequentemente", "Às vezes", "Nunca", "Não tenho sócios"], category: "PAPEL", weight: 2 }
        ],
        'SOCIO': [
          { id: crypto.randomUUID(), text: "S01. Existe clareza documentada e acordada sobre pelo que exatamente você responde, e pelo que o Dono responde?", type: "multipla_escolha", options: ["Sim", "Parcialmente", "Não"], category: "PAPEL", weight: 3 },
          { id: crypto.randomUUID(), text: "S02. Com que frequência vocês discordam sobre as prioridades estratégicas da empresa para os próximos 6 meses?", type: "multipla_escolha", options: ["Frequentemente", "Às vezes", "Raramente", "Nunca"], category: "CLAREZA", weight: 2 },
          { id: crypto.randomUUID(), text: "S03. Você sente que passa mais tempo executando atividades operacionais e cobrindo buracos do que exercendo seu papel estratégico de sócio?", type: "multipla_escolha", options: ["Sim, quase sempre", "Às vezes", "Não"], category: "TEMPO", weight: 3 },
          { id: crypto.randomUUID(), text: "S04. Na sua visão, em qual área da empresa o Dono mais interfere, mesmo já existindo alguém teoricamente responsável?", type: "texto_curto", category: "DEPENDENCIA", weight: 2 },
          { id: crypto.randomUUID(), text: "S05. Qual é o tipo de decisão rotineira que hoje fica travada precisando de consenso entre os sócios, mas que já deveria ter uma regra clara?", type: "texto_curto", category: "AUTONOMIA", weight: 2 },
          { id: crypto.randomUUID(), text: "S06. Se o Dono precisasse se afastar por 30 dias, você se sentiria totalmente seguro e equipado para manter a empresa operando no mesmo nível?", type: "multipla_escolha", options: ["Sim", "Não, por falta de informação", "Não, por depender tecnicamente dele"], category: "DEPENDENCIA", weight: 3 }
        ],
        'LIDERANCA': [
          { id: crypto.randomUUID(), text: "L01. Eu sei exatamente por quais indicadores numéricos o dono da empresa avalia se o meu trabalho está sendo bem feito ou não.", type: "escala_0_10", category: "CLAREZA", weight: 3 },
          { id: crypto.randomUUID(), text: "L02. Com que frequência você para e analisa formalmente os indicadores da sua equipe para definir ações corretivas?", type: "multipla_escolha", options: ["Diariamente", "Semanalmente", "Mensalmente", "Raramente", "Não tenho indicadores"], category: "INDICADORES", weight: 3 },
          { id: crypto.randomUUID(), text: "L03. Qual atividade consome a maior parte do seu tempo hoje?", type: "multipla_escolha", options: ["Planejamento", "Desenvolver a equipe", "Apagar incêndios da operação", "Fazer o trabalho de quem faltou ou errou", "Reuniões"], category: "TEMPO", weight: 2 },
          { id: crypto.randomUUID(), text: "L04. Quando alguém da sua equipe erra repetidamente, qual é a sua ação mais comum?", type: "multipla_escolha", options: ["Refaço o trabalho para não atrasar", "Treino a pessoa novamente", "Dou feedback formal", "Aciono o RH ou demito"], category: "CAPACIDADE", weight: 2 },
          { id: crypto.randomUUID(), text: "L05. Consigo tomar a maior parte das decisões da minha área sem precisar pedir autorização ou recorrer ao dono/diretor.", type: "escala_0_10", category: "AUTONOMIA", weight: 3 },
          { id: crypto.randomUUID(), text: "L06. Qual é a decisão que você acredita que já tem total capacidade para tomar, mas a empresa ainda exige que você peça aprovação superior?", type: "texto_curto", category: "AUTONOMIA", weight: 1 },
          { id: crypto.randomUUID(), text: "L07. Você sente que a sua área tem os recursos necessários (pessoas, sistemas, orçamento) para entregar o que a diretoria cobra?", type: "multipla_escolha", options: ["Sim", "Não, falta braço", "Não, falta tecnologia", "Não, falta orçamento"], category: "SISTEMA", weight: 2 }
        ],
        'OPERACAO': [
          { id: crypto.randomUUID(), text: "O01. Você sabe descrever claramente quais são as suas 3 principais entregas (resultados) para a empresa?", type: "multipla_escolha", options: ["Sim, com facilidade", "Mais ou menos", "Não"], category: "CLAREZA", weight: 3 },
          { id: crypto.randomUUID(), text: "O02. Como você sabe, ao final do dia, se fez um bom trabalho?", type: "multipla_escolha", options: ["Bati a meta numérica", "Meu chefe elogiou", "Não deixei pendências", "Apaguei todos os incêndios", "Não tenho como medir"], category: "INDICADORES", weight: 2 },
          { id: crypto.randomUUID(), text: "O03. Quando você tem dúvida sobre como executar uma atividade ou resolver um problema padrão, onde você procura a resposta?", type: "multipla_escolha", options: ["No manual/processo da empresa", "Pergunto pro meu colega", "Pergunto pro meu líder", "Tento descobrir sozinho"], category: "SISTEMA", weight: 3 },
          { id: crypto.randomUUID(), text: "O04. Existe alguma atividade que você faz manualmente hoje e que consome muito tempo, mas que poderia ser facilmente resolvida por um sistema ou software? Qual?", type: "texto_curto", category: "SISTEMA", weight: 1 },
          { id: crypto.randomUUID(), text: "O05. Quando surge um problema um pouco fora do padrão, quem normalmente precisa ser chamado para destravar a situação?", type: "multipla_escolha", options: ["Eu resolvo", "Meu colega sênior", "Meu gestor direto", "O dono da empresa"], category: "AUTONOMIA", weight: 2 },
          { id: crypto.randomUUID(), text: "O06. Seu líder direto costuma resolver os problemas da área ou ele frequentemente precisa 'escalar' o problema para os diretores/donos resolverem?", type: "multipla_escolha", options: ["Resolve tudo", "Resolve a maioria", "Escala com frequência"], category: "DEPENDENCIA", weight: 3 },
          { id: crypto.randomUUID(), text: "O07. O que mais gera retrabalho, perda de tempo ou estresse no seu dia a dia?", type: "texto_curto", category: "EXECUCAO", weight: 1 },
          { id: crypto.randomUUID(), text: "O08. O que você acha que a direção da empresa NÃO SABE sobre o dia a dia da operação, mas que eles deveriam saber com urgência?", type: "texto_longo", category: "CLAREZA", weight: 1 }
        ]
      };

      // Remove duplicates from DB
      const allTemplates = await questionnaireService.getTemplates();
      const seenRoles = new Set();
      const uniqueTemplates = [];
      
      for (const t of allTemplates) {
        if (seenRoles.has(t.targetRole)) {
          // Delete duplicate
          try {
            await questionnaireService.deleteTemplate(t.id);
          } catch(e) { console.error("Could not delete duplicate", e); }
        } else {
          seenRoles.add(t.targetRole);
          uniqueTemplates.push(t);
        }
      }

      for (const template of uniqueTemplates) {
        if (defaultData[template.targetRole]) {
          // O usuário já confirmou no window.confirm, então vamos SOBRESCREVER com a nova metodologia de alta conversão
          await questionnaireService.updateTemplate(template.id, { questions: defaultData[template.targetRole] });
        }
      }
      
      // Recarrega de forma limpa
      await loadTemplates();
      alert("Metodologia Padrão carregada com sucesso!");
    } catch(e) {
      console.error(e);
      alert("Erro ao carregar metodologia");
    } finally {
      setLoading(false);
    }
  };

  const toggleTemplate = (id) => {
    if (expandedTemplate === id) setExpandedTemplate(null);
    else setExpandedTemplate(id);
  };

  return (
    <div className="min-h-screen bg-neutral-900 font-sans selection:bg-amber-500/30">
      {/* Topbar */}
      <header className="bg-neutral-800/50 backdrop-blur-xl border-b border-neutral-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-neutral-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="w-px h-6 bg-neutral-700"></div>
              <ShieldCheck className="w-6 h-6 text-amber-500" />
              <h1 className="text-xl font-semibold text-white tracking-tight">Metodologia e Pesos</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-400 hidden sm:block">{user?.email}</span>
              <button 
                onClick={toggleFullscreen}
                className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
                title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-light text-white tracking-tight">
              CONFIGURAÇÃO DO <span className="font-semibold text-amber-500">MAPA 360</span>
            </h2>
            <p className="text-neutral-400 mt-2">Crie as perguntas e defina os pesos para o cruzamento de dados de cada público.</p>
          </div>
          <button 
            onClick={handleLoadDefaultMethodology}
            className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white text-sm font-bold py-2 px-4 rounded-xl transition-colors shrink-0"
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            Carregar Padrão PGE
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-8">
            <h3 className="font-bold">Erro:</h3>
            <p>{errorMsg}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {templates.map(template => (
              <div key={template.id} className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl overflow-hidden">
                <div 
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800 transition-colors"
                  onClick={() => toggleTemplate(template.id)}
                >
                  <div>
                    <h3 className="text-lg font-bold text-white">{template.title}</h3>
                    <p className="text-xs text-neutral-400 mt-1">Público: {template.targetRole} • {(template.questions || []).length} perguntas</p>
                  </div>
                  {expandedTemplate === template.id ? <ChevronUp className="text-neutral-400" /> : <ChevronDown className="text-neutral-400" />}
                </div>

                {expandedTemplate === template.id && (
                  <div className="p-6 border-t border-neutral-700/50 bg-neutral-900/30">
                    
                    {/* Lista de Perguntas */}
                    <div className="space-y-3 mb-8">
                      {(template.questions || []).map((q, i) => (
                        <div key={q.id} className="flex items-center justify-between p-4 bg-neutral-800 rounded-xl border border-neutral-700 group">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">Q{i + 1}</span>
                              <span className="text-xs text-neutral-400 uppercase tracking-wider">{q.category}</span>
                            </div>
                            <p className="text-sm text-white font-medium">{q.text}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                              <span>Tipo: {q.type}</span>
                              <span>Peso: {q.weight}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteQuestion(template.id, q.id)}
                            className="p-2 text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {(template.questions || []).length === 0 && (
                        <p className="text-sm text-neutral-500 italic">Nenhuma pergunta cadastrada para este público.</p>
                      )}
                    </div>

                    {/* Adicionar nova pergunta */}
                    <div className="bg-neutral-800 p-5 rounded-xl border border-neutral-700/50">
                      <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-amber-500" /> Nova Pergunta
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-4">
                          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Pergunta</label>
                          <input 
                            type="text" 
                            value={newQuestion.text}
                            onChange={e => setNewQuestion({...newQuestion, text: e.target.value})}
                            className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 text-white text-sm rounded-lg px-4 py-2.5 outline-none"
                            placeholder="Ex: Quais são as 3 prioridades da empresa?"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Tipo</label>
                          <select 
                            value={newQuestion.type}
                            onChange={e => setNewQuestion({...newQuestion, type: e.target.value})}
                            className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 text-white text-sm rounded-lg px-4 py-2.5 outline-none"
                          >
                            <option value="escala_0_10">Escala (0 a 10)</option>
                            <option value="texto_curto">Texto Curto</option>
                            <option value="texto_longo">Texto Longo</option>
                            <option value="multipla_escolha">Múltipla Escolha</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Categoria</label>
                          <select 
                            value={newQuestion.category}
                            onChange={e => setNewQuestion({...newQuestion, category: e.target.value})}
                            className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 text-white text-sm rounded-lg px-4 py-2.5 outline-none"
                          >
                            <option value="CLAREZA">Clareza Estratégica</option>
                            <option value="AUTONOMIA">Autonomia de Liderança</option>
                            <option value="OPERACOES">Processos e Operação</option>
                            <option value="INDICADORES">Indicadores e Dados</option>
                            <option value="DEPENDENCIA">Dependência do Dono</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Peso Matemático</label>
                          <input 
                            type="number" 
                            min="1"
                            max="5"
                            value={newQuestion.weight}
                            onChange={e => setNewQuestion({...newQuestion, weight: parseInt(e.target.value)})}
                            className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 text-white text-sm rounded-lg px-4 py-2.5 outline-none"
                          />
                        </div>

                        <div className="flex items-end">
                          <button 
                            onClick={() => handleAddQuestion(template.id)}
                            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-900 text-sm font-bold py-2.5 rounded-lg transition-colors"
                          >
                            <Save className="w-4 h-4" />
                            Adicionar
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Standard Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-neutral-800">
          <button 
            onClick={() => navigate('/admin')}
            className="w-full md:w-auto px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors"
          >
            Voltar
          </button>

          <button 
            onClick={() => navigate('/admin')}
            className="w-full md:w-auto flex justify-center items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 bg-[#d4af37] text-black hover:bg-[#b5952f] shadow-[0_0_20px_rgba(212,175,55,0.3)] transform hover:scale-105"
          >
            Finalizar e Voltar
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
