import { Card, CardHeader, Text, tokens, makeStyles } from '@fluentui/react-components';
import type { ReactElement } from 'react';

const useStyles = makeStyles({
  card: {
    minWidth: '220px',
    padding: tokens.spacingHorizontalL,
    borderRadius: '24px',
    border: '1px solid var(--app-line)',
    background:
      'linear-gradient(180deg, rgba(255,252,247,0.96) 0%, rgba(246,239,228,0.96) 100%)',
    boxShadow: '0 24px 48px rgba(17, 32, 39, 0.08)',
  },
  value: {
    fontSize: '2.2rem',
    lineHeight: 1,
    fontWeight: tokens.fontWeightBold,
    color: 'var(--app-text)',
    letterSpacing: '-0.04em',
  },
  label: {
    color: 'var(--app-muted)',
    fontWeight: 600,
  },
  iconSlot: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    color: 'var(--app-shell)',
    backgroundColor: 'rgba(23, 61, 60, 0.08)',
  },
});

interface KpiCardProps {
  label: string;
  value: ReactElement | string | number;
  icon?: ReactElement;
}

export function KpiCard({ label, value, icon }: KpiCardProps) {
  const styles = useStyles();
  return (
    <Card className={styles.card} aria-label={label}>
      <CardHeader
        image={icon ? <span className={styles.iconSlot}>{icon}</span> : undefined}
        header={<Text className={styles.label}>{label}</Text>}
        description={<Text className={styles.value}>{value}</Text>}
      />
    </Card>
  );
}
