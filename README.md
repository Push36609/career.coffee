# Caramel Career Coffee

## Advanced Career Counselling Platform

A premium full-stack website built with React + Vite + Tailwind CSS (frontend) and Node.js + Express + SQLite (backend).

---

##  Quick Start

### Prerequisites
- **Node.js** (LTS version) — Download from [nodejs.org](https://nodejs.org)

### Option 1: Double-Click (Windows)
Just double-click `START.bat` — it will automatically install dependencies and start both servers.

### Option 2: Manual Start

**Backend (Terminal 1):**
```bash
cd backend
npm install
node server.js
```
→ API running at http://localhost:5000

**Frontend (Terminal 2):**
```bash
cd frontend
npm install
npm run dev
```
→ Website at http://localhost:5173

---

## 🔑 Default Admin Login

| Field    | Value       |
|----------|-------------|
| User ID  | `admin`     |
| Password | `Admin@123` |

Login URL: http://localhost:5173/login

---

##  Features

-  **Career Counselling** — Schools, Colleges, Students & Parents
-  **All India Exam Alerts** — JEE, NEET, UPSC, CAT, CLAT, NDA & more
-  **Admissions Guidance** — India & Abroad (USA, UK, Canada, Australia)
-  **Compliance** — Regulatory guidance
-  **Blog** — Rich blog with admin writing interface
-  **Testimonials** — With admin approval system
-  **Book Appointment** — Service, date & time selection
-  **Contact Us** — Form, social media, Google Maps
-  **Admin Panel** — Users, Blogs, Appointments, Testimonials
-  **Auth** — JWT login; admin creates users with custom ID+password

---

## 🗄️ Database

SQLite file stored at: `backend/data/career_coffee.db`

View with any SQLite viewer like [DB Browser for SQLite](https://sqlitebrowser.org/).

---

## 📁 Project Structure

```
Career_coffee/
├── START.bat              ← Double-click to run
├── backend/               ← Node.js API
│   ├── server.js
│   ├── database.js
│   ├── routes/
│   └── middleware/
└── frontend/              ← React + Tailwind
    └── src/
        ├── pages/
        ├── components/
        ├── context/
        └── utils/
```
