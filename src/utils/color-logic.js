export const PALETTE_MAP = {
  "Light Spring": {
    hue_ranges: [[350, 28], [30, 85], [90, 170], [180, 230], [270, 300]],
    sat_range: [35, 75],
    light_range: [65, 90]
  },
  "Warm Spring": {
    hue_ranges: [[350, 30], [25, 90], [90, 175], [180, 225], [270, 300]],
    sat_range: [50, 90],
    light_range: [45, 75]
  },
  "True Spring": {
    hue_ranges: [[350, 30], [25, 88], [95, 175], [180, 230], [268, 302]],
    sat_range: [60, 100],
    light_range: [45, 80]
  },
  "Bright Spring": {
    hue_ranges: [[350, 30], [25, 85], [95, 170], [185, 235], [272, 308]],
    sat_range: [75, 100],
    light_range: [40, 72]
  },
  "Light Summer": {
    hue_ranges: [[340, 12], [50, 75], [115, 190], [190, 255], [255, 320]],
    sat_range: [20, 55],
    light_range: [65, 92]
  },
  "Cool Summer": {
    hue_ranges: [[335, 8], [50, 70], [120, 190], [190, 260], [260, 320]],
    sat_range: [25, 60],
    light_range: [50, 82]
  },
  "True Summer": {
    hue_ranges: [[335, 8], [50, 70], [120, 190], [190, 265], [260, 320]],
    sat_range: [25, 65],
    light_range: [48, 80]
  },
  "Soft Summer": {
    hue_ranges: [[335, 8], [50, 68], [115, 190], [185, 260], [260, 318]],
    sat_range: [12, 45],
    light_range: [45, 78]
  },
  "Soft Autumn": {
    hue_ranges: [[355, 32], [25, 95], [85, 165], [170, 215], [280, 305]],
    sat_range: [18, 52],
    light_range: [35, 68]
  },
  "True Autumn": {
    hue_ranges: [[355, 30], [25, 92], [85, 165], [170, 210], [280, 305]],
    sat_range: [35, 75],
    light_range: [28, 62]
  },
  "Warm Autumn": {
    hue_ranges: [[355, 30], [25, 95], [85, 165], [170, 205], [280, 302]],
    sat_range: [40, 82],
    light_range: [25, 62]
  },
  "Deep Autumn": {
    hue_ranges: [[355, 28], [25, 88], [80, 160], [170, 205], [280, 300]],
    sat_range: [35, 78],
    light_range: [12, 48]
  },
  "Bright Winter": {
    hue_ranges: [[340, 8], [55, 72], [115, 180], [195, 290], [290, 332]],
    sat_range: [75, 100],
    light_range: [25, 72]
  },
  "True Winter": {
    hue_ranges: [[340, 8], [55, 70], [120, 180], [200, 290], [290, 332]],
    sat_range: [60, 100],
    light_range: [15, 60]
  },
  "Cool Winter": {
    hue_ranges: [[342, 8], [55, 68], [125, 185], [200, 292], [292, 334]],
    sat_range: [50, 95],
    light_range: [18, 62]
  },
  "Deep Winter": {
    hue_ranges: [[342, 8], [55, 68], [120, 180], [200, 292], [292, 334]],
    sat_range: [45, 95],
    light_range: [8, 42]
  }
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const LOW_SAT_THRESHOLD = 10;
const VERY_LOW_SAT_THRESHOLD = 6;
const VERY_DARK_THRESHOLD = 20;
const VERY_LIGHT_THRESHOLD = 80;
const HUE_WEIGHT_NORMAL = 1;
const HUE_WEIGHT_LOW_SAT = 0;

const COOL_SEASONS = new Set([
  "Light Summer",
  "Cool Summer",
  "True Summer",
  "Soft Summer",
  "Bright Winter",
  "True Winter",
  "Cool Winter",
  "Deep Winter"
]);

const WARM_SEASONS = new Set([
  "Light Spring",
  "Warm Spring",
  "True Spring",
  "Bright Spring",
  "Soft Autumn",
  "True Autumn",
  "Warm Autumn",
  "Deep Autumn"
]);

const DEEP_SEASONS = new Set(["Deep Autumn", "Deep Winter"]);
const LIGHT_SEASONS = new Set(["Light Spring", "Light Summer"]);
const BRIGHT_SEASONS = new Set(["Bright Spring", "Bright Winter"]);
const SOFT_SEASONS = new Set(["Soft Summer", "Soft Autumn"]);
const SPRING_SEASONS = new Set(["Light Spring", "Warm Spring", "True Spring", "Bright Spring"]);
const SUMMER_SEASONS = new Set(["Light Summer", "Cool Summer", "True Summer", "Soft Summer"]);
const AUTUMN_SEASONS = new Set(["Soft Autumn", "True Autumn", "Warm Autumn", "Deep Autumn"]);
const WINTER_SEASONS = new Set(["Bright Winter", "True Winter", "Cool Winter", "Deep Winter"]);
const MAKEUP_PRODUCTS = new Set(["lipstick", "blush", "eyeshadow", "foundation"]);

const MAKEUP_TEMPLATE_BY_PRODUCT = {
  lipstick: {
    warm: { hue_ranges: [[348, 25], [25, 78], [300, 338]], sat_range: [34, 80], light_range: [38, 72] },
    cool: { hue_ranges: [[330, 360], [0, 22], [250, 320]], sat_range: [26, 74], light_range: [36, 70] }
  },
  blush: {
    warm: { hue_ranges: [[350, 28], [28, 65], [300, 336]], sat_range: [20, 58], light_range: [46, 82] },
    cool: { hue_ranges: [[330, 360], [0, 22], [250, 320]], sat_range: [16, 52], light_range: [44, 80] }
  },
  eyeshadow: {
    warm: { hue_ranges: [[18, 68], [68, 165], [350, 18]], sat_range: [10, 60], light_range: [24, 74] },
    cool: { hue_ranges: [[200, 320], [330, 360], [0, 12]], sat_range: [8, 58], light_range: [22, 72] }
  },
  foundation: {
    warm: { hue_ranges: [[8, 65], [350, 8]], sat_range: [8, 72], light_range: [18, 92] },
    cool: { hue_ranges: [[350, 30], [300, 350]], sat_range: [8, 72], light_range: [18, 92] }
  }
};

export function hexToRgb(hex) {
  const normalized = hex.replace("#", "").trim();
  const full = normalized.length === 3
    ? normalized.split("").map((ch) => ch + ch).join("")
    : normalized;

  const int = parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return { r, g, b };
}

export function rgbToHsl(r, g, b) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta) % 6;
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
      default:
        h = 0;
    }
  }

  h = Math.round(((h * 60) + 360) % 360);

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function inRange(value, [min, max]) {
  return value >= min && value <= max;
}

function distanceToRange(value, [min, max]) {
  if (value < min) return min - value;
  if (value > max) return value - max;
  return 0;
}

function circularDiff(a, b) {
  const diff = Math.abs(a - b) % 360;
  return Math.min(diff, 360 - diff);
}

function hueInWrappedRange(h, min, max) {
  if (min <= max) return h >= min && h <= max;
  return h >= min || h <= max;
}

function distanceToHueRange(hue, [min, max]) {
  if (hueInWrappedRange(hue, min, max)) return 0;
  return Math.min(circularDiff(hue, min), circularDiff(hue, max));
}

function directionToRange(value, [min, max]) {
  if (value < min) return "low";
  if (value > max) return "high";
  return "in";
}

function normalizeHueRanges(palette) {
  if (Array.isArray(palette.hue_ranges) && palette.hue_ranges.length) return palette.hue_ranges;
  if (Array.isArray(palette.hue_range) && palette.hue_range.length === 2) return [palette.hue_range];
  return [[0, 360]];
}

function adjustRange([min, max], deltaMin = 0, deltaMax = 0) {
  return [clamp(min + deltaMin, 0, 100), clamp(max + deltaMax, 0, 100)];
}

function makeupTemperatureFor(season) {
  return COOL_SEASONS.has(season) ? "cool" : "warm";
}

function makeupPaletteFor(season, product) {
  if (!MAKEUP_PRODUCTS.has(product)) return null;
  const temperature = makeupTemperatureFor(season);
  const template = MAKEUP_TEMPLATE_BY_PRODUCT[product]?.[temperature];
  if (!template) return null;

  let satRange = [...template.sat_range];
  let lightRange = [...template.light_range];
  const hueRanges = normalizeHueRanges(template);

  if (product === "foundation") {
    return {
      hue_ranges: hueRanges,
      sat_range: satRange,
      light_range: lightRange
    };
  }

  if (LIGHT_SEASONS.has(season)) {
    satRange = adjustRange(satRange, -6, -8);
    lightRange = adjustRange(lightRange, 8, 10);
  }

  if (DEEP_SEASONS.has(season)) {
    satRange = adjustRange(satRange, 0, 2);
    lightRange = adjustRange(lightRange, -12, -8);
  }

  if (BRIGHT_SEASONS.has(season)) {
    satRange = adjustRange(satRange, 6, 6);
  }

  if (SOFT_SEASONS.has(season)) {
    satRange = adjustRange(satRange, -8, -12);
  }

  if (product === "lipstick" && WINTER_SEASONS.has(season)) {
    // Winter can wear cool lipsticks, but many users need wearable depth/chroma.
    satRange = adjustRange(satRange, -2, -6);
    lightRange = adjustRange(lightRange, 2, 0);
  }

  return {
    hue_ranges: hueRanges,
    sat_range: satRange,
    light_range: lightRange
  };
}

function foundationUndertoneValue(r, g, b) {
  // Positive = warmer/yellower, negative = cooler/pinker.
  // Keep red depth from falsely reading as "cool" for deep skin tones.
  const yellowness = g - b;
  const redness = r - g;
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  const confidence = clamp(chroma / 90, 0.45, 1);
  return Math.round(((yellowness - (redness * 0.35)) * 1.25) * confidence);
}

function foundationUndertoneRangeForSeason(season) {
  if (COOL_SEASONS.has(season)) return [-30, 2];
  return [-4, 30];
}

function foundationUndertoneDirection(value, season) {
  const [min, max] = foundationUndertoneRangeForSeason(season);
  if (value < min) return "cooler";
  if (value > max) return "warmer";
  return "in";
}

function foundationUndertoneDist(value, season) {
  return distanceToRange(value, foundationUndertoneRangeForSeason(season));
}

function distanceToHueRanges(hue, hueRanges) {
  return hueRanges.reduce(
    (best, range) => Math.min(best, distanceToHueRange(hue, range)),
    Number.POSITIVE_INFINITY
  );
}

function directionToHueRanges(hue, hueRanges) {
  if (distanceToHueRanges(hue, hueRanges) === 0) return "in";

  let bestBoundary = 0;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const [min, max] of hueRanges) {
    const minDist = circularDiff(hue, min);
    if (minDist < bestDist) {
      bestDist = minDist;
      bestBoundary = min;
    }
    const maxDist = circularDiff(hue, max);
    if (maxDist < bestDist) {
      bestDist = maxDist;
      bestBoundary = max;
    }
  }

  const signed = ((bestBoundary - hue + 540) % 360) - 180;
  return signed >= 0 ? "high" : "low";
}

function neutralProfile(h, s, l) {
  // Super dark black/charcoal neutrals.
  if (l <= 16 && s <= 28) {
    return { id: "deep-neutral", allowed: WINTER_SEASONS, strong: true };
  }

  // Dark cool colors (blackened navy/purple/inky cool tones).
  if (l <= 24 && s <= 60 && (hueInWrappedRange(h, 200, 360) || hueInWrappedRange(h, 0, 20))) {
    return { id: "deep-cool", allowed: WINTER_SEASONS, strong: true };
  }

  // Crisp whites and very bright neutrals.
  if (l >= 94 && s <= 10) {
    return {
      id: "bright-light-neutral",
      allowed: new Set([...SUMMER_SEASONS, ...WINTER_SEASONS]),
      strong: true
    };
  }

  // Light greys and soft cool lights.
  if (l >= 80 && s <= 18) {
    return { id: "light-cool-neutral", allowed: SUMMER_SEASONS, strong: true };
  }

  // Cream/beige light neutrals.
  if (l >= 76 && l <= 96 && s >= 8 && s <= 40 && hueInWrappedRange(h, 25, 75)) {
    return {
      id: "light-warm-neutral",
      allowed: new Set([...SPRING_SEASONS, ...AUTUMN_SEASONS]),
      strong: false
    };
  }

  // Mid warm neutrals (camel/taupe/olive-brown family).
  if (l >= 35 && l < 76 && s <= 28 && hueInWrappedRange(h, 20, 80)) {
    return {
      id: "mid-warm-neutral",
      allowed: new Set([...AUTUMN_SEASONS, ...SPRING_SEASONS]),
      strong: false
    };
  }

  // Mid cool neutrals (stone/slate family).
  if (l >= 30 && l < 80 && s <= 24 && hueInWrappedRange(h, 180, 280)) {
    return {
      id: "mid-cool-neutral",
      allowed: new Set([...SUMMER_SEASONS, ...WINTER_SEASONS]),
      strong: false
    };
  }

  return null;
}

function neutralSeasonMatch(h, s, l, season) {
  const profile = neutralProfile(h, s, l);
  if (!profile) return false;
  return profile.allowed.has(season);
}

function neutralScoreAdjustment(h, s, l, season) {
  const profile = neutralProfile(h, s, l);
  if (!profile) return 0;
  if (profile.allowed.has(season)) return profile.strong ? -36 : -18;
  return profile.strong ? 18 : 8;
}

export function checkSeason(h, s, l, targetSeason) {
  const palette = PALETTE_MAP[targetSeason];
  if (!palette) return { match: false, close: false };
  const hueRanges = normalizeHueRanges(palette);

  const hueMatch = distanceToHueRanges(h, hueRanges) === 0;
  const satMatch = inRange(s, palette.sat_range);
  const lightMatch = inRange(l, palette.light_range);

  const match = hueMatch && satMatch && lightMatch;
  if (match) return { match: true, close: false };

  // For neutrals/extreme values, allow family-level compatibility
  // (e.g., black/charcoal strongly maps to Winter families).
  if (neutralSeasonMatch(h, s, l, targetSeason)) {
    return { match: true, close: false };
  }

  const hueDist = distanceToHueRanges(h, hueRanges);
  const satDist = distanceToRange(s, palette.sat_range);
  const lightDist = distanceToRange(l, palette.light_range);

  const close = hueDist < 5 && satDist < 5 && lightDist < 5;
  return { match: false, close };
}

export function distanceToSeason(h, s, l, targetSeason) {
  const palette = PALETTE_MAP[targetSeason];
  if (!palette) return null;
  const hueRanges = normalizeHueRanges(palette);

  const hueDist = distanceToHueRanges(h, hueRanges);
  const satDist = distanceToRange(s, palette.sat_range);
  const lightDist = distanceToRange(l, palette.light_range);

  return {
    hueDist,
    satDist,
    lightDist,
    hueDir: directionToHueRanges(h, hueRanges),
    satDir: directionToRange(s, palette.sat_range),
    lightDir: directionToRange(l, palette.light_range),
    totalDist: hueDist + satDist + lightDist
  };
}

function seasonScoreFor(h, s, l, season, palette) {
  const hueDist = distanceToHueRanges(h, normalizeHueRanges(palette));
  const satDist = distanceToRange(s, palette.sat_range);
  const lightDist = distanceToRange(l, palette.light_range);
  const hueWeight = s < LOW_SAT_THRESHOLD ? HUE_WEIGHT_LOW_SAT : HUE_WEIGHT_NORMAL;
  let score = (hueDist * hueWeight) + satDist + lightDist;

  if (s < LOW_SAT_THRESHOLD) {
    const isCool = COOL_SEASONS.has(season);
    const isWarm = WARM_SEASONS.has(season);

    // Neutrals are better separated by value + temperature than by hue.
    if (l < 50 && isCool) score -= 2;
    if (l < 50 && isWarm) score += 1;
    if (l >= 50 && isWarm) score -= 1;
    if (l >= 50 && isCool) score += 0.5;

    if (l < VERY_DARK_THRESHOLD && DEEP_SEASONS.has(season)) score -= 2;
    if (l > VERY_LIGHT_THRESHOLD && LIGHT_SEASONS.has(season)) score -= 1.5;

    // Strongly neutral dark colors should avoid bright/clear families.
    if (s < VERY_LOW_SAT_THRESHOLD && l < VERY_DARK_THRESHOLD && season === "Bright Winter") {
      score += 2;
    }

    // Near-black neutrals should generally favor deep winter over deep autumn.
    if (s < VERY_LOW_SAT_THRESHOLD && l < VERY_DARK_THRESHOLD && season === "Deep Winter") {
      score -= 6;
    }
    if (s < VERY_LOW_SAT_THRESHOLD && l < VERY_DARK_THRESHOLD && season === "Deep Autumn") {
      score += 4;
    }
  }

  // Temperature bias for chromatic colors:
  // keep hue variety broad, but prefer warm seasons for warm hues
  // and cool seasons for cool hues.
  if (s >= 20) {
    const isCoolHue = hueInWrappedRange(h, 200, 330);
    const isWarmHue = hueInWrappedRange(h, 25, 170);
    const isWarmSeason = WARM_SEASONS.has(season);
    const isCoolSeason = COOL_SEASONS.has(season);

    if (isCoolHue) {
      if (isWarmSeason) score += 6;
      if (isCoolSeason) score -= 2;
    } else if (isWarmHue) {
      if (isCoolSeason) score += 5;
      if (isWarmSeason) score -= 1.5;
    }
  }

  score += neutralScoreAdjustment(h, s, l, season);

  return score;
}

function makeupScoreFor(h, s, l, season, product, rgb = null) {
  const palette = makeupPaletteFor(season, product);
  if (!palette) return Number.POSITIVE_INFINITY;

  const hueDist = distanceToHueRanges(h, palette.hue_ranges);
  const satDist = distanceToRange(s, palette.sat_range);
  const lightDist = distanceToRange(l, palette.light_range);

  let hueWeight = 1;
  let satWeight = 1;
  let lightWeight = 1;
  let undertonePenalty = 0;
  if (product === "foundation") {
    hueWeight = s <= 35 ? 0.08 : 0.15;
    satWeight = 0.25;
    lightWeight = 0.08;
    if (rgb) {
      const undertone = foundationUndertoneValue(rgb.r, rgb.g, rgb.b);
      undertonePenalty = foundationUndertoneDist(undertone, season) * 3.4;

      // Tie-breaker for subtle skin tones: prefer season temperature by undertone sign.
      if (undertone <= -6) {
        if (WARM_SEASONS.has(season)) undertonePenalty += 8;
        if (COOL_SEASONS.has(season)) undertonePenalty -= 1.5;
      } else if (undertone >= 10) {
        if (COOL_SEASONS.has(season)) undertonePenalty += 8;
        if (WARM_SEASONS.has(season)) undertonePenalty -= 1.5;
      }
    }
  } else if (s < LOW_SAT_THRESHOLD) {
    hueWeight = HUE_WEIGHT_LOW_SAT;
  }

  let score = (hueDist * hueWeight) + (satDist * satWeight) + (lightDist * lightWeight) + undertonePenalty;

  if (product === "lipstick" && WINTER_SEASONS.has(season) && s > 78) {
    score += (s - 78) * 0.8;
  }

  return score;
}

export function rankedSeasons(h, s, l) {
  return Object.entries(PALETTE_MAP)
    .map(([season, palette]) => ({
      season,
      score: seasonScoreFor(h, s, l, season, palette)
    }))
    .sort((a, b) => a.score - b.score);
}

export function rankedMakeupSeasons(h, s, l, product, rgb = null) {
  if (!MAKEUP_PRODUCTS.has(product)) return rankedSeasons(h, s, l);
  return Object.keys(PALETTE_MAP)
    .map((season) => ({
      season,
      score: makeupScoreFor(h, s, l, season, product, rgb)
    }))
    .sort((a, b) => a.score - b.score);
}

export function closestSeason(h, s, l) {
  const ranked = rankedSeasons(h, s, l);
  return ranked.length ? ranked[0].season : null;
}

export function classifyColor(hex, targetSeason) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const { match, close } = checkSeason(h, s, l, targetSeason);
  const suggestion = closestSeason(h, s, l);
  return {
    h,
    s,
    l,
    match,
    close,
    suggestion
  };
}

export function distanceToMakeupSeason(h, s, l, season, product, rgb = null) {
  const palette = makeupPaletteFor(season, product);
  if (!palette) return null;

  const hueDist = distanceToHueRanges(h, palette.hue_ranges);
  const satDist = distanceToRange(s, palette.sat_range);
  const lightDist = distanceToRange(l, palette.light_range);
  let undertoneDist = 0;
  let undertoneDir = "in";

  let totalDist = hueDist + satDist + lightDist;
  if (product === "foundation") {
    totalDist = (hueDist * 0.15) + (satDist * 0.25) + (lightDist * 0.08);
    if (rgb) {
      const undertone = foundationUndertoneValue(rgb.r, rgb.g, rgb.b);
      undertoneDist = foundationUndertoneDist(undertone, season);
      undertoneDir = foundationUndertoneDirection(undertone, season);
      totalDist += undertoneDist * 3.4;
    }
  }
  return {
    hueDist,
    satDist,
    lightDist,
    undertoneDist,
    undertoneDir,
    hueDir: directionToHueRanges(h, palette.hue_ranges),
    satDir: directionToRange(s, palette.sat_range),
    lightDir: directionToRange(l, palette.light_range),
    totalDist
  };
}

export function classifyMakeupColor(hex, targetSeason, product = "lipstick") {
  const normalizedProduct = MAKEUP_PRODUCTS.has(product) ? product : "lipstick";
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const palette = makeupPaletteFor(targetSeason, normalizedProduct);
  if (!palette) {
    const fallback = classifyColor(hex, targetSeason);
    return { ...fallback, product: normalizedProduct };
  }

  const hueDist = distanceToHueRanges(h, palette.hue_ranges);
  const satDist = distanceToRange(s, palette.sat_range);
  const lightDist = distanceToRange(l, palette.light_range);
  let undertoneDist = 0;
  let match = hueDist === 0 && satDist === 0 && lightDist === 0;
  let close = !match && hueDist < 8 && satDist < 7 && lightDist < 7;

  if (normalizedProduct === "foundation") {
    const undertone = foundationUndertoneValue(r, g, b);
    undertoneDist = foundationUndertoneDist(undertone, targetSeason);
    match = undertoneDist <= 2 && satDist <= 12 && hueDist <= 30;
    close = !match && undertoneDist <= 7 && satDist <= 18 && hueDist <= 40;
  }

  const ranked = rankedMakeupSeasons(h, s, l, normalizedProduct, { r, g, b });
  let suggestion = ranked.length ? ranked[0].season : null;
  if (normalizedProduct === "foundation" && match) {
    suggestion = targetSeason;
  }

  return {
    h,
    s,
    l,
    match,
    close,
    undertoneDist,
    suggestion,
    product: normalizedProduct
  };
}

export function normalizeHex(hex) {
  if (!hex) return "#000000";
  const cleaned = hex.trim();
  if (!cleaned.startsWith("#")) return `#${cleaned}`;
  return cleaned;
}

export function isValidHex(hex) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

export function safeHex(hex) {
  const normalized = normalizeHex(hex);
  return isValidHex(normalized) ? normalized : "#000000";
}

export function clampHsl(h, s, l) {
  return {
    h: clamp(h, 0, 360),
    s: clamp(s, 0, 100),
    l: clamp(l, 0, 100)
  };
}

export function averageRgb(samples) {
  if (!samples.length) return { r: 0, g: 0, b: 0 };
  const totals = samples.reduce(
    (acc, sample) => ({
      r: acc.r + sample.r,
      g: acc.g + sample.g,
      b: acc.b + sample.b
    }),
    { r: 0, g: 0, b: 0 }
  );

  return {
    r: Math.round(totals.r / samples.length),
    g: Math.round(totals.g / samples.length),
    b: Math.round(totals.b / samples.length)
  };
}

export function rgbToHex(r, g, b) {
  const toHex = (value) => value.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
