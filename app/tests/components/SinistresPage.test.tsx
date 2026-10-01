import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { SinistresPage } from '../../src/pages/SinistresPage';
import { useAppStore } from '../../src/store/useAppStore';

function renderPage() {
  return render(
    <FluentProvider theme={webLightTheme}>
      <MemoryRouter>
        <SinistresPage />
      </MemoryRouter>
    </FluentProvider>,
  );
}

describe('<SinistresPage />', () => {
  beforeEach(() => {
    useAppStore.getState().reset();
  });

  it('affiche le titre et le bouton de création', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Sinistres' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Nouveau sinistre/i })).toBeInTheDocument();
  });

  it('affiche la table avec les sinistres seed', () => {
    renderPage();
    const table = screen.getByRole('table', { name: /Liste des sinistres/i });
    expect(within(table).getByText('SN-2026-00001')).toBeInTheDocument();
    expect(within(table).getByText('SN-2026-00008')).toBeInTheDocument();
  });

  it("affiche l'état vide quand le store est vidé", () => {
    useAppStore.setState({ sinistres: [] });
    renderPage();
    expect(screen.getByRole('status')).toHaveTextContent('Aucun sinistre déclaré.');
  });
});
