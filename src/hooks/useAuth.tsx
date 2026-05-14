import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  type ApiAuthUser,
  type AppRole,
  loginRequest,
  logoutRequest,
  meRequest,
} from '@/lib/api/auth';
import { ApiRequestError } from '@/lib/api';

export type { AppRole };

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  company: string | null;
  phone: string | null;
  created_at?: string;
  updated_at?: string;
}

export type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string | null;
  };
};

type AuthSession = {
  access_token: string;
  user: AuthUser;
};

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  profile: Profile | null;
  role: AppRole | null;
  isLoading: boolean;

  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;

  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: Error | null }>;

  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_TOKEN_KEY = 'eco-auth-token';
const AUTH_USER_KEY = 'eco-auth-user';
const DEMO_USER_KEY = 'eco-demo-user';

type DemoUser = {
  email: string;
  role: AppRole;
  name: string;
};

const getDemoUser = (): DemoUser | null => {
  const raw = localStorage.getItem(DEMO_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
};

function isAppRole(value: unknown): value is AppRole {
  return value === 'admin' || value === 'gestor' || value === 'operacional';
}

function isApiAuthUser(value: unknown): value is ApiAuthUser {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const user = value as Partial<ApiAuthUser>;

  return (
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    typeof user.fullName === 'string' &&
    isAppRole(user.role) &&
    typeof user.isActive === 'boolean'
  );
}

function getCachedApiUser(): ApiAuthUser | null {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    const user = JSON.parse(raw);
    return isApiAuthUser(user) ? user : null;
  } catch {
    return null;
  }
}

function mapApiUserToAuthUser(apiUser: ApiAuthUser): AuthUser {
  return {
    id: apiUser.id,
    email: apiUser.email,
    user_metadata: {
      full_name: apiUser.fullName,
      avatar_url: apiUser.avatarUrl,
    },
  };
}

function mapApiUserToProfile(apiUser: ApiAuthUser): Profile {
  return {
    id: apiUser.id,
    user_id: apiUser.id,
    full_name: apiUser.fullName,
    email: apiUser.email,
    avatar_url: apiUser.avatarUrl,
    company: apiUser.company,
    phone: apiUser.phone,
  };
}

function buildSession(token: string, user: AuthUser): AuthSession {
  return {
    access_token: token,
    user,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  function applyAuthenticatedUser(apiUser: ApiAuthUser, token: string) {
    const authUser = mapApiUserToAuthUser(apiUser);

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(apiUser));
    setUser(authUser);
    setSession(buildSession(token, authUser));
    setProfile(mapApiUserToProfile(apiUser));
    setRole(apiUser.role);
  }

  function clearAuthState() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(DEMO_USER_KEY);
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
  }

  useEffect(() => {
    const demoUser = getDemoUser();

    if (demoUser) {
      const demoAuthUser: AuthUser = {
        id: 'demo-user',
        email: demoUser.email,
        user_metadata: {
          full_name: demoUser.name,
          avatar_url: null,
        },
      };

      setUser(demoAuthUser);
      setSession(null);
      setRole(demoUser.role);
      setProfile({
        id: 'demo-profile',
        user_id: 'demo-user',
        full_name: demoUser.name,
        email: demoUser.email,
        avatar_url: null,
        company: null,
        phone: null,
      });
      setIsLoading(false);
      return;
    }

    const restoreSession = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);

      if (!token) {
        clearAuthState();
        setIsLoading(false);
        return;
      }

      try {
        const { user: apiUser } = await meRequest(token);
        applyAuthenticatedUser(apiUser, token);
      } catch (error) {
        if (
          error instanceof ApiRequestError &&
          (error.status === 401 || error.status === 403)
        ) {
          clearAuthState();
          return;
        }

        const cachedUser = getCachedApiUser();

        if (cachedUser) {
          applyAuthenticatedUser(cachedUser, token);
        }
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      localStorage.removeItem(DEMO_USER_KEY);
      const { token, user: apiUser } = await loginRequest(email, password);

      localStorage.setItem(AUTH_TOKEN_KEY, token);
      applyAuthenticatedUser(apiUser, token);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (_email: string, _password: string, _fullName: string) => {
    return {
      error: new Error('Cadastro publico ainda nao foi migrado para a API propria.'),
    };
  };

  const signOut = async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token) {
      try {
        await logoutRequest(token);
      } catch {
        // Logout local continua mesmo se o token ja estiver invalido.
      }
    }

    clearAuthState();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used dentro de AuthProvider');
  }
  return context;
}
