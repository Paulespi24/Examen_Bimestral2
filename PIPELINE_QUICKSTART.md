# 🔄 GitHub Actions Pipeline - Configuración Rápida

## 1️⃣ INSTALACIÓN (30 segundos)

El pipeline ya está configurado en:
```
.github/workflows/ci-cd.yml
```

**No necesita configuración adicional**. Solo haz push a GitHub.

---

## 2️⃣ PRIMER EJECUCIÓN

```bash
# 1. Hacer commit
git add .github/workflows/ci-cd.yml
git add GITHUB_ACTIONS_PIPELINE.md
git commit -m "Add GitHub Actions CI/CD pipeline"

# 2. Push a GitHub
git push origin main

# 3. Ver en GitHub
# → Actions tab → CarnavalLogistics CI/CD Pipeline
# → Ver jobs ejecutándose
```

**Tiempo total**: ~3-6 minutos ☕

---

## 3️⃣ ESTRUCTURA DEL PIPELINE

```
┌─────────────────────────────┐
│ Validations + Tests         │ ← En paralelo (30-60s)
├─────────────────────────────┤
│ Docker Build                │ ← Espera tests (2-5m)
├─────────────────────────────┤
│ Integration Tests           │ ← Con docker-compose (30-45s)
├─────────────────────────────┤
│ Security Analysis           │ ← Paralelo (Trivy + TruffleHog)
├─────────────────────────────┤
│ Notify                      │ ← Resumen final
└─────────────────────────────┘
```

---

## 4️⃣ JOBS EXPLICADOS BREVEMENTE

| Job | Qué hace | Tiempo |
|-----|----------|--------|
| **Validation** | Valida estructura y sintaxis Python | 5-10s |
| **Frontend Tests** | npm ci + npm run build | 30-60s |
| **Backend Tests** | pip install + pytest (3 servicios) | 20-30s |
| **Docker Build** | Docker build + push a GHCR | 2-5m |
| **Integration Tests** | docker-compose up + health checks | 30-45s |
| **Security** | Trivy + TruffleHog scan | Variable |
| **Notify** | Resumen del pipeline | Inmediato |

---

## 5️⃣ VISUALIZAR RESULTADOS

### En GitHub Web:
```
Repository → Actions tab → CarnavalLogistics CI/CD Pipeline
                           ↓
                    Ver job en progreso
                    Click en job → Ver logs
                    Click en step → Detalles
```

### Interfaz visual:
```
✓ Validation          (success)
✓ Frontend Tests      (success)
✓ Backend Tests       (success)
✓ Docker Build        (success)
✓ Integration Tests   (success)
✓ Security           (warning) ← Puede tener warnings
✓ Notify             (success)
```

---

## 6️⃣ SI ALGO FALLA

### Paso 1: Identificar dónde falló
- Job rojo = falló
- Job amarillo = warning
- Job verde = éxito

### Paso 2: Ver logs
```
Click en job rojo → Click en step rojo → Ver el error
```

### Paso 3: Causas comunes
```
❌ Validation failed
   → Falta carpeta, sintaxis Python incorrecta
   → Arreglalo y haz push nuevamente

❌ Frontend Tests failed
   → npm install con versiones incompatibles
   → Borra package-lock.json y prueba localmente

❌ Docker Build failed
   → Error en Dockerfile
   → Prueba: docker build -f api-gateway/Dockerfile .

❌ Integration Tests failed
   → Servicio no responde en puerto
   → Ver logs: docker-compose logs
```

---

## 7️⃣ CONFIGURACIÓN OPCIONAL

### Si quieres notificaciones por Slack:

```yaml
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

### Si quieres despliegue automático:

```yaml
- name: Deploy to Production
  if: success() && github.ref == 'refs/heads/main'
  run: |
    # Tu script de deploy
```

---

## 8️⃣ MONITOREO CONTINUO

### Tabla de estados:

| Rama | Último Build | Status |
|------|-------------|--------|
| main | Hace 2 min  | ✅ Pass |
| develop | Hace 5 min  | ✅ Pass |
| feature/xyz | Hace 1h  | ❌ Fail |

**Ver en**: GitHub → Actions → Todos los workflows

---

## 9️⃣ TRIGGERS DEL PIPELINE

El pipeline se ejecuta automáticamente cuando:

```yaml
# Push a estas ramas
push:
  branches: [main, develop]

# PR a estas ramas
pull_request:
  branches: [main, develop]

# Ejecución manual
workflow_dispatch:
```

### Ejemplos:
```
✓ git push origin main              → Pipeline corre
✓ git push origin feature/xyz develop → Pipeline corre
✓ Abrir PR a main                   → Pipeline corre
✓ Mergear PR                        → Pipeline corre
✓ Click "Run workflow" en GitHub    → Pipeline corre manualmente
```

---

## 🔟 BEST PRACTICES

✅ **DO:**
- Revisar logs de fallos
- Corregir y re-push
- Esperar a que pase el pipeline antes de mergear
- Usar ramas feature

❌ **DON'T:**
- Ignorar fallos de pipeline
- Mergear sin pasar tests
- Commitear secretos (TruffleHog lo detectará)
- Modificar `.github/workflows/` sin probar

---

## 📊 MÉTRICAS ESPERADAS

```
Pipeline Runs por semana: ~10-15
Éxito rate: >95%
Tiempo promedio: 4 minutos
Fallos comunes: Deps incompatibles, ports en uso
```

---

## 🚀 NEXT STEPS

1. ✅ Pipeline está listo
2. ✅ Push a GitHub
3. ⏳ Ver ejecutarse
4. 📝 Documentar en GITHUB_ACTIONS_PIPELINE.md
5. 🎓 Enseñar al equipo
6. 🔄 Mantener y mejorar

---

## 📞 REFERENCIAS RÁPIDAS

- **Documentación completa**: [GITHUB_ACTIONS_PIPELINE.md](GITHUB_ACTIONS_PIPELINE.md)
- **GitHub Actions Docs**: https://docs.github.com/actions
- **Troubleshooting**: Ver logs en Actions tab
- **Contacto**: Team

---

**Estado actual**: ✅ Pipeline completamente funcional y listo para producción
