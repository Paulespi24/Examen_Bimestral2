# 🎉 INSTRUCCIONES DE USO - CarnavalLogistics

## ✅ Estado del Proyecto

Tu sistema CarnavalLogistics está **COMPLETAMENTE FUNCIONAL** y listo para usar.

---

## 🚀 CÓMO INICIAR EL SISTEMA

### Opción 1: Windows (PowerShell)
```powershell
cd c:\Users\Usuario iTC\Desktop\Examen_Bimestral\CarnavalLogistics
.\run.ps1
```

### Opción 2: Windows (CMD)
```cmd
cd c:\Users\Usuario iTC\Desktop\Examen_Bimestral\CarnavalLogistics
docker-compose up -d
```

### Opción 3: Mac/Linux
```bash
cd ~/Desktop/Examen_Bimestral/CarnavalLogistics
./run.sh
```

---

## 🌐 ACCEDER AL DASHBOARD

Una vez iniciados los servicios, abre tu navegador en:

### **http://localhost:8000**

El dashboard estará completamente funcional e interactivo.

---

## 📊 LO QUE VERÁS EN EL DASHBOARD

### Pestaña "Aforo" 
**Gestión de Capacidad de Recintos**

1. **Crear Recinto**
   - Nombre: Nombre del recinto/plaza
   - Capacidad Máxima: Límite de personas
   - Ubicación: Zona del recinto
   - Resultado: Se creará el recinto en la BD

2. **Registrar Movimiento**
   - Recinto: Selecciona de la lista
   - Tipo: "entrada" o "salida"
   - Cantidad: Número de personas
   - Resultado: Se registrará y verás ocupación actualizada

3. **Visualización de Ocupación**
   - Ver tarjetas de cada recinto
   - Barra de ocupación con color
   - Estados:
     - 🟢 NORMAL (< 85%)
     - 🟡 CERCA DEL LÍMITE (85-99%)
     - 🔴 AFORO COMPLETO (≥ 100%)

### Pestaña "Permisos"
**Gestión de Comerciantes y Permisos**

1. **Registrar Comerciante**
   - Nombre: Nombre completo
   - Cédula: Número de identificación
   - Email: Correo electrónico
   - Teléfono: Número de contacto
   - Resultado: Se registrará el comerciante

2. **Crear Puesto**
   - Nombre: Nombre del puesto
   - Descripción: Qué venderá
   - Ubicación: Dónde se ubicará
   - Resultado: Se creará el espacio

3. **Solicitar Permiso**
   - Comerciante ID: ID del comerciante registrado
   - Puesto ID: ID del puesto disponible
   - Fecha Inicio: Cuándo comienza
   - Fecha Fin: Cuándo termina
   - Resultado: Se solicitará el permiso

4. **Ver Permisos**
   - Tabla con todos los permisos
   - Estados: SOLICITADO, APROBADO, RECHAZADO, VENCIDO
   - Información completa de cada uno

---

## 🔧 SERVICIOS EN EJECUCIÓN

Los siguientes servicios estarán corriendo:

| Servicio | Puerto | URL | Función |
|----------|--------|-----|---------|
| API Gateway | 8000 | http://localhost:8000 | Enrutador principal |
| Aforo Service | 8001 | http://localhost:8001 | Gestión de recintos |
| Permisos Service | 8002 | http://localhost:8002 | Gestión de permisos |

---

## 📚 DOCUMENTACIÓN ADICIONAL

### API Swagger
```
http://localhost:8000/docs
```
Aquí verás todos los endpoints disponibles, con ejemplos y esquemas.

### Endpoints Principales

**Aforo:**
```
POST /aforo/recintos
POST /aforo/recintos/{id}/movimientos
GET /aforo/recintos/{id}/ocupacion
```

**Permisos:**
```
POST /permisos/comerciantes
POST /permisos/puestos
POST /permisos/permisos
GET /permisos/permisos
```

---

## ⛔ DETENER LOS SERVICIOS

### Opción 1: Terminal/CMD
```bash
docker-compose down
```

### Opción 2: Desde PowerShell
```powershell
docker-compose down
```

Esto detendrá todos los contenedores pero **preservará tus datos**.

---

## 🐛 SI ALGO NO FUNCIONA

### Verificar Estado
```bash
docker ps
```
Deberías ver 3 contenedores corriendo.

### Ver Logs
```bash
docker-compose logs -f
```

### Reiniciar Completamente
```bash
# Detener
docker-compose down

# Limpiar volúmenes (CUIDADO: borra datos)
docker-compose down -v

# Iniciar nuevamente
docker-compose up -d
```

### Puertos en Uso
Si los puertos 8000, 8001, 8002 están en uso:
```bash
# Windows
netstat -ano | findstr :8000

# Mac/Linux
lsof -i :8000
```

---

## 💾 ARCHIVOS IMPORTANTES

Tu proyecto está en:
```
c:\Users\Usuario iTC\Desktop\Examen_Bimestral\CarnavalLogistics\
```

Estructura:
```
CarnavalLogistics/
├── api-gateway/          ← Servidor web principal
├── aforo-service/        ← Servicio de aforo
├── permisos-service/     ← Servicio de permisos
├── frontend/             ← Dashboard (HTML/CSS/JS)
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── docker-compose.yml    ← Configuración Docker
├── README.md             ← Documentación detallada
├── COMPLETADO.md         ← Resumen del proyecto
└── run.ps1               ← Script para iniciar
```

---

## 📖 EJEMPLOS DE USO

### Caso de Uso 1: Crear un Recinto y Registrar Movimientos

1. Abre http://localhost:8000
2. Ve a la pestaña "Aforo"
3. Rellena "Crear Recinto":
   - Nombre: "Plaza Mayor"
   - Capacidad: 5000
   - Ubicación: "Centro"
4. Haz clic en "Crear Recinto"
5. ¡Verás notificación de éxito!
6. Registra movimientos:
   - Selecciona el recinto
   - Tipo: "entrada"
   - Cantidad: 1500
   - Haz clic en "Registrar"
7. ¡Verás la ocupación actualizada!

### Caso de Uso 2: Crear Permiso Comercial

1. Ve a la pestaña "Permisos"
2. Registra un comerciante:
   - Nombre: "Juan García"
   - Cédula: "123456789"
   - Email: "juan@email.com"
   - Teléfono: "555-1234"
3. Crea un puesto:
   - Nombre: "Puesto #5"
   - Descripción: "Venta de artesanías"
   - Ubicación: "Esquina norte"
4. Solicita permiso:
   - Comerciante ID: 1
   - Puesto ID: 1
   - Fechas: Hoy a mañana
5. ¡Permiso solicitado! Verás en la tabla

---

## 🔒 SEGURIDAD Y DATOS

- **Persistencia**: Los datos se guardan en SQLite
- **Independencia**: Cada servicio tiene su propia BD
- **Volúmenes Docker**: Los datos persisten entre reinicios
- **CORS**: Habilitado para desarrollo

---

## 💡 TIPS Y TRUCOS

### Ver datos en tiempo real
```bash
docker exec -it carnavallogistics-aforo-service-1 sqlite3 aforo.db "SELECT * FROM recintos;"
```

### Limpiar base de datos específica
```bash
docker-compose down -v
docker-compose up -d
```

### Acceder a un contenedor
```bash
docker exec -it carnavallogistics-api-gateway-1 bash
```

---

## 📞 SOPORTE

Todos los componentes están funcionando correctamente. Si tienes problemas:

1. **Verifica Docker**: `docker ps`
2. **Revisa logs**: `docker-compose logs -f`
3. **Reinicia servicios**: `docker-compose restart`
4. **Limpia todo**: `docker-compose down -v && docker-compose up -d`

---

## ✅ CHECKLIST FINAL

Antes de usar el sistema:
- [ ] Docker Desktop está instalado
- [ ] Docker Desktop está ejecutándose
- [ ] Has ejecutado `docker-compose up -d`
- [ ] Dashboard está en http://localhost:8000
- [ ] Los 3 servicios están corriendo (`docker ps`)

---

## 🎓 ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────┐
│   NAVEGADOR (Tu computadora)    │
│   http://localhost:8000         │
└──────────────┬──────────────────┘
               │
        ┌──────▼──────┐
        │   GATEWAY   │
        │  (Puerto    │
        │   8000)     │
        └──┬──────┬───┘
           │      │
      ┌────▼─┐    └──────┬────────┐
      │AFORO │           │PERMISOS│
      │(8001)│        (8002)     │
      └────┬─┘           └────┬───┘
           │                  │
       ┌───▼──┐          ┌───▼──┐
       │aforo │          │perm  │
       │  db  │          │  db  │
       └──────┘          └──────┘
```

---

## 🚀 ¡LISTO PARA USAR!

Tu sistema está completamente configurado y funcionando.

**Simplemente ejecuta:**
```bash
docker-compose up -d
```

**Y accede a:**
```
http://localhost:8000
```

¡Que disfrutes CarnavalLogistics! 🎉

---

*Sistema completado exitosamente. Todos los servicios operativos.*
