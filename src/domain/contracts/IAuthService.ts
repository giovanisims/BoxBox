import { UserSession } from '../entities/UserSession';

export interface IAuthService {
  signIn(email: string, password: string): Promise<UserSession>;
  signUp(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  getSession(): Promise<UserSession | null>;
  onAuthStateChange(callback: (session: UserSession | null) => void): () => void;
}
