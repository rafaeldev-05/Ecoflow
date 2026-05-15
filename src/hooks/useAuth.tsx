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
const DEMO_USER_KEY = 'eco-demo-user';
const LEGACY_AUTH_TOKEN_KEY = 'eco-auth-token';
const LEGACY_AUTH_USER_KEY = 'eco-auth-user';

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

function buildSession(user: AuthUser): AuthSession {
  return {
    user,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  function applyAuthenticatedUser(apiUser: ApiAuthUser) {
    const authUser = mapApiUserToAuthUser(apiUser);

    setUser(authUser);
    setSession(buildSession(authUser));
    setProfile(mapApiUserToProfile(apiUser));
    setRole(apiUser.role);
  }

  function clearAuthState() {
    localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
    localStorage.removeItem(LEGACY_AUTH_USER_KEY);
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
      try {
        localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
        localStorage.removeItem(LEGACY_AUTH_USER_KEY);
        const { user: apiUser } = await meRequest();
        applyAuthenticatedUser(apiUser);
      } catch (error) {
        if (
          error instanceof ApiRequestError &&
          (error.status === 401 || error.status === 403)
        ) {
          clearAuthState();
          return;
        }

        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      localStorage.removeItem(DEMO_USER_KEY);
      localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
      localStorage.removeItem(LEGACY_AUTH_USER_KEY);
      const { user: apiUser } = await loginRequest(email, password);

      applyAuthenticatedUser(apiUser);

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
    try {
      await logoutRequest();
    } catch {
      // Logout local continua mesmo se a sessao ja estiver invalida.
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
