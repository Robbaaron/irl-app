/**
 * IRL Color App — Design System
 * A warm, fashion-forward theme that lets the season palettes take center stage.
 */

export const colors = {
  // Core neutrals
  bg: "#FAFAF8",
  bgCard: "#FFFFFF",
  bgSubtle: "#F5F3EF",
  bgDark: "#1A1816",
  bgDarkCard: "#262320",

  // Text
  text: "#1A1816",
  textSecondary: "#6B6560",
  textTertiary: "#9E9890",
  textInverse: "#FAFAF8",

  // Accent
  accent: "#C8704A",       // warm terracotta — works across all seasons
  accentLight: "#E8A882",
  accentDark: "#8F4E30",

  // Semantic
  success: "#5A8C5A",
  warning: "#D4A03C",
  error: "#C4504A",
  info: "#5A7E9E",

  // Borders & dividers
  border: "#E8E4DE",
  borderLight: "#F0ECE6",
  divider: "#EBE7E1",

  // Shadow
  shadow: "rgba(26, 24, 22, 0.08)",
  shadowMedium: "rgba(26, 24, 22, 0.14)",

  // Season parent colors (for badges, headers)
  parentSpring: "#F2C94C",
  parentSummer: "#A7B8D4",
  parentAutumn: "#C67B39",
  parentWinter: "#5A6E8C",
};

export const parentSeasonColor = (parent) => {
  const map = {
    Spring: colors.parentSpring,
    Summer: colors.parentSummer,
    Autumn: colors.parentAutumn,
    Winter: colors.parentWinter,
  };
  return map[parent] || colors.accent;
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  // Display / Hero
  display: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  // Page titles
  title: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  // Section headers
  heading: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  // Subheadings
  subheading: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 20,
  },
  // Body text
  body: {
    fontSize: 16,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 22,
  },
  // Small body
  bodySmall: {
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 20,
  },
  // Captions
  caption: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.3,
    lineHeight: 16,
  },
  // Labels (all-caps)
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    lineHeight: 14,
  },
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
};
