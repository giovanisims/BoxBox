export class Driver {
  readonly id: string;
  readonly name: string;
  readonly nationality: string;
  readonly imageUrl: string | null;
  readonly code?: string;
  readonly permanentNumber?: string;
  readonly dateOfBirth?: string;
  readonly rawHtmlBio?: string;

  constructor(
    id: string,
    name: string,
    nationality: string,
    imageUrl: string | null,
    code?: string,
    permanentNumber?: string,
    dateOfBirth?: string,
    rawHtmlBio?: string
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error('Driver ID cannot be empty');
    }
    if (!name || name.trim().length === 0) {
      throw new Error('Driver name cannot be empty');
    }

    this.id = id.trim();
    this.name = name.trim();
    this.nationality = nationality || 'Unknown';
    this.imageUrl = imageUrl;
    this.code = code;
    this.permanentNumber = permanentNumber;
    this.dateOfBirth = dateOfBirth;
    this.rawHtmlBio = rawHtmlBio;
  }

  get displayCode(): string {
    return this.code || 'N/A';
  }

  get displayNumber(): string {
    return this.permanentNumber ? `#${this.permanentNumber}` : 'N/A';
  }

  get displaySummary(): string {
    return `${this.nationality} • ${this.displayCode}`;
  }

  get cleanBio(): string {
    if (!this.rawHtmlBio) return 'No biography available.';
    return this.rawHtmlBio
      .replace(/<[^>]*>?/gm, '')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'")
      .trim();
  }
}
