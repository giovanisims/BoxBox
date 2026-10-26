import { Rating } from '../entities/Rating';

export interface IFavoritesStorage {
  getFavoriteIds(userId: string): Promise<string[]>;
  saveFavoriteIds(userId: string, driverIds: string[]): Promise<void>;
}

export interface IRatingsStorage {
  getRatings(userId: string): Promise<Rating[]>;
  saveRatings(userId: string, ratings: Rating[]): Promise<void>;
}

export interface IStorageStrategy extends IFavoritesStorage, IRatingsStorage {}
