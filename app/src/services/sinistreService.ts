import { Sinistre, StatutSinistre } from '../models/types';

export function listSinistres(sinistres: Sinistre[]): Sinistre[] {
  return [...sinistres].sort(
    (a, b) => new Date(b.dateDeclaration).getTime() - new Date(a.dateDeclaration).getTime(),
  );
}

export function sinistresByStatut(sinistres: Sinistre[], statut: StatutSinistre): Sinistre[] {
  return sinistres.filter((s) => s.statut === statut);
}

export function nextSinistreNumero(sinistres: Sinistre[]): string {
  const year = new Date().getFullYear();
  const prefix = `SN-${year}-`;
  const sameYear = sinistres.filter((s) => s.numero.startsWith(prefix));
  const nextSeq = sameYear.length + 1;
  return `${prefix}${String(nextSeq).padStart(5, '0')}`;
}

export function createSinistre(
  sinistres: Sinistre[],
  draft: Omit<Sinistre, 'id' | 'numero'>,
): Sinistre {
  const nouveau: Sinistre = {
    id: `s${Date.now()}`,
    numero: nextSinistreNumero(sinistres),
    ...draft,
  };
  return nouveau;
}

export function updateSinistreStatut(
  sinistres: Sinistre[],
  id: string,
  statut: StatutSinistre,
): Sinistre[] {
  return sinistres.map((s) => (s.id === id ? { ...s, statut } : s));
}

export function removeSinistre(sinistres: Sinistre[], id: string): Sinistre[] {
  return sinistres.filter((s) => s.id !== id);
}
