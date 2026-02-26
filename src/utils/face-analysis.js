/**
 * Face color analysis utilities.
 * Ported from the browser extension's popup.js face-analysis logic.
 * Adapted for React Native (no DOM, no canvas — works with raw pixel arrays).
 */

import { FACE_SEASON_PROFILES } from "../data/seasons";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// ─── Color Space Conversions ───────────────────────────────────────────

export const toHsl = ({ r, g, b }) => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return { h, s: s * 100, l: l * 100 };
};

const srgbToLinear = (v) => {
  const n = v / 255;
  return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
};

export const rgbToLab = (rgb) => {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);
  const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
  const y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  const z = 0.0193339 * r + 0.119192 * g + 0.9503041 * b;

  const xn = 0.95047;
  const yn = 1;
  const zn = 1.08883;
  const f = (t) =>
    t > 0.008856 ? t ** (1 / 3) : 7.787 * t + 16 / 116;
  const fx = f(x / xn);
  const fy = f(y / yn);
  const fz = f(z / zn);
  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
};

// ─── Pixel Helpers ─────────────────────────────────────────────────────

export const luminance = (rgb) =>
  0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;

export const averageColors = (colors) => {
  if (!colors.length) return { r: 0, g: 0, b: 0 };
  const totals = colors.reduce(
    (acc, c) => ({ r: acc.r + c.r, g: acc.g + c.g, b: acc.b + c.b }),
    { r: 0, g: 0, b: 0 }
  );
  return {
    r: Math.round(totals.r / colors.length),
    g: Math.round(totals.g / colors.length),
    b: Math.round(totals.b / colors.length),
  };
};

const quantile = (arr, q) => {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined)
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  return sorted[base];
};

/**
 * Extract pixels from a flat RGBA Uint8Array within a circular region.
 * @param {Uint8Array} data  - Flat RGBA pixel buffer
 * @param {number} width     - Image width
 * @param {number} height    - Image height
 * @param {number} cx        - Circle center x (in pixels)
 * @param {number} cy        - Circle center y (in pixels)
 * @param {number} radius    - Circle radius (in pixels)
 * @returns {{ r, g, b }[]}
 */
export const extractCirclePixels = (data, width, height, cx, cy, radius) => {
  const pixels = [];
  const r2 = radius * radius;
  const minX = Math.max(0, Math.floor(cx - radius));
  const maxX = Math.min(width - 1, Math.ceil(cx + radius));
  const minY = Math.max(0, Math.floor(cy - radius));
  const maxY = Math.min(height - 1, Math.ceil(cy + radius));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy > r2) continue;
      const idx = (y * width + x) * 4;
      pixels.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
    }
  }
  return pixels;
};

// ─── Skin & Eye Pixel Filters ──────────────────────────────────────────

export const filterSkinPixels = (pixels) =>
  pixels.filter((p) => {
    const hsl = toHsl(p);
    const isHueSkin = (hsl.h >= 8 && hsl.h <= 58) || (hsl.h >= 340 && hsl.h <= 360);
    return isHueSkin && hsl.s >= 8 && hsl.s <= 68 && hsl.l >= 18 && hsl.l <= 92;
  });

export const filterIrisPixels = (pixels) =>
  pixels.filter((p) => {
    const hsl = toHsl(p);
    return hsl.l >= 8 && hsl.l <= 72 && hsl.s >= 6;
  });

// ─── Robust Averaging with Trimming ────────────────────────────────────

export const robustAverage = (pixels, trimLow = 0.16, trimHigh = 0.84) => {
  if (!pixels.length) return { rgb: { r: 0, g: 0, b: 0 }, kept: 0, total: 0 };
  const lumas = pixels.map(luminance);
  const low = quantile(lumas, trimLow);
  const high = quantile(lumas, trimHigh);
  const trimmed = pixels.filter((p) => {
    const l = luminance(p);
    return l >= low && l <= high;
  });
  const kept = trimmed.length || pixels.length;
  const avg = averageColors(trimmed.length ? trimmed : pixels);
  return { rgb: avg, kept, total: pixels.length };
};

// ─── White Balance ─────────────────────────────────────────────────────

export const computeWhiteBalanceGains = (pixels) => {
  if (!pixels.length) return { r: 1, g: 1, b: 1 };
  const mids = pixels.filter((p) => {
    const l = luminance(p);
    return l > 45 && l < 210;
  });
  const set = mids.length >= 120 ? mids : pixels;
  const mean = averageColors(set);
  const gray = (mean.r + mean.g + mean.b) / 3;
  return {
    r: clamp(gray / Math.max(mean.r, 1), 0.82, 1.18),
    g: clamp(gray / Math.max(mean.g, 1), 0.82, 1.18),
    b: clamp(gray / Math.max(mean.b, 1), 0.82, 1.18),
  };
};

export const applyWhiteBalance = (rgb, gains) => ({
  r: clamp(Math.round(rgb.r * gains.r), 0, 255),
  g: clamp(Math.round(rgb.g * gains.g), 0, 255),
  b: clamp(Math.round(rgb.b * gains.b), 0, 255),
});

// ─── Sample a Region ───────────────────────────────────────────────────

export const sampleRegionColor = (data, width, height, cx, cy, radius, kind, gains) => {
  const raw = extractCirclePixels(data, width, height, cx, cy, radius).map((p) =>
    applyWhiteBalance(p, gains)
  );
  const filtered = kind === "skin" ? filterSkinPixels(raw) : filterIrisPixels(raw);
  const base = filtered.length >= 30 ? filtered : raw;
  const trimLow = kind === "skin" ? 0.16 : 0.24;
  const trimHigh = kind === "skin" ? 0.84 : 0.76;
  const stats = robustAverage(base, trimLow, trimHigh);
  return {
    rgb: stats.rgb,
    lab: rgbToLab(stats.rgb),
    coverage: stats.total ? stats.kept / stats.total : 0,
  };
};

// ─── Classification ────────────────────────────────────────────────────

export const classifyEyeColor = (rgb) => {
  const hsl = toHsl(rgb);
  if (hsl.l < 20) return "Dark Brown";
  if (hsl.h >= 12 && hsl.h <= 42) return hsl.s > 35 ? "Amber Brown" : "Brown";
  if (hsl.h > 42 && hsl.h <= 88) return hsl.s > 26 ? "Hazel" : "Green-Hazel";
  if (hsl.h > 88 && hsl.h <= 165) return "Green";
  if (hsl.h > 165 && hsl.h <= 250) return hsl.l > 46 ? "Blue" : "Blue-Gray";
  return "Gray";
};

export const classifyUndertone = (skinLab) => {
  const warmIndex = skinLab.b - 0.35 * skinLab.a;
  if (warmIndex > 14) return { label: "Warm", warmIndex };
  if (warmIndex < 6) return { label: "Cool", warmIndex };
  return { label: "Neutral", warmIndex };
};

/**
 * Infer the user's color season from face analysis data.
 * Ported directly from the extension's inferSeasonFromFace.
 */
export const inferSeasonFromFace = ({ skinLab, undertone, eyeColor }) => {
  const chroma = Math.sqrt(skinLab.a * skinLab.a + skinLab.b * skinLab.b);
  const features = {
    temp: clamp((skinLab.b - 0.2 * skinLab.a + 6) / 32, 0, 1),
    depth: clamp((68 - skinLab.l) / 45, 0, 1),
    chroma: clamp(chroma / 40, 0, 1),
    eyeCool: ["Blue", "Blue-Gray", "Gray", "Green"].includes(eyeColor) ? 1 : 0,
  };

  const warmParents = ["Spring", "Autumn"];
  const coolParents = ["Summer", "Winter"];

  const scores = Object.entries(FACE_SEASON_PROFILES)
    .map(([season, profile]) => {
      const base =
        Math.abs(features.temp - profile.temp) * 0.42 +
        Math.abs(features.depth - profile.depth) * 0.29 +
        Math.abs(features.chroma - profile.chroma) * 0.29;
      let penalty = 0;
      if (undertone === "Warm" && coolParents.includes(profile.parent))
        penalty += 0.12;
      if (undertone === "Cool" && warmParents.includes(profile.parent))
        penalty += 0.12;
      if (features.eyeCool > 0.5 && warmParents.includes(profile.parent))
        penalty += 0.03;
      if (features.eyeCool < 0.5 && coolParents.includes(profile.parent))
        penalty += 0.03;
      return { season, parent: profile.parent, score: base + penalty };
    })
    .sort((a, b) => a.score - b.score);

  const best = scores[0];
  const second = scores[1] || best;
  const separation = Math.max(0, second.score - best.score);
  const confidence = clamp(
    Math.round(72 + separation * 190 - best.score * 42),
    50,
    96
  );

  return {
    parent: best.parent,
    subseason: best.season,
    confidence,
    score: best.score,
    allScores: scores.slice(0, 5),
  };
};
