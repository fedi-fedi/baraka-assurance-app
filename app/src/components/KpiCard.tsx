import { Card, CardHeader, Text, tokens, makeStyles } from '@fluentui/react-components';
import type { ReactElement } from 'react';

const useStyles = makeStyles({
  card: {
    minWidth: '220px',
    padding: tokens.spacingHorizontalL,
  },
  value: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorBrandForeground1,
  },
  label: {
    color: tokens.colorNeutralForeground2,
  },
  iconSlot: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorBrandForeground1,
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
