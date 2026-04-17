/**
 * Configuration de la plateforme de ticketing
 * ⚠️ FICHIER SENSIBLE : À protéger en production
 *
 * En production (serveur local) : utiliser des variables d'environnement
 * Exemple : process.env.SUPABASE_URL, process.env.SUPABASE_KEY
 */

// ===== SUPABASE (TEMPORAIRE - À remplacer par serveur local) =====
const CONFIG = {
  // À remplacer par votre serveur local après migration PostgreSQL
  API_URL: typeof window !== 'undefined' ?
    (window.location.hostname === 'localhost' ?
      'http://localhost:3000/api' :
      'https://votre-serveur-local/api')
    : process.env.API_URL,

  // Pour Supabase (temporaire)
  SUPABASE_URL: 'https://clakdvjcytmtubenprux.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsYWtkdmpjeXRtdHViZW5wcnV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNTI2MTYsImV4cCI6MjA4ODkyODYxNn0.JAL-tGXPjQCE-FAB2lFI2OZ8-QTEK7RDgs-B5aLTS-0',

  // EmailJS (configuration temporaire)
  EMAILJS_SERVICE_ID: 'service_e5dm8b8',
  EMAILJS_TEMPLATE_ID: 'template_43t771l',
  EMAILJS_PUBLIC_KEY: 'n924SWS9vsFmHbS7W',

  // URL de gestion (à mettre à jour après migration)
  GESTION_URL: typeof window !== 'undefined' ?
    (window.location.hostname === 'localhost' ?
      'http://localhost:8000/gestion.html' :
      'https://votre-domaine/gestion.html') :
    process.env.GESTION_URL,

  // Délai de reload des tickets (ms)
  RELOAD_INTERVAL: 60000, // 1 minute

  // Seuils
  DELAI_RETARD_JOURS: 7,     // Ticket en retard après X jours
  DELAI_ALERTE_URGENT: 3,    // Urgents alertés après X jours

  // Limite de pagination
  PAGE_SIZE: 50,

  // Rôles autorisés
  ROLES: {
    DIRECTION: 'direction',
    SECRETAIRE: 'secretaire',
    REFERENT: 'referent_cellule'
  }
};

// ===== COMPTES (À EXTERNALISER EN PRODUCTION) =====
// ⚠️ EN PRODUCTION : Ces mots de passe DOIVENT être hashés et stockés en BDD
// Jamais en dur dans le code frontend
const COMPTES = {
  'admin': {
    mdp: 'education2024', // ⚠️ À changer - TRÈS FAIBLE
    cellule: null,
    email: 'admin@mairie-saintdenis.fr',
    role: 'direction'
  },
  'secretaire': {
    mdp: 'secretaire2024',
    cellule: null,
    email: 'secretaire@mairie-saintdenis.fr',
    role: 'secretaire'
  },
  'restauration': {
    mdp: 'resto2024',
    cellule: 'Restauration scolaire',
    email: 'resto@mairie-saintdenis.fr',
    role: 'referent_cellule'
  },
  'informatique': {
    mdp: 'info2024',
    cellule: 'Informatique',
    email: 'info@mairie-saintdenis.fr',
    role: 'referent_cellule'
  },
  'mobilier': {
    mdp: 'mobil2024',
    cellule: 'Mobilier',
    email: 'mobil@mairie-saintdenis.fr',
    role: 'referent_cellule'
  },
  'ventilateur': {
    mdp: 'venti2024',
    cellule: "Ventilateur / Brasseur d'air",
    email: 'venti@mairie-saintdenis.fr',
    role: 'referent_cellule'
  },
  'couture': {
    mdp: 'couture2024',
    cellule: 'Couture / Textile — Rideau / Double des clés',
    email: 'couture@mairie-saintdenis.fr',
    role: 'referent_cellule'
  },
  'dtp': {
    mdp: 'dtp2024',
    cellule: 'DTP',
    email: 'dtp@mairie-saintdenis.fr',
    role: 'referent_cellule'
  },
  'dsb': {
    mdp: 'dsb2024',
    cellule: 'DSB',
    email: 'dsb@mairie-saintdenis.fr',
    role: 'referent_cellule'
  },
  'elagage': {
    mdp: 'elagage2024',
    cellule: "Élagage et abattage d'arbres",
    email: 'elagage@mairie-saintdenis.fr',
    role: 'referent_cellule'
  },
  'erp': {
    mdp: 'erp2024',
    cellule: 'ERP / Alarmes / Extincteurs',
    email: 'erp@mairie-saintdenis.fr',
    role: 'referent_cellule'
  },
  'deratisation': {
    mdp: 'derat2024',
    cellule: 'Dératisation et traitement 3D',
    email: 'derat@mairie-saintdenis.fr',
    role: 'referent_cellule'
  }
};

// ===== DONNÉES ÉCOLES (À EXTERNALISER EN PRODUCTION) =====
// À migrer dans une table `ecoles` en BDD pour mise à jour dynamique
const ECOLES_DATA = {
  'BELLEPIERRE': [
    {label:'Prim. Application Bellepierre',nom:'Application Bellepierre',adresse:'12 rue des Saphirs - Bellepierre - 97400 Saint-Denis',tel:'0262 21 05 88',mail:'ce.9740583R@ac-reunion.fr'},
    {label:'Él. Topazes',nom:'Topazes',adresse:'133 bis allée des Topazes Bellepierre - 97400 Saint-Denis',tel:'0262 21 17 83',mail:'ce.9740234L@ac-reunion.fr'},
    {label:'Mat. Les Rubis',nom:'Les Rubis',adresse:'45, allée des Rubis - Bellepierre - 97400 Saint-Denis',tel:'0262 21 10 37',mail:'ce.9740630S@ac-reunion.fr'},
    {label:'Mat. La Source',nom:'La Source',adresse:'60 Bd de la Source - 97400 Saint-Denis',tel:'0262 21 34 12',mail:'ce.9740689F@ac-reunion.fr'},
  ],
  // ... (autres secteurs - voir fichier original)
};

// ===== TYPES DE TRAVAUX (À EXTERNALISER) =====
const TYPES_PAR_CELLULE = {
  'Restauration scolaire':['Demande concernant les appareils','Demande de maintenance','Demande de nettoyage','Demande de maintenance du bâti cantine','Diverse'],
  'Informatique':['Demande de maintenance informatique','Problème de software','Demande de maintenance téléphonique','Souci de reprographie','Problème de connexion divers','Diverse'],
  // ... (autres - voir fichier original)
};

// Export pour Node.js (serveur)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, COMPTES, ECOLES_DATA, TYPES_PAR_CELLULE };
}
