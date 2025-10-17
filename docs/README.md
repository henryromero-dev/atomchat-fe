# AtomChat Frontend Documentation

Welcome to the AtomChat Frontend documentation. This document provides comprehensive information about the Angular-based frontend application architecture, components, services, and development guidelines.

## Table of Contents

- [Architecture Overview](./architecture.md)
- [Getting Started](./getting-started.md)
- [Components](./components.md)
- [Services](./services.md)
- [Domain Models](./domain-models.md)
- [Development Guide](./development.md)
- [Testing](./testing.md)

## Quick Overview

AtomChat Frontend is an Angular 17 application that implements a simplified hexagonal architecture pattern. The application provides a task management interface with user authentication capabilities.

### Key Features

- **User Authentication**: Login and registration with email-based authentication
- **Task Management**: Create, read, update, delete, and toggle task completion
- **Responsive UI**: Built with PrimeNG components for a modern user experience
- **State Management**: Centralized state management using RxJS BehaviorSubjects
- **Clean Architecture**: Simplified hexagonal architecture for maintainability

### Technology Stack

- **Framework**: Angular 17 (Standalone Components)
- **UI Library**: PrimeNG 17
- **State Management**: RxJS with BehaviorSubjects
- **Testing**: Jest with Angular Testing Library
- **Styling**: SCSS
- **Build Tool**: Angular CLI

## Project Structure

```
src/app/
├── application/          # Application layer (business logic)
├── core/                # Shared services and configuration
├── domain/              # Domain entities and repository interfaces
├── infrastructure/      # External service implementations
├── interfaces/          # UI components and pages
└── shared/              # Reusable UI components and utilities
```

For detailed architecture information, see [Architecture Overview](./architecture.md).

## Getting Started

To get started with the project, see [Getting Started](./getting-started.md).

## Contributing

When contributing to this project, please follow the guidelines outlined in [Development Guide](./development.md).
