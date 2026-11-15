# IT-Fix — Plateforme de Support Informatique

## Correspondance des collections Firebase

| Concept générique | Implémentation IT-Fix (Firestore) |
|---|---|
| Collection Utilisateurs | **`users`** — profils des clients, techniciens et administrateurs |
| Collection Incidents | **`tickets`** — suivi des incidents et assignation |
| Sous-collection Messages | **`tickets/{id}/messages`** — messagerie temps réel |
| Base de connaissances | **`faq_articles`** — articles de résolution de problèmes |
| Retours & Satisfaction | **`feedback`** — notation et avis sur les tickets résolus |

---

## Analyse architecturale

### Vercel + Firebase (Cloud Firestore & Firebase Auth)

Ce projet fonctionne sur un modèle serverless **OPEX** avec Next.js 14 déployé sur Vercel et le backend propulsé par Google Firebase (Spark Plan gratuit) :
- **Authentification :** Firebase Auth (Email / Password).
- **Base de données temps réel :** Cloud Firestore (collections NoSQL avec requêtes indexées et écoute `onSnapshot`).
- **Sécurité :** Règles de sécurité granulaires dans `firestore.rules` assurant la protection des données directement au niveau de la base.

---

## Installation locale

```bash
# 1. Cloner le dépôt
git clone <repo-url>
cd it-fix

# 2. Installer les dépendances
npm install

# 3. Variables d'environnement
cp .env.example .env.local
# Renseigner vos identifiants Firebase dans .env.local :
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
# NEXT_PUBLIC_FIREBASE_APP_ID=...

# 4. Lancer en développement
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

---

## Équipe

- KERNOU Amine
- AKROUCHE Rayan
- BEKHOUCHE Ahmed
