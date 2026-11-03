import type { ReactNode } from 'react';
import { Text, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  wrap: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.6fr) minmax(280px, 0.9fr)',
    gap: '24px',
    alignItems: 'stretch',
    '@media (max-width: 920px)': {
      gridTemplateColumns: '1fr',
    },
  },
  intro: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '30px 32px',
    borderRadius: '28px',
    color: 'var(--app-text)',
    background:
      'linear-gradient(160deg, rgba(255,250,242,0.95) 0%, rgba(244,237,225,0.92) 100%)',
    border: '1px solid rgba(19, 58, 55, 0.10)',
    boxShadow: '0 24px 60px rgba(17, 32, 39, 0.08)',
  },
  title: {
    margin: 0,
    fontSize: 'clamp(2rem, 3vw, 3rem)',
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing: '-0.04em',
  },
  description: {
    maxWidth: '65ch',
    color: 'var(--app-muted)',
    fontSize: '1rem',
  },
  aside: {
    minHeight: '100%',
  },
});

interface PageHeaderProps {
  title: string;
  description: string;
  aside?: ReactNode;
}

export function PageHeader({ title, description, aside }: PageHeaderProps) {
  const styles = useStyles();

  return (
    <header className={styles.wrap}>
      <div className={styles.intro}>
        <Text as="h2" className={styles.title}>
          {title}
        </Text>
        <Text className={styles.description}>{description}</Text>
      </div>
      {aside ? <div className={styles.aside}>{aside}</div> : null}
    </header>
  );
}
