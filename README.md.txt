# Project Management Tool

A full-stack project management application built with the MERN stack (MongoDB, Express.js, React, Node.js) and TypeScript.

---
## ✨ Features

-   User registration and JWT-based authentication.
-   Full CRUD functionality for projects.
-   Full CRUD functionality for tasks within projects.
-   Pagination and server-side search for projects and tasks.
-   A modern, responsive UI built with Ant Design.
-   Unit tests for frontend components using Vitest and React Testing Library.
-   Backend database seeder for easy setup.

---
## 🛠️ Tech Stack

-   **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt
-   **Frontend:** React, TypeScript, Vite, Ant Design, Tailwind CSS
-   **Testing:** Vitest, React Testing Library

---
## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   MongoDB (A local instance or a free MongoDB Atlas cluster)

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone [your-repo-url]
    ```
2.  **Navigate to the backend folder:**
    ```bash
    cd project-manager-backend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Create a `.env` file** in the backend root and add the following variables:
    ```env
    PORT=8000
    MONGODB_URI="your_mongodb_connection_string"
    ACCESS_TOKEN_SECRET="your-super-secret-key"
    ACCESS_TOKEN_EXPIRY="1d"
    REFRESH_TOKEN_SECRET="your-other-super-secret-key"
    REFRESH_TOKEN_EXPIRY="10d"
    ```
5.  **Run the database seeder:** This will create a test user (`test@example.com`, `Test@123`), projects, and tasks.
    ```bash
    npm run seed
    ```
6.  **Start the server:**
    ```bash
    npm run dev
    ```
    The backend will be running at `http://localhost:8000`.

### Frontend Setup

1.  **Navigate to the frontend folder:**
    ```bash
    cd project-manager-frontend-antd
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the frontend root and add the following:
    ```env
    VITE_API_BASE_URL=http://localhost:8000/api/v1
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173`.

### Running Tests

To run the frontend unit tests, navigate to the frontend folder and run:
```bash
npm test
```

---
## 🐳 (Optional) Docker Support

This section would contain instructions on how to build and run the application using Docker if you choose to implement it.