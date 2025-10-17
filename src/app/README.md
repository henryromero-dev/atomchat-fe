# AtomChat Frontend - Arquitectura Hexagonal Simplificada

Esta aplicación implementa una arquitectura hexagonal monolítica, similar al backend, para mantener consistencia y simplicidad.

## Estructura General

```
src/app/
├── core/                     # Servicios compartidos y configuración global
│   ├── guards/              # Guards de autenticación
│   ├── interceptors/        # Interceptores HTTP
│   ├── services/            # Servicios compartidos (toast, loading)
│   ├── models/              # Modelos compartidos
│   └── tokens/              # Tokens de inyección globales
├── domain/                  # Capa de Dominio (Reglas de Negocio)
│   ├── entities/            # Entidades de negocio
│   │   ├── auth-state.entity.ts
│   │   ├── login-request.entity.ts
│   │   ├── login-response.entity.ts
│   │   ├── register-request.entity.ts
│   │   ├── user.entity.ts
│   │   ├── task.entity.ts
│   │   ├── create-task-request.entity.ts
│   │   └── update-task-request.entity.ts
│   └── repositories/        # Interfaces de repositorios
│       ├── auth.repository.ts
│       ├── auth.repository.token.ts
│       ├── task.repository.ts
│       └── task.repository.token.ts
├── application/             # Capa de Aplicación (Lógica de Aplicación)
│   └── services/           # Servicios de aplicación
│       ├── auth-application.service.ts
│       └── task-application.service.ts
├── infrastructure/         # Capa de Infraestructura (Implementaciones)
│   ├── repositories/       # Implementaciones de repositorios
│   │   ├── auth.repository.impl.ts
│   │   └── task.repository.impl.ts
│   └── providers/         # Providers de inyección de dependencias
│       ├── auth-infrastructure.provider.ts
│       └── task-infrastructure.provider.ts
├── interfaces/            # Capa de Interfaces (UI)
│   └── components/        # Componentes de UI
│       ├── login-page.component.ts
│       ├── tasks-page.component.ts
│       └── task-form.component.ts
└── shared/               # Componentes y utilidades compartidas
    ├── ui/              # Componentes de UI reutilizables
    └── utils/           # Utilidades compartidas
```

## Arquitectura Hexagonal

La aplicación sigue los principios de Clean Architecture con una estructura hexagonal simplificada:

### 1. **Domain Layer (Dominio)**
- **Entidades**: Objetos de negocio con validaciones y comportamientos
- **Repositorios**: Interfaces para acceso a datos
- **Sin dependencias externas**

### 2. **Application Layer (Aplicación)**
- **Servicios**: Lógica de aplicación y orquestación
- **Manejo de estado**: Estado centralizado con BehaviorSubject
- **Depende solo del dominio**

### 3. **Infrastructure Layer (Infraestructura)**
- **Repositorios**: Implementaciones concretas (HTTP, etc.)
- **Providers**: Configuración de inyección de dependencias
- **Aislada del resto de la aplicación**

### 4. **Interfaces Layer (Interfaces)**
- **Componentes**: Componentes de UI
- **Maneja la interacción con el usuario**
- **Depende directamente de la capa de aplicación**

## Flujo de Datos

```
UI Component → Application Service → Repository Interface → Repository Implementation → External API
```

## Beneficios de la Arquitectura Simplificada

1. **Simplicidad**: Estructura más simple y fácil de entender
2. **Consistencia**: Similar al backend, facilita el mantenimiento
3. **Separación clara**: Cada capa tiene responsabilidades específicas
4. **Testabilidad**: Fácil de testear cada capa por separado
5. **Mantenibilidad**: Cambios en una capa no afectan las otras
6. **Escalabilidad**: Fácil agregar nuevas funcionalidades

## Configuración

Los providers de infraestructura se configuran en `app.config.ts`:

```typescript
providers: [
  ...TASK_INFRASTRUCTURE_PROVIDERS,
  ...AUTH_INFRASTRUCTURE_PROVIDERS,
]
```

## Comparación con la Arquitectura Anterior

### Antes (Hexagonal por Feature):
- ✅ Separación por feature
- ❌ Mucha complejidad (15-20 archivos por feature)
- ❌ Duplicación de estructura
- ❌ Curva de aprendizaje alta

### Ahora (Hexagonal Monolítico):
- ✅ Estructura simple y clara
- ✅ Fácil de navegar y entender
- ✅ Consistente con el backend
- ✅ Menos archivos, más mantenible

## Uso

### En los Componentes
```typescript
// Inyectar el servicio de aplicación
constructor(private taskService = inject(TaskApplicationService)) {}

// Usar los métodos del servicio
this.taskService.loadTasks(userId);
this.taskService.createTask(request);
```

### En la Infraestructura
```typescript
// Los providers se configuran automáticamente
providers: [
  ...TASK_INFRASTRUCTURE_PROVIDERS,
  ...AUTH_INFRASTRUCTURE_PROVIDERS,
]
```

## Migración Completada

- ✅ Estructura hexagonal monolítica implementada
- ✅ Todas las entidades centralizadas en `domain/entities`
- ✅ Todos los repositorios centralizados en `domain/repositories`
- ✅ Todos los servicios centralizados en `application/services`
- ✅ Todas las implementaciones centralizadas en `infrastructure/`
- ✅ Todos los componentes centralizados en `interfaces/components`
- ✅ Imports y referencias actualizadas
- ✅ Aplicación compila sin errores
- ✅ Arquitectura simplificada y mantenible