import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { seedClients, seedContrats, seedSinistres } from '../../src/mocks/seed';
import { computeKpi } from '../../src/services/dashboardService';

function renderPage() {
  return render(
    <FluentProvider theme={webLightTheme}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </FluentProvider>,
  );
}

describe('<DashboardPage />', () => {
  it('affiche les 4 KPI principaux', () => {
    renderPage();
    const kpi = computeKpi(seedClients, seedContrats, seedSinistres);
    expect(screen.getByText('Tableau de bord')).toBeInTheDocument();
    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(screen.getByText('Contrats actifs')).toBeInTheDocument();
    expect(screen.getByText('Sinistres ouverts')).toBeInTheDocument();
    expect(screen.getByText('Prime totale')).toBeInTheDocument();
    expect(screen.getByText(String(kpi.nbClients))).toBeInTheDocument();
    expect(screen.getByText(String(kpi.nbContratsActifs))).toBeInTheDocument();
  });

  it('affiche la répartition des contrats et sinistres', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /Contrats par type/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Sinistres par statut/i })).toBeInTheDocument();
    expect(screen.getByText('Auto')).toBeInTheDocument();
    expect(screen.getByText('Habitation')).toBeInTheDocument();
    expect(screen.getByText('Ouvert')).toBeInTheDocument();
  });
});
