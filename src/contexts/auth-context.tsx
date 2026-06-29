"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/src/lib/firebase/config";
import type { User } from "firebase/auth";

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
            setUser(nextUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        if (!isFirebaseConfigured) {
            throw new Error("Firebase n’est pas encore configuré. Ajoutez vos variables d’environnement pour activer l’inscription et la connexion.");
        }
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email: string, password: string, name: string) => {
        if (!isFirebaseConfigured) {
            throw new Error("Firebase n’est pas encore configuré. Ajoutez vos variables d’environnement pour créer un compte.");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
            await import("firebase/auth").then(({ updateProfile }) => updateProfile(userCredential.user, { displayName: name }));
        }
    };

    const signInWithGoogle = async () => {
        if (!isFirebaseConfigured) {
            throw new Error("Firebase n’est pas encore configuré. Activez l’authentification Google depuis votre projet Firebase.");
        }

        const provider = new GoogleAuthProvider();

        // 🔥 FORCE GOOGLE À TOUJOURS AFFICHER LE CHOIX DU COMPTE (POP-UP)
        provider.setCustomParameters({
            prompt: "select_account"
        });

        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            const code = typeof error === "object" && error && "code" in error ? String((error as { code?: string }).code) : "";
            if (code.includes("popup") || code.includes("blocked") || code.includes("cancelled")) {
                await signInWithRedirect(auth, provider);
                return;
            }
            throw error;
        }
    };

    const resetPassword = async (email: string) => {
        if (!isFirebaseConfigured) {
            throw new Error("Firebase n’est pas encore configuré. Configurez l’email de réinitialisation dans votre projet Firebase.");
        }
        await sendPasswordResetEmail(auth, email);
    };
    
    const logout = async () => {
        await signOut(auth);
    };

    const value = useMemo<AuthContextValue>(() => ({
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        resetPassword,
        logout,
    }), [user, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}