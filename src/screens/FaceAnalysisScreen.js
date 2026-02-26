import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors, typography, spacing, radii, shadows } from "../theme";
import { SEASON_DESCRIPTIONS } from "../data/seasons";
import { setHomeSeason, saveLastFaceResult } from "../services/storage";
import {
  rgbToLab,
  classifyEyeColor,
  classifyUndertone,
  inferSeasonFromFace,
  averageColors,
} from "../utils/face-analysis";
import SeasonBadge from "../components/SeasonBadge";
import ConfidenceBar from "../components/ConfidenceBar";
import Card from "../components/Card";
import PixelBridge from "../components/PixelBridge";

export default function FaceAnalysisScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [details, setDetails] = useState(null);
  const [saving, setSaving] = useState(false);
  const pixelBridgeRef = useRef(null);

  // ─── Pick Image ────────────────────────────────────────────────────

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera access is required to take a selfie for color analysis."
      );
      return;
    }
    const picked = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
      base64: true,
    });
    if (!picked.canceled && picked.assets?.[0]) {
      setImageUri(picked.assets[0].uri);
      setImageBase64(picked.assets[0].base64);
      setResult(null);
      setDetails(null);
    }
  };

  const pickFromGallery = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Photo library access is required to select a photo for color analysis."
      );
      return;
    }
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
      base64: true,
    });
    if (!picked.canceled && picked.assets?.[0]) {
      setImageUri(picked.assets[0].uri);
      setImageBase64(picked.assets[0].base64);
      setResult(null);
      setDetails(null);
    }
  };

  // ─── Analyze ───────────────────────────────────────────────────────

  const runAnalysis = async () => {
    if (!imageBase64) return;
    setAnalyzing(true);

    try {
      const dataUrl = "data:image/jpeg;base64," + imageBase64;

      // Send to WebView pixel bridge for extraction
      const pixelData = await pixelBridgeRef.current.analyzeImage(dataUrl);

      // Process the extracted samples
      const { samples } = pixelData;

      // Average skin samples
      const skinSamples = ["forehead", "leftCheek", "rightCheek", "chin"]
        .map((k) => samples[k]?.rgb)
        .filter(Boolean);
      const skinAvg = averageColors(skinSamples);
      const skinLab = rgbToLab(skinAvg);

      // Average eye samples
      const eyeSamples = ["leftEye", "rightEye"]
        .map((k) => samples[k]?.rgb)
        .filter(Boolean);
      const eyeAvg = averageColors(eyeSamples);

      // Classify
      const eyeColor = classifyEyeColor(eyeAvg);
      const undertoneResult = classifyUndertone(skinLab);
      const seasonResult = inferSeasonFromFace({
        skinLab,
        undertone: undertoneResult.label,
        eyeColor,
      });

      setDetails({
        skinRgb: skinAvg,
        eyeRgb: eyeAvg,
        eyeColor,
        undertone: undertoneResult.label,
        warmIndex: undertoneResult.warmIndex,
        skinLab,
        samples,
      });

      setResult(seasonResult);
    } catch (err) {
      console.error("Analysis error:", err);
      Alert.alert(
        "Analysis Failed",
        "Could not analyze the photo. Please try again with a well-lit selfie facing the camera directly."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSetSeason = async () => {
    if (!result) return;
    setSaving(true);
    await setHomeSeason(result.subseason);
    await saveLastFaceResult({
      ...result,
      details: details
        ? { eyeColor: details.eyeColor, undertone: details.undertone }
        : null,
    });
    setSaving(false);
    navigation.navigate("Home");
  };

  const handleRetake = () => {
    setImageUri(null);
    setImageBase64(null);
    setResult(null);
    setDetails(null);
  };

  // Helper to convert rgb object to CSS string
  const rgbToCss = (rgb) => {
    if (!rgb) return "#888";
    return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
  };

  // ─── Intro Screen (no image selected yet) ──────────────────────────

  if (!imageUri) {
    return (
      <View style={styles.centeredContainer}>
        <PixelBridge ref={pixelBridgeRef} />

        <Text style={styles.introTitle}>Find Your Season</Text>
        <Text style={styles.introBody}>
          Take a selfie or upload a photo for color analysis. We'll sample your
          skin tone, eye color, and contrast levels to determine your season.
        </Text>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>For best results:</Text>
          <Text style={styles.tip}>
            ☀️ Natural daylight, no harsh shadows
          </Text>
          <Text style={styles.tip}>🚫 Remove makeup if possible</Text>
          <Text style={styles.tip}>📸 Face the camera straight on</Text>
          <Text style={styles.tip}>
            👤 Fill the frame with your face and neck
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={pickFromCamera}>
          <Text style={styles.primaryBtnText}>📸 Take a Selfie</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={pickFromGallery}
        >
          <Text style={styles.secondaryBtnText}>🖼️ Upload a Photo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Result Screen ────────────────────────────────────────────────

  if (result) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.resultContent}
      >
        <PixelBridge ref={pixelBridgeRef} />

        <Text style={styles.resultLabel}>YOUR COLOR SEASON</Text>

        <SeasonBadge season={result.subseason} size={100} />

        <Text style={styles.resultParent}>{result.parent} family</Text>
        <Text style={styles.resultDesc}>
          {SEASON_DESCRIPTIONS[result.subseason] || ""}
        </Text>

        {/* Analysis Details */}
        <Card title="Analysis Details">
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Skin Undertone</Text>
            <View style={styles.detailValueRow}>
              <View
                style={[
                  styles.detailDot,
                  { backgroundColor: rgbToCss(details?.skinRgb) },
                ]}
              />
              <Text style={styles.detailValue}>
                {details?.undertone || "—"}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Eye Color</Text>
            <View style={styles.detailValueRow}>
              <View
                style={[
                  styles.detailDot,
                  { backgroundColor: rgbToCss(details?.eyeRgb) },
                ]}
              />
              <Text style={styles.detailValue}>
                {details?.eyeColor || "—"}
              </Text>
            </View>
          </View>

          <ConfidenceBar value={result.confidence} label="Confidence" />

          {result.allScores && result.allScores.length > 1 && (
            <View style={styles.altSection}>
              <Text style={styles.altLabel}>ALSO CONSIDERED</Text>
              {result.allScores.slice(1, 4).map((s) => (
                <Text key={s.season} style={styles.altSeason}>
                  {s.season}
                </Text>
              ))}
            </View>
          )}
        </Card>

        {/* Photo thumbnail */}
        <View style={styles.photoRef}>
          <Image source={{ uri: imageUri }} style={styles.photoThumb} />
          <Text style={styles.photoCaption}>Analyzed photo</Text>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleSetSeason}>
          {saving ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text style={styles.primaryBtnText}>Set as My Season</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.ghostBtn} onPress={handleRetake}>
          <Text style={styles.ghostBtnText}>Retake Photo</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Photo Preview + Analyze Button ───────────────────────────────

  return (
    <View style={styles.centeredContainer}>
      <PixelBridge ref={pixelBridgeRef} />

      <Image source={{ uri: imageUri }} style={styles.previewImage} />

      <Text style={styles.previewHint}>
        Make sure your face is clearly visible and well-lit.
      </Text>

      {analyzing ? (
        <View style={styles.analyzingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.analyzingText}>Analyzing your colors...</Text>
          <Text style={styles.analyzingSubtext}>
            Sampling skin tone · eye color · contrast
          </Text>
        </View>
      ) : (
        <>
          <TouchableOpacity style={styles.primaryBtn} onPress={runAnalysis}>
            <Text style={styles.primaryBtnText}>Analyze My Colors</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ghostBtn} onPress={handleRetake}>
            <Text style={styles.ghostBtnText}>Choose Different Photo</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.lg,
  },
  // Intro
  introTitle: {
    ...typography.display,
    color: colors.text,
    textAlign: "center",
  },
  introBody: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: 300,
  },
  tipsCard: {
    backgroundColor: colors.bgSubtle,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    width: "100%",
    maxWidth: 300,
  },
  tipsTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tip: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  // Buttons
  primaryBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.lg,
    alignItems: "center",
    minWidth: 220,
    ...shadows.sm,
  },
  primaryBtnText: {
    ...typography.subheading,
    color: colors.textInverse,
  },
  secondaryBtn: {
    backgroundColor: colors.bgSubtle,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.lg,
    alignItems: "center",
    minWidth: 220,
  },
  secondaryBtnText: {
    ...typography.subheading,
    color: colors.text,
  },
  ghostBtn: {
    paddingVertical: spacing.sm,
  },
  ghostBtnText: {
    ...typography.bodySmall,
    color: colors.accent,
  },
  // Preview
  previewImage: {
    width: 260,
    height: 340,
    borderRadius: radii.lg,
    backgroundColor: colors.bgSubtle,
  },
  previewHint: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: "center",
    maxWidth: 260,
  },
  // Analyzing state
  analyzingContainer: {
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  analyzingText: {
    ...typography.heading,
    color: colors.text,
  },
  analyzingSubtext: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  // Result
  resultContent: {
    alignItems: "center",
    padding: spacing.xl,
    paddingBottom: spacing.xxl * 2,
    gap: spacing.lg,
  },
  resultLabel: {
    ...typography.label,
    color: colors.textTertiary,
  },
  resultParent: {
    ...typography.heading,
    color: colors.accent,
  },
  resultDesc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: 320,
  },
  // Details
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  detailLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  detailValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  detailDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  detailValue: {
    ...typography.subheading,
    color: colors.text,
  },
  altSection: {
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  altLabel: {
    ...typography.label,
    color: colors.textTertiary,
  },
  altSeason: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  // Photo reference
  photoRef: {
    alignItems: "center",
    gap: spacing.xs,
  },
  photoThumb: {
    width: 80,
    height: 100,
    borderRadius: radii.sm,
    backgroundColor: colors.bgSubtle,
  },
  photoCaption: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});