import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { COLORS } from '../theme/constants';
import { styles } from '../styles/LoadingSpinner';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        accessibilityLabel={message}
      />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}
