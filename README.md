# Baraka Assurance — App Démo

Application web React + Vite + TypeScript construite en Loop Engineering avec 5 agents IA
(Architect → Code Builder → QA → Code Review → DevOps) pour **Baraka Assurance**.

> Démo GitHub Copilot — scaffolding, tests, revue et déploiement Azure en moins d'une heure.

## Stack

- **Vite 8** + React 19 + TypeScript strict
- **Fluent UI v9** (design system Microsoft)
- **React Router v7** / **Zustand**
- **Vitest** + React Testing Library (couverture services 100 %)
- **Express** (Node 22) pour servir le SPA en prod
- **Azure Web App Linux** + Application Insights + Key Vault
- **GitHub Actions** pour le CI/CD

## Fonctionnalités

- Dashboard : KPI (clients, contrats actifs, sinistres ouverts, prime totale)
- Clients : liste + recherche
- Contrats : liste + filtres par type et statut
- Sinistres : CRUD complet + changement de statut
- Devis : formulaire de création rapide + liste

Données 100 % mockées (10 clients, 20 contrats, 8 sinistres, 5 devis — noms maghrébins).

## Démarrage local

```bash
cd app
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest
npm run test:coverage
npm run build      # Build production dans dist/
npm start          # Sert le build via Express (port 8080)
```

## Déploiement Azure

```powershell
./scripts/azure-provision.ps1   # provisionne RG, Plan, Web App, AI, Key Vault
```

Puis push sur `main` → GitHub Actions build + test + déploie sur
`https://baraka-assurance-app.azurewebsites.net`.

## Loop Engineering — livrables par agent

| Agent | Livrable |
|---|---|
| 🧭 Architect | `ARCHITECTURE.md` |
| 🏗️ Code Builder | `app/` complet, 5 écrans navigables |
| 🧪 QA | 45 tests Vitest, 100 % couverture services |
| 👀 Code Reviewer | `REVIEW.md`, PR revue, Critical/High corrigés |
| 🚀 DevOps | `scripts/azure-provision.ps1` + `.github/workflows/azure-webapp.yml` |

---

Préparé par Fedi Ben Ammar — démo Baraka Assurance.
