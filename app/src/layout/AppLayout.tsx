import { Outlet, useLocation } from 'react-router-dom';
import { Badge, Text, makeStyles } from '@fluentui/react-components';
import { Sidebar } from './Sidebar';
import { getCurrentNavItem } from '../config/navigation';
import { useAppStore } from '../store/useAppStore';

const useStyles = makeStyles({
  shell: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    minHeight: '100vh',
    backgroundColor: 'transparent',
    '@media (max-width: 1080px)': {
      gridTemplateColumns: '1fr',
    },
  },
  sidebar: {
    position: 'sticky',
    top: 0,
    alignSelf: 'start',
    minHeight: '100vh',
    '@media (max-width: 1080px)': {
      position: 'relative',
      minHeight: 'auto',
    },
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    minWidth: 0,
    padding: '24px',
    overflow: 'auto',
    '@media (max-width: 720px)': {
      padding: '16px',
    },
  },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    padding: '18px 22px',
    borderRadius: '24px',
    background: 'rgba(255, 252, 247, 0.72)',
    border: '1px solid var(--app-line)',
    boxShadow: '0 18px 45px rgba(17, 32, 39, 0.06)',
    backdropFilter: 'blur(16px)',
    '@media (max-width: 720px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  topbarMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  sectionLabel: {
    color: 'var(--app-muted)',
  },
  topbarTitle: {
    margin: 0,
    fontSize: '1.35rem',
    lineHeight: 1.1,
    fontWeight: 800,
    letterSpacing: '-0.03em',
  },
  topbarStats: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  statCard: {
    display: 'grid',
    gap: '2px',
    minWidth: '112px',
    padding: '10px 14px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(22, 39, 40, 0.08)',
  },
  statLabel: {
    color: 'var(--app-muted)',
    fontSize: '0.78rem',
  },
  statValue: {
    fontWeight: 800,
    color: 'var(--app-text)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
});

export function AppLayout() {
  const styles = useStyles();
  const location = useLocation();
  const currentSection = getCurrentNavItem(location.pathname);
  const { clients, contrats, sinistres, devis } = useAppStore();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Sidebar />
      </aside>
      <main className={styles.main}>
        <div className={styles.topbar}>
          <div className={styles.topbarMeta}>
            <Text className={styles.sectionLabel}>Baraka Assurance · interne</Text>
            <Text as="h2" className={styles.topbarTitle}>
              {currentSection.label}
            </Text>
            <Text className={styles.sectionLabel}>{currentSection.description}</Text>
          </div>
          <div className={styles.topbarStats}>
            <Badge appearance="filled" color="warning">
              Scan prioritaire
            </Badge>
            <div className={styles.statCard}>
              <Text className={styles.statLabel}>Clients</Text>
              <Text className={styles.statValue}>{clients.length}</Text>
            </div>
            <div className={styles.statCard}>
              <Text className={styles.statLabel}>Contrats</Text>
              <Text className={styles.statValue}>{contrats.length}</Text>
            </div>
            <div className={styles.statCard}>
              <Text className={styles.statLabel}>Sinistres</Text>
              <Text className={styles.statValue}>{sinistres.length}</Text>
            </div>
            <div className={styles.statCard}>
              <Text className={styles.statLabel}>Devis</Text>
              <Text className={styles.statValue}>{devis.length}</Text>
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
