export class Rating {
  static readonly MIN_STARS = 0;
  static readonly MAX_STARS = 5;

  readonly driverId: string;
  readonly stars: number;

  constructor(driverId: string, stars = Rating.MIN_STARS) {
    if (!driverId || driverId.trim().length === 0) {
      throw new Error('Driver ID cannot be empty');
    }
    if (
      !Number.isInteger(stars) ||
      stars < Rating.MIN_STARS ||
      stars > Rating.MAX_STARS
    ) {
      throw new Error(
        `Rating must be an integer between ${Rating.MIN_STARS} and ${Rating.MAX_STARS}`
      );
    }

    this.driverId = driverId.trim();
    this.stars = stars;
  }
}
