import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../application/hooks/useAuth';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS, HIT_SLOP } from '../theme/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const MIN_PASSWORD_LENGTH = 6;

export function SignUpScreen({ navigation }: Props) {
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signUp(email.trim(), password);
      navigation.navigate('Login', {
        infoMessage: 'Account created! Check your email to confirm, then sign in.',
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BoxBox F1</Text>
      <Text style={styles.subtitle}>Create your account</Text>

      {error && (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        accessible={true}
        accessibilityLabel="Email address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password (min. 6 characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        accessible={true}
        accessibilityLabel="Password"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        accessible={true}
        accessibilityLabel="Confirm password"
      />

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.disabledButton]}
        onPress={handleSignUp}
        disabled={loading}
        hitSlop={HIT_SLOP}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Create account"
        accessibilityState={{ disabled: loading }}
      >
        {loading ? (
          <ActivityIndicator
            color="#fff"
            accessibilityLabel="Creating account"
          />
        ) : (
          <Text style={styles.primaryButtonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => navigation.navigate('Login')}
        hitSlop={HIT_SLOP}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Back to sign in screen"
      >
        <Text style={styles.switchButtonText}>
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  switchButtonText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.errorText,
    backgroundColor: COLORS.errorBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
});
