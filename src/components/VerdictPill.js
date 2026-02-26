import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, radii, spacing } from "../theme";

const VERDICT_STYLES = {
  match: { bg: "#E8F5E8", text: "#2D6B2D", label: "Great Match" },
  close: { bg: "#FFF3E0", text: "#8B6914", label: "Close Match" },
  miss: { bg: "#FDECEC", text: "#8B3A3A", label: "Not Your Season" },
};

export default function VerdictPill({ match, close }) {
  const type = match ? "match" : close ? "close" : "miss";
  const style = VERDICT_STYLES[type];

  return (
    <View style={[styles.pill, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.text }]}>{style.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    alignSelf: "flex-start",
  },
  text: {
    ...typography.subheading,
    fontSize: 13,
  },
});
