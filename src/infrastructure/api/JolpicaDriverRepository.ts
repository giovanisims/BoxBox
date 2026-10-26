import axios from 'axios';
import { IDriverRepository } from '../../domain/contracts/IDriverRepository';
import { Driver } from '../../domain/entities/Driver';
import {
  JolpicaDriverDto,
  JolpicaResponseDto,
} from './dtos/JolpicaDriverDto';
import { DriverMapper } from './mappers/DriverMapper';
import { IWikipediaClient, WikipediaClient } from './WikipediaClient';

const JOLPICA_BASE_URL = 'https://api.jolpi.ca/ergast/f1';
const MAX_SEARCH_RESULTS = 15;
const JOLPICA_MAX_PAGE_LIMIT = 100;
const BATCH_CONCURRENCY = 3;

interface JolpicaPage {
  total: number;
  drivers: JolpicaDriverDto[];
}

export class JolpicaDriverRepository implements IDriverRepository {
  private allDriversCache: JolpicaDriverDto[] | null = null;

  constructor(
    private readonly wikiClient: IWikipediaClient = new WikipediaClient()
  ) {}

  private async enrichDriver(
    rawDriver: JolpicaDriverDto,
    useLargeImage = false
  ): Promise<Driver> {
    const wikiSlug = DriverMapper.extractWikiSlug(rawDriver.url);
    const wikiSummary = await this.wikiClient.fetchSummary(wikiSlug);
    return DriverMapper.toDomain(rawDriver, wikiSummary, useLargeImage);
  }

  private async enrichDrivers(
    rawDrivers: JolpicaDriverDto[]
  ): Promise<Driver[]> {
    return Promise.all(
      rawDrivers.map((rawDriver) => this.enrichDriver(rawDriver, false))
    );
  }

  private async fetchJolpica(
    path: string,
    params?: Record<string, number>
  ): Promise<JolpicaPage> {
    const response = await axios.get<JolpicaResponseDto>(
      `${JOLPICA_BASE_URL}${path}`,
      { params }
    );
    return {
      total: Number(response.data?.MRData?.total ?? 0),
      drivers: response.data?.MRData?.DriverTable?.Drivers ?? [],
    };
  }

  private fetchDriversPage(limit: number, offset: number): Promise<JolpicaPage> {
    return this.fetchJolpica('/drivers.json', { limit, offset });
  }

  private async fetchAllRawDrivers(): Promise<JolpicaDriverDto[]> {
    if (this.allDriversCache && this.allDriversCache.length > 0) {
      return this.allDriversCache;
    }

    const { total, drivers: firstBatch } = await this.fetchDriversPage(
      JOLPICA_MAX_PAGE_LIMIT,
      0
    );

    const allDrivers: JolpicaDriverDto[] = [...firstBatch];
    const remainingOffsets: number[] = [];

    for (
      let offset = JOLPICA_MAX_PAGE_LIMIT;
      offset < total;
      offset += JOLPICA_MAX_PAGE_LIMIT
    ) {
      remainingOffsets.push(offset);
    }

    for (let i = 0; i < remainingOffsets.length; i += BATCH_CONCURRENCY) {
      const chunk = remainingOffsets.slice(i, i + BATCH_CONCURRENCY);
      const pages = await Promise.all(
        chunk.map((offset) =>
          this.fetchDriversPage(JOLPICA_MAX_PAGE_LIMIT, offset)
        )
      );

      for (const page of pages) {
        allDrivers.push(...page.drivers);
      }
    }

    this.allDriversCache = allDrivers;
    return allDrivers;
  }

  async getDrivers(offset = 0, limit = 20): Promise<Driver[]> {
    const { drivers: rawDrivers } = await this.fetchDriversPage(limit, offset);
    return this.enrichDrivers(rawDrivers);
  }

  async getDriverById(driverId: string): Promise<Driver> {
    const { drivers } = await this.fetchJolpica(
      `/drivers/${encodeURIComponent(driverId)}.json`
    );
    const rawDriver: JolpicaDriverDto | undefined = drivers[0];

    if (!rawDriver) {
      throw new Error(`Driver with ID "${driverId}" not found.`);
    }

    return this.enrichDriver(rawDriver, true);
  }

  async searchDrivers(query: string): Promise<Driver[]> {
    const normalizedQuery = DriverMapper.normalizeText(query);
    if (!normalizedQuery) return [];

    const allDrivers = await this.fetchAllRawDrivers();

    const matches = allDrivers
      .filter((rawDriver) =>
        DriverMapper.matchesQuery(rawDriver, normalizedQuery)
      )
      .slice(0, MAX_SEARCH_RESULTS);

    return this.enrichDrivers(matches);
  }
}
