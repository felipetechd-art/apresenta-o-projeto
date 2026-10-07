const fs = require('fs');

let code = fs.readFileSync('d:/2026/PROJETOS SISTEMAS/PGE/frontend/src/components/admin/DiagnosticConfigView.jsx', 'utf8');

const newDefaultData = `      const defaultData = {
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
      };`;

const startIndex = code.indexOf('const defaultData = {');
const endIndex = code.indexOf('};', startIndex) + 2;

if (startIndex !== -1 && endIndex !== -1) {
  code = code.slice(0, startIndex) + newDefaultData + code.slice(endIndex);
  fs.writeFileSync('d:/2026/PROJETOS SISTEMAS/PGE/frontend/src/components/admin/DiagnosticConfigView.jsx', code, 'utf8');
  console.log('Successfully updated defaultData.');
} else {
  console.log('Could not find defaultData block.');
}
