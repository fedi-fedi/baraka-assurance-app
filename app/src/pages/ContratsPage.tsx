import { useMemo, useState } from 'react';
import {
  Dropdown,
  Option,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  makeStyles,
} from '@fluentui/react-components';
import { useAppStore } from '../store/useAppStore';
import { filterContrats } from '../services/contratService';
import { clientFullName } from '../services/clientService';
import { formatMAD } from '../services/dashboardService';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { StatutContrat, TypeContrat } from '../models/types';
import { PageHeader } from '../components/PageHeader';
import { SurfaceCard } from '../components/SurfaceCard';

const useStyles = makeStyles({
  page: { display: 'flex', flexDirection: 'column', gap: '24px' },
  toolbar: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  summary: {
    display: 'grid',
    gap: '12px',
    padding: '24px',
    borderRadius: '28px',
    color: '#fef8ef',
    background:
      'linear-gradient(160deg, rgba(18,54,57,0.98) 0%, rgba(11,34,39,0.98) 100%)',
  },
  summaryValue: {
    fontSize: '2.6rem',
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing: '-0.05em',
  },
  summaryRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '12px',
  },
  summaryMetric: {
    display: 'grid',
    gap: '2px',
    padding: '12px 14px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  table: {
    backgroundColor: 'transparent',
    '& th': {
      color: 'var(--app-muted)',
      fontWeight: 700,
    },
    '& th, & td': {
      paddingTop: '14px',
      paddingBottom: '14px',
    },
    '& tbody tr:hover td': {
      backgroundColor: 'rgba(23, 61, 60, 0.03)',
    },
  },
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
  const actifs = contrats.filter((contrat) => contrat.statut === StatutContrat.Actif).length;
  const primeTotale = contrats.reduce((sum, contrat) => sum + contrat.primeAnnuelle, 0);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Contrats"
        description="Portefeuille filtrable pour rapprocher chaque police de son assuré, de sa prime et de son statut d'exploitation."
        aside={
          <div className={styles.summary}>
            <Text>Portefeuille contractuel</Text>
            <Text className={styles.summaryValue}>{formatMAD(primeTotale)}</Text>
            <div className={styles.summaryRow}>
              <div className={styles.summaryMetric}>
                <Text>Actifs</Text>
                <Text weight="bold">{actifs}</Text>
              </div>
              <div className={styles.summaryMetric}>
                <Text>Résultats</Text>
                <Text weight="bold">{results.length}</Text>
              </div>
            </div>
          </div>
        }
      />

      <SurfaceCard
        title="Filtres"
        description="Cadrez le portefeuille par type ou par statut avant de descendre dans la lecture tabulaire."
        compact
      >
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
      </SurfaceCard>

      {results.length === 0 ? (
        <EmptyState message="Aucun contrat ne correspond aux filtres." />
      ) : (
        <SurfaceCard
          title="Liste des contrats"
          description="Lecture structurée pour comparer rapidement la nature du contrat, l'échéance et la valeur de prime."
        >
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
        </SurfaceCard>
      )}
    </div>
  );
}
