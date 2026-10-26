import { useCallback, useEffect, useState } from 'react';
import { IDriverRepository } from '../../domain/contracts/IDriverRepository';
import { Driver } from '../../domain/entities/Driver';
import { JolpicaDriverRepository } from '../../infrastructure/api/JolpicaDriverRepository';

const driverRepository: IDriverRepository = new JolpicaDriverRepository();

export function useDriverDetails(driverId: string) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await driverRepository.getDriverById(driverId);
      setDriver(result);
    } catch {
      setError('Failed to load driver details. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [driverId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return {
    driver,
    loading,
    error,
    retry: fetchDetails,
  };
}
