import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWatchedDrivers } from '../../application/hooks/useWatchedDrivers';
import { ItemCard } from '../components/ItemCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { RootStackParamList } from '../navigation/AppNavigator';
import { styles } from '../styles/FavoritesScreen';
import { HIT_SLOP } from '../theme/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Watched'>;

const NUM_COLUMNS = 4;

export function WatchedScreen({ navigation }: Props) {
  const { items, loading, error, retry } = useWatchedDrivers();

  if (loading) {
    return <LoadingSpinner message="Loading watched drivers..." />;
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
        key={`watched-grid-${NUM_COLUMNS}`}
        style={styles.list}
        data={items}
        numColumns={NUM_COLUMNS}
        keyExtractor={(item) => item.driver.id}
        renderItem={({ item }) => (
          <ItemCard
            driver={item.driver}
            onPress={() =>
              navigation.navigate('Details', { id: item.driver.id })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No watched races yet</Text>
            <Text style={styles.emptySubtitle}>
              Open any driver's details page to mark them as watched and rate
              them from 1 to 5 stars.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
