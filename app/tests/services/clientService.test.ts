import { describe, it, expect } from 'vitest';
import { listClients, findClient, searchClients, clientFullName } from '../../src/services/clientService';
import { seedClients } from '../../src/mocks/seed';

describe('clientService', () => {
  it('liste les clients triés par nom', () => {
    const sorted = listClients(seedClients);
    expect(sorted).toHaveLength(seedClients.length);
    const noms = sorted.map((c) => c.nom);
    expect([...noms]).toEqual([...noms].sort((a, b) => a.localeCompare(b)));
  });

  it('trouve un client par id', () => {
    expect(findClient(seedClients, 'c1')?.nom).toBe('Benali');
    expect(findClient(seedClients, 'nope')).toBeUndefined();
  });

  it('cherche par nom, prénom, email ou ville', () => {
    expect(searchClients(seedClients, 'Benali').map((c) => c.id)).toContain('c1');
    expect(searchClients(seedClients, 'youssef').map((c) => c.id)).toContain('c1');
    expect(searchClients(seedClients, 'rabat').map((c) => c.id)).toContain('c2');
    expect(searchClients(seedClients, 'nadia.fassi@example.ma').map((c) => c.id)).toContain('c8');
  });

  it('retourne tous les clients si la recherche est vide', () => {
    expect(searchClients(seedClients, '   ')).toHaveLength(seedClients.length);
  });

  it('retourne un tableau vide pour une recherche sans résultat', () => {
    expect(searchClients(seedClients, 'zzzzz')).toEqual([]);
  });

  it('formate le nom complet', () => {
    expect(clientFullName(seedClients[0])).toBe('Youssef Benali');
  });
});
