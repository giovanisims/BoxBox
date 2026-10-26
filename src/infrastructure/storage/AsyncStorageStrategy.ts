import AsyncStorage from '@react-native-async-storage/async-storage';
import { IStorageStrategy } from '../../domain/contracts/IStorageStrategy';
import { Rating } from '../../domain/entities/Rating';
import {
  parseFavoriteIds,
  parseStoredRatings,
  toDomainRatings,
  toStoredRatingDtos,
} from './dtos/StoredRatingDto';

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

    try {
      return parseFavoriteIds(JSON.parse(rawJson)) ?? [];
    } catch {
      return [];
    }
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

    try {
      const dtos = parseStoredRatings(JSON.parse(rawJson));
      return dtos ? toDomainRatings(dtos) : [];
    } catch {
      return [];
    }
  }

  async saveRatings(userId: string, ratings: Rating[]): Promise<void> {
    const serialized = toStoredRatingDtos(ratings);
    await AsyncStorage.setItem(
      this.getRatingsKey(userId),
      JSON.stringify(serialized)
    );
  }
}
