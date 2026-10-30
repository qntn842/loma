import { useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";

import { alpha } from "@/theme/color";
import { useTheme } from "@/theme/ThemeProvider";
import { fontFamily, Label, Text } from "./Text";

type Props = TextInputProps & { label?: string; help?: string };

/** Champ de saisie en verre un peu plus clair que le fond ; contour vert fin quand il est actif */
export function TextField({ label, help, style, multiline, onFocus, onBlur, ...rest }: Props) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View className="gap-2">
      {label && <Label>{label}</Label>}
      <TextInput
        placeholderTextColor={colors.texteSecondaire}
        multiline={multiline}
        className={multiline ? "min-h-24 rounded-3xl px-5 py-4" : "h-14 rounded-full px-5"}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          {
            fontFamily: fontFamily("medium"),
            fontSize: 16,
            color: colors.texte,
            borderWidth: 1,
            borderColor: focused ? alpha(colors.accent, 0.7) : alpha(colors.texte, 0.16),
            backgroundColor: alpha(colors.texte, 0.06),
          },
          multiline && { textAlignVertical: "top" },
          style,
        ]}
        {...rest}
      />
      {help && (
        <Text tone="texteSecondaire" className="text-xs">
          {help}
        </Text>
      )}
    </View>
  );
}
