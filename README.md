# FoodTruth

FoodTruth is a modern, privacy-focused food scanning application built with Expo and React Native. It empowers users to instantly uncover hidden ingredients, health scores (Nutri-Score, NOVA), and environmental impact data by scanning product barcodes.

## ✨ Features

- **🔍 Smart Scanning**: Instant barcode detection using Expo Camera.
- **📊 Comprehensive Insights**:
  - **Nutri-Score**: Visual health grading (A-E).
  - **NOVA Group**: Processing level analysis (Natural vs. Ultra-processed).
  - **Eco-Score**: Environmental impact assessment.
  - **Ingredient Breakdown**: "Natural vs. Processed" visualization.
- **⚡ Modern UI**: "Pure Clarity" design system inspired by top health apps.
  - Clean, solid card aesthetics.
  - Intuitive navigation with a floating tab bar.
  - Dark Mode support.
- **📝 History**: Locally persisted scan history for quick access.
- **⚙️ Preferences**: Customizable dietary filters (Vegetarian, Vegan, Gluten-Free).

## 🛠 Tech Stack

- **Framework**: [Expo](https://expo.dev) (React Native)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) (v5)
- **Data Source**: [Open Food Facts API](https://world.openfoodfacts.org/)
- **Storage**: AsyncStorage & Expo Secure Store
- **Typography**: Outfit (Headings) & Lexend (Body)

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- `npm` or `yarn`
- [Expo Go](https://expo.dev/client) app installed on your physical device (iOS/Android) OR an Android Emulator/iOS Simulator.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shabari-K-S/FoodTruth.git
   cd FoodTruth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
     or 
   npx expo start --tunnel
   ```

4. **Run the app**
   - **Physical Device**: Scan the QR code displayed in the terminal using the Expo Go app.
   - **Simulator**: Press `i` for iOS Simulator or `a` for Android Emulator in the terminal.

## 📂 Project Structure

```
src/
├── app/                 # Expo Router pages (Screens)
│   ├── (tabs)/          # Main tab navigation
│   ├── product/         # Product details routes
│   └── _layout.tsx      # Root layout & providers
├── components/
│   ├── ui/              # Reusable atoms (Button, Card, Typography)
│   └── features/        # Feature-specific components
├── services/            # API handling (Open Food Facts)
├── providers/           # Context providers (Theme, Query, Auth)
└── theme.ts             # Design system tokens
```

## 🎨 Design System

The app follows a "Pure Clarity" design philosophy:
- **Colors**: Emerald (Health), Yellow (Moderate), Red (Avoid/Processed), Zinc (Neutral).
- **Typography**: Clean sans-serif fonts with clear hierarchy.
- **Layout**: Spacious, card-based interface without unnecessary clutter.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
