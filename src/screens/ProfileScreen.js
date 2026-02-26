import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { colors, typography, spacing, radii, shadows } from "../theme";
import { getHomeSeason, getLastFaceResult, getFavorites, clearAllData } from "../services/storage";
import SeasonBadge from "../components/SeasonBadge";
import Card from "../components/Card";

export default function ProfileScreen({ navigation }) {
  const [season, setSeason] = useState(null);
  const [faceResult, setFaceResult] = useState(null);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const s = await getHomeSeason();
        const fr = await getLastFaceResult();
        const favs = await getFavorites();
        setSeason(s);
        setFaceResult(fr);
        const count = Object.values(favs).reduce((sum, arr) => sum + arr.length, 0);
        setFavoriteCount(count);
      })();
    }, [])
  );

  const handleReset = () => {
    Alert.alert(
      "Reset All Data",
      "This will clear your season, saved colors, and face analysis results. This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            setSeason(null);
            setFaceResult(null);
            setFavoriteCount(0);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>

      {/* Current Season */}
      {season ? (
        <Card>
          <View style={styles.seasonRow}>
            <SeasonBadge season={season} size={60} showLabel={false} />
            <View style={styles.seasonInfo}>
              <Text style={styles.seasonName}>{season}</Text>
              {faceResult && (
                <Text style={styles.seasonSource}>
                  {faceResult.confidence ? `${faceResult.confidence}% confidence` : "Quiz result"}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.changeBtn}
            onPress={() => navigation.navigate("SeasonPicker")}
          >
            <Text style={styles.changeBtnText}>Change Season</Text>
          </TouchableOpacity>
        </Card>
      ) : (
        <Card>
          <Text style={styles.noSeason}>No season set yet.</Text>
          <TouchableOpacity
            style={styles.setupBtn}
            onPress={() => navigation.navigate("FaceAnalysis")}
          >
            <Text style={styles.setupBtnText}>Find Your Season</Text>
          </TouchableOpacity>
        </Card>
      )}

      {/* Stats */}
      <Card title="Your Data">
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Saved Colors</Text>
          <Text style={styles.statValue}>{favoriteCount}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Face Analyses</Text>
          <Text style={styles.statValue}>{faceResult ? 1 : 0}</Text>
        </View>
      </Card>

      {/* Quick Links */}
      <Card title="Explore">
        <MenuItem label="Season Guide" onPress={() => navigation.navigate("SeasonGuide")} />
        <MenuItem label="Color Checker" onPress={() => navigation.navigate("ColorChecker")} />
        <MenuItem label="Retake Analysis" onPress={() => navigation.navigate("FaceAnalysis")} />
      </Card>

      {/* About */}
      <Card title="About IRL Color">
        <Text style={styles.aboutText}>
          IRL Color helps you discover and shop your personal color season.
          Built with years of color theory expertise and powered by data-driven
          seasonal color analysis.
        </Text>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </Card>

      {/* Danger zone */}
      <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
        <Text style={styles.resetBtnText}>Reset All Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function MenuItem({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.6}>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuArrow}>→</Text>
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
    paddingBottom: spacing.xxl * 2,
    gap: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  // Season card
  seasonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  seasonInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  seasonName: {
    ...typography.heading,
    color: colors.text,
  },
  seasonSource: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  changeBtn: {
    alignSelf: "flex-start",
    paddingVertical: spacing.sm,
  },
  changeBtnText: {
    ...typography.bodySmall,
    color: colors.accent,
  },
  noSeason: {
    ...typography.body,
    color: colors.textSecondary,
  },
  setupBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.md,
    alignItems: "center",
  },
  setupBtnText: {
    ...typography.subheading,
    color: colors.textInverse,
  },
  // Stats
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  statLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  statValue: {
    ...typography.heading,
    color: colors.text,
  },
  // Menu
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  menuLabel: {
    ...typography.body,
    color: colors.text,
  },
  menuArrow: {
    ...typography.body,
    color: colors.textTertiary,
  },
  // About
  aboutText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  versionText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  // Reset
  resetBtn: {
    alignSelf: "center",
    paddingVertical: spacing.md,
  },
  resetBtnText: {
    ...typography.bodySmall,
    color: colors.error,
  },
});
