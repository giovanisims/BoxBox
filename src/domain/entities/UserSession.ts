import { User } from './User';

export class UserSession {
  readonly user: User;
  readonly accessToken: string;
  readonly expiresAt: number;

  constructor(user: User, accessToken: string, expiresAt: number) {
    if (!user) {
      throw new Error('Active session requires a valid user');
    }
    if (!accessToken || accessToken.trim().length === 0) {
      throw new Error('Active session requires a valid access token');
    }
    if (!expiresAt || expiresAt <= 0) {
      throw new Error('Active session requires a valid expiration timestamp');
    }

    this.user = user;
    this.accessToken = accessToken;
    this.expiresAt = expiresAt;
  }

  get isExpired(): boolean {
    return Math.floor(Date.now() / 1000) >= this.expiresAt;
  }

  get isAuthenticated(): boolean {
    return !this.isExpired;
  }
}

