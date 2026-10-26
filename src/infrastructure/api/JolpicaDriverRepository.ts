import axios from 'axios';
import { IDriverRepository } from '../../domain/contracts/IDriverRepository';
import { Driver } from '../../domain/entities/Driver';
import { JolpicaDriverDto } from './dtos/JolpicaDriverDto';
import { WikiSummaryDto } from './dtos/WikiSummaryDto';

const JOLPICA_BASE_URL = 'https://api.jolpi.ca/ergast/f1';
const WIKI_SUMMARY_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary';

export class JolpicaDriverRepository implements IDriverRepository {
  private extractWikiSlug(wikiUrl?: string): string {
    if (!wikiUrl) return '';
    return wikiUrl.split('/').pop() || '';
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
}
