# 📘 Guide d'implémentation — Corrections appliquées

## 🎯 Objectif

Corriger les problèmes de sécurité et fonctionnalité identifiés dans la plateforme de ticketing maintenance scolaire.

## 📂 Fichiers créés

### 1. **config.js** — Configuration centralisée
```javascript
// Externalise les clés API, comptes, et configuration
// À protéger en production !
import { CONFIG, COMPTES, ECOLES_DATA } from './config.js';
```

**À faire :**
- [ ] Remplacer les mots de passe de `COMPTES` par des variables d'environnement
- [ ] En production : utiliser un gestionnaire de secrets (Vault, AWS Secrets Manager)

---

### 2. **api-helper.js** — Wrapper API sécurisé
```javascript
// Gère tous les appels API de manière centralisée
const api = new APIHelper();
await api.createTicket(data);
await api.updateTicket(id, data);
await api.getTickets({ filters });
```

**Avantages :**
- ✅ Pas de clés exposées dans le code
- ✅ Gestion d'erreur uniforme
- ✅ Token JWT automatique
- ✅ Facile à migrer vers serveur local

---

### 3. **formulaire-v2.html** — Formulaire sécurisé
```html
<!-- Remplace formulaire.html -->
<script src="config.js"></script>
<script src="api-helper.js"></script>
<script src="data-ecoles.js"></script>
```

**Changements :**
- ✅ Utilise `api-helper.js` pour tous les appels
- ✅ Pas de clés Supabase en dur
- ✅ Validation renforcée
- ✅ Séparation `observation_initiale` et notes

**À faire :**
- [ ] Remplacer `formulaire.html` par `formulaire-v2.html`
- [ ] Tester tous les formulaires
- [ ] Vérifier la création de tickets

---

### 4. **schema_supabase.sql** — Schéma sécurisé
```sql
-- Exécuter dans Supabase Console → SQL Editor
-- Ajoute : RLS, archivage, historique, indexes
```

**Nouvelles tables :**
- `ticket_notes` — Notes de suivi (séparées de l'observation initiale)
- `ticket_historique` — Traçabilité complète des changements
- `utilisateurs` — Remplace les comptes hardcodés
- `ecoles` — Permet mise à jour dynamique

**Politiques de sécurité :**
- Secretaires/direction : tous les tickets
- Referents : seulement leurs cellules
- Insertion : email ac-reunion.fr ou mairie

**À faire :**
- [ ] Copier le contenu de `schema_supabase.sql`
- [ ] Aller dans Supabase Console → SQL Editor
- [ ] Exécuter les commandes
- [ ] Vérifier que les tables sont créées
- [ ] Activer RLS sur chaque table

---

### 5. **data-ecoles.js** — Données externalisées
```javascript
// Contient les listes d'écoles et types de travaux
// À migrer dans une table `ecoles` en BDD
const ECOLES_DATA = { ... };
const TYPES_PAR_CELLULE = { ... };
```

---

## 🔐 Instructions de sécurité

### Étape 1 : Exécuter le schéma SQL (URGENT)

```bash
# Dans Supabase Console → SQL Editor
# Copier-coller tout le contenu de schema_supabase.sql et exécuter
```

**Résultat attendu :**
- ✅ 6 nouvelles tables créées
- ✅ RLS activé sur `tickets`, `ticket_notes`, `ticket_historique`
- ✅ Indexes créés pour performance
- ✅ Triggers pour archivage automatique

---

### Étape 2 : Activer Row Level Security (RLS)

```sql
-- Vérifier que RLS est activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Résultat :
-- tickets        | t    (RLS activé ✅)
-- ticket_notes   | t
-- ticket_historique | t
```

Si RLS n'est pas activé :
```sql
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
```

---

### Étape 3 : Générer une nouvelle clé API

1. Allez dans **Supabase Console** → **Settings** → **API**
2. Cliquez sur "Regenerate" pour la clé `anon`
3. Copier la nouvelle clé dans `config.js`

---

### Étape 4 : Mettre à jour le frontend

#### Remplacer `formulaire.html` par `formulaire-v2.html` :
```bash
# Sauvegarder l'ancien
mv formulaire.html formulaire-OLD-v1.html

# Renommer le nouveau
mv formulaire-v2.html formulaire.html
```

#### Vérifier les références dans les liens :
- Index principal doit pointer vers `formulaire.html`
- Dashboard doit pointer vers `gestion.html`

---

## 🧪 Tests à effectuer

### Test 1 : Création de ticket
1. Ouvrir `formulaire.html`
2. Se connecter avec email d'école (ce.XXXXX@ac-reunion.fr)
3. Remplir le formulaire complètement
4. Cliquer "Envoyer le signalement"
5. Vérifier que le ticket est créé avec statut `nouveau`

**Vérification en BDD :**
```sql
SELECT id, numero_ticket, statut, demandeur_email, created_at
FROM tickets
ORDER BY created_at DESC
LIMIT 1;
```

---

### Test 2 : Sécurité RLS
1. Ouvrir `gestion.html`
2. Se connecter avec `dtp` / `dtp2024` (referent DTP)
3. Vérifier que **seuls** les tickets avec `cellule = 'DTP'` sont visibles
4. Ne pas voir les tickets d'autres cellules

**Vérification en BDD :**
```sql
-- Tickets visibles pour l'utilisateur DTP
SELECT cellule, COUNT(*) as count
FROM tickets
WHERE cellule = 'DTP'
GROUP BY cellule;
```

---

### Test 3 : Archivage
1. Cliquer sur un ticket résolu
2. Attendre 90 jours OU exécuter le trigger :
```sql
-- Forcer l'archivage immédiatement (test)
UPDATE tickets SET statut = 'archive', updated_at = NOW()
WHERE statut = 'resolu' AND updated_at < NOW() - INTERVAL '7 days';
```

3. Vérifier que le ticket disparaît de la liste active
4. Vérifier qu'il est encore en BDD :
```sql
SELECT id, statut FROM tickets WHERE statut = 'archive';
```

---

### Test 4 : Historique
1. Modifier un ticket (changer statut de `nouveau` → `en_cours`)
2. Ajouter une note de suivi
3. Vérifier que l'historique est enregistré :
```sql
SELECT changed_at, ancien_statut, nouveau_statut, note
FROM ticket_historique
WHERE ticket_id = 'UUID-DU-TICKET'
ORDER BY changed_at DESC;
```

---

## 🚀 Prochaines étapes

### Court terme (1-2 semaines)
- [ ] ✅ Exécuter schema_supabase.sql
- [ ] ✅ Activer RLS sur Supabase
- [ ] ✅ Générer nouvelle clé API
- [ ] ✅ Déployer formulaire-v2.html
- [ ] ✅ Effectuer les tests ci-dessus

### Moyen terme (3-4 semaines)
- [ ] Créer table `utilisateurs` avec bcrypt
- [ ] Remplacer `gestion.html` avec version utilisant JWT
- [ ] Ajouter notifications email
- [ ] Implémenter pagination côté serveur
- [ ] Créer portail de suivi pour demandeurs

### Long terme (5+ semaines)
- [ ] Migrer vers PostgreSQL local
- [ ] Implémenter API REST Node.js
- [ ] Implémenter SMTP local
- [ ] Externaliser écoles vers table BDD
- [ ] Dashboard avancé pour direction

---

## 📝 Fichiers à modifier (après cette phase)

### `gestion.html` — À mettre à jour
Remplacer :
```javascript
// ❌ OLD (utilisé l'ancienne version)
const SUPABASE_KEY = '...' // Exposé !
const COMPTES = { ... } // Mots de passe en clair !
```

Par :
```javascript
// ✅ NEW
<script src="config.js"></script>
<script src="api-helper.js"></script>
// Utiliser api.updateTicket(), api.getTickets(), etc.
```

### `cloture.html` — À mettre à jour
Idem : utiliser `config.js` + `api-helper.js`

---

## ⚠️ Points d'attention

| Point | Action |
|-------|--------|
| **Mots de passe** | Remplacer par table `utilisateurs` + bcrypt ASAP |
| **Clés API** | Régénérer tous les mois (best practice) |
| **SessionStorage** | Migrer vers JWT + HttpOnly cookies (serveur) |
| **Photos** | Stocker en filesystem, pas en BDD |
| **Emails** | Configurer SMTP ou EmailJS avec RLS |

---

## 🆘 Si ça casse

### Problème : "Erreur lors de la création du ticket"
1. Ouvrir Console navigateur (F12)
2. Chercher le message d'erreur exact
3. Vérifier que `config.js` et `api-helper.js` sont chargés
4. Vérifier que Supabase est accessible

### Problème : "RLS issue — permission denied"
1. Vérifier que RLS est activé : `ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;`
2. Vérifier que le JWT contient le `role` correct
3. Vérifier les policies existent

### Problème : "Tickets d'autres cellules visibles"
1. RLS n'est pas activé correctement
2. Ou le JWT ne contient pas le `cellule`
3. Exécuter : `SELECT * FROM policies WHERE tablename = 'tickets';`

---

## 📖 Documentation supplémentaire

- [schema_supabase.sql](./schema_supabase.sql) — Schéma complet
- [CORRECTIONS_APPLIQUEES.md](./CORRECTIONS_APPLIQUEES.md) — Détail des corrections
- [config.js](./config.js) — Configuration
- [api-helper.js](./api-helper.js) — Helper API

---

**Créé le 17/04/2026**
