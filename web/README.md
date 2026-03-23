# 🖥️ SPS User Management — Front-end (`/web`)

React SPA for managing SPS Group user accounts: **sign-in**, **JWT** session, **CRUD** on users, and a **debounced search** — all talking to the REST API in [`/server`](../server/README.md).

## 🎯 What you can do

- **Sign in** — authenticate with email/password; JWT stored in `localStorage`.
- **Browse users** — responsive table (desktop) and cards (mobile), sorted by email.
- **Search** — single field filters by **name**, **e-mail**, or **type** (value or label), with debounce.
- **Create / edit / delete users** — modals with validation before calling the API.
- **Protected routes** — unauthenticated users are redirected to login.

## ✨ Tech stack

| Layer | Technology |
| ----- | ---------- |
| UI | **React** 18 (Create React App) |
| Routing | **React Router** 6 |
| Styling | **Tailwind CSS** 3, **PostCSS** |
| Motion | **Framer Motion** |
| Icons | **Lucide React** |
| HTTP | **Axios** |
| Tests | **Vitest** 3, **React Testing Library**, **jsdom** |
| Tooling | **Prettier**, **Vite** (Vitest only) |

> **🤖 AI-assisted development:** This app was built with **AI tooling** to accelerate development — primarily **[Cursor](https://cursor.com)** (**Composer 2**), **MCP Context7** for up-to-date documentation and framework references, and **Google Gemini** for optimizing prompts. Human review applies to UI, auth, and API usage.

## 📋 Requirements

- Node.js 18+
- Backend API running — see [`/server`](../server/README.md) (`REACT_APP_SERVER_URL` must point to it)

## 🛠️ Setup

From the **repository root**:

```bash
cd web
npm install
```

If your shell is **already inside** `web/`, run only:

```bash
npm install
```

Copy environment variables:

```bash
cp .env.example .env
```

Set `REACT_APP_SERVER_URL` (e.g. `http://localhost:3000`).

## 📜 Scripts

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `npm start` / `npm run dev` | Dev server (CRA)        |
| `npm run build`    | Production build               |
| `npm test`         | Unit tests (Vitest + RTL)      |
| `npm run test:watch` | Vitest watch               |
| `npm run format`   | Prettier on `src/**/*.{js,jsx,css}` |

## ▶️ Running

```bash
npm start
```

Ensure the API is up and `REACT_APP_SERVER_URL` matches its base URL.

## 🧪 Tests

```bash
npm test
```

Uses **AAA** style and names like `Should [outcome] When [scenario]`.

## 📚 Documentation

- **[Architecture](docs/architecture.md)** — folders, auth, and conventions
- Routes: `/login` (public), `/users` (protected)

---

## 📎 Original assessment brief

The Portuguese/Spanish challenge text is in **[docs/assessment-brief.md](docs/assessment-brief.md)**.
