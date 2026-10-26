import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { IAuthService } from '../../domain/contracts/IAuthService';
import { UserSession } from '../../domain/entities/UserSession';
import { authService as defaultAuthService } from '../../infrastructure/container';

export interface AuthContextData {
  session: UserSession | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<UserSession>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  authService?: IAuthService;
}

export function AuthProvider({
  children,
  authService = defaultAuthService,
}: AuthProviderProps) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    authService
      .getSession()
      .then((restoredSession) => setSession(restoredSession))
      .catch(() => setSession(null))
      .finally(() => setInitializing(false));

    const unsubscribe = authService.onAuthStateChange((updatedSession) => {
      setSession(updatedSession);
    });

    return unsubscribe;
  }, [authService]);

  const signIn = useCallback(
    (email: string, password: string) => authService.signIn(email, password),
    [authService]
  );

  const signUp = useCallback(
    (email: string, password: string) => authService.signUp(email, password),
    [authService]
  );

  const signOut = useCallback(() => authService.signOut(), [authService]);

  const value = useMemo(
    () => ({
      session,
      initializing,
      signIn,
      signUp,
      signOut,
    }),
    [session, initializing, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
