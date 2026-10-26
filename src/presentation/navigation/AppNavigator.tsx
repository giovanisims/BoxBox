import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../../application/hooks/useAuth';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { COLORS, HIT_SLOP } from '../theme/constants';

export type RootStackParamList = {
  Login: { infoMessage?: string } | undefined;
  SignUp: undefined;
  Catalog: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthenticatedPlaceholderScreen() {
  const { session } = useAuth();

  return (
    <View style={styles.centerContainer}>
      <Text style={styles.welcomeText}>
        Welcome, {session?.user.displayName}!
      </Text>
      <Text style={styles.emailText}>{session?.user.email}</Text>
    </View>
  );
}

export function AppNavigator() {
  const { session, initializing, signOut } = useAuth();

  if (initializing) {
    return <LoadingSpinner message="Restoring session..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {session?.isAuthenticated ? (
          <Stack.Screen
            name="Catalog"
            component={AuthenticatedPlaceholderScreen}
            options={{
              title: 'BoxBox Catalog',
              headerRight: () => (
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={signOut}
                  hitSlop={HIT_SLOP}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Sign out"
                >
                  <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
              ),
            }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  logoutButton: {
    marginRight: 16,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  logoutText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});
