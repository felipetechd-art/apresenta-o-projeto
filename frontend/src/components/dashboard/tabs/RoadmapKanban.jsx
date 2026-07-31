import React from 'react';
import { Target, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export function RoadmapKanban({ filteredTasks, setSelectedTask }) {
  const KANBAN_COLUMNS = [
    { id: 'not_started', title: 'Não iniciado', color: 'border-gray-700 bg-gray-800/30 text-gray-400' },
    { id: 'in_execution', title: 'Em execução', color: 'border-blue-500/30 bg-blue-500/10 text-blue-400' },
    { id: 'blocked', title: 'Bloqueado', color: 'border-red-500/30 bg-red-500/10 text-red-400' },
    { id: 'awaiting_validation', title: 'Em validação', color: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400' },
    { id: 'validated', title: 'Concluido', color: 'border-green-500/30 bg-green-500/10 text-green-400' }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'validated': return <CheckCircle2 className="w-4 h-4" />;
      case 'awaiting_validation': return <Clock className="w-4 h-4" />;
      case 'blocked': return <AlertCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex h-full w-full gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {KANBAN_COLUMNS.map(col => {
        const columnTasks = filteredTasks.filter(t => t.status === col.id);
        
        return (
          <div key={col.id} className="flex-1 min-w-[280px] max-w-[350px] flex flex-col bg-black/40 rounded-xl border border-gray-800/50 overflow-hidden">
            {/* Header da Coluna */}
            <div className={`px-4 py-3 border-b flex justify-between items-center ${col.color}`}>
              <h3 className="text-xs font-bold uppercase tracking-wider">{col.title}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/30">
                {columnTasks.length}
              </span>
            </div>
            
            {/* Corpo da Coluna */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {columnTasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="bg-[#0a1120] border border-gray-800 rounded-lg p-3 cursor-pointer hover:border-gray-600 transition-colors shadow-lg"
                >
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <span className="text-[9px] font-bold uppercase text-[var(--color-primary-yellow)]/70 tracking-wider">
                      Fase {task.phase} • {task.pillar}
                    </span>
                    <span className={col.color.split(' ')[2]}>
                      {getStatusIcon(task.status)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-200 leading-tight mb-2">
                    {task.title}
                  </h4>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase">
                    <span>Mês {task.month}</span>
                    <span>Peso {task.weight || 1}</span>
                  </div>
                </div>
              ))}
              
              {columnTasks.length === 0 && (
                <div className="h-20 flex items-center justify-center text-xs text-gray-600 font-bold border border-dashed border-gray-800 rounded-lg">
                  Nenhuma tarefa
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
