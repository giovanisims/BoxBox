import { useCallback, useEffect, useRef, useState } from 'react';
import { IDriverRepository } from '../../domain/contracts/IDriverRepository';
import { Driver } from '../../domain/entities/Driver';
import { Rating } from '../../domain/entities/Rating';
import { JolpicaDriverRepository } from '../../infrastructure/api/JolpicaDriverRepository';
import { useWatched } from './useWatched';

const driverRepository: IDriverRepository = new JolpicaDriverRepository();

export interface WatchedDriverItem {
  driver: Driver;
  rating: Rating;
}

export function useWatchedDrivers() {
  const { ratings, loading: watchedLoading } = useWatched();
  const [items, setItems] = useState<WatchedDriverItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<Map<string, Driver>>(new Map());

  const loadWatchedDrivers = useCallback(async () => {
    if (watchedLoading) return;

    if (ratings.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const missingIds = ratings
        .map((r) => r.driverId)
        .filter((id) => !cacheRef.current.has(id));

      if (missingIds.length > 0) {
        setLoading(true);
        const fetched = await Promise.all(
          missingIds.map((id) => driverRepository.getDriverById(id))
        );
        fetched.forEach((driver) => cacheRef.current.set(driver.id, driver));
      }

      const resolved: WatchedDriverItem[] = [];
      for (const rating of ratings) {
        const driver = cacheRef.current.get(rating.driverId);
        if (driver) {
          resolved.push({ driver, rating });
        }
      }

      setItems(resolved);
    } catch {
      setError('Failed to load watched drivers. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [ratings, watchedLoading]);

  useEffect(() => {
    loadWatchedDrivers();
  }, [loadWatchedDrivers]);

  return {
    items,
    loading: watchedLoading || loading,
    error,
    retry: loadWatchedDrivers,
  };
}
