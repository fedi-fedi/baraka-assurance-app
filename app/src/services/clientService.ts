import { Client } from '../models/types';

export function listClients(clients: Client[]): Client[] {
  return [...clients].sort((a, b) => a.nom.localeCompare(b.nom));
}

export function findClient(clients: Client[], id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}

export function searchClients(clients: Client[], query: string): Client[] {
  const q = query.trim().toLowerCase();
  if (!q) return listClients(clients);
  return listClients(clients).filter(
    (c) =>
      c.nom.toLowerCase().includes(q) ||
      c.prenom.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.ville.toLowerCase().includes(q),
  );
}

export function clientFullName(c: Client): string {
  return `${c.prenom} ${c.nom}`;
}
