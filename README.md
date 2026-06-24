# Protein Management System

A full-stack web application for protein and health management, featuring a React frontend and a Spring Boot backend in a unified monorepo structure.

## Project Structure

This repository is structured as a clean full-stack project:
- **`frontend/`**: The React-based frontend user interface.
- **`backend/`**: The Spring Boot Java backend API.

---

## 🚀 Getting Started

### 1. Frontend (React)

Located in the `frontend` folder.

#### Running Locally:
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm start
   ```
   The app will run at `http://localhost:3000`.

#### Deployment:
Deployed to Netlify: [https://proteinpro.netlify.app/](https://proteinpro.netlify.app/)

---

### 2. Backend (Spring Boot)

Located in the `backend` folder.

#### Prerequisites:
- Java JDK 17 or higher
- Maven (or use the included wrapper `./mvnw`)

#### Running Locally:
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create your secrets file from the template and fill in real values:
   ```bash
   cp .env.example .env   # then edit .env
   ```
3. Run the application:
   - On Windows:
     ```cmd
     mvnw.cmd spring-boot:run
     ```
   - On macOS/Linux:
     ```bash
     ./mvnw spring-boot:run
     ```

---

## 🔐 Configuration & Secrets

**No secrets are committed to git.** The backend reads them from environment variables
(loaded locally from a gitignored `backend/.env` via `spring-dotenv`). See
[`backend/.env.example`](backend/.env.example) for the full list:

| Variable | Purpose |
|----------|---------|
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | Supabase Postgres connection |
| `MAIL_USERNAME`, `MAIL_PASSWORD` | Gmail SMTP (app password) |
| `SPOONACULAR_API_KEY` | Food/recipe data ([spoonacular.com/food-api](https://spoonacular.com/food-api)) |
| `GROQ_API_KEY` | NutriBot chatbot ([console.groq.com](https://console.groq.com)) |
| `ALLOWED_ORIGINS` | Comma-separated CORS allow-list (no wildcard) |

> ⚠️ The DB and Gmail passwords previously committed to git are compromised —
> **rotate them** in Supabase / Google before redeploying.

### Deploying

- **Backend (Render):** the repo ships a [`render.yaml`](render.yaml) blueprint that
  declares the Docker service and the env-var **keys** it needs (secret values are
  `sync: false`, so nothing sensitive is committed). `PORT` is provided by Render.
- **Frontend (Vercel):** deploys as-is. Optionally set `REACT_APP_API_BASE` to override
  the backend URL; otherwise it auto-targets the Render backend in production.

#### Push secrets to Render automatically (no dashboard typing)

Instead of pasting each key into the Render dashboard, sync them straight from your
local `backend/.env` with the included script:

```bash
# 1. Add a Render API key to backend/.env (RENDER_API_KEY=...)
#    Create one at https://dashboard.render.com/u/settings#api-keys
# 2. Run:
npm run render:env            # uploads all keys; Render auto-redeploys
npm run render:env:deploy     # same, and triggers an explicit deploy
```

The script ([`scripts/render-sync-env.mjs`](scripts/render-sync-env.mjs)) reads your
gitignored `backend/.env`, finds the service by name (`protien-managment-system`, or
`RENDER_SERVICE_ID` if set), and pushes every key/value via the Render API. The
Render credentials themselves (`RENDER_API_KEY`, `RENDER_SERVICE_*`) are never
uploaded and never committed.
