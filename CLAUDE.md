# Projet : app mobile pour arrêter de fumer

Ce fichier remplace l'ancien CLAUDE.md et REFONTE.md. Il décrit l'app validée à partir des maquettes, avec le nouveau style « verre sombre + badges lumineux » (inspiré de l'app Opal, sans la copier).

## Le produit
App mobile (iPhone + Android) qui aide à arrêter la cigarette (en paquet ou roulée). Uniquement la cigarette : pas de vape, de puff, de cigarette électronique ni de THC.
Positionnement : « L'app qui se rembourse toute seule : tu vois ton argent grandir et tes poumons guérir. »
Langue : français, tutoiement. Tous les textes regroupés dans un fichier de traductions.

## Stack technique
- Expo (dernière version stable) + React Native + TypeScript
- Navigation : Expo Router (routes par fichiers)
- Style : NativeWind (classes Tailwind) branché sur le thème (voir Design)
- Dégradés : expo-linear-gradient. Flou : expo-blur. Illustrations et badges : react-native-svg. Animations : react-native-reanimated.
- Police : Plus Jakarta Sans (@expo-google-fonts/plus-jakarta-sans)
- Stockage : local sur le téléphone (AsyncStorage). Aucun compte obligatoire.
- Comptes : Supabase Auth (email + mot de passe), facultatif. Client dans src/lib/supabase.ts, clés EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_KEY dans .env.local (modèle : .env.example). Sans clés, l'écran s'affiche mais la connexion est désactivée. Projet Supabase dédié à StopTabac (ne pas utiliser le projet de l'app de factures).
- Plus tard, PAS maintenant : Supabase (amis, sauvegarde en ligne), RevenueCat (abonnements), API IA (coach)
- Tout doit tourner dans Expo Go pour les tests.

## Design

### Principe du style
Le style, c'est : fond presque noir, UNE lueur douce qui part du haut, des cartes en « verre » (dégradé teinté + contour très fin), de gros objets lumineux (les badges) comme héros de l'écran, des petits libellés gris en majuscules et des chiffres légers. Peu de couleurs, beaucoup d'espace. Ne pas ajouter d'autres couleurs que celles du tableau.

### Deux thèmes
Sombre par défaut (« Nuit et menthe »), clair au choix (« Air pur »). Réglage dans Profil : Sombre / Clair / Automatique, sauvegardé sur le téléphone.
Aucune couleur écrite en dur dans les écrans : tout passe par un fichier de thème avec des couleurs nommées par rôle.

| Rôle | Sombre · Nuit et menthe | Clair · Air pur |
|---|---|---|
| fond | #05080F | #F5F7FA |
| lueurFond (halo en haut de l'écran) | rgba(52,211,153,0.20) | aucune lueur |
| carte (verre) | dégradé 160° de rgba(52,211,153,0.20) à rgba(52,211,153,0.05) puis rgba(255,255,255,0.02) | #FFFFFF |
| bordure | rgba(255,255,255,0.10) | #E2E8F0 |
| reflet de carte | trait intérieur rgba(255,255,255,0.10) en haut | aucun |
| texte | #F1F5F9 | #0F172A |
| texteSecondaire | #94A3B8 | #64748B |
| accent (boutons, progrès) | #34D399 | #047857 |
| accentClair (chiffres mis en avant : argent) | #6EE7B7 | #047857 |
| pastille (statut, ex. « Survivant ») | fond #A7F3D0, texte #05080F | fond #D1FAE5, texte #065F46 |
| texteSurAccent | #05080F | #FFFFFF |
| sos | #F43F5E | #E11D48 |
| texteSurSos | #05080F | #FFFFFF |
| premium (badge) | #FBBF24 avec texte #05080F | idem |
| premiumTexte (prénom des membres Premium) | #FBBF24 | #B45309 (doré foncé, lisible sur blanc) |
| rondProfil (fond du rond Profil) | #CBD5E1 gris clair, initiale #05080F | #E2E8F0, initiale #0F172A |

Bouton principal en pilule (hauteur 54, rayon 999) : pastille menthe pleine #A7F3D0, texte #05080F, contour rgba(255,255,255,0.35), lueur verte douce dessous (accent à 35 %, flou 24, décalée de 8 px vers le bas). C'est lui qui attire l'œil. En clair : plein #047857, texte blanc.

### Typo et formes
- Plus Jakarta Sans. Gros chiffres en poids 600 (pas 800, c'est plus fin et plus pro). Titres 700.
- Libellés de statistiques : 11 px, majuscules, espacement de lettres 0,09 em, couleur texteSecondaire.
- Titres de section (sous-titres comme « Argent économisé », « Tous les badges », « Moi », « Réglages ») : 20 px, gras, couleur texte, comme « Infos du jour » ; toujours plus petits que le gros titre de page (30 px).
- Cartes très arrondies (24 à 28 px). Boutons en pilule. Cibles tactiles de 44 px minimum.
- Icônes en trait fin (1,8 px), une seule famille.

### Le composant Badge (le cœur du style)
Un badge de palier = hexagone aux coins arrondis dessiné en SVG (viewBox 200×210), composé de couches :
1. Hexagone extérieur (rayon 88) rempli d'un dégradé de bord : #ECFDF5 → #6EE7B7 → #14A38B → #0A4D4A.
2. Hexagone intérieur (rayon 78) rempli d'un dégradé radial (centre en haut à gauche) : #B8FBE0 → #34D399 → #0E8A78 → #06403F.
3. Voile irisé par-dessus : cyan #67E8F9 en haut à gauche, violet #A78BFA vers le bas, rose #F9A8D4 en coin, tous à faible opacité (0,3 à 0,55).
4. 6 facettes triangulaires du centre vers les sommets, alternées en blanc (opacité 0,03 à 0,20) et en sombre (0 à 0,16) pour l'effet pierre taillée.
5. Disque central sombre rgba(3,22,26,0.74), contour blanc 0,38. Dedans : le chiffre (poids 800, taille 44) et le libellé en petites majuscules (« SEMAINE », « JOURS », « MOIS »).
6. Reflet : ellipse blanche floue en haut à gauche (opacité 0,42) + 2 petites étincelles à 4 branches.
Propriétés : `valeur`, `libelle`, `etat` = débloqué | verrouillé | prochain, `taille`.
- Verrouillé : tout en gris-bleu (#64748B → #1E293B), pas d'irisé, pas de reflet, petit cadenas, chiffre #94A3B8.
- Débloqué : lueur verte autour (rgba(52,211,153,0.45), rayon 22) et lente flottaison de haut en bas (8 px, 5 s, en boucle).
Pour le thème clair : mêmes dégradés, mais la lueur est remplacée par une ombre grise douce.

### Les insignes de palier de temps (récompenses)
Les 8 paliers de temps sans fumer utilisent un insigne (src/components/Insignia.tsx, fourni par le développeur, à ne pas réécrire ; seule retouche demandée : les rayons du palier 1 an sont plus courts et s'estompent vers le bout, pour ne plus être coupés net au bord du dessin) : `<Insignia level={0..7} size={…} locked />`, level dans l'ordre 1 jour, 3 jours, 1 semaine, 2 semaines, 1 mois, 3 mois, 6 mois, 1 an. De plus en plus riche : bronze rond, bronze octogone, bouclier argent, blason argent à ailes, or avec ailes et étoiles, or avec laurier, diamant, diamant avec couronne et rayons. Dans l'app, les insignes sont toujours en couleur (on n'utilise pas locked) : pas encore débloqué = un peu estompé (opacité 0,7), sans halo, avec un petit cadenas rond sous le chiffre (GlowingInsignia). Polices Plus Jakarta Sans 700 et 800 chargées au démarrage.
L'hexagone (composant Badge) reste utilisé pour le reste (Premium, victoire SOS avant le premier palier).

### Animations
Apparition des cartes (fondu + légère montée), compteur qui défile, flottaison du badge, lueur qui respire (5 s), victoire SOS. Rester sobre.

## Navigation
Barre du bas SANS fond (icônes sur le fond de l'écran) : Aujourd'hui · Progrès · **SOS** (rond rose au centre, 62 px, qui dépasse, halo rose rgba(244,63,94,0.4), contour couleur du fond) · Trophées · Coach (Coach tout à droite).
Le Journal n'est plus un onglet : il s'ouvre depuis la carte « Journal » de l'accueil.
Icône active en texte, les autres en texteSecondaire. En-dessous des écrans, un dégradé vers le fond évite que le contenu touche la barre.
Le Profil s'ouvre depuis le rond avec l'initiale, en haut à droite de l'écran Aujourd'hui.
Première ouverture sans profil → onboarding, jamais d'écran vide.
Titres de page toujours centrés : gros titre des onglets (Progrès, Coach, Trophées) et titre des écrans ouverts par-dessus (Profil, Journal, Mon compte…), avec la flèche retour ou la croix sur le côté.

## Écrans

### 1. Onboarding (une question par écran, barre de progression fine « x / 6 »)
Pas de mention « Outil de motivation, pas un avis médical » dans l'onboarding (des mentions restent dans le Profil et le Coach).
Fond sombre avec la lueur en haut. Cartes en verre pour les choix, bouton principal en pilule en bas.
0. Page de bienvenue (avant les questions, sans barre de progression) : logo « Loma » au centre (image carrée aux coins arrondis assets/images/logo-loma.png, le mot remplit ~78 % du carré ; contour vert fin semi-transparent et halo vert rond derrière ; composant Logo), « Ton premier jour sans fumer commence ici. » (17 px, couleur texte à 90 %), bouton « Continuer » en bas, et dessous « Se connecter » (ouvre l'écran Mon compte, flèche retour vers la bienvenue).
1. Badge, titre « Ton argent grandit, ton souffle revient. » (27 px, semi-gras), sous-titre « Quelques questions pour adapter l'app à toi. 2 minutes. », champ prénom OBLIGATOIRE (« Commencer » reste grisé tant qu'il est vide), sans étiquette, texte d'exemple « Ton prénom ». Espaces : 24 px badge → titre, 12 px titre → sous-titre, 32 px avant le champ ; bouton en bas avec 24 px de marge. Champs de saisie (partout) : verre un peu plus clair que le fond, contour vert fin quand actif.
2. « Qu'est-ce que tu fumes ? » : cigarettes, tabac à rouler (choix multiple).
3. Consommation par jour et prix : cigarettes (nombre par jour + prix du paquet), tabac à rouler (nombre par jour + prix du paquet de tabac + cigarettes par paquet)
4. « Quand as-tu arrêté de fumer ? » : deux boutons séparés, « Choisir une date » et « Choisir une heure » (dernière cigarette, maintenant par défaut). Sous-titre : si ce n'est pas encore fait, choisir la date où on le fera : les dates futures sont donc permises, les compteurs restent à 0 jusque-là.
5. « Pourquoi tu arrêtes ? » (pastilles, raisons illimitées ; au moins une pour continuer) et objectif d'épargne FACULTATIF (carte « Ton objectif d'épargne (facultatif) » : champ nom + case du montant avec − / +, sans étiquette « Montant »). Sous-titre court « On te les rappellera quand ce sera dur. ». L'écran tient sur une page sans défiler, même sur un petit écran (iPhone SE, 667 px). Sans objectif : la carte de l'accueil affiche « Pas encore d'objectif » et ouvre l'écran pour en choisir un, la ligne « % de l'objectif » du SOS est masquée, le Profil et le récap affichent « Aucun ».
6. Résultat : « Tu vas économiser X € par mois, soit Y € par an » (calculé, X en accentClair), carte récap du profil en verre (produits, arrêt, par jour, objectif), 3 lignes cochées (SOS, étapes santé, pas de compte), bouton « C'est parti » → Premium

### 2. Premium (paywall de démonstration, aucun vrai paiement pour l'instant)
- Badge Premium doré en haut (même composant Badge, version dorée #FBBF24, lueur dorée).
- Titre « Un abonnement qui se rembourse tout seul », texte « Toi, tu économises X € par mois. Premium est remboursé en N heures sans fumer » (N calculé avec le prix du paquet et la consommation ; jusqu'à 24 h en heures, au-delà en jours arrondis : « une journée », « 2 jours »… Même texte sur la carte Premium du Profil)
- Liste des avantages : récap des habitudes et moments à risque, journal complet texte et vocal, tous les mini-jeux SOS et le coach
- 3 formules en cartes de verre : Annuel (mis en avant, contour accent, étiquette « Le plus rentable »), Mensuel 9,99 €, À vie. Prix annuel et à vie dans un fichier de config.
- « Passer à Premium » (affiche « Bientôt disponible »), « Continuer en gratuit », mention « Annulable à tout moment, rappel avant la fin d'un essai »

### 3. Aujourd'hui (accueil) — NOUVELLE MISE EN PAGE
De haut en bas :
- En-tête : date (petit, gris) + « Salut [prénom] » à gauche (« Salut, Jean » avec une virgule ; « Salut » seul sans prénom) ; au centre de l'écran la pastille de statut avec un petit éclair (ex. « Survivant »), cliquable : elle ouvre Trophées (statut actuel, tous les niveaux, barre vers le suivant) ; à droite le bouton partager puis le rond Profil. Bouton partager : rond en verre de 44 px (même taille que le rond Profil), fin contour couleur bordure (comme les cartes), icône boîte + flèche vers le haut, sans légende ; src/components/ShareBadge.tsx. Il partage une image carrée (insigne affiché dans le carrousel, « 1 semaine sans fumer » ou « En route vers 3 jours », « X sans fumer · Y € économisés », « Loma ») par le menu de partage du téléphone ; dans le navigateur, un texte à la place. Les côtés gauche et droit ont la même largeur pour que la pastille soit bien centrée (« Salut, [prénom] » en 20 px ; un prénom long rétrécit un peu, puis est coupé avec « … »).
- Carrousel de badges (hauteur ≈ 290) : l'insigne du dernier palier débloqué est grand au centre (place ≈ 220 px, dessiné 1,4 × plus grand car le dessin a beaucoup de marge transparente), avec un halo vert rond derrière (GlowingInsignia : la lueur intégrée à Insignia est coupée en carré, on la désactive avec glow={false}). Juste en dessous (à la place de l'ancien socle) : une barre de progression en direct vers cet insigne, temps sans fumer à gauche en accentClair (« 22 h 7 min »), objectif à droite (« 24 h ») ; pleine avec « Objectif atteint » si l'insigne est débloqué. À gauche le badge précédent, à droite le prochain (verrouillé), plus petits, flous (flou ≈ 2,6 px) et un peu transparents. On glisse pour naviguer.
- Si la date d'arrêt choisie est dans le futur : tout le bloc des médailles (carrousel, titre, points) est flouté et bloqué, avec par-dessus « Tu commences dans » + compte à rebours en direct (« 14 h 29 min ») + la date choisie en gris (« Mercredi 28 octobre à 06:49 »). Le flou disparaît tout seul à l'heure choisie. Sur Android, le carrousel est seulement estompé (flou trop coûteux).
- Sous le carrousel : titre du badge (« 1 semaine sans fumer ») au centre de l'écran. Puis sous-titre (« Débloqué il y a 5 jours · prochain : 2 semaines », ou « Dans 1 h 52 min » qui se met à jour en direct), puis 8 points de pagination (le point actif est allongé en accent). Toucher le badge ouvre le détail dans Trophées.
- Bandeau de 3 statistiques entre deux traits fins, séparées par des traits verticaux : SANS FUMER (« 12 j 04 h », défile) · ÉCONOMISÉ (« 132 € » en accentClair) · RÉSISTÉES (« 18 »).
- « Infos du jour » (titre + sous-titre gris) puis 4 petites cartes de verre en grille 2 × 2, toutes visibles d'un coup : économisé (« 132 € » en accentClair + « gardés au lieu de fumer ») · Défi (« Missions à accomplir », « x / 50 réussies », ouvre l'écran Missions) · objectif d'épargne avec barre · Journal (ouvre l'écran Journal, où on note l'humeur).
- L'accueil peut défiler si besoin ; les cartes en bas passent sous un dégradé vers le fond.

### 4. Progrès (de haut en bas)
- Argent économisé en gros chiffre léger + deux boutons « Argent » / « Cigarettes évitées » + calendrier du mois (du 1er au dernier jour, semaines du lundi au dimanche, flèches pour changer de mois : en arrière jusqu'au mois qui précède la création du compte (date enregistrée à la fin de l'onboarding), en avant sans limite). Chaque case : petit numéro du jour en haut à droite, valeur du jour en gros et en gras au centre, taille adaptée à la largeur de la case (argent sans le symbole €, ou cigarettes évitées). Case verte = positif, rose = un écart a coûté plus que la journée, neutre = avant l'arrêt ou à venir, jours des mois voisins grisés. En bas : total du mois. Tout gratuit. Les cigarettes fumées après une rechute sont déduites : total net, jamais remis à zéro.
- « Ce qui se passe dans ton corps » : 15 étapes générales (20 min, 12 h, 48 h, 72 h, 2 semaines, 4 semaines, 1 mois, 3 mois, 6 mois, 9 mois, 1 an, 1 à 2 ans, 5 ans, 5 à 15 ans, 15 ans ; les cases 1 / 3 / 6 / 9 mois étalent la fourchette « 1 à 9 mois » de l'OMS ; liste dans src/config/health.ts) en cartes de verre, coche quand atteinte, barre pour la suivante. Toutes les étapes sont gratuites. Mention « Estimations générales · sources : OMS, Tabac Info Service, NHS, CDC ». Uniquement des faits reconnus par ces sources, rien d'inventé.

### 5. Journal
- Saisie rapide en carte de verre : humeur (Bien / Ça va / Tendu / Dur), déclencheurs en pastilles personnalisables (+ Ajouter), note écrite ou vocale (complète en Premium)
- Récap de la semaine (Premium) : 1 habitude visible en gratuit, le reste flouté avec cadenas discret (pas d'icônes floutées partout)
- Écran ouvert depuis l'accueil (flèche retour), plus un onglet.

### 5 bis. Coach (onglet, à la place de Journal)
- Chat dédié à l'arrêt : la personne parle de ses envies / pulsions, demande de l'aide quand c'est dur, pose ses questions.
- Messages d'accueil : « Salut [prénom], comment se passe ta journée ? » puis « Écris-moi ce que tu ressens, ou choisis un sujet. » (plus de message selon le moment ni l'avancée), sujets proposés en pastilles, champ de saisie libre + bouton envoyer au-dessus de la barre (la barre se cache quand le clavier est ouvert).
- Pour l'instant : réponses préparées choisies selon les mots du message (src/lib/coach.ts, fonction coachReply). Une vraie IA remplacera cette fonction plus tard (nécessite un serveur pour cacher la clé d'API).
- Envie détectée → bouton « Ouvrir le SOS ». Mention « Pas un avis médical ». Premium.

### 6. Trophées
- En haut : statut actuel (Recrue › Survivant › Guerrier › Champion › Maître › Légende, petites flèches, atteints en accentClair, actuel en gras) + barre vers le suivant + petite phrase « Survivant dans 11 h 57 min ». Toucher un niveau ne change que cette phrase (même style, pas de surlignage, pas d'autre écran) : « Champion dans 29 j 12 h », ou « Recrue : déjà atteint ». Par défaut, le niveau suivant. Paliers : Recrue 0, Survivant 1 jour, Guerrier 7 jours, Champion 30 jours, Maître 6 mois (180 jours), Légende 1 an.
- Grille de tous les insignes (3 par ligne, la dernière ligne de 2 centrée ; les insignes à ailes sont dessinés juste assez petits pour que le bout des ailes reste dans la case : même petit espace entre tous) : 24 h, 3 j, 1 sem, 2 sem, 1 mois, 3 mois, 6 mois, 1 an. Débloqués = insigne en couleur avec halo et le nom de la matière ; à venir = insigne en couleur estompé avec cadenas et « dans X j ».
- Section « Défi » : carte « Missions à accomplir » avec barre et « x / 50 réussies », qui ouvre l'écran Missions. Ce n'est pas un défi entre amis.

### 6 bis. Missions (écran ouvert depuis la carte Défi de l'accueil ou de Trophées, flèche retour)
- 50 objectifs en 6 familles (liste dans src/config/missions.ts, titres et sous-titres dans fr.ts) : jours sans fumer (14, basés sur la meilleure série), cigarettes évitées (10), argent économisé (10, net), temps récupéré (6, estimation 5 min par cigarette évitée, mentionnée sous la section), envies résistées (6), journal et SOS (4 : notes au journal, nombre d'ouvertures du SOS).
- En haut : carte « Missions réussies x / 50 » + barre. Puis une section dépliable par famille : en-tête en verre (icône de la famille, nom, « x / n », petite barre, flèche qui pivote vers le bas une fois ouverte) qu'on touche pour ouvrir ou fermer la grille de 2 cartes de verre (fondu à l'ouverture). Au départ, seule la famille de la mission « Prochaine » est ouverte ; plusieurs sections peuvent être ouvertes en même temps.
- Carte : médaillon rond avec l'icône de la famille et un anneau de progression vert autour ; réussie = médaillon menthe lumineux + coche ronde en haut à droite ; la mission pas encore réussie la plus avancée a l'étiquette « PROCHAINE » et un contour accent ; les autres sont un peu estompées. Titre sur une ligne, palier en gris dessous.
- Inspiré d'une app de missions en grille (cartes, coche, « suivant », anneau), sans reprendre ses illustrations ni ses textes. Gratuit.

### 7. SOS (plein écran)
Fond sombre, lueur rose très douce au lieu de la verte.
- « Ça va passer. Une envie dure quelques minutes. »
- Cercle de respiration animé (inspire 4 s, retiens 4 s, expire 6 s) + minuteur de 5:00
- Bouton « Parler au coach » (ferme le SOS et ouvre l'onglet Coach), puis en dessous « Mon message » (le vocal ou la raison écrite) et « Mini-jeu » (1 gratuit)
- Carte de verre « À faire maintenant » (idées qui tournent) + coût de la cigarette et % de l'objectif
- « L'envie est passée » → écran de victoire (l'insigne du dernier palier de temps débloqué apparaît, ou le badge hexagonal avec le nombre d'envies avant 24 h ; +1 envie résistée). Lien discret « J'ai craqué ».
- Le SOS de base est toujours gratuit.

### 8. J'ai craqué
- « Un écart n'efface pas ton chemin. » Meilleure série et argent gardés.
- Nombre de cigarettes (− / +), causes en pastilles, « Je repars maintenant »
- Ton doux, aucune couleur d'alerte agressive. Les données servent au récap et aux futures alertes.

### 9. Profil
- Carte Premium en haut (accent). Pour un membre Premium, elle devient « Membre Premium » : contour doré, étoile dorée, titre en premiumTexte, « Merci pour ton soutien. Tout est débloqué. »
- Case « Se connecter » juste dessous (affiche l'email une fois connecté) → écran Mon compte : onglets Se connecter / Créer un compte, email, mot de passe (8 caractères min. à la création), « Mot de passe oublié ? », messages d'erreur en français ; connecté : email + « Se déconnecter ». Les données restent sur le téléphone (pas encore de sauvegarde en ligne).
- Moi : prénom (modifiable, obligatoire), raisons, objectif d'épargne, consommation (liste dans une carte de verre ; chaque ligne ouvre un petit écran de modification)
- Réglages : thème Sombre / Clair / Auto, notifications, sauvegarder mes données (export)
- Mention : « Outil de motivation, ne remplace pas un avis médical. Besoin d'aide : Tabac Info Service, 39 89. »

## Gratuit ou Premium
- Signes discrets pour les membres Premium : prénom de « Salut [prénom] » en doré (premiumTexte), rond Profil au contour doré avec une petite étoile dorée, carte « Membre Premium » dans Profil. Pas de doré ailleurs (la pastille de statut reste verte, barre, boutons, chiffres, médailles).
- Gratuit : profil, compteurs, argent total + calendrier du mois (argent / cigarettes évitées), chronologie santé complète, tous les badges de palier, SOS complet de base, journal rapide, 1 habitude du récap.
- Premium : journal complet, récap complet, mini-jeux supplémentaires, coach.
- Jamais d'icônes floutées partout. Ne jamais retirer plus tard une fonction gratuite.

## Règles
- Aucune promesse médicale (« t'aide à », « te motive »).
- Ne jamais montrer la cigarette de façon attirante.
- Minimum de données, tout reste sur le téléphone.
- Calculs d'argent honnêtes, basés sur les vraies données de l'utilisateur.
- Style inspiré d'Opal : on reprend l'ambiance (fond sombre, verre, objet lumineux), pas leurs visuels, leurs textes ni leurs formes d'œufs.

## Plus tard (ne pas faire maintenant)
Chat IA, alertes aux moments à risque, défis entre amis, widget, sauvegarde en ligne, vrais paiements.

## Ordre de construction (tout d'un coup, puis corrections étape par étape)
Construis TOUTE l'app en une seule fois en suivant cet ordre interne (pour que ça tienne ensemble), sans t'arrêter entre les étapes. Ensuite le développeur te demandera des corrections écran par écran. Si la tâche est trop longue, fais-la en plusieurs passes sans demander la permission, et finis par un résumé.
1. Thème (2 palettes, réglage, police, composants de base : fond avec lueur, carte de verre, bouton pilule, badge) + navigation à 5 onglets avec SOS central + redirection onboarding
2. Onboarding complet + écran résultat
3. Premium (démo)
4. Aujourd'hui (carrousel de badges + bandeau + infos du jour)
5. SOS + victoire + J'ai craqué
6. Progrès (argent, corps)
7. Journal
8. Trophées
9. Profil

À la fin : expliquer simplement ce qui a été fait, ce qui est factice (paiement, coach, partage), et comment tester sur le téléphone avec Expo Go. Le développeur vient du web (React / Next.js / Tailwind) : comparer les notions mobiles au web en une phrase. Ne pas ajouter de fonctionnalités non demandées.
