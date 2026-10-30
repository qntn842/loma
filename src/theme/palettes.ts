// Le SEUL fichier de l'app qui contient des codes couleur.
// Les écrans utilisent des rôles (fond, carte, accent…), jamais des valeurs.

export type Palette = {
  fond: string;
  /** Halo en haut de l'écran (transparent = pas de lueur) */
  lueurFond: string;
  /** Halo rose de l'écran SOS */
  lueurSos: string;
  /** Carte en verre : dégradé 160° (une seule couleur répétée = carte pleine) */
  carte: [string, string, ...string[]];
  bordure: string;
  /** Trait de lumière en haut des cartes (transparent = aucun) */
  reflet: string;
  texte: string;
  texteSecondaire: string;
  accent: string;
  accentClair: string;
  pastille: string;
  textePastille: string;
  texteSurAccent: string;
  sos: string;
  texteSurSos: string;
  haloSos: string;
  premium: string;
  texteSurPremium: string;
  /** Texte doré sur le fond (prénom des membres Premium) */
  premiumTexte: string;
  /** Rond Profil (initiale) en haut de l'accueil */
  rondProfil: string;
  texteSurRondProfil: string;
  /** Bouton principal en pilule */
  bouton: [string, string, ...string[]];
  boutonBordure: string;
  boutonTexte: string;
  /** Bouton vert « doux » : un peu plus clair qu'une carte, moins fort que le bouton principal */
  boutonDoux: [string, string, ...string[]];
  /** Lueur verte (badges débloqués, bouton) ; en clair c'est une ombre grise */
  lueur: string;
};

export type ThemeName = "sombre" | "clair";

/** Sombre · Nuit et menthe (par défaut) */
const sombre: Palette = {
  fond: "#05080F",
  lueurFond: "rgba(52,211,153,0.20)",
  lueurSos: "rgba(244,63,94,0.16)",
  carte: ["rgba(52,211,153,0.20)", "rgba(52,211,153,0.05)", "rgba(255,255,255,0.02)"],
  bordure: "rgba(255,255,255,0.10)",
  reflet: "rgba(255,255,255,0.10)",
  texte: "#F1F5F9",
  texteSecondaire: "#94A3B8",
  accent: "#34D399",
  accentClair: "#6EE7B7",
  pastille: "#A7F3D0",
  textePastille: "#05080F",
  texteSurAccent: "#05080F",
  sos: "#F43F5E",
  texteSurSos: "#05080F",
  haloSos: "rgba(244,63,94,0.4)",
  premium: "#FBBF24",
  texteSurPremium: "#05080F",
  premiumTexte: "#FBBF24",
  rondProfil: "#CBD5E1",
  texteSurRondProfil: "#05080F",
  bouton: ["#A7F3D0", "#A7F3D0"],
  boutonBordure: "rgba(255,255,255,0.35)",
  boutonTexte: "#05080F",
  boutonDoux: ["rgba(26,56,48,0.95)", "rgba(44,98,80,0.92)"],
  lueur: "rgba(52,211,153,0.45)",
};

/** Clair · Air pur */
const clair: Palette = {
  fond: "#F5F7FA",
  lueurFond: "transparent",
  lueurSos: "transparent",
  carte: ["#FFFFFF", "#FFFFFF"],
  bordure: "#E2E8F0",
  reflet: "transparent",
  texte: "#0F172A",
  texteSecondaire: "#64748B",
  accent: "#047857",
  accentClair: "#047857",
  pastille: "#D1FAE5",
  textePastille: "#065F46",
  texteSurAccent: "#FFFFFF",
  sos: "#E11D48",
  texteSurSos: "#FFFFFF",
  haloSos: "rgba(225,29,72,0.25)",
  premium: "#FBBF24",
  texteSurPremium: "#05080F",
  premiumTexte: "#B45309",
  rondProfil: "#E2E8F0",
  texteSurRondProfil: "#0F172A",
  bouton: ["#047857", "#047857"],
  boutonBordure: "transparent",
  boutonTexte: "#FFFFFF",
  boutonDoux: ["#D1FAE5", "#D1FAE5"],
  lueur: "rgba(15,23,42,0.18)",
};

export const palettes: Record<ThemeName, Palette> = { sombre, clair };

/** Dégradés du composant Badge (identiques dans les deux thèmes) */
export const badgeColors = {
  menthe: {
    bord: ["#ECFDF5", "#6EE7B7", "#14A38B", "#0A4D4A"],
    centre: ["#B8FBE0", "#34D399", "#0E8A78", "#06403F"],
    lueur: "rgba(52,211,153,0.45)",
  },
  or: {
    bord: ["#FFFBEB", "#FCD34D", "#D97706", "#78350F"],
    centre: ["#FEF3C7", "#FBBF24", "#B45309", "#713F12"],
    lueur: "rgba(251,191,36,0.45)",
  },
  verrouille: {
    bord: ["#94A3B8", "#64748B", "#334155", "#1E293B"],
    centre: ["#64748B", "#475569", "#334155", "#1E293B"],
    lueur: "transparent",
  },
  irise: { cyan: "#67E8F9", violet: "#A78BFA", rose: "#F9A8D4" },
  disque: "rgba(3,22,26,0.74)",
  disqueContour: "rgba(255,255,255,0.38)",
  blanc: "#FFFFFF",
  sombre: "#000000",
  chiffre: "#FFFFFF",
  chiffreVerrouille: "#94A3B8",
};

export type Metal = "bronze" | "argent" | "or" | "platine" | "diamant";

/**
 * Dégradés des médailles (identiques dans les deux thèmes).
 * rim = tranche (clair → foncé), face = centre, ink = chiffre gravé, stripe = liseré du ruban.
 */
export const medalColors = {
  bronze: {
    rim: ["#F6C9A0", "#C7773F", "#8A4A22", "#5A2E12"],
    face: ["#F4C094", "#CD7F45", "#9A5528"],
    ink: "#6B3417",
    stripe: "#D99560",
    glow: "rgba(205,127,69,0.45)",
  },
  argent: {
    rim: ["#FFFFFF", "#D7DCE3", "#9AA3AF", "#5F6873"],
    face: ["#F8FAFC", "#CBD5E1", "#94A3B8"],
    ink: "#475569",
    stripe: "#E2E8F0",
    glow: "rgba(203,213,225,0.35)",
  },
  or: {
    rim: ["#FFF7D1", "#FBBF24", "#D97706", "#8A4B0C"],
    face: ["#FEF3C7", "#FBBF24", "#C2850C"],
    ink: "#7C4A03",
    stripe: "#FCD34D",
    glow: "rgba(251,191,36,0.45)",
  },
  platine: {
    rim: ["#FFFFFF", "#D6E2F7", "#93A9D6", "#4F6596"],
    face: ["#F7FAFF", "#C9D8F2", "#8FA5D3"],
    ink: "#34477A",
    stripe: "#B4C6EC",
    glow: "rgba(147,169,214,0.45)",
  },
  diamant: {
    rim: ["#E0FBFF", "#67E8F9", "#38BDF8", "#1D6FB8"],
    face: ["#E0F7FF", "#7DD3FC", "#2E8FD6"],
    ink: "#0C4A7A",
    stripe: "#7DD3FC",
    glow: "rgba(56,189,248,0.5)",
  },
  verrouille: {
    rim: ["#94A3B8", "#64748B", "#334155", "#1E293B"],
    face: ["#64748B", "#475569", "#334155"],
    ink: "#94A3B8",
    stripe: "#64748B",
    glow: "transparent",
  },
  ruban: ["#1B2550", "#2C3C7E"],
  rubanVerrouille: ["#1E293B", "#334155"],
  blanc: "#FFFFFF",
  sombre: "#000000",
};
