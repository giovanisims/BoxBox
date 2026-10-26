import { IStorageStrategy } from '../../domain/contracts/IStorageStrategy';
import { Rating } from '../../domain/entities/Rating';
import { AsyncStorageStrategy } from '../storage/AsyncStorageStrategy';
import {
  parseFavoriteIds,
  parseStoredRatings,
  toDomainRatings,
  toStoredRatingDtos,
} from '../storage/dtos/StoredRatingDto';
import { supabase } from './supabaseClient';

export class SupabaseStorageStrategy implements IStorageStrategy {
  constructor(
    private readonly localCache: IStorageStrategy = new AsyncStorageStrategy()
  ) {}

  async getFavoriteIds(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.auth.getUser();
      const cloudIds = !error
        ? parseFavoriteIds(data.user?.user_metadata?.favoriteIds)
        : null;

      if (cloudIds) {
        await this.localCache.saveFavoriteIds(userId, cloudIds);
        return cloudIds;
      }
    } catch {}

    return this.localCache.getFavoriteIds(userId);
  }

  async saveFavoriteIds(userId: string, driverIds: string[]): Promise<void> {
    await this.localCache.saveFavoriteIds(userId, driverIds);

    const { error } = await supabase.auth.updateUser({
      data: { favoriteIds: driverIds },
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async getRatings(userId: string): Promise<Rating[]> {
    try {
      const { data, error } = await supabase.auth.getUser();
      const cloudDtos = !error
        ? parseStoredRatings(data.user?.user_metadata?.ratings)
        : null;

      if (cloudDtos) {
        const ratings = toDomainRatings(cloudDtos);
        await this.localCache.saveRatings(userId, ratings);
        return ratings;
      }
    } catch {}

    return this.localCache.getRatings(userId);
  }

  async saveRatings(userId: string, ratings: Rating[]): Promise<void> {
    await this.localCache.saveRatings(userId, ratings);

    const serialized = toStoredRatingDtos(ratings);

    const { error } = await supabase.auth.updateUser({
      data: { ratings: serialized },
    });

    if (error) {
      throw new Error(error.message);
    }
  }
}
