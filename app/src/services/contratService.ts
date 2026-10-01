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
  return contrats
    .filter((c) => c.statut === StatutContrat.Actif)
    .reduce((sum, c) => sum + c.primeAnnuelle, 0);
}
