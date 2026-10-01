import { Card, CardHeader, Text, tokens, makeStyles } from '@fluentui/react-components';
import type { ReactNode } from 'react';

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
});

interface KpiCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}

export function KpiCard({ label, value, icon }: KpiCardProps) {
  const styles = useStyles();
  return (
    <Card className={styles.card} aria-label={label}>
      <CardHeader
        image={icon as any}
        header={<Text className={styles.label}>{label}</Text>}
        description={<Text className={styles.value}>{value}</Text>}
      />
    </Card>
  );
}
