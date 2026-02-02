# 🚀 Instalación y Uso del Nuevo Frontend React

## ⚡ Inicio Rápido

### Opción 1: Docker (Recomendado - Producción)

```bash
cd c:\Users\Usuario iTC\Desktop\Examen_Bimestral\CarnavalLogistics

# Reconstruir con el nuevo frontend
docker-compose down
docker-compose up --build
```

Luego abre: **http://localhost:8000**

**Ventajas:**
- Todo compilado automáticamente
- Reproducible en cualquier máquina
- Listo para producción

---

### Opción 2: Node.js Local (Desarrollo)

**Prerrequisitos:**
- Node.js 16+ instalado
- npm o yarn

**Pasos:**

1. **Instalar dependencias del frontend:**
```bash
cd frontend
npm install
```

2. **Iniciar dev server:**
```bash
npm run dev
```

3. **Abre en tu navegador:**
```
http://localhost:3000
```

**Ventajas:**
- Hot Module Replacement (HMR) - cambios en vivo
- Más rápido para desarrollar
- Mejor debugging

---

## 📊 Comparación de Métodos

| Característica | Docker | Node.js Local |
|---|---|---|
| **Velocidad Setup** | 2-3 min (primera vez) | 1-2 min |
| **Hot Reload** | No | Sí |
| **Listo para Prod** | Sí | No |
| **Requisitos** | Docker Desktop | Node.js |
| **Consistencia** | Garantizada | Local |

---

## 🛠️ Desarrollo con Node.js

### Estructura de Archivos Importante

```
frontend/
├── main.jsx              ← Punto de entrada React
├── App.jsx               ← Componente principal
├── index.css             ← Estilos Tailwind + globales
├── package.json          ← Dependencias
├── vite.config.js        ← Configuración Vite
├── tailwind.config.js    ← Configuración Tailwind
├── index-new.html        ← HTML para React
└── dist/                 ← Build compilado (después de `npm run build`)
```

### Comandos Útiles

```bash
# Instalar dependencias
npm install

# Iniciar dev server (http://localhost:3000)
npm run dev

# Compilar para producción
npm run build

# Vista previa del build compilado
npm run preview
```

### Estructura de Componentes

```jsx
// App.jsx
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br">
      <AforoView />
      <PermisosView />
    </div>
  );
}
```

---

## 📦 Compilación para Producción

### Desde Node.js

```bash
cd frontend
npm run build
```

Genera:
- `/frontend/dist/index.html` - Página compilada
- `/frontend/dist/assets/` - JS y CSS minificados

### Desde Docker

El `Dockerfile` del API Gateway ya lo hace automáticamente:

```dockerfile
FROM node:18-alpine as frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build
# ... (resultado en /app/frontend_dist)
```

---

## 🎨 Personalización de Estilos

### Tailwind CSS

```jsx
// Utilidades integradas
<div className="bg-gradient-to-br from-purple-900/50 to-black/50">
  <h1 className="text-2xl font-bold text-purple-300">
    Mi Título
  </h1>
</div>
```

### Clases Personalizadas (en index.css)

```css
@layer components {
  .card-glass {
    @apply bg-gradient-to-br from-purple-900/50 to-black/50 
           border border-purple-500/30 rounded-xl backdrop-blur-sm;
  }
  
  .input-field {
    @apply w-full px-4 py-2 bg-black/50 border border-purple-500/30 
           rounded-lg text-white focus:border-purple-500 transition;
  }
}
```

### Extensión de Tailwind (en tailwind.config.js)

```js
theme: {
  extend: {
    colors: {
      purple: { /* colores personalizados */ }
    }
  }
}
```

---

## 🔗 Integración con APIs

### Ejemplo: Llamar a un Endpoint

```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${API_URL}/endpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ /* datos */ })
    });
    
    if (response.ok) {
      const result = await response.json();
      setData(result);
      showNotification('✓ Éxito', 'success');
    } else {
      showNotification('❌ Error', 'error');
    }
  } catch (error) {
    showNotification('Error de conexión', 'error');
  } finally {
    setLoading(false);
  }
};
```

---

## 🔄 Flujo de Desarrollo Recomendado

1. **Cambiar código en editor:**
   ```
   App.jsx → Cambio automático en navegador (HMR)
   ```

2. **Probar localmente:**
   ```bash
   npm run dev
   ```

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

4. **Verificar con Docker:**
   ```bash
   docker-compose up --build
   ```

5. **Deploy:**
   - Push a git
   - Docker se encarga del build

---

## 📱 Responsive Design

El diseño es completamente responsive gracias a Tailwind:

```jsx
// Se adapta automáticamente
<div className="grid lg:grid-cols-3 gap-8">
  {/* Mobile: 1 columna */}
  {/* Tablet: 2 columnas (md:) */}
  {/* Desktop: 3 columnas (lg:) */}
</div>
```

---

## 🐛 Troubleshooting

### "npm: no se reconoce"
→ Node.js no está instalado. Descarga desde nodejs.org

### "Module not found"
```bash
rm node_modules package-lock.json
npm install
```

### "Port 3000 already in use"
```bash
# Usa otro puerto
npm run dev -- --port 3001
```

### "Tailwind styles no se aplican"
```bash
# Asegúrate de que index.css está importado en main.jsx
import './index.css'
```

### Docker build falla
```bash
# Rebuild desde cero
docker-compose down -v
docker-compose up --build
```

---

## 📊 Diferencias en el Funcionamiento

### Antes (Vanilla JS)
- Los archivos HTML/CSS/JS estaban directamente en `/frontend`
- Sin paso de compilación
- Cambios requieren recargar página

### Ahora (React + Tailwind)
- Los archivos fuente en `/frontend`
- Build genera `/frontend/dist`
- HMR en desarrollo (cambios automáticos)
- Assets optimizados en producción

---

## ✅ Verificación

Para verificar que todo funciona:

1. **Abre el dashboard:**
   ```
   http://localhost:8000
   ```

2. **Verifica que ves:**
   - ✅ Header con logo y título
   - ✅ Tabs de navegación (Aforo / Permisos)
   - ✅ Formularios funcionales
   - ✅ Notificaciones emergentes

3. **Prueba los formularios:**
   - Llena el formulario de Aforo
   - Debe mostrar notificación de éxito

---

## 📚 Documentación Adicional

- `FRONTEND_REACT.md` - Guía técnica completa
- `README.md` - Documentación general
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)

---

## 🎯 Próximos Pasos

1. ✅ Instala dependencias: `npm install`
2. ✅ Prueba en dev: `npm run dev`
3. ✅ Compila: `npm run build`
4. ✅ Prueba en Docker: `docker-compose up --build`
5. ✅ Abre dashboard: http://localhost:8000

---

**¡Tu nuevo frontend React está listo para usar!** 🚀
