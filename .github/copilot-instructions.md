# GitHub Copilot Instructions

## Project

Modern full-stack application using:

- Java 21
- Spring Boot (latest)
- Maven
- PostgreSQL
- Angular (latest)
- TypeScript
- SCSS

## Coding Standards

- Generate production-quality, clean, readable, and maintainable code.
- Use the latest stable APIs and avoid deprecated features.
- Follow SOLID principles and Clean Code practices.
- Keep methods and classes focused on a single responsibility.

## Backend

- Follow layered architecture: Controller → Service → Repository.
- Use constructor injection.
- Use DTOs for request/response models.
- Use Bean Validation (`@Valid`).
- Follow RESTful API conventions.
- Add unit tests when appropriate.

## Frontend

- Use Angular Standalone Components.
- Use Signals where appropriate.
- Keep components small and reusable.
- Put business logic in services.
- Use strict TypeScript typing and avoid `any`.

## General

- Generate complete implementations with required imports.
- Do not hardcode secrets or credentials.
- Prefer simplicity over unnecessary complexity.
