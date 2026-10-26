import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/application/contexts/AuthContext';
import { AppNavigator } from './src/presentation/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
