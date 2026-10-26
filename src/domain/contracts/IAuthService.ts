import { UserSession } from '../entities/UserSession';

export interface IAuthService {
  signIn(email: string, password: string): Promise<UserSession>;
  signUp(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  recoverPassword(email: string): Promise<void>;
  getSession(): Promise<UserSession | null>;

  /** Subscribes to auth events and returns an unsubscribe cleanup function */
  onAuthStateChange(callback: (session: UserSession | null) => void): () => void;
}
