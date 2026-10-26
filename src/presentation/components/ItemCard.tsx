import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Driver } from '../../domain/entities/Driver';
import { HIT_SLOP } from '../theme/constants';
import { styles } from '../styles/ItemCard';

interface ItemCardProps {
  driver: Driver;
  onPress: () => void;
}

export function ItemCard({ driver, onPress }: ItemCardProps) {
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
        <Text style={styles.name} numberOfLines={1}>
          {driver.name}
        </Text>
        <Text style={styles.meta}>
          {driver.nationality} • {driver.displayCode}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
