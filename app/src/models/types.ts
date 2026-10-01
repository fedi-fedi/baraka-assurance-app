// Modèle de données Baraka Assurance

export enum TypeContrat {
  Auto = 'Auto',
  Habitation = 'Habitation',
  Sante = 'Santé',
  Vie = 'Vie',
}

export enum StatutContrat {
  Actif = 'Actif',
  Suspendu = 'Suspendu',
  Resilie = 'Résilié',
}

export enum StatutSinistre {
  Ouvert = 'Ouvert',
  EnCours = 'En cours',
  Clos = 'Clos',
}

export enum StatutDevis {
  Brouillon = 'Brouillon',
  Envoye = 'Envoyé',
  Accepte = 'Accepté',
  Refuse = 'Refusé',
}

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  ville: string;
  dateNaissance: string;
  dateCreation: string;
}

export interface Contrat {
  id: string;
  numero: string;
  clientId: string;
  type: TypeContrat;
  dateDebut: string;
  dateFin: string;
  primeAnnuelle: number;
  statut: StatutContrat;
}

export interface Sinistre {
  id: string;
  numero: string;
  contratId: string;
  dateDeclaration: string;
  dateIncident: string;
  description: string;
  montantEstime: number;
  statut: StatutSinistre;
}

export interface Devis {
  id: string;
  numero: string;
  clientId: string;
  type: TypeContrat;
  dateCreation: string;
  montantPropose: number;
  statut: StatutDevis;
}

export interface DashboardKpi {
  nbClients: number;
  nbContratsActifs: number;
  nbSinistresOuverts: number;
  primeTotale: number;
  repartitionContratsParType: Record<TypeContrat, number>;
  sinistresParStatut: Record<StatutSinistre, number>;
}
