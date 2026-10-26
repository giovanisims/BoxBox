import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { IDriverRepository } from '../../domain/contracts/IDriverRepository';
import { Driver } from '../../domain/entities/Driver';
import { JolpicaDriverRepository } from '../../infrastructure/api/JolpicaDriverRepository';

const PAGE_SIZE = 20;
const driverRepository: IDriverRepository = new JolpicaDriverRepository();

export function useCatalog() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingNext, setLoadingNext] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const offsetRef = useRef(0);
  const hasMoreRef = useRef(true);
  const isFetchingRef = useRef(false);

  const fetchPage = useCallback(async (targetOffset: number, replace: boolean) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      setError(null);
      if (replace) {
        setLoading(true);
      } else {
        setLoadingNext(true);
      }

      const newDrivers = await driverRepository.getDrivers(targetOffset, PAGE_SIZE);

      if (newDrivers.length < PAGE_SIZE) {
        hasMoreRef.current = false;
      }

      setDrivers((previous) => (replace ? newDrivers : [...previous, ...newDrivers]));
      offsetRef.current = targetOffset + newDrivers.length;
    } catch (err) {
      console.error('[useCatalog] Error in fetchPage:', err);
      setError('Failed to load drivers. Please check your connection.');
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setLoadingNext(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(0, true);
  }, [fetchPage]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    hasMoreRef.current = true;
    offsetRef.current = 0;
    fetchPage(0, true);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!isFetchingRef.current && hasMoreRef.current) {
      fetchPage(offsetRef.current, false);
    }
  }, [fetchPage]);

  const retry = useCallback(() => {
    hasMoreRef.current = true;
    offsetRef.current = 0;
    fetchPage(0, true);
  }, [fetchPage]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleWindowScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 400;

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
