import "./globals.css";
import { Inter } from "next/font/google";
import { AuthContextProvider } from "../src/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "GTech Store",
    description: "Real-time electronics price catalog",
    manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthContextProvider>
                    {children}
                </AuthContextProvider>
            </body>
        </html>
    );
}
