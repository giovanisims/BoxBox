import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFavoriteDrivers } from '../../application/hooks/useFavoriteDrivers';
import { ItemCard } from '../components/ItemCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { RootStackParamList } from '../navigation/AppNavigator';
import { styles } from '../styles/FavoritesScreen';
import { HIT_SLOP } from '../theme/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

const NUM_COLUMNS = 4;

export function FavoritesScreen({ navigation }: Props) {
  const { drivers, loading, error, retry } = useFavoriteDrivers();

  if (loading) {
    return <LoadingSpinner message="Loading favorites..." />;
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
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
    <View style={styles.container}>
      <FlatList
        key={`favorites-grid-${NUM_COLUMNS}`}
        style={styles.list}
        data={drivers}
        numColumns={NUM_COLUMNS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard
            driver={item}
            onPress={() => navigation.navigate('Details', { id: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No favorite drivers yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart icon on any driver card or details page to add them
              to your favorites.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
