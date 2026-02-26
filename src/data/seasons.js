/**
 * Season reference data ported from the browser extension.
 * All palette swatches, guide colors, neutrals, metals, hair colors,
 * face-analysis profiles, and legacy aliases live here.
 */

// ─── Palette Swatches (compact, 6 per season) ─────────────────────────
export const SEASON_SWATCHES = {
  "Light Spring": ["#f8e6c5", "#f2cf9d", "#f4dca9", "#dce7a6", "#9fd8cf", "#f7b9a6"],
  "Warm Spring": ["#f6b24c", "#ef8b2f", "#f0c255", "#9cc75a", "#53b9b1", "#ef6f4f"],
  "True Spring": ["#f5c23d", "#f1892e", "#f3cf57", "#7fcf63", "#2fb8b1", "#ef5f45"],
  "Bright Spring": ["#ff5a4f", "#ff7a2b", "#ffd93f", "#38d66d", "#15c7d9", "#f84f9b"],
  "Light Summer": ["#e9dcec", "#d8cfe9", "#f4dbe5", "#c7dee9", "#b6d9ce", "#efe7d2"],
  "Cool Summer": ["#d6bfd8", "#bfaed8", "#c6c9e6", "#a6c7d8", "#9fc4bc", "#d9b6bf"],
  "True Summer": ["#caa8cf", "#a79dd0", "#9fb6d9", "#89b7c8", "#92beb4", "#d6aab9"],
  "Soft Summer": ["#c9b5b8", "#b9afbe", "#b1bcc3", "#9eb8b3", "#b9b29d", "#c6a8a2"],
  "Soft Autumn": ["#c8ac8f", "#b79278", "#c3a675", "#9ea26d", "#7f9782", "#b78d80"],
  "True Autumn": ["#c67b39", "#b1612e", "#c59c3f", "#8f8d47", "#5f8370", "#a0523d"],
  "Warm Autumn": ["#cc7a2f", "#b55b2f", "#c89a37", "#8c9441", "#4f7c63", "#9f4f3e"],
  "Deep Autumn": ["#8b4a2c", "#6f3b2c", "#8a682f", "#595e36", "#3d5450", "#70343a"],
  "Bright Winter": ["#ff3f5e", "#ff5e2f", "#ffd23a", "#00c9f2", "#2f77ff", "#d144ff"],
  "True Winter": ["#d81f47", "#b82035", "#4f4fb9", "#2060a8", "#007f8a", "#8b2b9f"],
  "Cool Winter": ["#c22f58", "#8a336f", "#5362b2", "#2f76a7", "#22818a", "#a14d8e"],
  "Deep Winter": ["#5a1f33", "#49273e", "#2f3e63", "#1f5365", "#245b55", "#6e2f45"],
};

// ─── Extended Guide Colors (8 per season) ──────────────────────────────
export const SEASON_GUIDE_COLORS = {
  "Light Spring": ["#fce5b4", "#f6d98d", "#ffd0a1", "#fcb99a", "#f6e68d", "#cce68a", "#92dccf", "#9fd0f4"],
  "Warm Spring": ["#f7c45c", "#f2a743", "#f58b4a", "#ea6f46", "#e8d152", "#a9cf58", "#5fc6ae", "#64b4df"],
  "True Spring": ["#f4c93a", "#f3a22f", "#ef7f2f", "#f0604d", "#e6d43d", "#7ecf5d", "#2fbcb4", "#3ba9de"],
  "Bright Spring": ["#ffdf3a", "#ff9f2e", "#ff5a49", "#f2377d", "#46df67", "#10cbe0", "#2e92ff", "#a83dff"],
  "Light Summer": ["#efe1f0", "#e1d6ef", "#f0dce8", "#d2d6f0", "#c7dff0", "#bfddd4", "#f0e4d5", "#d8d8df"],
  "Cool Summer": ["#d8c5dd", "#c7b8dd", "#d4bed2", "#b9c2df", "#aac8dc", "#a7c7bf", "#dcbec8", "#b6b7c1"],
  "True Summer": ["#cfb1d4", "#b29fd3", "#c8a8c6", "#a1b2d6", "#8eb9d1", "#95bdb5", "#d4a8b6", "#a7a9b8"],
  "Soft Summer": ["#c9b4bb", "#b8afbd", "#c5b4be", "#aeb9c5", "#a3b9bf", "#a9bab2", "#c6b1ab", "#a7a3a3"],
  "Soft Autumn": ["#cfb092", "#bd9e84", "#c5a487", "#adb08a", "#9aa788", "#8ea18f", "#b89485", "#9e8e80"],
  "True Autumn": ["#d08a42", "#bd6d33", "#c95b3c", "#a64739", "#b89a3e", "#8e8c45", "#5f866f", "#8e6a54"],
  "Warm Autumn": ["#cf8331", "#bf642f", "#cc4c38", "#a53f32", "#bb9d33", "#8a8e3c", "#4d7f5f", "#845b46"],
  "Deep Autumn": ["#8f532f", "#7a452e", "#7f3d39", "#5f3234", "#786236", "#5d633c", "#3f5c57", "#5b463f"],
  "Bright Winter": ["#ff4b67", "#ff6b2f", "#ffd72f", "#24d5f2", "#2f8bff", "#8b4dff", "#f238a4", "#ffffff"],
  "True Winter": ["#db2d57", "#b9314d", "#8d37a5", "#4f61cf", "#1f86d4", "#008ca0", "#6b2f62", "#f8fbff"],
  "Cool Winter": ["#c93a63", "#a13a76", "#6f4cb1", "#4c73c5", "#2f82b0", "#2a8b90", "#944e87", "#edf1f6"],
  "Deep Winter": ["#6a2a46", "#542f50", "#364472", "#285a75", "#2f6258", "#7a3450", "#111521", "#e6ebf2"],
};

// ─── Neutral Swatches ──────────────────────────────────────────────────
export const SEASON_NEUTRAL_SWATCHES = {
  "Light Spring": ["#f7ead8", "#eedcbc", "#d8c09d", "#b69f82"],
  "Warm Spring": ["#f3e1c7", "#dfc8a2", "#c5a178", "#a37f58"],
  "True Spring": ["#f2e0c4", "#d9be95", "#bc9867", "#8f6f48"],
  "Bright Spring": ["#f7f3ea", "#ded7c8", "#9e9488", "#585452"],
  "Light Summer": ["#f5f4f1", "#ddd8d3", "#bcb4ae", "#8f8a86"],
  "Cool Summer": ["#f2f1ef", "#d7d2cf", "#afa9ad", "#7e7d86"],
  "True Summer": ["#f0efee", "#d2cdd0", "#aaa6ad", "#74737e"],
  "Soft Summer": ["#f1eeea", "#d3cbc3", "#aaa39f", "#7d7a78"],
  "Soft Autumn": ["#f2e4d2", "#d4bfa4", "#a88f73", "#746454"],
  "True Autumn": ["#f0e0c8", "#cfb18b", "#9f7e5f", "#634d3e"],
  "Warm Autumn": ["#f0dec2", "#ccab80", "#9b754e", "#5e4633"],
  "Deep Autumn": ["#dfcfba", "#b89f82", "#7a624d", "#3f352e"],
  "Bright Winter": ["#ffffff", "#e3e6ee", "#8f96a7", "#1d2430"],
  "True Winter": ["#ffffff", "#d9dfe8", "#7f8799", "#1b2230"],
  "Cool Winter": ["#fafcff", "#d3d9e3", "#79829a", "#1a2333"],
  "Deep Winter": ["#f2f5fa", "#c8cfdb", "#6f788d", "#121826"],
};

// ─── Best Metal ────────────────────────────────────────────────────────
export const SEASON_BEST_METAL = {
  "Light Spring": { name: "Light Gold", hex: "#E6C97A" },
  "Warm Spring": { name: "Yellow Gold", hex: "#D4AF37" },
  "True Spring": { name: "Warm Gold", hex: "#CFA64A" },
  "Bright Spring": { name: "Bright Gold", hex: "#E0B94D" },
  "Light Summer": { name: "Soft Silver", hex: "#C8CDD3" },
  "Cool Summer": { name: "Silver", hex: "#BFC5CB" },
  "True Summer": { name: "Silver", hex: "#B5BBC2" },
  "Soft Summer": { name: "Pewter", hex: "#9A9690" },
  "Soft Autumn": { name: "Antique Gold", hex: "#B59A62" },
  "True Autumn": { name: "Bronze", hex: "#A97142" },
  "Warm Autumn": { name: "Rich Gold", hex: "#BE8E3E" },
  "Deep Autumn": { name: "Copper", hex: "#8F5A3C" },
  "Bright Winter": { name: "White Gold", hex: "#D4D9DE" },
  "True Winter": { name: "Silver", hex: "#C8CED6" },
  "Cool Winter": { name: "Platinum", hex: "#D0D5DC" },
  "Deep Winter": { name: "Gunmetal", hex: "#5D6673" },
};

// ─── Hair Color Recommendations ────────────────────────────────────────
export const HAIR_PARENT_BY_SEASON = {
  "Light Spring": "Spring", "Warm Spring": "Spring",
  "True Spring": "Spring", "Bright Spring": "Spring",
  "Light Summer": "Summer", "Cool Summer": "Summer",
  "True Summer": "Summer", "Soft Summer": "Summer",
  "Soft Autumn": "Autumn", "True Autumn": "Autumn",
  "Warm Autumn": "Autumn", "Deep Autumn": "Autumn",
  "Bright Winter": "Winter", "True Winter": "Winter",
  "Cool Winter": "Winter", "Deep Winter": "Winter",
};

export const SEASON_HAIR_SWATCHES = {
  Winter: [
    { name: "Ash Brown", hex: "#6D625A" },
    { name: "Blue-Black", hex: "#1B1F2B" },
    { name: "Gray", hex: "#A8A8A8" },
  ],
  Summer: [
    { name: "Ash Blonde", hex: "#C8B89D" },
    { name: "Warm Ash Blonde", hex: "#BFA988" },
    { name: "Ash Brown", hex: "#72675D" },
    { name: "Gray", hex: "#AFAFAF" },
  ],
  Autumn: [
    { name: "Golden Blonde", hex: "#D8B46A" },
    { name: "Golden Brown", hex: "#8A613F" },
    { name: "Red Brown", hex: "#7E3F31" },
    { name: "Red", hex: "#A9492A" },
    { name: "Strawberry", hex: "#C8846D" },
  ],
  Spring: [
    { name: "Flaxen Blonde", hex: "#E4CC8A" },
    { name: "Golden Blonde", hex: "#DDB56A" },
    { name: "Golden Brown", hex: "#936540" },
    { name: "Red-Brown", hex: "#844939" },
    { name: "Strawberry", hex: "#D18B75" },
  ],
};

// ─── Face Analysis Season Profiles ─────────────────────────────────────
export const FACE_SEASON_PROFILES = {
  "Light Spring": { parent: "Spring", temp: 0.78, depth: 0.24, chroma: 0.58 },
  "Warm Spring": { parent: "Spring", temp: 0.9, depth: 0.45, chroma: 0.56 },
  "True Spring": { parent: "Spring", temp: 0.84, depth: 0.4, chroma: 0.52 },
  "Bright Spring": { parent: "Spring", temp: 0.72, depth: 0.48, chroma: 0.72 },
  "Light Summer": { parent: "Summer", temp: 0.28, depth: 0.24, chroma: 0.3 },
  "Cool Summer": { parent: "Summer", temp: 0.18, depth: 0.46, chroma: 0.36 },
  "True Summer": { parent: "Summer", temp: 0.24, depth: 0.4, chroma: 0.34 },
  "Soft Summer": { parent: "Summer", temp: 0.36, depth: 0.42, chroma: 0.2 },
  "Soft Autumn": { parent: "Autumn", temp: 0.62, depth: 0.46, chroma: 0.26 },
  "True Autumn": { parent: "Autumn", temp: 0.82, depth: 0.5, chroma: 0.45 },
  "Warm Autumn": { parent: "Autumn", temp: 0.92, depth: 0.56, chroma: 0.5 },
  "Deep Autumn": { parent: "Autumn", temp: 0.72, depth: 0.82, chroma: 0.42 },
  "Bright Winter": { parent: "Winter", temp: 0.22, depth: 0.54, chroma: 0.78 },
  "True Winter": { parent: "Winter", temp: 0.12, depth: 0.62, chroma: 0.6 },
  "Cool Winter": { parent: "Winter", temp: 0.08, depth: 0.6, chroma: 0.54 },
  "Deep Winter": { parent: "Winter", temp: 0.18, depth: 0.86, chroma: 0.42 },
};

// ─── Season Groupings ──────────────────────────────────────────────────
export const PARENT_SEASONS = ["Spring", "Summer", "Autumn", "Winter"];

export const SEASONS_BY_PARENT = {
  Spring: ["Light Spring", "Warm Spring", "True Spring", "Bright Spring"],
  Summer: ["Light Summer", "Cool Summer", "True Summer", "Soft Summer"],
  Autumn: ["Soft Autumn", "True Autumn", "Warm Autumn", "Deep Autumn"],
  Winter: ["Bright Winter", "True Winter", "Cool Winter", "Deep Winter"],
};

export const ALL_SEASONS = Object.values(SEASONS_BY_PARENT).flat();

// ─── Season Descriptions ───────────────────────────────────────────────
export const SEASON_DESCRIPTIONS = {
  "Light Spring": "Light, warm, and delicate. Think peach, ivory, and soft coral — colors that glow without overpowering.",
  "Warm Spring": "Golden warmth radiates from you. Rich yellows, warm corals, and earthy greens are your sweet spot.",
  "True Spring": "Pure warmth and brightness. You shine in saturated warm tones — think sunflower, tangerine, and leaf green.",
  "Bright Spring": "High contrast and vibrant energy. Electric brights, bold warm hues, and punchy saturated colors are your playground.",
  "Light Summer": "Soft, cool, and ethereal. Lavender, powder blue, and dusty rose create a gentle harmony with your coloring.",
  "Cool Summer": "Distinctly cool undertones with medium depth. Plum, slate blue, and cool mauve bring out your best.",
  "True Summer": "The essence of cool and muted. Soft berries, blue-grays, and cool pinks complement your natural coloring.",
  "Soft Summer": "Muted and blended, like a watercolor painting. Dusty tones, heathered neutrals, and smoky pastels are ideal.",
  "Soft Autumn": "Warm but gentle. Muted olive, dusty terracotta, and warm taupes harmonize beautifully with your soft warmth.",
  "True Autumn": "Rich, warm, and earthy. Burnt orange, forest green, and golden brown are your signature colors.",
  "Warm Autumn": "Intensely warm and saturated. Think pumpkin, rust, mustard, and deep teal — nature's warmest palette.",
  "Deep Autumn": "Dark and warm with dramatic depth. Chocolate, burgundy, olive, and warm navy create striking looks on you.",
  "Bright Winter": "High contrast with cool, vivid color. Hot pink, cobalt, emerald, and icy brights make you come alive.",
  "True Winter": "Bold, cool, and deeply saturated. Jewel tones like sapphire, ruby, and emerald are your power colors.",
  "Cool Winter": "Cool-toned depth and intensity. Fuchsia, icy purple, cool red, and deep teal are effortlessly stunning on you.",
  "Deep Winter": "The darkest and most dramatic palette. Deep navy, black-cherry, forest, and rich burgundy are commanding on you.",
};

// ─── Legacy Aliases (alternative naming systems) ───────────────────────
export const LEGACY_SEASON_ALIASES = {
  "Pastel Spring": "Light Spring",
  "Golden Spring": "Warm Spring",
  "Paintbox Spring": "True Spring",
  "Blue Spring": "Bright Spring",
  "Pastel Summer": "Light Summer",
  "Dark Summer": "Cool Summer",
  "Sweet Pea Summer": "True Summer",
  "Brown Summer": "Soft Summer",
  "Leaf Autumn": "True Autumn",
  "Vibrant Autumn": "Warm Autumn",
  "Blue Autumn": "Deep Autumn",
  "Sprinter Winter": "Bright Winter",
  "Jewel Winter": "True Winter",
  "Sultry Winter": "Cool Winter",
  "Burnished Winter": "Deep Winter",
};
