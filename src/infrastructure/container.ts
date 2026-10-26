import { IAuthService } from '../domain/contracts/IAuthService';
import { IDriverRepository } from '../domain/contracts/IDriverRepository';
import { IStorageStrategy } from '../domain/contracts/IStorageStrategy';
import { JolpicaDriverRepository } from './api/JolpicaDriverRepository';
import { IWikipediaClient, WikipediaClient } from './api/WikipediaClient';
import { AsyncStorageStrategy } from './storage/AsyncStorageStrategy';
import { SupabaseAuthService } from './supabase/SupabaseAuthService';
import { SupabaseStorageStrategy } from './supabase/SupabaseStorageStrategy';

const wikipediaClient: IWikipediaClient = new WikipediaClient();
const localStorageStrategy: IStorageStrategy = new AsyncStorageStrategy();

export const authService: IAuthService = new SupabaseAuthService();
export const driverRepository: IDriverRepository = new JolpicaDriverRepository(
  wikipediaClient
);
export const storageStrategy: IStorageStrategy = new SupabaseStorageStrategy(
  localStorageStrategy
);
