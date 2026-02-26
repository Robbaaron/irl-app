import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { radii, shadows } from "../theme";

/**
 * A single color swatch circle. Optionally pressable.
 */
export default function ColorSwatch({
  hex = "#000000",
  size = 36,
  onPress,
  selected = false,
  style,
}) {
  const Wrapper = onPress ? TouchableOpacity : View;
  const borderColor = selected ? "#1A1816" : "rgba(0,0,0,0.08)";

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.swatch,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: hex,
          borderColor,
          borderWidth: selected ? 2.5 : 1,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  swatch: {
    ...shadows.sm,
  },
});
