import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { colors, typography, spacing, radii, shadows } from "../theme";
import {
  SEASON_GUIDE_COLORS,
  SEASON_NEUTRAL_SWATCHES,
  SEASON_BEST_METAL,
  SEASON_DESCRIPTIONS,
  HAIR_PARENT_BY_SEASON,
  SEASON_HAIR_SWATCHES,
  SEASONS_BY_PARENT,
  PARENT_SEASONS,
} from "../data/seasons";
import { getHomeSeason } from "../services/storage";
import SeasonBadge from "../components/SeasonBadge";
import SwatchRow from "../components/SwatchRow";
import Card from "../components/Card";

export default function SeasonGuideScreen({ navigation }) {
  const [season, setSeason] = useState(null);
  const [browseSeason, setBrowseSeason] = useState(null);

  useEffect(() => {
    getHomeSeason().then((s) => {
      setSeason(s);
      setBrowseSeason(s);
    });
  }, []);

  const activeSeason = browseSeason || season || "Deep Winter";
  const description = SEASON_DESCRIPTIONS[activeSeason] || "";
  const guideColors = SEASON_GUIDE_COLORS[activeSeason] || [];
  const neutralColors = SEASON_NEUTRAL_SWATCHES[activeSeason] || [];
  const metal = SEASON_BEST_METAL[activeSeason];
  const hairParent = HAIR_PARENT_BY_SEASON[activeSeason] || "Winter";
  const hairSwatches = SEASON_HAIR_SWATCHES[hairParent] || [];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Season Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.seasonScroller}
      >
        {PARENT_SEASONS.map((parent) =>
          SEASONS_BY_PARENT[parent].map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.seasonTab,
                s === activeSeason && styles.seasonTabActive,
              ]}
              onPress={() => setBrowseSeason(s)}
            >
              <Text
                style={[
                  styles.seasonTabText,
                  s === activeSeason && styles.seasonTabTextActive,
                ]}
                numberOfLines={1}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Hero */}
      <View style={styles.hero}>
        <SeasonBadge season={activeSeason} size={80} />
        <Text style={styles.description}>{description}</Text>
      </View>

      {/* Best Colors */}
      <Card title="Best Colors">
        <SwatchRow hexColors={guideColors} size={40} label="YOUR PALETTE" />
      </Card>

      {/* Neutrals */}
      <Card title="Neutrals">
        <SwatchRow hexColors={neutralColors} size={40} />
        <Text style={styles.tip}>
          These are your best neutral tones for basics, bags, and shoes.
        </Text>
      </Card>

      {/* Best Metal */}
      {metal && (
        <Card title="Best Metal">
          <View style={styles.metalDisplay}>
            <View style={[styles.metalSwatch, { backgroundColor: metal.hex }]} />
            <View>
              <Text style={styles.metalName}>{metal.name}</Text>
              <Text style={styles.metalHex}>{metal.hex.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.tip}>
            This is your most harmonious jewelry metal. Look for this tone in
            rings, necklaces, and hardware on bags.
          </Text>
        </Card>
      )}

      {/* Hair Colors */}
      <Card title={`Hair Colors — ${hairParent}`}>
        <View style={styles.hairGrid}>
          {hairSwatches.map(({ name, hex }) => (
            <View key={name} style={styles.hairItem}>
              <View style={[styles.hairSwatch, { backgroundColor: hex }]} />
              <Text style={styles.hairName}>{name}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.tip}>
          These hair color families will harmonize naturally with your season.
        </Text>
      </Card>

      {/* Styling Tips */}
      <Card title="Styling Tips">
        <Text style={styles.tipBody}>
          When shopping, look at the overall color rather than small details.
          Hold items near your face in natural light to see if the color makes
          you look healthy and vibrant. Colors from your palette should make
          your skin glow, while mismatched colors may wash you out or create
          unwanted shadows.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
    gap: spacing.lg,
  },
  // Season tabs
  seasonScroller: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  seasonTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.bgSubtle,
  },
  seasonTabActive: {
    backgroundColor: colors.accent,
  },
  seasonTabText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  seasonTabTextActive: {
    color: colors.textInverse,
    fontWeight: "700",
  },
  // Hero
  hero: {
    alignItems: "center",
    gap: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: 340,
  },
  // Metal
  metalDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  metalSwatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    ...shadows.sm,
  },
  metalName: {
    ...typography.subheading,
    color: colors.text,
  },
  metalHex: {
    ...typography.caption,
    color: colors.textTertiary,
    fontFamily: "monospace",
  },
  // Hair
  hairGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  hairItem: {
    alignItems: "center",
    gap: spacing.xs,
    width: 72,
  },
  hairSwatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    ...shadows.sm,
  },
  hairName: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  // Tips
  tip: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    fontStyle: "italic",
  },
  tipBody: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
