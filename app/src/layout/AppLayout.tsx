import { Outlet } from 'react-router-dom';
import { tokens, makeStyles } from '@fluentui/react-components';
import { Sidebar } from './Sidebar';

const useStyles = makeStyles({
  shell: {
    display: 'grid',
    gridTemplateColumns: '240px 1fr',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  sidebar: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  main: {
    padding: tokens.spacingHorizontalXXL,
    overflow: 'auto',
  },
});

export function AppLayout() {
  const styles = useStyles();
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Sidebar />
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
