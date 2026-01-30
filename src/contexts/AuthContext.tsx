import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { profiles } from "@/lib/api";
import type { Profile, UserRole } from "@/types/database";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  hasActiveAccess: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const profileData = await profiles.getMyProfile();
    setProfile(profileData);
  }, []);

  useEffect(() => {
    // Busca sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile();
      }
      setLoading(false);
    });

    // Escuta mudanças de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN" && session?.user) {
        await fetchProfile();
      } else if (event === "SIGNED_OUT") {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const isAdmin = profile?.role === "admin";
  const isAuthenticated = !!user;
  
  // Verifica se tem acesso ativo (para alunos)
  const hasActiveAccess = isAdmin || (profile?.plan !== undefined);

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    isAdmin,
    isAuthenticated,
    hasActiveAccess,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook para verificar acesso a um curso específico
export function useHasAccessToCourse(courseId: string) {
  const { isAdmin, profile } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  useEffect(() => {
    if (isAdmin) {
      setHasAccess(true);
      setLoading(false);
      return;
    }

    const checkAccess = async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("*")
        .eq("course_id", courseId)
        .eq("status", "active")
        .single();

      if (data) {
        const expires = data.access_expires_at ? new Date(data.access_expires_at) : null;
        const isValid = !expires || expires > new Date();
        setHasAccess(isValid);
        setExpiresAt(expires);
      } else {
        setHasAccess(false);
      }
      setLoading(false);
    };

    checkAccess();
  }, [courseId, isAdmin]);

  return { hasAccess, loading, expiresAt };
}
