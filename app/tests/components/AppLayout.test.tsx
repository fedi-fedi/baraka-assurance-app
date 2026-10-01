import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { AppLayout } from '../../src/layout/AppLayout';

function renderLayout(initial = '/') {
  return render(
    <FluentProvider theme={webLightTheme}>
      <MemoryRouter initialEntries={[initial]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<div>HOME_CONTENT</div>} />
            <Route path="clients" element={<div>CLIENTS_CONTENT</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </FluentProvider>,
  );
}

describe('<AppLayout />', () => {
  it('rend la sidebar avec tous les items de navigation', () => {
    renderLayout();
    const nav = screen.getByRole('navigation', { name: /Navigation principale/i });
    expect(nav).toBeInTheDocument();
    for (const label of ['Dashboard', 'Clients', 'Contrats', 'Sinistres', 'Devis']) {
      expect(screen.getByRole('link', { name: new RegExp(label, 'i') })).toBeInTheDocument();
    }
  });

  it('affiche le contenu de la route via Outlet', () => {
    renderLayout('/');
    expect(screen.getByText('HOME_CONTENT')).toBeInTheDocument();
  });

  it('bascule le contenu quand la route change', () => {
    renderLayout('/clients');
    expect(screen.getByText('CLIENTS_CONTENT')).toBeInTheDocument();
  });

  it('contient le branding Baraka Assurance', () => {
    renderLayout();
    expect(screen.getByRole('heading', { name: /Baraka Assurance/i })).toBeInTheDocument();
  });
});
