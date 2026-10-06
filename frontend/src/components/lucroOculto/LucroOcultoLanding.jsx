import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Target, 
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import felipeImg from '../../assets/felipe.jpg';

export function LucroOcultoLanding({ onStart, onResumeSaved, hasSavedDraft, previousReportsCount }) {
  return (
    <div className="min-h-screen bg-[#070b12] text-gray-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Header Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent pointer-events-none blur-3xl" />

      {/* Navigation Topbar */}
      <header className="border-b border-neutral-800/80 bg-black/40 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <TrendingUp className="w-5 h-5 text-neutral-950 font-black" />
            </div>
            <div>
              <span className="font-heading font-black text-base text-white tracking-wide uppercase">
                MAPA DO LUCRO <span className="text-amber-400">OCULTO</span>
              </span>
              <span className="hidden sm:block text-[9px] text-neutral-400 uppercase tracking-widest font-semibold">
                Diagnóstico de Eficiência & Escalabilidade
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasSavedDraft && (
              <button
                onClick={onResumeSaved}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 transition-colors"
              >
                Continuar Rascunho
              </button>
            )}
            <a
              href="/admin"
              className="text-xs text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 transition-colors"
            >
              Painel Admin
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section with Felipe */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-14 flex flex-col items-center relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6 shadow-[0_0_20px_rgba(245,158,11,0.15)] animate-fade-in">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          Diagnóstico Digital Interativo • Exclusivo para Empresários
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-10">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight leading-[1.15]">
            Descubra quanto <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">dinheiro e capacidade</span> sua empresa está desperdiçando na operação.
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 font-light max-w-2xl mx-auto leading-relaxed">
            Um motor de diagnóstico estratégico para quantificar gargalos, retrabalho, ferramentas duplicadas e destravar o lucro oculto do seu negócio — <strong className="text-white font-semibold">sem inventar números</strong>.
          </p>
        </div>

        {/* Presenter Card: Felipe */}
        <div className="w-full max-w-4xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            {/* Foto de Felipe */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.25)] relative group">
                <img 
                  src={felipeImg} 
                  alt="Felipe - Especialista em Eficiência Operacional" 
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-neutral-900 border border-amber-500/40 rounded-lg px-2 py-0.5 text-[10px] font-black text-amber-400 uppercase tracking-widest shadow-md">
                Estrategista
              </div>
            </div>

            {/* Mensagem de Boas-Vindas */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Boas-vindas ao Mapa do Lucro Oculto
                </h3>
                <p className="text-xs sm:text-sm text-amber-400 font-medium">
                  Com Felipe • Especialista Sênior em Estratégia, Eficiência e Automação
                </p>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed">
                “A maioria das empresas não sofre por falta de esforço, mas sim porque está drenando dinheiro, margem e horas dos seus líderes em processos manuais, retrabalho e tecnologia desconectada.
              </p>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Ao longo dos próximos minutos, vamos radiografar pessoas, processos, ferramentas, comercial e finanças. Ao final, você terá em mãos o <strong className="text-amber-400 font-bold">valor exato em R$ do seu Lucro Oculto</strong> e um plano de ação claro para os próximos 30, 60 e 90 dias.”
              </p>
            </div>
          </div>
        </div>

        {/* 4 Pilares Fundamentais */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">Aumentar Receita & Margem</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Destravar oportunidades comerciais e eliminar vazamentos no funil de vendas.
              </p>
            </div>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">Recuperar Capacidade</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Converter horas de digitação e retrabalho em capacidade produtiva e faturamento.
              </p>
            </div>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">Reduzir Dependência</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Tirar o empresário e líderes do operacional através de processos e automações.
              </p>
            </div>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">Escalar sem Inchar</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Crescer o faturamento sem precisar aumentar a equipe na mesma proporção.
              </p>
            </div>
          </div>
        </div>

        {/* O que você receberá ao final */}
        <div className="w-full max-w-4xl bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-7 mb-10">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" />
            O que você receberá ao concluir:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Índice de Escalabilidade Operacional (IEO):</strong> Nota de 0 a 100 da sua operação.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Lucro Oculto Mensal e Anual:</strong> Valor monetário preciso de dinheiro recuperável.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Capacidade Oculta & Horas:</strong> Quantidade de horas e jornadas operacionais a liberar.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Contratações Evitáveis:</strong> Como crescer sem inflar a folha de pagamento.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Top 5 Gargalos & Oportunidades:</strong> Diagnóstico cirúrgico com nível de confiança.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Plano de Ação 30, 60 e 90 dias:</strong> Quick Wins imediatos e esteira de execução.</span>
            </div>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="flex flex-col items-center gap-3 w-full max-w-md">
          <button
            onClick={onStart}
            className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-heading font-black text-base sm:text-lg uppercase tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Iniciar Diagnóstico Interativo</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <span className="text-[11px] text-neutral-500 text-center">
            Tempo estimado: 8 a 12 minutos • Perguntas diretas em blocos simples
          </span>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-black/60 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto px-4 space-y-1">
          <p>© {new Date().getFullYear()} Mapa do Lucro Oculto Empresarial • Todos os direitos reservados.</p>
          <p className="text-[10px] text-neutral-600">Princípio: Tecnologia é meio. Eficiência econômica é o objetivo.</p>
        </div>
      </footer>
    </div>
  );
}
