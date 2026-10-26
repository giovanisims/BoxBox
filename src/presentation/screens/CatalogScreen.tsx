import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  SCROLL_THRESHOLD_PX,
  useCatalog,
} from '../../application/hooks/useCatalog';
import { ErrorState } from '../components/ErrorState';
import { ItemCard } from '../components/ItemCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { RootStackParamList } from '../navigation/types';
import { styles } from '../styles/CatalogScreen';
import { COLORS, GRID_COLUMNS } from '../styles/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Catalog'>;

export function CatalogScreen({ navigation }: Props) {
  const {
    drivers,
    loading,
    loadingNext,
    refreshing,
    error,
    refresh,
    loadMore,
    retry,
  } = useCatalog();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - (layoutMeasurement.height + contentOffset.y);

    if (distanceFromBottom < SCROLL_THRESHOLD_PX) {
      loadMore();
    }
  };

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading drivers..." />;
  }

  if (error && drivers.length === 0) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        key={`catalog-grid-${GRID_COLUMNS}`}
        style={styles.list}
        data={drivers}
        numColumns={GRID_COLUMNS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard
            driver={item}
            onPress={() => navigation.navigate('Details', { id: item.id })}
          />
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={COLORS.primary}
          />
        }
        ListFooterComponent={
          loadingNext ? (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={styles.footerLoader}
              accessibilityLabel="Loading more drivers"
            />
          ) : undefined
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
