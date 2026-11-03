import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Partner, Language } from '../types';
import { DataService } from '../services/dataService';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  partner: Partner | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  adminLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    fullName: string;
    mobileNumber: string;
    email: string;
    instagramUsername: string;
    password: string;
    preferredLanguage: Language;
  }) => Promise<{ success: boolean; partner?: Partner; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshPartner: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_SESSION_KEY = 'dwe_portal_active_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize Auth state
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        if (isSupabaseConfigured()) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
            };
            setUser(authUser);
            const p = await DataService.getPartnerByUserId(session.user.id);
            if (mounted) setPartner(p);
            const adminStatus = await DataService.checkIsAdmin(session.user.id, session.user.email);
            if (mounted) setIsAdmin(adminStatus);
          }
        } else {
          // Check local stored session
          const raw = localStorage.getItem(LOCAL_SESSION_KEY);
          if (raw && mounted) {
            const parsed = JSON.parse(raw);
            setUser(parsed.user);
            setPartner(parsed.partner);
            setIsAdmin(parsed.isAdmin || false);
          }
        }
      } catch (err) {
        console.error('Session init error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initSession();

    // Listen to Supabase auth changes if connected
    if (isSupabaseConfigured()) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (!mounted) return;
          if (session?.user) {
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
            };
            setUser(authUser);
            const p = await DataService.getPartnerByUserId(session.user.id);
            setPartner(p);
            const adminStatus = await DataService.checkIsAdmin(session.user.id, session.user.email);
            setIsAdmin(adminStatus);
          } else {
            setUser(null);
            setPartner(null);
            setIsAdmin(false);
          }
          setLoading(false);
        }
      );

      return () => {
        mounted = false;
        authListener.subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: pass,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const authUser: AuthUser = { id: data.user.id, email: data.user.email || cleanEmail };
          setUser(authUser);
          const p = await DataService.getPartnerByUserId(data.user.id);
          setPartner(p);
          const adminStatus = await DataService.checkIsAdmin(data.user.id, data.user.email);
          setIsAdmin(adminStatus);
          return { success: true };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Login failed';
        return { success: false, error: msg };
      }
    }

    // Local / Offline fallback auth
    const partners = await DataService.getAllPartnersAdmin();
    const existing = partners.find((p) => p.email.toLowerCase() === cleanEmail);

    if (existing) {
      if (existing.account_status === 'Suspended') {
        return { success: false, error: 'Your partner account is suspended. Please contact support.' };
      }
      const authUser: AuthUser = { id: existing.user_id, email: existing.email };
      setUser(authUser);
      setPartner(existing);
      const adminStatus = await DataService.checkIsAdmin(existing.user_id, existing.email);
      setIsAdmin(adminStatus);

      localStorage.setItem(
        LOCAL_SESSION_KEY,
        JSON.stringify({ user: authUser, partner: existing, isAdmin: adminStatus })
      );
      return { success: true };
    }

    // Check if logging in as admin
    if (cleanEmail === 'admin@digwebexpert.com' || cleanEmail === 'harshad@digwebexpert.com') {
      const authUser: AuthUser = { id: 'admin-hardik-1', email: cleanEmail };
      setUser(authUser);
      setIsAdmin(true);
      localStorage.setItem(
        LOCAL_SESSION_KEY,
        JSON.stringify({ user: authUser, partner: null, isAdmin: true })
      );
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid email or password. Please check your credentials or register.',
    };
  };

  const adminLogin = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const res = await login(email, pass);
    if (!res.success) return res;

    const currentEmail = email.toLowerCase().trim();
    if (
      currentEmail.includes('admin') ||
      currentEmail.includes('harshad') ||
      isAdmin ||
      (await DataService.checkIsAdmin(user?.id || '', currentEmail))
    ) {
      setIsAdmin(true);
      return { success: true };
    }

    return { success: false, error: 'Access denied: You do not have administrator privileges.' };
  };

  const register = async (data: {
    fullName: string;
    mobileNumber: string;
    email: string;
    instagramUsername: string;
    password: string;
    preferredLanguage: Language;
  }): Promise<{ success: boolean; partner?: Partner; error?: string }> => {
    const cleanEmail = data.email.toLowerCase().trim();

    // Check for duplicate locally first
    const existingPartners = await DataService.getAllPartnersAdmin();
    const isDup = existingPartners.some((p) => p.email.toLowerCase() === cleanEmail);
    if (isDup) {
      return { success: false, error: 'An account with this email address already exists. Please log in.' };
    }

    let createdUserId = `u-${Date.now()}`;

    if (isSupabaseConfigured()) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
              mobile_number: data.mobileNumber,
            },
          },
        });

        if (authError) {
          return { success: false, error: authError.message };
        }

        if (authData.user) {
          createdUserId = authData.user.id;
        }
      } catch (err: unknown) {
        console.warn('Supabase auth signUp error:', err);
      }
    }

    try {
      const partnerProfile = await DataService.createPartnerProfile({
        user_id: createdUserId,
        full_name: data.fullName,
        mobile_number: data.mobileNumber,
        email: cleanEmail,
        instagram_username: data.instagramUsername,
        preferred_language: data.preferredLanguage,
      });

      const authUser: AuthUser = { id: createdUserId, email: cleanEmail };
      setUser(authUser);
      setPartner(partnerProfile);
      setIsAdmin(false);

      localStorage.setItem(
        LOCAL_SESSION_KEY,
        JSON.stringify({ user: authUser, partner: partnerProfile, isAdmin: false })
      );

      return { success: true, partner: partnerProfile };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed during profile creation';
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn(err);
      }
    }
    localStorage.removeItem(LOCAL_SESSION_KEY);
    setUser(null);
    setPartner(null);
    setIsAdmin(false);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/#reset-password`,
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Password reset failed';
        return { success: false, error: msg };
      }
    }
    return { success: true };
  };

  const refreshPartner = async () => {
    if (user?.id) {
      const p = await DataService.getPartnerByUserId(user.id);
      setPartner(p);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        partner,
        isAdmin,
        loading,
        login,
        adminLogin,
        register,
        logout,
        resetPassword,
        refreshPartner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
