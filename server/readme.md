# SPS User Management — API (server)

Express REST API with **layered architecture** (controller → service → in-memory repository), **JWT** authentication, **Swagger UI**, and **Vitest** tests.

## Requirements

- Node.js 18+ (recommended)
- npm

## Setup

```bash
cd server
npm install
```

Copy environment variables:

```bash
cp .env.example .env
```

Edit `.env` and set at least:

| Variable     | Description                          |
| ------------ | ------------------------------------ |
| `PORT`       | HTTP port (default `3000`)           |
| `JWT_SECRET` | Secret for signing/verifying JWTs    |

## Scripts

| Command            | Description                |
| ------------------ | -------------------------- |
| `npm run dev`      | Dev server with nodemon    |
| `npm test`         | Run Vitest once            |
| `npm run test:watch` | Vitest watch mode        |

## Running

```bash
npm run dev
```

- API base: `http://localhost:<PORT>` (see `.env`)
- **Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs) (adjust port if needed)

## Authentication

1. **Login (public):** `POST /api/auth/login`  
   Body: `{ "email": "...", "password": "..." }`  
   Response: `{ "token": "<JWT>", "user": { "id", "name", "email", "type" } }`

2. **Protected routes:** send header  
   `Authorization: Bearer <token>`

### Seeded admin (in-memory)

| Field    | Value                    |
| -------- | ------------------------ |
| email    | `admin@spsgroup.com.br`  |
| password | `1234`                   |
| type     | `admin`                  |

## API summary

| Method | Path               | Auth   | Description        |
| ------ | ------------------ | ------ | ------------------ |
| GET    | `/`                | No     | Health check       |
| POST   | `/api/auth/login`  | No     | JWT login          |
| GET    | `/api/me`          | Bearer | Current user       |
| GET    | `/api/users`       | Bearer | List users         |
| POST   | `/api/users`       | Bearer | Create user        |
| PUT    | `/api/users/:id`   | Bearer | Update user        |
| DELETE | `/api/users/:id`   | Bearer | Delete user        |

Error payloads commonly use `{ "error": "<code>" }` (e.g. `validation_error`, `email_already_exists`, `user_not_found`, `invalid_credentials`).

## Tests

- Unit and middleware tests live next to sources (`*.test.mjs`).
- Integration tests use **supertest** (`users.integration.test.mjs`).

```bash
npm test
```

## Documentation

- [Architecture](docs/architecture.md) — layers and conventions
- OpenAPI spec is generated from JSDoc in `src/routes.js` and served at `/api-docs`

---

## Original assessment brief

The Portuguese/Spanish challenge text is in [docs/assessment-brief.md](docs/assessment-brief.md).
