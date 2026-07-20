# AI Task Manager

A full-stack task management application with JWT authentication, CRUD operations, dashboard analytics, and a built-in local AI description generator. The project is documented and configured for a MongoDB-based backend deployment.

---

## Project Overview

AI Task Manager is a production-ready web application built with **Angular 20** on the frontend and **Node.js + Express + MongoDB Atlas + Mongoose** on the backend. Users can register, log in, manage tasks with full CRUD, filter and search, view a live dashboard, and use the AI description generator to auto-fill task details based on the title.

---

## Features

- **Authentication** — Register, login, logout with JWT tokens and bcrypt password hashing
- **Protected Routes** — Angular auth guards on all dashboard/task pages; guest guards on auth pages
- **Task CRUD** — Create, read, update, delete tasks with validation on both frontend and backend
- **Dashboard** — Live stats: total, completed, in-progress, and pending task counts
- **Search & Filter** — Real-time debounced search by title; filter by status and priority
- **AI Description Generator** — Click ✨ after entering a title to auto-generate a contextual description using local NLP heuristics
- **Responsive Design** — Mobile, tablet, and desktop layouts using Bootstrap 5
- **Lazy Loading** — All Angular pages are lazy-loaded for optimal bundle size

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM / schema validation |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth |
| express-validator | Request validation |
| dotenv | Environment variables |
| cors | Cross-origin support |

### Frontend
| Technology | Purpose |
|---|---|
| Angular 20 | SPA framework (standalone components) |
| Angular Router | Client-side routing + lazy loading |
| Angular Reactive Forms | Form handling and validation |
| Angular HttpClient | HTTP with functional interceptors |
| Bootstrap 5 | Responsive UI |
| Bootstrap Icons | Icon library |
| Angular Signals | Reactive state management |

---

## Folder Structure

```text
ai-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js        # MongoDB connection
│   │   │   └── jwt.js             # Token generation & verification
│   │   ├── controllers/
│   │   │   ├── authController.js  # Register, login, getMe
│   │   │   └── taskController.js  # Full CRUD + AI description
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT protect middleware
│   │   │   ├── errorHandler.js    # Centralized error handling
│   │   │   └── validate.js        # express-validator runner
│   │   ├── models/
│   │   │   ├── User.js            # User schema (bcrypt pre-hook)
│   │   │   └── Task.js            # Task schema with indexes
│   │   ├── routes/
│   │   │   ├── auth.js            # /api/auth/*
│   │   │   └── tasks.js           # /api/tasks/*
│   │   ├── services/
│   │   │   └── aiService.js       # Local AI description engine
│   │   ├── utils/
│   │   │   └── AppError.js        # Custom error class
│   │   └── server.js              # Express entry point
│   ├── .env
│   └── package.json
│
└── frontend/
    └── src/
        ├── app/
        │   ├── components/
        │   │   ├── navbar/         # Top navigation bar
        │   │   ├── stats-card/     # Dashboard stat tile
        │   │   └── task-card/      # Task item card with menu
        │   ├── core/
        │   │   └── auth.interceptor.ts  # Attaches Bearer token
        │   ├── guards/
        │   │   └── auth.guard.ts   # authGuard + guestGuard
        │   ├── models/
        │   │   ├── auth.model.ts   # User, AuthResponse, DTOs
        │   │   └── task.model.ts   # Task, TaskStats, filters
        │   ├── pages/
        │   │   ├── auth/login/     # Login page
        │   │   ├── auth/register/  # Register page
        │   │   ├── dashboard/      # Stats + recent tasks
        │   │   └── tasks/
        │   │       ├── task-list/  # All tasks + search/filter
        │   │       └── task-form/  # Create / Edit task + AI
        │   ├── services/
        │   │   ├── auth.service.ts # Login, register, logout, signals
        │   │   └── task.service.ts # All task HTTP calls
        │   ├── app.config.ts       # provideRouter, provideHttpClient
        │   ├── app.routes.ts       # Lazy-loaded route definitions
        │   └── app.ts              # Root component
        ├── environments/
        │   ├── environment.ts      # Dev: localhost:5000
        │   └── environment.prod.ts # Prod: your domain
        └── styles.scss             # Bootstrap + global tokens
```

---

## Installation Steps

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account or local MongoDB instance
- Angular CLI 20 (optional for dev): `npm install -g @angular/cli@20`

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ai-task-manager
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file with the MongoDB connection details, then:
```bash
npm run dev
# or
npm start
```

The API will be running at `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
ng serve
```

The Angular app will be running at `http://localhost:4200`.

---

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ai-task-manager?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:4200
```

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on |
| `MONGODB_URI` | MongoDB Atlas or local MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`, `24h`) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Allowed CORS origin (Angular app URL) |

---

## Deploy to Render

This repo includes a [Render Blueprint](https://render.com/docs/infrastructure-as-code) (`render.yaml`) for deployment.

### Services created

| Service | Type | URL |
|---|---|---|
| `ai-task-manager-backend` | Web (Node.js) | `https://ai-task-manager-backend.onrender.com` |
| `ai-task-manager-frontend` | Static Site (Angular) | `https://ai-task-manager-frontend.onrender.com` |

### Steps

1. Push this repo to GitHub.
2. Open [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
3. Connect the repository and apply the Blueprint.
4. Add a MongoDB service or external connection string to `MONGODB_URI`.
5. Set the backend and frontend env vars in Render.
6. Verify the API: `GET https://ai-task-manager-backend.onrender.com/api/health`
7. Open the frontend URL and register a demo account.

### Already configured in `render.yaml`

- Backend health check at `/api/health`
- Frontend SPA rewrite (`/*` → `/index.html`) for Angular routing
- Production API URL in `frontend/src/environments/environment.prod.ts`
- CORS `CLIENT_URL` pointing at the frontend service

---

## API Documentation

### Base URL
```text
http://localhost:5000/api
```

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

Response 201:
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com" }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "secret123"
}
```

Response 200:
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com" }
}
```

---

## Notes

- The app is designed to work with a MongoDB Atlas connection for production reliability.
- Local development can use a MongoDB instance running on your machine or a cloud MongoDB service.
- The frontend uses the backend API base URL configured in the Angular environment files.


Response 200: same shape as register
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com" }
}
```

---

### Tasks

All task endpoints require `Authorization: Bearer <token>`.

#### Get All Tasks (with filters)
```
GET /tasks?search=login&status=Todo&priority=High

Response 200:
{
  "success": true,
  "count": 2,
  "stats": { "total": 10, "completed": 3, "inProgress": 4, "pending": 3 },
  "tasks": [ ... ]
}
```

#### Get Single Task
```
GET /tasks/:id

Response 200:
{ "success": true, "task": { ... } }
```

#### Create Task
```
POST /tasks
Content-Type: application/json

{
  "title": "Build Login Page",
  "description": "...",
  "status": "Todo",
  "priority": "High"
}

Response 201:
{ "success": true, "task": { "_id": "...", ... } }
```

#### Update Task
```
PUT /tasks/:id
Content-Type: application/json

{ "status": "Completed" }

Response 200:
{ "success": true, "task": { ... } }
```

#### Delete Task
```
DELETE /tasks/:id

Response 200:
{ "success": true, "message": "Task deleted successfully." }
```

#### Generate AI Description
```
POST /tasks/generate-description
Content-Type: application/json

{ "title": "Build Login Page" }

Response 200:
{
  "success": true,
  "description": "Create a responsive login page with form validation...",
  "domain": "auth"
}
```

---

## AI Feature: How It Works

The AI description generator lives entirely in `backend/src/services/aiService.js` and requires **no external API or paid service**.

### Algorithm

1. **Domain Detection** — The title is scanned against 15 keyword dictionaries (auth, ui, api, database, testing, deployment, performance, security, notifications, reporting, payments, search, mobile, refactor, documentation). Each domain gets a score; the highest-scoring domain wins.

2. **Template Selection** — Each domain has 3 hand-crafted description templates. One is picked at random, keeping responses varied.

3. **Action Injection** — The `{action}` placeholder in the template is filled with the task title (lowercased for mid-sentence flow). If the title already starts with an action verb (`build`, `create`, `implement`, etc.) it's used as-is; otherwise "implement" is prepended.

**Example:**

```
Title: "Build Login Page"
↓
Domain detected: auth (matched keywords: "login", "page")
↓
Template: "Implement {action} with secure JWT-based authentication, bcrypt password 
hashing, input validation, and proper error handling..."
↓
Result: "implement build login page with secure JWT-based authentication..."
```

This produces contextually relevant, engineering-quality descriptions without any network call.

---

## AI Tools Used

- **Claude (Anthropic)** — Used as a coding assistant to scaffold boilerplate, review architecture decisions, and suggest idiomatic Angular 20 patterns (functional interceptors, signals-based state, `@if`/`@for` control flow).

---

## What I Implemented Myself

- Overall application architecture (MVC backend, feature-based Angular structure)
- The local AI description generation algorithm — keyword scoring, template library, domain mapping, and action verb detection
- JWT authentication flow end-to-end (bcrypt hashing, token generation, protected routes)
- Sequelize schema design with indexes for query performance
- Centralized error handling middleware covering Sequelize, JWT, and duplicate-key errors
- Angular reactive state management using Signals (`signal`, `computed`)
- Debounced search with RxJS `Subject` to prevent excessive API calls
- Lazy-loaded Angular routing to minimize initial bundle size
- Responsive card layout with priority-colored left borders and hover micro-interactions
- Bootstrap 5 integration with custom CSS tokens for a cohesive visual identity

---

## Challenges Faced

1. **Angular 20 Signals + class property initialization order** — Using `this.service.signal` as a class field initializer before the constructor runs throws a TypeScript error. Solved by switching to `inject()` at the field level instead of constructor injection.

2. **Functional HTTP interceptors** — Angular 20 no longer uses class-based interceptors. Migrated to `HttpInterceptorFn` with `inject()` inside the function body.

3. **Query performance** — Running two separate queries (filtered tasks + full stats) on every request. Plan to replace with a single SQL aggregation in v2.

4. **Local AI relevance** — Getting contextually accurate descriptions without an LLM requires careful keyword curation. The multi-keyword scoring approach (vs simple `includes`) significantly improved domain detection accuracy for compound titles like "Set up CI/CD pipeline for Docker deployment".

---

## Future Improvements

- [ ] Replace double-query stats with a single SQL aggregation for efficiency
- [ ] Add task due dates with overdue highlighting and calendar view
- [ ] WebSocket integration for real-time collaboration (multiple users on shared boards)
- [ ] Integrate Claude API (`claude-sonnet-4-6`) as an opt-in enhanced AI mode
- [ ] Drag-and-drop Kanban board view (Todo → In Progress → Completed columns)
- [ ] Email notifications for task assignments and due-date reminders
- [ ] Export tasks to CSV / PDF
- [ ] Dark mode toggle
- [ ] Unit + E2E test suite (Jest + Cypress)
- [ ] Docker Compose setup for one-command local development
- [ ] Rate limiting per user (express-rate-limit)
