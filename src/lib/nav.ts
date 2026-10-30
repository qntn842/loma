import { router } from "expo-router";

/** Ferme un écran ouvert par-dessus (modal). S'il n'y a rien derrière, revient à l'accueil. */
export function closeModal() {
  if (router.canGoBack()) router.back();
  else router.replace("/");
}
