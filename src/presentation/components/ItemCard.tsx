import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../../application/hooks/useFavorites';
import { useWatched } from '../../application/hooks/useWatched';
import { Driver } from '../../domain/entities/Driver';
import { styles } from '../styles/ItemCard';
import { COLORS, HIT_SLOP } from '../styles/constants';
import { DriverPhoto } from './DriverPhoto';
import { StarRating } from './StarRating';

interface ItemCardProps {
  driver: Driver;
  onPress: () => void;
}

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
      <DriverPhoto
        imageUrl={driver.imageUrl}
        driverName={driver.name}
        style={styles.image}
      />

      <View style={styles.info}>
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {driver.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {driver.displaySummary}
          </Text>
        </View>

        <View style={styles.indicatorsContainer}>
          <StarRating rating={currentStars} size={14} />

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
