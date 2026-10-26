import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCatalog } from '../../application/hooks/useCatalog';
import { ItemCard } from '../components/ItemCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { RootStackParamList } from '../navigation/AppNavigator';
import { styles } from '../styles/CatalogScreen';
import { COLORS, HIT_SLOP } from '../theme/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Catalog'>;

const NUM_COLUMNS = 4;

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

    if (distanceFromBottom < 400) {
      loadMore();
    }
  };

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading drivers..." />;
  }

  if (error && drivers.length === 0) {
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
        key={`catalog-grid-${NUM_COLUMNS}`}
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
