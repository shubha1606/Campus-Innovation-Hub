# Campus Innovation Hub — Server

Express 5 + MongoDB backend for the Campus Innovation Hub platform. Provides REST APIs for auth, users, mentors, bookings, projects, events, startups, ideas, hackathons, messaging, and notifications. Real-time features are powered by Socket.io v4.

---

## Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Runtime     | Node.js >= 18                           |
| Framework   | Express 5                               |
| Database    | MongoDB via Mongoose 9                  |
| Auth        | JWT (jsonwebtoken 9), bcryptjs 3        |
| Realtime    | Socket.io v4                            |
| File Upload | Multer 1 (disk storage, 10 MB limit)    |
| Email       | Nodemailer 9                            |
| Dev         | nodemon                                 |

---

## Project Structure

```
server/
├── config/
│   └── db.js                    # Mongoose connection (exits on failure)
├── controllers/
│   ├── authController.js        # register, login, getMe, forgotPassword, resetPassword
│   ├── bookingController.js     # CRUD + notification triggers on create/status change
│   ├── dashboardController.js   # Aggregated platform stats
│   ├── eventController.js       # CRUD + joinEvent
│   ├── hackathonController.js   # CRUD + registerHackathon
│   ├── ideaController.js        # CRUD
│   ├── mentorController.js      # register, login, profile, CRUD
│   ├── messageController.js     # getChatUsers, getMessages, createMessage, uploadAttachment
│   ├── notificationController.js# getNotifications, markRead, markAllRead, createNotification (internal)
│   ├── projectController.js     # CRUD
│   ├── startupController.js     # CRUD
│   ├── teamRequestController.js # create, list, update (accept/reject)
│   └── userController.js        # CRUD + matchUsersBySkill
├── middleware/
│   ├── authMiddleware.js        # protect — resolves User or Mentor from JWT
│   ├── adminMiddleware.js       # adminOnly — role guard
│   ├── mentorAuthMiddleware.js  # mentorProtect — Mentor-only JWT guard
│   └── authorize.js
├── models/
│   ├── Booking.js
│   ├── Event.js
│   ├── Hackathon.js
│   ├── Idea.js
│   ├── Mentor.js
│   ├── Message.js
│   ├── Notification.js
│   ├── Project.js
│   ├── Startup.js
│   ├── TeamRequest.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   ├── dashboardRoutes.js
│   ├── eventRoutes.js
│   ├── hackathonRoutes.js
│   ├── ideaRoutes.js
│   ├── mentorRoutes.js
│   ├── messageRoutes.js
│   ├── notificationRoutes.js
│   ├── projectRoutes.js
│   ├── startupRoutes.js
│   ├── teamRequestRoutes.js
│   └── userRoutes.js
├── seeds/
│   └── createAdmin.js           # Upsert admin user (safe to re-run)
├── uploads/                     # Multer file storage (gitignored)
├── utils/
│   └── sendEmail.js             # Nodemailer helper (console fallback in dev)
├── .env                         # Environment variables (never commit)
├── package.json
└── server.js                    # App entry point + Socket.io setup
```

---

## Setup

```bash
npm install
```

Create `.env`:
```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>

# Optional — password reset emails
SMTP_HOST=<smtp_host>
SMTP_PORT=<smtp_port>
SMTP_USER=<smtp_email>
SMTP_PASS=<smtp_password>
FROM_EMAIL=<from_address>
FRONTEND_URL=http://localhost:5173

# Optional — admin seeder
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<admin_password>
ADMIN_NAME=Admin
```

```bash
npm run dev    # nodemon (development)
npm start      # node (production)
```

---

## API Routes

### Auth — `/api/auth`
| Method | Endpoint                   | Auth   | Description                     |
|--------|----------------------------|--------|---------------------------------|
| POST   | `/register`                | Public | Register student                |
| POST   | `/login`                   | Public | Login (student / admin)         |
| GET    | `/me`                      | JWT    | Get current user                |
| POST   | `/forgot-password`         | Public | Send reset email                |
| POST   | `/reset-password/:token`   | Public | Reset password with token       |

### Users — `/api/users`
| Method | Endpoint         | Auth        | Description              |
|--------|------------------|-------------|--------------------------|
| POST   | `/register`      | Public      | Register user            |
| POST   | `/login`         | Public      | Login user               |
| GET    | `/profile`       | JWT         | Own profile              |
| GET    | `/`              | JWT         | List all users           |
| GET    | `/match/:skill`  | JWT         | Skill-based peer match   |
| GET    | `/:id`           | JWT         | Get user by ID           |
| PUT    | `/:id`           | JWT         | Update user              |
| DELETE | `/:id`           | JWT + Admin | Delete user              |

### Mentors — `/api/mentors`
| Method | Endpoint    | Auth        | Description          |
|--------|-------------|-------------|----------------------|
| POST   | `/register` | Public      | Register mentor      |
| POST   | `/login`    | Public      | Mentor login         |
| GET    | `/profile`  | MentorJWT   | Own mentor profile   |
| GET    | `/`         | Public      | List all mentors     |
| GET    | `/:id`      | Public      | Get mentor by ID     |
| PUT    | `/:id`      | JWT + Admin | Update mentor        |
| DELETE | `/:id`      | JWT + Admin | Delete mentor        |

### Bookings — `/api/bookings`
| Method | Endpoint | Auth   | Description                                      |
|--------|----------|--------|--------------------------------------------------|
| GET    | `/`      | Public | List (filter: `?mentorId=` / `?studentId=`)      |
| GET    | `/:id`   | Public | Get by ID                                        |
| POST   | `/`      | JWT    | Create (triggers mentor notification)            |
| PUT    | `/:id`   | JWT    | Update status / notes (triggers student notification on status change) |
| DELETE | `/:id`   | JWT    | Delete (student or admin only)                   |

Statuses: `Pending` → `Approved` / `Rejected` / `Completed`
Validation: Approved + online requires `meetingLink`; Approved + offline requires `location`.

### Team Requests — `/api/team-requests`
| Method | Endpoint | Auth | Description                  |
|--------|----------|------|------------------------------|
| GET    | `/`      | JWT  | List sent/received requests  |
| POST   | `/`      | JWT  | Send request                 |
| PUT    | `/:id`   | JWT  | Accept or reject             |

### Projects — `/api/projects`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET    | `/`      | JWT  | List all    |
| GET    | `/:id`   | JWT  | Get by ID   |
| POST   | `/`      | JWT  | Create      |
| PUT    | `/:id`   | JWT  | Update      |
| DELETE | `/:id`   | JWT  | Delete      |

### Events — `/api/events`
| Method | Endpoint    | Auth   | Description   |
|--------|-------------|--------|---------------|
| GET    | `/`         | Public | List all      |
| GET    | `/:id`      | Public | Get by ID     |
| POST   | `/`         | JWT    | Create        |
| PUT    | `/:id`      | JWT    | Update        |
| DELETE | `/:id`      | JWT    | Delete        |
| POST   | `/:id/join` | JWT    | Join event    |

### Startups — `/api/startups`
| Method | Endpoint | Auth   | Description |
|--------|----------|--------|-------------|
| GET    | `/`      | Public | List all    |
| GET    | `/:id`   | Public | Get by ID   |
| POST   | `/`      | JWT    | Create      |
| PUT    | `/:id`   | JWT    | Update      |
| DELETE | `/:id`   | JWT    | Delete      |

### Ideas — `/api/ideas`
| Method | Endpoint | Auth   | Description |
|--------|----------|--------|-------------|
| GET    | `/`      | Public | List all    |
| GET    | `/:id`   | Public | Get by ID   |
| POST   | `/`      | JWT    | Create      |
| PUT    | `/:id`   | JWT    | Update      |
| DELETE | `/:id`   | JWT    | Delete      |

### Hackathons — `/api/hackathons`
| Method | Endpoint        | Auth   | Description       |
|--------|-----------------|--------|-------------------|
| GET    | `/`             | Public | List all          |
| GET    | `/:id`          | Public | Get by ID         |
| POST   | `/`             | JWT    | Create            |
| PUT    | `/:id`          | JWT    | Update            |
| DELETE | `/:id`          | JWT    | Delete            |
| POST   | `/:id/register` | JWT    | Register for hackathon |

### Messages — `/api/messages`
| Method | Endpoint     | Auth | Description                                        |
|--------|--------------|------|----------------------------------------------------|
| GET    | `/users`     | JWT  | List all users + mentors for chat                  |
| GET    | `/:targetId` | JWT  | Get conversation (marks messages as read)          |
| POST   | `/`          | JWT  | Send message (socket emit + notification)          |
| POST   | `/upload`    | JWT  | Upload file attachment (max 10 MB, multipart/form-data) |

### Notifications — `/api/notifications`
| Method | Endpoint      | Auth | Description                    |
|--------|---------------|------|--------------------------------|
| GET    | `/`           | JWT  | Get all notifications          |
| PUT    | `/:id/read`   | JWT  | Mark one as read               |
| PUT    | `/read-all`   | JWT  | Mark all as read               |

### Dashboard — `/api/dashboard`
| Method | Endpoint | Auth | Description                                                    |
|--------|----------|------|----------------------------------------------------------------|
| GET    | `/`      | JWT  | Returns `totalUsers`, `totalProjects`, `totalEvents`, `totalMentors`, `totalStartups` |

---

## Middleware

| Middleware          | Usage                                                        |
|---------------------|--------------------------------------------------------------|
| `protect`           | Verifies JWT, resolves `req.user` from User or Mentor model  |
| `adminOnly`         | Requires `req.user.role === 'admin'`                         |
| `mentorProtect`     | Verifies JWT, resolves `req.user` from Mentor model only     |

Token accepted via `Authorization: Bearer <token>` or `x-access-token` header.

---

## Socket.io

The server exposes a Socket.io instance on the same HTTP server.

**Authentication:** JWT passed via `socket.handshake.auth.token` or `Authorization` header.

**Events:**

| Event (client → server) | Payload                          | Description                        |
|--------------------------|----------------------------------|------------------------------------|
| `register`               | `{ userId, userModel }`          | Register socket in `onlineUsers` map |
| `disconnect`             | —                                | Removes user from `onlineUsers` map  |

| Event (server → client) | Payload         | Description                        |
|-------------------------|-----------------|------------------------------------|
| `newMessage`            | Message object  | Delivered to receiver's socket     |
| `notification`          | Notification object | Delivered to recipient's socket |

---

## Seed Admin

```bash
# macOS / Linux
ADMIN_PASSWORD=yourpassword node seeds/createAdmin.js

# Windows
set ADMIN_PASSWORD=yourpassword && node seeds/createAdmin.js
```

Upserts the admin user — safe to run multiple times.

---

## Environment Variables

| Variable         | Required | Description                                        |
|------------------|----------|----------------------------------------------------|
| `PORT`           | No       | Server port (default: 5000)                        |
| `MONGO_URI`      | Yes      | MongoDB connection string                          |
| `JWT_SECRET`     | Yes      | Secret for JWT signing                             |
| `FRONTEND_URL`   | No       | Used in password reset link (default: localhost:5173) |
| `SMTP_HOST`      | No       | SMTP host                                          |
| `SMTP_PORT`      | No       | SMTP port (465 = SSL)                              |
| `SMTP_USER`      | No       | SMTP username                                      |
| `SMTP_PASS`      | No       | SMTP password                                      |
| `FROM_EMAIL`     | No       | Sender address (defaults to SMTP_USER)             |
| `ADMIN_EMAIL`    | No       | Admin seeder email                                 |
| `ADMIN_PASSWORD` | No       | Admin seeder password                              |
| `ADMIN_NAME`     | No       | Admin seeder display name                          |
