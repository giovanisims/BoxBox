import { Session as SupabaseSession } from '@supabase/supabase-js';
import { IAuthService } from '../../domain/contracts/IAuthService';
import { User } from '../../domain/entities/User';
import { UserSession } from '../../domain/entities/UserSession';
import { supabase } from './supabaseClient';

export class SupabaseAuthService implements IAuthService {

  async signIn(email: string, password: string): Promise<UserSession> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw new Error(error.message);
    if (!data.session) throw new Error('Sign in succeeded but no session was returned');

    return this.mapSession(data.session);
  }

  async signUp(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async recoverPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
  }

  async getSession(): Promise<UserSession | null> {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw new Error(error.message);
    if (!data.session) return null;

    return this.mapSession(data.session);
  }

  onAuthStateChange(callback: (session: UserSession | null) => void): () => void {
    const { data } = supabase.auth.onAuthStateChange((_event, supabaseSession) => {
      callback(supabaseSession ? this.mapSession(supabaseSession) : null);
    });

    return () => data.subscription.unsubscribe();
  }

    private mapSession(supabaseSession: SupabaseSession): UserSession {
    if (!supabaseSession.user.email) {
      throw new Error('Authenticated user is missing an email address');
    }
    if (!supabaseSession.expires_at) {
      throw new Error('Session is missing an expiration timestamp');
    }

    const domainUser = new User(supabaseSession.user.id, supabaseSession.user.email);
    return new UserSession(domainUser, supabaseSession.access_token, supabaseSession.expires_at);
  }
}
