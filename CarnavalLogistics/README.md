# 🎉 CarnavalLogistics - Plataforma de Gestión de Logística de Carnavales

Una solución completa de microservicios para gestionar la logística de recintos y permisos comerciales durante festividades.

## 📋 Descripción del Proyecto

**CarnavalLogistics** es una plataforma escalable basada en microservicios que maneja dos dominios principales:

### 1. **Gestión de Aforo (Recintos)**
- Crear y gestionar plazas/recintos con capacidad máxima
- Registrar entradas y salidas de personas
- Monitorear ocupación en tiempo real
- Sistema de alertas por niveles de capacidad

### 2. **Gestión de Permisos Comerciales**
- Registro de comerciantes
- Gestión de puestos disponibles
- Sistema de permisos comerciales
- Validación y seguimiento de vigencia

---

## 🏗️ Arquitectura de la Solución

```
┌─────────────────────────────────────────────────────────────┐
│                    DASHBOARD (Frontend)                      │
│              HTML5 + CSS3 + Vanilla JavaScript               │
│                   http://localhost:8000                      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   API GATEWAY (Port 8000)                    │
│                    FastAPI - BFF Pattern                     │
└────────────────┬──────────────────────┬──────────────────────┘
                 │                      │
        ┌────────▼────────┐    ┌────────▼─────────┐
        │  AFORO SERVICE  │    │ PERMISOS SERVICE │
        │ (Port 8001)     │    │   (Port 8002)    │
        │ - Recintos      │    │ - Comerciantes   │
        │ - Movimientos   │    │ - Puestos        │
        │ - Ocupación     │    │ - Permisos       │
        └────────┬────────┘    └────────┬─────────┘
                 │                      │
        ┌────────▼────────┐    ┌────────▼─────────┐
        │ SQLite: aforo   │    │ SQLite: permisos │
        │     .db         │    │     .db          │
        └─────────────────┘    └──────────────────┘
```

### Características de la Arquitectura:

✅ **Independencia de Servicios**: Cada servicio tiene su propia base de datos (SQLite)
✅ **Comunicación HTTP**: Los servicios se comunican vía REST a través del API Gateway
✅ **Escalabilidad**: Fácil agregar nuevos servicios sin afectar existentes
✅ **Aislamiento en Docker**: Cada servicio corre en su propio contenedor

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker Desktop instalado y ejecutándose
- Docker Compose
- Sistema operativo: Windows/Mac/Linux

### Instalación y Ejecución

1. **Posicionarse en la carpeta del proyecto**
   ```bash
   cd c:\Users\Usuario iTC\Desktop\Examen_Bimestral\CarnavalLogistics
   ```

2. **Iniciar todos los servicios**
   ```bash
   docker-compose up -d
   ```

3. **Acceder al dashboard**
   - Abre tu navegador en: [http://localhost:8000](http://localhost:8000)
   - ¡Listo! El dashboard interactivo está disponible

### Detener los servicios
```bash
docker-compose down
```

---

## 📊 Paneles del Dashboard

### Panel de Aforo
- **Crear Recinto**: Define nuevas plazas/recintos con capacidad máxima
- **Registrar Movimiento**: Registra entradas y salidas de personas
- **Ver Ocupación**: Visualiza el estado actual de cada recinto
  - 🟢 NORMAL: Ocupación < 85%
  - 🟡 CERCA DEL LÍMITE: Ocupación 85-99%
  - 🔴 AFORO COMPLETO: Ocupación ≥ 100%

### Panel de Permisos
- **Registrar Comerciante**: Agrega nuevos comerciantes con cédula y contacto
- **Crear Puesto**: Define ubicaciones disponibles para comerciantes
- **Solicitar Permiso**: Enlaza comerciantes con puestos
- **Ver Permisos**: Visualiza el estado de todos los permisos
  - 📋 SOLICITADO: Esperando aprobación
  - ✅ APROBADO: Permiso activo
  - ❌ RECHAZADO: Permiso rechazado
  - ⏰ VENCIDO: Permiso expirado

---

## 🔌 Endpoints de API

### Base URL: `http://localhost:8000`

#### Aforo Service
```
POST   /aforo/recintos                           # Crear recinto
GET    /aforo/recintos/{id}                      # Obtener recinto
POST   /aforo/recintos/{id}/movimientos         # Registrar movimiento
GET    /aforo/recintos/{id}/ocupacion           # Ver ocupación
```

#### Permisos Service
```
POST   /permisos/comerciantes                   # Registrar comerciante
GET    /permisos/comerciantes                   # Listar comerciantes
POST   /permisos/puestos                        # Crear puesto
GET    /permisos/puestos                        # Listar puestos
POST   /permisos/permisos                       # Solicitar permiso
GET    /permisos/permisos                       # Listar permisos
PATCH  /permisos/permisos/{id}                  # Actualizar estado de permiso
```

#### Gateway
```
GET    /health                                   # Health check del gateway
GET    /docs                                     # Documentación Swagger
```

---

## 📁 Estructura del Proyecto

```
CarnavalLogistics/
├── api-gateway/                    # API Gateway (BFF Pattern)
│   ├── main.py                    # Aplicación principal
│   ├── config.py                  # Variables de configuración
│   ├── requirements.txt           # Dependencias Python
│   └── Dockerfile                 # Configuración Docker
│
├── aforo-service/                 # Servicio de Gestión de Aforo
│   ├── main.py                    # Rutas y lógica de negocio
│   ├── database.py                # Configuración de SQLAlchemy
│   ├── models.py                  # Modelos ORM (Recinto, Movimiento)
│   ├── schemas.py                 # Esquemas Pydantic para validación
│   ├── requirements.txt           # Dependencias
│   ├── Dockerfile                 # Configuración Docker
│   └── aforo.db                   # Base de datos SQLite
│
├── permisos-service/              # Servicio de Gestión de Permisos
│   ├── main.py                    # Rutas y lógica de negocio
│   ├── database.py                # Configuración de SQLAlchemy
│   ├── models.py                  # Modelos ORM (Comerciante, Puesto, Permiso)
│   ├── schemas.py                 # Esquemas Pydantic para validación
│   ├── requirements.txt           # Dependencias
│   ├── Dockerfile                 # Configuración Docker
│   └── permisos.db                # Base de datos SQLite
│
├── frontend/                      # Dashboard Frontend
│   ├── index.html                 # Página principal
│   ├── styles.css                 # Estilos CSS
│   └── app.js                     # Lógica JavaScript
│
├── docker-compose.yml             # Orquestación de contenedores
└── README.md                      # Este archivo
```

---

## 💻 Stack Tecnológico

### Backend
- **Framework Web**: FastAPI 0.104.1
- **Servidor de Aplicaciones**: Uvicorn 0.24.0
- **ORM**: SQLAlchemy 2.0.23
- **Base de Datos**: SQLite
- **Validación**: Pydantic 2.12.5
- **Python**: 3.11

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Diseño moderno con gradientes y animaciones
- **JavaScript**: Vanilla JS sin dependencias
- **Comunicación**: Fetch API

### DevOps
- **Containerización**: Docker
- **Orquestación**: Docker Compose
- **Comunicación Inter-Servicios**: HTTP REST

---

## 🎨 Características del Dashboard

✨ **Diseño Moderno**
- Interfaz gradiente (púrpura y rosa)
- Animaciones suaves
- Diseño responsive

🔄 **Actualización en Tiempo Real**
- Recarga dinámica de datos
- Notificaciones de acciones
- Indicadores de estado

📱 **Adaptable**
- Compatible con móviles
- Diseño flexible
- Navegación intuitiva

🎯 **Intuitivo**
- Dos pestañas principales (Aforo y Permisos)
- Formularios claros
- Visualización de datos efectiva

---

## 🔍 Monitoreo de Servicios

### Ver estado de contenedores
```bash
docker ps
```

### Ver logs de un servicio específico
```bash
docker logs carnavallogistics-api-gateway-1
docker logs carnavallogistics-aforo-service-1
docker logs carnavallogistics-permisos-service-1
```

### Acceder a bash de un contenedor
```bash
docker exec -it carnavallogistics-api-gateway-1 bash
```

---

## 📚 Ejemplos de Uso

### Crear un Recinto
```javascript
// Desde el dashboard, completa el formulario:
// Nombre: "Plaza Mayor"
// Capacidad Máxima: 5000
// Ubicación: "Centro"
// Haz clic en "Crear Recinto"
```

### Registrar un Movimiento
```javascript
// Selecciona el recinto
// Tipo: "entrada" o "salida"
// Cantidad: 150
// Haz clic en "Registrar Movimiento"
```

### Solicitar un Permiso
```javascript
// 1. Registra un comerciante con cédula y contacto
// 2. Crea un puesto
// 3. Solicita permiso vinculando comerciante y puesto
// El permiso iniciará en estado "SOLICITADO"
```

---

## 🐛 Troubleshooting

### Los servicios no inician
```bash
# Asegúrate que Docker Desktop esté ejecutándose
# Elimina volúmenes antiguos
docker-compose down -v
# Reinicia
docker-compose up -d
```

### No puedo ver el dashboard
```bash
# Verifica que el puerto 8000 esté disponible
netstat -ano | findstr :8000

# O revisa los logs del gateway
docker logs carnavallogistics-api-gateway-1
```

### Las formas no funcionan
```bash
# Verifica que la consola del navegador no tenga errores (F12)
# Comprueba que los servicios backend estén ejecutándose
docker ps

# Verifica los logs de los servicios
docker logs carnavallogistics-aforo-service-1
```

---

## 📝 Notas Técnicas

- **Independencia de Bases de Datos**: Cada servicio usa su propia instancia SQLite
- **Sin Acoplamiento**: Los servicios NO comparten código o librerías comunes
- **Escalabilidad Horizontal**: Fácil replicar servicios aumentando instancias en docker-compose
- **API Gateway Pattern**: Centraliza el enrutamiento y CORS

---

## 👤 Autor
Proyecto de Examen Bimestral - Sistema de Gestión de Logística de Carnavales

---

## 📞 Soporte
Para reportar problemas o sugerencias, consulta los logs de Docker:
```bash
docker-compose logs -f
```

---

## ✅ Status de la Plataforma

```
✓ API Gateway                    OPERATIVO (Puerto 8000)
✓ Aforo Service                  OPERATIVO (Puerto 8001)
✓ Permisos Service               OPERATIVO (Puerto 8002)
✓ Frontend Dashboard             OPERATIVO
✓ Documentación Swagger          DISPONIBLE en /docs
```

---

**¡Bienvenido a CarnavalLogistics! 🎉**
