import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, radii, spacing, shadows } from "../theme";

export default function Card({ title, children, style }) {
  return (
    <View style={[styles.card, shadows.md, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
});
