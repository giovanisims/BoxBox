import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  NativeStackHeaderProps,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { useAuth } from '../../application/hooks/useAuth';
import { useDriverSearch } from '../../application/hooks/useDriverSearch';
import { styles } from '../styles/Header';
import { COLORS, HIT_SLOP } from '../styles/constants';
import { SearchBar } from './SearchBar';

interface HeaderNavButtonProps {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
}

function HeaderNavButton({
  iconName,
  iconColor,
  label,
  accessibilityLabel,
  onPress,
}: HeaderNavButtonProps) {
  return (
    <TouchableOpacity
      style={styles.navButton}
      onPress={onPress}
      hitSlop={HIT_SLOP}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons name={iconName} size={16} color={iconColor} />
      <Text style={styles.navButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function AppHeader({ navigation, back }: NativeStackHeaderProps) {
  const { signOut } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    searching,
    isSearchOpen,
    executeSearch,
    clearSearch,
  } = useDriverSearch();

  return (
    <View style={styles.headerBar}>
      <View style={styles.leftSection}>
        {back && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={navigation.goBack}
            hitSlop={HIT_SLOP}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate('Catalog')}
          hitSlop={HIT_SLOP}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Go to catalog home"
        >
          <Text style={styles.headerTitle}>BoxBox</Text>
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSearch={executeSearch}
        onClear={clearSearch}
        isSearchOpen={isSearchOpen}
        searching={searching}
        results={searchResults}
        onSelectDriver={(driverId) => {
          clearSearch();
          navigation.navigate('Details', { id: driverId });
        }}
      />

      <View style={styles.rightContainer}>
        <HeaderNavButton
          iconName="heart"
          iconColor={COLORS.primary}
          label="Favorites"
          accessibilityLabel="Go to favorites"
          onPress={() => navigation.navigate('Favorites')}
        />

        <HeaderNavButton
          iconName="star"
          iconColor={COLORS.star}
          label="Watched"
          accessibilityLabel="Go to watched drivers"
          onPress={() => navigation.navigate('Watched')}
        />

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
