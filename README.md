# 🚀 ProjectManager

A modern full-stack Project & Task Management system built with Node.js, Express, MongoDB, and React. Easily manage projects, tasks, and users with authentication, soft deletes, and more.

---

## 📦 Project Structure

```
Assignment/
  client/   # React Frontend
  server/   # Express Backend
  README.md
```

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/amitkumar822/ProjectManager.git
cd ProjectManager
```

### 2. Setup the Backend

```bash
cd server
cp .env.example .env   # Fill in your MongoDB URI, JWT secrets, etc.
npm install
```

#### Start the Backend Server

```bash
npm run dev
# or for production
npm start
```

#### Seed the Database

Populate with test user, projects, and tasks:

```bash
npm run seed
```

- **Test User:**  
  Email: `test@example.com`  
  Password: `Test@123`
- **Projects:** 2 (`active`, `completed`)
- **Tasks:** 3 per project (`todo`, `in-progress`, `done`)

---

### 3. Setup the Frontend

```bash
cd ../client
cp .env.example .env   # Set VITE_API_URL to your backend URL (e.g., http://localhost:4001)
npm install
npm run dev
```

---

## 🌐 API Endpoints

All endpoints are prefixed with `/api/v1`.

### 🔑 Auth

#### **POST** `/user/register`
- **Body:**  
  ```json
  {
    "email": "user@example.com",
    "password": "string (min 4 chars)"
  }
  ```
- **Response:**  
  ```json
  {
    "statusCode": 201,
    "data": { "userId": "...", "email": "..." },
    "message": "User Register Successful"
  }
  ```

#### **POST** `/user/login`
- **Body:**  
  ```json
  {
    "email": "user@example.com",
    "password": "string"
  }
  ```
- **Response:**  
  ```json
  {
    "statusCode": 200,
    "data": { "userId": "...", "email": "...", "accessToken": "...", "refreshToken": "..." },
    "message": "User Login Successful"
  }
  ```

---

### 📁 Projects

#### **POST** `/project/create-project`
- **Body:**  
  ```json
  {
    "title": "string (min 3 chars, required)",
    "description": "string (min 10 chars, required)"
  }
  ```
- **Response:**  
  ```json
  {
    "statusCode": 201,
    "data": { "title": "...", "description": "...", "status": "active", ... },
    "message": "Project create successfully"
  }
  ```

#### **GET** `/project/get-user-project`
- **Query:** `status` (optional), `page`, `limit`
- **Response:**  
  ```json
  {
    "statusCode": 200,
    "data": {
      "results": [ { "title": "...", ... } ],
      "total": 2,
      "page": 1,
      "limit": 10
    },
    "message": "Projects fetched successfully"
  }
  ```

#### **PUT** `/project/update-project/:projectId`
- **Body:**  
  ```json
  {
    "title": "string (min 3 chars, required)",
    "description": "string (min 10 chars, required)",
    "status": "active | completed"
  }
  ```

#### **DELETE** `/project/soft-delete-project/:projectId`
- Soft deletes a project (moves to trash).

---

### ✅ Tasks

#### **POST** `/task/create-task/:projectId`
- **Body:**  
  ```json
  {
    "title": "string (min 3 chars, required)",
    "description": "string (min 10 chars, required)",
    "dueDate": "ISO date string (required)"
  }
  ```
- **Response:**  
  ```json
  {
    "statusCode": 201,
    "data": { "title": "...", "status": "todo", ... },
    "message": "Task created successfully"
  }
  ```

#### **GET** `/task/get-user-tasks`
- **Query:** `status`, `page`, `limit`
- **Response:**  
  ```json
  {
    "statusCode": 200,
    "data": {
      "results": [ { "title": "...", ... } ],
      "total": 6,
      "page": 1,
      "limit": 10
    },
    "message": "Tasks fetched successfully"
  }
  ```

#### **PUT** `/task/update-task/:taskId`
- **Body:**  
  ```json
  {
    "title": "string (min 3 chars, required)",
    "description": "string (min 10 chars, required)",
    "status": "todo | in-progress | done",
    "dueDate": "ISO date string"
  }
  ```

#### **DELETE** `/task/soft-delete-task/:taskId`
- Soft deletes a task (moves to trash).

---

### 🗑️ Trash & Recovery

#### **GET** `/project/trash-delete-task-project`
- Get all soft-deleted tasks and projects.

#### **POST** `/project/recover-task-or-project/:id`
- Recover a soft-deleted task or project.

#### **DELETE** `/project/permanently-delete-task-or-project/:id`
- Permanently deletes a task or project from trash.

---

## 🧹 Auto-Delete Cron

- Soft-deleted tasks/projects are **auto-deleted after 30 days**.
- See [`server/src/utils/autoDeleteCron.ts`](server/src/utils/autoDeleteCron.ts).

---

## 📝 Notes

- All protected endpoints require authentication (JWT via cookies).
- Use the seeded test user for quick access.
- For more endpoints, see the code in [`server/src/routes/`](server/src/routes/).

---

## 💡 Want More?

- Need random dummy data or soft-delete logic for users?  
  **Let us know!**

---

## 📄 License

MIT

---



