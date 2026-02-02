# ⚡ GitHub Actions - Referencia Rápida

## 🚀 SETUP INICIAL (3 pasos)

```bash
# 1. Archivo ya existe en:
.github/workflows/ci-cd.yml

# 2. Hacer push a GitHub
git add .github/workflows/ci-cd.yml
git commit -m "Add GitHub Actions pipeline"
git push origin main

# 3. Ver en GitHub
# Actions tab → CarnavalLogistics CI/CD Pipeline
```

---

## 🎯 COMANDOS ÚTILES

### Ver todos los workflows
```bash
gh workflow list
```

### Ver último run del workflow
```bash
gh run list --workflow=ci-cd.yml
```

### Ver logs de un run específico
```bash
gh run view <run-id> --log
```

### Cancelar un run en progreso
```bash
gh run cancel <run-id>
```

### Ejecutar workflow manualmente
```bash
gh workflow run ci-cd.yml --ref main
```

### Ver status del último push
```bash
git log --oneline -n 1
gh run list --workflow=ci-cd.yml -L 1
```

---

## 📊 ESTADOS DEL WORKFLOW

| Estado | Significa | Acción |
|--------|-----------|--------|
| 🟢 Success | ✓ Todo pasó | Puede mergear |
| 🔴 Failure | ✗ Algo falló | Revisar logs |
| 🟡 In Progress | ⏳ Ejecutándose | Esperar |
| 🟠 Cancelled | ⊘ Cancelado manualmente | Reintentar |
| ⚪ Queued | ⏲️ En espera | Esperar a su turno |

---

## 🔍 DEBUGGING

### Si el pipeline falla:

1. **Go to GitHub Actions tab**
   ```
   Repository → Actions → CarnavalLogistics CI/CD Pipeline
   ```

2. **Find the failed run**
   ```
   Click on run → Scroll down to see status
   ```

3. **View the failed job**
   ```
   Click on red job name
   ```

4. **View the failed step**
   ```
   Click on red step → See error message
   ```

5. **Common errors**:
   ```
   ❌ "npm ERR!"
      → npm install failed, dependency issue
      → Fix package.json or package-lock.json
      
   ❌ "ModuleNotFoundError"
      → Python import error
      → Check requirements.txt
      
   ❌ "docker build failed"
      → Dockerfile error
      → Test locally: docker build -f api-gateway/Dockerfile .
      
   ❌ "Connection refused"
      → Service not starting
      → Check logs: docker logs <container>
   ```

---

## 💾 ARCHIVO WORKFLOW LOCATION

```
CarnavalLogistics/
├── .github/
│   └── workflows/
│       └── ci-cd.yml  ← Este archivo
├── frontend/
├── api-gateway/
├── aforo-service/
└── permisos-service/
```

---

## 🔐 VARIABLES DE ENTORNO

```yaml
env:
  REGISTRY: ghcr.io
  DOCKER_BUILDKIT: 1
```

Accesibles en pasos como:
```bash
echo ${{ env.REGISTRY }}
```

---

## 🔑 SECRETOS (Si usas)

Agregar secreto en GitHub:
```
Settings → Secrets and variables → Actions → New repository secret
Name: DOCKER_HUB_USERNAME
Value: tu_username
```

Usar en workflow:
```yaml
username: ${{ secrets.DOCKER_HUB_USERNAME }}
```

---

## 📋 JOBS REFERENCE

### Validation Job
```yaml
validation:
  runs-on: ubuntu-latest
  steps:
    - Checkout
    - Validate structure
    - Compile Python files
```

### Frontend Tests Job
```yaml
frontend-tests:
  runs-on: ubuntu-latest
  steps:
    - Checkout
    - Setup Node.js 18
    - npm ci
    - ESLint
    - npm run build
    - Verify output
```

### Backend Tests Job (3x en paralelo)
```yaml
backend-tests:
  strategy:
    matrix:
      service: ['api-gateway', 'aforo-service', 'permisos-service']
  steps:
    - Checkout
    - Setup Python 3.11
    - pip install
    - pytest
```

### Docker Build Job
```yaml
docker-build:
  needs: [validation, frontend-tests, backend-tests]
  steps:
    - Setup Buildx
    - Login GHCR
    - Build Docker images
    - Push if main branch
```

### Integration Tests Job
```yaml
integration-tests:
  needs: [docker-build]
  steps:
    - docker-compose up -d
    - Health checks
    - API tests
    - Cleanup
```

### Security Job
```yaml
security:
  steps:
    - Trivy scan
    - TruffleHog scan
    - Upload SARIF
```

### Notify Job
```yaml
notify:
  needs: [all jobs]
  if: always()
  steps:
    - Print summary
    - Status check
```

---

## ⏰ TIMING REFERENCE

```
Validation:        0-10s    (estructura + sintaxis)
Frontend Tests:    30-60s   (npm ci + build)
Backend Tests:     20-30s   (3x en paralelo)
Docker Build:      2-5m     (más largo)
Integration:       30-45s   (docker-compose)
Security:          30-60s   (parallel)
Notify:            5-10s    (final)

Total paralelo:    ~3-6 minutos
```

---

## 🎬 QUICK START

```bash
# 1. Estar en rama main o develop
git checkout main

# 2. Hacer un cambio (ej, actualizar README)
echo "# Changes" >> README.md

# 3. Commit
git add .
git commit -m "Test pipeline"

# 4. Push
git push origin main

# 5. Ver en GitHub
# GitHub → Actions → CarnavalLogistics CI/CD Pipeline
# Ver logs en tiempo real

# 6. Si todo passa
# ✓ PR marker verde
# ✓ Puede mergear
```

---

## 🔄 ACTUALIZACIONES

Para actualizar el workflow:
```bash
# 1. Editar .github/workflows/ci-cd.yml
vim .github/workflows/ci-cd.yml

# 2. Commit cambios
git add .github/workflows/ci-cd.yml
git commit -m "Update CI/CD pipeline"

# 3. Push
git push origin main

# 4. Nueva versión del workflow se usa inmediatamente
```

---

## 📞 RECURSOS

- **Documentación completa**: [GITHUB_ACTIONS_PIPELINE.md](GITHUB_ACTIONS_PIPELINE.md)
- **Diagramas visuales**: [PIPELINE_DIAGRAMS.md](PIPELINE_DIAGRAMS.md)
- **Quick Start**: [PIPELINE_QUICKSTART.md](PIPELINE_QUICKSTART.md)
- **Logs & Debugging**: GitHub Actions UI

---

## ✅ CHECKLIST PRE-PUSH

Antes de hacer `git push`:

- [ ] Código compila localmente
- [ ] Tests pasan localmente
- [ ] No hay archivos no commiteados
- [ ] Mensaje de commit es descriptivo
- [ ] Branch es main o develop

---

## 🚨 TROUBLESHOOTING RÁPIDO

```
¿Pipeline no se ejecuta?
→ Verificar archivo: .github/workflows/ci-cd.yml
→ Verificar rama: main o develop
→ Verificar GitHub: Actions tab habilitado

¿Docker build falla?
→ Prueba local: docker build -f api-gateway/Dockerfile .
→ Revisa Dockerfile
→ Revisa dependencias

¿Tests fallan?
→ Ver logs en GitHub Actions
→ Reproducir localmente
→ Hacer commit con fix
→ Push de nuevo

¿Imágenes no se pushean?
→ Verificar que sea rama main
→ Verificar GHCR login
→ Ver logs de Docker Build job
```

---

**Pipeline Status**: ✅ Completamente funcional y listo para usar
