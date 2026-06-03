# Inventory & Order Management System

A full-stack containerized application with React frontend, FastAPI backend, and PostgreSQL database.

## Features

- Product management: create, read, update, delete
- Customer management: create, read, delete
- Order management: create, view, cancel
- Inventory validation and automatic stock updates
- Responsive React UI with dashboard metrics
- Docker Compose orchestrates frontend, backend, and PostgreSQL

## Local Setup

1. Install Docker Desktop.
2. Create a `.env` file in the project root with your database and API settings.

Example `.env` values:

```env
POSTGRES_USER=<your_username>
POSTGRES_PASSWORD=<your_password>
POSTGRES_DB=<db>
DATABASE_URL=db_url
PORT=8000
VITE_API_URL=http://localhost:8000
```

3. Start the stack from the project root:

```bash
docker compose up --build
```

4. Open the frontend at `http://localhost:3000`.
5. Backend API is available at `http://localhost:8000`.

## Docker Services

- `db`: PostgreSQL 15 storage with named volume
- `backend`: FastAPI app on port 8000
- `frontend`: React app on port 3000

## Notes

- Do not commit `.env` to GitHub.
- `local.db` is used only for local SQLite fallback and should be ignored.
- Backend uses PostgreSQL in Docker Compose via `DATABASE_URL=db_url`.
- Data is persisted in the PostgreSQL named volume `pgdata`.
- Frontend uses `VITE_API_URL` to connect to the backend.

## Deployment

Use free hosting platforms such as Railway / Render for the backend and Vercel / Netlify for the frontend. Configure environment variables accordingly.
