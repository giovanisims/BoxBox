import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWatchedDrivers } from '../../application/hooks/useWatchedDrivers';
import { DriverGridList } from '../components/DriverGridList';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Watched'>;

export function WatchedScreen({ navigation }: Props) {
  const { drivers, loading, error, retry } = useWatchedDrivers();

  return (
    <DriverGridList
      drivers={drivers}
      loading={loading}
      loadingMessage="Loading watched drivers..."
      error={error}
      onRetry={retry}
      emptyTitle="No watched races yet"
      emptySubtitle="Open any driver's details page to mark them as watched and rate them from 1 to 5 stars."
      onSelectDriver={(driverId) =>
        navigation.navigate('Details', { id: driverId })
      }
    />
  );
}
