# Script para ejecutar CarnavalLogistics en Windows
# Uso: .\run.ps1

Write-Host "======================================"
Write-Host "  CarnavalLogistics - Sistema de"
Write-Host "  Gestión de Logística de Carnavales"
Write-Host "======================================"
Write-Host ""

# Verificar si Docker está instalado
Write-Host "Verificando Docker..."
$dockerCheck = docker --version 2>$null
if ($null -eq $dockerCheck) {
    Write-Host "❌ Docker no está instalado."
    Write-Host "Por favor, instala Docker Desktop desde: https://www.docker.com/products/docker-desktop"
    exit 1
}

Write-Host "✅ Docker detectado: $dockerCheck"
Write-Host ""

# Verificar si Docker daemon está ejecutándose
$dockerInfo = docker info 2>$null
if ($null -eq $dockerInfo) {
    Write-Host "❌ Docker no está ejecutándose."
    Write-Host "Por favor, inicia Docker Desktop."
    exit 1
}

Write-Host "✅ Docker daemon está ejecutándose"
Write-Host ""
Write-Host "Iniciando servicios..."
Write-Host ""

# Iniciar docker-compose
docker-compose up -d

Write-Host ""
Write-Host "======================================"
Write-Host "✅ SERVICIOS INICIADOS CORRECTAMENTE"
Write-Host "======================================"
Write-Host ""
Write-Host "🌐 Dashboard disponible en:"
Write-Host "   http://localhost:8000"
Write-Host ""
Write-Host "📚 Documentación Swagger:"
Write-Host "   http://localhost:8000/docs"
Write-Host ""
Write-Host "🔧 Servicios activos:"
Write-Host "   • API Gateway: http://localhost:8000/health"
Write-Host "   • Aforo Service: http://localhost:8001/health"
Write-Host "   • Permisos Service: http://localhost:8002/health"
Write-Host ""
Write-Host "Para detener los servicios, ejecuta:"
Write-Host "   docker-compose down"
Write-Host ""
Write-Host "Para ver los logs, ejecuta:"
Write-Host "   docker-compose logs -f"
Write-Host ""

# Abrir dashboard en navegador
Start-Sleep -Seconds 2
Write-Host "Abriendo dashboard en navegador..."
Start-Process "http://localhost:8000"
