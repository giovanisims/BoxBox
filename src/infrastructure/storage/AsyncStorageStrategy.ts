import AsyncStorage from '@react-native-async-storage/async-storage';
import { IStorageStrategy } from '../../domain/contracts/IStorageStrategy';
import { Rating } from '../../domain/entities/Rating';

interface StoredRating {
  driverId: string;
  stars: number;
}

export class AsyncStorageStrategy implements IStorageStrategy {
  private getFavoritesKey(userId: string): string {
    return `@boxbox_favorites_${userId}`;
  }

  private getRatingsKey(userId: string): string {
    return `@boxbox_ratings_${userId}`;
  }

  async getFavoriteIds(userId: string): Promise<string[]> {
    const rawJson = await AsyncStorage.getItem(this.getFavoritesKey(userId));
    if (!rawJson) return [];
    return JSON.parse(rawJson);
  }

  async saveFavoriteIds(userId: string, driverIds: string[]): Promise<void> {
    await AsyncStorage.setItem(
      this.getFavoritesKey(userId),
      JSON.stringify(driverIds)
    );
  }

  async getRatings(userId: string): Promise<Rating[]> {
    const rawJson = await AsyncStorage.getItem(this.getRatingsKey(userId));
    if (!rawJson) return [];

    const parsed: StoredRating[] = JSON.parse(rawJson);
    return parsed.map((item) => new Rating(item.driverId, item.stars));
  }

  async saveRatings(userId: string, ratings: Rating[]): Promise<void> {
    const serialized: StoredRating[] = ratings.map((r) => ({
      driverId: r.driverId,
      stars: r.stars,
    }));
    await AsyncStorage.setItem(
      this.getRatingsKey(userId),
      JSON.stringify(serialized)
    );
  }
}
