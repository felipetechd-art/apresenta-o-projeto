import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Send, Users, Sparkles, Building, Briefcase, Layers } from 'lucide-react';
import { LucroOcultoRepository } from '../../repositories/LucroOcultoRepository';

export function LucroOcultoTeamSurvey() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session') || 'geral';
  const empresaParam = searchParams.get('empresa') || '';

  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [setor, setSetor] = useState('');
  const [atividades, setAtividades] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !cargo || !setor || !atividades) return;

    setLoading(true);
    try {
      await LucroOcultoRepository.saveTeamResponse(sessionId, {
        nome,
        cargo,
        setor,
        atividades
      });
      setEnviado(true);
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen bg-[#070b12] text-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-heading font-black text-white">
            Resposta enviada com sucesso!
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Muito obrigado, <strong>{nome}</strong>! Sua resposta foi registrada e ajudará a liderança a eliminar tarefas repetitivas, retrabalhos e melhorar as ferramentas do seu dia a dia.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setNome('');
                setCargo('');
                setSetor('');
                setAtividades('');
                setEnviado(false);
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
            >
              Enviar outra contribuição
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-gray-100 flex flex-col justify-between p-4 sm:p-8 selection:bg-amber-500 selection:text-black">
      <div className="max-w-xl w-full mx-auto my-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 border-b border-neutral-800 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            Pesquisa Interna de Rotinas & Processos
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-white">
            {empresaParam ? `${empresaParam} • ` : ''}Mapeamento de Atividades Repetitivas
          </h1>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Preencha seus dados e conte quais atividades consomem mais tempo da sua rotina. Seu feedback é fundamental para simplificar rotinas e modernizar processos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-neutral-300 block mb-1 font-medium">Nome Completo *</label>
            <input 
              type="text" 
              required
              placeholder="Ex: João da Silva"
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-300 block mb-1 font-medium">Cargo / Função *</label>
              <input 
                type="text" 
                required
                placeholder="Ex: Assistente Administrativo"
                value={cargo}
                onChange={e => setCargo(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-neutral-300 block mb-1 font-medium">Setor / Departamento *</label>
              <input 
                type="text" 
                required
                placeholder="Ex: Comercial, Financeiro, Operação"
                value={setor}
                onChange={e => setSetor(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-neutral-300 block mb-1 font-medium">
              Quais atividades repetitivas consomem mais tempo do seu dia a dia? *
            </label>
            <textarea 
              rows={4}
              required
              placeholder="Ex: Copiar e colar dados do WhatsApp para planilhas, emitir boletos e notas manualmente, conferir relatórios que poderiam ser automáticos, cobrar aprovações, preencher cadastros repetidos..."
              value={atividades}
              onChange={e => setAtividades(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-colors leading-relaxed"
            />
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Seja o mais específico possível. Todas as informações serão usadas para melhorar seu trabalho.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-heading font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Enviando...' : 'Enviar Minha Resposta'}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      <footer className="text-center text-[10px] text-neutral-600 py-3">
        Mapa do Lucro Oculto Empresarial • Mapeamento Operacional
      </footer>
    </div>
  );
}
