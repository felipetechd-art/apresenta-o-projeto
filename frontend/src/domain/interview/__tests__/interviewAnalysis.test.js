import { describe, it, expect } from 'vitest';
import {
  suggestCandidates,
  suggestNotes,
  suggestNoteFor,
  buildSummary,
  summaryText,
  buildClientPriorities,
  criteriaExplainedPlain,
  countByClassification,
  textSummary,
  listQuestionHeadings,
  getQuestionTitle,
  SUMMARY_SECTIONS,
} from '../interviewAnalysis';
import { createEmptyInterview, CLASSIFICATIONS, INTERVIEW_BLOCKS } from '../interviewSchema';

function interview(answers = {}, extra = {}) {
  return {
    ...createEmptyInterview({ consultantEmail: 'consultor@pge.com' }),
    answers,
    ...extra,
  };
}

describe('suggestCandidates', () => {
  it('não sugere candidatos para entrevista vazia', () => {
    expect(suggestCandidates(interview())).toEqual([]);
  });

  it('sugere candidato a partir do episódio relatado, com vínculo e classificação', () => {
    const drafts = suggestCandidates(
      interview({ q2_motivo: 'dependencia_dono', q2_episodio: 'Toda semana algum processo para para esperar decisão.' })
    );
    expect(drafts).toHaveLength(1);
    expect(drafts[0].sourceQuestion).toBe('q2');
    expect(drafts[0].sourceField).toBe('q2_episodio');
    expect(drafts[0].sourceAnswer).toContain('Toda semana');
    expect(drafts[0].classification).toBe(CLASSIFICATIONS.CLIENT_REPORT);
    expect(drafts[0].title).toContain('Motivo da contratação');
  });

  it('usa a classificação de hipótese quando não há exemplo concreto', () => {
    const drafts = suggestCandidates(interview({ q7_problema: 'erros_retrabalho' }));
    expect(drafts).toHaveLength(1);
    expect(drafts[0].title).toBe('Problema recorrente: Erros e retrabalho');
    expect(drafts[0].classification).toBe(CLASSIFICATIONS.HYPOTHESIS);
  });

  it('ignora “Nenhum identificado.” no problema recorrente', () => {
    expect(suggestCandidates(interview({ q7_problema: 'nenhum' }))).toEqual([]);
  });

  it('sugere candidato quando a orientação é verbal ou consulta ao dono', () => {
    const verbal = suggestCandidates(interview({ q8_orientacao: 'verbal' }));
    expect(verbal).toHaveLength(1);
    expect(verbal[0].classification).toBe(CLASSIFICATIONS.HYPOTHESIS);

    const dono = suggestCandidates(interview({ q8_orientacao: 'dono' }));
    expect(dono).toHaveLength(1);

    expect(suggestCandidates(interview({ q8_orientacao: 'claros' }))).toEqual([]);
  });

  it('sugere candidato quando não há acompanhamento regular', () => {
    const drafts = suggestCandidates(interview({ q8_acompanhamento: 'nenhum' }));
    expect(drafts).toHaveLength(1);
    expect(drafts[0].title).toContain('acompanhamento');
    expect(drafts[0].classification).toBe(CLASSIFICATIONS.HYPOTHESIS);
    expect(suggestCandidates(interview({ q8_acompanhamento: 'sistema' }))).toEqual([]);
  });

  it('cria um candidato por etapa do atendimento que registra espera', () => {
    const drafts = suggestCandidates(
      interview({
        q6_etapas: [
          { oQueAconteceu: 'Pedido recebido', quemExecutou: 'Comercial', espera: 'Espera por aprovação do dono' },
          { oQueAconteceu: 'Entrega concluída', quemExecutou: 'Operação', espera: '' },
        ],
      })
    );
    expect(drafts).toHaveLength(1);
    expect(drafts[0].title).toContain('etapa 1');
    expect(drafts[0].sourceField).toBe('q6_etapas');
  });

  it('não repete candidato já existente com a mesma origem e título', () => {
    const base = interview({ q10_limites: 'Não executar em finais de semana.' });
    const first = suggestCandidates(base);
    expect(first).toHaveLength(1);

    const withCandidate = {
      ...base,
      candidates: [{ ...first[0] }],
    };
    expect(suggestCandidates(withCandidate)).toEqual([]);
  });

  it('preenche notas sugeridas em todos os candidatos gerados', () => {
    const drafts = suggestCandidates(
      interview({ q2_episodio: 'Isso acontece todos os dias e atrasou a entrega.' })
    );
    expect(drafts[0].notes.F.suggestion).toBe(5);
    expect(drafts[0].notes.I.suggestion).toBe(3);
  });
});

describe('suggestNotes', () => {
  it('sugere frequência e impacto com evidência do texto', () => {
    const notes = suggestNotes({
      sourceAnswer: 'Toda semana o time espera decisão e isso atrasou a entrega.',
      sourceContext: '',
      notes: {},
    });
    expect(notes.F).toMatchObject({ status: 'pending', suggestion: 3, source: 'sugestao_resposta' });
    expect(notes.F.suggestionEvidence).toContain('Toda semana');
    expect(notes.I.suggestion).toBe(3);
    expect(notes.I.suggestionEvidence).toContain('atrasou');
  });

  it('não sobrescreve nota já definida pelo consultor', () => {
    const notes = suggestNotes({
      sourceAnswer: 'Isso acontece todos os dias.',
      sourceContext: '',
      notes: { F: { status: 'set', value: 2 } },
    });
    expect(notes.F).toEqual({ status: 'set', value: 2 });
  });

  it('não sugere relação com o objetivo nem viabilidade', () => {
    const notes = suggestNotes({
      sourceAnswer: 'Acontece todos os dias e paralisa a operação.',
      sourceContext: '',
      notes: {},
    });
    expect(notes.R).toBeUndefined();
    expect(notes.V).toBeUndefined();
  });

  it('suggestNoteFor devolve apenas o critério pedido', () => {
    const note = suggestNoteFor(
      { sourceAnswer: 'Isso acontece todos os dias.', sourceContext: '', notes: {} },
      interview(),
      'F'
    );
    expect(note.suggestion).toBe(5);
    expect(suggestNoteFor({ sourceAnswer: 'texto', sourceContext: '', notes: {} }, interview(), 'I')).toBeNull();
  });
});

describe('buildSummary', () => {
  it('gera as oito seções na ordem definida', () => {
    const summary = buildSummary(interview());
    expect(summary.sections).toHaveLength(SUMMARY_SECTIONS.length);
    summary.sections.forEach((section, index) => {
      expect(section.id).toBe(SUMMARY_SECTIONS[index].id);
      expect(section.label).toBe(SUMMARY_SECTIONS[index].label);
      expect(section.text.length).toBeGreaterThan(0);
    });
  });

  it('marca como pendente o que não foi registrado', () => {
    const summary = buildSummary(interview());
    const motivo = summary.sections.find((s) => s.id === 'motivo');
    expect(motivo.basis).toBe('pendente');
    expect(motivo.text).toBe('Não registrado na entrevista.');
  });

  it('compõe alcance, motivo e pendências a partir das respostas', () => {
    const summary = buildSummary(
      interview({
        q1_empresaNome: 'Acme',
        q1_abrangencia: 'unica',
        q1_equipe: 12,
        q2_motivo: 'crescimento',
        q2_episodio: 'Perdemos um cliente por atraso.',
        q4_mudanca: 'Decisões saem sem depender do dono.',
      })
    );
    const alcance = summary.sections.find((s) => s.id === 'alcance');
    expect(alcance.text).toContain('empresa Acme');
    expect(alcance.text).toContain('equipe de 12 pessoas');

    const motivo = summary.sections.find((s) => s.id === 'motivo');
    expect(motivo.basis).toBe('relato');
    expect(motivo.text).toContain('Perdemos um cliente');

    const pendentes = summary.sections.find((s) => s.id === 'pendentes');
    expect(pendentes.text.length).toBeGreaterThan(0);
  });

  it('não preenche informação ausente como se fosse negativa', () => {
    const summary = buildSummary(interview({ q4_mudanca: 'Reduzir retrabalho.' }));
    const resultado = summary.sections.find((s) => s.id === 'resultado6m');
    expect(resultado.text).toContain('Reduzir retrabalho.');
    expect(resultado.text).not.toContain('undefined');
  });
});

describe('summaryText', () => {
  it('usa o texto editado quando existe', () => {
    expect(summaryText({ text: 'Resumo editado' })).toBe('Resumo editado');
  });

  it('concatena as seções quando não há texto editado', () => {
    const text = summaryText(
      buildSummary(interview({ q1_empresaNome: 'Acme' }))
    );
    expect(text).toContain('Empresa e alcance inicial do trabalho');
    expect(text).toContain('empresa Acme');
  });

  it('retorna vazio sem resumo', () => {
    expect(summaryText(null)).toBe('');
  });
});

describe('prioridades em linguagem de cliente', () => {
  it('apenas itens aprovados, sem fórmulas ou pesos', () => {
    const priorities = buildClientPriorities(interview(), {
      approved: [
        {
          position: 1,
          title: 'Decisões concentradas no dono',
          understood: 'Atividades aguardam o dono.',
          sourceAnswer: 'Relato do entrevistado',
          sourceContext: 'Contexto registrado',
          classification: CLASSIFICATIONS.CLIENT_REPORT,
        },
      ],
      top: [],
    });
    expect(priorities).toHaveLength(1);
    expect(priorities[0]).toMatchObject({
      position: 1,
      title: 'Decisões concentradas no dono',
      classification: CLASSIFICATIONS.CLIENT_REPORT,
    });
    expect(priorities[0].evidence).toBe('Relato do entrevistado Contexto registrado');
    expect(priorities[0].weights).toBeUndefined();
  });

  it('sem ranking aprovado devolve lista vazia', () => {
    expect(buildClientPriorities(interview(), { approved: [], top: [] })).toEqual([]);
  });

  it('explica os critérios em linguagem simples', () => {
    const criteria = criteriaExplainedPlain();
    expect(criteria).toHaveLength(4);
    expect(criteria.join(' ')).not.toMatch(/[0-9]+%/);
  });
});

describe('contagens e textos auxiliares', () => {
  it('inicializa todas as classificações mesmo sem candidatos', () => {
    const counts = countByClassification(interview());
    Object.values(CLASSIFICATIONS).forEach((label) => {
      expect(counts[label]).toBe(0);
    });
  });

  it('conta candidatos por classificação e ignora classificação desconhecida', () => {
    const counts = countByClassification(
      interview({}, {
        candidates: [
          { classification: CLASSIFICATIONS.CLIENT_REPORT },
          { classification: CLASSIFICATIONS.CLIENT_REPORT },
          { classification: CLASSIFICATIONS.HYPOTHESIS },
          {},
        ],
      })
    );
    expect(counts[CLASSIFICATIONS.CLIENT_REPORT]).toBe(2);
    expect(counts[CLASSIFICATIONS.HYPOTHESIS]).toBe(2);
    expect(counts[CLASSIFICATIONS.CONFIRMED]).toBe(0);
  });

  it('trunca texto longo com reticências', () => {
    const long = 'x'.repeat(200);
    const result = textSummary(long, 20);
    expect(result).toHaveLength(20);
    expect(result.endsWith('…')).toBe(true);
    expect(textSummary('curto')).toBe('curto');
    expect(textSummary('   ')).toBe('');
  });

  it('lista o título de todas as perguntas e resolve por id', () => {
    const headings = listQuestionHeadings();
    expect(headings).toHaveLength(INTERVIEW_BLOCKS.length);
    expect(headings[0].questions.length).toBeGreaterThan(0);
    expect(getQuestionTitle('q7')).toContain('problema');
    expect(getQuestionTitle('inexistente')).toBe('inexistente');
  });
});
