import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import ColorSwatch from "./ColorSwatch";
import { colors, typography, spacing } from "../theme";

export default function SwatchRow({
  hexColors = [],
  label,
  size = 32,
  onSwatchPress,
  selectedHex,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {hexColors.map((hex, i) => (
          <ColorSwatch
            key={`${hex}-${i}`}
            hex={hex}
            size={size}
            selected={selectedHex === hex}
            onPress={onSwatchPress ? () => onSwatchPress(hex) : undefined}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textTertiary,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
