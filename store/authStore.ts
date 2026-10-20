import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { authService } from '../services/firebase/authService';
import { User, UserRole, UserProfile } from '../types/auth';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUpWithFirebase: (email: string, password: string, role: UserRole) => Promise<void>;
  loginWithFirebase: (email: string, password?: string, requestedRole?: UserRole) => Promise<void>;
  loginWithGoogle: (requestedRole?: UserRole) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  refreshUserProfile: () => Promise<UserProfile | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  user: null,
  role: null,
  loading: true,
  isAuthenticated: false,
  signUpWithFirebase: async () => {},
  loginWithFirebase: async () => {},
  loginWithGoogle: async () => {},
  resendVerificationEmail: async () => {},
  sendPasswordReset: async () => {},
  refreshUserProfile: async () => null,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUserProfile = async (): Promise<UserProfile | null> => {
    if (!auth.currentUser) return null;
    await auth.currentUser.reload();
    const updatedFbUser = auth.currentUser;
    setFirebaseUser(updatedFbUser);

    let profile = await authService.getCurrentUserProfile(updatedFbUser.uid);
    if (profile) {
      const updatedUser: User = {
        ...profile,
        id: profile.uid || updatedFbUser.uid,
      };
      setUser(updatedUser);
      return updatedUser;
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        let profile = await authService.getCurrentUserProfile(fbUser.uid);
        if (profile) {
          setUser({
            ...profile,
            id: profile.uid || fbUser.uid,
          });
        } else {
          setUser({
            uid: fbUser.uid,
            id: fbUser.uid,
            email: fbUser.email || '',
            name: fbUser.displayName || 'Field Officer',
            role: 'FIELD_OFFICER',
            phone: '+91 9876543210',
            status: 'ACTIVE',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUpWithFirebase = async (
    email: string,
    password: string,
    role: UserRole = 'DRIVER'
  ) => {
    setLoading(true);
    try {
      const { firebaseUser: fbUser, profile } = await authService.signUpUser(email, password, role);
      setFirebaseUser(fbUser);
      setUser({
        ...profile,
        id: profile.uid || fbUser.uid,
      });
    } finally {
      setLoading(false);
    }
  };

  const loginWithFirebase = async (
    email: string,
    password?: string,
    requestedRole: UserRole = 'FIELD_OFFICER'
  ) => {
    setLoading(true);
    try {
      const { firebaseUser: fbUser, profile } = await authService.signInUser(email, password, requestedRole);
      setFirebaseUser(fbUser);
      setUser({
        ...profile,
        id: profile.uid || fbUser.uid,
      });
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (requestedRole: UserRole = 'FIELD_OFFICER') => {
    setLoading(true);
    try {
      const { firebaseUser: fbUser, profile } = await authService.signInWithGoogle(requestedRole);
      setFirebaseUser(fbUser);
      setUser({
        ...profile,
        id: profile.uid || fbUser.uid,
      });
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    await authService.resendVerificationEmail();
  };

  const sendPasswordReset = async (email: string) => {
    await authService.sendPasswordReset(email);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.signOutUser();
      setFirebaseUser(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        firebaseUser,
        user,
        role: user?.role || null,
        loading,
        isAuthenticated: !!user,
        signUpWithFirebase,
        loginWithFirebase,
        loginWithGoogle,
        resendVerificationEmail,
        sendPasswordReset,
        refreshUserProfile,
        logout,
      },
    },
    children
  );
};

export const useAuth = () => useContext(AuthContext);
