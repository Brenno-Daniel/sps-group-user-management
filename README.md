# 🏢 SPS Group — User Management

Monorepo for the **SPS Group user management** system: an **Express** REST API and a **React** web app for administrators to authenticate and **list, create, edit, and delete** users (with **JWT** protection and client-side **search**).

## 📁 What’s in this repo

| Folder | Description |
| ------ | ----------- |
| **[`server/`](server/README.md)** | REST API — login, Bearer JWT, user CRUD, in-memory store, **Swagger UI**. |
| **[`web/`](web/README.md)** | SPA — sign-in, protected user list, modals for CRUD, debounced search, responsive UI. |

## 🚀 Run the full stack

**1. API** — from repo root:

```bash
cd server
npm install
cp .env.example .env
# edit .env: PORT, JWT_SECRET
npm run dev
```

**2. Web** — new terminal, from repo root:

```bash
cd web
npm install
cp .env.example .env
# set REACT_APP_SERVER_URL to the API base (e.g. http://localhost:3000)
npm start
```

Open the app URL printed by CRA (usually `http://localhost:3001` if the API uses `3000`). Use the seeded admin from the [server README](server/README.md) to sign in.

## 🧭 Stack at a glance

| Area | Main stack |
| ---- | ---------- |
| **Backend** | Node.js, Express, JWT, Swagger, Vitest, supertest |
| **Front-end** | React (CRA), React Router, Tailwind CSS, Axios, Vitest + RTL |

## 📚 Deeper docs

| | |
| --- | --- |
| **Backend** | [README](server/README.md) · [Architecture](server/docs/architecture.md) · [Assessment brief](server/docs/assessment-brief.md) |
| **Front-end** | [README](web/README.md) · [Architecture](web/docs/architecture.md) · [Assessment brief](web/docs/assessment-brief.md) |

---

_Made with care for SPS Group — clear UX, solid API contracts, and tests where it matters._
