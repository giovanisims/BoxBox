import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { IDriverRepository } from '../../domain/contracts/IDriverRepository';
import { Driver } from '../../domain/entities/Driver';
import { driverRepository as defaultRepository } from '../../infrastructure/container';

const PAGE_SIZE = 20;
export const SCROLL_THRESHOLD_PX = 400;

export function useCatalog(repository: IDriverRepository = defaultRepository) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingNext, setLoadingNext] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const offsetRef = useRef(0);
  const hasMoreRef = useRef(true);
  const isFetchingRef = useRef(false);

  const fetchPage = useCallback(
    async (targetOffset: number, replace: boolean) => {
      isFetchingRef.current = true;

      try {
        const newDrivers = await repository.getDrivers(targetOffset, PAGE_SIZE);

        if (newDrivers.length < PAGE_SIZE) {
          hasMoreRef.current = false;
        }

        setError(null);
        setDrivers((previous) =>
          replace ? newDrivers : [...previous, ...newDrivers]
        );
        offsetRef.current = targetOffset + newDrivers.length;
      } catch {
        setError('Failed to load drivers. Please check your connection.');
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
        setLoadingNext(false);
        setRefreshing(false);
      }
    },
    [repository]
  );

  useEffect(() => {
    if (isFetchingRef.current) return;
    fetchPage(0, true);
  }, [fetchPage]);

  const reload = useCallback(
    (setIndicator: (value: boolean) => void) => {
      if (isFetchingRef.current) return;
      hasMoreRef.current = true;
      offsetRef.current = 0;
      setError(null);
      setIndicator(true);
      fetchPage(0, true);
    },
    [fetchPage]
  );

  const refresh = useCallback(() => reload(setRefreshing), [reload]);

  const retry = useCallback(() => reload(setLoading), [reload]);

  const loadMore = useCallback(() => {
    if (isFetchingRef.current || !hasMoreRef.current) return;
    setLoadingNext(true);
    fetchPage(offsetRef.current, false);
  }, [fetchPage]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleWindowScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - SCROLL_THRESHOLD_PX;

      if (scrolledToBottom) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [loadMore]);

  return {
    drivers,
    loading,
    loadingNext,
    refreshing,
    error,
    refresh,
    loadMore,
    retry,
  };
}
