import { AuthError } from "@supabase/supabase-js";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Appear } from "@/components/ui/Appear";
import { Button } from "@/components/ui/Button";
import { Glass } from "@/components/ui/Glass";
import { Icon } from "@/components/ui/Icon";
import { Screen, ScreenHeader } from "@/components/ui/Screen";
import { Segmented } from "@/components/ui/Segmented";
import { Label, Text } from "@/components/ui/Text";
import { TextField } from "@/components/ui/TextField";
import { t } from "@/i18n";
import { closeModal } from "@/lib/nav";
import { supabase, useSession } from "@/lib/supabase";

const tc = t.compte;

type Mode = "connexion" | "inscription";
type Message = { tone: "erreur" | "info"; text: string } | null;

const MIN_PASSWORD = 8;
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Traduit les erreurs de Supabase en phrases simples */
function errorText(e: AuthError): string {
  const errors: Record<string, string> = tc.erreurs.codes;
  return (e.code && errors[e.code]) || tc.erreurs.inconnue;
}

/** Compte facultatif : se connecter, créer un compte, mot de passe oublié, se déconnecter */
export default function Compte() {
  const { session, ready } = useSession();
  const [mode, setMode] = useState<Mode>("connexion");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  const cleanEmail = email.trim().toLowerCase();

  const submit = async () => {
    if (!supabase) return;
    if (!isEmail(cleanEmail)) return setMessage({ tone: "erreur", text: tc.erreurs.email });
    if (mode === "inscription" && password.length < MIN_PASSWORD)
      return setMessage({ tone: "erreur", text: tc.erreurs.motDePasseCourt(MIN_PASSWORD) });
    if (!password) return setMessage({ tone: "erreur", text: tc.erreurs.motDePasseVide });

    setLoading(true);
    setMessage(null);
    try {
      if (mode === "connexion") {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) setMessage({ tone: "erreur", text: errorText(error) });
      } else {
        const { data, error } = await supabase.auth.signUp({ email: cleanEmail, password });
        if (error) setMessage({ tone: "erreur", text: errorText(error) });
        // Email déjà utilisé : Supabase renvoie un compte sans identité au lieu d'une erreur
        else if (data.user && data.user.identities?.length === 0) setMessage({ tone: "erreur", text: tc.erreurs.codes.user_already_exists });
        // Confirmation par email activée : pas encore de session
        else if (!data.session) setMessage({ tone: "info", text: tc.verifieEmail(cleanEmail) });
      }
    } catch {
      setMessage({ tone: "erreur", text: tc.erreurs.reseau });
    }
    setLoading(false);
  };

  const forgot = async () => {
    if (!supabase) return;
    if (!isEmail(cleanEmail)) return setMessage({ tone: "erreur", text: tc.erreurs.emailOublie });
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
      setMessage(error ? { tone: "erreur", text: errorText(error) } : { tone: "info", text: tc.oublieEnvoye });
    } catch {
      setMessage({ tone: "erreur", text: tc.erreurs.reseau });
    }
    setLoading(false);
  };

  const signOut = async () => {
    if (!supabase) return;
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    setPassword("");
    setMessage(null);
  };

  return (
    <Screen>
      <ScreenHeader title={tc.titre} onClose={closeModal} icon="arrow-left" />

      {!ready ? null : session ? (
        // Connecté
        <Appear>
          <Glass className="gap-4">
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-pastille">
                <Icon name="user" size={20} tone="textePastille" />
              </View>
              <View className="flex-1 gap-0.5">
                <Label>{tc.connecte}</Label>
                <Text weight="semi" numberOfLines={1}>
                  {session.user.email}
                </Text>
              </View>
            </View>
            <Text tone="texteSecondaire" className="text-sm leading-5">
              {tc.connecteTexte}
            </Text>
            <Button label={tc.deconnexion} icon="log-out" variant="secondary" loading={loading} onPress={signOut} />
          </Glass>
        </Appear>
      ) : (
        // Formulaire
        <>
          <Text tone="texteSecondaire" className="text-sm leading-5">
            {tc.texte}
          </Text>
          <Segmented<Mode>
            value={mode}
            onChange={(m) => {
              setMode(m);
              setMessage(null);
            }}
            options={[
              { value: "connexion", label: tc.connexion },
              { value: "inscription", label: tc.inscription },
            ]}
          />
          <Appear>
            <Glass className="gap-4">
              <TextField
                label={tc.email}
                value={email}
                onChangeText={setEmail}
                placeholder={tc.emailPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
              />
              <TextField
                label={tc.motDePasse}
                value={password}
                onChangeText={setPassword}
                placeholder={mode === "inscription" ? tc.motDePasseAide(MIN_PASSWORD) : tc.motDePassePlaceholder}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete={mode === "inscription" ? "new-password" : "current-password"}
                textContentType={mode === "inscription" ? "newPassword" : "password"}
                onSubmitEditing={submit}
              />

              {message && (
                <Animated.View entering={FadeIn}>
                  <Text tone={message.tone === "erreur" ? "sos" : "accentClair"} weight="medium" className="text-sm leading-5">
                    {message.text}
                  </Text>
                </Animated.View>
              )}

              <Button
                label={mode === "connexion" ? tc.boutonConnexion : tc.boutonInscription}
                loading={loading}
                disabled={!supabase}
                onPress={submit}
              />
              {mode === "connexion" && supabase && (
                <Pressable onPress={forgot} accessibilityRole="link" className="min-h-11 items-center justify-center active:opacity-60">
                  <Text tone="texteSecondaire" className="text-sm underline">
                    {tc.oublie}
                  </Text>
                </Pressable>
              )}
            </Glass>
          </Appear>

          {/* Pas encore de serveur branché (clés absentes du fichier .env) */}
          {!supabase && (
            <Text tone="texteSecondaire" className="text-center text-xs">
              {tc.pasActive}
            </Text>
          )}
        </>
      )}
    </Screen>
  );
}
