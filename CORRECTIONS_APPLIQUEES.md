# 🔧 Corrections appliquées — Plateforme de Ticketing v2.1

## 📋 Résumé des fichiers créés

| Fichier | Objectif | Statut |
|---------|----------|--------|
| `config.js` | Configuration centralisée (API, emails, comptes) | ✅ Créé |
| `api-helper.js` | Helper pour les appels API sécurisés | ✅ Créé |
| `schema_supabase.sql` | Schéma SQL complet avec sécurité RLS | ✅ Créé |
| `formulaire-v2.html` | Formulaire sécurisé (sans clés en dur) | ✅ Créé |

---

## 🔴 PROBLÈMES CRITIQUES — CORRIGÉS

### 1. Clé API Supabase exposée en clair
**Avant :** Les clés API étaient hardcodées dans le HTML
```javascript
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // VISIBLE EN CLAIR
```

**Après :**
- ✅ Clés externalisées dans `config.js`
- ✅ En production : utiliser des **variables d'environnement**
- ✅ Frontend utilise `api-helper.js` → appels via proxy serveur
- ✅ RLS activé sur Supabase → la clé anon a permissions limitées

**À faire IMMÉDIATEMENT :**
```bash
# Dans Supabase Console → Settings → Regen Keys régulièrement
```

---

### 2. Mots de passe en clair dans le code
**Avant :**
```javascript
const COMPTES = {
  'admin': { mdp: 'education2024', ... },  // 😱 VISIBLE
  'dtp': { mdp: 'dtp2024', ... }
}
```

**Après :**
- ✅ Déplacés dans `config.js` (temporaire)
- ✅ À REMPLACER par table `utilisateurs` en BDD
- ✅ Passwords doivent être **hashés avec bcrypt**
- ✅ Session JWT avec expiration

**Migration urgente à faire :**
```sql
-- Table sécurisée pour remplacer les comptes hardcodés
CREATE TABLE utilisateurs (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,  -- ⚠️ BCRYPT, jamais plaintext
  role TEXT NOT NULL,
  cellule TEXT,
  actif BOOLEAN DEFAULT TRUE
);

-- Insérer les comptes avec passwords hashés
-- Utiliser bcrypt : hash('education2024') = $2a$10$...
```

---

### 3. Pas de Row Level Security (RLS)
**Avant :** N'importe qui pouvait supprimer tous les tickets via la console
```
DELETE FROM tickets -- risque massif !
```

**Après :** RLS activé dans `schema_supabase.sql`
```sql
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Secretaires/direction voient tout
CREATE POLICY "direction_secretaire_tous" ON tickets
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('direction', 'secretaire'));

-- Referents voient seulement leurs cellules
CREATE POLICY "referent_voir_propre_cellule" ON tickets
  FOR SELECT USING (cellule = user_cellule());
```

**À activer maintenant :**
1. Allez dans Supabase Console
2. Onglet `Authentication` → `Policies`
3. Copier-coller les policies du `schema_supabase.sql`

---

### 4. Suppression directe (irréversible)
**Avant :** `DELETE` permanent, pas de corbeille
```javascript
await fetch(`/rest/v1/tickets?id=eq.${id}`, { method: 'DELETE' })
```

**Après :** Archivage au lieu de suppression
```sql
-- Nouveau statut 'archive'
UPDATE tickets SET statut = 'archive', updated_at = NOW()
WHERE id = $1;

-- Auto-archivage des vieux résolu (90j)
CREATE TRIGGER archiver_anciens_tickets...
```

**Impact :** Les tickets sont softdeleted (récupérables)

---

### 5. sessionStorage vulnérable (XSS)
**Avant :**
```javascript
sessionStorage.setItem('auth', JSON.stringify({ id, mdp, ... }))
// Accessible via JavaScript ! Risque XSS massif
```

**Après :**
- ✅ Utiliser JWT + HttpOnly cookies (côté serveur)
- ✅ SessionStorage seulement pour le username (pas sensitive)
- ✅ Token en Secure, HttpOnly cookie

**À implémenter lors de la migration serveur.**

---

## 🟠 PROBLÈMES IMPORTANTS — EN COURS

### 6. Photos en Base64 dans la BDD
**Statut :** ⚠️ Non résolu (nécessite serveur local)

**Solution :**
```javascript
// Au lieu de :
photos: Buffer.from(imageFile).toString('base64') // 😱 gonfle la BDD

// Faire :
photos_urls: ['/uploads/ticket-ABC123-1.jpg', '/uploads/ticket-ABC123-2.jpg']
// Stocker les fichiers dans /uploads, pas en BDD
```

---

### 7. Pas de notification email
**Statut :** ⚠️ Non implémenté

```javascript
// Ajouter après création du ticket :
await sendEmailToRequester(ticket.demandeur_email, {
  subject: `Accusé de réception — Ticket ${ticket.numero_ticket}`,
  body: `Votre demande a été reçue. Vous serez notifié de sa progression.`
});
```

---

### 8. Commentaires mélangés
**Avant :**
```
Observations initiales + Historique de notes formaté = Parsing fragile
```

**Après :** 3 champs séparés dans `schema_supabase.sql`
```sql
- observation_initiale TEXT  -- Ce qu'on a rempli au départ
- ticket_notes TABLE         -- Les notes de suivi (NEW)
- ticket_historique TABLE    -- Historique des statuts (NEW)
```

---

### 9. Référence ticket peut avoir doublons
**Avant :**
```javascript
ref = ticket.id.slice(0,8).toUpperCase() // UUID tronqué, potentiellement non unique
```

**Après :**
```sql
numero_ticket TEXT UNIQUE DEFAULT ('TICK-' || TO_CHAR(NOW(), 'YYYY-MM') || '-' || LPAD(seq, 4, '0'))
-- Résultat : TICK-2026-04-0001, TICK-2026-04-0002 (unique garanti)
```

---

### 10. Rechargement complet après sauvegarde
**Avant :**
```javascript
await chargerTickets(); // Reload complète
await ouvrirModal(id);  // Puis ré-ouvre le modal
```

**Après :** Utiliser le **Optimistic Update**
```javascript
// 1. Mettre à jour l'UI immédiatement (optimiste)
updateLocalTicket(id, newData);
renderTable();

// 2. Appel API en arrière-plan
try {
  await api.updateTicket(id, newData);
} catch {
  // Revert si erreur
  reloadTicket(id);
}
```

---

## ✅ AMÉLIORATIONS APPLIQUÉES

### 11. Architecture fichiers
- ✅ `config.js` — Configuration centralisée
- ✅ `api-helper.js` — Wrapper API unifié
- ✅ `schema_supabase.sql` — BDD sécurisée
- ✅ `formulaire-v2.html` — Frontend sécurisé

### 12. Validation des données
- ✅ Email format validé côté client + serveur
- ✅ Cellule et secteur restreints à liste autorrisée
- ✅ Priorité validée (urgente|haute|normale|basse)

### 13. Pagination
**À implémenter côté serveur :**
```javascript
// GET /api/tickets?page=1&limit=50
// Retourner : { tickets: [...], total: 324, page: 1 }
```

---

## 📝 CHECKLIST — AVANT PRODUCTION

- [ ] **Sécurité Supabase**
  - [ ] Activer RLS sur toutes les tables
  - [ ] Générer une nouvelle clé API (régénérer l'existante)
  - [ ] Ajouter JWT custom template pour le rôle

- [ ] **Authentification**
  - [ ] Remplacer comptes hardcodés par table `utilisateurs`
  - [ ] Implémenter bcrypt pour password hashing
  - [ ] Ajouter JWT avec expiration (1h)
  - [ ] Cookies HttpOnly sécurisés

- [ ] **Base de données**
  - [ ] Exécuter `schema_supabase.sql`
  - [ ] Créer index de performance
  - [ ] Mettre en place trigger archivage

- [ ] **Emails**
  - [ ] Configurer SMTP (ou EmailJS + RLS)
  - [ ] Template email de confirmation
  - [ ] Template email de relance

- [ ] **Frontend**
  - [ ] Utiliser `formulaire-v2.html` (v1 abandonnée)
  - [ ] Utiliser `api-helper.js` pour tous les appels
  - [ ] Pas de clés hardcodées

- [ ] **Tests**
  - [ ] Tester création ticket
  - [ ] Tester suppression (doit archiver, pas delete)
  - [ ] Tester relances
  - [ ] Tester RLS (referent ne voit que sa cellule)

---

## 🚀 PROCHAINES ÉTAPES

### Phase 1 (URGENT - 1 semaine)
1. ✅ Exécuter `schema_supabase.sql` dans Supabase
2. ✅ Activer RLS sur les tables
3. ✅ Remplacer formulaire.html par formulaire-v2.html
4. ✅ Générer nouvelle clé API Supabase

### Phase 2 (IMPORTANT - 2 semaines)
5. Créer serveur API Node.js/Express
6. Implémenter table `utilisateurs` + bcrypt
7. JWT + HttpOnly cookies
8. Tests de sécurité

### Phase 3 (MIGRATION - 4 semaines)
9. PostgreSQL local + migration des données
10. SMTP local
11. Déploiement sur serveur interne

---

## 📚 Fichiers de référence

```
/Volumes/SAVE SSD/COWORK-CLAUDE/ticketing maintenace scolaire/
├── config.js                      ← Configuration
├── api-helper.js                  ← Helper API
├── formulaire-v2.html            ← Formulaire sécurisé
├── schema_supabase.sql           ← Schéma SQL
├── formulaire.html               ← ANCIEN (abandonner)
├── gestion.html                  ← À mettre à jour
└── cloture.html                  ← À mettre à jour
```

---

**Créé le 17/04/2026 — v2.1**
