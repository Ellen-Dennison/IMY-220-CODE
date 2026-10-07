# D1 Project

React (Vite) frontend + Express backend, matching the D1 rubric.

## Structure

```
/backend
  index.js
  routes/auth.js
/frontend
  src/components   -- Navigation, Post*, Profile*, Friend, forms
  src/pages        -- LoginPage (entry), SplashPage, HomePage, ProfilePage, PostPage
  src/data         -- dummy data
docker-compose.yml
```

The entry route (`/`) renders **LoginPage**.

## Run locally (without Docker)

Backend:
```
cd backend
npm install
npm run dev
```

Frontend (separate terminal):
```
cd frontend
npm install
BACKEND_URL=http://localhost:4000 npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:4000

## Run with Docker

From the project root:
```
docker compose up --build
```

This runs the frontend and backend in separate containers (frontend on 5173, backend on 4000), matching rubric item p.

## Routes

- `/` , `/login` — Login page (entry point), sign-in/sign-up toggle
- `/signup` — Login page pre-set to sign-up mode
- `/splash` — Splash page with both forms present
- `/home` — Post feed
- `/profile/:id` — Dynamic profile route, e.g. `/profile/u1`
- `/post/:id` — Dynamic post route, e.g. `/post/p1`

## Endpoints

- `POST /api/signin` — returns dummy user + token
- `POST /api/signup` — returns dummy user + token

## Notes

- `node_modules` is excluded via `.gitignore`/`.dockerignore` — do not commit it (rubric penalty).
- Remember to make 5+ commits across the project for the Github rubric line.
