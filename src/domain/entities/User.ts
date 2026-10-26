export class User {
  readonly id: string;
  readonly email: string;

  constructor(id: string, email: string) {
    if (!id || id.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
    if (!email || !email.includes('@')) {
      throw new Error(`Invalid email address: ${email}`);
    }

    this.id = id.trim();
    this.email = email.toLowerCase().trim();
  }
}
