import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { defaultConsumption, productIds } from "@/config/products";
import { t } from "@/i18n";
import { relapseUnit } from "./calc";
import type { AppData, JournalEntry, Mood, Profile } from "./types";

const STORAGE_KEY = "donnees-app";

const emptyData: AppData = {
  profile: null,
  relapses: [],
  cravings: [],
  journal: [],
  triggers: t.declencheursParDefaut,
  premium: false,
  notifications: false,
  sosOpens: 0,
};

type Store = {
  ready: boolean;
  data: AppData;
  /** Vrai juste après l'onboarding : l'écran Premium doit s'ouvrir une fois */
  paywallPending: boolean;
  clearPaywall: () => void;
  saveProfile: (p: Profile) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  addCraving: () => void;
  addSosOpen: () => void;
  addRelapse: (count: number, causes: string[]) => void;
  addJournal: (e: { mood: Mood; triggers?: string[]; note?: string; voiceUri?: string }) => void;
  removeJournal: (id: string) => void;
  setTriggers: (list: string[]) => void;
  setPremium: (v: boolean) => void;
  setNotifications: (v: boolean) => void;
  reset: () => void;
};

const StoreContext = createContext<Store | null>(null);

export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/** "2026-10-24" pour la date locale */
export function dayKey(date = new Date()): string {
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

/** Complète les données d'une ancienne version (nouveaux champs = valeurs par défaut) */
function migrate(saved: Partial<AppData>): AppData {
  const data = { ...emptyData, ...saved };
  if (data.profile) {
    const c = data.profile.consumption;
    // Les anciens profils pouvaient contenir la vape ou la puff : on ne garde que les cigarettes
    const products = data.profile.products.filter((p) => productIds.includes(p));
    data.profile = {
      ...data.profile,
      products: products.length ? products : ["cigarettes"],
      consumption: {
        cigarettes: { ...defaultConsumption.cigarettes, ...c?.cigarettes },
        roule: { ...defaultConsumption.roule, ...c?.roule },
      },
    };
  }
  return data;
}

// Comme un useState global (un peu comme un Context + localStorage sur le web),
// sauvegardé sur le téléphone à chaque changement.
export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<AppData>(emptyData);
  const [paywallPending, setPaywallPending] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setData(migrate(JSON.parse(raw)));
      })
      .finally(() => setReady(true));
  }, []);

  const update = useCallback((fn: (d: AppData) => AppData) => {
    setData((prev) => {
      const next = fn(prev);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const store: Store = {
    ready,
    data,
    paywallPending,
    clearPaywall: () => setPaywallPending(false),
    saveProfile: (profile) => {
      setPaywallPending(true);
      update((d) => ({ ...d, profile: { ...profile, createdAt: profile.createdAt ?? Date.now() } }));
    },
    updateProfile: (patch) =>
      update((d) => (d.profile ? { ...d, profile: { ...d.profile, ...patch } } : d)),
    addCraving: () =>
      update((d) => ({ ...d, cravings: [...d.cravings, { id: newId(), date: Date.now() }] })),
    addSosOpen: () => update((d) => ({ ...d, sosOpens: d.sosOpens + 1 })),
    addRelapse: (count, causes) =>
      update((d) => {
        if (!d.profile) return d;
        const unit = relapseUnit(d.profile);
        return {
          ...d,
          relapses: [
            ...d.relapses,
            {
              id: newId(),
              date: Date.now(),
              count,
              cost: count * unit.cost,
              avoidedLost: count * unit.avoidedPerUnit,
              causes,
            },
          ],
        };
      }),
    addJournal: (e) =>
      update((d) => ({
        ...d,
        journal: [{ id: newId(), date: Date.now(), triggers: [], ...e }, ...d.journal] as JournalEntry[],
      })),
    removeJournal: (id) => update((d) => ({ ...d, journal: d.journal.filter((e) => e.id !== id) })),
    setTriggers: (triggers) => update((d) => ({ ...d, triggers })),
    setPremium: (premium) => update((d) => ({ ...d, premium })),
    setNotifications: (notifications) => update((d) => ({ ...d, notifications })),
    reset: () => {
      setData(emptyData);
      AsyncStorage.removeItem(STORAGE_KEY);
    },
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore doit être utilisé dans <StoreProvider>");
  return ctx;
}

// Profil vide : n'est affiché que pendant la fraction de seconde
// où l'on efface les données et où l'app repart vers l'onboarding.
const placeholderProfile: Profile = {
  firstName: "",
  products: ["cigarettes"],
  consumption: defaultConsumption,
  reasons: [],
  voiceUri: null,
  goal: { name: "", amount: 1 },
  quitDate: 0,
};

/** Le profil, dans les écrans qui ne s'affichent qu'après l'onboarding */
export function useProfile(): Profile {
  const { data } = useStore();
  return data.profile ?? placeholderProfile;
}
