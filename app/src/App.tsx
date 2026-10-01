import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { AppLayout } from './layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ClientsPage } from './pages/ClientsPage';
import { ContratsPage } from './pages/ContratsPage';
import { SinistresPage } from './pages/SinistresPage';
import { DevisPage } from './pages/DevisPage';
import { ErrorBoundary } from './components/ErrorBoundary';

export function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="contrats" element={<ContratsPage />} />
              <Route path="sinistres" element={<SinistresPage />} />
              <Route path="devis" element={<DevisPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </FluentProvider>
  );
}

export default App;
