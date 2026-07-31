import React from 'react';
import { Target, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export function RoadmapList({ filteredTasks, setSelectedTask }) {
  const getStatusDisplay = (status) => {
    switch(status) {
      case 'validated': return { text: 'Concluido', color: 'text-green-400 bg-green-400/10' };
      case 'awaiting_validation': return { text: 'Em validação', color: 'text-yellow-400 bg-yellow-400/10' };
      case 'blocked': return { text: 'Bloqueado', color: 'text-red-400 bg-red-400/10' };
      case 'in_execution': return { text: 'Em execução', color: 'text-blue-400 bg-blue-400/10' };
      default: return { text: 'Não iniciado', color: 'text-gray-400 bg-gray-800' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString));
    } catch(e) {
      return '-';
    }
  };

  const getStartDate = (task) => {
    if (!task.auditLog) return '-';
    const startEvent = task.auditLog.find(e => e.action === 'status_changed' && e.newStatus !== 'not_started');
    return startEvent ? formatDate(startEvent.timestamp || startEvent.date) : '-';
  };

  const getStatusChangeDate = (task) => {
    if (!task.auditLog) return '-';
    const statusEvents = task.auditLog.filter(e => e.action === 'status_changed');
    if (statusEvents.length === 0) return '-';
    const lastEvent = statusEvents[statusEvents.length - 1];
    return formatDate(lastEvent.timestamp || lastEvent.date);
  };
  
  const getLastUpdateDate = (task) => {
    return formatDate(task.updatedAt);
  };

  return (
    <div className="w-full bg-black/40 rounded-xl border border-gray-800/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-800 bg-black/60">
              <th className="p-4 text-xs font-bold uppercase text-gray-500 tracking-wider">Tarefa</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-500 tracking-wider w-32">Status</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-500 tracking-wider w-32">Data Início</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-500 tracking-wider w-32">Última Alt.</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-500 tracking-wider w-32">Mudança Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 font-bold text-sm">
                  Nenhuma tarefa encontrada
                </td>
              </tr>
            )}
            {filteredTasks.map(task => {
              const statusDisplay = getStatusDisplay(task.status);
              return (
                <tr 
                  key={task.id} 
                  onClick={() => setSelectedTask(task)}
                  className="hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white group-hover:text-[var(--color-primary-yellow)] transition-colors">
                        {task.title}
                      </span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                        Fase {task.phase} • {task.pillar}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase rounded ${statusDisplay.color}`}>
                      {statusDisplay.text}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">{getStartDate(task)}</td>
                  <td className="p-4 text-sm text-gray-400">{getLastUpdateDate(task)}</td>
                  <td className="p-4 text-sm text-gray-400">{getStatusChangeDate(task)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
