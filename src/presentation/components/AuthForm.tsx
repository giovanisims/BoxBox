import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../styles/AuthScreens';
import { COLORS, HIT_SLOP } from '../styles/constants';

interface AuthFormProps {
  subtitle: string;
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  passwordPlaceholder?: string;
  extraFields?: ReactNode;
  error: string | null;
  infoMessage?: string;
  loading: boolean;
  submitLabel: string;
  submitAccessibilityLabel: string;
  loadingAccessibilityLabel: string;
  onSubmit: () => void;
  switchLabel: string;
  switchAccessibilityLabel: string;
  onSwitch: () => void;
}

export function AuthForm({
  subtitle,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  passwordPlaceholder = 'Password',
  extraFields,
  error,
  infoMessage,
  loading,
  submitLabel,
  submitAccessibilityLabel,
  loadingAccessibilityLabel,
  onSubmit,
  switchLabel,
  switchAccessibilityLabel,
  onSwitch,
}: AuthFormProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {error && (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      )}

      {!error && infoMessage && (
        <Text style={styles.infoText} accessibilityRole="alert">
          {infoMessage}
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={onEmailChange}
        autoCapitalize="none"
        keyboardType="email-address"
        accessible={true}
        accessibilityLabel="Email address"
      />

      <TextInput
        style={styles.input}
        placeholder={passwordPlaceholder}
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
        accessible={true}
        accessibilityLabel="Password"
      />

      {extraFields}

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.disabledButton]}
        onPress={onSubmit}
        disabled={loading}
        hitSlop={HIT_SLOP}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={submitAccessibilityLabel}
        accessibilityState={{ disabled: loading }}
      >
        {loading ? (
          <ActivityIndicator
            color={COLORS.white}
            accessibilityLabel={loadingAccessibilityLabel}
          />
        ) : (
          <Text style={styles.primaryButtonText}>{submitLabel}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchButton}
        onPress={onSwitch}
        hitSlop={HIT_SLOP}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={switchAccessibilityLabel}
      >
        <Text style={styles.switchButtonText}>{switchLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}
