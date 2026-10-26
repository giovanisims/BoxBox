import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { useAuth } from '../../application/hooks/useAuth';
import { RootStackParamList } from '../navigation/AppNavigator';
import { styles } from '../styles/Header';
import { COLORS, HIT_SLOP } from '../theme/constants';

export function HeaderRight() {
  const { signOut } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.rightContainer}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Favorites')}
        hitSlop={HIT_SLOP}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Go to favorites"
      >
        <Ionicons name="heart" size={16} color={COLORS.primary} />
        <Text style={styles.navButtonText}>Favorites</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Watched')}
        hitSlop={HIT_SLOP}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Go to watched drivers"
      >
        <Ionicons name="star" size={16} color="#f4a261" />
        <Text style={styles.navButtonText}>Watched</Text>
      </TouchableOpacity>

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
