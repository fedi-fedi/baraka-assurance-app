import { describe, it, expect } from 'vitest';
import {
  listContrats,
  contratsByClient,
  filterContrats,
  primeTotale,
} from '../../src/services/contratService';
import { seedContrats } from '../../src/mocks/seed';
import { StatutContrat, TypeContrat } from '../../src/models/types';

describe('contratService', () => {
  it('trie les contrats par numéro croissant', () => {
    const sorted = listContrats(seedContrats);
    expect(sorted[0].numero).toBe('CT-2026-00001');
    expect(sorted[sorted.length - 1].numero).toBe('CT-2026-00020');
  });

  it('retourne les contrats liés à un client', () => {
    const list = contratsByClient(seedContrats, 'c1');
    expect(list).toHaveLength(2);
    expect(list.every((c) => c.clientId === 'c1')).toBe(true);
  });

  it('filtre par type', () => {
    const auto = filterContrats(seedContrats, { type: TypeContrat.Auto });
    expect(auto.every((c) => c.type === TypeContrat.Auto)).toBe(true);
    expect(auto.length).toBeGreaterThan(0);
  });

  it('filtre par statut', () => {
    const actifs = filterContrats(seedContrats, { statut: StatutContrat.Actif });
    expect(actifs.every((c) => c.statut === StatutContrat.Actif)).toBe(true);
  });

  it('filtre par type ET statut combinés', () => {
    const resAutoActifs = filterContrats(seedContrats, {
      type: TypeContrat.Auto,
      statut: StatutContrat.Actif,
    });
    expect(resAutoActifs.every((c) => c.type === TypeContrat.Auto && c.statut === StatutContrat.Actif)).toBe(true);
  });

  it("retourne tous les contrats quand les filtres valent 'Tous'", () => {
    const all = filterContrats(seedContrats, { type: 'Tous', statut: 'Tous' });
    expect(all).toHaveLength(seedContrats.length);
  });

  it("retourne tous les contrats quand les filtres sont omis", () => {
    expect(filterContrats(seedContrats, {})).toHaveLength(seedContrats.length);
  });

  it('calcule la prime totale uniquement sur les contrats actifs', () => {
    const total = primeTotale(seedContrats);
    const expected = seedContrats
      .filter((c) => c.statut === StatutContrat.Actif)
      .reduce((s, c) => s + c.primeAnnuelle, 0);
    expect(total).toBe(expected);
  });
});
