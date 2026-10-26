import React from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, HIT_SLOP, RATING_STARS } from '../styles/constants';
import { styles } from '../styles/StarRating';

interface StarRatingProps {
  rating: number;
  size?: number;
  onRate?: (stars: number) => void;
  style?: StyleProp<ViewStyle>;
}

function StarIcon({ filled, size }: { filled: boolean; size: number }) {
  return (
    <Ionicons
      name={filled ? 'star' : 'star-outline'}
      size={size}
      color={filled ? COLORS.star : COLORS.starInactive}
    />
  );
}

export function StarRating({ rating, size = 14, onRate, style }: StarRatingProps) {
  if (!onRate) {
    return (
      <View
        style={[styles.row, style]}
        accessible={true}
        accessibilityLabel={`Rated ${rating} out of 5 stars`}
      >
        {RATING_STARS.map((star) => (
          <StarIcon key={star} filled={star <= rating} size={size} />
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.row, styles.interactiveRow, style]}>
      {RATING_STARS.map((star) => (
        <TouchableOpacity
          key={star}
          style={styles.starButton}
          onPress={() => onRate(star)}
          hitSlop={HIT_SLOP}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Rate ${star} ${star === 1 ? 'star' : 'stars'}`}
          accessibilityState={{ selected: rating === star }}
        >
          <StarIcon filled={star <= rating} size={size} />
        </TouchableOpacity>
      ))}
    </View>
  );
}
