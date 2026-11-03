import { useMemo, useState } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@fluentui/react-components';
import { SearchRegular } from '@fluentui/react-icons';
import { useAppStore } from '../store/useAppStore';
import { searchClients, clientFullName } from '../services/clientService';
import { EmptyState } from '../components/EmptyState';

const useStyles = makeStyles({
  page: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  toolbar: { display: 'flex', gap: tokens.spacingHorizontalM, alignItems: 'center' },
  table: { backgroundColor: tokens.colorNeutralBackground1 },
});

export function ClientsPage() {
  const styles = useStyles();
  const clients = useAppStore((s) => s.clients);
  const [q, setQ] = useState('');
  const results = useMemo(() => searchClients(clients, q), [clients, q]);

  return (
    <div className={styles.page}>
      <Text as="h2" size={700} weight="bold">
        Clients
      </Text>
      <div className={styles.toolbar}>
        <Input
          contentBefore={<SearchRegular />}
          placeholder="Rechercher un client…"
          value={q}
          onChange={(_, data) => setQ(data.value)}
          aria-label="Rechercher un client"
        />
      </div>
      {results.length === 0 ? (
        <EmptyState message="Aucun client ne correspond à votre recherche." />
      ) : (
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
      )}
    </div>
  );
}
