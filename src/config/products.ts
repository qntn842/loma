export type ProductId = "cigarettes" | "roule";

/** Ordre d'affichage */
export const productIds: ProductId[] = ["cigarettes", "roule"];

/** Icône de chaque produit */
export const productIcons = {
  cigarettes: "flag",
  roule: "pencil",
} as const;

/** Valeurs proposées par défaut (moyennes françaises approximatives) */
export const defaultConsumption = {
  cigarettes: { perDay: 15, packPrice: 13 },
  roule: { perDay: 15, pouchPrice: 18, perPouch: 50 },
};

export type Consumption = typeof defaultConsumption;

/** Nombre de cigarettes dans un paquet classique */
export const CIGARETTES_PER_PACK = 20;
