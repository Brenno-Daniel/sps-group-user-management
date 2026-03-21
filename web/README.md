# SPS — Front-end (React)

## Requisitos

- Node.js 18+
- API em execução (variável `REACT_APP_SERVER_URL`)

## Configuração

```bash
cp .env.example .env
```

Ajuste `REACT_APP_SERVER_URL` (ex.: `http://localhost:3000`).

## Scripts

| Comando        | Descrição              |
| -------------- | ---------------------- |
| `npm start`    | Servidor de desenvolvimento |
| `npm run build` | Build de produção     |
| `npm run test` | Testes unitários (Vitest + RTL) |
| `npm run test:watch` | Vitest em modo watch |
| `npm run format` | Prettier nos arquivos `src` |

## Stack

- React (CRA), React Router, Tailwind CSS, Framer Motion, Lucide React
- Autenticação JWT via `AuthContext` e `localStorage`
- Rotas: `/login` (público), `/users` (protegida)
