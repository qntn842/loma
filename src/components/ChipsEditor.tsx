import { useState } from "react";
import { View } from "react-native";

import { t } from "@/i18n";
import { Chip } from "./ui/Chip";
import { TextField } from "./ui/TextField";

type Props = {
  /** Toutes les pastilles proposées */
  options: string[];
  selected: string[];
  onToggle: (label: string) => void;
  /** Ajout d'une pastille personnalisée (elle est aussi sélectionnée) */
  onAdd: (label: string) => void;
  placeholder: string;
};

/** Pastilles sélectionnables + bouton « Ajouter » pour en créer une */
export function ChipsEditor({ options, selected, onToggle, onAdd, placeholder }: Props) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");

  const submit = () => {
    const label = text.trim();
    if (label) onAdd(label);
    setText("");
    setAdding(false);
  };

  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap gap-2">
        {options.map((o) => (
          <Chip key={o} label={o} selected={selected.includes(o)} onPress={() => onToggle(o)} />
        ))}
        {!adding && <Chip label={t.commun.ajouter} icon="plus" onPress={() => setAdding(true)} />}
      </View>
      {adding && (
        <TextField
          autoFocus
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          returnKeyType="done"
          onSubmitEditing={submit}
          onBlur={submit}
          maxLength={40}
        />
      )}
    </View>
  );
}
