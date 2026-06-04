# Travel Discovery — Frontend

Premium multilingual travel platform (React + Vite + Ant Design).

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 10+ (`corepack enable` enables it via Node)

## Stack

- React 19 + TypeScript (strict)
- Vite 8
- Ant Design 6
- React Router, Redux Toolkit, TanStack Query, Axios
- react-i18next (EN / HY / RU)

## Getting started

```bash
pnpm install
pnpm dev
```

Create a `.env` file in the project root before running (see [Environment](#environment)).

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `pnpm dev`      | Start dev server         |
| `pnpm build`    | Production build         |
| `pnpm lint`     | ESLint                   |
| `pnpm format`   | Prettier (src)           |
| `pnpm preview`  | Preview production build |

## Environment

Add a `.env` file in the project root with these variables:

| Variable               | Description                    |
| ---------------------- | ------------------------------ |
| `VITE_API_BASE_URL`    | Backend API base URL (must include `/api/v1`) |
| `VITE_GOOGLE_CLIENT_ID`| Google OAuth client ID         |
| `VITE_GEMINI_API_KEY`  | Google Gemini API key          |
| `VITE_GEMINI_API_URL`  | Gemini generateContent endpoint (without `?key=`) |

## Backend API

Production: [https://travel-discovery-backend-production.up.railway.app](https://travel-discovery-backend-production.up.railway.app)

- **Swagger UI:** `/swagger-ui/index.html`
- **OpenAPI JSON:** `/v3/api-docs`
- **Frontend guide:** see `API.md` in the project docs

API modules live in `src/api/`:

| Module        | Endpoints |
| ------------- | --------- |
| `auth`        | register, login, logout |
| `users`       | profile, avatar upload |
| `hotels`      | search, catalog, detail |
| `reviews`     | list, upsert, delete |
| `bookings`    | list, create, cancel |
| `favourites`  | list, add, remove |
| `locations`   | countries, cities |
| `health`      | liveness probe |

## Project structure

See `.cursor/rules/frontend-component-structure.mdc` and the project specification guide.

```
src/
  api/ components/ configs/ i18n/ pages/ router/ store/ types/ utils/
```

Each page lives in `src/pages/<PageName>/` with `index.tsx`, `types.ts`, `styles.module.css`, and `const.ts`.

## Routes

| Route | Page |
| ----- | ---- |
| `/` | Home / Explore |
| `/destinations` | Destinations |
| `/hotel/:id` | Hotel Detail |
| `/guides` | Travel Guides |
| `/guides/:destination` | Guide Detail |
| `/events` | Events |
| `/planner` | AI Planner |
| `/bookings` | My Bookings |
| `/profile` | Profile |
| `/auth/login` | Login / Register |

## Design tokens

- Primary: `#0D6E6E`
- Accent: `#FF6B6B`
- Background: `#F9F7F4`
- Headings: Playfair Display · Body: DM Sans
