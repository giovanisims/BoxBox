import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../../application/hooks/useAuth';
import { defaultHeaderOptions, HeaderRight } from '../components/Header';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CatalogScreen } from '../screens/CatalogScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';

export type RootStackParamList = {
  Login: { infoMessage?: string } | undefined;
  SignUp: undefined;
  Catalog: undefined;
};

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
          <Stack.Screen
            name="Catalog"
            component={CatalogScreen}
            options={{
              headerRight: () => <HeaderRight />,
            }}
          />
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
