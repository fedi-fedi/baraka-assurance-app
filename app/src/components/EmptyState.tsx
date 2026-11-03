import { Text, tokens, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  wrap: {
    padding: tokens.spacingHorizontalXXL,
    textAlign: 'center',
    color: 'var(--app-muted)',
    border: '1px dashed rgba(18, 39, 40, 0.14)',
    borderRadius: '24px',
    background:
      'linear-gradient(180deg, rgba(255,252,247,0.75), rgba(245,239,231,0.7))',
  },
});

export function EmptyState({ message }: { message: string }) {
  const styles = useStyles();
  return (
    <div className={styles.wrap} role="status">
      <Text>{message}</Text>
    </div>
  );
}
