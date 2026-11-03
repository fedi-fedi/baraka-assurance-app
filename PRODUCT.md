# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Les utilisateurs principaux sont des équipes internes de Baraka Assurance. Elles utilisent l'application au quotidien pour suivre l'activité opérationnelle, consulter l'état du portefeuille et exécuter rapidement les actions de gestion courantes.

## Product Purpose
Baraka Assurance centralise la gestion métier autour de cinq surfaces clés : Dashboard, Clients, Contrats, Sinistres et Devis. Le produit doit donner une vue claire de l'activité, accélérer le suivi des dossiers et rendre la lecture des indicateurs immédiate pour un usage interne.

## Positioning
Le produit se distingue par un cockpit métier simple, francophone et orienté opérations d'assurance, qui rassemble dans une même interface les vues clients, contrats, sinistres et devis avec des données cohérentes et directement exploitables par une équipe interne.

## Operating Context
L'application est consultée dans un contexte de travail interne, sur poste de bureau, pour surveiller les indicateurs, parcourir les dossiers, suivre l'avancement des sinistres et gérer les devis. La structure actuelle à cinq écrans doit être préservée.

## Capabilities and Constraints
- Application web interne.
- Structure à préserver : Dashboard, Clients, Contrats, Sinistres, Devis.
- Langue d'usage actuelle : français.
- Vocabulaire métier lié à l'assurance à conserver.
- Données de démonstration cohérentes avec un contexte d'assurance au Maroc.
- Les surfaces existantes couvrent le suivi des clients, contrats, sinistres et devis ainsi qu'une vue KPI globale.

## Brand Commitments
- Nom établi : Baraka Assurance.
- Le redesign ne doit pas casser la structure métier actuelle des cinq écrans.

## Evidence on Hand
- Interface existante dans `app/src/`.
- Architecture fonctionnelle décrite dans `ARCHITECTURE.md`.
- Données métier mockées dans `app/src/mocks/seed.ts`.
- Aucun asset de marque supplémentaire confirmé à ce stade (logo propriétaire, charte, photos, preuves marketing).

## Product Principles
- Donner une lecture immédiate de l'activité métier.
- Réduire la friction sur les tâches internes les plus fréquentes.
- Préserver la clarté et le vocabulaire métier avant tout effet décoratif.
- Ancrer l'interface dans un contexte d'assurance crédible et cohérent.

## Accessibility & Inclusion
Le produit doit rester navigable et lisible pour un usage bureautique quotidien, avec une attention continue portée à la structure sémantique, au focus visible et à la clarté des libellés.
