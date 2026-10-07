import { describe, it, expect } from 'vitest';
import {
  DEFAULT_WEIGHTS,
  NOTE_STATUS,
  calcImportance,
  calcPriority,
  eligibility,
  buildRanking,
  scoreCandidate,
  markNotesForReview,
  createEmptyNotes,
} from '../priorityEngine';
import { getPendingInfo, createEmptyInterview, getProgress } from '../interviewSchema';

function candidate(overrides = {}) {
  return {
    id: 'c1',
    title: 'Problema de teste',
    sourceQuestion: 'q7',
    sourceAnswer: 'Exemplo registrado pelo cliente.',
    sourceContext: 'Contexto extra.',
    evidence: 'Exemplo registrado pelo cliente.',
    notes: {
      I: { status: NOTE_STATUS.SET, value: 5 },
      F: { status: NOTE_STATUS.SET, value: 3 },
      R: { status: NOTE_STATUS.SET, value: 4 },
      V: { status: NOTE_STATUS.SET, value: 4 },
    },
    ...overrides,
  };
}

describe('fórmulas de importância e prioridade', () => {
  it('calcula Importância = 100 × [(0,60×I + 0,20×F + 0,20×R) ÷ 5]', () => {
    expect(calcImportance(candidate())).toBe(88);
  });

  it('calcula Prioridade = 100 × [(0,35×I + 0,20×F + 0,25×R + 0,20×V) ÷ 5]', () => {
    expect(calcPriority(candidate())).toBe(83);
  });

  it('arredonda para uma casa decimal', () => {
    const c = candidate();
    c.notes.I.value = 4;
    c.notes.F.value = 3;
    c.notes.R.value = 3;
    c.notes.V.value = 4;
    // 0.6*4 + 0.2*3 + 0.2*3 = 3.6 -> 100*3.6/5 = 72
    expect(calcImportance(c)).toBe(72);
    // 0.35*4 + 0.2*3 + 0.25*3 + 0.2*4 = 1.4+0.6+0.75+0.8 = 3.55 -> 71
    expect(calcPriority(c)).toBe(71);
  });

  it('não calcula prioridade quando falta um critério', () => {
    const c = candidate();
    c.notes.V = { status: NOTE_STATUS.PENDING, value: null };
    expect(calcImportance(c)).toBe(88);
    expect(calcPriority(c)).toBeNull();
  });

  it('não calcula importância quando falta I, F ou R', () => {
    const c = candidate();
    c.notes.R = { status: NOTE_STATUS.PENDING, value: null };
    expect(calcImportance(c)).toBeNull();
    expect(calcPriority(c)).toBeNull();
  });
});

describe('“Ainda não sabemos” permanece diferente de zero', () => {
  it('armazena como valor ausente e não como 0', () => {
    const c = candidate();
    c.notes.V = { status: NOTE_STATUS.UNKNOWN, value: null };
    expect(calcPriority(c)).toBeNull();
    expect(getNoteValueSafe(c, 'V')).toBeNull();
  });

  it('não deixa um zero explícito ser lido como 0 quando o status é unknown', () => {
    const c = candidate();
    c.notes.V = { status: NOTE_STATUS.UNKNOWN, value: 0 };
    expect(getNoteValueSafe(c, 'V')).toBeNull();
    expect(calcPriority(c)).toBeNull();
  });

  it('zero explícito com status SET é válido', () => {
    const c = candidate();
    c.notes.I = { status: NOTE_STATUS.SET, value: 0 };
    c.notes.F = { status: NOTE_STATUS.SET, value: 0 };
    c.notes.R = { status: NOTE_STATUS.SET, value: 0 };
    c.notes.V = { status: NOTE_STATUS.SET, value: 0 };
    expect(calcImportance(c)).toBe(0);
    expect(calcPriority(c)).toBe(0);
  });
});

function getNoteValueSafe(c, key) {
  const note = scoreCandidate(c).notes[key];
  return note.status === NOTE_STATUS.SET ? note.value : null;
}

describe('elegibilidade', () => {
  it('exige notas completas, viabilidade ≥ 3, sem bloqueio e vínculo com evidência', () => {
    expect(eligibility(candidate()).eligible).toBe(true);
  });

  it('recusa viabilidade menor que 3', () => {
    const c = candidate();
    c.notes.V.value = 2;
    const result = eligibility(c);
    expect(result.eligible).toBe(false);
    expect(result.reasons.join(' ')).toContain('Viabilidade abaixo de 3');
  });

  it('recusa candidato bloqueado e mantém a ação necessária', () => {
    const c = candidate({ blocked: true, blockAction: 'Aguardar definição de responsável.' });
    const result = eligibility(c);
    expect(result.eligible).toBe(false);
    expect(result.blocked).toBe(true);
    expect(result.reasons.join(' ')).toContain('Aguardar definição');
  });

  it('recusa candidato sem vínculo com resposta', () => {
    const c = candidate({ sourceQuestion: '', sourceAnswer: '', sourceContext: '', evidence: '' });
    expect(eligibility(c).eligible).toBe(false);
  });
});

describe('ranking dos cinco pontos', () => {
  const make = (id, I, F, R, V, extra = {}) =>
    candidate({
      id,
      title: id,
      notes: {
        I: { status: NOTE_STATUS.SET, value: I },
        F: { status: NOTE_STATUS.SET, value: F },
        R: { status: NOTE_STATUS.SET, value: R },
        V: { status: NOTE_STATUS.SET, value: V },
      },
      ...extra,
    });

  it('ordena por prioridade de execução', () => {
    const interview = {
      candidates: [make('a', 3, 3, 3, 3), make('b', 5, 5, 5, 5), make('c', 4, 4, 4, 4)],
      manualOrder: [],
    };
    const ranking = buildRanking(interview);
    expect(ranking.top.map((c) => c.id)).toEqual(['b', 'c', 'a']);
  });

  it('mostra menos de cinco quando faltam dados', () => {
    const interview = {
      candidates: [make('a', 5, 5, 5, 5), make('b', 4, 4, 4, 4)],
      manualOrder: [],
    };
    const ranking = buildRanking(interview);
    expect(ranking.top).toHaveLength(2);
    expect(ranking.hasFewerThanFive).toBe(true);
    expect(ranking.missingDataNote).toContain('Faltam informações');
  });

  it('não inventa candidatos para completar cinco posições', () => {
    const interview = { candidates: [], manualOrder: [] };
    const ranking = buildRanking(interview);
    expect(ranking.top).toHaveLength(0);
    expect(ranking.hasFewerThanFive).toBe(true);
  });

  it('separa bloqueados e importantes dependentes de preparação', () => {
    const blocked = make('bl', 5, 5, 5, 5, { blocked: true, blockAction: 'Pendência externa.' });
    const lowViability = make('low', 5, 5, 5, 1);
    const ranking = buildRanking({ candidates: [blocked, lowViability], manualOrder: [] });
    expect(ranking.blocked.map((c) => c.id)).toEqual(['bl']);
    expect(ranking.preparation.map((c) => c.id)).toEqual(['low']);
    expect(ranking.top).toHaveLength(0);
  });

  it('empata por importância, relação e viabilidade', () => {
    const a = make('a', 4, 4, 4, 3);
    const b = make('b', 4, 4, 4, 3);
    const ranking = buildRanking({ candidates: [a, b], manualOrder: [] });
    expect(ranking.top).toHaveLength(2);
  });
});

describe('marcação para revisão ao editar resposta', () => {
  it('marca notas do candidato cuja pergunta de origem mudou', () => {
    const interview = { candidates: [candidate()] };
    const { interview: next, count } = markNotesForReview(interview, ['q7']);
    expect(count).toBe(1);
    Object.values(next.candidates[0].notes).forEach((note) => {
      expect(note.needsReview).toBe(true);
    });
  });

  it('não marca candidatos de outras perguntas', () => {
    const interview = { candidates: [candidate()] };
    const { interview: next, count } = markNotesForReview(interview, ['q2']);
    expect(count).toBe(0);
    expect(next.candidates[0].notes.I.needsReview).toBeFalsy();
  });
});

describe('pendências e progresso', () => {
  it('cria entrevista vazia com notas pendentes e progresso zero', () => {
    const interview = createEmptyInterview({ consultantEmail: 'a@b.com' });
    expect(getProgress(interview).percent).toBe(0);
    expect(interview.candidates).toEqual([]);
    expect(createEmptyNotes().I.status).toBe(NOTE_STATUS.PENDING);
  });

  it('não interpreta resposta ausente como negativa', () => {
    const interview = createEmptyInterview();
    interview.answers.q2_motivo = undefined;
    const pending = getPendingInfo(interview);
    expect(pending.some((p) => p.includes('episódio'))).toBe(true);
  });

  it('mantém pesos padrão versionados', () => {
    expect(DEFAULT_WEIGHTS.version).toBe('v1');
    expect(DEFAULT_WEIGHTS.importance).toEqual({ I: 0.6, F: 0.2, R: 0.2 });
    expect(DEFAULT_WEIGHTS.priority).toEqual({ I: 0.35, F: 0.2, R: 0.25, V: 0.2 });
  });
});
