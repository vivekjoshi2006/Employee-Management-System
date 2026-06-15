# 🏢 EMS Pro - Enterprise Employee Management System

EMS Pro is a modern, full-stack Employee Management System designed to streamline HR administration, payroll processing, attendance tracking, and leave management.

The application uses a decoupled architecture with a **React (Vite) + Tailwind CSS** frontend and a **Node.js (Express) + Sequelize ORM** backend.

It is optimized for seamless deployment on serverless platforms such as Vercel while maintaining a robust local development environment using SQLite.

---

# 🛠️ Technology Stack

| Layer              | Technologies Used                                                                       |
| ------------------ | --------------------------------------------------------------------------------------- |
| **Frontend**       | React 18, Vite, Tailwind CSS, Axios, React Router DOM v6, Lucide React                  |
| **Backend**        | Node.js, Express.js, Sequelize ORM                                                      |
| **Databases**      | PostgreSQL (Cloud via Neon), SQLite (Local Development)                                 |
| **Authentication** | JSON Web Token (JWT), BcryptJS                                                          |
| **Utilities**      | PDFKit                                                                                  |

---

# 🚀 Key Modules

## 🔐 Role-Based Access Control (RBAC)

### Administrator Portal

* Manage departments and organizational structure
* Register and maintain employee records
* Monitor attendance and shift logs
* Review and process leave requests
* Generate and manage payroll records
* Download employee salary slips in PDF format

### Employee Portal

* Clock in and clock out attendance
* Apply for leave requests
* View leave application history
* Access attendance records
* Download monthly salary slips

---

## 🏢 Department Management

* Create and manage departments
* Department status control (Active / Inactive)
* Department descriptions and metadata

---

## 👨‍💼 Employee Management

* Employee profile registration
* Automated employee ID generation
* Department assignment
* Salary and personal information management
* Date of birth and employment tracking

---

## 📅 Leave Management

* Leave application workflow
* Approval and rejection system
* Leave history tracking
* Role-based leave visibility

---

## ⏰ Attendance Management

* Digital punch-in / punch-out system
* Daily attendance tracking
* Attendance history reports
* Employee-wise and date-wise filtering

---

## 💰 Payroll Management

* Monthly salary generation
* Allowance and deduction calculations
* Tax deductions
* Net salary computation
* PDF salary slip generation

---

# 📂 Project Structure

```text
Employee-Management-System/
├── vercel.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    │
    ├── tailwind.config.cjs
    ├── vite.config.js
    └── package.json
```

---

# 💻 Local Installation & Setup

## Prerequisites

Ensure the following software is installed:

* Node.js v18+
* npm v9+

Verify installation:

```bash
node -v
npm -v
```

---

# Backend Setup

Navigate to backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

For local SQLite support:

```bash
npm install sqlite3
```

Create a `.env` file:

```env
PORT=5000

JWT_SECRET=your_super_secure_jwt_key
```

Run backend server:

```bash
npm run dev
```

The application automatically initializes a local SQLite database and runs an idempotent seed process if the database is empty.

Backend URL:

```text
http://localhost:5000
```

---

# Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# 🔐 Default Credentials

Once initialized, EMS Pro automatically creates default user accounts.

## Administrator Account

```text
Email: vj@ems.com
Password: 12
```

## Employee Account

```text
Email: emp@ems.com
Password: 12
```

> Change these credentials immediately before production deployment.

---

# 📡 API Overview

Base URL:

```text
/api
```

## Authentication

| Endpoint    | Method | Description                   |
| ----------- | ------ | ----------------------------- |
| /auth/login | POST   | User login and JWT generation |

## Employees

| Endpoint       | Method | Access        |
| -------------- | ------ | ------------- |
| /employees     | GET    | Authenticated |
| /employees/add | POST   | Admin         |
| /employees/:id | DELETE | Admin         |

## Departments

| Endpoint     | Method | Access        |
| ------------ | ------ | ------------- |
| /departments | GET    | Authenticated |
| /departments | POST   | Admin         |

## Leaves

| Endpoint           | Method | Access        |
| ------------------ | ------ | ------------- |
| /leaves            | GET    | Authenticated |
| /leaves/apply      | POST   | Authenticated |
| /leaves/update/:id | PUT    | Admin         |

## Attendance

| Endpoint          | Method | Access        |
| ----------------- | ------ | ------------- |
| /attendance       | GET    | Authenticated |
| /attendance/punch | POST   | Authenticated |

## Payroll

| Endpoint              | Method | Access        |
| --------------------- | ------ | ------------- |
| /payroll              | GET    | Authenticated |
| /payroll              | POST   | Admin         |
| /payroll/download/:id | GET    | Authenticated |

---

# 🔒 Security Features

* JWT Authentication
* Password Hashing with BcryptJS
* Role-Based Authorization
* Protected API Routes
* Middleware-Based Access Control

---

# 📄 PDF Salary Slips

Generated salary slips include:

* Employee Information
* Payroll Month
* Basic Salary
* Allowances
* Deductions
* Tax Information
* Net Salary

PDF files are generated dynamically using PDFKit.

---

# ⚙️ Git Maintenance

Prevent local runtime files from being pushed to GitHub.

Remove tracked SQLite database:

```bash
git rm --cached backend/database.sqlite
```

Remove Vercel cache:

```bash
git rm -rf --cached .vercel
```

Recommended `.gitignore`:

```gitignore
backend/database.sqlite
.vercel
.env
node_modules/
dist/
```

---

# 🚧 Future Enhancements

* Multi-level Leave Approval Workflow
* Employee Profile Photo Uploads
* Real-time Notifications
* Dashboard Analytics and Charts
* Excel Report Export
* Multi-Branch Support
* REST API Versioning
* Docker Deployment
* Email Notifications

---

# 🤝 Contributing

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push changes

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.
