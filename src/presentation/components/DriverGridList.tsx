import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { Driver } from '../../domain/entities/Driver';
import { GRID_COLUMNS } from '../styles/constants';
import { styles } from '../styles/DriverGridList';
import { ErrorState } from './ErrorState';
import { ItemCard } from './ItemCard';
import { LoadingSpinner } from './LoadingSpinner';

interface DriverGridListProps {
  drivers: Driver[];
  loading: boolean;
  loadingMessage: string;
  error: string | null;
  onRetry: () => void;
  emptyTitle: string;
  emptySubtitle: string;
  onSelectDriver: (driverId: string) => void;
}

export function DriverGridList({
  drivers,
  loading,
  loadingMessage,
  error,
  onRetry,
  emptyTitle,
  emptySubtitle,
  onSelectDriver,
}: DriverGridListProps) {
  if (loading) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        key={`driver-grid-${GRID_COLUMNS}`}
        style={styles.list}
        data={drivers}
        numColumns={GRID_COLUMNS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard driver={item} onPress={() => onSelectDriver(item.id)} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>{emptyTitle}</Text>
            <Text style={styles.emptySubtitle}>{emptySubtitle}</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
