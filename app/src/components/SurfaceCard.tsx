import type { ReactNode } from 'react';
import { Text, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    padding: '24px',
    borderRadius: '24px',
    background: 'var(--app-surface)',
    border: '1px solid var(--app-line)',
    boxShadow: '0 22px 48px rgba(17, 32, 39, 0.08)',
    backdropFilter: 'blur(14px)',
  },
  compact: {
    padding: '18px 20px',
    borderRadius: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },
  title: {
    margin: 0,
    fontSize: '1.1rem',
    lineHeight: 1.2,
    fontWeight: 700,
    color: 'var(--app-text)',
  },
  description: {
    color: 'var(--app-muted)',
    maxWidth: '60ch',
  },
});

interface SurfaceCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  aside?: ReactNode;
  compact?: boolean;
}

export function SurfaceCard({
  title,
  description,
  children,
  aside,
  compact = false,
}: SurfaceCardProps) {
  const styles = useStyles();

  return (
    <section className={compact ? `${styles.card} ${styles.compact}` : styles.card}>
      {(title || description || aside) && (
        <div className={styles.header}>
          <div>
            {title ? (
              <Text as="h3" className={styles.title}>
                {title}
              </Text>
            ) : null}
            {description ? <Text className={styles.description}>{description}</Text> : null}
          </div>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}
