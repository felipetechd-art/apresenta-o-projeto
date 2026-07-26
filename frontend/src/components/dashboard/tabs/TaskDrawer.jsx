import React, { useState } from 'react';
import { X, Check, Save, FileText, AlertTriangle, Link as LinkIcon, Paperclip, Clock } from 'lucide-react';
import { ROLES, canEditValidatedTask } from '../../../domain/governance/auth.js';

export function TaskDrawer({ task, dashboardData, onClose }) {
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [comment, setComment] = useState('');
  
  const isMentor = dashboardData.actor?.role === ROLES.MENTOR;
  const isReadOnly = task.status === 'validated' && !canEditValidatedTask(dashboardData.actor, task);
  const canValidate = isMentor && task.status === 'awaiting_validation';

  const handleUpdateStatus = (newStatus) => {
    const updatedTask = { ...task, status: newStatus };
    dashboardData.updateTask(updatedTask, 'status_changed', comment || `Status alterado para ${newStatus}`);
    setComment('');
  };

  const handleAddEvidence = () => {
    if (!evidenceUrl.trim()) return;
    
    const newEvidence = {
      id: `ev-${crypto.randomUUID()}`,
      title: 'Evidência Adicionada',
      type: 'link',
      url: evidenceUrl,
      uploadedBy: dashboardData.actor.id,
      date: new Date().toISOString()
    };
    
    const updatedTask = { 
      ...task, 
      evidences: [...(task.evidences || []), newEvidence] 
    };
    
    dashboardData.updateTask(updatedTask, 'evidence_added', 'Nova evidência anexada');
    setEvidenceUrl('');
  };

  const handleValidate = () => {
    dashboardData.validateTask(task.id);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#080f1e] border-l border-gray-800 z-[70] shadow-2xl flex flex-col transition-transform transform translate-x-0">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/40">
          <div>
            <span className="text-[10px] font-bold uppercase text-[var(--color-primary-yellow)] tracking-wider">
              {task.pillar} • Fase {task.phase}
            </span>
            <h3 className="text-white font-heading font-bold text-lg leading-tight mt-1">
              {task.title}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          <div className="text-sm text-gray-300 leading-relaxed">
            {task.description}
          </div>
          
          {task.objective && (
            <div className="bg-white/5 p-4 rounded-lg border border-gray-800">
              <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Objetivo</h4>
              <p className="text-sm text-gray-300">{task.objective}</p>
            </div>
          )}

          {/* Status e Ações */}
          <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
            <h4 className="text-xs font-bold uppercase text-gray-500 mb-3">Status Atual</h4>
            
            <div className="flex flex-col gap-3">
              <span className="inline-block px-3 py-1 bg-gray-800 text-gray-300 rounded font-bold text-xs uppercase self-start">
                {task.status.replace('_', ' ')}
              </span>

              {!isReadOnly && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <button onClick={() => handleUpdateStatus('in_execution')} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded text-xs font-bold uppercase hover:bg-blue-600/30 cursor-pointer">
                    Iniciar Execução
                  </button>
                  <button onClick={() => handleUpdateStatus('blocked')} className="px-3 py-1.5 bg-red-600/20 text-red-400 border border-red-600/30 rounded text-xs font-bold uppercase hover:bg-red-600/30 cursor-pointer">
                    Marcar Bloqueio
                  </button>
                  <button onClick={() => handleUpdateStatus('awaiting_validation')} className="px-3 py-1.5 bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded text-xs font-bold uppercase hover:bg-yellow-600/30 cursor-pointer">
                    Enviar p/ Validação
                  </button>
                </div>
              )}

              {canValidate && (
                <button onClick={handleValidate} className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded font-bold text-sm uppercase flex items-center justify-center gap-2 hover:bg-green-700 cursor-pointer shadow-lg shadow-green-900/20">
                  <Check className="w-4 h-4" /> Validar Tarefa
                </button>
              )}
            </div>
          </div>

          {/* Evidências */}
          <div>
            <h4 className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
              <Paperclip className="w-4 h-4" /> Evidências e Anexos
            </h4>
            
            {task.evidences?.length > 0 ? (
              <ul className="space-y-2 mb-4">
                {task.evidences.map(ev => (
                  <li key={ev.id} className="bg-black/40 border border-gray-800 rounded p-3 flex justify-between items-center">
                    <a href={ev.url} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" /> {ev.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mb-4 italic">Nenhuma evidência anexada.</p>
            )}

            {!isReadOnly && (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={evidenceUrl}
                  onChange={e => setEvidenceUrl(e.target.value)}
                  placeholder="Cole a URL do documento (Drive, Notion, etc)"
                  className="flex-1 bg-black/50 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-[var(--color-primary-yellow)] outline-none"
                />
                <button onClick={handleAddEvidence} className="px-4 py-2 bg-gray-800 text-white rounded font-bold text-xs uppercase hover:bg-gray-700 cursor-pointer">
                  Anexar
                </button>
              </div>
            )}
          </div>

          {/* Comentários / Histórico */}
          <div>
            <h4 className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Histórico e Comentários
            </h4>
            
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
              {task.auditLog?.map((log, idx) => (
                <div key={idx} className="border-l-2 border-gray-700 pl-3 py-1">
                  <div className="text-[10px] text-gray-500 font-mono">
                    {new Date(log.timestamp).toLocaleString()} • {log.actorRole}
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    <span className="font-bold text-[var(--color-primary-yellow)]">{log.action}:</span> {log.comment || `Alterou status para ${log.newStatus}`}
                  </div>
                </div>
              ))}
            </div>

            {!isReadOnly && (
              <div className="flex flex-col gap-2">
                <textarea 
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Adicione um comentário..."
                  className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-[var(--color-primary-yellow)] outline-none resize-none h-20"
                />
                <button 
                  onClick={() => handleUpdateStatus(task.status)} 
                  className="self-end px-4 py-2 bg-gray-800 text-white rounded font-bold text-xs uppercase hover:bg-gray-700 cursor-pointer"
                >
                  Comentar
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
