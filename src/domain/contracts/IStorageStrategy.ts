import { Rating } from '../entities/Rating';

export interface IStorageStrategy {
  getFavoriteIds(userId: string): Promise<string[]>;
  saveFavoriteIds(userId: string, driverIds: string[]): Promise<void>;
  getRatings(userId: string): Promise<Rating[]>;
  saveRatings(userId: string, ratings: Rating[]): Promise<void>;
}
