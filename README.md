# Client Catalog Website – GTech

## Overview
A customer-facing price catalog built with Next.js 14+ (App Router). Designed primarily for mobile usage (accessed extensively via WhatsApp links), it allows clients to browse products and see their personalized discounted prices.

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Backend/BaaS:** Firebase (Shared Auth, Firestore, and Storage with the Admin App)
- **Hosting:** Vercel

## Features
- **Personalized Pricing:** Clients log in to see the full catalog with their specific discount percentage automatically applied (e.g., 0%, 12%, 20%).
- **Product Catalog:** Responsive grid and detailed product views.
- **Profile Management:** Dashboard showing user's current discount tier.
- **WhatsApp Integration:** Floating action button to quickly connect via WhatsApp.

## Brand Guidelines
- **Primary:** `#0044FF` (Used for buttons and primary price text)
- **Accent:** `#00D4C8` (Used for highlights, "Your Price" badges, and WhatsApp button)
- **Dark:** `#0F172A` (Text and dark backgrounds)
- **Light:** `#F8FAFC` (Cards and light backgrounds)

## Key Pages
- `/` - Home (Hero section and featured product grid)
- `/login` & `/register` - Authentication
- `/catalog` - Full product catalog
- `/product/[id]` - Product detail view
- `/profile` - User profile and discount information
