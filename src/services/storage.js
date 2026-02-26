/**
 * Local storage service using AsyncStorage.
 * Replaces chrome.storage.sync from the browser extension.
 * When a backend is added, this layer will also sync with the API.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  HOME_SEASON: "@irl/homeSeason",
  ANALYSIS_MODE: "@irl/analysisMode",
  MAKEUP_PRODUCT: "@irl/makeupProduct",
  FAVORITES: "@irl/favoritesBySeason",
  ONBOARDED: "@irl/onboarded",
  FACE_RESULT: "@irl/lastFaceResult",
  USER_PROFILE: "@irl/userProfile",
};

// ─── Getters ───────────────────────────────────────────────────────────

export async function getHomeSeason() {
  const value = await AsyncStorage.getItem(KEYS.HOME_SEASON);
  return value || null;
}

export async function getAnalysisMode() {
  const value = await AsyncStorage.getItem(KEYS.ANALYSIS_MODE);
  return value || "clothing";
}

export async function getMakeupProduct() {
  const value = await AsyncStorage.getItem(KEYS.MAKEUP_PRODUCT);
  return value || "lipstick";
}

export async function getFavorites() {
  const raw = await AsyncStorage.getItem(KEYS.FAVORITES);
  return raw ? JSON.parse(raw) : {};
}

export async function hasOnboarded() {
  const value = await AsyncStorage.getItem(KEYS.ONBOARDED);
  return value === "true";
}

export async function getLastFaceResult() {
  const raw = await AsyncStorage.getItem(KEYS.FACE_RESULT);
  return raw ? JSON.parse(raw) : null;
}

export async function getUserProfile() {
  const raw = await AsyncStorage.getItem(KEYS.USER_PROFILE);
  return raw ? JSON.parse(raw) : null;
}

// ─── Setters ───────────────────────────────────────────────────────────

export async function setHomeSeason(season) {
  await AsyncStorage.setItem(KEYS.HOME_SEASON, season);
}

export async function setAnalysisMode(mode) {
  await AsyncStorage.setItem(KEYS.ANALYSIS_MODE, mode);
}

export async function setMakeupProduct(product) {
  await AsyncStorage.setItem(KEYS.MAKEUP_PRODUCT, product);
}

export async function saveFavorite(contextKey, hex) {
  const all = await getFavorites();
  if (!all[contextKey]) all[contextKey] = [];
  if (!all[contextKey].includes(hex)) {
    all[contextKey].push(hex);
  }
  await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(all));
  return all;
}

export async function removeFavorite(contextKey, hex) {
  const all = await getFavorites();
  if (all[contextKey]) {
    all[contextKey] = all[contextKey].filter((h) => h !== hex);
  }
  await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(all));
  return all;
}

export async function clearFavorites(contextKey) {
  const all = await getFavorites();
  delete all[contextKey];
  await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(all));
  return all;
}

export async function setOnboarded(value = true) {
  await AsyncStorage.setItem(KEYS.ONBOARDED, value ? "true" : "false");
}

export async function saveLastFaceResult(result) {
  await AsyncStorage.setItem(KEYS.FACE_RESULT, JSON.stringify(result));
}

export async function saveUserProfile(profile) {
  await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
}

// ─── Reset ─────────────────────────────────────────────────────────────

export async function clearAllData() {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
