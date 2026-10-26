# BoxBox

Formula 1 catalog mobile application built with Expo (React Native), TypeScript, and Supabase using Layered Clean Architecture.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- A [Supabase](https://supabase.com/) project (URL and Publishable/Anon Key)
- Expo Go app on your phone (optional, for physical device testing)

## Setup & Running the App

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-supabase-anon-key
```

### 3. Start the development server

```bash
npx expo start
```

Or launch directly on a target platform:

```bash
npm run web      # Run in web browser
npm run android  # Run on Android emulator / connected device
npm run ios      # Run on iOS simulator
```

## Typechecking

```bash
npx tsc --noEmit
```
