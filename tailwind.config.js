/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#37258A",    // Main blue
                accent: "#00D4C8",     // Teal accent
                dark: "#0F172A",       // Text & dark backgrounds
                light: "#F8FAFC",      // Cards & backgrounds
            }
        }
    },
    plugins: [],
}
