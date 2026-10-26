import React from 'react';
import {
  ScrollView,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDriverDetails } from '../../application/hooks/useDriverDetails';
import { useFavorites } from '../../application/hooks/useFavorites';
import { useWatched } from '../../application/hooks/useWatched';
import { DriverPhoto } from '../components/DriverPhoto';
import { ErrorState } from '../components/ErrorState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StarRating } from '../components/StarRating';
import { RootStackParamList } from '../navigation/types';
import { styles } from '../styles/DetailsScreen';
import { COLORS, HIT_SLOP } from '../styles/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

function MetaBadge({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{`${label}: ${value}`}</Text>
    </View>
  );
}

interface ToggleActionButtonProps {
  active: boolean;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  inactiveIconColor: string;
  label: string;
  accessibilityLabel: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress: () => void;
}

function ToggleActionButton({
  active,
  iconName,
  inactiveIconColor,
  label,
  accessibilityLabel,
  buttonStyle,
  textStyle,
  onPress,
}: ToggleActionButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.actionButton, buttonStyle]}
      onPress={onPress}
      hitSlop={HIT_SLOP}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active }}
    >
      <Ionicons
        name={iconName}
        size={18}
        color={active ? COLORS.white : inactiveIconColor}
      />
      <Text
        style={[
          styles.actionButtonText,
          textStyle,
          active && styles.actionButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

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
      <ErrorState
        message={error || 'Driver not found.'}
        onRetry={retry}
      />
    );
  }

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
    >
      <DriverPhoto
        imageUrl={driver.imageUrl}
        driverName={driver.name}
        style={styles.image}
      />

      <Text style={styles.title}>{driver.name}</Text>

      <View style={styles.actionsRow}>
        <ToggleActionButton
          active={favorited}
          iconName={favorited ? 'heart' : 'heart-outline'}
          inactiveIconColor={COLORS.primary}
          label={favorited ? 'Favorited' : 'Add to Favorites'}
          accessibilityLabel={
            favorited
              ? `Remove ${driver.name} from favorites`
              : `Add ${driver.name} to favorites`
          }
          buttonStyle={favorited && styles.actionButtonActive}
          onPress={() => toggleFavorite(driver.id)}
        />

        <ToggleActionButton
          active={watched}
          iconName={watched ? 'checkmark-circle' : 'add-circle-outline'}
          inactiveIconColor={COLORS.secondary}
          label={watched ? 'Watched Race' : 'Mark Watched Race'}
          accessibilityLabel={
            watched
              ? `Unmark ${driver.name} as watched race`
              : `Mark ${driver.name} as watched race`
          }
          buttonStyle={[
            styles.watchedButton,
            watched && styles.watchedButtonActive,
          ]}
          textStyle={styles.watchedButtonText}
          onPress={() => toggleWatched(driver.id)}
        />
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>Rate Driver (1–5):</Text>
        <StarRating
          rating={currentStars}
          size={26}
          onRate={(stars) => rateDriver(driver.id, stars)}
        />
      </View>

      <View style={styles.metaRow}>
        <MetaBadge label="Nationality" value={driver.nationality} />
        <MetaBadge label="Number" value={driver.displayNumber} />
        <MetaBadge label="Code" value={driver.displayCode} />
        {driver.dateOfBirth && (
          <MetaBadge label="Born" value={driver.dateOfBirth} />
        )}
      </View>

      <Text style={styles.sectionHeader}>Biography</Text>
      <Text style={styles.bioText}>{driver.cleanBio}</Text>
    </ScrollView>
  );
}
