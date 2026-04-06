# Finance Tracker

A modern personal finance management app built with React, TypeScript, and Vite. Track your income and expenses across multiple sheets, visualize spending trends, and stay on top of your finances — all in the browser with offline persistence.

## Features

- **Transaction Management** — Add, edit, and delete transactions with date, amount, category, type, and notes
- **Multi-Sheet Support** — Organize finances across multiple named spreadsheet pages
- **Dashboard Summary Cards** — Live balance, income, and expense totals with interactive carousel
- **Charts & Insights** — Spending breakdown by category (pie chart) and running balance trend (line chart)
- **Search & Filter** — Filter transactions by keyword or category; sort by any column
- **Role-Based Access** — Switch between `admin` (full edit) and `viewer` (read-only) modes
- **CSV Export / Import** — Export any sheet to CSV or import data from a CSV file
- **Offline Persistence** — All data saved locally via IndexedDB (no server required)
- **Responsive Design** — Works on desktop and mobile screens

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Charts | Recharts |
| Animations | Motion (Framer Motion) |
| Storage | IndexedDB via `idb-keyval` |
| Icons | Lucide React |

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run TypeScript type checks |
| `npm run deploy` | Deploy to GitHub Pages |

## Project Structure

```
src/
├── App.tsx                  # Root component — state and layout
├── types.ts                 # TypeScript interfaces and types
├── constants.ts             # Initial seed data
├── index.css                # Global styles
├── main.tsx                 # Application entry point
├── services/
│   └── storageService.ts    # IndexedDB read/write helpers
└── components/
    ├── RoleSwitcher.tsx     # Admin / Viewer toggle
    ├── Dashboard/           # Summary cards
    ├── Insights/            # Settings panel for visible cards
    ├── Spreadsheet/         # Grid, toolbar, and page tabs
    └── Transactions/        # Search bar and category filters
```

## Transaction Categories

`Food` · `Rent` · `Salary` · `Entertainment` · `Transport` · `Utilities` · `Misc`

## License

MIT
