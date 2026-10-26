import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDriverDetails } from '../../application/hooks/useDriverDetails';
import { useFavorites } from '../../application/hooks/useFavorites';
import { useWatched } from '../../application/hooks/useWatched';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { RootStackParamList } from '../navigation/AppNavigator';
import { styles } from '../styles/DetailsScreen';
import { COLORS, HIT_SLOP } from '../theme/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

const STARS = [1, 2, 3, 4, 5];

export function DetailsScreen({ route }: Props) {
  const { id } = route.params;
  const { driver, loading, error, retry } = useDriverDetails(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isWatched, getRating, toggleWatched, rateDriver } = useWatched();

  const favorited = isFavorite(id);
  const watched = isWatched(id);
  const currentStars = getRating(id)?.stars ?? 0;

  if (loading) {
    return <LoadingSpinner message="Loading driver details..." />;
  }

  if (error || !driver) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText} accessibilityRole="alert">
          {error || 'Driver not found.'}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={retry}
          hitSlop={HIT_SLOP}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Try again"
        >
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
    >
      {driver.imageUrl ? (
        <Image
          source={{ uri: driver.imageUrl }}
          style={styles.image}
          resizeMode="cover"
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel={`High resolution photo of ${driver.name}`}
        />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Photo</Text>
        </View>
      )}

      <Text style={styles.title}>{driver.name}</Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, favorited && styles.actionButtonActive]}
          onPress={() => toggleFavorite(driver.id)}
          hitSlop={HIT_SLOP}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={
            favorited
              ? `Remove ${driver.name} from favorites`
              : `Add ${driver.name} to favorites`
          }
          accessibilityState={{ selected: favorited }}
        >
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={18}
            color={favorited ? '#ffffff' : COLORS.primary}
          />
          <Text
            style={[
              styles.actionButtonText,
              favorited && styles.actionButtonTextActive,
            ]}
          >
            {favorited ? 'Favorited' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.watchedButton,
            watched && styles.watchedButtonActive,
          ]}
          onPress={() => toggleWatched(driver.id)}
          hitSlop={HIT_SLOP}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={
            watched
              ? `Unmark ${driver.name} as watched race`
              : `Mark ${driver.name} as watched race`
          }
          accessibilityState={{ selected: watched }}
        >
          <Ionicons
            name={watched ? 'checkmark-circle' : 'add-circle-outline'}
            size={18}
            color={watched ? '#ffffff' : COLORS.secondary}
          />
          <Text
            style={[
              styles.actionButtonText,
              styles.watchedButtonText,
              watched && styles.actionButtonTextActive,
            ]}
          >
            {watched ? 'Watched Race' : 'Mark Watched Race'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>Rate Driver (1–5):</Text>
        {STARS.map((star) => (
          <TouchableOpacity
            key={star}
            style={styles.starButton}
            onPress={() => rateDriver(driver.id, star)}
            hitSlop={HIT_SLOP}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${star} stars`}
            accessibilityState={{ selected: currentStars === star }}
          >
            <Ionicons
              name={star <= currentStars ? 'star' : 'star-outline'}
              size={26}
              color={star <= currentStars ? '#f4a261' : '#cccccc'}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.metaRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Nationality: {driver.nationality}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Number: {driver.displayNumber}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Code: {driver.displayCode}</Text>
        </View>
        {driver.dateOfBirth && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Born: {driver.dateOfBirth}</Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionHeader}>Biography</Text>
      <Text style={styles.bioText}>{driver.cleanBio}</Text>
    </ScrollView>
  );
}
