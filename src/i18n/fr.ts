// Tous les textes de l'app, en français et au tutoiement.
// Les textes qui dépendent d'une valeur sont des petites fonctions.

/** Temps pour rembourser : en heures jusqu'à 24 h, puis en jours (« une journée », « 2 jours »…) */
function remboursement(h: number) {
  if (h <= 24) return `${h} ${h > 1 ? "heures" : "heure"}`;
  const j = Math.max(1, Math.round(h / 24));
  return j === 1 ? "une journée" : `${j} jours`;
}

export const fr = {
  commun: {
    continuer: "Continuer",
    retour: "Retour",
    fermer: "Fermer",
    enregistrer: "Enregistrer",
    annuler: "Annuler",
    ok: "OK",
    ajouter: "Ajouter",
    bientot: "bientôt",
    premium: "Premium",
    debloquer: "Débloquer avec Premium",
    euros: "€",
  },

  unites: {
    j: "j",
    h: "h",
    min: "min",
    s: "s",
    jours: (n: number) => (n > 1 ? "jours" : "jour"),
    heures: (n: number) => (n > 1 ? "heures" : "heure"),
  },

  produits: {
    cigarettes: "Cigarettes",
    roule: "Tabac à rouler",
  },

  onboarding: {
    etape: (i: number, n: number) => `${i} / ${n}`,

    // Page de bienvenue, avant les questions
    intro: {
      accroche: "Ton premier jour sans fumer commence ici.",
    },

    accueil: {
      titre: "Ton argent grandit, ton souffle revient.",
      texte: "Quelques questions pour adapter l’app à toi. 2 minutes.",
      prenom: "Ton prénom",
      bouton: "Commencer",
    },

    produits: {
      titre: "Qu’est-ce que tu fumes ?",
      texte: "Cigarettes en paquet, roulées, ou les deux.",
    },

    conso: {
      titre: "Ta consommation",
      texte: "Une estimation honnête suffit. Elle sert à calculer ton argent économisé.",
      cigarettesParJour: "Cigarettes par jour",
      prixPaquet: "Prix du paquet de 20",
      rouleParJour: "Cigarettes roulées par jour",
      prixBlague: "Prix du paquet de tabac",
      cigarettesParBlague: "Cigarettes par paquet de tabac",
      parJour: (cout: string) => `Soit ${cout} par jour`,
    },

    arret: {
      titre: "Quand as-tu arrêté de fumer ?",
      texte:
        "Choisis le jour et l’heure de ta dernière cigarette. Si ce n’est pas encore fait, choisis la date où tu le feras.",
      date: "Choisir une date",
      heure: "Choisir une heure",
    },

    raisons: {
      titre: "Pourquoi tu arrêtes ?",
      texte: "On te les rappellera quand ce sera dur.",
      suggestions: [
        "Ma santé",
        "L’argent",
        "Mieux respirer",
        "Faire du sport",
        "Être libre",
        "Mon couple",
        "Sentir bon",
        "Retrouver le goût",
        "Ma peau",
      ],
      autre: "Une autre raison…",
      objectif: "Ton objectif d’épargne (facultatif)",
      objectifNom: "Ce que tu veux t’offrir",
      objectifNomExemple: "Ex. un week-end à la mer",
      objectifMontant: "Montant",
      aucunObjectif: "Aucun",
    },

    resultat: {
      titre: ["Tu vas économiser ", " par mois"] as const,
      soit: (an: string) => `soit ${an} par an`,
      recap: "Ton profil",
      produits: "Produits",
      arret: "Arrêt",
      parJour: "Par jour",
      objectif: "Objectif",
      coches: [
        "Un bouton SOS pour chaque envie, toujours gratuit",
        "Ce qui change dans ton corps, étape par étape",
        "Aucun compte, tout reste sur ton téléphone",
      ],
      bouton: "C’est parti",
    },
  },

  voix: {
    enregistrer: "Enregistrer",
    arreter: "Arrêter",
    ecouter: "Écouter",
    pause: "Pause",
    supprimer: "Supprimer",
    refuse: "Le micro n’est pas autorisé. Tu peux l’activer dans les réglages du téléphone.",
    enCours: "Enregistrement…",
  },

  premium: {
    titre: "Un abonnement qui se rembourse tout seul",
    texte: (mois: string, heures: number) =>
      `Toi, tu économises ${mois} par mois. Premium est remboursé en ${remboursement(heures)} sans fumer.`,
    avantages: [
      "Le récap de tes habitudes et de tes moments à risque",
      "Le journal complet, écrit et vocal",
      "Tous les mini-jeux SOS et le coach",
    ],
    formules: {
      annuel: "Annuel",
      mensuel: "Mensuel",
      vie: "À vie",
      plusRentable: "Le plus rentable",
      parMois: (p: string) => `soit ${p} / mois`,
      parAn: "/ an",
      parMoisCourt: "/ mois",
      uneFois: "une seule fois",
    },
    passer: "Passer à Premium",
    bientot: "Bientôt disponible",
    bientotTexte: "Le paiement arrive dans une prochaine version. Pour l’instant, profite de la version gratuite.",
    gratuit: "Continuer en gratuit",
    mention: "Annulable à tout moment, rappel avant la fin d’un essai.",
    badge: "Premium",
  },

  onglets: {
    aujourdhui: "Aujourd’hui",
    progres: "Progrès",
    sos: "SOS",
    coach: "Coach",
    trophees: "Trophées",
  },

  aujourdhui: {
    salut: "Salut",
    voirStatuts: (s: string) => `Ton statut : ${s}. Voir tous les niveaux`,
    badgeTitre: (nom: string) => `${nom} sans fumer`,
    partager: "Partager",
    partageEnRoute: (nom: string) => `En route vers ${nom}`,
    partageLigne: (temps: string, argent: string) => `${temps} sans fumer · ${argent} économisés`,
    partageMessage: (titre: string, ligne: string) => `${titre} — ${ligne}. Avec Loma.`,
    debloqueIlYa: (d: string) => `Débloqué il y a ${d}`,
    debloqueAujourdhui: "Débloqué aujourd’hui",
    prochain: (nom: string) => `prochain : ${nom}`,
    objectifAtteint: "Objectif atteint",
    dans: (d: string) => `Dans ${d}`,
    commenceDans: "Tu commences dans",
    commenceLe: (jour: string, heure: string) => `${jour} à ${heure}`,
    toutesEtapes: "Toutes les étapes sont atteintes",
    sansFumer: "Sans fumer",
    economise: "Économisé",
    defi: "Défi",
    infos: "Infos du jour",
    infosSousTitre: "Ton chemin aujourd’hui",
    garde: "gardés au lieu de fumer",
    evitees: "Cigarettes évitées",
    defiTexte: (faites: number, total: number) => `${faites} / ${total} réussies`,
    objectif: "Objectif d’épargne",
    objectifPct: (pct: number) => `${pct} % atteint`,
    sansObjectif: "Pas encore d’objectif",
    sansObjectifTexte: "Choisis ce que tu veux t’offrir.",
    journal: "Journal",
    journalTexte: "Note ton humeur et ce qui t’a donné envie",
  },

  // Médailles de palier : chiffre + unité courte (H, J, S, M, A) + petit libellé
  badges: {
    "24h": { valeur: "24", unite: "H", libelle: "heures" },
    "3j": { valeur: "3", unite: "J", libelle: "jours" },
    "1sem": { valeur: "1", unite: "S", libelle: "semaine" },
    "2sem": { valeur: "2", unite: "S", libelle: "semaines" },
    "1mois": { valeur: "1", unite: "M", libelle: "mois" },
    "3mois": { valeur: "3", unite: "M", libelle: "mois" },
    "6mois": { valeur: "6", unite: "M", libelle: "mois" },
    "1an": { valeur: "1", unite: "A", libelle: "an" },
  } as Record<string, { valeur: string; unite: string; libelle: string }>,

  progres: {
    titre: "Progrès",
    argent: "Argent économisé",
    argentNet: "Total net, écarts déduits",
    vues: { argent: "Argent", evitees: "Cigarettes évitées" },
    moisPrecedent: "Mois précédent",
    moisSuivant: "Mois suivant",
    totalArgent: (v: string) => `${v} économisés ce mois-ci`,
    totalEvitees: (n: number) => `${n} ${n > 1 || n < -1 ? "cigarettes évitées" : "cigarette évitée"} ce mois-ci`,
    corps: "Ce qui se passe dans ton corps",
    source: "Estimations générales · sources : OMS, Tabac Info Service, NHS, CDC",
    atteinte: "Atteinte",
    dans: (d: string) => `Dans ${d}`,
    jours: ["L", "M", "M", "J", "V", "S", "D"],
  },

  // Étapes générales de l'OMS. Les durées sont dans src/config/health.ts
  sante: {
    "20min": { duree: "20 minutes", texte: "Ton rythme cardiaque et ta tension artérielle baissent." },
    "12h": {
      duree: "12 heures",
      texte:
        "Le monoxyde de carbone dans ton sang a diminué de moitié dès 8 h et redevient normal. Tes cellules reçoivent à nouveau assez d’oxygène.",
    },
    "48h": {
      duree: "48 heures",
      texte: "Tes poumons commencent à évacuer le mucus et les résidus de fumée. Le goût et l’odorat s’améliorent.",
    },
    "72h": {
      duree: "72 heures",
      texte: "Respirer devient plus facile : les bronches se relâchent et tu as souvent plus d’énergie.",
    },
    "2sem": {
      duree: "2 semaines",
      texte: "Ta circulation s’améliore. Marcher et faire un effort deviennent plus faciles.",
    },
    "4sem": {
      duree: "4 semaines",
      texte: "Pour la plupart des gens, les symptômes de manque (irritabilité, sommeil agité, envies fortes) s’atténuent nettement.",
    },
    "1mois": { duree: "1 mois", texte: "La toux et l’essoufflement commencent à diminuer." },
    "3mois": {
      duree: "3 mois",
      texte: "Ta capacité respiratoire peut augmenter jusqu’à 10 %. La toux et les sifflements diminuent.",
    },
    "6mois": {
      duree: "6 mois",
      texte: "Les cils de tes bronches fonctionnent de mieux en mieux : le mucus est mieux évacué.",
    },
    "9mois": {
      duree: "9 mois",
      texte: "Tes poumons se défendent mieux : les infections respiratoires deviennent moins fréquentes.",
    },
    "1an": {
      duree: "1 an",
      texte: "Le risque de maladie coronarienne est environ deux fois plus faible que celui d’un fumeur.",
    },
    "2ans": { duree: "1 à 2 ans", texte: "Le risque d’infarctus a fortement baissé." },
    "5ans": {
      duree: "5 ans",
      texte: "Le risque de cancer de la bouche, de la gorge, de l’œsophage et de la vessie est divisé par deux.",
    },
    "5ansAvc": {
      duree: "5 à 15 ans",
      texte: "Le risque d’AVC se rapproche de celui d’un non-fumeur.",
    },
    "15ans": {
      duree: "15 ans",
      texte: "Le risque de maladie coronarienne rejoint celui d’un non-fumeur.",
    },
  } as Record<string, { duree: string; texte: string }>,

  journal: {
    titre: "Journal",
    saisie: "Comment ça va ?",
    humeurs: { bien: "Bien", cava: "Ça va", tendu: "Tendu", dur: "Dur" },
    declencheurs: "Ce qui t’a donné envie",
    nouveauDeclencheur: "Nouveau déclencheur",
    note: "Une note (facultatif)",
    notePlaceholder: "Ce que tu ressens, ce qui s’est passé…",
    noteLimite: (n: number) => `${n} caractères en gratuit, illimité avec Premium`,
    vocal: "Note vocale",
    enregistrer: "Enregistrer dans le journal",
    enregistre: "C’est noté",
    historique: "Tes dernières entrées",
    vide: "Rien pour l’instant. Ta première entrée t’attend juste au-dessus.",
    recap: "Récap de la semaine",
    recapVide: "Remplis ton journal et utilise le SOS : ton récap se construira tout seul.",
    habitude: {
      declencheur: (d: string) => `Ton déclencheur n°1 : ${d}`,
      moment: (m: string) => `Ton moment à risque : ${m}`,
      humeur: (h: string) => `Ton humeur la plus fréquente : ${h}`,
      envies: (n: number, avant: number) =>
        `${n} ${n > 1 ? "envies résistées" : "envie résistée"} cette semaine (${avant} la semaine d’avant)`,
      ecarts: (n: number) => (n === 0 ? "Aucun écart cette semaine" : `${n} ${n > 1 ? "écarts" : "écart"} cette semaine`),
    },
    moments: { matin: "le matin", midi: "le midi", aprem: "l’après-midi", soir: "le soir", nuit: "la nuit" },
    recapPremium: "Le reste de ton récap",
    coach: "Parler au coach",
    coachTexte: "Des conseils adaptés à ton moment et à ton profil.",
    supprimer: "Supprimer",
    ecart: (n: number) => `Écart · ${n}`,
  },

  declencheursParDefaut: ["Café", "Stress", "Après manger", "Alcool", "Ennui", "Pause au travail", "Amis", "Téléphone"],

  coach: {
    titre: "Coach",
    sousTitre: "Parle de tes envies, demande de l’aide quand c’est dur, pose tes questions.",
    mention: "Réponses préparées à l’avance pour l’instant. Pas un avis médical.",
    placeholder: "Écris ton message…",
    envoyer: "Envoyer",
    ecrit: "Le coach écrit…",
    bonjour: (p: string) => `Salut${p ? " " + p : ""}, comment se passe ta journée ?`,
    question: "Écris-moi ce que tu ressens, ou choisis un sujet.",
    suggestions: ["J’ai une grosse envie", "J’ai craqué", "Je suis stressé", "J’ai besoin de motivation", "Une question"],
    reponses: {
      envie:
        "Une envie dure quelques minutes, puis elle redescend. Ouvre le SOS et respire avec le cercle : inspire 4 s, retiens 4 s, expire 6 s. Je reste là.",
      ecart:
        "Un écart n’efface pas ton chemin. Note ce qui s’est passé (où, avec qui, quelle émotion) et repars tout de suite. Ta meilleure série est gardée.",
      stress:
        "Le stress donne l’impression qu’une cigarette va calmer. En réalité, c’est le manque qui stresse. Essaie 5 grandes respirations lentes, puis bouge un peu : marcher, s’étirer.",
      motivation: (raison: string, argent: string) => `Souviens-toi : ${raison}. Et tu as déjà mis ${argent} de côté.`,
      motivationSansRaison: (argent: string) => `Tu as déjà mis ${argent} de côté. Ce n’est que le début.`,
      sommeil:
        "Les troubles du sommeil sont fréquents les premières semaines, puis ça se calme. Évite le café après 14 h et les écrans juste avant de dormir.",
      poids:
        "Une petite prise de poids est possible, car l’appétit revient. Garde des encas simples sous la main (fruits, légumes, eau) et bouge un peu chaque jour.",
      aide:
        "Tu n’es pas seul. Tabac Info Service répond au 39 89 (gratuit). Un médecin ou un pharmacien peut aussi te parler des substituts nicotiniques.",
      question:
        "Pose-moi ta question : envies, sommeil, poids, stress, argent… Je réponds avec des conseils généraux. Pour ta santé, ton médecin ou le 39 89 restent les bons interlocuteurs.",
      inconnu: [
        "Je t’écoute. Raconte-moi ce qui se passe en ce moment : une envie, du stress, une question ?",
        "Merci de m’en parler. Si c’est une envie, le SOS peut t’aider tout de suite.",
      ],
    },
    ouvrirSos: "Ouvrir le SOS",
  },

  sos: {
    titre: "Ça va passer.",
    texte: "Une envie dure quelques minutes.",
    phases: { inspire: "Inspire", retiens: "Retiens", expire: "Expire" },
    demarrer: "Démarrer",
    respirer: "Respiration guidée",
    monMessage: "Mon message",
    miniJeu: "Mini-jeu",
    parlerCoach: "Parler au coach",
    aFaire: "À faire maintenant",
    idees: [
      "Bois un grand verre d’eau, lentement.",
      "Va marcher 5 minutes, même dans le couloir.",
      "Envoie un message à quelqu’un que tu aimes.",
      "Mâche un chewing-gum ou croque une pomme.",
      "Passe-toi de l’eau froide sur le visage.",
      "Fais 10 squats, là, maintenant.",
      "Brosse-toi les dents.",
      "Mets ta chanson préférée et écoute-la en entier.",
      "Change de pièce.",
      "Relis pourquoi tu as arrêté.",
    ],
    cout: (nom: string, prix: string) => `${nom} : ${prix}`,
    pctObjectif: (pct: string, objectif: string) => `soit ${pct} % de « ${objectif} »`,
    passee: "L’envie est passée",
    craque: "J’ai craqué",
    pasDeMessage: "Tu n’as pas encore de message. Tu peux en ajouter dans ton profil.",
    tesRaisons: "Tes raisons",
    victoire: {
      libelle: (n: number) => (n > 1 ? "envies" : "envie"),
      titre: "Bien joué !",
      texte: "Tu viens de résister à une envie. Chaque envie résistée rend la suivante plus faible.",
      compteur: (n: number) => `${n} ${n > 1 ? "envies résistées" : "envie résistée"}`,
      bouton: "Retour à ma journée",
    },
  },

  // Unité utilisée pour le coût d'un écart et le coût affiché dans le SOS
  uniteEcart: {
    cigarette: { un: "Une cigarette", nom: "cigarettes", singulier: "cigarette" },
    roulee: { un: "Une cigarette roulée", nom: "cigarettes", singulier: "cigarette" },
  },

  miniJeux: {
    titre: "Mini-jeux",
    texte: "Occupe tes mains et ta tête le temps que l’envie passe.",
    gratuit: "Gratuit",
    bulles: { nom: "Bulles", texte: "Éclate un maximum de bulles.", score: (n: number) => `${n} bulles` },
    paires: { nom: "Paires", texte: "Retrouve les paires d’icônes.", fini: (c: number) => `Fini en ${c} coups !` },
    ordre: {
      nom: "Dans l’ordre",
      texte: "Touche les nombres de 1 à 16 le plus vite possible.",
      fini: (s: string) => `Fini en ${s} s !`,
    },
    rejouer: "Rejouer",
  },

  craque: {
    titre: "Un écart n’efface pas ton chemin.",
    texte: "Ta meilleure série et ton argent économisé sont gardés. On repart ensemble.",
    meilleureSerie: "Meilleure série",
    argentGarde: "Argent gardé",
    combien: (nom: string) => `Combien de ${nom} ?`,
    causes: "Qu’est-ce qui s’est passé ?",
    causesListe: ["Stress", "Alcool", "Soirée", "Café", "Fatigue", "Dispute", "Ennui", "Envie trop forte"],
    repartir: "Je repars maintenant",
  },

  trophees: {
    titre: "Trophées",
    statut: "Ton statut",
    statuts: { recrue: "Recrue", survivant: "Survivant", guerrier: "Guerrier", champion: "Champion", maitre: "Maître", legende: "Légende" },
    max: "Tu as atteint le plus haut statut.",
    niveauAtteint: (nom: string) => `${nom} : déjà atteint`,
    niveauDans: (nom: string, reste: string) => `${nom} dans ${reste}`,
    etapes: "Étapes sans fumer",
    metaux: { bronze: "Bronze", argent: "Argent", or: "Or", platine: "Platine", diamant: "Diamant" },
    etapesNoms: {
      "24h": "24 h",
      "3j": "3 jours",
      "1sem": "1 semaine",
      "2sem": "2 semaines",
      "1mois": "1 mois",
      "3mois": "3 mois",
      "6mois": "6 mois",
      "1an": "1 an",
    } as Record<string, string>,
    dans: (d: string) => `dans ${d}`,
    tousLesBadges: "Tous les badges",
    defi: "Missions à accomplir",
    defiTexte: (faites: number, total: number) => `${faites} / ${total} réussies`,
  },

  missions: {
    titre: "Missions",
    reussies: "Missions réussies",
    texte: "Des objectifs à atteindre en jours, cigarettes évitées, argent, temps, envies résistées et journal.",
    prochaine: "Prochaine",
    reussie: "Réussie",
    tempsNote: "Temps récupéré : estimation de 5 minutes par cigarette évitée.",
    familles: {
      jours: "Jours sans fumer",
      cigarettes: "Cigarettes évitées",
      argent: "Argent économisé",
      temps: "Temps récupéré",
      envies: "Envies résistées",
      journal: "Journal et SOS",
    } as Record<string, string>,
    titres: {
      j1: "Le grand départ",
      j2: "Ça tient bon",
      j3: "Trois, c’est parti",
      j5: "Une main entière",
      j7: "Semaine gagnée",
      j10: "Double chiffre",
      j14: "Quinzaine tranquille",
      j21: "Habitude en route",
      j30: "Un mois complet",
      j45: "Sur la lancée",
      j60: "Deux mois de calme",
      j90: "Trimestre en or",
      j180: "Six mois de liberté",
      j365: "Une année libre",
      c5: "Premier cap",
      c10: "Dizaine évitée",
      c20: "Un paquet de moins",
      c50: "Cinquante, facile",
      c100: "Centurion",
      c200: "Dix paquets laissés",
      c500: "Demi-millier",
      c1000: "Le club des 1000",
      c2000: "Deux mille fois non",
      c5000: "Légende vivante",
      e10: "Un café offert",
      e25: "Une pizza gagnée",
      e50: "Resto du dimanche",
      e100: "Cent balles",
      e200: "Week-end en vue",
      e300: "Nouvelles baskets",
      e500: "Billet pour ailleurs",
      e1000: "Le cap des mille",
      e2000: "Voyage de rêve",
      e5000: "Gros projet",
      t1: "Une heure à toi",
      t5: "Une soirée libre",
      t12: "Une demi-journée",
      t24: "Journée complète",
      t50: "Deux jours de plus",
      t100: "Quatre jours rendus",
      v1: "Première victoire",
      v5: "Envie, passe ton chemin",
      v10: "Sang-froid",
      v25: "Mental d’acier",
      v50: "Imperturbable",
      v100: "Maître des envies",
      n1: "Premier mot",
      n7: "Carnet vivant",
      s1: "Premier réflexe SOS",
      s5: "Le bon réflexe",
    } as Record<string, string>,
    /** 2e ligne de la carte : le palier à atteindre */
    sousTitre: (famille: string, n: number, compte?: string) => {
      const nb = n.toLocaleString("fr-FR");
      const s = n > 1 ? "s" : "";
      switch (famille) {
        case "jours":
          return `${nb} jour${s} sans fumer`;
        case "cigarettes":
          return `${nb} cigarette${s} évitée${s}`;
        case "argent":
          return `${nb} € économisés`;
        case "temps":
          return `${nb} heure${s} récupérée${s}`;
        case "envies":
          return `${nb} envie${s} résistée${s}`;
        default:
          return compte === "sos" ? `SOS ouvert ${nb} fois` : `${nb} note${s} au journal`;
      }
    },
  },

  compte: {
    titre: "Mon compte",
    texte: "Un compte est facultatif : sans compte, tout continue de marcher et tes données restent sur ton téléphone.",
    connexion: "Se connecter",
    inscription: "Créer un compte",
    email: "Email",
    emailPlaceholder: "toi@exemple.fr",
    motDePasse: "Mot de passe",
    motDePassePlaceholder: "Ton mot de passe",
    motDePasseAide: (n: number) => `Au moins ${n} caractères`,
    boutonConnexion: "Se connecter",
    boutonInscription: "Créer mon compte",
    oublie: "Mot de passe oublié ?",
    oublieEnvoye: "Si un compte existe avec cet email, tu vas recevoir un lien pour choisir un nouveau mot de passe.",
    verifieEmail: (email: string) => `Presque fini : ouvre l’email envoyé à ${email} pour confirmer ton compte, puis connecte-toi.`,
    connecte: "Connecté",
    connecteTexte: "Tes données restent sur ton téléphone. La sauvegarde en ligne arrivera plus tard.",
    deconnexion: "Se déconnecter",
    pasActive: "La connexion n’est pas encore activée sur cette version de l’app.",
    erreurs: {
      email: "Cet email n’a pas l’air valide.",
      emailOublie: "Écris d’abord ton email au-dessus, puis appuie à nouveau sur « Mot de passe oublié ? ».",
      motDePasseVide: "Écris ton mot de passe.",
      motDePasseCourt: (n: number) => `Ton mot de passe doit faire au moins ${n} caractères.`,
      reseau: "Impossible de joindre le serveur. Vérifie ta connexion internet.",
      inconnue: "Quelque chose n’a pas marché. Réessaie dans un instant.",
      // Codes d'erreur renvoyés par Supabase
      codes: {
        invalid_credentials: "Email ou mot de passe incorrect.",
        user_already_exists: "Un compte existe déjà avec cet email. Connecte-toi.",
        email_exists: "Un compte existe déjà avec cet email. Connecte-toi.",
        email_not_confirmed: "Confirme d’abord ton compte avec le lien reçu par email.",
        weak_password: "Ce mot de passe est trop simple. Ajoute des lettres, des chiffres ou des symboles.",
        email_address_invalid: "Cet email n’a pas l’air valide.",
        over_email_send_rate_limit: "Trop d’emails envoyés. Attends quelques minutes avant de réessayer.",
        over_request_rate_limit: "Trop d’essais. Attends quelques minutes avant de réessayer.",
      },
    },
  },

  profil: {
    titre: "Profil",
    premiumTitre: "Passe à Premium",
    premiumTexte: (h: number) => `Remboursé en ${remboursement(h)} sans fumer.`,
    premiumActif: "Membre Premium",
    premiumActifTexte: "Merci pour ton soutien. Tout est débloqué.",
    moi: "Moi",
    prenom: "Mon prénom",
    raisons: "Mes raisons",
    objectif: "Objectif d’épargne",
    conso: "Ma consommation",
    reglages: "Réglages",
    theme: "Thème",
    themes: { sombre: "Sombre", clair: "Clair", auto: "Auto" },
    notifications: "Notifications",
    notificationsTexte: "Rappels et encouragements, bientôt disponibles.",
    exporter: "Sauvegarder mes données",
    exporterTexte: "Exporte un fichier avec toutes tes données.",
    connexion: "Se connecter",
    connexionTexte: "Facultatif · email et mot de passe",
    mention: "Outil de motivation, ne remplace pas un avis médical. Besoin d’aide : Tabac Info Service, 39 89.",
    appeler: "Appeler le 39 89",
    raisonsVide: "Aucune raison pour l’instant",
    dev: "Mode test (développement uniquement)",
    devPremium: "Simuler Premium",
    devReset: "Effacer toutes les données",
    devResetConfirm: "Tout effacer et recommencer l’onboarding ?",
  },
};

export type Fr = typeof fr;
