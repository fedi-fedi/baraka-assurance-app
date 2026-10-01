import { describe, it, expect } from 'vitest';
import { computeKpi, formatMAD } from '../../src/services/dashboardService';
import { seedClients, seedContrats, seedSinistres } from '../../src/mocks/seed';
import { StatutContrat, StatutSinistre, TypeContrat } from '../../src/models/types';

describe('dashboardService', () => {
  it('calcule les KPI à partir des seeds', () => {
    const kpi = computeKpi(seedClients, seedContrats, seedSinistres);
    expect(kpi.nbClients).toBe(seedClients.length);
    expect(kpi.nbContratsActifs).toBe(
      seedContrats.filter((c) => c.statut === StatutContrat.Actif).length,
    );
    expect(kpi.nbSinistresOuverts).toBe(
      seedSinistres.filter(
        (s) => s.statut === StatutSinistre.Ouvert || s.statut === StatutSinistre.EnCours,
      ).length,
    );
    expect(kpi.primeTotale).toBeGreaterThan(0);
  });

  it('répartit les contrats par type en couvrant tous les types', () => {
    const kpi = computeKpi(seedClients, seedContrats, seedSinistres);
    const sum = Object.values(TypeContrat).reduce(
      (acc, t) => acc + kpi.repartitionContratsParType[t],
      0,
    );
    expect(sum).toBe(seedContrats.length);
  });

  it('répartit les sinistres par statut en couvrant tous les statuts', () => {
    const kpi = computeKpi(seedClients, seedContrats, seedSinistres);
    const sum = Object.values(StatutSinistre).reduce(
      (acc, s) => acc + kpi.sinistresParStatut[s],
      0,
    );
    expect(sum).toBe(seedSinistres.length);
  });

  it('gère des datasets vides', () => {
    const kpi = computeKpi([], [], []);
    expect(kpi.nbClients).toBe(0);
    expect(kpi.nbContratsActifs).toBe(0);
    expect(kpi.nbSinistresOuverts).toBe(0);
    expect(kpi.primeTotale).toBe(0);
  });

  it('formate un montant en MAD', () => {
    const out = formatMAD(1234);
    expect(out).toMatch(/MAD/);
    expect(out).toMatch(/1[\s\u00a0\u202f]?234/);
  });
});
