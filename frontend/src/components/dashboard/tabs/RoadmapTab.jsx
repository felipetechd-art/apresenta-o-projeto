import React, { useState, useMemo } from 'react';
import { Target, Filter, ChevronDown, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { TaskDrawer } from './TaskDrawer';

export function RoadmapTab({ dashboardData }) {
  const { tasks, roadmapProgress } = dashboardData;
  
  const [selectedPhase, setSelectedPhase] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [pillarFilter, setPillarFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [responsibleFilter, setResponsibleFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);

  // Nomes Oficiais das Fases
  const phaseNames = {
    1: 'FUNDAÇÃO E CONTROLE',
    2: 'PADRONIZAÇÃO E DELEGAÇÃO',
    3: 'AUTONOMIA E ESCALA'
  };

  const phaseMonths = {
    1: 'Meses 1 a 3',
    2: 'Meses 4 a 6',
    3: 'Meses 7 a 12'
  };

  // Filtro de tarefas
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchPhase = t.phase === selectedPhase;
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchPillar = pillarFilter === 'all' || t.pillar === pillarFilter;
      const matchStage = stageFilter === 'all' || t.stage === stageFilter;
      const matchType = typeFilter === 'all' || t.type === typeFilter;
      const matchMonth = monthFilter === 'all' || t.month === Number(monthFilter);
      const matchResponsible = responsibleFilter === 'all' || t.responsible === responsibleFilter;
      return matchPhase && matchStatus && matchPillar && matchStage && matchType && matchMonth && matchResponsible;
    });
  }, [tasks, selectedPhase, statusFilter, pillarFilter, stageFilter, typeFilter, monthFilter, responsibleFilter]);

  // Indicadores da fase
  const phaseTasks = tasks.filter(t => t.phase === selectedPhase);
  const phaseCompleted = phaseTasks.filter(t => t.status === 'validated').length;
  const phaseTotal = phaseTasks.length;
  const phaseProgress = phaseTotal === 0 ? 0 : Math.round((phaseCompleted / phaseTotal) * 100);

  const getStatusColor = (status) => {
    switch(status) {
      case 'validated': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'awaiting_validation': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'in_execution': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'blocked': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-800 border-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'validated': return <CheckCircle2 className="w-4 h-4" />;
      case 'awaiting_validation': return <Clock className="w-4 h-4" />;
      case 'blocked': return <AlertCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      
      {/* Coluna Esquerda: Filtros e Estrutura */}
      <div className="w-64 border-r border-gray-800 bg-black/20 p-4 flex flex-col gap-6 overflow-y-auto scrollbar-hide">
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Progresso Total</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--color-primary-yellow)] transition-all duration-500" 
                style={{ width: `${roadmapProgress}%` }}
              />
            </div>
            <span className="text-sm font-bold text-white">{roadmapProgress.toFixed(0)}%</span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Jornada</h3>
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map(phase => (
              <button 
                key={phase}
                onClick={() => setSelectedPhase(phase)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedPhase === phase 
                    ? 'border-[var(--color-primary-yellow)] bg-[var(--color-primary-yellow)]/10 text-white' 
                    : 'border-gray-800 hover:border-gray-600 text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="font-bold text-sm uppercase">FASE {phase}</div>
                <div className="text-[10px] font-bold mt-1 text-[var(--color-primary-yellow)]">
                  {phaseNames[phase]}
                </div>
                <div className="text-[10px] opacity-70">
                  {phaseMonths[phase]}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 border-t border-gray-800 pt-4">
            <Filter className="w-3 h-3" /> Filtros
          </h3>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none cursor-pointer focus:border-[var(--color-primary-yellow)]"
          >
            <option value="all">Status (Todos)</option>
            <option value="not_started">Não Iniciadas</option>
            <option value="in_execution">Em Execução</option>
            <option value="awaiting_validation">Aguardando Validação</option>
            <option value="validated">Validadas</option>
            <option value="blocked">Bloqueadas</option>
          </select>

          <select 
            value={pillarFilter}
            onChange={(e) => setPillarFilter(e.target.value)}
            className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none cursor-pointer focus:border-[var(--color-primary-yellow)]"
          >
            <option value="all">Pilar (Todos)</option>
            <option value="people">Pessoas e Lideranças</option>
            <option value="processes">Processos e Rotinas</option>
            <option value="delegation">Delegação e Alçadas</option>
            <option value="automation">Automação e Tecnologia</option>
            <option value="governance">Indicadores e Governança</option>
          </select>

          <select 
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none cursor-pointer focus:border-[var(--color-primary-yellow)]"
          >
            <option value="all">Etapa (Todas)</option>
            <option value="Diagnosticar">Diagnosticar</option>
            <option value="Organizar">Organizar</option>
            <option value="Delegar">Delegar</option>
            <option value="Automatizar">Automatizar</option>
            <option value="Governar">Governar</option>
          </select>

          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none cursor-pointer focus:border-[var(--color-primary-yellow)]"
          >
            <option value="all">Tipo (Todos)</option>
            <option value="mandatory">Obrigatória</option>
            <option value="conditional">Condicional</option>
            <option value="custom">Personalizada</option>
          </select>
          
          <select 
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none cursor-pointer focus:border-[var(--color-primary-yellow)]"
          >
            <option value="all">Mês (Todos)</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i+1} value={i+1}>Mês {i+1}</option>
            ))}
          </select>

          <select 
            value={responsibleFilter}
            onChange={(e) => setResponsibleFilter(e.target.value)}
            className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none cursor-pointer focus:border-[var(--color-primary-yellow)]"
          >
            <option value="all">Responsável (Todos)</option>
            <option value="Empreendedor">Empreendedor</option>
            <option value="Liderança">Liderança</option>
            <option value="Time">Time</option>
          </select>

        </div>
      </div>

      {/* Coluna Direita: Lista de Tarefas */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-end mb-6 border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">Tarefas da Fase {selectedPhase}</h2>
            <p className="text-sm text-gray-400 mt-1">Concluídas: {phaseCompleted} de {phaseTotal} ({phaseProgress}%)</p>
          </div>
          <button className="px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer">
            + Adicionar Tarefa Personalizada
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <div 
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="glass-card rounded-xl p-4 border border-gray-800 hover:border-[var(--color-primary-yellow)]/50 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  {getStatusIcon(task.status)}
                </div>
                <h4 className="text-sm font-bold text-white leading-tight group-hover:text-[var(--color-primary-yellow)] transition-colors">
                  {task.title}
                </h4>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                  {task.description}
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-800/50 flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <span>{task.pillar}</span>
                <span>Peso {task.weight}</span>
              </div>
            </div>
          ))}
          
          {filteredTasks.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              Nenhuma tarefa encontrada para este filtro.
            </div>
          )}
        </div>
      </div>

      {/* Drawer da Tarefa */}
      {selectedTask && (
        <TaskDrawer 
          task={selectedTask} 
          dashboardData={dashboardData}
          onClose={() => setSelectedTask(null)} 
        />
      )}
    </div>
  );
}
