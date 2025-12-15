# LostLink Web Panel – Run Instructions

## Prereqs

- Node 18+ and pnpm (or npm/yarn)
- Docker + Docker Compose (only for container run)

## 1) Environment

```bash
cp .env.example .env
# open .env and fill required values
```

## 2) Run locally (Node)

```bash
npm install          # or yarn
npm run dev          # starts Vite dev server on http://localhost:5173
```

Prod build/preview:

```bash
npm run build
npm run preview      # serves built assets (default http://localhost:4173)
```

## 3) Run with Docker

```bash
cp .env.example .env   # needed for container too
docker build -t lostlink-web .
docker run --env-file .env -p 5173:5173 lostlink-web
# app available at http://localhost:5173
```

With docker-compose (if you prefer):

```bash
docker compose up --build
```
