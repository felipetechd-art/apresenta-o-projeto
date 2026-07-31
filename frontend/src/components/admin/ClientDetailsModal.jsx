import React, { useState } from 'react';
import { X, DollarSign, Calendar, TrendingUp, AlertCircle, FileText, User, Mail, Phone, ExternalLink, Save, Trash2, CheckCircle, Copy } from 'lucide-react';
import { PresentationGovernanceDraftRepository } from '../../repositories/PresentationGovernanceDraftRepository';

export default function ClientDetailsModal({ client, onClose, onUpdate, onDelete, onActivate }) {
  if (!client) return null;

  const data = client.fullData;
  const cData = data?.contractData || {};
  const dData = data?.diagnosticData || {};
  const info = data?.clientInfo || {};

  const total = cData.investmentInCents ? cData.investmentInCents / 100 : 0;
  const entrance = parseFloat(String(cData.entranceValue || '0').replace(/[^\d.,-]/g, '').replace(',', '.'));
  const remaining = Math.max(0, total - entrance);
  const installments = parseInt(cData.installments) || 1;
  const installmentValue = installments > 0 ? (remaining / installments) : 0;

  const [salesStatus, setSalesStatus] = useState(dData.salesStatus || 'aguardando');
  const [leadStatus, setLeadStatus] = useState(dData.leadStatus || 'qualificado');
  const [notes, setNotes] = useState(dData.notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatBRL = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleSave = () => {
    setIsSaving(true);
    const updatedDraft = PresentationGovernanceDraftRepository.update(client.presentationSessionId, {
      diagnosticData: {
        ...dData,
        salesStatus,
        leadStatus,
        notes
      }
    });
    if (onUpdate) onUpdate(updatedDraft);
    setTimeout(() => setIsSaving(false), 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-700/50 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex justify-between items-start shrink-0 bg-neutral-900">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-heading uppercase">{client.name}</h2>
                <p className="text-sm text-neutral-400">{client.company || 'Empresa não informada'}</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
          
          {/* Dados Pessoais e Pendências */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-amber-500" /> Dados Pessoais
              </h3>
              <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</span>
                  <span className="text-white font-medium truncate ml-4" title={info.email}>{info.email || 'Não informado'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Telefone</span>
                  <span className="text-white font-medium">{info.phone || 'Não informado'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-400 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Documento</span>
                  <span className="text-white font-medium">{info.docNumber || 'Não informado'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" /> Status & Acompanhamento
              </h3>
              <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50 space-y-3">
                <div className="flex flex-col gap-1">
                  <span className="text-neutral-400 text-xs font-bold uppercase">Status da Venda</span>
                  <select 
                    value={salesStatus}
                    onChange={e => setSalesStatus(e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white px-3 py-1.5 focus:border-amber-500 outline-none w-full"
                  >
                    <option value="aguardando">Aguardando Proposta</option>
                    <option value="fechado">Fechado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-neutral-400 text-xs font-bold uppercase">Status do Lead</span>
                  <select 
                    value={leadStatus}
                    onChange={e => setLeadStatus(e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white px-3 py-1.5 focus:border-amber-500 outline-none w-full"
                  >
                    <option value="qualificado">Qualificado</option>
                    <option value="nao-qualificado">Não Qualificado</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" /> Notas e Observações
            </h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Adicione observações sobre a negociação..."
              className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4 text-sm text-white focus:border-amber-500 outline-none resize-none h-24 custom-scrollbar"
            />
          </div>

          {/* Financeiro */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-500" /> Resumo Financeiro
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50">
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-1">Total do Contrato</p>
                <p className="text-lg font-bold text-white font-mono truncate" title={formatBRL(total)}>{formatBRL(total)}</p>
              </div>
              <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50">
                <p className="text-xs text-emerald-400 uppercase tracking-wider font-bold mb-1">Entrada / Pago</p>
                <p className="text-lg font-bold text-emerald-500 font-mono truncate" title={formatBRL(entrance)}>{formatBRL(entrance)}</p>
              </div>
              <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50">
                <p className="text-xs text-amber-400 uppercase tracking-wider font-bold mb-1">Restante</p>
                <p className="text-sm font-bold text-amber-500 font-mono">{installments}x de {formatBRL(installmentValue)}</p>
              </div>
            </div>
          </div>

          {/* Resultados Esperados */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" /> Cenário de Evolução (IDE)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent"></div>
                <p className="text-[11px] text-neutral-400 uppercase tracking-wider font-bold mb-1 relative z-10">Como Entrou (Dependência IDE)</p>
                <div className="flex items-end gap-2 relative z-10">
                  <p className="text-3xl font-black text-red-400">{dData.ideDependency || 100}%</p>
                  <span className="text-[10px] text-red-500/70 mb-1 font-bold tracking-wider">MUITO ALTA</span>
                </div>
              </div>
              <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent"></div>
                <p className="text-[11px] text-neutral-400 uppercase tracking-wider font-bold mb-1 relative z-10">Meta de Governança</p>
                <div className="flex items-end gap-2 relative z-10">
                  <p className="text-3xl font-black text-emerald-400">15%</p>
                  <span className="text-[10px] text-emerald-500/70 mb-1 font-bold tracking-wider">ALTA LIBERDADE</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-neutral-500 text-center mt-2 font-medium">
              * A meta de governança visa reduzir a dependência do fundador (IDE) para 15% através do aumento de faturamento estruturado.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900 flex flex-col-reverse sm:flex-row justify-between gap-3 shrink-0">
          <button 
            onClick={() => {
              if (window.confirm('Tem certeza que deseja excluir esta apresentação? Ela sairá desta lista mas ainda poderá ser acessada caso tenha o link.')) {
                onDelete?.();
              }
            }}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-red-900/50 text-red-400 hover:text-white hover:bg-red-900/40 rounded-lg text-xs font-bold transition-colors uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Excluir
          </button>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg text-xs font-bold transition-colors uppercase tracking-wider cursor-pointer flex justify-center order-last sm:order-first mt-2 sm:mt-0"
            >
              Fechar
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-neutral-800 border border-neutral-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors uppercase tracking-wider hover:bg-neutral-700 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            {!client.companyId && (
              <button 
                onClick={() => {
                  const email = window.prompt('Digite o e-mail do cliente (Gmail/G Suite) que terá acesso ao painel:');
                  if (email && email.trim() !== '') {
                    onActivate?.(email.trim());
                  }
                }}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors uppercase tracking-wider shadow-lg cursor-pointer"
              >
                Ativar Painel <CheckCircle className="w-3.5 h-3.5" />
              </button>
            )}
            
            {client.companyId && (
              <button 
                onClick={() => {
                  const url = `${window.location.origin}/?session=${client.presentationSessionId}&view=dashboard`;
                  navigator.clipboard.writeText(url).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  });
                }}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-emerald-600/20 border border-emerald-600/50 hover:bg-emerald-600/30 text-emerald-400 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors uppercase tracking-wider cursor-pointer"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado!' : 'Copiar Link'}
              </button>
            )}

            <a 
              href={`/?session=${client.presentationSessionId}&view=dashboard`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-amber-500 hover:bg-amber-400 text-neutral-900 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors uppercase tracking-wider shadow-lg cursor-pointer"
          >
            Acessar Painel <ExternalLink className="w-3.5 h-3.5" />
          </a>
          </div>
        </div>
      </div>
    </div>
  );
}
