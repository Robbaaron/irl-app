import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { colors, typography, spacing, radii, shadows } from "../theme";
import { SEASON_DESCRIPTIONS, SEASON_GUIDE_COLORS, SEASON_NEUTRAL_SWATCHES, SEASON_BEST_METAL, HAIR_PARENT_BY_SEASON } from "../data/seasons";
import { getHomeSeason, getFavorites } from "../services/storage";
import SeasonBadge from "../components/SeasonBadge";
import SwatchRow from "../components/SwatchRow";
import Card from "../components/Card";

export default function HomeScreen({ navigation }) {
  const [season, setSeason] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const s = await getHomeSeason();
    const f = await getFavorites();
    setSeason(s);
    setFavorites(f);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // No season set — prompt onboarding
  if (!season) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Welcome to IRL Color</Text>
        <Text style={styles.emptyBody}>
          Let's discover your color season. You can take a quick face analysis or
          choose your season manually.
        </Text>
        <View style={styles.emptyActions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate("FaceAnalysis")}
          >
            <Text style={styles.primaryBtnText}>Analyze My Colors</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate("SeasonPicker")}
          >
            <Text style={styles.secondaryBtnText}>I Know My Season</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const description = SEASON_DESCRIPTIONS[season] || "";
  const guideColors = SEASON_GUIDE_COLORS[season] || [];
  const neutralColors = SEASON_NEUTRAL_SWATCHES[season] || [];
  const metal = SEASON_BEST_METAL[season];
  const favKey = `${season}::clothing`;
  const savedColors = favorites[favKey] || [];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <SeasonBadge season={season} size={90} showLabel={false} />
        <View style={styles.heroText}>
          <Text style={styles.heroSeason}>{season}</Text>
          <Text style={styles.heroDesc} numberOfLines={3}>
            {description}
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <ActionCard
          icon="🎨"
          label="Check a Color"
          onPress={() => navigation.navigate("ColorChecker")}
        />
        <ActionCard
          icon="📸"
          label="Face Analysis"
          onPress={() => navigation.navigate("FaceAnalysis")}
        />
        <ActionCard
          icon="📖"
          label="Season Guide"
          onPress={() => navigation.navigate("SeasonGuide")}
        />
      </View>

      {/* Your Palette */}
      <Card title="Your Palette">
        <SwatchRow hexColors={guideColors} size={36} label="BEST COLORS" />
        <SwatchRow hexColors={neutralColors} size={36} label="NEUTRALS" />
        {metal && (
          <View style={styles.metalRow}>
            <Text style={styles.metalLabel}>BEST METAL</Text>
            <View style={styles.metalDisplay}>
              <View style={[styles.metalSwatch, { backgroundColor: metal.hex }]} />
              <Text style={styles.metalName}>{metal.name}</Text>
            </View>
          </View>
        )}
      </Card>

      {/* Saved Colors */}
      {savedColors.length > 0 && (
        <Card title="Saved Colors">
          <SwatchRow hexColors={savedColors} size={40} />
        </Card>
      )}

      {/* Change Season */}
      <TouchableOpacity
        style={styles.changeSeasonBtn}
        onPress={() => navigation.navigate("SeasonPicker")}
      >
        <Text style={styles.changeSeasonText}>Change Season</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ActionCard({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={[styles.actionCard, shadows.sm]} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.lg,
  },
  emptyTitle: {
    ...typography.display,
    color: colors.text,
    textAlign: "center",
  },
  emptyBody: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: 300,
  },
  emptyActions: {
    gap: spacing.md,
    width: "100%",
    maxWidth: 280,
    marginTop: spacing.md,
  },
  primaryBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    alignItems: "center",
    ...shadows.sm,
  },
  primaryBtnText: {
    ...typography.subheading,
    color: colors.textInverse,
  },
  secondaryBtn: {
    backgroundColor: colors.bgSubtle,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    alignItems: "center",
  },
  secondaryBtnText: {
    ...typography.subheading,
    color: colors.text,
  },
  // Hero
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    paddingVertical: spacing.sm,
  },
  heroText: {
    flex: 1,
    gap: spacing.xs,
  },
  heroSeason: {
    ...typography.title,
    color: colors.text,
  },
  heroDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  // Quick actions
  actionsRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.sm,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionLabel: {
    ...typography.caption,
    color: colors.text,
    textAlign: "center",
  },
  // Metal
  metalRow: {
    gap: spacing.xs,
  },
  metalLabel: {
    ...typography.label,
    color: colors.textTertiary,
  },
  metalDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  metalSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  metalName: {
    ...typography.bodySmall,
    color: colors.text,
  },
  // Change season
  changeSeasonBtn: {
    alignSelf: "center",
    paddingVertical: spacing.sm,
  },
  changeSeasonText: {
    ...typography.bodySmall,
    color: colors.accent,
  },
});
