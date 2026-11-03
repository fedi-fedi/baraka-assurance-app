import type { ReactElement } from 'react';
import {
  HomeRegular,
  PeopleRegular,
  DocumentRegular,
  WarningRegular,
  ReceiptRegular,
} from '@fluentui/react-icons';

export interface NavItem {
  to: string;
  label: string;
  description: string;
  icon: ReactElement;
}

export const navItems: NavItem[] = [
  {
    to: '/',
    label: 'Dashboard',
    description: 'Vue synthétique du portefeuille et des signaux prioritaires.',
    icon: <HomeRegular />,
  },
  {
    to: '/clients',
    label: 'Clients',
    description: 'Répertoire clients pour retrouver rapidement un dossier.',
    icon: <PeopleRegular />,
  },
  {
    to: '/contrats',
    label: 'Contrats',
    description: 'Lecture filtrée des polices, primes et statuts du portefeuille.',
    icon: <DocumentRegular />,
  },
  {
    to: '/sinistres',
    label: 'Sinistres',
    description: 'Suivi opérationnel des déclarations, statuts et montants estimés.',
    icon: <WarningRegular />,
  },
  {
    to: '/devis',
    label: 'Devis',
    description: 'Création et suivi des propositions commerciales en cours.',
    icon: <ReceiptRegular />,
  },
];

export function getCurrentNavItem(pathname: string) {
  return navItems.find((item) => item.to !== '/' && pathname.startsWith(item.to)) ?? navItems[0];
}
