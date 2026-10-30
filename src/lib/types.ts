import type { Consumption, ProductId } from "@/config/products";

export type Profile = {
  firstName: string;
  products: ProductId[];
  consumption: Consumption;
  reasons: string[];
  voiceUri: string | null;
  /** Objectif d'épargne, facultatif : un nom vide = pas d'objectif */
  goal: { name: string; amount: number };
  quitDate: number; // timestamp (ms)
  createdAt?: number; // fin de l'onboarding (absent sur les profils créés avant son ajout)
};

export type Relapse = {
  id: string;
  date: number;
  count: number; // nombre de cigarettes
  cost: number; // euros déduits du total
  avoidedLost: number; // retiré du compteur « évitées »
  causes: string[];
};

export type Craving = { id: string; date: number };

/** Humeurs du journal. Aujourd'hui : bien → bien, moyen → cava, difficile → dur */
export type Mood = "bien" | "cava" | "tendu" | "dur";

export type JournalEntry = {
  id: string;
  date: number;
  mood: Mood;
  triggers: string[];
  note?: string;
  voiceUri?: string;
};

export type AppData = {
  profile: Profile | null;
  relapses: Relapse[];
  cravings: Craving[];
  journal: JournalEntry[];
  triggers: string[]; // pastilles de déclencheurs (personnalisables)
  premium: boolean; // démo : seulement activable en mode test
  notifications: boolean;
  /** Nombre de fois où le SOS a été ouvert (pour les missions) */
  sosOpens: number;
};
