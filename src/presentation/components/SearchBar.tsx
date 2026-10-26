import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Driver } from '../../domain/entities/Driver';
import { styles } from '../styles/SearchBar';
import { COLORS, HIT_SLOP } from '../styles/constants';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  onClear: () => void;
  isSearchOpen: boolean;
  searching: boolean;
  results: Driver[];
  onSelectDriver: (driverId: string) => void;
}

export function SearchBar({
  value,
  onChangeText,
  onSearch,
  onClear,
  isSearchOpen,
  searching,
  results,
  onSelectDriver,
}: SearchBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <Ionicons name="search" size={18} color={COLORS.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Search driver by name or code..."
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSearch}
            returnKeyType="search"
            autoCapitalize="none"
            accessible={true}
            accessibilityLabel="Search driver by name or code"
          />
          {(value.length > 0 || isSearchOpen) && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={onClear}
              hitSlop={HIT_SLOP}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={onSearch}
          hitSlop={HIT_SLOP}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Search drivers"
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {isSearchOpen && (
        <View style={styles.dropdown}>
          {searching ? (
            <View style={styles.dropdownLoading}>
              <ActivityIndicator
                size="small"
                color={COLORS.primary}
                accessibilityLabel="Searching drivers"
              />
              <Text style={styles.dropdownLoadingText}>
                Searching drivers...
              </Text>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => onSelectDriver(item.id)}
                  hitSlop={HIT_SLOP}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${item.name}`}
                >
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.dropdownAvatar}
                    />
                  ) : (
                    <View
                      style={[
                        styles.dropdownAvatar,
                        styles.dropdownAvatarPlaceholder,
                      ]}
                    >
                      <Ionicons
                        name="person"
                        size={18}
                        color={COLORS.placeholderText}
                      />
                    </View>
                  )}

                  <View style={styles.dropdownItemInfo}>
                    <Text style={styles.dropdownItemName}>{item.name}</Text>
                    <Text style={styles.dropdownItemMeta}>
                      {item.displaySummary}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.dropdownEmpty}>
                  <Text style={styles.dropdownEmptyText}>
                    {`No drivers found matching "${value}".`}
                  </Text>
                </View>
              }
            />
          )}
        </View>
      )}
    </View>
  );
}
