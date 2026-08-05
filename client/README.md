# Campus Innovation Hub — Client

React 19 + Vite frontend for the Campus Innovation Hub platform. Role-based dashboards for students, mentors, and admins with real-time chat and notifications via Socket.io.

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Framework | React 19, Vite 8                                |
| Routing   | React Router v7                                 |
| Styling   | Tailwind CSS v4 (via `@tailwindcss/vite`)        |
| HTTP      | Axios (centralized instance in `services/api.js`)|
| Realtime  | Socket.io-client v4                             |
| Charts    | Recharts                                        |
| Icons     | lucide-react                                    |
| Toasts    | react-hot-toast                                 |

---

## Project Structure

```
client/
├── public/
│   └── favicon.svg
└── src/
    ├── assets/                  # Static images (hero.png, etc.)
    ├── components/
    │   ├── Avatar.jsx           # User avatar with fallback initials
    │   ├── ConfirmDialog.jsx    # Reusable confirmation modal
    │   ├── Footer.jsx
    │   ├── Modal.jsx            # Generic modal wrapper
    │   ├── Navbar.jsx           # Top navigation bar
    │   ├── Notifications.jsx    # Notification dropdown
    │   ├── Pagination.jsx       # Page controls
    │   ├── PasswordMeter.jsx    # Password strength indicator
    │   ├── ProtectedRoute.jsx   # Role-based route guard
    │   ├── SearchBar.jsx        # Debounced search input
    │   └── Spinner.jsx          # Loading spinner
    ├── context/
    │   ├── AuthContext.jsx      # Auth state, login/logout, light/dark theme
    │   └── SocketContext.jsx    # Socket.io client, notifications state
    ├── hooks/
    │   └── useDebounce.js       # Debounce hook for search inputs
    ├── layouts/
    │   └── DashboardLayout.jsx  # Shared sidebar + <Outlet /> wrapper
    ├── pages/
    │   ├── admin/
    │   │   ├── AdminDashboard.jsx   # Platform-wide stats
    │   │   ├── AdminEvents.jsx      # Manage events
    │   │   ├── AdminMentors.jsx     # Manage mentors
    │   │   ├── AdminProjects.jsx    # Manage projects
    │   │   ├── AdminSettings.jsx    # Platform settings
    │   │   ├── AdminStartups.jsx    # Manage startups
    │   │   └── AdminStudents.jsx    # Manage students
    │   ├── mentor/
    │   │   ├── MentorEvents.jsx     # Browse events
    │   │   ├── MentorHome.jsx       # Mentor dashboard
    │   │   ├── MentorMessages.jsx   # Real-time chat
    │   │   ├── MentorProfile.jsx    # Profile editor
    │   │   ├── MentorProjects.jsx   # Browse projects
    │   │   ├── MentorRequests.jsx   # Approve/reject bookings
    │   │   ├── MentorSettings.jsx   # Settings
    │   │   └── MentorStudents.jsx   # Browse students
    │   ├── student/
    │   │   ├── StudentBookings.jsx      # Book mentors, track status
    │   │   ├── StudentEvents.jsx        # Browse & join events
    │   │   ├── StudentHome.jsx          # Student dashboard
    │   │   ├── StudentMentors.jsx       # Browse & book mentors
    │   │   ├── StudentMessages.jsx      # Real-time chat
    │   │   ├── StudentProfile.jsx       # Profile editor
    │   │   ├── StudentProjects.jsx      # Browse & create projects
    │   │   ├── StudentSettings.jsx      # Settings
    │   │   ├── StudentStartups.jsx      # Browse startups
    │   │   └── StudentTeamRequests.jsx  # Send/manage team requests
    │   ├── AccessDenied.jsx
    │   ├── ForgotPassword.jsx
    │   ├── Login.jsx
    │   ├── NotFound.jsx
    │   ├── Register.jsx
    │   └── ResetPassword.jsx
    ├── services/
    │   └── api.js               # Axios instance + all API call exports
    ├── utils/
    │   └── helpers.js
    ├── App.jsx                  # Router, providers, role-based redirect
    └── main.jsx
```

---

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Other scripts:
```bash
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint
```

---

## Authentication Flow

1. User logs in via `/login` (student/admin) or mentor login flow.
2. JWT token, role, and user object are stored in `localStorage`.
3. `AuthContext` rehydrates state on page load by calling `/api/auth/me` (student/admin) or `/api/mentors/profile` (mentor).
4. `ProtectedRoute` checks `role` against `allowedRoles` — redirects to `/access-denied` if unauthorized.
5. Axios interceptor attaches `Authorization: Bearer <token>` to every request and redirects to `/login` on 401.

---

## Real-time (Socket.io)

`SocketContext` manages the socket lifecycle:

- Connects to ('https://campus-innovation-hub.onrender.com') with JWT in `auth.token` when a user is logged in.
- Emits `register` with `{ userId, userModel }` on connect to join the online users map.
- Listens for `notification` events and prepends them to the notifications list.
- Exposes `socket`, `notifications`, `unreadCount`, `markRead`, `markAll`, and `connected`.
- Disconnects and cleans up on logout.

Chat pages use `socket.on('newMessage', ...)` directly to receive live messages.

---

## API Service (`services/api.js`)

Centralized Axios instance pointing to `http://localhost:5000/api`.

Exported functions by resource:

| Resource       | Functions                                                                 |
|----------------|---------------------------------------------------------------------------|
| Auth           | `loginUser`, `registerUser`, `getMe`, `forgotPassword`, `resetPassword`   |
| Mentor Auth    | `loginMentor`, `registerMentor`, `getMentorProfile`                       |
| Users          | `getUsers`, `getUserById`, `updateUser`, `deleteUser`, `matchUsersBySkill`|
| Mentors        | `getMentors`, `getMentorById`, `updateMentor`, `deleteMentor`             |
| Projects       | `getProjects`, `getProjectById`, `createProject`, `updateProject`, `deleteProject` |
| Events         | `getEvents`, `getEventById`, `createEvent`, `updateEvent`, `deleteEvent`  |
| Startups       | `getStartups`, `getStartupById`, `createStartup`, `updateStartup`, `deleteStartup` |
| Bookings       | `getBookings`, `createBooking`, `updateBooking`, `deleteBooking`          |
| Team Requests  | `getTeamRequests`, `createTeamRequest`, `updateTeamRequest`               |
| Messages       | `getChatUsers`, `getMessages`, `createMessage`, `uploadMessageAttachment` |
| Notifications  | `getNotifications`, `markNotificationRead`, `markAllNotificationsRead`    |
| Ideas          | `getIdeas`, `getIdeaById`, `createIdea`, `updateIdea`, `deleteIdea`       |
| Hackathons     | `getHackathons`, `getHackathonById`, `createHackathon`, `updateHackathon`, `deleteHackathon`, `registerHackathon` |
| Dashboard      | `getDashboardStats`                                                       |

---

## Routes

| Path                        | Role    | Component               |
|-----------------------------|---------|-------------------------|
| `/login`                    | Public  | Login                   |
| `/register`                 | Public  | Register                |
| `/forgot-password`          | Public  | ForgotPassword          |
| `/reset-password/:token`    | Public  | ResetPassword           |
| `/student`                  | Student | StudentHome             |
| `/student/profile`          | Student | StudentProfile          |
| `/student/bookings`         | Student | StudentBookings         |
| `/student/projects`         | Student | StudentProjects         |
| `/student/events`           | Student | StudentEvents           |
| `/student/startups`         | Student | StudentStartups         |
| `/student/mentors`          | Student | StudentMentors          |
| `/student/team-requests`    | Student | StudentTeamRequests     |
| `/student/messages`         | Student | StudentMessages         |
| `/student/settings`         | Student | StudentSettings         |
| `/mentor`                   | Mentor  | MentorHome              |
| `/mentor/profile`           | Mentor  | MentorProfile           |
| `/mentor/students`          | Mentor  | MentorStudents          |
| `/mentor/projects`          | Mentor  | MentorProjects          |
| `/mentor/requests`          | Mentor  | MentorRequests          |
| `/mentor/events`            | Mentor  | MentorEvents            |
| `/mentor/messages`          | Mentor  | MentorMessages          |
| `/mentor/settings`          | Mentor  | MentorSettings          |
| `/admin`                    | Admin   | AdminDashboard          |
| `/admin/students`           | Admin   | AdminStudents           |
| `/admin/mentors`            | Admin   | AdminMentors            |
| `/admin/projects`           | Admin   | AdminProjects           |
| `/admin/events`             | Admin   | AdminEvents             |
| `/admin/startups`           | Admin   | AdminStartups           |
| `/admin/settings`           | Admin   | AdminSettings           |
| `*`                         | Any     | NotFound                |

Root `/` redirects to the appropriate dashboard based on role, or to `/login` if unauthenticated.

---

## Theme

The app supports light and dark modes. The toggle is managed in `AuthContext` via `toggleTheme` / `lightMode`. The `light` class is applied to `document.documentElement` and persisted in `localStorage`.

---

## Build & Deploy

```bash
npm run build
```

Output is in `dist/`. Deploy to any static host (Vercel, Netlify, S3, etc.) or serve from Express:

```js
app.use(express.static(path.join(__dirname, '../client/dist')))
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')))
```

> Update the `BASE` URL in `src/services/api.js` and the Socket.io URL in `src/context/SocketContext.jsx` to point to your production backend before building.
