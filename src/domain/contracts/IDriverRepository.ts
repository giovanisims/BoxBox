import { Driver } from '../entities/Driver';

export interface IDriverRepository {
  getDrivers(offset: number, limit: number): Promise<Driver[]>;
  getDriverById(driverId: string): Promise<Driver>;
}
