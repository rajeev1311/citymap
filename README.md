# MUSKAN — "Your City • Your Vibe"

> A full-stack, production-ready city and local discovery platform centered on **Jaipur, Rajasthan** with multi-city support across India (Delhi, Mumbai, Bengaluru, Udaipur, Agra, Varanasi, Lucknow).

---

## ✨ Features

- **🎨 Modern Aesthetic & Design System**:
  - Dark Navy primary sidebar (`#101827`) with soft pink accents (`#F3A6C8`) and clean ivory backdrop (`#FAF8F8`).
  - Mobile-first responsive navigation with drawer menu and persistent bottom tab bar.
- **📍 Geolocation & City Switcher**:
  - Real-time browser Geolocation detection and persistent city selector.
  - Live weather widget powered by Open-Meteo API.
- **🔍 Multi-Entity Global Search**:
  - Concurrent debounced search across Tourist Places, Businesses, Colleges, Salons, Cinemas, and Cities.
- **🏛️ Rich Local Directories**:
  - Detailed profiles for heritage monuments, palaces, rooftop cafes, universities, luxury salons, and vintage cinemas (e.g. Raj Mandir).
- **⭐ Interactive Reviews & Saved Places**:
  - 1–5 star community reviews with instant dynamic rating recalculation.
  - Optimistic bookmarks / saved places system.
- **🛡️ Admin Dashboard**:
  - Real-time KPI statistics and full CRUD management for users, cities, listings, and review moderation.
- **🔐 Secure Authentication**:
  - Role-based access control (`USER` and `ADMIN`) with hashed passwords (`bcryptjs`) and signed JWT session cookies (`jose`).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, TypeScript, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Validation**: [Zod](https://zod.dev/)
- **Auth**: JWT HttpOnly session cookies

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/rajeev1311/city.git
cd city
npm install
```

### 2. Configure Environment

Copy the environment template:

```bash
cp .env.example .env
```

Ensure your PostgreSQL database is running, then configure `DATABASE_URL` in `.env`.

### 3. Database Setup & Seed

```bash
# Push Prisma schema to your PostgreSQL database
npx prisma db push

# Seed initial Indian cities, Jaipur listings, reviews, and admin/demo accounts
npm run build # or npx tsx prisma/seed.ts
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Accounts

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@muskan.city` | `admin123` |
| **Demo User** | `demo@muskan.city` | `demo123` |

---

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma       # Prisma data models (9 models)
│   └── seed.ts             # Rich seed dataset
├── src/
│   ├── app/                # Next.js App Router routes & API endpoints
│   │   ├── admin/          # Admin KPI dashboard & CRUD pages
│   │   ├── api/            # REST API endpoints (auth, search, CRUD, reviews)
│   │   ├── tourist-places/ # Places directory & detail pages
│   │   ├── businesses/     # Business directory & detail pages
│   │   ├── colleges/       # Colleges directory & detail pages
│   │   ├── salons/         # Salons directory & detail pages
│   │   ├── cinemas/        # Cinema directory & detail pages
│   │   ├── cities/         # Cities directory & detail pages
│   │   └── ...             # Search, Saved, Profile, Settings, Auth
│   ├── components/         # UI components (Shell, Nav, Cards, Modals)
│   ├── context/            # AuthContext and CityContext
│   ├── lib/                # Prisma client, Auth helpers, Weather service
│   └── types/              # TypeScript interfaces and entity types
└── package.json
```

---

## 📜 License

MIT License. Built with ❤️ for Jaipur and Indian cities.
