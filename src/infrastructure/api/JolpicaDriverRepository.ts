import axios from 'axios';
import { IDriverRepository } from '../../domain/contracts/IDriverRepository';
import { Driver } from '../../domain/entities/Driver';
import { JolpicaDriverDto } from './dtos/JolpicaDriverDto';
import { WikiSummaryDto } from './dtos/WikiSummaryDto';

const JOLPICA_BASE_URL = 'https://api.jolpi.ca/ergast/f1';
const WIKI_SUMMARY_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary';
const MAX_SEARCH_RESULTS = 15;
const JOLPICA_MAX_PAGE_LIMIT = 100;

export class JolpicaDriverRepository implements IDriverRepository {
  private static allDriversCache: JolpicaDriverDto[] | null = null;

  private extractWikiSlug(wikiUrl?: string): string {
    if (!wikiUrl) return '';
    return wikiUrl.split('/').pop() || '';
  }

  private normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private async fetchWikiSummary(wikiSlug: string): Promise<WikiSummaryDto | null> {
    if (!wikiSlug) return null;
    try {
      const response = await axios.get<WikiSummaryDto>(
        `${WIKI_SUMMARY_URL}/${wikiSlug}`
      );
      return response.data;
    } catch {
      return null;
    }
  }

  private mapDriver(
    rawDriver: JolpicaDriverDto,
    wikiSummary: WikiSummaryDto | null,
    useLargeImage = false
  ): Driver {
    const fullName = `${rawDriver.givenName} ${rawDriver.familyName}`;
    const imageUrl = useLargeImage
      ? wikiSummary?.originalimage?.source || wikiSummary?.thumbnail?.source || null
      : wikiSummary?.thumbnail?.source || null;
    const rawHtmlBio = wikiSummary?.extract_html || wikiSummary?.extract || '';

    return new Driver(
      rawDriver.driverId,
      fullName,
      rawDriver.nationality,
      imageUrl,
      rawDriver.code,
      rawDriver.permanentNumber,
      rawDriver.dateOfBirth,
      rawHtmlBio
    );
  }

  private async fetchAllRawDrivers(): Promise<JolpicaDriverDto[]> {
    if (
      JolpicaDriverRepository.allDriversCache &&
      JolpicaDriverRepository.allDriversCache.length > 0
    ) {
      return JolpicaDriverRepository.allDriversCache;
    }

    const firstResponse = await axios.get(`${JOLPICA_BASE_URL}/drivers.json`, {
      params: { limit: JOLPICA_MAX_PAGE_LIMIT, offset: 0 },
    });

    const total = Number(firstResponse.data?.MRData?.total || 0);
    const firstBatch: JolpicaDriverDto[] =
      firstResponse.data?.MRData?.DriverTable?.Drivers || [];

    const allDrivers: JolpicaDriverDto[] = [...firstBatch];
    const remainingOffsets: number[] = [];

    for (
      let offset = JOLPICA_MAX_PAGE_LIMIT;
      offset < total;
      offset += JOLPICA_MAX_PAGE_LIMIT
    ) {
      remainingOffsets.push(offset);
    }

    const batchSize = 3;
    for (let i = 0; i < remainingOffsets.length; i += batchSize) {
      const chunk = remainingOffsets.slice(i, i + batchSize);
      const responses = await Promise.all(
        chunk.map((offset) =>
          axios.get(`${JOLPICA_BASE_URL}/drivers.json`, {
            params: { limit: JOLPICA_MAX_PAGE_LIMIT, offset },
          })
        )
      );

      for (const res of responses) {
        const pageDrivers: JolpicaDriverDto[] =
          res.data?.MRData?.DriverTable?.Drivers || [];
        allDrivers.push(...pageDrivers);
      }
    }

    JolpicaDriverRepository.allDriversCache = allDrivers;
    return allDrivers;
  }

  async getDrivers(offset = 0, limit = 20): Promise<Driver[]> {
    const response = await axios.get(`${JOLPICA_BASE_URL}/drivers.json`, {
      params: { limit, offset },
    });

    const rawDrivers: JolpicaDriverDto[] =
      response.data?.MRData?.DriverTable?.Drivers || [];

    return Promise.all(
      rawDrivers.map(async (rawDriver) => {
        const wikiSlug = this.extractWikiSlug(rawDriver.url);
        const wikiSummary = await this.fetchWikiSummary(wikiSlug);
        return this.mapDriver(rawDriver, wikiSummary, false);
      })
    );
  }

  async getDriverById(driverId: string): Promise<Driver> {
    const response = await axios.get(
      `${JOLPICA_BASE_URL}/drivers/${driverId}.json`
    );

    const rawDriver: JolpicaDriverDto | undefined =
      response.data?.MRData?.DriverTable?.Drivers?.[0];

    if (!rawDriver) {
      throw new Error(`Driver with ID "${driverId}" not found.`);
    }

    const wikiSlug = this.extractWikiSlug(rawDriver.url);
    const wikiSummary = await this.fetchWikiSummary(wikiSlug);

    return this.mapDriver(rawDriver, wikiSummary, true);
  }

  async searchDrivers(query: string): Promise<Driver[]> {
    const normalizedQuery = this.normalizeText(query);
    if (!normalizedQuery) return [];

    const allDrivers = await this.fetchAllRawDrivers();

    const matches = allDrivers
      .filter((rawDriver) => {
        const fullName = this.normalizeText(
          `${rawDriver.givenName} ${rawDriver.familyName}`
        );
        const driverId = this.normalizeText(rawDriver.driverId);
        const code = rawDriver.code ? this.normalizeText(rawDriver.code) : '';

        return (
          fullName.includes(normalizedQuery) ||
          driverId.includes(normalizedQuery) ||
          code.includes(normalizedQuery)
        );
      })
      .slice(0, MAX_SEARCH_RESULTS);

    return Promise.all(
      matches.map(async (rawDriver) => {
        const wikiSlug = this.extractWikiSlug(rawDriver.url);
        const wikiSummary = await this.fetchWikiSummary(wikiSlug);
        return this.mapDriver(rawDriver, wikiSummary, false);
      })
    );
  }
}
