# SimpleVia Frontend

## Architecture

```text
├── apps/
│   ├── web/        # Web client application (React + Vite)
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   └── components/
│   │   ├── index.html
│   │   └── package.json
│   ├── mobile/     # Mobile client application (React Native / Expo)
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   └── screens/
│   │   ├── android/
│   │   ├── ios/
│   │   └── package.json
│   └── api/        # Backend API service (Node/Express or Fastify)
│       ├── src/
│       │   ├── index.ts
│       │   ├── routes/
│       │   └── controllers/
│       ├── package.json
│       └── tsconfig.json
├── packages/       # Shared packages/libs (UI, utils, types)
│   ├── ui/
│   │   └── src/
│   └── utils/
│       └── src/
├── scripts/        # repo-level scripts (build, deploy helpers)
├── .github/        # CI / PR workflows
├── package.json    # workspace root
├── pnpm-workspace.yaml
└── README.md
```

## Application Responsibilities

- **Web Application** (`apps/web`): React + Vite frontend for HRIS system with responsive UI, charts, and real-time dashboards.
- **Mobile Application** (`apps/mobile`): React Native / Expo mobile client for employee self-service and attendance tracking.
- **Backend API** (`apps/api`): Node/Express or Fastify REST API providing data endpoints for authentication, employee records, and HRIS operations.
- **Shared UI Library** (`packages/ui`): Reusable React components used across web and mobile.
- **Shared Utilities** (`packages/utils`): Common functions, types, and helpers for all applications.

## Tech Stack

- **Frontend**: React 19.2, TypeScript, Vite, Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Build Tool**: Vite 7.3
- **Linting**: ESLint 9
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Package Manager**: pnpm (workspaces)

## Development Setup

### Prerequisites
- Node.js 18+ or 20+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/Lyndoncatan/SimpleVia-Frontend.git
cd SimpleVia-Frontend

# Install dependencies across all workspaces
pnpm install
```

### Running the Web App

```bash
# Install and run the web app
cd apps/web
pnpm install
pnpm dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Running the Mobile App

```bash
# Install and run the mobile app (Expo)
cd apps/mobile
pnpm install
pnpm start
```

### Running the API Server

```bash
# Install and run the API server
cd apps/api
pnpm install
pnpm dev
```

### Workspace Commands

```bash
# Run dev across all workspaces from root
pnpm -r dev

# Build all apps
pnpm -r build

# Lint across all workspaces
pnpm -r lint
```

---

**Repository**: https://github.com/Lyndoncatan/SimpleVia-Frontend
