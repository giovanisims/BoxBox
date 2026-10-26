import { useCallback, useEffect, useMemo, useState } from 'react';
import { IDriverRepository } from '../../domain/contracts/IDriverRepository';
import { Driver } from '../../domain/entities/Driver';
import { driverRepository as defaultRepository } from '../../infrastructure/container';

interface FetchFailure {
  requestKey: string;
  message: string;
}

export function useDriversByIds(
  driverIds: string[],
  parentLoading: boolean,
  repository: IDriverRepository = defaultRepository
) {
  const [driversMap, setDriversMap] = useState<Map<string, Driver>>(
    () => new Map()
  );
  const [failure, setFailure] = useState<FetchFailure | null>(null);
  const [attempt, setAttempt] = useState(0);

  const missingIds = useMemo(
    () => driverIds.filter((id) => !driversMap.has(id)),
    [driverIds, driversMap]
  );

  const requestKey = `${missingIds.join(',')}#${attempt}`;
  const hasFailed = failure?.requestKey === requestKey;

  useEffect(() => {
    if (parentLoading || missingIds.length === 0) return;

    let cancelled = false;

    Promise.all(missingIds.map((id) => repository.getDriverById(id))).then(
      (fetched) => {
        if (cancelled) return;
        setDriversMap((previous) => {
          const next = new Map(previous);
          fetched.forEach((driver) => next.set(driver.id, driver));
          return next;
        });
      },
      () => {
        if (!cancelled) {
          setFailure({
            requestKey,
            message: 'Failed to load drivers. Please check your connection.',
          });
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, [missingIds, parentLoading, repository, requestKey]);

  const drivers = useMemo(
    () =>
      driverIds
        .map((id) => driversMap.get(id))
        .filter((driver): driver is Driver => Boolean(driver)),
    [driverIds, driversMap]
  );

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return {
    drivers,
    loading: parentLoading || (missingIds.length > 0 && !hasFailed),
    error: hasFailed ? failure.message : null,
    retry,
  };
}
