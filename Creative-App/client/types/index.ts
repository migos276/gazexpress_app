export type UserRole = "client" | "livreur" | "station" | "admin";

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  role: UserRole;
  adresse?: string;
  coordonnees_gps?: {
    latitude: number;
    longitude: number;
  };
  is_active: boolean;
  date_creation: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface Bouteille {
  id: number;
  nom_commercial: string;
  type: "6kg" | "12kg" | "15kg" | "autre";
  marque: string;
  prix: number;
  stock: number;
  description?: string;
  image?: string;
  code_produit?: string;
  station: number;
  station_nom: string;
  station_coordonnees?: {
    latitude: number;
    longitude: number;
  };
  disponible: boolean;
}

export interface Station {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  coordonnees_gps: {
    latitude: number;
    longitude: number;
  };
  horaires: string;
  is_active: boolean;
  logo?: string;
}

export interface Zone {
  id: number;
  nom: string;
  frais_livraison: number;
  delai_estime: string;
  is_active: boolean;
}

export interface Livreur {
  id: number;
  user: User;
  vehicule: string;
  immatriculation: string;
  zone: Zone;
  is_disponible: boolean;
  note_moyenne: number;
  nombre_livraisons: number;
}

export type OrderStatus = "en_attente" | "assignee" | "en_cours" | "livree" | "annulee";

export interface Commande {
  id: number;
  client: User;
  bouteille: Bouteille;
  quantite: number;
  prix_total: number;
  frais_livraison: number;
  montant_total: number;
  adresse_livraison: string;
  coordonnees_livraison?: {
    latitude: number;
    longitude: number;
  };
  statut: OrderStatus;
  livreur?: Livreur;
  station: Station;
  date_commande: string;
  date_livraison?: string;
  notes?: string;
}

export interface Paiement {
  id: number;
  commande: number;
  montant: number;
  methode: "mobile_money" | "carte" | "especes";
  statut: "en_attente" | "confirme" | "echoue" | "rembourse";
  reference: string;
  date_paiement: string;
}

export interface CartItem {
  bouteille: Bouteille;
  quantite: number;
}

export interface DashboardStats {
  total_clients: number;
  total_livreurs: number;
  total_stations: number;
  total_commandes: number;
  revenus_totaux: number;
  commandes_jour: number;
  commandes_semaine: number;
  commandes_mois: number;
}
