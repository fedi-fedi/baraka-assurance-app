import { useMemo, useState } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Dropdown,
  Option,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@fluentui/react-components';
import { useAppStore } from '../store/useAppStore';
import { filterContrats } from '../services/contratService';
import { clientFullName } from '../services/clientService';
import { formatMAD } from '../services/dashboardService';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { StatutContrat, TypeContrat } from '../models/types';

const useStyles = makeStyles({
  page: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  toolbar: { display: 'flex', gap: tokens.spacingHorizontalM, flexWrap: 'wrap' },
  table: { backgroundColor: tokens.colorNeutralBackground1 },
});

export function ContratsPage() {
  const styles = useStyles();
  const { contrats, clients } = useAppStore();
  const [type, setType] = useState<TypeContrat | 'Tous'>('Tous');
  const [statut, setStatut] = useState<StatutContrat | 'Tous'>('Tous');

  const results = useMemo(() => filterContrats(contrats, { type, statut }), [contrats, type, statut]);

  const clientName = (id: string) => {
    const c = clients.find((cl) => cl.id === id);
    return c ? clientFullName(c) : '—';
  };

  return (
    <div className={styles.page}>
      <Text as="h2" size={700} weight="bold">
        Contrats
      </Text>
      <div className={styles.toolbar}>
        <Dropdown
          aria-label="Filtrer par type"
          value={type}
          selectedOptions={[type]}
          onOptionSelect={(_, data) => setType((data.optionValue as TypeContrat | 'Tous') ?? 'Tous')}
        >
          <Option value="Tous">Tous les types</Option>
          {Object.values(TypeContrat).map((t) => (
            <Option key={t} value={t}>
              {t}
            </Option>
          ))}
        </Dropdown>
        <Dropdown
          aria-label="Filtrer par statut"
          value={statut}
          selectedOptions={[statut]}
          onOptionSelect={(_, data) =>
            setStatut((data.optionValue as StatutContrat | 'Tous') ?? 'Tous')
          }
        >
          <Option value="Tous">Tous les statuts</Option>
          {Object.values(StatutContrat).map((s) => (
            <Option key={s} value={s}>
              {s}
            </Option>
          ))}
        </Dropdown>
      </div>
      {results.length === 0 ? (
        <EmptyState message="Aucun contrat ne correspond aux filtres." />
      ) : (
        <Table aria-label="Liste des contrats" className={styles.table}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Numéro</TableHeaderCell>
              <TableHeaderCell>Client</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Début</TableHeaderCell>
              <TableHeaderCell>Fin</TableHeaderCell>
              <TableHeaderCell>Prime</TableHeaderCell>
              <TableHeaderCell>Statut</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.numero}</TableCell>
                <TableCell>{clientName(c.clientId)}</TableCell>
                <TableCell>{c.type}</TableCell>
                <TableCell>{c.dateDebut}</TableCell>
                <TableCell>{c.dateFin}</TableCell>
                <TableCell>{formatMAD(c.primeAnnuelle)}</TableCell>
                <TableCell>
                  <StatusBadge statut={c.statut} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
