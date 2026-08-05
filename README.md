# Campus Innovation Hub

A full-stack MERN platform for college students, mentors, and admins to collaborate on projects, form teams, book mentorship, manage events, and share startup ideas — with real-time chat and notifications.

---

## Tech Stack

| Layer        | Technology                                                              |
|--------------|-------------------------------------------------------------------------|
| Frontend     | React 19, Vite 8, React Router v7, Tailwind CSS v4, Axios, Recharts    |
| Backend      | Node.js, Express 5, MongoDB, Mongoose 9                                 |
| Auth         | JWT (jsonwebtoken), bcryptjs                                            |
| Realtime     | Socket.io v4 (chat + notifications)                                     |
| File Upload  | Multer (attachments, profile images, 10 MB limit)                       |
| Email        | Nodemailer (password reset via SMTP)                                    |
| UI Extras    | lucide-react (icons), react-hot-toast (toasts)                          |

---

## Features

### Authentication
- Register / Login for students, mentors, and admins
- Separate mentor auth flow (`/api/mentors/register`, `/api/mentors/login`)
- JWT tokens (7-day expiry) stored in `localStorage`
- Role-based route protection (`student` / `mentor` / `admin`)
- Forgot password / Reset password via SHA-256 hashed email token (1-hour expiry)
- Auto-logout on 401 response via Axios interceptor

### Student
- Dashboard with platform-wide stats (users, projects, events, mentors, startups)
- Edit profile — skills, branch, year, bio, profile image
- Browse mentors and book sessions (online / offline, topic, date, time)
- Track booking status (Pending → Approved / Rejected / Completed)
- Send and manage team requests (skill-based peer discovery)
- Browse and create projects, events, startups, ideas, hackathons
- Real-time messaging with mentors and peers (text + file attachments)
- In-app notifications with unread badge

### Mentor
- Dedicated dashboard with student overview
- Manage incoming booking requests — approve (with meeting link / location) or reject with notes
- Browse students, projects, and events
- Real-time messaging with students
- Profile management

### Admin
- Platform-wide dashboard stats (total users, projects, events, mentors, startups)
- Full CRUD for students, mentors, projects, events, and startups
- Platform settings page

### Realtime (Socket.io)
- JWT-authenticated socket connections
- Online user tracking per model (`User` / `Mentor`) via in-memory `Map`
- Live chat message delivery (`newMessage` event)
- Live notification push (`notification` event)
- Auto-reconnect and cleanup on disconnect

---

## Project Structure

```
Campus-Innovation-Hub/
├── client/                          # React + Vite frontend
│   ├── public/
│   │   └── favicon.svg
│   └── src/
│       ├── assets/                  # Static images
│       ├── components/              # Reusable UI components
│       │   ├── Avatar.jsx
│       │   ├── ConfirmDialog.jsx
│       │   ├── Footer.jsx
│       │   ├── Modal.jsx
│       │   ├── Navbar.jsx
│       │   ├── Notifications.jsx
│       │   ├── Pagination.jsx
│       │   ├── PasswordMeter.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── SearchBar.jsx
│       │   └── Spinner.jsx
│       ├── context/
│       │   ├── AuthContext.jsx      # Auth state, login/logout, theme toggle
│       │   └── SocketContext.jsx    # Socket.io client, notifications state
│       ├── hooks/
│       │   └── useDebounce.js
│       ├── layouts/
│       │   └── DashboardLayout.jsx  # Shared sidebar + outlet wrapper
│       ├── pages/
│       │   ├── admin/
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── AdminEvents.jsx
│       │   │   ├── AdminMentors.jsx
│       │   │   ├── AdminProjects.jsx
│       │   │   ├── AdminSettings.jsx
│       │   │   ├── AdminStartups.jsx
│       │   │   └── AdminStudents.jsx
│       │   ├── mentor/
│       │   │   ├── MentorEvents.jsx
│       │   │   ├── MentorHome.jsx
│       │   │   ├── MentorMessages.jsx
│       │   │   ├── MentorProfile.jsx
│       │   │   ├── MentorProjects.jsx
│       │   │   ├── MentorRequests.jsx
│       │   │   ├── MentorSettings.jsx
│       │   │   └── MentorStudents.jsx
│       │   ├── student/
│       │   │   ├── StudentBookings.jsx
│       │   │   ├── StudentEvents.jsx
│       │   │   ├── StudentHome.jsx
│       │   │   ├── StudentMentors.jsx
│       │   │   ├── StudentMessages.jsx
│       │   │   ├── StudentProfile.jsx
│       │   │   ├── StudentProjects.jsx
│       │   │   ├── StudentSettings.jsx
│       │   │   ├── StudentStartups.jsx
│       │   │   └── StudentTeamRequests.jsx
│       │   ├── ForgotPassword.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── ResetPassword.jsx
│       ├── services/
│       │   └── api.js               # Centralized Axios instance + all API calls
│       └── utils/
│           └── helpers.js
│
└── server/                          # Express + MongoDB backend
    ├── config/
    │   └── db.js                    # Mongoose connection
    ├── controllers/
    │   ├── authController.js        # register, login, getMe, forgotPassword, resetPassword
    │   ├── bookingController.js     # CRUD + notification triggers
    │   ├── dashboardController.js   # Aggregated platform stats
    │   ├── eventController.js       # CRUD + joinEvent
    │   ├── hackathonController.js   # CRUD + registerHackathon
    │   ├── ideaController.js        # CRUD
    │   ├── mentorController.js      # register, login, profile, CRUD
    │   ├── messageController.js     # getChatUsers, getMessages, createMessage, uploadAttachment
    │   ├── notificationController.js# getNotifications, markRead, markAllRead, createNotification
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
    ├── routes/                      # One file per resource
    ├── seeds/
    │   └── createAdmin.js           # Upsert admin user script
    ├── uploads/                     # Multer file storage (gitignored)
    ├── utils/
    │   └── sendEmail.js             # Nodemailer helper (console fallback in dev)
    └── server.js                    # App entry point + Socket.io setup
```

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint                        | Auth     | Description                        |
|--------|---------------------------------|----------|------------------------------------|
| POST   | `/register`                     | Public   | Register a new student             |
| POST   | `/login`                        | Public   | Login (student / admin)            |
| GET    | `/me`                           | JWT      | Get current authenticated user     |
| POST   | `/forgot-password`              | Public   | Send password reset email          |
| POST   | `/reset-password/:token`        | Public   | Reset password with token          |

### Users — `/api/users`

| Method | Endpoint            | Auth        | Description                        |
|--------|---------------------|-------------|------------------------------------|
| GET    | `/`                 | JWT         | List all users                     |
| GET    | `/profile`          | JWT         | Get own profile                    |
| GET    | `/:id`              | JWT         | Get user by ID                     |
| GET    | `/match/:skill`     | JWT         | Find users matching a skill        |
| PUT    | `/:id`              | JWT         | Update user profile                |
| DELETE | `/:id`              | JWT + Admin | Delete user                        |

### Mentors — `/api/mentors`

| Method | Endpoint    | Auth        | Description                        |
|--------|-------------|-------------|------------------------------------|
| POST   | `/register` | Public      | Register a new mentor              |
| POST   | `/login`    | Public      | Mentor login                       |
| GET    | `/profile`  | MentorJWT   | Get own mentor profile             |
| GET    | `/`         | Public      | List all mentors                   |
| GET    | `/:id`      | Public      | Get mentor by ID                   |
| PUT    | `/:id`      | JWT + Admin | Update mentor                      |
| DELETE | `/:id`      | JWT + Admin | Delete mentor                      |

### Bookings — `/api/bookings`

| Method | Endpoint | Auth   | Description                                      |
|--------|----------|--------|--------------------------------------------------|
| GET    | `/`      | Public | List bookings (filter by `mentorId`/`studentId`) |
| GET    | `/:id`   | Public | Get booking by ID                                |
| POST   | `/`      | JWT    | Create booking (triggers mentor notification)    |
| PUT    | `/:id`   | JWT    | Update booking status / notes                    |
| DELETE | `/:id`   | JWT    | Delete booking                                   |

Booking statuses: `Pending` → `Approved` / `Rejected` / `Completed`
- Approved online bookings require `meetingLink`
- Approved offline bookings require `location`

### Team Requests — `/api/team-requests`

| Method | Endpoint | Auth | Description                        |
|--------|----------|------|------------------------------------|
| GET    | `/`      | JWT  | List sent/received requests        |
| POST   | `/`      | JWT  | Send a team request                |
| PUT    | `/:id`   | JWT  | Accept or reject a request         |

### Projects — `/api/projects`

| Method | Endpoint | Auth | Description       |
|--------|----------|------|-------------------|
| GET    | `/`      | JWT  | List all projects |
| GET    | `/:id`   | JWT  | Get project by ID |
| POST   | `/`      | JWT  | Create project    |
| PUT    | `/:id`   | JWT  | Update project    |
| DELETE | `/:id`   | JWT  | Delete project    |

### Events — `/api/events`

| Method | Endpoint      | Auth   | Description              |
|--------|---------------|--------|--------------------------|
| GET    | `/`           | Public | List all events          |
| GET    | `/:id`        | Public | Get event by ID          |
| POST   | `/`           | JWT    | Create event             |
| PUT    | `/:id`        | JWT    | Update event             |
| DELETE | `/:id`        | JWT    | Delete event             |
| POST   | `/:id/join`   | JWT    | Join / register for event|

### Startups — `/api/startups`

| Method | Endpoint | Auth   | Description         |
|--------|----------|--------|---------------------|
| GET    | `/`      | Public | List all startups   |
| GET    | `/:id`   | Public | Get startup by ID   |
| POST   | `/`      | JWT    | Create startup      |
| PUT    | `/:id`   | JWT    | Update startup      |
| DELETE | `/:id`   | JWT    | Delete startup      |

Startup stages: `Idea` / `Prototype` / `MVP` / `Incubation` / `Funded` / `Completed`

### Ideas — `/api/ideas`

| Method | Endpoint | Auth   | Description      |
|--------|----------|--------|------------------|
| GET    | `/`      | Public | List all ideas   |
| GET    | `/:id`   | Public | Get idea by ID   |
| POST   | `/`      | JWT    | Post an idea     |
| PUT    | `/:id`   | JWT    | Update idea      |
| DELETE | `/:id`   | JWT    | Delete idea      |

### Hackathons — `/api/hackathons`

| Method | Endpoint          | Auth   | Description              |
|--------|-------------------|--------|--------------------------|
| GET    | `/`               | Public | List all hackathons      |
| GET    | `/:id`            | Public | Get hackathon by ID      |
| POST   | `/`               | JWT    | Create hackathon         |
| PUT    | `/:id`            | JWT    | Update hackathon         |
| DELETE | `/:id`            | JWT    | Delete hackathon         |
| POST   | `/:id/register`   | JWT    | Register for hackathon   |

### Messages — `/api/messages`

| Method | Endpoint          | Auth | Description                          |
|--------|-------------------|------|--------------------------------------|
| GET    | `/users`          | JWT  | List all chat-able users and mentors |
| GET    | `/:targetId`      | JWT  | Get conversation (marks msgs as read)|
| POST   | `/`               | JWT  | Send a message (triggers notification + socket emit) |
| POST   | `/upload`         | JWT  | Upload file attachment (max 10 MB)   |

### Notifications — `/api/notifications`

| Method | Endpoint        | Auth | Description                    |
|--------|-----------------|------|--------------------------------|
| GET    | `/`             | JWT  | Get all notifications for user |
| PUT    | `/:id/read`     | JWT  | Mark one notification as read  |
| PUT    | `/read-all`     | JWT  | Mark all notifications as read |

Notification types: `message` / `booking` / `teamRequest`

### Dashboard — `/api/dashboard`

| Method | Endpoint | Auth | Description                                          |
|--------|----------|------|------------------------------------------------------|
| GET    | `/`      | JWT  | Returns totalUsers, totalProjects, totalEvents, totalMentors, totalStartups |

---

## Data Models

### User
| Field                  | Type     | Notes                              |
|------------------------|----------|------------------------------------|
| name                   | String   | Required                           |
| email                  | String   | Unique, lowercase                  |
| password               | String   | Bcrypt hashed, stripped from JSON  |
| role                   | String   | `student` / `mentor` / `admin`     |
| college, branch, year  | String/Number |                               |
| skills, interests      | [String] |                                    |
| bio, profileImage      | String   |                                    |
| resetPasswordToken     | String   | SHA-256 hash                       |
| resetPasswordExpires   | Date     | 1-hour window                      |

### Mentor
| Field        | Type     | Notes                    |
|--------------|----------|--------------------------|
| name, email  | String   | Required, unique email   |
| password     | String   | Bcrypt hashed            |
| expertise    | [String] |                          |
| skills       | [String] |                          |
| availability | [String] |                          |
| experience   | Number   | Required                 |
| bio, company | String   |                          |
| profileImage | String   |                          |
| createdBy    | ObjectId | ref: User                |

### Booking
| Field       | Type     | Notes                                        |
|-------------|----------|----------------------------------------------|
| student     | ObjectId | ref: User                                    |
| mentor      | ObjectId | ref: Mentor                                  |
| date, time  | Date/String | Required                                  |
| topic       | String   | Required                                     |
| meetingMode | String   | `online` / `offline`                         |
| meetingLink | String   | Required when status=Approved + online       |
| location    | String   | Required when status=Approved + offline      |
| mentorNote  | String   | Only editable by mentor/admin                |
| status      | String   | `Pending` / `Approved` / `Rejected` / `Completed` |

### TeamRequest
| Field    | Type     | Notes                          |
|----------|----------|--------------------------------|
| sender   | ObjectId | ref: User                      |
| receiver | ObjectId | ref: User                      |
| project  | ObjectId | ref: Project (optional)        |
| message  | String   | Required                       |
| status   | String   | `Pending` / `Accepted` / `Rejected` |

### Message
| Field         | Type     | Notes                          |
|---------------|----------|--------------------------------|
| sender        | ObjectId | refPath: senderModel           |
| senderModel   | String   | `User` / `Mentor`              |
| receiver      | ObjectId | refPath: receiverModel         |
| receiverModel | String   | `User` / `Mentor`              |
| text          | String   |                                |
| attachment    | Object   | filename, url, mimeType, size  |
| read          | Boolean  | default: false                 |

### Notification
| Field      | Type     | Notes                                  |
|------------|----------|----------------------------------------|
| user       | ObjectId | refPath: userModel                     |
| userModel  | String   | `User` / `Mentor`                      |
| type       | String   | `message` / `booking` / `teamRequest`  |
| title      | String   | Required                               |
| message    | String   | Required                               |
| link       | String   | Frontend route to navigate to          |
| read       | Boolean  | default: false                         |

### Project
| Field        | Type      | Notes              |
|--------------|-----------|--------------------|
| title        | String    | Required           |
| description  | String    | Required           |
| technologies | [String]  |                    |
| category     | String    |                    |
| teamMembers  | [ObjectId]| ref: User          |
| githubUrl    | String    |                    |
| liveDemoUrl  | String    |                    |
| image        | String    |                    |
| createdBy    | ObjectId  | ref: User, required|

### Event
| Field             | Type      | Notes                                              |
|-------------------|-----------|----------------------------------------------------|
| title             | String    | Required                                           |
| description       | String    | Required                                           |
| organizer         | String    | Required                                           |
| date              | Date      | Required                                           |
| location          | String    | Required                                           |
| category          | String    | `Hackathon` / `Workshop` / `Seminar` / `Competition` / `Other` |
| mode              | String    | `Online` / `Offline`                               |
| teamMembersCount  | Number    | default: 1                                         |
| registrationUrl   | String    |                                                    |
| participants      | [ObjectId]| ref: User                                          |
| createdBy         | ObjectId  | ref: User                                          |

### Startup
| Field            | Type      | Notes                                                        |
|------------------|-----------|--------------------------------------------------------------|
| title            | String    | Required                                                     |
| description      | String    | Required                                                     |
| problemStatement | String    | Required                                                     |
| solution         | String    | Required                                                     |
| domain           | String    | Required                                                     |
| teamMembers      | [String]  |                                                              |
| status           | String    | `Idea` / `Prototype` / `MVP` / `Incubation` / `Funded` / `Completed` |
| createdBy        | ObjectId  | ref: User                                                    |

### Idea
| Field          | Type      | Notes          |
|----------------|-----------|----------------|
| title          | String    | Required       |
| description    | String    | Required       |
| category       | String    |                |
| requiredSkills | [String]  |                |
| postedBy       | ObjectId  | ref: User      |
| teamMembers    | [ObjectId]| ref: User      |

### Hackathon
| Field                | Type      | Notes                  |
|----------------------|-----------|------------------------|
| name                 | String    | Required               |
| description          | String    | Required               |
| date                 | Date      | Required               |
| registrationDeadline | Date      | Required               |
| location             | String    | Required               |
| mode                 | String    | `online` / `offline`   |
| teamSize             | Number    | Required               |
| organizer            | String    | Required               |
| requiredSkills       | [String]  |                        |
| participants         | [ObjectId]| ref: User              |

---

## Local Setup

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account or local MongoDB instance

### 1. Clone the repository
```bash
git clone <repo-url>
cd Campus-Innovation-Hub
```

### 2. Backend setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>

# Optional — for password reset emails
SMTP_HOST=<smtp_host>
SMTP_PORT=<smtp_port>
SMTP_USER=<smtp_email>
SMTP_PASS=<smtp_password>
FROM_EMAIL=<from_address>
FRONTEND_URL=http://localhost:5173

# Optional — for admin seeder
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<admin_password>
ADMIN_NAME=Admin
```

> If SMTP variables are not set, password reset emails are printed to the console instead (dev fallback).

Start the backend:
```bash
npm run dev    # development with nodemon
npm start      # production
```

### 3. Frontend setup
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Seed the admin user
```bash
# macOS / Linux
cd server
ADMIN_PASSWORD=yourpassword node seeds/createAdmin.js

# Windows
set ADMIN_PASSWORD=yourpassword && node seeds/createAdmin.js
```

The seeder upserts the admin — safe to run multiple times.

---

## Frontend Routes

| Path                        | Role    | Page                        |
|-----------------------------|---------|-----------------------------|
| `/login`                    | Public  | Login                       |
| `/register`                 | Public  | Register                    |
| `/forgot-password`          | Public  | Forgot Password             |
| `/reset-password/:token`    | Public  | Reset Password              |
| `/student`                  | Student | Dashboard                   |
| `/student/profile`          | Student | Profile editor              |
| `/student/bookings`         | Student | Mentor bookings             |
| `/student/projects`         | Student | Projects                    |
| `/student/events`           | Student | Events                      |
| `/student/startups`         | Student | Startups                    |
| `/student/mentors`          | Student | Browse & book mentors       |
| `/student/team-requests`    | Student | Team requests               |
| `/student/messages`         | Student | Real-time chat              |
| `/student/settings`         | Student | Settings                    |
| `/mentor`                   | Mentor  | Dashboard                   |
| `/mentor/profile`           | Mentor  | Profile editor              |
| `/mentor/students`          | Mentor  | Student list                |
| `/mentor/projects`          | Mentor  | Projects                    |
| `/mentor/requests`          | Mentor  | Booking requests            |
| `/mentor/events`            | Mentor  | Events                      |
| `/mentor/messages`          | Mentor  | Real-time chat              |
| `/mentor/settings`          | Mentor  | Settings                    |
| `/admin`                    | Admin   | Dashboard                   |
| `/admin/students`           | Admin   | Manage students             |
| `/admin/mentors`            | Admin   | Manage mentors              |
| `/admin/projects`           | Admin   | Manage projects             |
| `/admin/events`             | Admin   | Manage events               |
| `/admin/startups`           | Admin   | Manage startups             |
| `/admin/settings`           | Admin   | Platform settings           |

---

## Build & Deploy

```bash
# Build frontend
cd client && npm run build

# Start backend in production
cd server && npm start
```

> For production, update the CORS `origin` in `server/server.js` and the `BASE` URL in `client/src/services/api.js` to match your deployed URLs. Deploy `client/dist/` and `server/` separately, or serve the client build statically from Express.

---

## Environment Variables Reference

| Variable         | Required | Description                                  |
|------------------|----------|----------------------------------------------|
| `PORT`           | No       | Server port (default: 5000)                  |
| `MONGO_URI`      | Yes      | MongoDB connection string                    |
| `JWT_SECRET`     | Yes      | Secret key for JWT signing                   |
| `FRONTEND_URL`   | No       | Used in password reset link (default: localhost:5173) |
| `SMTP_HOST`      | No       | SMTP host for email                          |
| `SMTP_PORT`      | No       | SMTP port (465 = SSL, others = STARTTLS)     |
| `SMTP_USER`      | No       | SMTP username / email                        |
| `SMTP_PASS`      | No       | SMTP password                                |
| `FROM_EMAIL`     | No       | Sender address (defaults to SMTP_USER)       |
| `ADMIN_EMAIL`    | No       | Email for admin seeder                       |
| `ADMIN_PASSWORD` | No       | Password for admin seeder                    |
| `ADMIN_NAME`     | No       | Display name for admin seeder                |
