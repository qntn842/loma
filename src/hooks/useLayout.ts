import { useWindowDimensions } from "react-native";

/** Largeur maximale du contenu (sur tablette, le contenu reste centré comme un `max-w-xl mx-auto`) */
export const MAX_CONTENT_WIDTH = 600;
/** Largeur d'écran de référence des maquettes (iPhone 15) */
const BASE_WIDTH = 390;

/**
 * Mesures pour adapter l'écran au téléphone, comme des media queries sur le web.
 * - `contentWidth` : largeur utile de l'écran (marges comprises), plafonnée sur tablette
 * - `scale` : facteur à appliquer aux grandes tailles (badges, gros chiffres)
 */
export function useLayout() {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH);
  const scale = Math.max(0.82, Math.min(1.2, contentWidth / BASE_WIDTH));
  return { width, height, contentWidth, scale, compact: height < 700 };
}
