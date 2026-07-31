import React, { useState } from 'react';
import { X, Check, Save, FileText, AlertTriangle, Link as LinkIcon, Paperclip, Clock, Target, ChevronDown, Pencil } from 'lucide-react';
import { ROLES, canEditValidatedTask } from '../../../domain/governance/auth.js';

export function TaskDrawer({ task, dashboardData, onClose }) {
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [comment, setComment] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description,
    objective: task.objective || ''
  });
  
  const isAdvisor = dashboardData.actor?.role === ROLES.ADVISOR;
  const isReadOnly = task.status === 'validated' && !canEditValidatedTask(dashboardData.actor, task);
  const canValidate = isAdvisor && task.status === 'awaiting_validation';

  const handleUpdateStatus = (newStatus) => {
    if (newStatus === task.status) return;
    const updatedTask = { ...task, status: newStatus };
    dashboardData.updateTask(updatedTask, 'status_changed', comment || `Status alterado para ${getStatusText(newStatus)}`);
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

  const handleSaveEdits = () => {
    if (!editForm.title.trim()) return;
    const updatedTask = {
      ...task,
      title: editForm.title,
      description: editForm.description,
      objective: editForm.objective
    };
    dashboardData.updateTask(updatedTask, 'edited', 'Informações da tarefa atualizadas');
    setIsEditing(false);
  };

  const handleValidate = () => {
    dashboardData.validateTask(task.id);
    onClose();
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'not_started': return 'Não iniciado';
      case 'in_execution': return 'Em execução';
      case 'blocked': return 'Bloqueado';
      case 'awaiting_validation': return 'Em validação';
      case 'validated': return 'Concluido';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'validated': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'awaiting_validation': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'in_execution': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'blocked': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-800 border-gray-700';
    }
  };

  return (
    <>
      {/* Overlay com Glassmorphism */}
      <div className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Centralizado (Premium UI) */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] bg-[#050914] border border-gray-800 rounded-2xl z-[70] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header Elegante */}
        <div className="p-6 border-b border-gray-800/60 bg-gradient-to-r from-gray-900/40 to-transparent flex justify-between items-start">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold uppercase text-[var(--color-primary-yellow)] tracking-widest bg-[var(--color-primary-yellow)]/10 px-2 py-1 rounded">
                Fase {task.phase} • {task.pillar}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${getStatusColor(task.status)}`}>
                {getStatusText(task.status)}
              </span>
            </div>
            <h3 className="text-white font-heading font-bold text-2xl leading-tight">
              {isEditing ? (
                <input 
                  value={editForm.title} 
                  onChange={e => setEditForm({...editForm, title: e.target.value})}
                  className="w-full bg-black/50 border border-gray-700 rounded px-2 py-1 outline-none focus:border-[var(--color-primary-yellow)]"
                />
              ) : (
                task.title
              )}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {!isReadOnly && !isEditing && (
              <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-[var(--color-primary-yellow)] transition-colors cursor-pointer bg-black/20 border border-gray-800" title="Editar Tarefa">
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {isEditing && (
              <button onClick={handleSaveEdits} className="p-2 hover:bg-green-500/20 rounded-full text-green-500 transition-colors cursor-pointer bg-black/20 border border-green-500/30" title="Salvar Edições">
                <Save className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer bg-black/20 border border-gray-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corpo do Modal */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6 scrollbar-hide">
          
          {/* Coluna Esquerda: Detalhes e Evidências */}
          <div className="flex-1 space-y-6">
            <div>
              <h4 className="text-[10px] font-bold uppercase text-gray-500 mb-2 flex items-center gap-2">
                <FileText className="w-3 h-3" /> Descrição da Tarefa
              </h4>
              {isEditing ? (
                <textarea 
                  value={editForm.description} 
                  onChange={e => setEditForm({...editForm, description: e.target.value})}
                  className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[var(--color-primary-yellow)] resize-none h-32 transition-colors"
                />
              ) : (
                <p className="text-sm text-gray-300 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  {task.description || <span className="italic text-gray-500">Sem descrição</span>}
                </p>
              )}
            </div>
            
            {(task.objective || isEditing) && (
              <div>
                <h4 className="text-[10px] font-bold uppercase text-gray-500 mb-2 flex items-center gap-2">
                  <Target className="w-3 h-3" /> Objetivo
                </h4>
                {isEditing ? (
                  <textarea 
                    value={editForm.objective} 
                    onChange={e => setEditForm({...editForm, objective: e.target.value})}
                    className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[var(--color-primary-yellow)] resize-none h-24 transition-colors"
                    placeholder="Objetivo opcional..."
                  />
                ) : (
                  <p className="text-sm text-gray-300 bg-[var(--color-primary-yellow)]/5 p-4 rounded-xl border border-[var(--color-primary-yellow)]/20">
                    {task.objective}
                  </p>
                )}
              </div>
            )}

            {/* Evidências */}
            <div>
              <h4 className="text-[10px] font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
                <Paperclip className="w-3 h-3" /> Evidências e Anexos
              </h4>
              
              {task.evidences?.length > 0 ? (
                <ul className="space-y-2 mb-4">
                  {task.evidences.map(ev => (
                    <li key={ev.id} className="bg-black/40 border border-gray-800/60 hover:border-gray-600 rounded-lg p-3 transition-colors">
                      <a href={ev.url} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2 font-medium">
                        <LinkIcon className="w-4 h-4" /> {ev.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="bg-black/20 border border-dashed border-gray-800 rounded-xl p-4 text-center mb-4">
                  <p className="text-xs text-gray-500 italic">Nenhuma evidência anexada até o momento.</p>
                </div>
              )}

              {!isReadOnly && (
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    value={evidenceUrl}
                    onChange={e => setEvidenceUrl(e.target.value)}
                    placeholder="Cole a URL do arquivo/documento"
                    className="flex-1 bg-black/50 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:border-[var(--color-primary-yellow)] outline-none transition-colors"
                  />
                  <button onClick={handleAddEvidence} className="px-5 py-2.5 bg-white/5 text-white border border-gray-700 rounded-lg font-bold text-xs uppercase hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap">
                    Anexar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Coluna Direita: Ações e Histórico */}
          <div className="md:w-72 space-y-6 flex flex-col">
            
            {/* Combo de Status */}
            <div className="bg-gradient-to-b from-gray-900/50 to-black/20 p-5 rounded-xl border border-gray-800/80 shadow-inner">
              <h4 className="text-[10px] font-bold uppercase text-gray-500 mb-3 tracking-widest">Alterar Status</h4>
              
              <div className="relative">
                <select
                  disabled={isReadOnly}
                  value={task.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  className={`w-full appearance-none bg-black/60 border ${isReadOnly ? 'border-gray-800 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-gray-500 cursor-pointer'} rounded-lg pl-4 pr-10 py-3 text-sm font-bold text-white outline-none transition-colors`}
                >
                  <option value="not_started">Não iniciado</option>
                  <option value="in_execution">Em execução</option>
                  <option value="blocked">Bloqueado</option>
                  <option value="awaiting_validation">Em validação</option>
                  <option value="validated" disabled={!canValidate && task.status !== 'validated'}>Concluido</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {canValidate && (
                <button onClick={handleValidate} className="w-full mt-4 px-4 py-3 bg-green-600/90 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-green-500 transition-all cursor-pointer shadow-[0_0_15px_rgba(22,163,74,0.3)] border border-green-500/50">
                  <Check className="w-4 h-4" /> Validar Oficialmente
                </button>
              )}
            </div>

            {/* Comentários / Histórico */}
            <div className="flex-1 flex flex-col min-h-0 bg-black/20 p-5 rounded-xl border border-gray-800/50">
              <h4 className="text-[10px] font-bold uppercase text-gray-500 mb-4 tracking-widest flex items-center gap-2">
                <Clock className="w-3 h-3" /> Linha do Tempo
              </h4>
              
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-hide">
                {task.auditLog?.length > 0 ? (
                  task.auditLog.map((log, idx) => {
                    const logDate = log.timestamp || log.date;
                    const dateStr = logDate ? new Date(logDate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'Data não registrada';
                    
                    return (
                      <div key={idx} className="relative pl-4 border-l border-gray-700/50 before:absolute before:left-[-4px] before:top-1.5 before:w-2 before:h-2 before:bg-gray-600 before:rounded-full">
                        <div className="text-[9px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">
                          {dateStr} • {log.actorRole}
                        </div>
                        <div className="text-xs text-gray-300 leading-snug">
                          <span className="font-bold text-[var(--color-primary-yellow)] mr-1">{log.action === 'status_changed' ? 'Mudança de Status' : log.action === 'evidence_added' ? 'Evidência' : log.action}:</span> 
                          {log.comment || `Alterou para ${getStatusText(log.newStatus)}`}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-600 italic">Nenhum evento registrado.</p>
                )}
              </div>

              {!isReadOnly && (
                <div className="pt-3 border-t border-gray-800/50">
                  <textarea 
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Escreva um comentário..."
                    className="w-full bg-black/40 border border-gray-800 hover:border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[var(--color-primary-yellow)] outline-none resize-none h-16 transition-colors mb-2"
                  />
                  <button 
                    onClick={() => handleUpdateStatus(task.status)} 
                    disabled={!comment.trim()}
                    className="w-full px-4 py-2 bg-[var(--color-primary-yellow)] text-black rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Save className="w-3 h-3" /> Registrar Comentário
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
