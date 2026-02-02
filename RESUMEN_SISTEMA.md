# 📊 CarnavalLogistics - Resumen del Sistema

## 1. VISIÓN GENERAL

**CarnavalLogistics** es una plataforma de logística para festividades (carnavales) que gestiona:
- **Aforo**: Capacidad y ocupación de recintos/espacios
- **Permisos**: Gestión de comerciantes y autorización de puestos

**Tipo de Arquitectura**: Microservicios independientes + API Gateway + Frontend React moderno

---

## 2. COMPONENTES PRINCIPALES

### 2.1 Frontend (Cliente)
- **Tecnología**: React 18.2 + Tailwind CSS 3.3 + Vite 4.4
- **Ubicación**: `/frontend/`
- **Compilación**: Vite genera `/frontend/dist/` con:
  - `index.html` - Punto de entrada (React SPA)
  - `assets/index-*.js` - JavaScript compilado (React + librerías)
  - `assets/index-*.css` - Estilos compilados con Tailwind
- **Componentes React**:
  - `App.jsx` - Componente raíz con navegación (2 tabs)
  - `AforoView` - Gestión de recintos y ocupación
  - `PermisosView` - Gestión de comerciantes y permisos
- **Funcionalidades**:
  - Interfaz moderna con gradientes y glassmorphism
  - Sistema de notificaciones
  - Formularios reactivos
  - Llamadas HTTP a las APIs

---

### 2.2 API Gateway
- **Tecnología**: FastAPI (Python 3.11)
- **Ubicación**: `/api-gateway/`
- **Puerto**: 8000
- **Responsabilidades**:
  1. **Servir Frontend**: Monta y sirve los archivos compilados de React
     - Ruta raíz `/` → `index.html` (SPA)
     - Ruta `/assets/*` → CSS y JS compilados
     - Ruta `/{path:path}` → Fallback a `index.html` (SPA routing)
  
  2. **Proxy de APIs**: Redirige peticiones a microservicios
     - `/aforo/*` → Aforo Service (puerto 8001)
     - `/permisos/*` → Permisos Service (puerto 8002)
  
  3. **CORS**: Permite cualquier origen (configurado para desarrollo)

- **Rutas principales**:
  ```
  GET  /health                                    → {status: ok}
  GET  /aforo/recintos                           → Lista recintos
  POST /aforo/recintos                           → Crea recinto
  GET  /aforo/recintos/{id}                      → Obtiene recinto
  POST /aforo/recintos/{id}/movimientos          → Registra entrada/salida
  GET  /aforo/recintos/{id}/ocupacion            → Ocupación actual
  
  GET  /permisos/comerciantes                    → Lista comerciantes
  POST /permisos/comerciantes                    → Registra comerciante
  GET  /permisos/puestos                         → Lista puestos
  POST /permisos/puestos                         → Crea puesto
  GET  /permisos/permisos                        → Lista permisos
  POST /permisos/permisos                        → Solicita permiso
  GET  /permisos/permisos/{id}                   → Obtiene permiso
  PATCH /permisos/permisos/{id}                  → Actualiza permiso
  ```

---

### 2.3 Aforo Service (Microservicio 1)
- **Tecnología**: FastAPI (Python 3.11)
- **Ubicación**: `/aforo-service/`
- **Puerto**: 8001
- **Base de datos**: SQLite (`aforo.db`)

**Modelos de datos**:
```
Recinto:
  - id: int (PK)
  - nombre: str
  - capacidad_maxima: int
  - ubicacion: str
  - ocupacion_actual: int (calculado)

Movimiento:
  - id: int (PK)
  - recinto_id: int (FK)
  - tipo: enum(entrada, salida)
  - cantidad: int
  - timestamp: datetime
```

**Funcionalidades**:
- Crear recintos con capacidad máxima
- Registrar entrada/salida de personas
- Calcular ocupación en tiempo real
- Validar que no supere capacidad
- Consultar estado de ocupación

---

### 2.4 Permisos Service (Microservicio 2)
- **Tecnología**: FastAPI (Python 3.11)
- **Ubicación**: `/permisos-service/`
- **Puerto**: 8002
- **Base de datos**: SQLite (`permisos.db`)

**Modelos de datos**:
```
Comerciante:
  - id: int (PK)
  - nombre: str
  - cedula: str (único)
  - email: str
  - telefono: str
  - fecha_registro: datetime

Puesto:
  - id: int (PK)
  - nombre: str
  - descripcion: str
  - ubicacion: str
  - disponible: bool

Permiso:
  - id: int (PK)
  - comerciante_id: int (FK)
  - puesto_id: int (FK)
  - estado: enum(pendiente, aprobado, rechazado)
  - fecha_inicio: datetime
  - fecha_fin: datetime
  - fecha_solicitud: datetime
```

**Funcionalidades**:
- Registrar comerciantes (con validación de cédula única)
- Crear puestos disponibles
- Solicitar permisos (vincula comerciante + puesto + fechas)
- Aprobar/rechazar permisos
- Consultar permisos activos

---

## 3. FLUJOS DE DATOS

### 3.1 Flujo de Usuario: Crear Recinto

```
1. Usuario abre navegador → http://localhost:8000
2. Browser solicita: GET /
3. API Gateway sirve: index.html (React SPA)
4. React carga: JS + CSS desde /assets/
5. Usuario llena formulario "Crear Recinto" en pestaña "Aforo"
6. React envía: POST /aforo/recintos {nombre, capacidad_maxima, ubicacion}
7. API Gateway proxea a: Aforo Service (8001)
8. Aforo Service:
   - Valida datos
   - Inserta en SQLite (aforo.db)
   - Retorna: {id, nombre, capacidad_maxima, ubicacion}
9. React recibe respuesta
10. Frontend muestra notificación: "✓ Recinto creado"
11. Actualiza lista de recintos
```

### 3.2 Flujo de Usuario: Registrar Comerciante

```
1. Usuario navega a pestaña "Permisos Comerciales"
2. Llena formulario "Registrar Comerciante"
3. React envía: POST /permisos/comerciantes {nombre, cedula, email, telefono}
4. API Gateway proxea a: Permisos Service (8002)
5. Permisos Service:
   - Valida que cédula sea única
   - Inserta en SQLite (permisos.db)
   - Retorna: {id, nombre, cedula, email, telefono}
6. Frontend muestra notificación: "✓ Comerciante registrado"
7. Actualiza lista de comerciantes
```

### 3.3 Flujo de Sistema: Consulta de Ocupación

```
1. Frontend carga lista de recintos: GET /aforo/recintos
2. API Gateway proxea a Aforo Service
3. Aforo Service:
   - Obtiene todos los recintos
   - Para cada uno:
     - Sum(entradas) - Sum(salidas) = ocupacion_actual
   - Retorna lista con ocupación
4. Frontend muestra cada recinto con:
   - Nombre
   - Ocupación actual / Capacidad máxima
   - Porcentaje de ocupación
   - Indicador visual (barra de progreso)
```

---

## 4. FLUJO DE PETICIÓN HTTP

```
┌─────────────────────────────────────────────────────────────┐
│ CLIENTE (Browser - React)                                   │
│  - Renderiza UI                                             │
│  - Maneja formularios                                       │
│  - Hace llamadas HTTP (fetch/axios)                         │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP Request
                 │ (GET/POST/PATCH)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ API GATEWAY (FastAPI - Puerto 8000)                         │
│  - Recibe petición                                          │
│  - Si es /aforo/* → proxea a Aforo Service (8001)          │
│  - Si es /permisos/* → proxea a Permisos Service (8002)   │
│  - Si es / o /assets/* → sirve archivos estáticos         │
│  - Si es otra ruta → fallback a index.html (SPA)          │
└──┬──────────────────────────────────┬──────────────────────┘
   │                                  │
   ▼ (si es /aforo/*)                ▼ (si es /permisos/*)
┌─────────────────────┐        ┌────────────────────────┐
│ AFORO SERVICE       │        │ PERMISOS SERVICE       │
│ (FastAPI - 8001)    │        │ (FastAPI - 8002)       │
│                     │        │                        │
│ - Procesa request   │        │ - Procesa request      │
│ - Valida datos      │        │ - Valida datos         │
│ - Lee/escribe DB    │        │ - Lee/escribe DB       │
│ - Retorna JSON      │        │ - Retorna JSON         │
│                     │        │                        │
│ 📊 aforo.db (SQLite)│        │ 📄 permisos.db (SQLite)│
└─────────────────────┘        └────────────────────────┘
   │                                  │
   └──────────────────┬───────────────┘
                      │ Response (JSON)
                      ▼
        ┌─────────────────────────────────┐
        │ API GATEWAY (ForwardsResponse)   │
        └─────────────────────────────────┘
                      │ Response (JSON)
                      ▼
        ┌─────────────────────────────────┐
        │ CLIENTE (React procesa JSON)     │
        │ - Actualiza estado (useState)    │
        │ - Re-renderiza componentes       │
        │ - Muestra notificación           │
        └─────────────────────────────────┘
```

---

## 5. ESTRUCTURA DE CARPETAS

```
CarnavalLogistics/
├── frontend/                      # 🎨 Frontend React
│   ├── src/
│   │   ├── App.jsx                # Componente raíz
│   │   ├── main.jsx               # Entry point
│   │   ├── index.css              # Estilos globales + Tailwind
│   │   └── components/
│   │       ├── AforoView.jsx
│   │       └── PermisosView.jsx
│   ├── package.json               # Dependencias React
│   ├── vite.config.js             # Configuración del build
│   ├── tailwind.config.js         # Configuración de Tailwind
│   ├── postcss.config.js          # PostCSS config
│   └── dist/                      # Build compilado (generado por Vite)
│       ├── index.html
│       └── assets/
│           ├── index-*.js
│           └── index-*.css
│
├── api-gateway/                   # 🌐 API Gateway
│   ├── main.py                    # Aplicación principal FastAPI
│   ├── config.py                  # Configuración (URLs de servicios)
│   ├── requirements.txt           # Dependencias Python
│   ├── Dockerfile                 # Multi-stage: build React + run Python
│   └── aforo.db                   # BD local (desarrollo)
│
├── aforo-service/                 # 📊 Microservicio Aforo
│   ├── main.py                    # Aplicación FastAPI
│   ├── models.py                  # Modelos SQLAlchemy
│   ├── requirements.txt           # Dependencias
│   ├── Dockerfile
│   └── aforo.db                   # Base de datos SQLite
│
├── permisos-service/              # 📋 Microservicio Permisos
│   ├── main.py                    # Aplicación FastAPI
│   ├── models.py                  # Modelos SQLAlchemy
│   ├── requirements.txt           # Dependencias
│   ├── Dockerfile
│   └── permisos.db                # Base de datos SQLite
│
├── docker-compose.yml             # Orquestación de contenedores
├── README.md                      # Documentación general
└── RESUMEN_SISTEMA.md             # Este archivo
```

---

## 6. STACK TECNOLÓGICO

### Frontend
- **React 18.2.0** - Framework UI declarativo
- **Tailwind CSS 3.3.0** - Estilos utility-first
- **Vite 4.4.0** - Build tool (reemplaza Webpack)
- **Lucide React 0.263.1** - Iconos SVG
- **PostCSS 8.4.28** - Procesador de CSS

### Backend - API Gateway
- **FastAPI** - Framework web rápido
- **Python 3.11** - Runtime
- **httpx** - Cliente HTTP async
- **Uvicorn** - Servidor ASGI
- **CORS Middleware** - Para requests cross-origin

### Backend - Microservicios
- **FastAPI** - Framework web
- **SQLAlchemy** - ORM para base de datos
- **SQLite** - Base de datos local (sin configuración)
- **Pydantic** - Validación de datos
- **Uvicorn** - Servidor ASGI

### Deployment
- **Docker** - Containerización
- **Docker Compose** - Orquestación
- **Multi-stage Build** - Optimización de imágenes

---

## 7. PUERTOS Y SERVICIOS

```
┌─────────────────────┬──────────┬─────────────────────┐
│ Servicio            │ Puerto   │ Acceso              │
├─────────────────────┼──────────┼─────────────────────┤
│ API Gateway         │ 8000     │ http://localhost:8000 │
│ Aforo Service       │ 8001     │ Interno (network)     │
│ Permisos Service    │ 8002     │ Interno (network)     │
└─────────────────────┴──────────┴─────────────────────┘
```

---

## 8. COMUNICACIÓN ENTRE SERVICIOS

```
                    ┌─────────────────┐
                    │   React App     │
                    │   (Browser)     │
                    └────────┬────────┘
                             │ HTTP/REST
                    ┌────────▼────────┐
                    │  API Gateway    │
                    │  (8000)         │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                        │
                ▼                        ▼
        ┌──────────────┐        ┌──────────────┐
        │   Aforo      │        │  Permisos    │
        │  Service     │        │  Service     │
        │  (8001)      │        │  (8002)      │
        └──────┬───────┘        └──────┬───────┘
               │                       │
        ┌──────▼──────┐        ┌──────▼──────┐
        │ aforo.db    │        │ permisos.db │
        │ (SQLite)    │        │ (SQLite)    │
        └─────────────┘        └─────────────┘
```

**Comunicación**:
- React ↔ API Gateway: HTTP/REST (JSON)
- API Gateway ↔ Microservicios: HTTP/REST (JSON)
- Microservicios ↔ BD: SQLAlchemy ORM

---

## 9. FUNCIONALIDADES PRINCIPALES

### Módulo Aforo 📊
1. **Crear Recinto**
   - Nombre, capacidad máxima, ubicación
   - Validación de datos
   - Almacenamiento en BD

2. **Registrar Movimiento**
   - Entrada o salida de personas
   - Validación de no superar capacidad
   - Registro con timestamp

3. **Consultar Ocupación**
   - Estado actual de cada recinto
   - Porcentaje de ocupación
   - Histórico de movimientos

### Módulo Permisos 📋
1. **Registrar Comerciante**
   - Nombre, cédula (única), email, teléfono
   - Validaciones de datos
   - Fecha de registro automática

2. **Crear Puesto**
   - Nombre, descripción, ubicación
   - Estado disponibilidad

3. **Solicitar Permiso**
   - Vincula comerciante + puesto + fechas
   - Estados: pendiente, aprobado, rechazado

4. **Gestionar Permisos**
   - Aprobar/rechazar permisos
   - Consultar permisos activos

---

## 10. VENTAJAS DE LA ARQUITECTURA

✅ **Escalabilidad**: Cada servicio puede escalarse independientemente
✅ **Mantenibilidad**: Código separado por responsabilidad
✅ **Resiliencia**: Si cae un servicio, los otros siguen funcionando
✅ **Independencia**: Frontend puede cambiar sin afectar backend
✅ **Flexibilidad**: Fácil agregar nuevos microservicios
✅ **Testing**: Cada componente puede testearse por separado
✅ **Deploy**: Contenedores Docker independientes

---

## 11. PARA EL DIAGRAMA DE COMPONENTES

### Recomendación de vista:

```
NIVEL 1: Contenedores principales
├── Cliente (React Browser)
├── API Gateway (FastAPI)
├── Aforo Service (FastAPI)
├── Permisos Service (FastAPI)
└── Bases de Datos (SQLite)

NIVEL 2: Componentes internos (si lo deseas detallar)
├── Frontend
│   ├── App (Container)
│   ├── AforoView (Component)
│   ├── PermisosView (Component)
│   └── NotificationSystem (Component)
├── API Gateway
│   ├── StaticFilesHandler
│   ├── AforoProxy
│   ├── PermisosProxy
│   └── CORSMiddleware
└── Microservicios
    ├── RouteHandlers
    ├── Models (DB)
    ├── Validators
    └── Business Logic

NIVEL 3: Flujos principales
├── CrearRecinto (POST)
├── RegistrarMovimiento (POST)
├── ConsultarOcupacion (GET)
├── RegistrarComerciante (POST)
├── SolicitarPermiso (POST)
└── GestionarPermisos (PATCH)
```

---

## Información para crear el prompt del diagrama:

```
Crea un diagrama de componentes que muestre:

1. CAPA PRESENTACIÓN (Frontend)
   - React Application (Vite + Tailwind)
   - Componentes: App, AforoView, PermisosView
   - Conexión HTTP con API Gateway

2. CAPA API (Gateway)
   - FastAPI Gateway en puerto 8000
   - Responsabilidades: 
     * Servir archivos estáticos React
     * Proxy a microservicios
   - Rutas: /aforo/*, /permisos/*, /assets/*, /

3. CAPA SERVICIOS (Microservicios)
   - Aforo Service (puerto 8001)
   - Permisos Service (puerto 8002)
   - Cada uno con su lógica de negocio

4. CAPA DATOS
   - BD Aforo (SQLite)
   - BD Permisos (SQLite)

5. FLUJOS PRINCIPALES
   - Crear recinto
   - Registrar movimiento
   - Registrar comerciante
   - Solicitar permiso

Usa colores:
- Verde para Frontend
- Azul para API Gateway
- Naranja para Microservicios
- Rojo para Bases de Datos
```

---

Este resumen tiene toda la información que necesitas para generar el diagrama. ¿Necesitas que profundice en alguna parte específica?
