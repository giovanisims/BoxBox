import { useCallback, useEffect, useState } from 'react';
import { IDriverRepository } from '../../domain/contracts/IDriverRepository';
import { Driver } from '../../domain/entities/Driver';
import { driverRepository as defaultRepository } from '../../infrastructure/container';

interface LoadedDriver {
  key: string;
  driver: Driver | null;
  error: string | null;
}

export function useDriverDetails(
  driverId: string,
  repository: IDriverRepository = defaultRepository
) {
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState<LoadedDriver | null>(null);

  const requestKey = `${driverId}#${attempt}`;

  useEffect(() => {
    let cancelled = false;

    repository.getDriverById(driverId).then(
      (result) => {
        if (!cancelled) {
          setLoaded({ key: requestKey, driver: result, error: null });
        }
      },
      () => {
        if (!cancelled) {
          setLoaded({
            key: requestKey,
            driver: null,
            error:
              'Failed to load driver details. Please check your connection.',
          });
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, [driverId, repository, requestKey]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const isCurrent = loaded?.key === requestKey;

  return {
    driver: isCurrent ? loaded.driver : null,
    loading: !isCurrent,
    error: isCurrent ? loaded.error : null,
    retry,
  };
}
