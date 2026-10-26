import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/application/contexts/AuthContext';
import { FavoritesProvider } from './src/application/contexts/FavoritesContext';
import { WatchedProvider } from './src/application/contexts/WatchedContext';
import { AppNavigator } from './src/presentation/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <WatchedProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </WatchedProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
