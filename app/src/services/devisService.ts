import { Devis, StatutDevis, TypeContrat } from '../models/types';

export function listDevis(devis: Devis[]): Devis[] {
  return [...devis].sort(
    (a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime(),
  );
}

export function nextDevisNumero(devis: Devis[]): string {
  const year = new Date().getFullYear();
  const prefix = `DV-${year}-`;
  const sameYear = devis.filter((d) => d.numero.startsWith(prefix));
  const nextSeq = sameYear.length + 1;
  return `${prefix}${String(nextSeq).padStart(5, '0')}`;
}

export interface DevisDraft {
  clientId: string;
  type: TypeContrat;
  montantPropose: number;
}

export function validateDevisDraft(draft: Partial<DevisDraft>): string[] {
  const errors: string[] = [];
  if (!draft.clientId) errors.push('Client requis');
  if (!draft.type) errors.push('Type requis');
  if (draft.montantPropose === undefined || draft.montantPropose === null) {
    errors.push('Montant requis');
  } else if (draft.montantPropose <= 0) {
    errors.push('Montant doit être positif');
  }
  return errors;
}

export function createDevis(devis: Devis[], draft: DevisDraft): Devis {
  const errors = validateDevisDraft(draft);
  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
  return {
    id: `d${Date.now()}`,
    numero: nextDevisNumero(devis),
    dateCreation: new Date().toISOString().slice(0, 10),
    statut: StatutDevis.Brouillon,
    ...draft,
  };
}
