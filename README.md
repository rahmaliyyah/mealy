<div align="center">
  <img src="public/assets/logo.svg" alt="Mealy Logo" width="120" />

  <h1>Mealy</h1>
  <p>A food recipe discovery app powered by TheMealDB API</p>
  <p>Frontend Internship Task at <strong>CMLABS</strong></p>

  <a href="https://mealy-orpin.vercel.app/">Live Demo</a> ·
  <a href="https://www.figma.com/design/mG0GP32BzESzFDYCgxuvGu/Design-System-Mealy">Figma Design</a>

  <br />
  <br />

  ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)
  ![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)

</div>

<br />

## Overview

**Mealy** is a modern recipe discovery web app built as a frontend internship task at **CMLABS**. It allows users to explore thousands of meals from around the world — browsing by category, cuisine area, ingredient, or alphabetical index.

## Features

- Search meals by name
- Surprise Me — get a random meal instantly
- Meal of the Day — a daily featured recipe persisted with localStorage
- Browse by Category — e.g. Chicken, Seafood, Dessert
- Food Around the World — filter meals by cuisine area
- Search by Ingredient — find meals using what you have
- A-Z Index — explore all meals alphabetically with category, area, and ingredient filters
- Meal Detail Page — full recipe with ingredients, step-by-step instructions, and YouTube tutorial
- Fully Responsive — mobile-first design with sliders and pagination

## Tech Stack

| Tech | Usage |
|---|---|
| [Next.js 15](https://nextjs.org/) | React framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Lucide React](https://lucide.dev/) | Icons |
| [TheMealDB API](https://www.themealdb.com/api.php) | Recipe data source |
| [Vercel](https://vercel.com/) | Deployment |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/rahmaIiyyah/mealy.git
cd mealy

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
mealy/
├── app/
│   ├── page.tsx              # Home page
│   ├── meal/[id]/            # Meal detail page
│   ├── categories/           # Browse by category
│   ├── areas/                # Browse by area
│   ├── ingredients/          # Browse by ingredient
│   ├── az/                   # A-Z index
│   ├── search/               # Search results
│   └── surprise/             # Random meal redirect
├── components/
│   ├── cards/                # MealCard, CategoryCard, etc.
│   ├── layout/               # Navbar, Footer
│   └── ui/                   # Shared UI components
├── lib/
│   └── api.ts                # TheMealDB API functions
└── public/
    └── assets/               # Logo and static assets
```

## API

All data is fetched from the free [TheMealDB API](https://www.themealdb.com/api.php). No API key is required.

## Design

The UI was designed in Figma with a dark theme, using **Poppins** as the primary typeface and **#FF6B2C** as the brand accent color.

View the Figma Design System: [https://www.figma.com/design/mG0GP32BzESzFDYCgxuvGu/Design-System-Mealy](https://www.figma.com/design/mG0GP32BzESzFDYCgxuvGu/Design-System-Mealy)

## Deployment

Deployed on Vercel. No environment variables are needed as the app uses only public APIs.

Live: [https://mealy-orpin.vercel.app](https://mealy-orpin.vercel.app)

<br />

<div align="center">
  <p>Made by <a href="https://github.com/rahmaIiyyah">rahmaIiyyah</a> — Frontend Internship Task at CMLABS</p>
</div>
