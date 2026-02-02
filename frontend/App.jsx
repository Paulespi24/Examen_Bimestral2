import React, { useState, useEffect } from 'react';
import { BarChart3, Plus, LogIn, LogOut, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:8000';

function App() {
  const [currentView, setCurrentView] = useState('aforo');
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                CarnavalLogistics
              </h1>
            </div>
            <div className="text-sm text-gray-400">
              Sistema de Gestión de Logística de Carnavales
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-black/30 backdrop-blur-md border-b border-purple-500/20 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentView('aforo')}
              className={`px-6 py-3 font-medium transition-all ${
                currentView === 'aforo'
                  ? 'text-purple-300 border-b-2 border-purple-500 bg-purple-500/10'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              📊 Gestión de Aforo
            </button>
            <button
              onClick={() => setCurrentView('permisos')}
              className={`px-6 py-3 font-medium transition-all ${
                currentView === 'permisos'
                  ? 'text-purple-300 border-b-2 border-purple-500 bg-purple-500/10'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              📋 Gestión de Permisos
            </button>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-24 right-4 px-6 py-3 rounded-lg backdrop-blur-md transition-all z-50 ${
          notification.type === 'success'
            ? 'bg-green-500/20 border border-green-500/50 text-green-300'
            : 'bg-red-500/20 border border-red-500/50 text-red-300'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'aforo' ? (
          <AforoView showNotification={showNotification} />
        ) : (
          <PermisosView showNotification={showNotification} />
        )}
      </main>
    </div>
  );
}

function AforoView({ showNotification }) {
  const [recintos, setRecintos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    capacidad_maxima: '',
    ubicacion: ''
  });

  const handleCreateRecinto = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/aforo/recintos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showNotification(`✓ Recinto "${formData.nombre}" creado exitosamente`, 'success');
        setFormData({ nombre: '', capacidad_maxima: '', ubicacion: '' });
        loadRecintos();
      } else {
        showNotification('Error al crear recinto', 'error');
      }
    } catch (error) {
      showNotification('Error de conexión', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecintos = async () => {
    try {
      setLoading(true);
      // Aquí iría el GET a /aforo/recintos
      // Por ahora solo mostrar el formulario
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Formulario */}
      <div className="lg:col-span-1">
        <div className="bg-gradient-to-br from-purple-900/50 to-black/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-purple-300 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Crear Recinto
          </h2>

          <form onSubmit={handleCreateRecinto} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre del Recinto
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                placeholder="Ej: Plaza Mayor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Capacidad Máxima (personas)
              </label>
              <input
                type="number"
                value={formData.capacidad_maxima}
                onChange={(e) => setFormData({ ...formData, capacidad_maxima: e.target.value })}
                required
                className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                placeholder="Ej: 5000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ubicación
              </label>
              <input
                type="text"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                required
                className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                placeholder="Ej: Centro"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-medium rounded-lg transition"
            >
              {loading ? 'Creando...' : 'Crear Recinto'}
            </button>
          </form>
        </div>
      </div>

      {/* Información y Lista */}
      <div className="lg:col-span-2">
        <div className="bg-gradient-to-br from-purple-900/50 to-black/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-purple-300 mb-6">
            Estado de Recintos
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-300">Información</h3>
                <p className="text-sm text-blue-200/80 mt-1">
                  Los recintos creados aparecerán aquí con su estado actual de ocupación.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {recintos.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No hay recintos registrados aún
                </p>
              ) : (
                recintos.map((recinto) => (
                  <RecintoCard key={recinto.id} recinto={recinto} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecintoCard({ recinto }) {
  const occupancyPercent = 0; // Será calculado del backend
  const statusColor = occupancyPercent < 85 ? 'bg-green-500/20 border-green-500/50' : 
                     occupancyPercent < 100 ? 'bg-yellow-500/20 border-yellow-500/50' :
                     'bg-red-500/20 border-red-500/50';

  return (
    <div className={`p-4 border rounded-lg backdrop-blur-sm ${statusColor}`}>
      <h3 className="font-medium text-white mb-2">{recinto.nombre}</h3>
      <p className="text-sm text-gray-300">{recinto.ubicacion}</p>
    </div>
  );
}

function PermisosView({ showNotification }) {
  const [comerciantes, setComerciantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    email: '',
    telefono: ''
  });

  const handleCreateComerciante = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/permisos/comerciantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showNotification(`✓ Comerciante "${formData.nombre}" registrado`, 'success');
        setFormData({ nombre: '', cedula: '', email: '', telefono: '' });
        loadComerciantes();
      } else {
        showNotification('Error al registrar comerciante', 'error');
      }
    } catch (error) {
      showNotification('Error de conexión', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadComerciantes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/permisos/comerciantes`);
      if (response.ok) {
        const data = await response.json();
        setComerciantes(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComerciantes();
  }, []);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Formulario */}
      <div className="lg:col-span-1">
        <div className="bg-gradient-to-br from-purple-900/50 to-black/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-purple-300 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Registrar Comerciante
          </h2>

          <form onSubmit={handleCreateComerciante} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                placeholder="Ej: Juan García"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cédula
              </label>
              <input
                type="text"
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                required
                className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                placeholder="Ej: 123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                placeholder="Ej: juan@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
                className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                placeholder="Ej: 555-1234"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-medium rounded-lg transition"
            >
              {loading ? 'Registrando...' : 'Registrar Comerciante'}
            </button>
          </form>
        </div>
      </div>

      {/* Lista de Comerciantes */}
      <div className="lg:col-span-2">
        <div className="bg-gradient-to-br from-purple-900/50 to-black/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-purple-300 mb-6">
            Comerciantes Registrados
          </h2>

          <div className="space-y-3">
            {comerciantes.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No hay comerciantes registrados aún
              </p>
            ) : (
              comerciantes.map((com) => (
                <div key={com.id} className="p-4 bg-black/30 border border-purple-500/20 rounded-lg">
                  <h3 className="font-medium text-white">{com.nombre}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    🆔 {com.cedula} | 📧 {com.email} | 📱 {com.telefono}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
