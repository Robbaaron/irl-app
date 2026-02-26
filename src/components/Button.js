import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, typography, radii, spacing, shadows } from "../theme";

export default function Button({
  title,
  onPress,
  variant = "primary",   // primary | secondary | ghost
  size = "md",            // sm | md | lg
  disabled = false,
  loading = false,
  style,
}) {
  const bg =
    variant === "primary" ? colors.accent :
    variant === "secondary" ? colors.bgSubtle :
    "transparent";

  const textColor =
    variant === "primary" ? colors.textInverse :
    variant === "secondary" ? colors.text :
    colors.accent;

  const borderStyle =
    variant === "ghost" ? { borderWidth: 1.5, borderColor: colors.accent } : {};

  const sizeStyles = {
    sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
    md: { paddingVertical: spacing.md - 2, paddingHorizontal: spacing.lg },
    lg: { paddingVertical: spacing.md + 2, paddingHorizontal: spacing.xl },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.base,
        { backgroundColor: bg, opacity: disabled ? 0.5 : 1 },
        borderStyle,
        sizeStyles[size],
        variant === "primary" && shadows.sm,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    ...typography.subheading,
  },
});
