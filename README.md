# Mon Projet React

Application de gestion des actes de naissance (front-end React + Vite).

## Aperçu
Interface pour enregistrer, rechercher, valider, imprimer et gérer des actes de naissance.

## Prérequis
- Node.js 18+ (recommandé)
- npm

## Installation
1. Installer les dépendances :

```bash
npm install
```

2. Lancer le serveur de développement :

```bash
npm run dev
```

3. Construire pour production :

```bash
npm run build
```

4. Prévisualiser la build :

```bash
npm run preview
```

## Scripts utiles
- `npm run dev` : démarre Vite en mode développement
- `npm run build` : génère la build de production
- `npm run preview` : sert la build localement
- `npm run lint` : lance l'outil de lint (`oxlint`)

## Structure principale
- `src/` : code source React
	- `api/` : wrapper des appels API (`api.js`, `birthApi.js`)
	- `pages/` : pages (Dashboard, gestion des naissances, recherche...)
	- `components/` : composants réutilisables
	- `layouts/` : layouts
- `public/` : fichiers publics

## Endpoints API (front-call)
L'application consomme un backend REST. Exemples d'appels (implémentés dans `src/api/birthApi.js`):

- `GET /births` : récupérer toutes les naissances
- `POST /births/search/{actNumber}` : rechercher par numéro d'acte
- `POST /births/{id}` : récupérer détails via POST
- `GET /births/{id}/history` : récupérer l'historique d'un acte
- `DELETE /births/{id}` : supprimer une naissance non validée
- `GET /births/dashboard` : statistiques pour le tableau de bord

> Remarque : adapter l'URL de base et les headers (auth) dans `src/api/api.js`.

## Styles et responsive
Le projet utilise React+vite, lucide-react, boostrap et du CSS scoped inline dans certaines pages.  

##  Présentation

**SIVEC** est une application web destinée à la gestion, au contrôle et à la vérification des actes de naissance.

L'application permet aux agents des centres d'état civil de :

- enregistrer une naissance ;
- consulter les actes de naissance ;
- rechercher un acte par numéro d'acte ;
- modifier les actes non encore validés ;
- valider les actes ;
- supprimer les actes en attente ;
- ajouter des pièces jointes ;
- générer les actes au format PDF ;
- consulter les statistiques des naissances ;
- gérer les informations relatives aux parents ;
- suivre le statut des actes.

L'objectif est de **digitaliser et sécuriser la gestion des actes de naissance**, tout en facilitant le travail des agents d'état civil.

---

#  Objectifs du projet

Le projet vise principalement à :

1. Digitaliser l'enregistrement des naissances.
2. Centraliser les informations relatives aux actes.
3. Faciliter la recherche et la consultation des actes.
4. Réduire les erreurs liées à la gestion manuelle des documents.
5. Permettre la validation des actes par les agents habilités.
6. Associer des documents justificatifs aux actes.
7. Générer automatiquement les actes de naissance en PDF.
8. Fournir un tableau de bord statistique.
9. Améliorer la traçabilité des opérations.
10. Préparer une architecture évolutive et sécurisée.
