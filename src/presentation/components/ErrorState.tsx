import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { HIT_SLOP } from '../styles/constants';
import { styles } from '../styles/ErrorState';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText} accessibilityRole="alert">
        {message}
      </Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={onRetry}
        hitSlop={HIT_SLOP}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Try again"
      >
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}
