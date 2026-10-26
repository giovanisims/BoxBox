import axios from 'axios';
import { WikiSummaryDto } from './dtos/WikiSummaryDto';

const WIKI_SUMMARY_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary';

export interface IWikipediaClient {
  fetchSummary(wikiSlug: string): Promise<WikiSummaryDto | null>;
}

export class WikipediaClient implements IWikipediaClient {
  private readonly cache = new Map<string, WikiSummaryDto | null>();

  async fetchSummary(wikiSlug: string): Promise<WikiSummaryDto | null> {
    if (!wikiSlug) return null;

    if (this.cache.has(wikiSlug)) {
      return this.cache.get(wikiSlug) ?? null;
    }

    try {
      const response = await axios.get<WikiSummaryDto>(
        `${WIKI_SUMMARY_URL}/${wikiSlug}`
      );
      this.cache.set(wikiSlug, response.data);
      return response.data;
    } catch {
      this.cache.set(wikiSlug, null);
      return null;
    }
  }
}
