import { Pressable, View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import { Icon, IconName } from "./Icon";
import { Text } from "./Text";

type Option<T extends string> = { value: T; label: string; icon?: IconName };

/** Choix entre quelques options côte à côte (comme des onglets en pilule) */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  const { colors } = useTheme();
  return (
    <View className="flex-row gap-1 rounded-full p-1" style={{ borderWidth: 1, borderColor: colors.bordure }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            className={`min-h-10 flex-1 flex-row items-center justify-center gap-1.5 rounded-full ${active ? "bg-pastille" : "active:opacity-70"}`}
          >
            {o.icon && <Icon name={o.icon} size={14} tone={active ? "textePastille" : "texteSecondaire"} />}
            <Text weight="semi" tone={active ? "textePastille" : "texteSecondaire"} className="text-sm">
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
