import { Driver } from '../../../domain/entities/Driver';
import { JolpicaDriverDto } from '../dtos/JolpicaDriverDto';
import { WikiSummaryDto } from '../dtos/WikiSummaryDto';

export class DriverMapper {
  static extractWikiSlug(wikiUrl?: string): string {
    if (!wikiUrl) return '';
    return wikiUrl.split('/').pop() || '';
  }

  static normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  static matchesQuery(
    rawDriver: JolpicaDriverDto,
    normalizedQuery: string
  ): boolean {
    const fullName = DriverMapper.normalizeText(
      `${rawDriver.givenName} ${rawDriver.familyName}`
    );
    const driverId = DriverMapper.normalizeText(rawDriver.driverId);
    const code = rawDriver.code
      ? DriverMapper.normalizeText(rawDriver.code)
      : '';

    return (
      fullName.includes(normalizedQuery) ||
      driverId.includes(normalizedQuery) ||
      code.includes(normalizedQuery)
    );
  }

  static toDomain(
    rawDriver: JolpicaDriverDto,
    wikiSummary: WikiSummaryDto | null,
    useLargeImage = false
  ): Driver {
    const fullName = `${rawDriver.givenName} ${rawDriver.familyName}`;
    const imageUrl = useLargeImage
      ? wikiSummary?.originalimage?.source ||
        wikiSummary?.thumbnail?.source ||
        null
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
}
