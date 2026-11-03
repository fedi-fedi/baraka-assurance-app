import { useState } from 'react';
import {
  Button,
  Dropdown,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
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
import { AddRegular } from '@fluentui/react-icons';
import { useAppStore } from '../store/useAppStore';
import { listDevis, validateDevisDraft } from '../services/devisService';
import { clientFullName } from '../services/clientService';
import { formatMAD } from '../services/dashboardService';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { TypeContrat, StatutDevis } from '../models/types';
import { PageHeader } from '../components/PageHeader';
import { SurfaceCard } from '../components/SurfaceCard';

const useStyles = makeStyles({
  page: { display: 'flex', flexDirection: 'column', gap: '24px' },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    alignItems: 'end',
  },
  summary: {
    display: 'grid',
    gap: '12px',
    padding: '24px',
    borderRadius: '28px',
    background:
      'linear-gradient(160deg, rgba(23,61,60,0.98) 0%, rgba(13,39,43,0.98) 100%)',
    color: '#fff9f2',
  },
  summaryValue: {
    fontSize: '2.6rem',
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing: '-0.05em',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
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

export function DevisPage() {
  const styles = useStyles();
  const { devis, clients, addDevis } = useAppStore();
  const [clientId, setClientId] = useState('');
  const [type, setType] = useState<TypeContrat | ''>('');
  const [montant, setMontant] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = () => {
    setSuccess(null);
    const draft = {
      clientId,
      type: (type || undefined) as TypeContrat | undefined,
      montantPropose: montant === '' ? undefined : Number(montant),
    };
    const errs = validateDevisDraft(draft);
    if (errs.length) {
      setErrors(errs);
      return;
    }
    addDevis({ clientId, type: type as TypeContrat, montantPropose: Number(montant) });
    setErrors([]);
    setSuccess('Devis créé avec succès.');
    setClientId('');
    setType('');
    setMontant('');
  };

  const rows = listDevis(devis);
  const clientName = (id: string) => {
    const c = clients.find((cl) => cl.id === id);
    return c ? clientFullName(c) : '—';
  };
  const brouillons = devis.filter((devisItem) => devisItem.statut === StatutDevis.Brouillon).length;
  const acceptes = devis.filter((devisItem) => devisItem.statut === StatutDevis.Accepte).length;

  return (
    <div className={styles.page}>
      <PageHeader
        title="Devis"
        description="Zone de création rapide pour transformer un besoin client en proposition structurée, puis suivre son statut commercial."
        aside={
          <div className={styles.summary}>
            <Text>Pipeline devis</Text>
            <Text className={styles.summaryValue}>{rows.length}</Text>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryMetric}>
                <Text>Brouillons</Text>
                <Text weight="bold">{brouillons}</Text>
              </div>
              <div className={styles.summaryMetric}>
                <Text>Acceptés</Text>
                <Text weight="bold">{acceptes}</Text>
              </div>
              <div className={styles.summaryMetric}>
                <Text>Clients</Text>
                <Text weight="bold">{clients.length}</Text>
              </div>
            </div>
          </div>
        }
      />

      {errors.length > 0 && (
        <MessageBar intent="error">
          <MessageBarBody>{errors.join(' · ')}</MessageBarBody>
        </MessageBar>
      )}
      {success && (
        <MessageBar intent="success">
          <MessageBarBody>{success}</MessageBarBody>
        </MessageBar>
      )}

      <SurfaceCard
        title="Créer un devis"
        description="Saisissez l'essentiel pour produire une proposition immédiatement exploitable."
      >
        <div className={styles.form}>
          <Field label="Client" required>
            <Dropdown
              value={clientId ? clientName(clientId) : ''}
              selectedOptions={clientId ? [clientId] : []}
              onOptionSelect={(_, d) => setClientId(d.optionValue ?? '')}
              placeholder="Choisir un client"
            >
              {clients.map((c) => (
                <Option key={c.id} value={c.id}>
                  {clientFullName(c)}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Field label="Type" required>
            <Dropdown
              value={type}
              selectedOptions={type ? [type] : []}
              onOptionSelect={(_, d) => setType((d.optionValue as TypeContrat) ?? '')}
              placeholder="Choisir un type"
            >
              {Object.values(TypeContrat).map((t) => (
                <Option key={t} value={t}>
                  {t}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Field label="Montant proposé (MAD)" required>
            <Input
              id="montant-devis"
              name="montant-devis"
              type="number"
              value={montant}
              onChange={(_, d) => setMontant(d.value)}
              min={0}
            />
          </Field>
          <Button appearance="primary" icon={<AddRegular />} onClick={handleSubmit}>
            Créer le devis
          </Button>
        </div>
      </SurfaceCard>

      {rows.length === 0 ? (
        <EmptyState message="Aucun devis enregistré." />
      ) : (
        <SurfaceCard
          title="Liste des devis"
          description="Vision pipeline pour suivre rapidement la date, le type et le statut de chaque proposition."
        >
          <Table aria-label="Liste des devis" className={styles.table}>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Numéro</TableHeaderCell>
                <TableHeaderCell>Client</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Montant</TableHeaderCell>
                <TableHeaderCell>Statut</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.numero}</TableCell>
                  <TableCell>{clientName(d.clientId)}</TableCell>
                  <TableCell>{d.type}</TableCell>
                  <TableCell>{d.dateCreation}</TableCell>
                  <TableCell>{formatMAD(d.montantPropose)}</TableCell>
                  <TableCell>
                    <StatusBadge statut={d.statut} />
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
