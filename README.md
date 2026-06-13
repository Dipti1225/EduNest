# 🎓 EduNest - Modern Educational & School Management Portal

EduNest is a comprehensive, feature-rich Educational Portal and School Management System. Designed for the modern learning environment, EduNest bridges the gap between **Students**, **Teachers**, **School/Institution Administrators**, and **System Administrators** into a single, cohesive web platform. 

Equipped with an **AI Study Assistant** powered by the Gemini API, an online exam and test engine, calendar scheduling, real-time messaging, and multi-tier role dashboard management, EduNest offers an all-in-one suite to run modern schools.

---

## 🚀 Key Modules & Features

### 🧑‍🎓 Student Portal
- **Dashboard**: Track academic progress, upcoming events, and check-ins.
- **Online Test Engine**: Participate in active online examinations and see instantaneous performance reports.
- **Assignments & Homework**: Access, download, and submit homework/classroom assignments.
- **Syllabus & Material Access**: Access syllabus outlines, course schedules, and download reference materials (PDFs, PPTs).
- **Video Materials**: Watch and learn from curriculum videos uploaded by teachers.
- **Calendar**: Interactive monthly schedules, due dates, and school activity notifications.
- **Premium Upgrades**: Ability for students to purchase premium tier features/resources.

### 👨‍🏫 Teacher Portal
- **Classroom Folder**: Organize folders, courses, and view student attendance logs.
- **Syllabus & Course Creator**: Create, update, and detail standard-wise curriculum outlines.
- **Notes & Upload Center**: Upload course PDFs, slides, and educational videos.
- **Assignment Manager**: Design assignments with due dates and grade submitted homework.
- **Test Creator**: Build assessments, schedule tests, and review student grades.
- **Messaging**: Directly message students, parents, and administrative staff.

### 🏫 School/Institution Admin Portal
- **Public Portal**: Showcase school descriptions, contact details, activities, and standard-wise details publicly.
- **Teacher Allocations**: Assign and allocate teachers to specific standards, divisions, and subjects.
- **Student & Teacher Directories**: Detailed record sheets of all registered teachers and students.
- **Academic & Achievements Dashboard**: Keep track of institution-wide accomplishments, academic averages, and student progress graphs.

### ⚙️ Global Administrator Dashboard
- **Institution Management**: Review, register, and approve new educational institutions in the platform.
- **User Auditing**: Monitor and manage all global user profiles and login access.

### 🤖 Core Platform Extras
- **AI Assistant**: In-app conversational AI tutor powered by Gemini API to suggest grading notes, assist students with questions, and create study plans.
- **In-App Direct Messages**: Safe in-platform communication thread between peers and mentors.
- **Ratelimiting Security**: Integrated Redis ratelimiting to secure API routes and prevent brute force requests.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Fast, modern Single Page Application architecture. |
| **Styling** | Tailwind CSS + DaisyUI | Beautiful CSS tokens, clean gradients, responsive and customizable themes. |
| **Backend** | Node.js + Express 5 (ESM) | High performance asynchronous API endpoints. |
| **Database** | MongoDB + Mongoose | Scalable, document-based schemas for user logs, tests, messages, and records. |
| **Security** | JWT + Bcrypt | Encrypted passwords and secure stateful session tokens. |
| **Ratelimiting** | Upstash Redis | Secure Redis integration for rate-limiting. |
| **API Client** | Axios | Centralized client with authorization interceptors. |
| **Media Handling**| Multer | Server-side file and video uploads. |

---

## 📦 Project Directory Structure

```text
EduNest/
├── backend/                  # Node/Express Backend Server
│   ├── src/
│   │   ├── config/           # Database Connection
│   │   ├── controllers/      # Route Controller Logic
│   │   ├── middleware/       # Authentication, Role verification & Error handling
│   │   ├── models/           # Mongoose DB Schemas
│   │   ├── routes/           # API Routing endpoints
│   │   ├── utils/            # Multer/file utilities
│   │   ├── server.js         # API Entrance file
│   │   └── .env              # Server Configuration and API Keys
│   └── package.json
│
├── frontend/                 # Vite/React Frontend App
│   ├── public/               # Static icons, manifests
│   ├── src/
│   │   ├── assets/           # UI Images and Logos
│   │   ├── components/       # Navbars, Layout, AI Assistant, UI Components
│   │   ├── context/          # Context states (User logins, Auth)
│   │   ├── pages/            # View Pages (Students, Teachers, Schools, Admin dashboards)
│   │   ├── utils/            # Axios instance
│   │   ├── main.jsx          # Entry point
│   │   └── App.jsx           # Routing & Router configurations
│   ├── tailwind.config.js    # Tailwind customizations
│   ├── vite.config.js        # Vite configurations
│   └── package.json
│
├── .gitignore                # Excluded build files, node_modules & backend uploads
├── .gitattributes
└── README.md
```

---

## ⚙️ Getting Started & Setup Guide

### 1. Prerequisites
Make sure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v16.x or newer)
* [MongoDB](https://www.mongodb.com/) (Local database or MongoDB Atlas account)

---

### 2. Backend Setup
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the server-side dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `backend/src` directory (`backend/src/.env`) and add the following keys:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_signing_token
   GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio
   ```
4. Start the backend development server (with auto-reload using nodemon):
   ```bash
   npm run dev
   ```
   The backend should successfully launch at `http://localhost:5001`.

---

### 3. Frontend Setup
1. Open a new terminal tab and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the client-side dependencies:
   ```bash
   npm install
   ```
3. Start the frontend developer server (Vite):
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 🔒 Security & Best Practices
* **Uploads Folder Exclusion**: The `backend/uploads/` directory is ignored inside `.gitignore` to prevent committing massive binary files, video resources, and PDFs to Git, adhering to GitHub's file storage limits.
* **Environment Credentials**: Sensitive keys, database URIs, and JWT credentials are stored locally inside `backend/src/.env` and must never be pushed to version control.