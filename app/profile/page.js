"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../src/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "../../src/lib/supabase";
import Link from "next/link";

export default function Profile() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user?.id) {
            const fetchProfile = async () => {
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (error) throw error;
                    setProfile(data);
                } catch (err) {
                    console.error("Error fetching profile:", err);
                } finally {
                    setFetching(false);
                }
            };
            fetchProfile();
        }
    }, [user]);

    if (loading || fetching) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-light">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user || !profile) return null;

    return (
        <main className="min-h-screen bg-light pb-20">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img src="/logo.png" alt="GTech Logo" className="h-10 w-auto" />
                        <span className="font-bold text-dark hidden sm:inline">Back to Catalog</span>
                    </Link>
                    <button
                        onClick={() => logout()}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Profile Banner */}
                    <div className="h-32 bg-gradient-to-r from-primary to-blue-600"></div>

                    <div className="px-8 pb-10 relative">
                        {/* Profile Avatar Placeholder */}
                        <div className="absolute -top-12 left-8 h-24 w-24 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-white">
                            <div className="h-full w-full rounded-xl bg-gray-100 flex items-center justify-center text-primary text-3xl font-bold">
                                {profile.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        </div>

                        <div className="pt-16">
                            <h1 className="text-3xl font-bold text-dark">{profile.name}</h1>
                            <p className="text-gray-500 flex items-center gap-1 mt-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                                {profile.role?.toUpperCase() || "CUSTOMER"} MEMBER
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</label>
                                    <p className="text-dark font-medium border-b border-gray-100 pb-2">{profile.email}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
                                    <p className="text-dark font-medium border-b border-gray-100 pb-2">{profile.phone_number || "Not provided"}</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Shipping Address</label>
                                    <p className="text-dark font-medium border-b border-gray-100 pb-2 leading-relaxed">{profile.address || "Not provided"}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">User Status</label>
                                    <div className="flex items-center gap-3 pt-1">
                                        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                            ACTIVE
                                        </div>
                                        {profile.discount_percent > 0 && (
                                            <div className="bg-accent border border-accent text-dark px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                {profile.discount_percent}% LOYALTY DISCOUNT
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                            <p className="text-xs text-gray-400">Account ID: {profile.id}</p>
                            <Link href="/">
                                <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
