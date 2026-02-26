/**
 * PixelBridge v2
 * 
 * Hidden WebView that extracts face color data from photos.
 * Uses the browser FaceDetector API (available in WebView/Chrome) for
 * accurate face bounding box detection, then places sampling points
 * based on facial geometry. Falls back to heuristic placement if
 * FaceDetector is unavailable.
 * 
 * Key improvements over v1:
 * - Uses FaceDetector API for real face bounding box
 * - Eye sampling uses the darkest-cluster approach to find iris vs skin
 * - Tighter sampling radii for eyes
 * - Better face proportion math based on the extension's approach
 */

import React, { useRef, useImperativeHandle, forwardRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const BRIDGE_HTML = `
<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;">
<canvas id="c" style="display:none;"></canvas>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

// ─── Pixel extraction helpers ────────────────────────────────────

function extractCircle(imageData, cx, cy, radius) {
  const { width, height, data } = imageData;
  const pixels = [];
  const r2 = radius * radius;
  const minX = Math.max(0, Math.floor(cx - radius));
  const maxX = Math.min(width - 1, Math.ceil(cx + radius));
  const minY = Math.max(0, Math.floor(cy - radius));
  const maxY = Math.min(height - 1, Math.ceil(cy + radius));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if ((x - cx) * (x - cx) + (y - cy) * (y - cy) > r2) continue;
      const idx = (y * width + x) * 4;
      pixels.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
    }
  }
  return pixels;
}

function averageColors(colors) {
  if (!colors.length) return { r: 128, g: 128, b: 128 };
  const t = colors.reduce((a, c) => ({ r: a.r + c.r, g: a.g + c.g, b: a.b + c.b }), { r: 0, g: 0, b: 0 });
  return { r: Math.round(t.r / colors.length), g: Math.round(t.g / colors.length), b: Math.round(t.b / colors.length) };
}

function luminance(p) { return 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b; }

function toHsl(p) {
  const rn = p.r / 255, gn = p.g / 255, bn = p.b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s: s * 100, l: l * 100 };
}

// ─── Skin pixel filter ───────────────────────────────────────────

function filterSkin(pixels) {
  return pixels.filter(p => {
    const hsl = toHsl(p);
    const isSkin = (hsl.h >= 8 && hsl.h <= 58) || (hsl.h >= 340 && hsl.h <= 360);
    return isSkin && hsl.s >= 8 && hsl.s <= 68 && hsl.l >= 18 && hsl.l <= 92;
  });
}

// ─── Iris pixel extraction (smarter than simple filter) ──────────
// The iris is typically the darkest, most saturated cluster in the
// eye region. We sort by luminance and take the darkest 40% that
// also has some saturation — this avoids picking up skin, sclera,
// or eyelid pixels.

function extractIrisPixels(pixels) {
  if (pixels.length < 5) return pixels;
  
  // Sort by luminance (darkest first)
  const withLuma = pixels.map(p => ({ ...p, luma: luminance(p) }));
  withLuma.sort((a, b) => a.luma - b.luma);
  
  // Take the darkest 40%
  const darkPool = withLuma.slice(0, Math.max(5, Math.floor(pixels.length * 0.4)));
  
  // From those, prefer ones with some saturation (iris has color, shadows don't)
  const withSat = darkPool.filter(p => {
    const hsl = toHsl(p);
    return hsl.s >= 4;
  });
  
  // If we got enough saturated dark pixels, use those; otherwise use all dark pixels
  const pool = withSat.length >= 5 ? withSat : darkPool;
  
  // Remove the very darkest 10% (likely pupil or eyelashes)
  const trimmed = pool.slice(Math.floor(pool.length * 0.1));
  
  return trimmed.length >= 3 ? trimmed : pool;
}

// ─── Robust averaging with luminance trimming ────────────────────

function quantile(arr, q) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  return sorted[base];
}

function robustAverage(pixels, trimLow, trimHigh) {
  if (!pixels.length) return { r: 128, g: 128, b: 128 };
  const lumas = pixels.map(luminance);
  const lo = quantile(lumas, trimLow);
  const hi = quantile(lumas, trimHigh);
  const trimmed = pixels.filter(p => { const l = luminance(p); return l >= lo && l <= hi; });
  return averageColors(trimmed.length ? trimmed : pixels);
}

// ─── White balance ───────────────────────────────────────────────

function computeWBGains(pixels) {
  if (!pixels.length) return { r: 1, g: 1, b: 1 };
  const mids = pixels.filter(p => { const l = luminance(p); return l > 45 && l < 210; });
  const set = mids.length >= 80 ? mids : pixels;
  const mean = averageColors(set);
  const gray = (mean.r + mean.g + mean.b) / 3;
  return {
    r: clamp(gray / Math.max(mean.r, 1), 0.82, 1.18),
    g: clamp(gray / Math.max(mean.g, 1), 0.82, 1.18),
    b: clamp(gray / Math.max(mean.b, 1), 0.82, 1.18)
  };
}

function applyWB(p, g) {
  return {
    r: clamp(Math.round(p.r * g.r), 0, 255),
    g: clamp(Math.round(p.g * g.g), 0, 255),
    b: clamp(Math.round(p.b * g.b), 0, 255)
  };
}

// ─── Sample a region ─────────────────────────────────────────────

function sampleSkinRegion(imageData, cx, cy, radius, gains) {
  const raw = extractCircle(imageData, cx, cy, radius).map(p => applyWB(p, gains));
  const filtered = filterSkin(raw);
  const base = filtered.length >= 20 ? filtered : raw;
  return robustAverage(base, 0.16, 0.84);
}

function sampleEyeRegion(imageData, cx, cy, radius, gains) {
  const raw = extractCircle(imageData, cx, cy, radius).map(p => applyWB(p, gains));
  const irisPixels = extractIrisPixels(raw);
  return averageColors(irisPixels);
}

// ─── Face detection ──────────────────────────────────────────────

async function detectFace(canvas) {
  // Try FaceDetector API (available in Chrome WebView)
  if ('FaceDetector' in window) {
    try {
      const detector = new FaceDetector({ fastMode: false, maxDetectedFaces: 1 });
      const faces = await detector.detect(canvas);
      if (faces && faces.length > 0) {
        const box = faces[0].boundingBox;
        // Also try to get eye landmarks
        const landmarks = faces[0].landmarks || [];
        const leftEyeLm = landmarks.find(l => l.type === 'eye' && l.locations?.[0]);
        const rightEyeLm = landmarks.find((l, i) => l.type === 'eye' && i > 0 && l.locations?.[0]);
        
        return {
          detected: true,
          box: { x: box.x, y: box.y, width: box.width, height: box.height },
          eyeLandmarks: {
            left: leftEyeLm?.locations?.[0] || null,
            right: rightEyeLm?.locations?.[0] || null
          }
        };
      }
    } catch (e) {
      // FaceDetector failed, fall through to heuristic
    }
  }
  
  // Heuristic fallback: assume face is centered in a selfie
  const w = canvas.width;
  const h = canvas.height;
  return {
    detected: false,
    box: {
      x: w * 0.2,
      y: h * 0.08,
      width: w * 0.6,
      height: h * 0.72
    },
    eyeLandmarks: { left: null, right: null }
  };
}

// ─── Main analysis ───────────────────────────────────────────────

async function analyzeImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      // Scale down for performance
      const maxDim = 640;
      let w = img.width, h = img.height;
      if (w > maxDim || h > maxDim) {
        const scale = maxDim / Math.max(w, h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);

      // Detect face
      const face = await detectFace(canvas);
      const box = face.box;
      const faceCenter = { x: box.x + box.width / 2, y: box.y + box.height / 2 };

      // Compute white balance from face region
      const wbRadius = Math.min(box.width, box.height) * 0.4;
      const facePixels = extractCircle(imageData, faceCenter.x, faceCenter.y, wbRadius);
      const gains = computeWBGains(facePixels);

      // ─── Sampling points based on face box ─────────────────────
      // Skin: forehead, both cheeks, chin
      // Eyes: use landmarks if available, otherwise estimate from box

      const skinRadius = Math.max(6, Math.round(box.width * 0.08));
      const eyeRadius = Math.max(4, Math.round(box.width * 0.045));

      const skinPoints = {
        forehead: {
          x: faceCenter.x,
          y: box.y + box.height * 0.18
        },
        leftCheek: {
          x: box.x + box.width * 0.25,
          y: box.y + box.height * 0.58
        },
        rightCheek: {
          x: box.x + box.width * 0.75,
          y: box.y + box.height * 0.58
        },
        chin: {
          x: faceCenter.x,
          y: box.y + box.height * 0.85
        }
      };

      // Eye positions: use detected landmarks or estimate
      let leftEyePos, rightEyePos;
      if (face.eyeLandmarks.left && face.eyeLandmarks.right) {
        leftEyePos = face.eyeLandmarks.left;
        rightEyePos = face.eyeLandmarks.right;
      } else {
        // Standard facial proportions: eyes at ~38% down the face,
        // ~30% in from each side of the face box
        leftEyePos = {
          x: box.x + box.width * 0.32,
          y: box.y + box.height * 0.38
        };
        rightEyePos = {
          x: box.x + box.width * 0.68,
          y: box.y + box.height * 0.38
        };
      }

      // Sample skin regions
      const samples = {};
      for (const [name, pos] of Object.entries(skinPoints)) {
        const rgb = sampleSkinRegion(imageData, pos.x, pos.y, skinRadius, gains);
        samples[name] = { rgb, type: 'skin', x: pos.x / w, y: pos.y / h };
      }

      // Sample eye regions with iris-specific extraction
      samples.leftEye = {
        rgb: sampleEyeRegion(imageData, leftEyePos.x, leftEyePos.y, eyeRadius, gains),
        type: 'eye',
        x: leftEyePos.x / w,
        y: leftEyePos.y / h
      };
      samples.rightEye = {
        rgb: sampleEyeRegion(imageData, rightEyePos.x, rightEyePos.y, eyeRadius, gains),
        type: 'eye',
        x: rightEyePos.x / w,
        y: rightEyePos.y / h
      };

      resolve({
        samples,
        imageSize: { width: w, height: h },
        faceDetected: face.detected,
        faceBox: box,
        gains
      });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

// ─── Message handlers ────────────────────────────────────────────

async function handleMessage(e) {
  try {
    const msg = JSON.parse(e.data);
    if (msg.type === 'analyze') {
      const result = await analyzeImage(msg.dataUrl);
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'result',
        data: result
      }));
    }
  } catch (err) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'error',
      message: err.message || 'Unknown error'
    }));
  }
}

window.addEventListener('message', handleMessage);
document.addEventListener('message', handleMessage);

window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
</script>
</body>
</html>
`;

const PixelBridge = forwardRef(function PixelBridge(props, ref) {
  const webViewRef = useRef(null);
  const pendingResolve = useRef(null);
  const pendingReject = useRef(null);
  const [ready, setReady] = useState(false);

  useImperativeHandle(ref, () => ({
    analyzeImage: (base64DataUrl) => {
      return new Promise((resolve, reject) => {
        if (!webViewRef.current) {
          reject(new Error("WebView not ready"));
          return;
        }
        pendingResolve.current = resolve;
        pendingReject.current = reject;

        const message = JSON.stringify({ type: "analyze", dataUrl: base64DataUrl });
        webViewRef.current.postMessage(message);
      });
    },
    isReady: () => ready,
  }));

  const handleMessage = (event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === "ready") {
        setReady(true);
      } else if (msg.type === "result" && pendingResolve.current) {
        pendingResolve.current(msg.data);
        pendingResolve.current = null;
        pendingReject.current = null;
      } else if (msg.type === "error" && pendingReject.current) {
        pendingReject.current(new Error(msg.message));
        pendingResolve.current = null;
        pendingReject.current = null;
      }
    } catch (e) {
      // Ignore parse errors
    }
  };

  return (
    <View style={styles.hidden}>
      <WebView
        ref={webViewRef}
        source={{ html: BRIDGE_HTML }}
        onMessage={handleMessage}
        javaScriptEnabled
        originWhitelist={["*"]}
        style={styles.webview}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  hidden: {
    width: 0,
    height: 0,
    overflow: "hidden",
    position: "absolute",
  },
  webview: {
    width: 1,
    height: 1,
  },
});

export default PixelBridge;