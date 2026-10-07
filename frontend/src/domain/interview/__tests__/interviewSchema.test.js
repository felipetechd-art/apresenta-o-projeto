import { describe, it, expect } from 'vitest';
import {
  createEmptyInterview,
  showField,
  isEmptyValue,
  questionIsAnswered,
  getProgress,
  formatAnswer,
  listAnswers,
  getPendingInfo,
  getConfirmationDivergences,
  companyKeyOf,
  INTERVIEW_STATUS,
  QUESTION_LIST,
  FIELD_MAP,
} from '../interviewSchema';

function interview(answers = {}, extra = {}) {
  return { ...createEmptyInterview(), answers, ...extra };
}

describe('criação da entrevista', () => {
  it('começa em preenchimento, sem candidatos e sem confirmação', () => {
    const base = createEmptyInterview({ consultantEmail: 'a@b.com', consultantName: 'Ana' });
    expect(base.status).toBe(INTERVIEW_STATUS.DRAFT);
    expect(base.schemaVersion).toBe(1);
    expect(base.candidates).toEqual([]);
    expect(base.confirmation.confirmedAt).toBeNull();
    expect(base.consultantEmail).toBe('a@b.com');
  });

  it('não compartilha referências entre entrevistas', () => {
    const a = createEmptyInterview();
    const b = createEmptyInterview();
    a.answers.q1_empresaNome = 'Acme';
    expect(b.answers.q1_empresaNome).toBeUndefined();
  });
});

describe('campos condicionais e vazio', () => {
  it('mostra campo sem regra de exibição', () => {
    expect(showField({ id: 'x' }, {})).toBe(true);
  });

  it('respeita showIf quando a resposta não condiz', () => {
    const field = { id: 'q1_empresasNomes', showIf: { field: 'q1_abrangencia', includes: 'multiplas' } };
    expect(showField(field, { q1_abrangencia: 'multiplas' })).toBe(true);
    expect(showField(field, {})).toBe(false);
    expect(showField(field, { q1_abrangencia: 'unica' })).toBe(false);
  });

  it('respeita showIfNot', () => {
    const field = { id: 'q7_ultimoExemplo', showIfNot: { field: 'q7_problema', includes: 'nenhum' } };
    expect(showField(field, { q7_problema: 'nenhum' })).toBe(false);
    expect(showField(field, { q7_problema: 'erros_retrabalho' })).toBe(true);
    expect(showField(field, {})).toBe(true);
  });

  it('diferencia vazio de zero', () => {
    expect(isEmptyValue(undefined)).toBe(true);
    expect(isEmptyValue(null)).toBe(true);
    expect(isEmptyValue('')).toBe(true);
    expect(isEmptyValue([])).toBe(true);
    expect(isEmptyValue({})).toBe(true);
    expect(isEmptyValue(0)).toBe(false);
    expect(isEmptyValue('0')).toBe(false);
  });

  it('pergunta respondida por valor ou apenas por contexto', () => {
    const question = QUESTION_LIST.find((q) => q.id === 'q7');
    expect(questionIsAnswered(interview(), question)).toBe(false);
    expect(questionIsAnswered(interview({ q7_problema: 'pendencias' }), question)).toBe(true);
    expect(
      questionIsAnswered(
        interview({}, { contexts: { q7_problema: 'Contexto registrado' } }),
        question
      )
    ).toBe(true);
  });
});

describe('progresso', () => {
  it('zera com entrevista vazia', () => {
    const progress = getProgress(createEmptyInterview());
    expect(progress.answered).toBe(0);
    expect(progress.percent).toBe(0);
    expect(progress.total).toBe(QUESTION_LIST.length);
  });

  it('sobe conforme as perguntas são respondidas', () => {
    const progress = getProgress(
      interview({
        q1_empresaNome: 'Acme',
        q1_entrevistadoNome: 'Ana',
        q2_motivo: 'crescimento',
        q2_episodio: 'Episódio registrado.',
        q4_mudanca: 'Reduzir retrabalho.',
        q11_mudanca: 'Decisões saem sem o dono.',
      })
    );
    expect(progress.answered).toBe(4);
    expect(progress.percent).toBe(Math.round((4 / QUESTION_LIST.length) * 100));
  });
});

describe('formatação de respostas', () => {
  it('devolve null para valor vazio', () => {
    expect(formatAnswer(FIELD_MAP.q2_episodio, '')).toBeNull();
    expect(formatAnswer(FIELD_MAP.q1_equipe, undefined)).toBeNull();
  });

  it('rotula opção single', () => {
    expect(formatAnswer(FIELD_MAP.q2_motivo, 'dependencia_dono')).toBe(
      'Equipe muito dependente do dono.'
    );
  });

  it('rotula todas as opções de multi', () => {
    const field = { id: 'x', type: 'multi', options: [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }] };
    expect(formatAnswer(field, ['b', 'a'])).toBe('Beta; Alpha');
  });

  it('formata lista de etapas numeradas', () => {
    const text = formatAnswer(FIELD_MAP.q6_etapas, [
      { oQueAconteceu: 'Pedido recebido', quemExecutou: 'Comercial', espera: '' },
    ]);
    expect(text).toContain('1. O que aconteceu: Pedido recebido');
    expect(text).toContain('Quem executou: Comercial');
    expect(text).not.toContain('Espera');
  });

  it('converte número e texto', () => {
    expect(formatAnswer(FIELD_MAP.q1_equipe, 12)).toBe('12');
    expect(formatAnswer(FIELD_MAP.q1_empresaNome, 'Acme')).toBe('Acme');
  });
});

describe('listagem de respostas', () => {
  it('ignora campos vazios', () => {
    expect(listAnswers(interview())).toHaveLength(0);
  });

  it('inclui resposta preenchida com rótulo e contexto quando houver', () => {
    const rows = listAnswers(
      interview(
        { q2_motivo: 'crescimento' },
        { contexts: { q2_motivo: 'Contexto do motivo' } }
      )
    );
    const row = rows.find((r) => r.fieldId === 'q2_motivo');
    expect(row.text).toBe('Crescimento difícil de sustentar.');
    expect(row.context).toBe('Contexto do motivo');
    expect(row.contextEnabled).toBe(false);
  });

  it('separa campos exclusivos do consultor', () => {
    const rows = listAnswers(interview({ q3_situacaoContrato: 'alinhada' }), {
      consultantOnly: true,
    });
    expect(rows.some((r) => r.fieldId === 'q3_situacaoContrato')).toBe(true);
    expect(rows.some((r) => r.fieldId === 'q1_empresaNome')).toBe(false);
  });
});

describe('pendências', () => {
  it('lista todos os obrigatórios ausentes no rascunho', () => {
    const pending = getPendingInfo(createEmptyInterview());
    expect(pending).toHaveLength(5);
    expect(pending.every((item) => item.includes('—'))).toBe(true);
  });

  it('zera quando os obrigatórios estão preenchidos', () => {
    const pending = getPendingInfo(
      interview({
        q1_empresaNome: 'Acme',
        q1_entrevistadoNome: 'Ana',
        q2_episodio: 'Episódio registrado.',
        q4_mudanca: 'Reduzir retrabalho.',
        q11_mudanca: 'Decisões sem o dono.',
      })
    );
    expect(pending).toEqual([]);
  });

  it('não cobra resumo e candidatos ainda no rascunho', () => {
    const pending = getPendingInfo(interview({}, { status: INTERVIEW_STATUS.DRAFT }));
    expect(pending.some((p) => p.includes('Resumo'))).toBe(false);
    expect(pending.some((p) => p.includes('problema ou oportunidade'))).toBe(false);
  });

  it('cobra resumo, candidatos e confirmação fora do rascunho', () => {
    const pending = getPendingInfo(
      interview(
        {
          q1_empresaNome: 'Acme',
          q1_entrevistadoNome: 'Ana',
          q2_episodio: 'Episódio registrado.',
          q4_mudanca: 'Reduzir retrabalho.',
          q11_mudanca: 'Decisões sem o dono.',
        },
        { status: INTERVIEW_STATUS.WAITING, summary: null, candidates: [] }
      )
    );
    expect(pending.some((p) => p.includes('Resumo do entendimento'))).toBe(true);
    expect(pending.some((p) => p.includes('problema ou oportunidade'))).toBe(true);
    expect(pending.some((p) => p.includes('Confirmação do cliente'))).toBe(true);
  });
});

describe('confirmação do cliente', () => {
  it('sem resposta divergente não gera correção aberta', () => {
    expect(getConfirmationDivergences(interview())).toEqual([]);
  });

  it('“Em parte” ou “Não” sem correção registrada fica em aberto', () => {
    const divergences = getConfirmationDivergences(
      interview({}, { confirmation: { answers: { q1: 'nao', q2: 'em_parte' }, corrections: '' } })
    );
    expect(divergences.map((d) => d.id)).toEqual(['q1', 'q2']);
  });

  it('correção registrada fecha a divergência', () => {
    const divergences = getConfirmationDivergences(
      interview({}, { confirmation: { answers: { q1: 'nao' }, corrections: 'O valor inclui duas empresas.' } })
    );
    expect(divergences).toEqual([]);
  });
});

describe('chave da empresa', () => {
  it('normaliza nome para minúsculas e sem espaços nas pontas', () => {
    expect(companyKeyOf(interview({ q1_empresaNome: '  Acme Ltda ' }))).toBe('acme ltda');
  });

  it('usa companyKey quando não há nome na resposta', () => {
    expect(companyKeyOf({ companyKey: 'Outra' })).toBe('outra');
    expect(companyKeyOf({})).toBe('');
  });
});
