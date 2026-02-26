# IRL Color App

Mobile app for personal color season analysis, built with React Native and Expo.

## Overview

IRL Color helps users:
- discover a color season with guided face analysis
- manually choose from all seasons
- check whether colors fit a selected season
- save favorite colors locally on device
- browse season guidance (palettes, neutrals, metals)

The app uses local persistence with `@react-native-async-storage/async-storage`.

## Tech Stack

- React Native
- Expo SDK 54
- React Navigation (stack + tabs)
- AsyncStorage for local state

## Project Structure

```text
.
|-- App.js
|-- app.json
|-- babel.config.js
|-- package.json
`-- src/
    |-- components/
    |-- data/
    |-- navigation/
    |-- screens/
    |-- services/
    |-- theme/
    `-- utils/
```

## Prerequisites

- Node.js 18+
- npm
- Expo Go (optional, for running on a physical device)

## Getting Started

```bash
npm install
npx expo start
```

Then choose one of:
- scan the QR code with Expo Go
- press `a` for Android emulator
- press `i` for iOS simulator
- press `w` for web

## Available Scripts

- `npm run start` - start Expo
- `npm run web` - start Expo in web mode

## Key Screens

- `Home` - season summary, saved colors, quick actions
- `Color Checker` - test colors against season logic
- `Face Analysis` - guided analysis flow
- `Season Picker` - manual season selection
- `Season Guide` - season palette details
- `Profile` - user data and app settings

## Notes

- `src/utils/color-logic.js` contains core scoring/matching logic.
- `src/services/storage.js` is the storage abstraction layer.
- Some placeholder symbols/icons in navigation are text-based and can be replaced with an icon pack later.
