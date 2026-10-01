import { Contrat, StatutContrat, TypeContrat } from '../models/types';

export function listContrats(contrats: Contrat[]): Contrat[] {
  return [...contrats].sort((a, b) => a.numero.localeCompare(b.numero));
}

export function contratsByClient(contrats: Contrat[], clientId: string): Contrat[] {
  return contrats.filter((c) => c.clientId === clientId);
}

export function filterContrats(
  contrats: Contrat[],
  filters: { type?: TypeContrat | 'Tous'; statut?: StatutContrat | 'Tous' },
): Contrat[] {
  return listContrats(contrats).filter((c) => {
    if (filters.type && filters.type !== 'Tous' && c.type !== filters.type) return false;
    if (filters.statut && filters.statut !== 'Tous' && c.statut !== filters.statut) return false;
    return true;
  });
}

export function primeTotale(contrats: Contrat[]): number {
  const seen = new Set<string>();
  return contrats
    .filter((c) => c.statut === StatutContrat.Actif)
    .filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    })
    .reduce((sum, c) => sum + c.primeAnnuelle, 0);
}
