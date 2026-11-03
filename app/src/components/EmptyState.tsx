import { Text, tokens, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  wrap: {
    padding: tokens.spacingHorizontalXXL,
    textAlign: 'center',
    color: tokens.colorNeutralForeground2,
    border: `1px dashed ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusLarge,
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
