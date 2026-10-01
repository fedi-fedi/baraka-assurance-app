import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Button,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Field,
  Input,
  Textarea,
  Dropdown,
  Option,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@fluentui/react-components';
import { AddRegular, DeleteRegular } from '@fluentui/react-icons';
import { useAppStore } from '../store/useAppStore';
import { listSinistres } from '../services/sinistreService';
import { formatMAD } from '../services/dashboardService';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { StatutSinistre } from '../models/types';

const useStyles = makeStyles({
  page: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  table: { backgroundColor: tokens.colorNeutralBackground1 },
  form: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM, minWidth: '420px' },
  rowActions: { display: 'flex', gap: tokens.spacingHorizontalS },
});

const todayISO = () => new Date().toISOString().slice(0, 10);

export function SinistresPage() {
  const styles = useStyles();
  const { sinistres, contrats, addSinistre, changeSinistreStatut, deleteSinistre } = useAppStore();
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; numero: string } | null>(null);
  const [contratId, setContratId] = useState('');
  const [dateIncident, setDateIncident] = useState(todayISO());
  const [description, setDescription] = useState('');
  const [montantEstime, setMontantEstime] = useState('0');
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setContratId('');
    setDateIncident(todayISO());
    setDescription('');
    setMontantEstime('0');
    setError(null);
  };

  const handleCreate = () => {
    if (!contratId) {
      setError('Veuillez choisir un contrat.');
      return;
    }
    if (!description.trim()) {
      setError('La description est obligatoire.');
      return;
    }
    const montant = Number(montantEstime);
    if (Number.isNaN(montant) || montant < 0) {
      setError('Montant invalide.');
      return;
    }
    addSinistre({
      contratId,
      dateDeclaration: todayISO(),
      dateIncident,
      description: description.trim(),
      montantEstime: montant,
      statut: StatutSinistre.Ouvert,
    });
    resetForm();
    setOpen(false);
  };

  const rows = listSinistres(sinistres);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Text as="h2" size={700} weight="bold">
          Sinistres
        </Text>
        <Dialog open={open} onOpenChange={(_, data) => setOpen(data.open)}>
          <DialogTrigger disableButtonEnhancement>
            <Button appearance="primary" icon={<AddRegular />}>
              Nouveau sinistre
            </Button>
          </DialogTrigger>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Déclarer un sinistre</DialogTitle>
              <DialogContent>
                <div className={styles.form}>
                  <Field label="Contrat" required validationMessage={error ?? undefined}>
                    <Dropdown
                      value={contratId ? contrats.find((c) => c.id === contratId)?.numero : ''}
                      selectedOptions={contratId ? [contratId] : []}
                      onOptionSelect={(_, d) => setContratId(d.optionValue ?? '')}
                      placeholder="Choisir un contrat"
                    >
                      {contrats.map((c) => (
                        <Option key={c.id} value={c.id} text={`${c.numero} — ${c.type}`}>
                          {c.numero} — {c.type}
                        </Option>
                      ))}
                    </Dropdown>
                  </Field>
                  <Field label="Date de l'incident" required>
                    <Input
                      type="date"
                      value={dateIncident}
                      onChange={(_, d) => setDateIncident(d.value)}
                    />
                  </Field>
                  <Field label="Description" required>
                    <Textarea
                      value={description}
                      onChange={(_, d) => setDescription(d.value)}
                      rows={3}
                    />
                  </Field>
                  <Field label="Montant estimé (MAD)">
                    <Input
                      type="number"
                      value={montantEstime}
                      onChange={(_, d) => setMontantEstime(d.value)}
                      min={0}
                    />
                  </Field>
                </div>
              </DialogContent>
              <DialogActions>
                <Button appearance="secondary" onClick={() => setOpen(false)}>
                  Annuler
                </Button>
                <Button appearance="primary" onClick={handleCreate}>
                  Créer
                </Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </div>

      {rows.length === 0 ? (
        <EmptyState message="Aucun sinistre déclaré." />
      ) : (
        <Table aria-label="Liste des sinistres" className={styles.table}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Numéro</TableHeaderCell>
              <TableHeaderCell>Contrat</TableHeaderCell>
              <TableHeaderCell>Déclaré le</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Montant estimé</TableHeaderCell>
              <TableHeaderCell>Statut</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((s) => {
              const contrat = contrats.find((c) => c.id === s.contratId);
              return (
                <TableRow key={s.id}>
                  <TableCell>{s.numero}</TableCell>
                  <TableCell>{contrat?.numero ?? '—'}</TableCell>
                  <TableCell>{s.dateDeclaration}</TableCell>
                  <TableCell>{s.description}</TableCell>
                  <TableCell>{formatMAD(s.montantEstime)}</TableCell>
                  <TableCell>
                    <Dropdown
                      aria-label={`Statut sinistre ${s.numero}`}
                      value={s.statut}
                      selectedOptions={[s.statut]}
                      onOptionSelect={(_, d) =>
                        changeSinistreStatut(s.id, d.optionValue as StatutSinistre)
                      }
                    >
                      {Object.values(StatutSinistre).map((st) => (
                        <Option key={st} value={st}>
                          {st}
                        </Option>
                      ))}
                    </Dropdown>
                  </TableCell>
                  <TableCell>
                    <div className={styles.rowActions}>
                      <StatusBadge statut={s.statut} />
                      <Button
                        appearance="subtle"
                        icon={<DeleteRegular />}
                        aria-label={`Supprimer ${s.numero}`}
                        onClick={() => setDeleteTarget({ id: s.id, numero: s.numero })}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(_, data) => {
          if (!data.open) setDeleteTarget(null);
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogContent>
              {deleteTarget && (
                <Text>
                  Voulez-vous vraiment supprimer le sinistre <strong>{deleteTarget.numero}</strong> ?
                  Cette action est irréversible.
                </Text>
              )}
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setDeleteTarget(null)}>
                Annuler
              </Button>
              <Button
                appearance="primary"
                onClick={() => {
                  if (deleteTarget) {
                    deleteSinistre(deleteTarget.id);
                    setDeleteTarget(null);
                  }
                }}
              >
                Supprimer
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}
