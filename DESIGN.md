# Design

## Product mode
- **Operate**
- Interface interne pensée pour des équipes d'assurance qui doivent scanner vite, comparer des états et agir sans friction.

## Visual world
- Monde visuel de **cockpit assurance premium** : rail latéral vert encre, surfaces ivoire minérales, accent laiton discret.
- Direction assumée contre le dashboard générique à cartes répétitives : contraste structurel fort entre navigation, contexte et surfaces de travail.
- Lumière **claire de bureau**, lisibilité prioritaire, densité contrôlée.

## Layout system
- Rail fixe à gauche avec branding, repères métier et navigation riche.
- Barre de contexte en tête de contenu pour rappeler le module actif et les volumes globaux.
- Chaque écran est composé de :
  - un **header éditorial fonctionnel** ;
  - un **panneau de synthèse** ;
  - un ou plusieurs **panneaux de travail** pour recherche, filtres, formulaires et tables.

## Typography
- Sans-serif système / Inter pour garder un rendu bureau net et crédible.
- Titres compacts, forts en graisse, avec tracking négatif léger.
- Corps et labels en hiérarchie calme, jamais décoratifs.

## Color strategy
- **Committed restrained palette**
- Fond général sable très clair.
- Navigation et zones d'autorité en vert profond.
- Accent laiton réservé aux signaux de marque et aux points de chaleur.
- Couleurs d'état conservées pour badges métier.

## Components
- `PageHeader` : titre, description, bloc latéral de synthèse.
- `SurfaceCard` : conteneur principal des panneaux métier.
- `KpiCard` : cartes KPI plus sculptées, avec icon slot dédié.
- `StatusBadge` : badges compacts et plus affirmés.
- Tables conservées en Fluent UI mais réhabillées par surfaces et hover subtil.

## Interaction principles
- Tout doit être trouvable en quelques secondes.
- Les actions principales restent évidentes et proches du contexte.
- Les formulaires et dialogues restent sobres, directs et orientés tâche.

## Constraints preserved
- Structure existante à 5 écrans.
- Libellés métier en français.
- Flux et fonctionnalités existants conservés.
- Compatibilité avec les tests existants préservée.
