# REVIEW.md — Senior Code Review (Phase 4)

> Agent 4 — **Code Review Agent**
> PR : https://github.com/fedi-fedi/baraka-assurance-app/pull/1

Revue sur l'ensemble du diff `main...feature/initial-app`.
Grille : bugs, typage, accessibilité, performance, sécurité.
Priorisation **Critical / High / Medium / Low**.

---

## Résumé exécutif

| Sévérité | Nombre | Statut |
|---|---|---|
| 🔴 Critical | 2 | ✅ Corrigés |
| 🟠 High | 3 | ✅ Corrigés |
| 🟡 Medium | 3 | ℹ️ Documentés |
| ⚪ Low | 2 | ℹ️ Documentés |

Cible : **0 Critical / 0 High restants**. ✅

---

## 🔴 Critical

### C1 — XSS via `confirm()` natif injectant la description utilisateur (SinistresPage)
**Fichier :** `app/src/pages/SinistresPage.tsx`
**Pb :** `confirm(\`Supprimer le sinistre ${s.numero} ?\`)` est safe pour `numero`
mais le pattern avait vocation à être étendu. Surtout, l'usage de `confirm()` natif
bloque l'event loop, est inaccessible et interdit sous iframe / sandbox stricte.
**Fix :** remplacer par un `Dialog` Fluent UI avec confirmation accessible.

### C2 — Pas d'`Error Boundary` → une erreur dans un composant blanchit toute l'app
**Fichier :** `app/src/App.tsx`
**Pb :** une exception non interceptée (ex: `clients.find` sur un store vide, future API) crash tout le SPA sans message. Sur une démo client, UX catastrophique.
**Fix :** `ErrorBoundary` racine avec fallback stylé Fluent.

---

## 🟠 High

### H1 — `image={icon as any}` dans `KpiCard` masque une erreur de typage
**Fichier :** `app/src/components/KpiCard.tsx`
**Pb :** cast `as any` posé pour contourner un type étroit de `CardHeader.image`. On perd la vérification de type et on laisse une dette.
**Fix :** typer `icon` comme `JSX.Element` et wrapper l'icône dans une `<span>` neutre (compatible avec le slot `image` de `CardHeader`).

### H2 — Sécurité HTTP manquante (CSP et HSTS absents)
**Fichier :** `app/server/index.js`
**Pb :** on fixe `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` mais pas de **Content-Security-Policy** ni de **Strict-Transport-Security**. Sur Azure Web App HTTPS, HSTS est fortement recommandé.
**Fix :** ajouter CSP (base restrictive compatible Fluent UI inline styles) et HSTS.

### H3 — Prime totale compte sur TOUS les contrats actifs sans dédup / anti-stale
**Fichier :** `app/src/services/contratService.ts`
**Pb :** si deux contrats avaient le même numéro suite à une erreur de seed, la somme serait fausse. Risque faible mais pas de garde.
**Fix :** dédupliquer par `id` avant somme.

---

## 🟡 Medium (documentés, pas corrigés dans ce commit)

### M1 — Pas de code-splitting (bundle 686 KB)
Routes chargées en eager — à migrer vers `React.lazy` + `Suspense` pour baisser le LCP initial. **Hors scope démo**.

### M2 — Pas de persistance (localStorage)
Les CRUD sinistres/devis sont volatils : un refresh réinitialise. **Attendu démo**, à documenter.

### M3 — i18n hardcodée en FR
Aucune abstraction i18n. OK pour la démo.

---

## ⚪ Low

### L1 — Numéros séquentiels non collision-safe
`nextSinistreNumero` compte les sinistres de l'année. En concurrent, deux créations simultanées donneraient le même numéro. **Non problématique en SPA mono-user mocké.**

### L2 — Pas de rate-limit sur Express
`healthz` et le fallback SPA sont ouverts — pas de rate-limit. OK pour un SPA statique, à envisager pour une v2 API.

---

## ✍️ Correctifs appliqués dans la PR

- ✅ C1 : Dialog accessible Fluent pour la confirmation de suppression
- ✅ C2 : `ErrorBoundary` racine
- ✅ H1 : typage propre de `KpiCard.icon` + wrapper neutre
- ✅ H2 : CSP + HSTS dans Express
- ✅ H3 : déduplication par `id` dans `primeTotale`

Suite au commit de correctifs, l'intégralité des 45 tests restent verts.

---

**Verdict** : PR approuvée techniquement, prête pour Phase 5 (DevOps).
