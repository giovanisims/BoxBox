import { Rating } from '../../../domain/entities/Rating';

export interface StoredRatingDto {
  driverId: string;
  stars: number;
}

function isStoredRatingDto(value: unknown): value is StoredRatingDto {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.driverId === 'string' &&
    typeof candidate.stars === 'number'
  );
}

export function parseStoredRatings(value: unknown): StoredRatingDto[] | null {
  if (!Array.isArray(value)) return null;
  return value.every(isStoredRatingDto) ? value : null;
}

export function parseFavoriteIds(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  return value.every((id) => typeof id === 'string') ? value : null;
}

export function toDomainRatings(dtos: StoredRatingDto[]): Rating[] {
  return dtos.map((item) => new Rating(item.driverId, item.stars));
}

export function toStoredRatingDtos(ratings: Rating[]): StoredRatingDto[] {
  return ratings.map((rating) => ({
    driverId: rating.driverId,
    stars: rating.stars,
  }));
}
