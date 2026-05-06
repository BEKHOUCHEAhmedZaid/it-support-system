# IT-Fix — Plateforme de Support Informatique

## Correspondance des tables

| Concept générique  | Implémentation IT-Fix                       |
|--------------------|---------------------------------------------|
| Table A (Utilisateurs) | **Employés** — signalent les problèmes  |
| Table B (Ressources)   | **Techniciens** — résolvent les tickets |
| Table C (Interactions) | **Tickets** — relient les deux rôles    |
| Fichier requis         | **Capture d'écran du bug** (PNG/JPEG)   |

---

## Analyse architecturale

### Vercel + Supabase vs serveur traditionnel (OPEX vs CAPEX)

Un hébergement traditionnel exige un investissement initial lourd (**CAPEX**) : achat de serveurs physiques, baies de stockage, onduleurs, licences OS et leur amortissement sur 3 à 5 ans, sans compter les coûts d'un data center (loyer, électricité, climatisation). À l'inverse, Vercel et Supabase fonctionnent sur un modèle **OPEX** : on ne paie que ce qui est consommé, sans immobilisation. Pour un projet académique ou une PME, cela élimine le risque financier du matériel inutilisé et rend les coûts directement proportionnels à l'usage réel.

### Scalabilité Vercel vs infrastructure physique

Vercel repose sur un réseau mondial de **fonctions serverless** et de CDN edge. Lors d'un pic de charge (ex. : toute l'entreprise signale un incident réseau en même temps), Vercel instancie automatiquement de nouvelles fonctions en quelques millisecondes, sans intervention humaine. Un data center physique nécessite au contraire une **sur-provisionnnement permanent** — des serveurs allumés H24 pour absorber les pics — impliquant gaspillage énergétique, refroidissement actif (chilled water, CRAC units) et des heures d'intervention pour ajouter des lames ou des nœuds. Supabase, adossé à AWS, offre une élasticité similaire pour la base de données (connexions poolées via pgBouncer, réplicas en lecture à la demande).

### Données structurées vs données non structurées

- **Structurées** : toutes les tables PostgreSQL (`profiles`, `tickets`, `messages`, `faq_articles`, `feedback`) — champ typé, contraintes, relations, requêtables en SQL.
- **Non structurées** : les captures d'écran (fichiers binaires PNG/JPEG) stockées dans le bucket Supabase Storage `screenshots`, et le champ JSONB `system_info` des tickets (objet libre collecté côté client : user-agent, résolution, RAM, type de connexion, erreurs JS).

---

## Installation locale

```bash
# 1. Cloner le dépôt
git clone <repo-url>
cd it-fix

# 2. Installer les dépendances
npm install

# 3. Configurer Supabase
#    - Créer un projet sur https://supabase.com
#    - Aller dans SQL Editor et coller intégralement le contenu de schema.sql
#    - Récupérer l'URL et la clé anon dans Settings > API

# 4. Variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos vraies valeurs

# 5. Lancer en développement
npm run dev
```

L'application est accessible sur http://localhost:3000.

---

## Équipe

- KERNOU Amine
- AKROUCHE Rayan
- BEKHOUCHE Ahmed
