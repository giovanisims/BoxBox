export class Rating {
  readonly driverId: string;
  readonly stars: number;

  constructor(driverId: string, stars = 0) {
    if (!driverId || driverId.trim().length === 0) {
      throw new Error('Driver ID cannot be empty');
    }
    if (!Number.isInteger(stars) || stars < 0 || stars > 5) {
      throw new Error('Rating must be an integer between 0 and 5');
    }

    this.driverId = driverId.trim();
    this.stars = stars;
  }

  get isRated(): boolean {
    return this.stars >= 1 && this.stars <= 5;
  }

  get displayStars(): string {
    if (!this.isRated) return 'No rating yet';
    return '★'.repeat(this.stars) + '☆'.repeat(5 - this.stars);
  }
}
