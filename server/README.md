# Server — Campus Innovation Hub

The `server/` directory contains the backend API and realtime server for Campus Innovation Hub.

## What it includes

- Express API server with REST endpoints
- MongoDB database connections via Mongoose
- JWT-based authentication for students and mentors
- Team request workflow and booking request handling
- Socket.io for realtime notifications and chat
- File attachment uploads with Multer

## Environment variables

Create a `.env` file in `server/` with:

- `MONGO_URI=<your_mongo_connection_string>`
- `JWT_SECRET=<your_jwt_secret>`
- `PORT=5000` (optional)

## Available scripts

- `npm run dev` — start the server with nodemon
- `npm start` — start the server with Node.js

## Backend notes

- Static uploads are served from `/uploads`
- CORS is currently configured for `http://localhost:5173`
- API routes are mounted under `/api`
- Realtime socket auth uses the same JWT secret as the REST API

## Common endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/bookings`
- `POST /api/team-requests`
- `GET /api/messages/users`
- `GET /api/notifications`

## Deployment notes

- Change allowed CORS origins for production
- Ensure the frontend build is served separately or via static hosting
- Keep `JWT_SECRET` and `MONGO_URI` secure
