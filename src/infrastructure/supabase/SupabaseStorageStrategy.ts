import { IStorageStrategy } from '../../domain/contracts/IStorageStrategy';
import { Rating } from '../../domain/entities/Rating';
import { AsyncStorageStrategy } from '../storage/AsyncStorageStrategy';
import { supabase } from './supabaseClient';

interface StoredRating {
  driverId: string;
  stars: number;
}

export class SupabaseStorageStrategy implements IStorageStrategy {
  private localCache = new AsyncStorageStrategy();

  async getFavoriteIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase.auth.getUser();

    if (!error && Array.isArray(data.user?.user_metadata?.favoriteIds)) {
      const cloudIds: string[] = data.user.user_metadata.favoriteIds;
      await this.localCache.saveFavoriteIds(userId, cloudIds);
      return cloudIds;
    }

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
    const { data, error } = await supabase.auth.getUser();

    if (!error && Array.isArray(data.user?.user_metadata?.ratings)) {
      const cloudRatings: StoredRating[] = data.user.user_metadata.ratings;
      const ratings = cloudRatings.map(
        (item) => new Rating(item.driverId, item.stars)
      );
      await this.localCache.saveRatings(userId, ratings);
      return ratings;
    }

    return this.localCache.getRatings(userId);
  }

  async saveRatings(userId: string, ratings: Rating[]): Promise<void> {
    await this.localCache.saveRatings(userId, ratings);

    const serialized: StoredRating[] = ratings.map((r) => ({
      driverId: r.driverId,
      stars: r.stars,
    }));

    const { error } = await supabase.auth.updateUser({
      data: { ratings: serialized },
    });

    if (error) {
      throw new Error(error.message);
    }
  }
}
