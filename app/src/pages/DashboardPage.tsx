import { makeStyles, tokens, Text, Divider } from '@fluentui/react-components';
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

const useStyles = makeStyles({
  page: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXL },
  title: { marginBottom: tokens.spacingVerticalS },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: tokens.spacingHorizontalL,
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: tokens.spacingHorizontalL,
  },
  panel: {
    backgroundColor: tokens.colorNeutralBackground1,
    padding: tokens.spacingHorizontalL,
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalS} 0`,
  },
});

export function DashboardPage() {
  const styles = useStyles();
  const { clients, contrats, sinistres } = useAppStore();
  const kpi = computeKpi(clients, contrats, sinistres);

  return (
    <div className={styles.page}>
      <div>
        <Text as="h2" size={700} weight="bold" className={styles.title}>
          Tableau de bord
        </Text>
        <Text size={300} italic>
          Vue d'ensemble de l'activité Baraka Assurance.
        </Text>
      </div>

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
        <section className={styles.panel} aria-labelledby="rep-contrats">
          <Text as="h3" id="rep-contrats" size={500} weight="semibold">
            Contrats par type
          </Text>
          <Divider />
          {Object.values(TypeContrat).map((t) => (
            <div key={t} className={styles.row}>
              <Text>{t}</Text>
              <Text weight="semibold">{kpi.repartitionContratsParType[t]}</Text>
            </div>
          ))}
        </section>

        <section className={styles.panel} aria-labelledby="rep-sinistres">
          <Text as="h3" id="rep-sinistres" size={500} weight="semibold">
            Sinistres par statut
          </Text>
          <Divider />
          {Object.values(StatutSinistre).map((s) => (
            <div key={s} className={styles.row}>
              <Text>{s}</Text>
              <Text weight="semibold">{kpi.sinistresParStatut[s]}</Text>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
