# AtomChat Frontend

Una aplicación de chat moderna construida con Angular 17, que incluye gestión de tareas y autenticación de usuarios.

## 🚀 Características

- **Autenticación de usuarios** con Firebase
- **Gestión de tareas** completa (CRUD)
- **Interfaz moderna** con PrimeNG
- **Arquitectura limpia** siguiendo principios SOLID
- **Testing completo** con Jest
- **Responsive design** para todos los dispositivos

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (viene con Node.js)
- **Git** para clonar el repositorio

### Verificar instalaciones

```bash
node --version
npm --version
git --version
```

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd atomchat-fe
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

`src/environments/environment.ts`:

## 🚀 Ejecución

### Modo desarrollo

```bash
npm start
```

La aplicación se abrirá en `http://localhost:4200` y se recargará automáticamente cuando hagas cambios.

### Modo producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

### Servidor de desarrollo con watch

```bash
npm run watch
```

Similar a `npm start` pero con compilación continua.

## 🧪 Testing

### Ejecutar todos los tests

```bash
npm test
```

### Ejecutar tests en modo watch

```bash
npm run test:watch
```

### Ejecutar tests con cobertura

```bash
npm run test:coverage
```

### Ejecutar un test específico

```bash
npm test -- --testPathPattern="nombre-del-archivo.spec.ts"
```

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── application/          # Lógica de aplicación
│   │   └── services/        # Servicios de aplicación
│   ├── core/                # Funcionalidades centrales
│   │   ├── guards/          # Guards de rutas
│   │   ├── interceptors/    # Interceptores HTTP
│   │   ├── models/          # Modelos de datos
│   │   └── services/        # Servicios centrales
│   ├── domain/              # Lógica de dominio
│   │   ├── entities/        # Entidades de negocio
│   │   └── repositories/    # Interfaces de repositorios
│   ├── infrastructure/      # Implementaciones de infraestructura
│   │   ├── providers/       # Proveedores de servicios
│   │   └── repositories/    # Implementaciones de repositorios
│   ├── interfaces/          # Capa de presentación
│   │   └── components/      # Componentes de la UI
│   └── shared/              # Código compartido
│       ├── ui/              # Componentes UI reutilizables
│       └── utils/           # Utilidades
├── assets/                  # Recursos estáticos
└── environments/            # Configuraciones de entorno
```

## 🔧 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm run watch` | Construye en modo watch |
| `npm test` | Ejecuta todos los tests |
| `npm run test:watch` | Ejecuta tests en modo watch |
| `npm run test:coverage` | Ejecuta tests con reporte de cobertura |
| `npm run lint` | Ejecuta el linter |
| `npm run format` | Formatea el código |
| `npm run format:check` | Verifica el formato del código |

## 🌐 Navegación

### Rutas principales

- `/` - Página de inicio (redirige a login si no está autenticado)
- `/login` - Página de inicio de sesión
- `/tasks` - Lista de tareas (requiere autenticación)

### Flujo de la aplicación

1. **Login**: El usuario inicia sesión con email y contraseña
2. **Dashboard**: Después del login, se redirige a la página de tareas
3. **Gestión de tareas**: Crear, editar, eliminar y marcar tareas como completadas

## 🔐 Autenticación

La aplicación usa Firebase Authentication con los siguientes métodos:

- **Email/Password**: Autenticación tradicional
- **Gestión de sesión**: Tokens JWT automáticos
- **Protección de rutas**: Guards que verifican autenticación

## 📱 Responsive Design

La aplicación está optimizada para:

- **Desktop**: Pantallas grandes (1200px+)
- **Tablet**: Pantallas medianas (768px - 1199px)
- **Mobile**: Pantallas pequeñas (< 768px)

## 🎨 UI Components

Utilizamos **PrimeNG** para los componentes de interfaz:

- **Formularios**: InputText, Button, Card
- **Navegación**: Toolbar, Menu
- **Feedback**: Toast, Message, Dialog
- **Datos**: Table, DataView

## 📚 Recursos adicionales

- [Angular Documentation](https://angular.io/docs)
- [PrimeNG Components](https://primeng.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Jest Testing Framework](https://jestjs.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 👥 Autores

- **Henry Romero** - *Desarrollo inicial* 
