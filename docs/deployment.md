# Deployment Guide

This document provides comprehensive information about deploying the AtomChat Frontend application to various environments.

## Table of Contents

- [Environment Setup](#environment-setup)
- [Build Configuration](#build-configuration)
- [Production Deployment](#production-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring and Logging](#monitoring-and-logging)
- [Troubleshooting](#troubleshooting)

## Environment Setup

### Prerequisites

Before deploying the application, ensure you have:

- Node.js 18.x or higher
- npm 9.x or higher
- Angular CLI 17.x or higher
- Access to deployment environment
- Backend API running and accessible

### Environment Configuration

Create environment-specific configuration files:

#### Development Environment
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  enableLogging: true,
  enableDebugMode: true
};
```

#### Production Environment
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.atomchat.com/api',
  enableLogging: false,
  enableDebugMode: false
};
```

#### Staging Environment
```typescript
// src/environments/environment.staging.ts
export const environment = {
  production: true,
  apiUrl: 'https://staging-api.atomchat.com/api',
  enableLogging: true,
  enableDebugMode: false
};
```

## Build Configuration

### Angular Build Configuration

Update `angular.json` for different build configurations:

```json
{
  "projects": {
    "atomchat-fe": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/atomchat-fe",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.scss"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "6kb",
                  "maximumError": "10kb"
                }
              ],
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "optimization": true,
              "aot": true
            },
            "staging": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.staging.ts"
                }
              ],
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                }
              ],
              "outputHashing": "all",
              "sourceMap": true,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "optimization": true,
              "aot": true
            }
          }
        }
      }
    }
  }
}
```

### Build Commands

```bash
# Development build
ng build

# Production build
ng build --configuration production

# Staging build
ng build --configuration staging

# Build with source maps (for debugging)
ng build --source-map

# Build with bundle analysis
ng build --stats-json
npx webpack-bundle-analyzer dist/atomchat-fe/stats.json
```

## Production Deployment

### Static Hosting (Netlify, Vercel, GitHub Pages)

#### Netlify Deployment

1. **Build Command Configuration**
```toml
# netlify.toml
[build]
  publish = "dist/atomchat-fe"
  command = "npm run build:prod"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Environment Variables**
Set in Netlify dashboard:
- `API_URL`: https://api.atomchat.com/api
- `ENVIRONMENT`: production

#### Vercel Deployment

1. **Configuration File**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/atomchat-fe"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

2. **Build Script**
```json
// package.json
{
  "scripts": {
    "build:prod": "ng build --configuration production"
  }
}
```

### Docker Deployment

#### Dockerfile
```dockerfile
# Multi-stage build
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build:prod

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=build /app/dist/atomchat-fe /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration
```nginx
# nginx.conf
events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }

    # Handle Angular routing
    location / {
      try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  }
}
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  atomchat-fe:
    build: .
    ports:
      - "80:80"
    environment:
      - API_URL=https://api.atomchat.com/api
    restart: unless-stopped
```

### Cloud Platform Deployment

#### AWS S3 + CloudFront

1. **Build and Upload**
```bash
# Build application
npm run build:prod

# Upload to S3
aws s3 sync dist/atomchat-fe s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

2. **S3 Bucket Configuration**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

#### Google Cloud Platform

1. **Build and Deploy**
```bash
# Build application
npm run build:prod

# Deploy to Firebase Hosting
firebase deploy

# Or deploy to Google Cloud Storage
gsutil -m rsync -r -d dist/atomchat-fe gs://your-bucket-name
```

2. **Firebase Configuration**
```json
// firebase.json
{
  "hosting": {
    "public": "dist/atomchat-fe",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Run linting
        run: npm run lint
        
      - name: Build application
        run: npm run build:prod
        
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build:prod
        
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './dist/atomchat-fe'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: node:${NODE_VERSION}-alpine
  script:
    - npm ci
    - npm test
    - npm run lint
  only:
    - merge_requests
    - main

build:
  stage: build
  image: node:${NODE_VERSION}-alpine
  script:
    - npm ci
    - npm run build:prod
  artifacts:
    paths:
      - dist/atomchat-fe
    expire_in: 1 hour
  only:
    - main

deploy_production:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl -X POST -H "Authorization: Bearer $NETLIFY_TOKEN" -H "Content-Type: application/zip" --data-binary @dist/atomchat-fe.zip https://api.netlify.com/api/v1/sites/$NETLIFY_SITE_ID/deploys
  only:
    - main
  when: manual
```

## Monitoring and Logging

### Application Monitoring

#### Error Tracking with Sentry

1. **Install Sentry**
```bash
npm install @sentry/angular-ivy
```

2. **Configure Sentry**
```typescript
// main.ts
import * as Sentry from "@sentry/angular-ivy";
import { environment } from './environments/environment';

Sentry.init({
  dsn: environment.sentryDsn,
  environment: environment.production ? 'production' : 'development',
  tracesSampleRate: environment.production ? 0.1 : 1.0,
});
```

3. **Error Handling**
```typescript
// error.interceptor.ts
import * as Sentry from "@sentry/angular-ivy";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      Sentry.captureException(error);
      return throwError(() => error);
    })
  );
};
```

#### Performance Monitoring

```typescript
// performance.service.ts
@Injectable({ providedIn: 'root' })
export class PerformanceService {
  constructor() {
    this.initializePerformanceMonitoring();
  }

  private initializePerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }
  }

  public measurePageLoad(): void {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`Page loaded in ${loadTime}ms`);
    });
  }
}
```

### Logging Configuration

```typescript
// logging.service.ts
@Injectable({ providedIn: 'root' })
export class LoggingService {
  private isProduction = environment.production;

  public log(message: string, data?: any): void {
    if (!this.isProduction) {
      console.log(message, data);
    }
  }

  public error(message: string, error?: any): void {
    console.error(message, error);
    // Send to external logging service in production
    if (this.isProduction) {
      this.sendToExternalLogger(message, error);
    }
  }

  public warn(message: string, data?: any): void {
    if (!this.isProduction) {
      console.warn(message, data);
    }
  }

  private sendToExternalLogger(message: string, error?: any): void {
    // Implementation for external logging service
  }
}
```

## Troubleshooting

### Common Deployment Issues

#### Build Failures

1. **Memory Issues**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build:prod
```

2. **TypeScript Errors**
```bash
# Check for type errors
npm run lint
npx tsc --noEmit
```

3. **Dependency Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Runtime Issues

1. **CORS Errors**
```typescript
// Check API URL configuration
console.log('API URL:', environment.apiUrl);
```

2. **Authentication Issues**
```typescript
// Check token storage
console.log('Token:', localStorage.getItem('access_token'));
console.log('User:', localStorage.getItem('user'));
```

3. **Route Issues**
```typescript
// Ensure proper routing configuration
// Check for 404 errors on refresh
```

### Performance Optimization

#### Bundle Analysis

```bash
# Analyze bundle size
npm run build:prod -- --stats-json
npx webpack-bundle-analyzer dist/atomchat-fe/stats.json
```

#### Lazy Loading

```typescript
// Implement lazy loading for routes
const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () => import('./tasks/tasks.component').then(m => m.TasksComponent)
  }
];
```

#### Service Worker

```typescript
// Enable service worker for caching
// ng add @angular/pwa
```

### Health Checks

```typescript
// health-check.service.ts
@Injectable({ providedIn: 'root' })
export class HealthCheckService {
  public checkApplicationHealth(): Observable<boolean> {
    return this.http.get(`${environment.apiUrl}/health`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  public checkDependencies(): Observable<any> {
    return forkJoin({
      api: this.checkApiHealth(),
      database: this.checkDatabaseHealth()
    });
  }

  private checkApiHealth(): Observable<boolean> {
    return this.http.get(`${environment.apiUrl}/health`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  private checkDatabaseHealth(): Observable<boolean> {
    return this.http.get(`${environment.apiUrl}/health/db`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
```

## Security Considerations

### Content Security Policy

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.atomchat.com;
">
```

### Environment Variables

```typescript
// Use environment variables for sensitive data
export const environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'https://api.atomchat.com/api',
  sentryDsn: process.env['SENTRY_DSN'] || '',
  enableAnalytics: process.env['ENABLE_ANALYTICS'] === 'true'
};
```

### HTTPS Configuration

```nginx
# Force HTTPS
server {
  listen 80;
  server_name your-domain.com;
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name your-domain.com;
  
  ssl_certificate /path/to/certificate.crt;
  ssl_certificate_key /path/to/private.key;
  
  # SSL configuration
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
  ssl_prefer_server_ciphers off;
}
```

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code review completed
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Security scan completed
- [ ] Performance tests passed

### Deployment

- [ ] Backup current version
- [ ] Deploy to staging environment
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Monitor application health
- [ ] Verify all features working

### Post-Deployment

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify user feedback
- [ ] Update documentation
- [ ] Notify stakeholders
