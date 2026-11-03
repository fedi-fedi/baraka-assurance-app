import { NavLink } from 'react-router-dom';
import { Badge, makeStyles, Text } from '@fluentui/react-components';
import { navItems } from '../config/navigation';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    padding: '20px 18px',
    color: 'rgba(255,255,255,0.96)',
    background:
      'linear-gradient(180deg, var(--app-shell) 0%, var(--app-shell-2) 100%)',
  },
  brandWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    marginBottom: '22px',
  },
  crest: {
    display: 'grid',
    gridTemplateColumns: '56px 1fr',
    gap: '14px',
    alignItems: 'center',
  },
  crestMark: {
    display: 'grid',
    placeItems: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '18px',
    color: '#fff8ef',
    fontSize: '1.35rem',
    fontWeight: 800,
    letterSpacing: '-0.05em',
    background:
      'linear-gradient(145deg, rgba(184,132,67,0.92) 0%, rgba(122,84,34,0.95) 100%)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
  },
  brandMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  brand: {
    color: '#ffffff',
  },
  tag: {
    color: 'rgba(255,255,255,0.68)',
    maxWidth: '24ch',
  },
  insight: {
    display: 'grid',
    gap: '10px',
    padding: '16px',
    borderRadius: '20px',
    border: '1px solid var(--app-shell-line)',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04))',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px',
  },
  item: {
    display: 'flex',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '18px',
    color: 'rgba(255,255,255,0.82)',
    textDecoration: 'none',
    transitionDuration: '180ms',
    transitionProperty: 'transform, background-color, color, box-shadow',
    ':hover': {
      color: '#ffffff',
      transform: 'translateX(2px)',
      backgroundColor: 'rgba(255,255,255,0.08)',
    },
    ':focus-visible': {
      outline: '2px solid rgba(213, 178, 125, 0.9)',
      outlineOffset: '2px',
    },
  },
  itemIcon: {
    display: 'grid',
    placeItems: 'center',
    width: '38px',
    height: '38px',
    flexShrink: 0,
    borderRadius: '12px',
    color: 'rgba(255,255,255,0.92)',
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  itemBody: {
    display: 'flex',
    minWidth: 0,
    flexDirection: 'column',
    gap: '3px',
  },
  itemLabel: {
    color: 'inherit',
    fontWeight: 700,
  },
  itemDescription: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: '0.83rem',
    lineHeight: 1.35,
  },
  itemActive: {
    color: '#ffffff',
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.08))',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 18px 30px rgba(0,0,0,0.15)',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: '16px',
  },
  footerCard: {
    display: 'grid',
    gap: '8px',
    padding: '16px',
    borderRadius: '20px',
    border: '1px solid var(--app-shell-line)',
    background: 'rgba(255,255,255,0.05)',
  },
});

export function Sidebar() {
  const styles = useStyles();
  return (
    <nav aria-label="Navigation principale" className={styles.root}>
      <div className={styles.brandWrap}>
        <div className={styles.crest}>
          <div className={styles.crestMark}>BA</div>
          <div className={styles.brandMeta}>
            <Text as="h1" size={500} weight="bold" className={styles.brand}>
              Baraka Assurance
            </Text>
            <Text className={styles.tag}>Cockpit interne pour pilotage clients, contrats et sinistres.</Text>
          </div>
        </div>
        <div className={styles.insight}>
          <Badge appearance="filled" color="warning">
            Lecture rapide
          </Badge>
          <Text weight="semibold">5 modules métiers</Text>
          <Text className={styles.tag}>
            Une navigation compacte pensée pour repérer un état ou agir en quelques secondes.
          </Text>
        </div>
      </div>

      <div className={styles.nav}>
        {navItems.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === '/'}
            className={({ isActive }) =>
              isActive ? `${styles.item} ${styles.itemActive}` : styles.item
            }
          >
            <span className={styles.itemIcon}>{it.icon}</span>
            <span className={styles.itemBody}>
              <span className={styles.itemLabel}>{it.label}</span>
              <span className={styles.itemDescription}>{it.description}</span>
            </span>
          </NavLink>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerCard}>
          <Text weight="semibold">Rythme de travail</Text>
          <Text className={styles.tag}>
            Surfaces contrastées, densité bureau et repères stables pour l’usage interne quotidien.
          </Text>
        </div>
      </div>
    </nav>
  );
}
