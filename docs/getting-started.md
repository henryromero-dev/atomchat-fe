# Getting Started

This guide will help you set up and run the AtomChat Frontend application locally.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Angular CLI**: Version 17.x or higher

### Installing Prerequisites

#### Node.js and npm
1. Download and install Node.js from [nodejs.org](https://nodejs.org/)
2. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### Angular CLI
Install Angular CLI globally:
```bash
npm install -g @angular/cli
```

Verify installation:
```bash
ng version
```

## Project Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd atomchat-fe
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

The application uses environment files for configuration. Copy the example environment file:

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

Edit `src/environments/environment.ts` with your configuration:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api', // Backend API URL
  firebase: {
    // Firebase configuration if needed
  }
};
```

### 4. Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200`

## Available Scripts

### Development
```bash
# Start development server
npm start

# Build for production
npm run build

# Build and watch for changes
npm run watch
```

### Testing
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

## Project Structure

```
atomchat-fe/
├── docs/                    # Documentation
├── src/
│   ├── app/
│   │   ├── application/     # Application layer
│   │   ├── core/           # Core services and configuration
│   │   ├── domain/         # Domain entities and interfaces
│   │   ├── infrastructure/ # External service implementations
│   │   ├── interfaces/     # UI components
│   │   └── shared/         # Shared components and utilities
│   ├── assets/             # Static assets
│   ├── environments/       # Environment configurations
│   └── styles.scss         # Global styles
├── angular.json            # Angular configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Backend Integration

The frontend application communicates with the AtomChat backend API. Ensure the backend is running and accessible at the configured URL.

### API Endpoints

The application expects the following backend endpoints:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion

## Development Workflow

### 1. Feature Development
1. Create domain entities if needed
2. Define repository interfaces
3. Implement infrastructure layer
4. Create application services
5. Build UI components
6. Add tests

### 2. Code Standards
- Follow Angular style guide
- Use TypeScript strict mode
- Write unit tests for services
- Write component tests for UI
- Use Prettier for code formatting
- Follow ESLint rules

### 3. Testing Strategy
- Unit tests for services and utilities
- Component tests for UI components
- Integration tests for complete workflows
- Aim for 80%+ code coverage

## Troubleshooting

### Common Issues

#### Port Already in Use
If port 4200 is already in use:
```bash
ng serve --port 4201
```

#### Node Modules Issues
If you encounter issues with dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Angular CLI Issues
If Angular CLI commands don't work:
```bash
npm install -g @angular/cli@latest
```

#### TypeScript Errors
If you see TypeScript errors:
```bash
npm run build
```

### Environment Issues

#### API Connection
- Verify backend is running
- Check API URL in environment configuration
- Ensure CORS is configured on backend

#### Authentication
- Check if backend authentication endpoints are working
- Verify token storage in browser developer tools
- Check network requests in browser dev tools

## Next Steps

1. **Explore the Architecture**: Read [Architecture Overview](./architecture.md)
2. **Understand Components**: See [Components Documentation](./components.md)
3. **Learn about Services**: Check [Services Documentation](./services.md)
4. **Review Domain Models**: See [Domain Models](./domain-models.md)
5. **Development Guidelines**: Read [Development Guide](./development.md)

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review the documentation
3. Check existing issues in the repository
4. Create a new issue with detailed information

## Contributing

See [Development Guide](./development.md) for contribution guidelines and best practices.
