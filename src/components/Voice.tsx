import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
} from "expo-audio";
import { File, Paths } from "expo-file-system";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { t } from "@/i18n";
import { newId } from "@/lib/store";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { Text } from "./ui/Text";

/** Copie l'enregistrement (fichier temporaire) dans le dossier permanent de l'app */
function keepRecording(tempUri: string): string {
  const dest = new File(Paths.document, `voix-${newId()}.m4a`);
  new File(tempUri).copySync(dest);
  return dest.uri;
}

export function deleteRecording(uri: string | null | undefined) {
  if (!uri) return;
  try {
    const f = new File(uri);
    if (f.exists) f.delete();
  } catch {
    // fichier déjà supprimé : rien à faire
  }
}

/** Enregistre un message vocal. Donne l'adresse du fichier enregistré à `onChange`. */
export function VoiceRecorder({ uri, onChange }: { uri: string | null; onChange: (uri: string | null) => void }) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [recording, setRecording] = useState(false);
  const [denied, setDenied] = useState(false);

  const start = async () => {
    const perm = await requestRecordingPermissionsAsync();
    if (!perm.granted) {
      setDenied(true);
      return;
    }
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    setRecording(true);
  };

  const stop = async () => {
    await recorder.stop();
    setRecording(false);
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    if (recorder.uri) onChange(keepRecording(recorder.uri));
  };

  if (uri && !recording) {
    return (
      <View className="flex-row items-center gap-3">
        <View className="flex-1">
          <VoicePlayer uri={uri} />
        </View>
        <RoundButton icon="trash" onPress={() => onChange(null)} label={t.voix.supprimer} />
      </View>
    );
  }

  return (
    <View className="gap-2">
      <Button
        label={recording ? `${t.voix.enCours} ${t.voix.arreter}` : t.voix.enregistrer}
        icon={recording ? "square" : "mic"}
        variant={recording ? "sos" : "secondary"}
        onPress={recording ? stop : start}
      />
      {denied && (
        <Text tone="texteSecondaire" className="text-xs">
          {t.voix.refuse}
        </Text>
      )}
    </View>
  );
}

function RoundButton({ icon, onPress, label }: { icon: "trash"; onPress: () => void; label: string }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="h-[54px] w-[54px] items-center justify-center rounded-full active:opacity-70"
      style={{ borderWidth: 1, borderColor: colors.bordure }}
    >
      <Icon name={icon} size={18} tone="texteSecondaire" />
    </Pressable>
  );
}

/** Bouton lecture / pause d'un message vocal */
export function VoicePlayer({ uri, label = t.voix.ecouter }: { uri: string; label?: string }) {
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);

  const toggle = async () => {
    if (status.playing) {
      player.pause();
      return;
    }
    await setAudioModeAsync({ playsInSilentMode: true });
    if (status.didJustFinish || (status.duration > 0 && status.currentTime >= status.duration - 0.1)) {
      await player.seekTo(0);
    }
    player.play();
  };

  return <Button label={status.playing ? t.voix.pause : label} icon={status.playing ? "pause" : "play"} variant="secondary" onPress={toggle} />;
}
