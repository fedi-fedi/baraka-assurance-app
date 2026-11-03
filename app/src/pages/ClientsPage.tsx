import { useMemo, useState } from 'react';
import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  makeStyles,
} from '@fluentui/react-components';
import { SearchRegular } from '@fluentui/react-icons';
import { useAppStore } from '../store/useAppStore';
import { searchClients, clientFullName } from '../services/clientService';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { SurfaceCard } from '../components/SurfaceCard';

const useStyles = makeStyles({
  page: { display: 'flex', flexDirection: 'column', gap: '24px' },
  toolbar: { display: 'flex', gap: '12px', alignItems: 'center' },
  summary: {
    display: 'grid',
    gap: '10px',
    minHeight: '100%',
    padding: '24px',
    borderRadius: '28px',
    background:
      'linear-gradient(165deg, rgba(255,251,244,0.96) 0%, rgba(242,233,218,0.96) 100%)',
    border: '1px solid rgba(18, 39, 40, 0.1)',
    boxShadow: '0 22px 52px rgba(17, 32, 39, 0.08)',
  },
  summaryValue: {
    fontSize: '2.6rem',
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing: '-0.05em',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '12px',
  },
  summaryMetric: {
    display: 'grid',
    gap: '2px',
    padding: '12px 14px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.82)',
    border: '1px solid rgba(18, 39, 40, 0.08)',
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

export function ClientsPage() {
  const styles = useStyles();
  const clients = useAppStore((s) => s.clients);
  const [q, setQ] = useState('');
  const results = useMemo(() => searchClients(clients, q), [clients, q]);
  const villes = new Set(clients.map((client) => client.ville)).size;

  return (
    <div className={styles.page}>
      <PageHeader
        title="Clients"
        description="Répertoire interne pour retrouver vite une personne, un canal de contact ou la localisation d'un dossier."
        aside={
          <div className={styles.summary}>
            <Text>Base active</Text>
            <Text className={styles.summaryValue}>{clients.length}</Text>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryMetric}>
                <Text>Villes</Text>
                <Text weight="bold">{villes}</Text>
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
        title="Recherche clients"
        description="Commencez par un nom, une ville ou un contact pour réduire instantanément la liste."
        compact
      >
        <div className={styles.toolbar}>
          <Input
            name="client-search"
            contentBefore={<SearchRegular />}
            placeholder="Rechercher un client…"
            value={q}
            onChange={(_, data) => setQ(data.value)}
            aria-label="Rechercher un client"
          />
        </div>
      </SurfaceCard>

      {results.length === 0 ? (
        <EmptyState message="Aucun client ne correspond à votre recherche." />
      ) : (
        <SurfaceCard
          title="Liste des clients"
          description="Lecture tabulaire prioritaire pour contacter ou situer rapidement un assuré."
        >
          <Table aria-label="Liste des clients" className={styles.table}>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Nom complet</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Téléphone</TableHeaderCell>
                <TableHeaderCell>Ville</TableHeaderCell>
                <TableHeaderCell>Depuis</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{clientFullName(c)}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.telephone}</TableCell>
                  <TableCell>{c.ville}</TableCell>
                  <TableCell>{c.dateCreation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SurfaceCard>
      )}
    </div>
  );
}
