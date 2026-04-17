# 🚀 Plan de déploiement v2.1

## 📅 Timeline: 30 minutes

Tout ce qu'il faut faire pour déployer les corrections de sécurité.

---

## ⏰ Phase 1: Préparation (5 min)

### ✓ Sauvegarder l'état actuel
```bash
# Créer une sauvegarde des fichiers originaux
mkdir -p backup/
cp formulaire.html backup/formulaire-OLD-v1.html
cp gestion.html backup/gestion-OLD-v1.html
cp cloture.html backup/cloture-OLD-v1.html

# Vérifier qu'on a bien les nouveaux fichiers
ls -la config.js api-helper.js formulaire-v2.html schema_supabase.sql
```

### ✓ Vérifier l'accès à Supabase
1. Aller sur https://app.supabase.com
2. Sélectionner le projet "ticketing-ecoles" (ou votre nom)
3. Vérifier la connexion

---

## ⏰ Phase 2: SQL & Sécurité (10 min)

### Étape 1: Exécuter le schéma SQL

1. Dans Supabase Console, cliquer sur **SQL Editor** (à gauche)
2. Cliquer sur **New Query**
3. Copier-coller **TOUT** le contenu de `schema_supabase.sql`
4. Cliquer **Run** (ou Ctrl+Enter)

**Résultat attendu :**
```
Query executed successfully. 6 rows affected.
```

**Vérifier les tables :**
```sql
-- Copier-coller dans une nouvelle requête SQL
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Devrait afficher :
-- tickets
-- ticket_historique
-- ticket_notes
-- ecoles
-- referents
-- utilisateurs
```

### Étape 2: Activer RLS (Row Level Security)

1. Aller dans **Database** (à gauche)
2. Sélectionner chaque table :
   - `tickets`
   - `ticket_notes`
   - `ticket_historique`
3. Cliquer sur les 3 points → **Edit policies**
4. Vérifier que "Enable RLS" est actif (switch ON)

**Ou via SQL :**
```sql
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_historique ENABLE ROW LEVEL SECURITY;
```

### Étape 3: Générer une nouvelle clé API

1. Aller dans **Settings** → **API**
2. Sous "Project API keys", cliquer **Regenerate** pour la clé `anon`
3. Copier la nouvelle clé (commençant par `eyJhbGc...`)
4. Remplacer dans `config.js` ligne 15:
```javascript
SUPABASE_KEY: 'VOTRE_NOUVELLE_CLE_ICI'
```

---

## ⏰ Phase 3: Déploiement Frontend (10 min)

### Étape 1: Remplacer formulaire.html

```bash
# Renommer l'ancien
mv formulaire.html formulaire-OLD-v1.html

# Renommer le nouveau
mv formulaire-v2.html formulaire.html
```

### Étape 2: Vérifier les fichiers en place

```bash
ls -la
# Devrait contenir :
# ✅ formulaire.html (remplacé)
# ✅ gestion.html (ancien, à mettre à jour plus tard)
# ✅ cloture.html (ancien, à mettre à jour plus tard)
# ✅ config.js (NOUVEAU)
# ✅ api-helper.js (NOUVEAU)
# ✅ data-ecoles.js (NOUVEAU)
```

### Étape 3: Copier sur le serveur de production

```bash
# Si vous utilisez GitHub Pages :
git add config.js api-helper.js formulaire-v2.html data-ecoles.js schema_supabase.sql
git add CORRECTIONS_APPLIQUEES.md GUIDE_IMPLEMENTATION.md README_CORRECTIONS.md
git mv formulaire.html formulaire-OLD-v1.html
git mv formulaire-v2.html formulaire.html

git commit -m "Sécurité v2.1 : RLS, config externalisée, api-helper, archivage"
git push origin main
```

Attendre que GitHub Pages redéploie (2-3 minutes).

---

## ⏰ Phase 4: Tests (5 min)

### Test 1: Formulaire de création
```
1. Ouvrir https://votre-domaine/formulaire.html
2. Se connecter avec un email d'école (ce.XXXXX@ac-reunion.fr)
3. Remplir le formulaire (toutes les sections)
4. Cliquer "Envoyer le signalement"
✅ Devrait voir "Signalement envoyé avec succès"
✅ Devrait avoir une référence (TICK-YYYY-MM-NNNN)
```

### Test 2: Vérifier en BDD
```
Dans Supabase Console → Table editor → tickets
✅ Devrait voir le ticket créé
✅ Statut = 'nouveau'
✅ numero_ticket doit être unique
```

### Test 3: Sécurité RLS
```
1. Aller dans gestion.html
2. Se connecter avec dtp / dtp2024
3. Vérifier que SEULS les tickets DSB sont visibles
   (pas les tickets Informatique, Restauration, etc.)
✅ Sécurité RLS fonctionne !
```

---

## ❌ Troubleshooting rapide

### Erreur: "Cannot read property 'API_URL' of undefined"
**Solution :**
1. Vérifier que `config.js` est chargé AVANT `api-helper.js`
2. Ouvrir Console (F12) → chercher l'erreur exacte
3. Vérifier le chemin du fichier : `<script src="config.js"></script>`

### Erreur: "RLS policy missing"
**Solution :**
1. Aller dans Supabase → Database → tickets → Edit policies
2. Vérifier que RLS est ON (switch)
3. Vérifier que les policies existent (au moins une)
4. Si rien : re-exécuter le SQL de schema_supabase.sql

### Les emails ne fonctionnent pas
**C'est normal !** EmailJS n'est configuré que dans `gestion.html` (ancien).  
À faire dans la Phase 5.

---

## ✅ Phase 5: Après le déploiement

### À faire dans les prochains jours

```
Jour 1 : ✅ Exécuter SQL + RLS + nouvelle clé
Jour 1 : ✅ Déployer formulaire-v2.html
Jour 1 : ✅ Tester les 3 tests ci-dessus

Jour 2-3 : ⏳ Mettre à jour gestion.html avec api-helper.js
Jour 2-3 : ⏳ Mettre à jour cloture.html avec api-helper.js
Jour 4-5 : ⏳ Créer table utilisateurs + bcrypt
Jour 6-7 : ⏳ Implémenter JWT + HttpOnly cookies
Jour 8-14 : ⏳ Ajouter notifications email
```

### Archive l'ancien code

```bash
# Une fois confirmé que v2.1 fonctionne :
mkdir -p archive/v1/
mv formulaire-OLD-v1.html archive/v1/
# (garder les anciennes versions pour ref)
```

---

## 📊 Vérification finale

| Élément | Avant | Après |
|---------|-------|-------|
| Clés API en dur | ❌ Oui | ✅ Non |
| Mots de passe en dur | ❌ Oui | ✅ Temporaire |
| RLS activé | ❌ Non | ✅ Oui |
| Suppression reversible | ❌ Non | ✅ Oui (archivage) |
| Notes séparées | ❌ Non | ✅ Oui |
| Ref unique | ❌ Non | ✅ Oui |

---

## 📞 En cas de problème

**Avant de contacter :** 
1. Vérifier la Console du navigateur (F12)
2. Vérifier que toutes les commandes SQL ont exécuté
3. Vérifier que RLS est activé
4. Vérifier que la nouvelle clé API est dans config.js

**Si ça ne fonctionne pas :**
1. Revenir à l'ancien code : `git revert HEAD`
2. Vérifier le message d'erreur exact
3. Consulter GUIDE_IMPLEMENTATION.md pour les tests détaillés

---

## ✨ Bravo ! 

Vous avez sécurisé la plateforme. Maintenant :

1. ✅ Clés API ne sont plus exposées
2. ✅ RLS contrôle l'accès par rôle
3. ✅ Archivage récupérable
4. ✅ API helper unifié
5. ✅ Architecture modulaire

Prochaine étape : Migrer vers PostgreSQL local + API serveur.

---

**Durée estimée :** 30 minutes  
**Difficulté :** 🟡 Intermédiaire  
**Dépendances :** Accès Supabase Console  

---

Créé le 17/04/2026
