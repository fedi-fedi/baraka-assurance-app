import { NavLink } from 'react-router-dom';
import { tokens, makeStyles, Text } from '@fluentui/react-components';
import {
  HomeRegular,
  PeopleRegular,
  DocumentRegular,
  WarningRegular,
  ReceiptRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingHorizontalM,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusMedium,
    color: tokens.colorNeutralForeground1,
    textDecoration: 'none',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    ':focus-visible': {
      outline: `2px solid ${tokens.colorBrandStroke1}`,
      outlineOffset: '2px',
    },
  },
  itemActive: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
    fontWeight: tokens.fontWeightSemibold,
  },
  brand: {
    padding: tokens.spacingHorizontalL,
    fontWeight: tokens.fontWeightBold,
    fontSize: tokens.fontSizeBase500,
    color: tokens.colorBrandForeground1,
  },
});

const items = [
  { to: '/', label: 'Dashboard', icon: <HomeRegular /> },
  { to: '/clients', label: 'Clients', icon: <PeopleRegular /> },
  { to: '/contrats', label: 'Contrats', icon: <DocumentRegular /> },
  { to: '/sinistres', label: 'Sinistres', icon: <WarningRegular /> },
  { to: '/devis', label: 'Devis', icon: <ReceiptRegular /> },
];

export function Sidebar() {
  const styles = useStyles();
  return (
    <nav aria-label="Navigation principale">
      <div className={styles.brand}>
        <Text as="h1" size={500} weight="bold">
          Baraka Assurance
        </Text>
      </div>
      <div className={styles.nav}>
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === '/'}
            className={({ isActive }) =>
              isActive ? `${styles.item} ${styles.itemActive}` : styles.item
            }
          >
            {it.icon}
            <span>{it.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
