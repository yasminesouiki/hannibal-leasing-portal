export const TYPE_LABELS = {
  mission: "Ordre de mission",
  divers: "Frais divers",
};

export const STATUS_LABELS = {
  pending: "En attente",
  accepted: "Acceptée",
  rejected: "Rejetée",
};

export const MISSION_DETAIL_LABELS = {
  dateDebut: "Date de début",
  dateFin: "Date de fin",
  lieuDepart: "Lieu de départ",
  destination: "Destination",
  objetMission: "Objet de la mission",
  moyenTransport: "Moyen de transport",
  kmDepart: "Km départ",
  kmArrivee: "Km arrivée",
  fraisPeage: "Péage",
  fraisParking: "Parking",
  fraisCarburant: "Carburant",
  fraisRepas: "Repas",
  fraisHebergement: "Hébergement",
};

export const DIVERS_DETAIL_LABELS = {
  date: "Date",
  categorie: "Catégorie",
  description: "Description",
};

export const getDetailLabels = (type) =>
  type === "mission" ? MISSION_DETAIL_LABELS : DIVERS_DETAIL_LABELS;

export const OBJET_MISSION_OPTIONS = [
  "Visite client",
  "Expertise",
  "Recouvrement",
  "Livraison",
  "Autre",
];

export const MOYEN_TRANSPORT_OPTIONS = [
  "Véhicule personnel",
  "Véhicule société",
  "Transport commun",
];

export const CATEGORIE_DIVERS_OPTIONS = [
  "Fourniture",
  "Communication",
  "Représentation",
  "Autre",
];
