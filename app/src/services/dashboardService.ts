import {
  Client,
  Contrat,
  DashboardKpi,
  Sinistre,
  StatutContrat,
  StatutSinistre,
  TypeContrat,
} from '../models/types';
import { primeTotale } from './contratService';

export function computeKpi(
  clients: Client[],
  contrats: Contrat[],
  sinistres: Sinistre[],
): DashboardKpi {
  const repartitionContratsParType: Record<TypeContrat, number> = {
    [TypeContrat.Auto]: 0,
    [TypeContrat.Habitation]: 0,
    [TypeContrat.Sante]: 0,
    [TypeContrat.Vie]: 0,
  };
  for (const c of contrats) {
    repartitionContratsParType[c.type] += 1;
  }

  const sinistresParStatut: Record<StatutSinistre, number> = {
    [StatutSinistre.Ouvert]: 0,
    [StatutSinistre.EnCours]: 0,
    [StatutSinistre.Clos]: 0,
  };
  for (const s of sinistres) {
    sinistresParStatut[s.statut] += 1;
  }

  return {
    nbClients: clients.length,
    nbContratsActifs: contrats.filter((c) => c.statut === StatutContrat.Actif).length,
    nbSinistresOuverts:
      sinistresParStatut[StatutSinistre.Ouvert] + sinistresParStatut[StatutSinistre.EnCours],
    primeTotale: primeTotale(contrats),
    repartitionContratsParType,
    sinistresParStatut,
  };
}

export function formatMAD(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
  }).format(amount);
}
