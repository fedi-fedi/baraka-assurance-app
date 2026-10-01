import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  listSinistres,
  sinistresByStatut,
  nextSinistreNumero,
  createSinistre,
  updateSinistreStatut,
  removeSinistre,
} from '../../src/services/sinistreService';
import { seedSinistres } from '../../src/mocks/seed';
import { StatutSinistre } from '../../src/models/types';

describe('sinistreService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-01T10:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('trie les sinistres par date de déclaration descendante', () => {
    const sorted = listSinistres(seedSinistres);
    for (let i = 1; i < sorted.length; i++) {
      expect(new Date(sorted[i - 1].dateDeclaration).getTime()).toBeGreaterThanOrEqual(
        new Date(sorted[i].dateDeclaration).getTime(),
      );
    }
  });

  it('filtre par statut', () => {
    const ouverts = sinistresByStatut(seedSinistres, StatutSinistre.Ouvert);
    expect(ouverts.every((s) => s.statut === StatutSinistre.Ouvert)).toBe(true);
  });

  it('génère un numéro séquentiel pour l\'année courante', () => {
    const n = nextSinistreNumero(seedSinistres);
    expect(n).toMatch(/^SN-2026-\d{5}$/);
    expect(n).toBe('SN-2026-00009');
  });

  it('démarre à 00001 si aucun sinistre pour l\'année', () => {
    const n = nextSinistreNumero([]);
    expect(n).toBe('SN-2026-00001');
  });

  it('crée un sinistre avec id et numéro générés', () => {
    const draft = {
      contratId: 'ct1',
      dateDeclaration: '2026-10-01',
      dateIncident: '2026-09-28',
      description: 'Test',
      montantEstime: 1000,
      statut: StatutSinistre.Ouvert,
    };
    const s = createSinistre(seedSinistres, draft);
    expect(s.id).toMatch(/^s\d+$/);
    expect(s.numero).toBe('SN-2026-00009');
    expect(s.description).toBe('Test');
  });

  it('met à jour le statut d\'un sinistre existant', () => {
    const updated = updateSinistreStatut(seedSinistres, 's1', StatutSinistre.Clos);
    expect(updated.find((s) => s.id === 's1')?.statut).toBe(StatutSinistre.Clos);
    expect(updated.find((s) => s.id === 's2')?.statut).toBe(seedSinistres.find((s) => s.id === 's2')!.statut);
  });

  it('ne modifie rien si l\'id n\'existe pas', () => {
    const updated = updateSinistreStatut(seedSinistres, 'nope', StatutSinistre.Clos);
    expect(updated).toEqual(seedSinistres);
  });

  it('supprime un sinistre par id', () => {
    const removed = removeSinistre(seedSinistres, 's1');
    expect(removed).toHaveLength(seedSinistres.length - 1);
    expect(removed.find((s) => s.id === 's1')).toBeUndefined();
  });
});
