import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { colors, typography, spacing, radii, shadows } from "../theme";
import { getHomeSeason, getAnalysisMode, getMakeupProduct, saveFavorite } from "../services/storage";
import { classifyColor, classifyMakeupColor, rankedSeasons, rankedMakeupSeasons, hexToRgb, rgbToHsl, safeHex } from "../utils/color-logic";
import VerdictPill from "../components/VerdictPill";
import ConfidenceBar from "../components/ConfidenceBar";
import Card from "../components/Card";
import ColorSwatch from "../components/ColorSwatch";

const PRESET_COLORS = [
  "#E8453A", "#F5A623", "#F8E71C", "#7ED321",
  "#4A90D9", "#9B59B6", "#E67E8C", "#8B572A",
  "#50E3C2", "#D0021B", "#F39C12", "#2ECC71",
];

export default function ColorCheckerScreen({ navigation }) {
  const [season, setSeason] = useState(null);
  const [hexInput, setHexInput] = useState("");
  const [mode, setMode] = useState("clothing");
  const [product, setProduct] = useState("lipstick");
  const [result, setResult] = useState(null);
  const [alternatives, setAlternatives] = useState([]);

  useEffect(() => {
    (async () => {
      const s = await getHomeSeason();
      const m = await getAnalysisMode();
      const p = await getMakeupProduct();
      setSeason(s);
      setMode(m);
      setProduct(p);
    })();
  }, []);

  const analyzeColor = (hex) => {
    if (!season) return;
    const safe = safeHex(hex);
    setHexInput(safe);

    let res;
    let ranked;
    if (mode === "makeup") {
      res = classifyMakeupColor(safe, season, product);
      const { r, g, b } = hexToRgb(safe);
      const { h, s, l } = rgbToHsl(r, g, b);
      ranked = rankedMakeupSeasons(h, s, l, product, { r, g, b });
    } else {
      res = classifyColor(safe, season);
      const { r, g, b } = hexToRgb(safe);
      const { h, s, l } = rgbToHsl(r, g, b);
      ranked = rankedSeasons(h, s, l);
    }

    // Confidence: lower score = better match
    const topScore = ranked[0]?.score ?? 0;
    const confidence = Math.max(0, Math.min(100, Math.round(100 - topScore * 2)));

    setResult({ ...res, hex: safe, confidence });
    setAlternatives(ranked.slice(0, 4).filter((r) => r.season !== season));
  };

  const handleSubmit = () => {
    if (hexInput.length >= 4) {
      analyzeColor(hexInput);
    }
  };

  const handleSave = async () => {
    if (result?.hex && season) {
      const key = mode === "makeup" ? `${season}::makeup::${product}` : `${season}::clothing`;
      await saveFavorite(key, result.hex);
    }
  };

  if (!season) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Set your season first to check colors.</Text>
        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => navigation.navigate("SeasonPicker")}
        >
          <Text style={styles.linkText}>Choose Your Season →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Color Checker</Text>
        <Text style={styles.subtitle}>
          Enter a hex code or tap a preset to see if it matches your {season} palette.
        </Text>

        {/* Mode toggle */}
        <View style={styles.modeRow}>
          {["clothing", "makeup"].map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
              onPress={() => setMode(m)}
            >
              <Text style={[styles.modeBtnText, mode === m && styles.modeBtnTextActive]}>
                {m === "clothing" ? "Clothing" : "Makeup"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Makeup product selector */}
        {mode === "makeup" && (
          <View style={styles.productRow}>
            {["lipstick", "blush", "eyeshadow", "foundation"].map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.productChip, product === p && styles.productChipActive]}
                onPress={() => setProduct(p)}
              >
                <Text style={[styles.productText, product === p && styles.productTextActive]}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Hex input */}
        <View style={styles.inputRow}>
          <View style={[styles.previewDot, { backgroundColor: hexInput.startsWith("#") ? hexInput : `#${hexInput}` }]} />
          <TextInput
            style={styles.hexInput}
            value={hexInput}
            onChangeText={setHexInput}
            placeholder="#F5A623"
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="characters"
            autoCorrect={false}
            onSubmitEditing={handleSubmit}
            returnKeyType="go"
          />
          <TouchableOpacity style={styles.goBtn} onPress={handleSubmit}>
            <Text style={styles.goBtnText}>Check</Text>
          </TouchableOpacity>
        </View>

        {/* Presets */}
        <View style={styles.presetsGrid}>
          {PRESET_COLORS.map((hex) => (
            <ColorSwatch
              key={hex}
              hex={hex}
              size={40}
              onPress={() => analyzeColor(hex)}
              selected={result?.hex === hex}
            />
          ))}
        </View>

        {/* Result */}
        {result && (
          <Card>
            <View style={styles.resultHeader}>
              <View style={[styles.resultSwatch, { backgroundColor: result.hex }]} />
              <View style={styles.resultInfo}>
                <Text style={styles.resultHex}>{result.hex.toUpperCase()}</Text>
                <VerdictPill match={result.match} close={result.close} />
              </View>
            </View>

            <ConfidenceBar value={result.confidence} />

            {result.suggestion && result.suggestion !== season && (
              <View style={styles.suggestionRow}>
                <Text style={styles.suggestionLabel}>Best match:</Text>
                <Text style={styles.suggestionSeason}>{result.suggestion}</Text>
              </View>
            )}

            {/* Alternatives */}
            {alternatives.length > 0 && (
              <View style={styles.altSection}>
                <Text style={styles.altLabel}>ALSO WORKS FOR</Text>
                <View style={styles.altChips}>
                  {alternatives.map((a) => (
                    <View key={a.season} style={styles.altChip}>
                      <Text style={styles.altChipText}>{a.season}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Save button */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Color</Text>
            </TouchableOpacity>
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
  linkBtn: { padding: spacing.sm },
  linkText: { ...typography.subheading, color: colors.accent },
  // Mode toggle
  modeRow: {
    flexDirection: "row",
    backgroundColor: colors.bgSubtle,
    borderRadius: radii.md,
    padding: 3,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: "center",
    borderRadius: radii.sm,
  },
  modeBtnActive: {
    backgroundColor: colors.bgCard,
    ...shadows.sm,
  },
  modeBtnText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  modeBtnTextActive: {
    color: colors.text,
    fontWeight: "600",
  },
  // Product chips
  productRow: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  productChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.bgSubtle,
  },
  productChipActive: {
    backgroundColor: colors.accent,
  },
  productText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  productTextActive: {
    color: colors.textInverse,
    fontWeight: "600",
  },
  // Input row
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  previewDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hexInput: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    ...typography.body,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    borderWidth: 1,
    borderColor: colors.border,
  },
  goBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
    borderRadius: radii.md,
  },
  goBtnText: {
    ...typography.subheading,
    color: colors.textInverse,
  },
  // Presets
  presetsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  // Result
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  resultSwatch: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    ...shadows.sm,
  },
  resultInfo: {
    flex: 1,
    gap: spacing.sm,
  },
  resultHex: {
    ...typography.heading,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    color: colors.text,
  },
  // Suggestion
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  suggestionLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  suggestionSeason: {
    ...typography.subheading,
    color: colors.accent,
  },
  // Alternatives
  altSection: {
    gap: spacing.sm,
  },
  altLabel: {
    ...typography.label,
    color: colors.textTertiary,
  },
  altChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  altChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.full,
    backgroundColor: colors.bgSubtle,
  },
  altChipText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  // Save
  saveBtn: {
    backgroundColor: colors.bgSubtle,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.md,
    alignItems: "center",
  },
  saveBtnText: {
    ...typography.subheading,
    color: colors.accent,
  },
});
