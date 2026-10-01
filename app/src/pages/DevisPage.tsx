import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Button,
  Field,
  Input,
  Dropdown,
  Option,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  MessageBar,
  MessageBarBody,
} from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons';
import { useAppStore } from '../store/useAppStore';
import { listDevis, validateDevisDraft } from '../services/devisService';
import { clientFullName } from '../services/clientService';
import { formatMAD } from '../services/dashboardService';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { TypeContrat } from '../models/types';

const useStyles = makeStyles({
  page: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingHorizontalL,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    alignItems: 'end',
  },
  table: { backgroundColor: tokens.colorNeutralBackground1 },
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

  return (
    <div className={styles.page}>
      <Text as="h2" size={700} weight="bold">
        Devis
      </Text>

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

      {rows.length === 0 ? (
        <EmptyState message="Aucun devis enregistré." />
      ) : (
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
      )}
    </div>
  );
}
