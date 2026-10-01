import { create } from 'zustand';
import { Client, Contrat, Devis, Sinistre, StatutSinistre } from '../models/types';
import { seedClients, seedContrats, seedDevis, seedSinistres } from '../mocks/seed';
import {
  createSinistre,
  removeSinistre,
  updateSinistreStatut,
} from '../services/sinistreService';
import { createDevis, DevisDraft } from '../services/devisService';

export interface AppState {
  clients: Client[];
  contrats: Contrat[];
  sinistres: Sinistre[];
  devis: Devis[];
  addSinistre: (draft: Omit<Sinistre, 'id' | 'numero'>) => void;
  changeSinistreStatut: (id: string, statut: StatutSinistre) => void;
  deleteSinistre: (id: string) => void;
  addDevis: (draft: DevisDraft) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  clients: seedClients,
  contrats: seedContrats,
  sinistres: seedSinistres,
  devis: seedDevis,
  addSinistre: (draft) =>
    set((state) => ({ sinistres: [createSinistre(state.sinistres, draft), ...state.sinistres] })),
  changeSinistreStatut: (id, statut) =>
    set((state) => ({ sinistres: updateSinistreStatut(state.sinistres, id, statut) })),
  deleteSinistre: (id) => set((state) => ({ sinistres: removeSinistre(state.sinistres, id) })),
  addDevis: (draft) =>
    set((state) => ({ devis: [createDevis(state.devis, draft), ...state.devis] })),
  reset: () =>
    set({
      clients: seedClients,
      contrats: seedContrats,
      sinistres: seedSinistres,
      devis: seedDevis,
    }),
}));
