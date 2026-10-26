import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDriverDetails } from '../../application/hooks/useDriverDetails';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { RootStackParamList } from '../navigation/AppNavigator';
import { styles } from '../styles/DetailsScreen';
import { HIT_SLOP } from '../theme/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function DetailsScreen({ route }: Props) {
  const { id } = route.params;
  const { driver, loading, error, retry } = useDriverDetails(id);

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
