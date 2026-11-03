import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Dropdown,
  Field,
  Input,
  Option,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Textarea,
  makeStyles,
} from '@fluentui/react-components';
import { AddRegular, DeleteRegular } from '@fluentui/react-icons';
import { useAppStore } from '../store/useAppStore';
import { listSinistres } from '../services/sinistreService';
import { formatMAD } from '../services/dashboardService';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { StatutSinistre } from '../models/types';
import { PageHeader } from '../components/PageHeader';
import { SurfaceCard } from '../components/SurfaceCard';

const useStyles = makeStyles({
  page: { display: 'flex', flexDirection: 'column', gap: '24px' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  summary: {
    display: 'grid',
    gap: '12px',
    padding: '24px',
    borderRadius: '28px',
    background:
      'linear-gradient(165deg, rgba(255,251,244,0.96) 0%, rgba(244,236,223,0.96) 100%)',
    border: '1px solid rgba(18, 39, 40, 0.1)',
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
    background: 'rgba(255,255,255,0.84)',
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
      verticalAlign: 'top',
    },
    '& tbody tr:hover td': {
      backgroundColor: 'rgba(23, 61, 60, 0.03)',
    },
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '420px' },
  rowActions: { display: 'flex', gap: '8px' },
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
  const ouverts = sinistres.filter((sinistre) => sinistre.statut === StatutSinistre.Ouvert).length;
  const enCours = sinistres.filter((sinistre) => sinistre.statut === StatutSinistre.EnCours).length;
  const clos = sinistres.filter((sinistre) => sinistre.statut === StatutSinistre.Clos).length;

  return (
    <div className={styles.page}>
      <PageHeader
        title="Sinistres"
        description="Panneau de traitement des déclarations pour suivre le volume ouvert, faire évoluer les statuts et consigner rapidement un nouveau cas."
        aside={
          <div className={styles.summary}>
            <Text>Charge en cours</Text>
            <Text className={styles.summaryValue}>{rows.length}</Text>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryMetric}>
                <Text>Ouverts</Text>
                <Text weight="bold">{ouverts}</Text>
              </div>
              <div className={styles.summaryMetric}>
                <Text>En cours</Text>
                <Text weight="bold">{enCours}</Text>
              </div>
              <div className={styles.summaryMetric}>
                <Text>Clos</Text>
                <Text weight="bold">{clos}</Text>
              </div>
            </div>
          </div>
        }
      />

      <SurfaceCard
        title="Actions"
        description="Déclarez un nouveau sinistre ou parcourez la liste pour mettre à jour l'avancement d'un dossier."
        compact
      >
        <div className={styles.toolbar}>
          <Text>Traitement et suivi</Text>
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
                        id="date-incident"
                        name="date-incident"
                        type="date"
                        value={dateIncident}
                        onChange={(_, d) => setDateIncident(d.value)}
                      />
                    </Field>
                    <Field label="Description" required>
                      <Textarea
                        id="description-sinistre"
                        name="description-sinistre"
                        value={description}
                        onChange={(_, d) => setDescription(d.value)}
                        rows={3}
                      />
                    </Field>
                    <Field label="Montant estimé (MAD)">
                      <Input
                        id="montant-sinistre"
                        name="montant-sinistre"
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
      </SurfaceCard>

      {rows.length === 0 ? (
        <EmptyState message="Aucun sinistre déclaré." />
      ) : (
        <SurfaceCard
          title="Liste des sinistres"
          description="Vision dossier par dossier avec statut éditable directement dans le flux de lecture."
        >
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
        </SurfaceCard>
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
