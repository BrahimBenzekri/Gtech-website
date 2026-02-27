"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Initial session check
        const checkUser = async () => {
            console.log("[AuthContext] Checking initial session...");
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    console.error("[AuthContext] Error getting session:", error);
                }
                console.log("[AuthContext] Initial session:", session);
                setUser(session?.user || null);
            } catch (err) {
                console.error("[AuthContext] Unexpected error during session check:", err);
            } finally {
                console.log("[AuthContext] Setting loading to false after initial check");
                setLoading(false);
            }
        };

        checkUser();

        // Listen for auth changes
        console.log("[AuthContext] Setting up auth state change listener");
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("[AuthContext] Auth state changed. Event:", event, "Session:", session);
            setUser(session?.user || null);
            setLoading(false);
        });

        return () => {
            console.log("[AuthContext] Cleaning up auth state listener");
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        console.log("[AuthContext] Attempting login for:", email);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error("[AuthContext] Login error:", error);
            throw error;
        }
        console.log("[AuthContext] Login successful:", data);
        return data;
    };

    const signup = async (email, password) => {
        console.log("[AuthContext] Attempting signup for:", email);
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            console.error("[AuthContext] Signup error:", error);
            throw error;
        }
        console.log("[AuthContext] Signup successful:", data);
        return data;
    };

    const logout = async () => {
        console.log("[AuthContext] Attempting logout");
        setUser(null);
        await supabase.auth.signOut();
        console.log("[AuthContext] Logout successful, redirecting to login");
        router.push("/login");
    };

    console.log("[AuthContext] Current state - User:", user?.email, "Loading:", loading);

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};
