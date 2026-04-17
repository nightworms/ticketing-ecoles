/**
 * Données des écoles — À EXTERNALISER EN PRODUCTION
 *
 * En production : charger dynamiquement depuis la table `ecoles` en BDD
 * Cette version est pour le développement local avec Supabase
 *
 * Migration vers BDD :
 * GET /api/ecoles/par-secteur?secteur=BELLEPIERRE
 */

const ECOLES_DATA = {
  'BELLEPIERRE': [
    { label: 'Prim. Application Bellepierre', nom: 'Application Bellepierre', adresse: '12 rue des Saphirs - Bellepierre - 97400 Saint-Denis', tel: '0262 21 05 88', mail: 'ce.9740583R@ac-reunion.fr' },
    { label: 'Él. Topazes', nom: 'Topazes', adresse: '133 bis allée des Topazes Bellepierre - 97400 Saint-Denis', tel: '0262 21 17 83', mail: 'ce.9740234L@ac-reunion.fr' },
    { label: 'Mat. Les Rubis', nom: 'Les Rubis', adresse: '45, allée des Rubis - Bellepierre - 97400 Saint-Denis', tel: '0262 21 10 37', mail: 'ce.9740630S@ac-reunion.fr' },
    { label: 'Mat. La Source', nom: 'La Source', adresse: '60 Bd de la Source - 97400 Saint-Denis', tel: '0262 21 34 12', mail: 'ce.9740689F@ac-reunion.fr' },
  ],
  'BOIS DE NÈFLES': [
    { label: 'Prim. Piton Bois de Nèfles', nom: 'Piton Bois de Nèfles', adresse: '173, route Piton Bois de Nèfles - 97490 Ste-Clotilde', tel: '0262 28 21 85', mail: 'ce.9740666F@ac-reunion.fr' },
    { label: 'Él. Bois de Nèfles', nom: 'Bois de Nèfles', adresse: '151, route des Ananas - 97490 Ste-Clotilde', tel: '0262 28 27 93', mail: 'ce.9740128W@ac-reunion.fr' },
    { label: 'Mat. Bois de Nèfles', nom: 'Bois de Nèfles', adresse: '132 Route des Ananas - 97490 Ste-Clotilde', tel: '0262 28 24 07', mail: 'ce.9740824C@ac-reunion.fr' },
    { label: 'Él. Les Bringelliers', nom: 'Les Bringelliers', adresse: '18, chemin des Bringelliers - 97490 Ste-Clotilde', tel: '0262 29 42 58', mail: 'ce.9740977U@ac-reunion.fr' },
    { label: 'Mat. Les Bringelliers', nom: 'Les Bringelliers', adresse: '18 bis, chemin des Bringelliers - 97490 Ste-Clotilde', tel: '0262 29 18 38', mail: 'ce.9740976T@ac-reunion.fr' },
  ],
  'BRETAGNE': [
    { label: 'Prim. Maxime Laope', nom: 'Maxime Laope', adresse: '2, chemin du Finistère - 97490 Ste-Clotilde', tel: '0262 52 52 36', mail: 'ce.9740491R@ac-reunion.fr' },
    { label: 'Prim. Philibert Commerson', nom: 'Philibert Commerson', adresse: '252, route Gabriel Macé - 97490 Ste-Clotilde', tel: '0262 52 52 24', mail: 'ce.9740117J@ac-reunion.fr' },
    { label: 'Él. Bory de Saint-Vincent', nom: 'Bory de Saint-Vincent', adresse: '4, chemin Bois Rouge - 97490 Ste-Clotilde', tel: '0262 52 52 47', mail: 'ce.9740212M@ac-reunion.fr' },
    { label: 'Prim. Grand Canal', nom: 'Grand Canal', adresse: '79, chemin Grand Canal - 97490 Ste-Clotilde', tel: '0262 52 52 69', mail: 'ce.9740631T@ac-reunion.fr' },
    { label: 'Mat. Aurore', nom: 'Aurore', adresse: '152, route Gabriel Macé - 97490 Ste-Clotilde', tel: '0262 52 56 97', mail: 'ce.9740864W@ac-reunion.fr' },
  ],
  'BRÛLÉ': [
    { label: 'Prim. Le Brûlé', nom: 'Le Brûlé', adresse: '11 chemin des Frangipaniers - Le Brûlé - 97400 Saint-Denis', tel: '0262 23 01 16', mail: 'ce.9740121N@ac-reunion.fr' },
  ],
  'CENTRE VILLE': [
    { label: 'Él. Application Léon Dierx', nom: 'Application Léon Dierx', adresse: '62, rue Ste-Marie - 97400 Saint-Denis', tel: '0262 21 09 14', mail: 'ce.9740241U@ac-reunion.fr' },
    { label: 'Prim. Ancien Théâtre', nom: 'Ancien Théâtre', adresse: '73, rue Alexis de Villeneuve - 97400 Saint-Denis', tel: '0262 21 32 82', mail: 'ce.9740120M@ac-reunion.fr' },
    { label: 'Él. Centrale', nom: 'Centrale', adresse: '121 bis, rue Jules Auber - 97400 Saint-Denis', tel: '0262 21 16 76', mail: 'ce.9741073Y@ac-reunion.fr' },
    { label: 'Mat. Centrale', nom: 'Centrale', adresse: '51, rue Sainte-Anne - 97400 Saint-Denis', tel: '0262 21 32 65', mail: 'ce.9740796X@ac-reunion.fr' },
    { label: 'Mat. Les Flamboyants', nom: 'Les Flamboyants', adresse: '157, rue Jules Auber - 97400 Saint-Denis', tel: '0262 21 13 82', mail: 'ce.9740629R@ac-reunion.fr' },
    { label: 'Mat. Gisèle Calmy', nom: 'Gisèle Calmy', adresse: '107 bis, rue Ste-Marie - 97400 Saint-Denis', tel: '0262 21 03 29', mail: 'ce.9740794V@ac-reunion.fr' },
    { label: 'Él. Joinville', nom: 'Joinville', adresse: '132, rue Jules Auber - 97400 Saint-Denis', tel: '0262 21 06 45', mail: 'ce.9740134C@ac-reunion.fr' },
  ],
  // ... (continuer avec les autres secteurs du fichier original)
  // Pour la version v2.1, j'inclus les principaux secteurs
  // Le fichier complet sera dans la migration PostgreSQL
};

const TYPES_PAR_CELLULE = {
  'Restauration scolaire': [
    'Demande concernant les appareils',
    'Demande de maintenance',
    'Demande de nettoyage',
    'Demande de maintenance du bâti cantine',
    'Diverse'
  ],
  'Informatique': [
    'Demande de maintenance informatique',
    'Problème de software',
    'Demande de maintenance téléphonique',
    'Souci de reprographie',
    'Problème de connexion divers',
    'Diverse'
  ],
  'Mobilier': [
    'Demande de mobilier supplémentaire',
    'Demande de remplacement de mobilier usagé',
    "Demande d'évacuation de mobilier",
    'Demande diverse liée au mobilier',
    'Diverse'
  ],
  "Ventilateur / Brasseur d'air": [
    "Panne de ventilateur",
    "Panne de brasseur d'air",
    "Nouvelle demande d'installation",
    'Diverse'
  ],
  'Couture / Textile — Rideau / Clés': [
    'Demande de double de clé',
    'Demande de BIP',
    'Demande de rideau',
    'Diverse'
  ],
  'DTP': [
    "Demande d'intervention de maintenance",
    "Demande de travaux divers",
    "Demande d'intervention sur l'installation électrique",
    "Demande de maintenance de l'alarme anti-intrusion",
    'Diverse'
  ],
  'DSB': [
    "Demande d'étanchéité",
    "Demande de ravalement",
    "Demande de réfection de sanitaire",
    "Demande de réfection de sol souple",
    "Demande de réfection de sol synthétique",
    "Demande de création de salle de classe",
    "Demande d'aménagement",
    'Diverse'
  ],
  "Élagage / Abattage d'arbres": [
    'Demande de déplacement',
    'Demande de plantation',
    "Demande diverse par rapport à l'aménagement paysager",
    'Diverse'
  ],
  'ERP / Alarmes / Extincteurs': [
    "Demande de maintenance de l'alarme incendie",
    "Demande de maintenance des extracteurs",
    'Diverse'
  ],
  'Dératisation / Traitement 3D': [
    'Demande de dératisation',
    'Demande de désinsectisation',
    'Demande de dératisation et désinsectisation',
    "Demande d'intervention pour l'entretien des pièges",
    'Diverse'
  ]
};
