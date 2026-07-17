# DeskFlow — Internal IT Ticketing System

A full-stack ticketing tool: employees report IT issues, admins triage and resolve them.

- **Frontend:** React 18 (Vite, functional components, hooks, Context API for auth), with a React error boundary for unexpected UI failures
- **Backend:** Node.js + Express, JWT-based auth, role-based access control, centralized error handling
- **Database:** MongoDB via Mongoose
- **API testing/docs:** Postman Collection (v2.1) — see `/postman`

## Project structure

```
deskflow/
├── backend/          Express API, Mongoose models, JWT auth, validation
├── frontend/          React app (Vite)
└── postman/           Postman collection + environment
```

## 1. Backend setup

```bash
cd backend
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET as needed
npm install
npm run seed               # creates demo Employee + Admin accounts
npm run dev                 # starts the API on http://localhost:5000
```

Demo accounts created by the seed script:

| Role     | Email                    | Password    |
|----------|---------------------------|-------------|
| Employee | employee@deskflow.com     | password123 |
| Employee | employee2@deskflow.com    | password123 |
| Admin    | admin@deskflow.com        | password123 |

(Two employee accounts are seeded so you can verify that employees only ever see their own tickets, not each other's.)

### Environment variables (`backend/.env`)

| Variable        | Description                                  |
|-----------------|-----------------------------------------------|
| `PORT`          | API port (default `5000`)                     |
| `MONGO_URI`     | MongoDB connection string                      |
| `JWT_SECRET`    | Secret used to sign JWTs — keep this private   |
| `JWT_EXPIRES_IN`| Token lifetime (e.g. `8h`)                     |
| `CLIENT_ORIGIN` | Allowed CORS origin for the frontend           |

`.env` is git-ignored — never commit real secrets.

## 2. Frontend setup

```bash
cd frontend
cp .env.example .env       # points at the local API by default
npm install
npm run dev                 # starts the app on http://localhost:5173
```

Open the app, log in with any demo account above.

## 3. API overview

| Method | Route                | Access          | Description                                |
|--------|-----------------------|-----------------|----------------------------------------------|
| POST   | `/api/auth/login`     | Public          | Returns a JWT + role for a seeded user        |
| POST   | `/api/tickets`        | Employee        | Creates a new ticket                          |
| GET    | `/api/tickets`        | Employee/Admin  | Employees see only their own; Admins see all  |
| GET    | `/api/tickets/:id`    | Employee/Admin  | Fetch a single ticket (owner or Admin)        |
| PUT    | `/api/tickets/:id`    | Admin           | Updates a ticket's status                     |

All ticket routes require `Authorization: Bearer <token>`.

## 4. Testing the API with Postman

1. Import `postman/DeskFlow.postman_collection.json` and `postman/DeskFlow.postman_environment.json`.
2. Select the **DeskFlow Local** environment.
3. Run **Auth → Login as Employee** and **Auth → Login as Admin** — each saves its token into collection variables automatically.
4. Run **Tickets → Create Ticket (Employee)** — saves the new ticket's id.
5. Run the remaining requests, including the negative-path requests (missing fields, no token, wrong role, invalid status, ticket not found) to confirm the corresponding `400` / `401` / `403` / `404` responses.

## 5. Error handling

The API returns consistent JSON error responses and standard status codes, and is designed not to crash on bad input:

- `400 Bad Request` — validation failures, malformed JSON bodies, invalid MongoDB ObjectIds
- `401 Unauthorized` — missing, invalid, or expired token; bad login credentials
- `403 Forbidden` — authenticated but wrong role for the action
- `404 Not Found` — unknown route or ticket id
- `500 Internal Server Error` — unexpected server-side failure (logged, never crashes the process)

The server also has process-level safety nets (`unhandledRejection`, `uncaughtException` handlers, graceful `SIGTERM` shutdown) so it logs and stays up rather than dying silently under unexpected conditions. Request bodies are capped at 10kb to guard against oversized payloads.

On the frontend, an `ErrorBoundary` catches unexpected rendering errors and shows a recoverable "Something went wrong" screen instead of a blank page, and an axios response interceptor automatically logs the user out if their token has expired or been invalidated, rather than leaving them stuck seeing repeated auth errors.

## 6. Security notes

- Passwords are hashed with bcrypt before being stored; the password field is excluded from queries by default.
- JWTs are signed with a secret from `.env` and expire after `JWT_EXPIRES_IN`.
- Role checks are enforced server-side on every protected route.
- `.env` files are excluded from version control via `.gitignore` in both `backend/` and `frontend/`.
- Request body size is limited to reduce the risk of oversized-payload abuse.

## 7. Manual QA checklist

These were verified during development and are worth re-checking before submission:

- [ ] Wrong password / nonexistent email → clean `401`, no server crash
- [ ] Blank title/description on ticket creation → validation errors on both frontend and backend
- [ ] Employee A cannot see Employee B's tickets (verify with `employee@deskflow.com` vs `employee2@deskflow.com`)
- [ ] Employee cannot update ticket status (`403` if attempted directly via Postman)
- [ ] Admin sees and can update all tickets, and status changes persist after a page refresh
- [ ] Stopping the backend while the frontend is open produces a friendly error, not a blank crash
- [ ] Reloading the frontend while logged in keeps the session (token persists in `localStorage`)

## 8. Git hygiene

This project was built incrementally across the 5-day sprint schedule; commit history should reflect that rather than a single final commit, e.g.:

```
feat: initialize Express app, configure Mongoose schemas, and scaffold API routing
feat: implement auth and ticket controllers with validation and role-based access
feat: bootstrap React app with routing, layout, and simulated auth
feat: connect React frontend to the API with axios and persist auth state
fix: add second demo employee to verify ticket isolation
chore: error-handling cleanup, UI polish, and final documentation
```
