import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  listDevis,
  nextDevisNumero,
  validateDevisDraft,
  createDevis,
} from '../../src/services/devisService';
import { seedDevis } from '../../src/mocks/seed';
import { TypeContrat, StatutDevis } from '../../src/models/types';

describe('devisService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-01T10:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('trie les devis du plus récent au plus ancien', () => {
    const sorted = listDevis(seedDevis);
    for (let i = 1; i < sorted.length; i++) {
      expect(new Date(sorted[i - 1].dateCreation).getTime()).toBeGreaterThanOrEqual(
        new Date(sorted[i].dateCreation).getTime(),
      );
    }
  });

  it('génère un numéro séquentiel annuel', () => {
    expect(nextDevisNumero(seedDevis)).toBe('DV-2026-00006');
    expect(nextDevisNumero([])).toBe('DV-2026-00001');
  });

  it('valide un draft valide sans erreur', () => {
    expect(
      validateDevisDraft({ clientId: 'c1', type: TypeContrat.Auto, montantPropose: 1000 }),
    ).toEqual([]);
  });

  it('refuse un draft sans client', () => {
    expect(
      validateDevisDraft({ type: TypeContrat.Auto, montantPropose: 1000 }),
    ).toContain('Client requis');
  });

  it('refuse un draft sans type', () => {
    expect(validateDevisDraft({ clientId: 'c1', montantPropose: 1000 })).toContain('Type requis');
  });

  it('refuse un montant négatif ou nul', () => {
    expect(
      validateDevisDraft({ clientId: 'c1', type: TypeContrat.Auto, montantPropose: -5 }),
    ).toContain('Montant doit être positif');
    expect(
      validateDevisDraft({ clientId: 'c1', type: TypeContrat.Auto, montantPropose: 0 }),
    ).toContain('Montant doit être positif');
  });

  it('refuse un montant manquant', () => {
    expect(validateDevisDraft({ clientId: 'c1', type: TypeContrat.Auto })).toContain(
      'Montant requis',
    );
  });

  it('crée un devis valide en statut Brouillon', () => {
    const d = createDevis(seedDevis, {
      clientId: 'c1',
      type: TypeContrat.Auto,
      montantPropose: 1234,
    });
    expect(d.id).toMatch(/^d\d+$/);
    expect(d.numero).toBe('DV-2026-00006');
    expect(d.statut).toBe(StatutDevis.Brouillon);
    expect(d.dateCreation).toBe('2026-10-01');
    expect(d.montantPropose).toBe(1234);
  });

  it('lève une erreur quand le draft est invalide', () => {
    expect(() =>
      createDevis(seedDevis, { clientId: '', type: TypeContrat.Auto, montantPropose: 100 }),
    ).toThrow(/Client requis/);
  });
});
