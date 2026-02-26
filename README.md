# IRL Color — React Native App

A mobile app for personal color season analysis, built with React Native and Expo. Companion to the IRL Color browser extension.

## Architecture

```
irl-app/
├── App.js                          # Entry point
├── app.json                        # Expo config
├── package.json                    # Dependencies
├── babel.config.js
└── src/
    ├── components/                 # Reusable UI components
    │   ├── Button.js
    │   ├── Card.js
    │   ├── ColorSwatch.js
    │   ├── ConfidenceBar.js
    │   ├── SeasonBadge.js
    │   ├── SwatchRow.js
    │   └── VerdictPill.js
    ├── data/
    │   └── seasons.js              # All season reference data
    ├── navigation/
    │   └── AppNavigator.js         # Tab + stack navigation
    ├── screens/
    │   ├── HomeScreen.js           # Dashboard with season overview
    │   ├── SeasonPickerScreen.js   # Choose/change your season
    │   ├── SeasonGuideScreen.js    # Detailed palette guide
    │   ├── ColorCheckerScreen.js   # Check if a color matches
    │   ├── FaceAnalysisScreen.js   # Color quiz / photo analysis
    │   └── ProfileScreen.js        # Settings and data management
    ├── services/
    │   └── storage.js              # AsyncStorage wrapper
    ├── theme/
    │   └── index.js                # Design system tokens
    └── utils/
        ├── color-logic.js          # Ported from extension (unchanged)
        └── face-analysis.js        # Face analysis utilities
```

## What's Ported from the Extension

| Extension File | App Equivalent | Status |
|---|---|---|
| `utils/color-logic.js` | `src/utils/color-logic.js` | **Direct port** — unchanged |
| Face analysis (popup.js) | `src/utils/face-analysis.js` | Ported, no DOM deps |
| Season swatches/data (popup.js) | `src/data/seasons.js` | Extracted to standalone module |
| Chrome storage | `src/services/storage.js` | Replaced with AsyncStorage |
| Popup UI | `src/screens/*` | Rebuilt as native screens |

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your iPhone (from the App Store)
- Xcode (for iOS simulator, optional)

### Setup
```bash
cd irl-app
npm install
npx expo start
```

Scan the QR code with Expo Go on your iPhone, or press `i` to open in iOS simulator.

## Screens

### Home
Main dashboard showing your season badge, palette, neutrals, best metal, and saved colors. Quick action cards link to Color Checker, Face Analysis, and Season Guide.

### Color Checker
Enter a hex code or tap preset colors to check if they match your season. Supports both clothing and makeup modes (lipstick, blush, eyeshadow, foundation). Save colors you like.

### Face Analysis
Guided color quiz that determines your season based on undertone, eye color, contrast, and depth. Photo-based analysis (using the ported pixel-level face analysis from the extension) is architected but needs a native image pixel bridge to activate.

### Season Guide
Browse all 16 seasons with detailed palettes, neutrals, best metals, and hair color recommendations. Horizontally scrollable season tabs.

### Season Picker
Visual grid of all 16 seasons with mini-swatch previews. Tap to select, see description, and save.

### Profile
View your season, stats, and manage data. Links to all features.

## Next Steps

### Immediate
1. **Install and test**: Run `npx expo start` and test on your phone
2. **Add icons**: Replace placeholder tab icons with actual icon set (lucide-react-native or expo vector icons)
3. **Polish animations**: Add Reanimated transitions between screens and states

### Short-term
4. **Photo-based face analysis**: Integrate expo-camera + a pixel extraction bridge (react-native-skia or a backend endpoint) to run the full face analysis pipeline on real photos
5. **Backend + Auth**: Set up Firebase/Supabase for user accounts, so the extension can authenticate against the same system
6. **Sync favorites**: Store saved colors in the cloud so they appear in both app and extension

### Medium-term
7. **Product recommendations**: Connect to retailer APIs to suggest actual products in the user's season
8. **Community features**: Share your season, see what others with your season are wearing
9. **App Store submission**: Screenshots, App Store listing, TestFlight beta

## Shared Logic with Extension

The `src/utils/color-logic.js` file is an exact copy of the extension's `utils/color-logic.js`. When you update the scoring algorithm or palette ranges in one, copy it to the other. Eventually, this should be extracted into a shared npm package that both projects import.

## Design System

The theme (`src/theme/index.js`) uses a warm, fashion-forward palette:
- **Accent**: Terracotta (#C8704A) — works across all season contexts
- **Background**: Warm off-white (#FAFAF8)
- **Typography**: Clean hierarchy with 8 type styles
- **Shadows**: Three levels (sm, md, lg)
- **Spacing**: 6-step scale from xs (4) to xxl (48)
