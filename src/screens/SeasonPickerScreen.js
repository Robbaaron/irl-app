import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { colors, typography, spacing, radii, shadows } from "../theme";
import { SEASONS_BY_PARENT, PARENT_SEASONS, SEASON_SWATCHES, SEASON_DESCRIPTIONS } from "../data/seasons";
import { getHomeSeason, setHomeSeason } from "../services/storage";
import { parentSeasonColor } from "../theme";
import SeasonBadge from "../components/SeasonBadge";

export default function SeasonPickerScreen({ navigation }) {
  const [current, setCurrent] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getHomeSeason().then((s) => {
      setCurrent(s);
      setSelected(s);
    });
  }, []);

  const handleSave = async () => {
    if (selected) {
      await setHomeSeason(selected);
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Choose Your Season</Text>
      <Text style={styles.subtitle}>
        Select the color season that best matches your natural coloring. Not sure?
        Try our face analysis.
      </Text>

      {PARENT_SEASONS.map((parent) => (
        <View key={parent} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.parentDot, { backgroundColor: parentSeasonColor(parent) }]} />
            <Text style={styles.sectionTitle}>{parent}</Text>
          </View>

          <View style={styles.grid}>
            {SEASONS_BY_PARENT[parent].map((season) => {
              const isSelected = selected === season;
              const swatches = SEASON_SWATCHES[season] || [];

              return (
                <TouchableOpacity
                  key={season}
                  style={[
                    styles.seasonCard,
                    shadows.sm,
                    isSelected && styles.seasonCardSelected,
                  ]}
                  onPress={() => setSelected(season)}
                  activeOpacity={0.7}
                >
                  {/* Mini swatch row */}
                  <View style={styles.miniSwatches}>
                    {swatches.slice(0, 5).map((hex, i) => (
                      <View
                        key={i}
                        style={[styles.miniSwatch, { backgroundColor: hex }]}
                      />
                    ))}
                  </View>
                  <Text
                    style={[styles.seasonName, isSelected && styles.seasonNameSelected]}
                    numberOfLines={1}
                  >
                    {season}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      {/* Selected season detail */}
      {selected && (
        <View style={styles.selectedDetail}>
          <SeasonBadge season={selected} size={70} />
          <Text style={styles.selectedDesc}>
            {SEASON_DESCRIPTIONS[selected] || ""}
          </Text>
        </View>
      )}

      {/* Save */}
      <TouchableOpacity
        style={[styles.saveBtn, !selected && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={!selected}
        activeOpacity={0.75}
      >
        <Text style={styles.saveBtnText}>
          {current === selected ? "Keep Season" : "Set as My Season"}
        </Text>
      </TouchableOpacity>

      {/* Face analysis CTA */}
      <TouchableOpacity
        style={styles.analyzeLink}
        onPress={() => navigation.navigate("FaceAnalysis")}
      >
        <Text style={styles.analyzeLinkText}>Not sure? Try face analysis →</Text>
      </TouchableOpacity>
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
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  // Section
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  parentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
  },
  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  seasonCard: {
    width: "48%",
    backgroundColor: colors.bgCard,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
  },
  seasonCardSelected: {
    borderColor: colors.accent,
    backgroundColor: "#FDF8F5",
  },
  miniSwatches: {
    flexDirection: "row",
    gap: 3,
  },
  miniSwatch: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.06)",
  },
  seasonName: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: "500",
  },
  seasonNameSelected: {
    color: colors.accent,
    fontWeight: "600",
  },
  // Selected detail
  selectedDetail: {
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  selectedDesc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: 320,
  },
  // Save
  saveBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    alignItems: "center",
    ...shadows.sm,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    ...typography.subheading,
    color: colors.textInverse,
  },
  // Analyze link
  analyzeLink: {
    alignSelf: "center",
    paddingVertical: spacing.sm,
  },
  analyzeLinkText: {
    ...typography.bodySmall,
    color: colors.accent,
  },
});
