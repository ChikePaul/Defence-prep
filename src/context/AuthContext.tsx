import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase";
import { StudentProfile } from "../types/siwes";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveProfileToCloud: (profile: StudentProfile) => Promise<boolean>;
  loadProfileFromCloud: () => Promise<StudentProfile | null>;
  saveProgressToCloud: (unlockedBadges: string[], score?: number) => Promise<boolean>;
  loadProgressFromCloud: () => Promise<{ unlockedBadges: string[]; score?: number } | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        // Sync basic user document
        const userRef = doc(db, "users", res.user.uid);
        await setDoc(
          userRef,
          {
            uid: res.user.uid,
            displayName: res.user.displayName || "SIWES Candidate",
            email: res.user.email || "",
            photoURL: res.user.photoURL || "",
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.error("Firebase Google sign-in failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const saveProfileToCloud = async (profile: StudentProfile): Promise<boolean> => {
    if (!user) return false;
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          displayName: profile.studentName || user.displayName || "SIWES Candidate",
          email: user.email || "",
          studentName: profile.studentName,
          matricNo: profile.matricNo,
          institution: profile.institution,
          faculty: profile.faculty,
          department: profile.department,
          companyName: profile.companyName,
          unitAttached: profile.unitAttached,
          profileData: JSON.stringify(profile),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      console.error("Failed to save profile to Firestore:", err);
      return false;
    }
  };

  const loadProfileFromCloud = async (): Promise<StudentProfile | null> => {
    if (!user) return null;
    try {
      const userRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.profileData) {
          return JSON.parse(data.profileData) as StudentProfile;
        }
      }
      return null;
    } catch (err) {
      console.error("Failed to load profile from Firestore:", err);
      return null;
    }
  };

  const saveProgressToCloud = async (
    unlockedBadges: string[],
    score?: number
  ): Promise<boolean> => {
    if (!user) return false;
    try {
      const progressRef = doc(db, "users", user.uid, "progress", "current");
      await setDoc(
        progressRef,
        {
          userId: user.uid,
          unlockedBadges: JSON.stringify(unlockedBadges),
          readinessScore: score ?? null,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      console.error("Failed to save progress to Firestore:", err);
      return false;
    }
  };

  const loadProgressFromCloud = async (): Promise<{
    unlockedBadges: string[];
    score?: number;
  } | null> => {
    if (!user) return null;
    try {
      const progressRef = doc(db, "users", user.uid, "progress", "current");
      const snapshot = await getDoc(progressRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        return {
          unlockedBadges: data.unlockedBadges ? JSON.parse(data.unlockedBadges) : [],
          score: data.readinessScore,
        };
      }
      return null;
    } catch (err) {
      console.error("Failed to load progress from Firestore:", err);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        logout,
        saveProfileToCloud,
        loadProfileFromCloud,
        saveProgressToCloud,
        loadProgressFromCloud,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
