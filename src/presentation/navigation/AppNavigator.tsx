import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../../application/hooks/useAuth';
import { AppHeader, defaultHeaderOptions } from '../components/Header';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CatalogScreen } from '../screens/CatalogScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { WatchedScreen } from '../screens/WatchedScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { session, initializing } = useAuth();

  if (initializing) {
    return <LoadingSpinner message="Restoring session..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={defaultHeaderOptions}>
        {session?.isAuthenticated ? (
          <Stack.Group
            screenOptions={{
              header: (props) => <AppHeader {...props} />,
            }}
          >
            <Stack.Screen name="Catalog" component={CatalogScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="Watched" component={WatchedScreen} />
          </Stack.Group>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
