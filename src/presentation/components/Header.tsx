import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useAuth } from '../../application/hooks/useAuth';
import { styles } from '../styles/Header';
import { HIT_SLOP } from '../theme/constants';

export function HeaderRight() {
  const { signOut } = useAuth();

  return (
    <View style={styles.rightContainer}>
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
    </View>
  );
}

export const defaultHeaderOptions: NativeStackNavigationOptions = {
  title: 'BoxBox',
  headerTitleStyle: styles.headerTitle,
  contentStyle: {
    flex: 1,
  },
};
