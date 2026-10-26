import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../../application/hooks/useFavorites';
import { useWatched } from '../../application/hooks/useWatched';
import { Driver } from '../../domain/entities/Driver';
import { styles } from '../styles/ItemCard';
import { COLORS, HIT_SLOP } from '../theme/constants';

interface ItemCardProps {
  driver: Driver;
  onPress: () => void;
}

const STARS = [1, 2, 3, 4, 5];

export function ItemCard({ driver, onPress }: ItemCardProps) {
  const { isFavorite } = useFavorites();
  const { getRating } = useWatched();

  const favorited = isFavorite(driver.id);
  const currentStars = getRating(driver.id)?.stars ?? 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      hitSlop={HIT_SLOP}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${driver.name}`}
    >
      {driver.imageUrl ? (
        <Image
          source={{ uri: driver.imageUrl }}
          style={styles.image}
          resizeMode="cover"
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel={`Photo of ${driver.name}`}
        />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Photo</Text>
        </View>
      )}

      <View style={styles.info}>
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {driver.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {driver.nationality} • {driver.displayCode}
          </Text>
        </View>

        <View style={styles.indicatorsContainer}>
          <View
            style={styles.starsRow}
            accessible={true}
            accessibilityLabel={`Rated ${currentStars} out of 5 stars`}
          >
            {STARS.map((star) => (
              <Ionicons
                key={star}
                name={star <= currentStars ? 'star' : 'star-outline'}
                size={14}
                color={star <= currentStars ? '#f4a261' : '#cccccc'}
              />
            ))}
          </View>

          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={20}
            color={favorited ? COLORS.primary : COLORS.textSecondary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
