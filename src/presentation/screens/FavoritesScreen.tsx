import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFavoriteDrivers } from '../../application/hooks/useFavoriteDrivers';
import { DriverGridList } from '../components/DriverGridList';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

export function FavoritesScreen({ navigation }: Props) {
  const { drivers, loading, error, retry } = useFavoriteDrivers();

  return (
    <DriverGridList
      drivers={drivers}
      loading={loading}
      loadingMessage="Loading favorites..."
      error={error}
      onRetry={retry}
      emptyTitle="No favorite drivers yet"
      emptySubtitle="Tap the heart icon on any driver's details page to add them to your favorites."
      onSelectDriver={(driverId) =>
        navigation.navigate('Details', { id: driverId })
      }
    />
  );
}
