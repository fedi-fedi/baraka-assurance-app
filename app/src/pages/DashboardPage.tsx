import { Badge, Text, makeStyles } from '@fluentui/react-components';
import {
  PeopleRegular,
  DocumentRegular,
  WarningRegular,
  MoneyRegular,
} from '@fluentui/react-icons';
import { useAppStore } from '../store/useAppStore';
import { computeKpi, formatMAD } from '../services/dashboardService';
import { KpiCard } from '../components/KpiCard';
import { TypeContrat, StatutSinistre } from '../models/types';
import { PageHeader } from '../components/PageHeader';
import { SurfaceCard } from '../components/SurfaceCard';

const useStyles = makeStyles({
  page: { display: 'flex', flexDirection: 'column', gap: '24px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '18px',
  },
  heroCard: {
    display: 'grid',
    gap: '14px',
    minHeight: '100%',
    padding: '24px',
    borderRadius: '28px',
    color: '#fef8ef',
    background:
      'linear-gradient(160deg, rgba(23,61,60,0.98) 0%, rgba(15,42,46,0.98) 100%)',
    boxShadow: '0 24px 60px rgba(17, 32, 39, 0.18)',
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.7)',
  },
  heroValue: {
    fontSize: '2.7rem',
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing: '-0.05em',
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '12px',
  },
  heroMetric: {
    display: 'grid',
    gap: '2px',
    padding: '12px 14px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  heroMetricLabel: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: '0.82rem',
  },
  heroMetricValue: {
    color: '#ffffff',
    fontWeight: 700,
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '18px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid rgba(18, 39, 40, 0.08)',
    ':last-child': {
      borderBottom: 'none',
      paddingBottom: 0,
    },
  },
  rowKey: {
    color: 'var(--app-muted)',
  },
  rowValue: {
    fontWeight: 800,
    color: 'var(--app-text)',
  },
  pulseList: {
    display: 'grid',
    gap: '10px',
  },
  pulseItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'center',
    padding: '12px 14px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.82)',
    border: '1px solid rgba(18, 39, 40, 0.08)',
  },
});

export function DashboardPage() {
  const styles = useStyles();
  const { clients, contrats, sinistres } = useAppStore();
  const kpi = computeKpi(clients, contrats, sinistres);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité Baraka Assurance, pensée pour capter l'état du portefeuille et les points d'attention en un seul balayage."
        aside={
          <div className={styles.heroCard}>
            <Text className={styles.heroLabel}>Portefeuille actif</Text>
            <Text className={styles.heroValue}>{formatMAD(kpi.primeTotale)}</Text>
            <div className={styles.heroGrid}>
              <div className={styles.heroMetric}>
                <Text className={styles.heroMetricLabel}>Base active</Text>
                <Text className={styles.heroMetricValue}>{`${kpi.nbClients} fiches`}</Text>
              </div>
              <div className={styles.heroMetric}>
                <Text className={styles.heroMetricLabel}>Actifs</Text>
                <Text className={styles.heroMetricValue}>{`${kpi.nbContratsActifs} actifs`}</Text>
              </div>
              <div className={styles.heroMetric}>
                <Text className={styles.heroMetricLabel}>Ouverts</Text>
                <Text className={styles.heroMetricValue}>{`${kpi.nbSinistresOuverts} ouverts`}</Text>
              </div>
            </div>
          </div>
        }
      />

      <div className={styles.grid} data-testid="kpi-grid">
        <KpiCard label="Clients" value={kpi.nbClients} icon={<PeopleRegular />} />
        <KpiCard
          label="Contrats actifs"
          value={kpi.nbContratsActifs}
          icon={<DocumentRegular />}
        />
        <KpiCard
          label="Sinistres ouverts"
          value={kpi.nbSinistresOuverts}
          icon={<WarningRegular />}
        />
        <KpiCard label="Prime totale" value={formatMAD(kpi.primeTotale)} icon={<MoneyRegular />} />
      </div>

      <div className={styles.twoCol}>
        <SurfaceCard
          title="Contrats par type"
          description="Répartition directe du portefeuille pour identifier où se concentre l'activité."
          aside={<Badge appearance="filled" color="brand">{contrats.length} contrats</Badge>}
        >
          {Object.values(TypeContrat).map((t) => (
            <div key={t} className={styles.row}>
              <Text className={styles.rowKey}>{t}</Text>
              <Text className={styles.rowValue}>{kpi.repartitionContratsParType[t]}</Text>
            </div>
          ))}
        </SurfaceCard>

        <SurfaceCard
          title="Sinistres par statut"
          description="Lecture de la charge opérationnelle en cours, avec un accent sur l'ouvert et l'en cours."
          aside={<Badge appearance="filled" color="danger">{kpi.nbSinistresOuverts} à traiter</Badge>}
        >
          <div className={styles.pulseList}>
            {Object.values(StatutSinistre).map((s) => (
              <div key={s} className={styles.pulseItem}>
                <Text>{s}</Text>
                <Text className={styles.rowValue}>{kpi.sinistresParStatut[s]}</Text>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
