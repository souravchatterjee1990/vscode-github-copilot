# Minimal To-Do Application

A small full-stack To-Do application built to explore GitHub Copilot Agent capabilities with a simple backend and Angular frontend.

## Architecture

```text
Browser -> Angular Frontend -> Spring Cloud Gateway -> Task Service -> H2 Database
```

## Project Structure

```text
todo-application/
├── gateway/
├── task-service/
├── frontend/
└── README.md
```

## Technologies Used

- Java 21
- Spring Boot 3.3.x
- Spring Cloud Gateway
- Spring Data JPA
- H2 Database
- Angular 22
- Angular Material
- TypeScript

## Running the Backend

1. Start the Task Service:
   ```bash
   cd task-service
   mvn spring-boot:run
   ```

The task service is avialable on port 8081.

## Running the Frontend

```bash
cd frontend
npm install
npm start
```

Open http://localhost:4200.

## Available REST APIs

- GET /api/tasks
- GET /api/tasks/{id}
- POST /api/tasks
- PUT /api/tasks/{id}
- DELETE /api/tasks/{id}
