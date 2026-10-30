// Les couleurs pointent vers des variables définies par src/theme/ThemeProvider.tsx
// à partir de src/theme/palettes.ts (le seul fichier qui contient des codes couleur).
// Le verre, les bordures et les lueurs (couleurs transparentes) passent par les composants.
const role = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    // Seules les couleurs du thème existent : impossible d'écrire une couleur en dur
    colors: {
      transparent: "transparent",
      fond: role("fond"),
      texte: role("texte"),
      "texte-secondaire": role("texte-secondaire"),
      accent: role("accent"),
      "accent-clair": role("accent-clair"),
      pastille: role("pastille"),
      "texte-pastille": role("texte-pastille"),
      "texte-sur-accent": role("texte-sur-accent"),
      sos: role("sos"),
      "texte-sur-sos": role("texte-sur-sos"),
      premium: role("premium"),
      "texte-sur-premium": role("texte-sur-premium"),
    },
  },
  // Police : gérée par le composant <Text> (src/components/ui/Text.tsx)
  plugins: [],
};
