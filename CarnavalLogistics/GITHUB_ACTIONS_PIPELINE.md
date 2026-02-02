# 🔄 GitHub Actions CI/CD Pipeline - CarnavalLogistics

## 📋 Descripción General

Este documento explica el **pipeline de automatización completo** diseñado para **CarnavalLogistics** usando **GitHub Actions**. El pipeline automatiza:

- ✅ Validación de código
- ✅ Pruebas unitarias e integración
- ✅ Construcción de imágenes Docker
- ✅ Análisis de seguridad
- ✅ Despliegue automático

---

## 🎯 Objetivo del Pipeline

Garantizar que cada cambio de código en el repositorio:

1. **Mantiene calidad**: Pasa validaciones y pruebas
2. **Es seguro**: Análisis de vulnerabilidades
3. **Funciona correctamente**: Pruebas de integración
4. **Está listo para producción**: Build Docker exitoso

---

## 🚀 Cuándo se Ejecuta el Pipeline

El pipeline se dispara automáticamente en estos eventos:

```yaml
on:
  push:
    branches: [main, develop]      # Cada push a main o develop
  pull_request:
    branches: [main, develop]      # Cada PR a main o develop
  workflow_dispatch:               # Ejecución manual desde GitHub
```

**Ejemplo**: 
- Developer hace `git push` → Pipeline se ejecuta automáticamente
- Se abre un PR → Pipeline valida los cambios antes de merge
- Click en "Run workflow" → Ejecución manual desde GitHub UI

---

## 📊 Estructura del Pipeline

El pipeline tiene **6 jobs principales** que se ejecutan en paralelo o en secuencia:

```
┌─────────────────────────────────────────────────────────────┐
│ GitHub Actions Workflow: CarnavalLogistics CI/CD Pipeline   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ 1. VALIDATION (Validaciones)                                │
│    ├─ Estructura del proyecto                               │
│    ├─ Sintaxis Python (3 servicios)                         │
│    └─ Archivos JSON                                         │
│                                                               │
│ 2. FRONTEND-TESTS (en paralelo con 1)                       │
│    ├─ Setup Node.js 18                                      │
│    ├─ npm ci (instalar dependencias)                        │
│    ├─ ESLint (linting)                                      │
│    └─ npm run build (Vite)                                  │
│                                                               │
│ 3. BACKEND-TESTS (en paralelo con 1)                        │
│    ├─ Setup Python 3.11                                     │
│    ├─ pip install requirements                              │
│    └─ pytest / unittest                                     │
│                                                               │
│ 4. DOCKER-BUILD (depende de 1, 2, 3)                        │
│    ├─ Setup Docker Buildx                                   │
│    ├─ Build images (sin push)                               │
│    └─ Push si es main branch                                │
│                                                               │
│ 5. INTEGRATION-TESTS (depende de 4)                         │
│    ├─ docker-compose up                                     │
│    ├─ Health checks                                         │
│    ├─ API tests                                             │
│    └─ docker-compose down                                   │
│                                                               │
│ 6. SECURITY (análisis independiente)                        │
│    ├─ Trivy (vulnerabilidades)                              │
│    └─ TruffleHog (secretos expuestos)                       │
│                                                               │
│ 7. NOTIFY (al final, si hay éxito o fallo)                  │
│    └─ Resumen del pipeline                                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Detalles de Cada Job

### 1️⃣ **VALIDATION** (5-10 segundos)
**Responsabilidad**: Validaciones básicas de estructura y sintaxis

```yaml
validation:
  runs-on: ubuntu-latest
```

**Pasos**:
1. ✅ **Checkout código** → Descarga el repositorio
2. ✅ **Validar estructura** → Verifica que existan:
   - `/frontend`
   - `/api-gateway`
   - `/aforo-service`
   - `/permisos-service`
   - `docker-compose.yml`

3. ✅ **Validar sintaxis Python**:
   - `api-gateway/main.py`
   - `aforo-service/main.py`
   - `permisos-service/main.py`

**Falla si**: Falta alguna carpeta o hay errores de sintaxis Python

---

### 2️⃣ **FRONTEND-TESTS** (30-60 segundos)
**Responsabilidad**: Construir y probar el frontend React

```yaml
frontend-tests:
  runs-on: ubuntu-latest
```

**Pasos**:
1. ✅ **Setup Node.js 18** → Instala Node.js
2. ✅ **npm ci** → Instala dependencias de forma reproducible
3. ✅ **ESLint** (opcional) → Valida estilos de código
4. ✅ **npm run build** → Ejecuta `vite build`:
   - Compila JSX a JavaScript
   - Genera CSS de Tailwind
   - Minifica todo
   - Genera `/frontend/dist/`

5. ✅ **Verificar output**:
   - ¿Existe `/frontend/dist/index.html`?
   - ¿Existe `/frontend/dist/assets/`?

**Falla si**: 
- `npm install` falla (dependencias incompatibles)
- `vite build` falla (error en componentes React)
- No se genera `/dist/`

**Output**: 
```
frontend/dist/
├── index.html (0.5 kB)
├── assets/
│   ├── index-408be053.css (12.8 kB)
│   └── index-f7803f6d.js (152.4 kB)
```

---

### 3️⃣ **BACKEND-TESTS** (20-30 segundos x 3 servicios)
**Responsabilidad**: Probar código Python de microservicios

```yaml
backend-tests:
  strategy:
    matrix:
      service: ['api-gateway', 'aforo-service', 'permisos-service']
```

Se ejecuta **3 veces en paralelo** (una por cada servicio):

**Pasos** (para cada servicio):
1. ✅ **Setup Python 3.11** → Instala Python
2. ✅ **pip install requirements** → Instala dependencias FastAPI, SQLAlchemy, etc.
3. ✅ **pytest / unittest** → Ejecuta pruebas unitarias (si existen)

**Falla si**: 
- `requirements.txt` tiene versiones incompatibles
- Hay errores en imports
- Las pruebas fallan

**Nota**: En este momento puedes agregar pruebas reales con pytest

---

### 4️⃣ **DOCKER-BUILD** (2-5 minutos)
**Responsabilidad**: Construir imágenes Docker

```yaml
docker-build:
  needs: [validation, frontend-tests, backend-tests]
```

**Depende de**: validation, frontend-tests, backend-tests (debe pasar primero)

**Pasos**:
1. ✅ **Setup Docker Buildx** → Motor de build optimizado
2. ✅ **Login a GitHub Container Registry**:
   - Usa `${{ secrets.GITHUB_TOKEN }}`
   - No requiere configuración manual

3. ✅ **Build API Gateway**:
   ```dockerfile
   # Stage 1: Build React
   FROM node:18-alpine as frontend-build
   RUN npm run build
   
   # Stage 2: Run Python
   FROM python:3.11-slim
   COPY --from=frontend-build /frontend/dist /app/frontend_dist
   ```

4. ✅ **Verificar que build fue exitoso**

5. ✅ **Push images (solo en main)**:
   - Si es `main` branch → Push a GitHub Container Registry
   - Si es `develop` → Solo build local

**Ubicación de imágenes** (tras push a main):
```
ghcr.io/tuusername/carnavallogistics/api-gateway:sha256
ghcr.io/tuusername/carnavallogistics/aforo-service:sha256
ghcr.io/tuusername/carnavallogistics/permisos-service:sha256
```

---

### 5️⃣ **INTEGRATION-TESTS** (30-45 segundos)
**Responsabilidad**: Probar que todos los servicios funcionen juntos

```yaml
integration-tests:
  needs: [docker-build]
```

**Depende de**: docker-build exitoso

**Pasos**:
1. ✅ **docker-compose up -d** → Levanta todos los servicios:
   - API Gateway (8000)
   - Aforo Service (8001)
   - Permisos Service (8002)

2. ✅ **Sleep 10 segundos** → Espera a que inicien

3. ✅ **Health Check API Gateway**:
   ```bash
   curl http://localhost:8000/health
   ```

4. ✅ **Health Check Aforo Service**:
   ```bash
   curl http://localhost:8001/docs
   ```

5. ✅ **Health Check Permisos Service**:
   ```bash
   curl http://localhost:8002/docs
   ```

6. ✅ **Test: Crear Recinto**:
   ```bash
   curl -X POST http://localhost:8000/aforo/recintos \
     -d '{"nombre":"Test","capacidad_maxima":1000,"ubicacion":"Calle Principal"}'
   ```

7. ✅ **Test: Listar Comerciantes**:
   ```bash
   curl http://localhost:8000/permisos/comerciantes
   ```

8. ✅ **Ver logs si hay error**:
   ```bash
   docker-compose logs api-gateway
   docker-compose logs aforo-service
   docker-compose logs permisos-service
   ```

9. ✅ **Limpiar** (siempre, incluso si falla):
   ```bash
   docker-compose down
   ```

**Falla si**: Algún servicio no responde o retorna error

---

### 6️⃣ **SECURITY** (Análisis independiente)
**Responsabilidad**: Detectar vulnerabilidades y secretos

```yaml
security:
  runs-on: ubuntu-latest
```

**No depende de nada**, se ejecuta en paralelo

**Pasos**:
1. ✅ **Trivy** (Aqua Security):
   - Escanea vulnerabilidades conocidas
   - Revisa dependencias Python, Node.js, etc.
   - Genera reporte SARIF

2. ✅ **TruffleHog**:
   - Busca claves API, contraseñas, tokens
   - Revisa commit history
   - Detecta secretos expuestos

3. ✅ **Upload SARIF** → GitHub Security tab muestra resultados

**No falla el pipeline** pero muestra warnings en GitHub

---

### 7️⃣ **NOTIFY** (Final del pipeline)
**Responsabilidad**: Resumen y notificaciones

```yaml
notify:
  needs: [validation, frontend-tests, backend-tests, docker-build, integration-tests, security]
  if: always()
```

**Se ejecuta siempre**, incluso si otros jobs fallan

**Muestra**:
```
======================================
  CI/CD Pipeline Completado
======================================
Validación: ✓
Frontend Tests: ✓
Backend Tests: ✓
Docker Build: ✓
Integration Tests: ✓
Security: ✓
======================================
Status: success / failure
Branch: refs/heads/main
Commit: abc123def456
```

---

## 🌳 Orden de Ejecución

```
Start
  │
  ├─→ VALIDATION (5-10s)
  │       ↓
  ├─→ FRONTEND-TESTS (30-60s)    [En paralelo]
  │
  ├─→ BACKEND-TESTS (20-30s)     [En paralelo]
  │
  ├─→ SECURITY (análisis)        [En paralelo]
  │
  └─→ DOCKER-BUILD (2-5m)        [Espera VALIDATION + FRONTEND + BACKEND]
       └─→ INTEGRATION-TESTS (30-45s)
            └─→ NOTIFY (Resumen final)
           
Total esperado: ~3-6 minutos
```

---

## 📊 Variables de Entorno

```yaml
env:
  REGISTRY: ghcr.io                    # GitHub Container Registry
  DOCKER_BUILDKIT: 1                   # Habilita BuildKit
```

---

## 🔐 Secretos Utilizados

**Automáticamente disponibles**:
- `${{ secrets.GITHUB_TOKEN }}` → Token para push a GHCR (ya incluido)

**Opcional** (si quieres push a Docker Hub):
```yaml
- name: Login to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_HUB_USERNAME }}
    password: ${{ secrets.DOCKER_HUB_PASSWORD }}
```

---

## ✅ Acciones (Actions) Utilizadas

| Acción | Versión | Propósito |
|--------|---------|----------|
| `actions/checkout` | v4 | Descarga código |
| `actions/setup-node` | v4 | Setup Node.js 18 |
| `actions/setup-python` | v4 | Setup Python 3.11 |
| `docker/setup-buildx-action` | v3 | Docker Build mejorado |
| `docker/login-action` | v3 | Login a registros |
| `docker/build-push-action` | v5 | Build y push Docker |
| `aquasecurity/trivy-action` | master | Scan vulnerabilidades |
| `trufflesecurity/trufflehog` | main | Detectar secretos |
| `github/codeql-action` | v2 | Upload resultados SARIF |

---

## 🎯 Casos de Uso

### Caso 1: Developer hace push a develop

```
1. Validación ✓
2. Frontend Tests ✓ → Genera dist/
3. Backend Tests ✓
4. Docker Build ✓ → Build local (sin push)
5. Integration Tests ✓
6. Security ✓
7. Resultado: ÉXITO ✓
   → PR puede mergear a main
```

### Caso 2: Se abre PR a main

Mismo flujo anterior. Si pasa, se muestra ✓ verde en GitHub.
Si falla, muestra ✗ rojo y no permite merge.

### Caso 3: Developer mergea a main

```
1-6. (Mismo que Case 1)
4. Docker Build ✓ → Push a GHCR
   → Imágenes disponibles para producción
7. Resultado: ÉXITO ✓
   → Código está en producción
```

### Caso 4: Falla validación

```
1. VALIDATION ✗
   → "❌ Falta carpeta /frontend"
2. FRONTEND-TESTS ✗ (skipped)
3. BACKEND-TESTS ✗ (skipped)
4. DOCKER-BUILD ✗ (skipped)
5. Resultado: FAILURE ✗
   → GitHub marca PR como "failed checks"
   → No permite merge a main
   → Developer debe arreglar y hacer push nuevamente
```

---

## 📈 Beneficios

✅ **Automatización**: No hay paso manual
✅ **Confiabilidad**: Cada cambio se valida
✅ **Velocidad**: Tests en paralelo (~3-6 min total)
✅ **Seguridad**: Análisis de vulnerabilidades automático
✅ **Trazabilidad**: Cada push tiene su pipeline asociado
✅ **Documentación**: Los logs son el historial de cambios

---

## 🚀 Instalación

1. **Crear archivo workflow**:
   ```
   .github/workflows/ci-cd.yml
   ```

2. **Hacer push a GitHub**:
   ```bash
   git add .github/workflows/ci-cd.yml
   git commit -m "Add CI/CD pipeline"
   git push origin main
   ```

3. **Ver en GitHub**:
   - Ir a: `Actions` tab
   - Ver el workflow ejecutándose
   - Esperar a que termine
   - Verificar resultados

---

## 📌 Próximas Mejoras

- [ ] Agregar pruebas unitarias reales con pytest
- [ ] Agregar cobertura de código (coverage)
- [ ] Integración con Slack/Teams para notificaciones
- [ ] Despliegue automático a servidor de staging
- [ ] Database migrations en la pipeline
- [ ] Performance testing
- [ ] Load testing

---

## 🔗 Referencias

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Action](https://github.com/docker/build-push-action)
- [Trivy Vulnerability Scanner](https://github.com/aquasecurity/trivy-action)
- [TruffleHog Secrets Detection](https://github.com/trufflesecurity/trufflehog)

---

## ❓ Preguntas Frecuentes

**P: ¿Por qué falla el build?**
R: Revisa los logs en GitHub Actions. Generalmente es por:
- Sintaxis Python incorrecta
- Dependencias Node.js incompatibles
- Servicios no respondiendo

**P: ¿Puedo ejecutar el pipeline manualmente?**
R: Sí, en GitHub → Actions → CarnavalLogistics CI/CD → "Run workflow"

**P: ¿Qué pasa si un test falla?**
R: El pipeline se detiene, no permite merge a main

**P: ¿Dónde veo los logs?**
R: GitHub → Actions → Tu workflow → Click en job → Ver logs

**P: ¿Puedo cambiar a qué branches se ejecuta?**
R: Sí, edita `on:` en `.github/workflows/ci-cd.yml`

---

Este pipeline está **listo para producción** y puede ser ajustado según tus necesidades específicas. 🚀
