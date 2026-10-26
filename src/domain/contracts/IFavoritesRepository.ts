import { Driver } from '../entities/Driver';

export interface IFavoritesRepository {
  getFavorites(userId: string): Promise<Driver[]>;
  addFavorite(userId: string, driver: Driver): Promise<void>;
  removeFavorite(userId: string, driverId: string): Promise<void>;
}
