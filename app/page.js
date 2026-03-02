"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../src/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "../src/lib/supabase";

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [initializing, setInitializing] = useState(true);

    // Auth Protection
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Fetch User Discount from profiles table
    useEffect(() => {
        if (user?.id) {
            console.log("[Home] Fetching discount for user:", user.id);
            const fetchUser = async () => {
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('discount_percent')
                        .eq('id', user.id)
                        .single();

                    if (error) throw error;

                    if (data) {
                        console.log("[Home] Found user discount:", data.discount_percent);
                        setDiscount(data.discount_percent || 0);
                    }
                } catch (err) {
                    console.error("[Home] Error fetching user discount:", err);
                }
            };
            fetchUser();
        }
    }, [user]);

    // Fetch Products with joined images
    useEffect(() => {
        console.log("[Home] Fetching products...");
        const fetchProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*, product_images(image_url)');

                if (error) throw error;

                // Flatten the image_url from product_images array
                const productsData = data.map(product => ({
                    ...product,
                    image_url: product.product_images?.[0]?.image_url
                }));

                console.log(`[Home] Received ${productsData.length} products`);
                setProducts(productsData);
            } catch (err) {
                console.error("[Home] Error fetching products:", err);
            } finally {
                setInitializing(false);
            }
        };

        fetchProducts();
    }, []);

    // Helper to resolve image source
    const resolveImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        // Assume raw base64 if not http/data
        return `data:image/jpeg;base64,${url}`;
    };

    console.log("[Home] Render check - loading:", loading, "initializing:", initializing, "user:", !!user);

    if (loading || (initializing && user)) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-light">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <div className="text-gray-500">
                        {loading ? "Loading Auth..." : "Loading Products..."}
                    </div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <main className="min-h-screen bg-light pb-20">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="GTech Logo" className="h-14 w-auto" />
                    </div>
                    {discount > 0 && (
                        <span className="bg-accent text-dark px-3 py-1 rounded-full text-sm font-semibold">
                            Your Discount: {discount}%
                        </span>
                    )}
                </div>
            </header>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => {
                        const finalPrice = product.price * (1 - discount / 100);
                        const imageUrl = resolveImageUrl(product.image_url);

                        return (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
                                <div className="aspect-square relative bg-gray-100">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                    )}
                                    {!product.in_stock && (
                                        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 m-2 rounded">
                                            Out of Stock
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-semibold text-dark text-sm md:text-base line-clamp-2 mb-2">
                                        {product.name}
                                    </h3>
                                    <div className="mt-auto">
                                        <div className="text-2xl font-bold text-primary">
                                            {finalPrice.toFixed(2)} DA
                                        </div>
                                        {discount > 0 && (
                                            <div className="text-xs text-gray-400 line-through">
                                                {product.price} DA
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Floating WhatsApp Button */}
            <a
                href="https://wa.me/1234567890" // Replace with actual number if provided
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-colors z-50 flex items-center justify-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.029.575 1.956.885 3.037.885 3.191 0 5.767-2.583 5.767-5.766.001-3.185-2.575-5.768-5.998-5.768zm0 13C9.8 19.172 8.138 18.238 7.07 16.4L7 16l-3 1 1-3-.4-.698C3.136 11.237 4.07 9.575 5.869 7.776 7.6 6.035 9.771 5.309 12.031 5.309c4.2 0 7.625 3.072 7.625 7.625 0 4.2-3.425 7.238-7.625 7.238zm3.625-5.563c-.15-.075-1.462-.713-1.688-.825-.225-.075-.387-.037-.525.15-.225.263-.825 1.088-1 1.35-.15.225-.337.263-.563.15-.3-.113-1.05-.338-1.95-1.163-.712-.6-1.162-1.35-1.312-1.613-.15-.262-.038-.412.075-.525.113-.075.225-.262.338-.375.113-.15.15-.225.225-.375.075-.15.038-.3-.037-.413-.075-.15-.675-1.65-.938-2.25-.262-.562-.525-.525-.75-.525h-.6c-.225 0-.6.113-.938.45s-1.275 1.275-1.275 3.113c0 1.838 1.35 3.6 1.538 3.863.187.262 2.625 4.05 6.412 5.587 2.175.938 2.963.825 3.525.75.787-.075 2.1-1.312 2.1-1.312.338-.412.188-.862.038-.975z" fillRule="nonzero" />
                </svg>
            </a>
        </main>
    );
}
