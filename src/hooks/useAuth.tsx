import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'admin' | 'gestor' | 'operacional';

interface Profile {
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

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: AppRole | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ======================================================
   🔹 Helper: recuperar usuário DEMO
   ====================================================== */
const getDemoUser = () => {
  const raw = localStorage.getItem('eco-demo-user');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ======================================================
     🔹 1. BUSCA PROFILE + ROLE (SUPABASE)
     ====================================================== */
  const fetchUserData = async (userId: string) => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData as Profile);
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (roleData) {
        setRole(roleData.role as AppRole);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  /* ======================================================
     🔹 2. BOOTSTRAP DE AUTENTICAÇÃO (DEMO OU SUPABASE)
     ====================================================== */
  useEffect(() => {
    const demoUser = getDemoUser();

    // 👉 MODO DEMO
    if (demoUser) {
      setUser({
        id: 'demo-user',
        email: demoUser.email,
      } as User);

      setSession(null);
      setRole(demoUser.role as AppRole);
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

    // 👉 MODO SUPABASE
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserData(session.user.id);
      }

      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setProfile(null);
          setRole(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  /* ======================================================
     🔹 3. LOGIN REAL (SUPABASE)
     ====================================================== */
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      if (!data.session || !data.user) {
        return { error: new Error('Sessão não criada') };
      }

      setSession(data.session);
      setUser(data.user);

      await fetchUserData(data.user.id);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  /* ======================================================
     🔹 4. CADASTRO REAL (SUPABASE)
     ====================================================== */
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      return { error: error as Error | null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  /* ======================================================
     🔹 5. LOGOUT (DEMO + SUPABASE)
     ====================================================== */
  const signOut = async () => {
    localStorage.removeItem('eco-demo-user');
    await supabase.auth.signOut();

    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
