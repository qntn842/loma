import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { dayKey } from "./store";
import type { AppData } from "./types";

/** Crée un fichier JSON avec toutes les données et ouvre le menu de partage (mail, Drive, Fichiers…) */
export async function exportData(data: AppData) {
  const file = new File(Paths.cache, `arret-tabac-${dayKey()}.json`);
  if (file.exists) file.delete();
  file.create();
  file.write(JSON.stringify({ exportéLe: new Date().toISOString(), ...data }, null, 2));
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, { mimeType: "application/json", UTI: "public.json" });
  }
}
