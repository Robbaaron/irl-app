import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Defs, Stop, Path, LinearGradient } from "react-native-svg";
import { SEASON_SWATCHES } from "../data/seasons";
import { colors, typography, radii, shadows, spacing } from "../theme";

/**
 * Circular badge showing the season's palette colors as pie slices,
 * with the season name displayed below.
 */
export default function SeasonBadge({ season, size = 80, showLabel = true }) {
  const swatches = SEASON_SWATCHES[season] || ["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888"];
  const count = swatches.length;
  const radius = size / 2;
  const cx = radius;
  const cy = radius;

  // Build pie slices as SVG arcs
  const slices = swatches.map((color, i) => {
    const startAngle = (i / count) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((i + 1) / count) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    const d = [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    return <Path key={i} d={d} fill={color} />;
  });

  return (
    <View style={styles.container}>
      <View style={[styles.badgeWrap, shadows.md, { width: size, height: size, borderRadius: size / 2 }]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices}
        </Svg>
      </View>
      {showLabel && <Text style={styles.label}>{season}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.sm,
  },
  badgeWrap: {
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.bgCard,
  },
  label: {
    ...typography.subheading,
    color: colors.text,
    textAlign: "center",
  },
});
