# Task Management Application

A full-stack, responsive Task Management SaaS Web Application designed for creating, updating, deleting, and tracking tasks. Built with a clean, modern design system, secure JWT-based user authentication, and advanced search, filter, and sorting features.

---

## 🚀 Features

- **User Authentication & Authorization**:
  - Secure JWT authentication token stored client-side.
  - Password hashing using `bcryptjs`.
  - Protected API and client-side routing.
  - User-specific data access (users can only interact with tasks they own).
- **Task Management (CRUD)**:
  - Create, view, update, and delete tasks.
  - Quick status checks directly from task cards.
  - Comprehensive task fields: Title, Description, Status (Pending, In Progress, Completed), Priority (Low, Medium, High), and Due Date.
- **Interactive Dashboard**:
  - Summarized analytics: Total tasks, Completed, Pending, In Progress, High Priority, and Deadlines due soon (next 3 days).
  - Quick lists for urgent incomplete tasks and calendar warnings.
- **Search, Filter, & Sort System**:
  - Text search by Title or Description.
  - Category filters by Status and Priority.
  - Order sorts by Newest Created, Oldest Created, and Due Date (Soonest first).
  - Responsive search debouncing (350ms delay) to save API calls.
- **SaaS Dashboard UI**:
  - Responsive layout (Mobile, Tablet, Desktop) with an off-canvas drawer sidebar.
  - Modern, minimalist, light-mode palette with brand highlights (Violet/Indigo).
  - Empty states, loading spinners, and destructive confirm modals.

---

## 🛠️ Tech Stack

**Frontend**:
- React.js (v19)
- Vite (fast HMR dev tool)
- Tailwind CSS (utility-first styling framework)
- React Router (page routing)
- Axios (HTTP requests with interceptors)
- Lucide React (vector icons)

**Backend**:
- Node.js
- Express.js (REST API framework)

**Database & Auth**:
- MongoDB with Mongoose (ODM)
- JSON Web Token (JWT) (session tokens)
- bcryptjs (password hashing)

---

## 📂 Folder Structure

```
task-management-app/
├── client/                      # Frontend Vite React App
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            # Auth guards (ProtectedRoute)
│   │   │   ├── layout/          # Layout shell (Sidebar, Navbar, AppLayout)
│   │   │   ├── tasks/           # Task components (TaskCard, TaskFormModal, TaskDetailsModal, TaskSearchBar)
│   │   │   └── ui/              # Reusable UI elements (Loader, EmptyState, ConfirmationModal)
│   │   ├── context/             # AuthContext (global user state)
│   │   ├── pages/               # Views (Login, Register, Dashboard, Tasks)
│   │   ├── services/            # Axios API instances & interceptors
│   │   ├── App.jsx              # App Routing config
│   │   └── main.jsx             # Entrypoint
│   ├── tailwind.config.js       # Tailwind variables configuration
│   └── package.json
│
├── server/                      # Backend Express API
│   ├── config/                  # Database connections
│   ├── controllers/             # Request handlers (auth, tasks)
│   ├── middleware/              # Auth middleware (JWT protection)
│   ├── models/                  # Database schemas (User, Task)
│   ├── routes/                  # API endpoints definition
│   ├── utils/                   # Code helpers (JWT token generators)
│   ├── server.js                # Core API entrypoint
│   └── package.json
│
├── .gitignore                   # Version control ignore lists
├── .env.example                 # Public environment variables mockup
├── package.json                 # Project management scripts
└── README.md                    # Documentation
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server/` directory (you can copy the root `.env.example`).

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/taskmanager
JWT_SECRET=defaultsecretkey123456789_taskmanager_project
```

- **`PORT`**: Port number for backend server.
- **`MONGODB_URI`**: Local MongoDB URI or MongoDB Atlas connection string.
- **`JWT_SECRET`**: Random secret key to sign authentication tokens.

---

## 📦 Installation & Setup

Ensure you have **Node.js** (v18+) and **MongoDB** installed and running on your machine.

### 1. Clone the project
```bash
git clone https://github.com/iutkarsh15/task-management-application.git
cd task-management-application
```

### 2. Install all dependencies
We configured a custom script in the root directory to download dependencies for both backend and frontend automatically:
```bash
npm run install-all
```

### 3. Setup configuration
Create a `.env` file inside the `/server` directory using `/server/.env` or copying `.env.example`.

### 4. Run the application
Run the development environment from the root folder:
```bash
npm run dev
```
This runs the Express API (port 5000) and the Vite Client (port 5173) **concurrently** in a single console.

---

## 📡 API Endpoints

### Auth Routes (`/api/auth`)
- **`POST /api/auth/register`**: Register a new user.
- **`POST /api/auth/login`**: Authenticate a user and retrieve a token.
- **`GET /api/auth/me`**: Get currently authenticated user (requires token).

### Task Routes (`/api/tasks`)
- **`GET /api/tasks`**: Retrieve all tasks for the logged-in user (supports search, status/priority filtering, and sorting).
- **`POST /api/tasks`**: Create a new task (requires title and dueDate).
- **`GET /api/tasks/:id`**: View specific task details.
- **`PUT /api/tasks/:id`**: Update all task parameters.
- **`DELETE /api/tasks/:id`**: Delete a task.
- **`PATCH /api/tasks/:id/status`**: Edit status only (Pending, In Progress, Completed).

---

## 🔮 Future Enhancements
- **Real-Time Synchronizations**: Integrate Socket.io to push task changes across multiple browser tabs/sessions instantly.
- **Categorization Labels**: Add customizable color-coded labels/tags (e.g. Work, Personal, Chore) to tasks.
- **Push Notifications**: Integrate native browser notifications or email reminders when task deadlines are approaching.

---

## ✍️ Author

- **Author**: Utkarsh Chandra
- **GitHub**: [iutkarsh15](https://github.com/iutkarsh15)
- **LinkedIn**: [Utkarsh Chandra](https://www.linkedin.com/in/uttkarsh-chandra-40164132a)
