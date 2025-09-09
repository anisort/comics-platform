# Comics Platform

Comics Platform is a full‑stack application for reading and publishing comics. It combines an Angular web client with a NestJS API, backed by PostgreSQL and proxied by Nginx for local development via Docker. Readers can browse, search, and read series and episodes; creators can upload, organize, and manage their works; and the platform supports authentication, subscriptions, and notifications.

## Stack
- Frontend: Angular (served on port 4200 in dev)
- Backend: NestJS (served on port 3000; proxied as /api via Nginx)
- Database: PostgreSQL (port 5432)
- Reverse proxy: Nginx (port 8000 → proxies frontend and backend)
- Containerization: Docker & Docker Compose

## Functionality
The Comics Platform provides a streamlined experience for reading and managing comics. At a glance, it offers:

- User management:
  - New user registration.
  - Authentication for existing users with JWT-based authorization (configure JWT_SECRET and JWT_EXPIRES_IN).
- Comics interaction:
  - View latest comics on the main page of the web application.
  - Search for comics by title.
  - Get a list of all comics.
  - Obtain detailed information about a specific comic.
  - Get a list of episodes for a specific comic.
  - Obtain pages to view a specific episode.
  - Manage a personal library: publish, view, edit, and delete your own comics and their structural elements.
  - Subscribe/unsubscribe to comics and receive notifications about new episodes.
  - Get a list of subscriptions.
- Reading experience:
  - Chapter/episode reader optimized for images/pages (served efficiently via the backend; Cloudinary can be used for media hosting).
  - Page-by-page navigation and continuous reading modes (subject to frontend implementation).
- Content management (creators/maintainers):
  - Create and manage series with chapters/episodes and metadata.
  - Upload and manage comic pages/images (requires Cloudinary credentials: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).
- API-first backend:
  - RESTful endpoints under /api for authentication, comics, chapters/episodes, and media handling.
  - Proxy configured via Nginx for a unified dev entrypoint.

Notes
- Authorization is handled via JWT. Ensure JWT_SECRET and JWT_EXPIRES_IN are set.
- Cloudinary credentials are necessary for uploading and serving of media assets in most workflows (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).
- Some features depend on environment configuration (e.g., email) and may be limited or mocked in local dev.

## Repository structure
- comics-platform-frontend/ — Angular application sources
- comics-platform-backend/ — NestJS application sources
- dockerfiles/ — Dockerfiles for frontend and backend
- nginx/ — Nginx config (default.conf)
- docker-compose.yaml — Services orchestration for local development
- env.example — Example environment variables for Compose

## Prerequisites
- Docker 20+ and Docker Compose v2
- (Optional) Node.js 18+ if you want to run parts outside Docker

## Quick start (Docker)
1. Create an .env file at the repository root based on env.example:
   cp env.example .env
   Then edit .env values as needed. At minimum, set:
   - EMAIL_* (SMTP settings)
   - JWT_SECRET (any random string)
   - CLOUDINARY_* (required for uploading/serving images in most workflows; set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)
   - DATABASE_* (default values in env.example will work for local Docker)

2. Build and start the stack:
   docker compose up -d

3. Access the app:
   - Nginx entrypoint: http://localhost:8000
   - Frontend (direct): http://localhost:4200
   - Backend API (direct): http://localhost:3000 (also via Nginx at http://localhost:8000/api)
   - PostgreSQL: localhost:5432 (container name: comics-platform-database, service: pg)

To stop:
   docker compose down

## How it works (local dev via Docker)
- Nginx listens on port 8000 and proxies
  - / -> frontend:4200
  - /api/ -> backend:3000
- The frontend and backend services mount local source directories as volumes for live code iteration.
- The backend connects to the database using DATABASE_* variables from .env. In Docker, DATABASE_HOST should stay as pg (the Compose service name).

## Environment variables
See env.example. Key variables:
- FRONTEND_URL: defaults to http://localhost:4200 for dev
- JWT_SECRET, JWT_EXPIRES_IN: auth token configuration
- EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD: SMTP settings
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET: media hosting
- DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME: Postgres connection

Copy env.example to .env at the repository root; docker-compose.yaml references these values.

## Development tips
- Node modules are installed in containers. The compose config binds /app/node_modules as an anonymous volume to avoid clobbering host files.
- Frontend runs with: npm run start -- --host 0.0.0.0 (exposed on 4200)
- Backend runs with: npm run start:dev (exposed on 3000, hot-reload in dev)
- Database data is persisted in the pg-data Docker volume.

## Troubleshooting
- Port conflicts: Ensure ports 8000, 4200, 3000, 5432 are free or adjust mappings in docker-compose.yaml.
- ENV hasn't been applied: Confirm you created .env at repo root and values are present. Recreate containers after changes.
- DB connection errors: In Docker, DATABASE_HOST must be pg (the service name). Check DATABASE_* values and that the pg service is healthy.
- Proxy: Use Nginx at http://localhost:8000 to exercise both frontend and backend together.

