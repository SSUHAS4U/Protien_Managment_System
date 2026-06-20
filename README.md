# Protein Management System

A full-stack web application for protein and health management, featuring a React frontend and a Spring Boot backend in a unified monorepo structure.

## Project Structure

This repository is structured as a clean full-stack project:
- **`frontend/`**: The React-based frontend user interface.
- **`backend/`**: The Spring Boot Java backend API.

---

## 🚀 Getting Started

### 1. Frontend (React)

Located in the `frontend` folder.

#### Running Locally:
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm start
   ```
   The app will run at `http://localhost:3000`.

#### Deployment:
Deployed to Netlify: [https://proteinpro.netlify.app/](https://proteinpro.netlify.app/)

---

### 2. Backend (Spring Boot)

Located in the `backend` folder.

#### Prerequisites:
- Java JDK 17 or higher
- Maven (or use the included wrapper `./mvnw`)

#### Running Locally:
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the application:
   - On Windows:
     ```cmd
     mvnw.cmd spring-boot:run
     ```
   - On macOS/Linux:
     ```bash
     ./mvnw spring-boot:run
     ```
