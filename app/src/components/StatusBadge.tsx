import { Badge } from '@fluentui/react-components';
import { StatutContrat, StatutDevis, StatutSinistre } from '../models/types';

type AnyStatut = StatutContrat | StatutSinistre | StatutDevis;

const colorMap: Record<string, 'success' | 'warning' | 'danger' | 'informative' | 'subtle'> = {
  [StatutContrat.Actif]: 'success',
  [StatutContrat.Suspendu]: 'warning',
  [StatutContrat.Resilie]: 'danger',
  [StatutSinistre.Ouvert]: 'danger',
  [StatutSinistre.EnCours]: 'warning',
  [StatutSinistre.Clos]: 'success',
  [StatutDevis.Brouillon]: 'subtle',
  [StatutDevis.Envoye]: 'informative',
  [StatutDevis.Accepte]: 'success',
  [StatutDevis.Refuse]: 'danger',
};

export function StatusBadge({ statut }: { statut: AnyStatut }) {
  const appearance = colorMap[statut] ?? 'subtle';
  return (
    <Badge color={appearance} appearance="filled">
      {statut}
    </Badge>
  );
}
