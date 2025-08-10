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

-   Node.js 
-   npm
-   MongoDB

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/anish-kumar-code/project-manager
    ```
2.  **Navigate to the backend folder:**
    ```bash
    cd backend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Create a `.env` file** in the backend root and add the following variables:
    ```env
    PORT=8000
    MONGODB_URI="mongodb+srv://anishkr2842003:JzlwUrDYKgdDoe4G@cluster0.4j3d4zh.mongodb.net"
    ACCESS_TOKEN_SECRET="Thisismysupersecretaccesstokenandimadethisforprojectmanagerassignment"
    ACCESS_TOKEN_EXPIRY="1d"
    REFRESH_TOKEN_SECRET="Thisismysupersecretrefreshtokenandimadethisforprojectmanagerassignment"
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
    cd frontend
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
