# Campus Innovation Hub

Campus Innovation Hub is a full-stack MERN application built to help college students, mentors, and administrators collaborate on projects, form teams, book mentorship, manage events, and share startup ideas.

## What this project includes

- Student, mentor, and admin authentication with protected dashboards
- Student profile editing with skills, branch, year, and bio
- Mentor booking workflow with approval and notes
- Student team request flow with skill-based discovery
- Project, event, and startup listing pages
- Real-time chat and notification support via Socket.io
- Password reset and secure JWT authentication

## Architecture

- Frontend: React + Vite + React Router + Axios
- Backend: Node.js + Express + MongoDB + Mongoose + JWT
- Realtime: Socket.io for live notifications and chat updates
- File upload: Multer for attachment support

## Project structure

- `client/` — frontend application
- `server/` — backend API and realtime server
- `client/src/services/api.js` — centralized service wrapper for API calls
- `server/controllers/` — business logic for auth, users, bookings, messages, notifications, and more
- `server/models/` — Mongoose models for users, mentors, bookings, requests, and notifications

## Local setup

1. Install dependencies:
   - `cd server && npm install`
   - `cd client && npm install`
2. Create a `.env` file in `server/` with:
   - `MONGO_URI=<your_mongo_connection_string>`
   - `JWT_SECRET=<your_jwt_secret>`
3. Run locally:
   - `cd server && npm run dev`
   - `cd client && npm run dev`
4. Open the client in the browser at the port shown by Vite (default is `http://localhost:5173`).

## Build and deploy

- Build frontend: `cd client && npm run build`
- Start backend: `cd server && npm start`

> For a production deployment, update CORS origins in `server/server.js` and configure your hosting provider to serve the client build or deploy client and server separately.

## Documentation

- `client/README.md` — frontend setup, scripts, and build details
- `server/README.md` — backend setup, environment variables, API notes, and runtime scripts
