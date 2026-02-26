import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, radii, spacing } from "../theme";

/**
 * Horizontal confidence bar with label.
 */
export default function ConfidenceBar({ value = 0, label = "Confidence" }) {
  const barColor =
    value >= 80 ? colors.success :
    value >= 60 ? colors.warning :
    colors.error;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color: barColor }]}>{value}%</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[styles.fill, { width: `${Math.min(value, 100)}%`, backgroundColor: barColor }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  value: {
    ...typography.subheading,
  },
  track: {
    height: 6,
    backgroundColor: colors.bgSubtle,
    borderRadius: radii.full,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: radii.full,
  },
});
