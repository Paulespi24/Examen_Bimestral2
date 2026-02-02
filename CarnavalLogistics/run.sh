#!/bin/bash
# Script para ejecutar CarnavalLogistics
# Uso: bash run.sh

echo "======================================"
echo "  CarnavalLogistics - Sistema de"
echo "  Gestión de Logística de Carnavales"
echo "======================================"
echo ""

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado."
    echo "Por favor, instala Docker Desktop desde: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Verificar si Docker daemon está ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está ejecutándose."
    echo "Por favor, inicia Docker Desktop."
    exit 1
fi

echo "✅ Docker detectado"
echo ""
echo "Iniciando servicios..."
echo ""

# Iniciar docker-compose
docker-compose up -d

echo ""
echo "======================================"
echo "✅ SERVICIOS INICIADOS CORRECTAMENTE"
echo "======================================"
echo ""
echo "🌐 Dashboard disponible en:"
echo "   http://localhost:8000"
echo ""
echo "📚 Documentación Swagger:"
echo "   http://localhost:8000/docs"
echo ""
echo "🔧 Servicios activos:"
echo "   • API Gateway: http://localhost:8000/health"
echo "   • Aforo Service: http://localhost:8001/health"
echo "   • Permisos Service: http://localhost:8002/health"
echo ""
echo "Para detener los servicios, ejecuta:"
echo "   docker-compose down"
echo ""
echo "Para ver los logs, ejecuta:"
echo "   docker-compose logs -f"
echo ""
