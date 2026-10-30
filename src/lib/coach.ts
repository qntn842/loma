import { money, t } from "@/i18n";
import { netSavings } from "./calc";
import type { AppData, Profile } from "./types";

const tc = t.coach;

export type Message = { from: "coach" | "moi"; text: string; sos?: boolean };

const pickOne = <T,>(list: readonly T[]): T | undefined => list[Math.floor(Math.random() * list.length)];

/** Premiers messages : « Salut, [prénom] ! » puis l'invitation à écrire */
export function firstMessages(profile: Profile): Message[] {
  return [
    { from: "coach", text: tc.bonjour(profile.firstName) },
    { from: "coach", text: tc.question },
  ];
}

/** Mots-clés (sans accents) → sujet. Le premier sujet trouvé l'emporte. */
const topics: [keyof typeof tc.reponses, RegExp][] = [
  ["ecart", /craqu|rechut|j'ai fume|ai refume|une seule|ecart/],
  ["envie", /envie|pulsion|manque|clope|cigarette|fumer|tabac/],
  ["aide", /aide|medecin|patch|substitut|pharmac|39 89|3989|professionnel/],
  ["stress", /stress|angoiss|anxi|nerv|colere|enerv|deprim|triste|seul/],
  ["sommeil", /dormir|sommeil|insomn|nuit|fatigu/],
  ["poids", /poids|grossi|kilo|manger|faim|grignot/],
  ["motivation", /motiv|abandonn|courage|pourquoi|j'y arrive pas|dur/],
  ["question", /question|\?/],
];

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/’/g, "'");

/**
 * Réponse du coach à un message libre.
 * Pour l'instant : réponses préparées choisies selon les mots du message.
 * Plus tard, cette fonction appellera une IA (même entrée, même sortie).
 */
export function coachReply(text: string, profile: Profile, data: AppData): Message {
  const r = tc.reponses;
  const msg = normalize(text);
  const topic = topics.find(([, re]) => re.test(msg))?.[0];

  if (topic === "envie") return { from: "coach", text: r.envie, sos: true };
  if (topic === "motivation") {
    const argent = money(netSavings(data, Date.now()));
    const raison = pickOne(profile.reasons);
    return { from: "coach", text: raison ? r.motivation(raison.toLowerCase(), argent) : r.motivationSansRaison(argent) };
  }
  if (topic) return { from: "coach", text: r[topic] as string };
  return { from: "coach", text: pickOne(r.inconnu)! };
}
