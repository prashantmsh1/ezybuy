"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
        const idToken = await auth.currentUser?.getIdToken();
        if (idToken) {
            document.cookie = `token=${idToken}; path=/; max-age=3600`;
        }
    };

    const signUp = async (email: string, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const idToken = await user.getIdToken();
        document.cookie = `token=${idToken}; path=/; max-age=3600`;
        // Sync user to backend
        await fetch("/api/sync-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: user.uid, email: user.email }),
        });
    };

    const logout = async () => {
        await signOut(auth);
        document.cookie = "token=; path=/; max-age=0";
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();
        document.cookie = `token=${idToken}; path=/; max-age=3600`;
        // Sync user to backend if new user
        if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
            await fetch("/api/sync-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: user.uid, email: user.email }),
            });
        }
    };

    const value = {
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
