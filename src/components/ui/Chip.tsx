import { Pressable } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import { Icon, IconName } from "./Icon";
import { Text } from "./Text";

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  disabled?: boolean;
};

/** Pastille sélectionnable (pilule en verre, menthe claire quand choisie) */
export function Chip({ label, selected, onPress, icon, disabled }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      className={`min-h-11 flex-row items-center gap-1.5 rounded-full px-4 ${disabled ? "opacity-40" : "active:opacity-80"}`}
      style={{
        backgroundColor: selected ? colors.pastille : colors.carte[1],
        borderWidth: 1,
        borderColor: selected ? colors.pastille : colors.bordure,
      }}
    >
      {icon && <Icon name={icon} size={14} tone={selected ? "textePastille" : "texteSecondaire"} />}
      <Text weight="semi" tone={selected ? "textePastille" : "texte"} className="text-sm">
        {label}
      </Text>
    </Pressable>
  );
}
