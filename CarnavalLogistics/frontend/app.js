const API_URL = 'http://localhost:8000';

// Elementos DOM
const navBtns = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');
const notification = document.getElementById('notification');

// Formas
const formRecinto = document.getElementById('formRecinto');
const formMovimiento = document.getElementById('formMovimiento');
const formComerciante = document.getElementById('formComerciante');
const formPuesto = document.getElementById('formPuesto');
const formPermiso = document.getElementById('formPermiso');

// NAVEGACIÓN
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        navBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(tab).classList.add('active');
        
        if (tab === 'aforo') {
            cargarRecintos();
        } else {
            cargarPermisos();
            cargarComerciantes();
        }
    });
});

// NOTIFICACIONES
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ===== AFORO =====

formRecinto.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        nombre: document.getElementById('nombre').value,
        capacidad_maxima: parseInt(document.getElementById('capacidad').value),
        ubicacion: document.getElementById('ubicacion').value
    };
    
    try {
        const response = await fetch(`${API_URL}/aforo/recintos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showNotification(`✓ Recinto "${data.nombre}" creado exitosamente`, 'success');
            formRecinto.reset();
            cargarRecintos();
        } else {
            showNotification('Error al crear recinto', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
        console.error(error);
    }
});

formMovimiento.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        tipo: document.getElementById('tipoMov').value,
        cantidad: parseInt(document.getElementById('cantidad').value)
    };
    
    const recintoId = document.getElementById('recintoId').value;
    
    try {
        const response = await fetch(`${API_URL}/aforo/recintos/${recintoId}/movimientos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showNotification(`✓ ${data.cantidad} personas registradas (${data.tipo})`, 'success');
            formMovimiento.reset();
            cargarRecintos();
        } else {
            showNotification('Error al registrar movimiento', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
        console.error(error);
    }
});

async function cargarRecintos() {
    const container = document.getElementById('recintos-list');
    
    try {
        // Simulamos obtener recintos - en una app real, harías un GET a /aforo/recintos
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #9CA3AF; padding: 40px;">
                <p>Los recintos aparecerán aquí una vez sean creados</p>
                <p style="font-size: 0.85em; margin-top: 10px;">Crea tu primer recinto en el formulario de arriba</p>
            </div>
        `;
    } catch (error) {
        container.innerHTML = '<div class="loading">Error al cargar recintos</div>';
    }
}

// ===== PERMISOS =====

formComerciante.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        nombre: document.getElementById('nomComerciante').value,
        cedula: document.getElementById('cedula').value,
        email: document.getElementById('emailCom').value,
        telefono: document.getElementById('telefonoCom').value
    };
    
    try {
        const response = await fetch(`${API_URL}/permisos/comerciantes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            showNotification(`✓ Comerciante "${data.nombre}" registrado (ID: ${result.id})`, 'success');
            formComerciante.reset();
            cargarComerciantes();
        } else {
            showNotification('Error al registrar comerciante', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
        console.error(error);
    }
});

formPuesto.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        nombre: document.getElementById('nomPuesto').value,
        descripcion: document.getElementById('descPuesto').value,
        ubicacion: document.getElementById('ubPuesto').value
    };
    
    try {
        const response = await fetch(`${API_URL}/permisos/puestos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            showNotification(`✓ Puesto "${data.nombre}" creado (ID: ${result.id})`, 'success');
            formPuesto.reset();
        } else {
            showNotification('Error al crear puesto', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
        console.error(error);
    }
});

formPermiso.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        comerciante_id: parseInt(document.getElementById('idCom').value),
        puesto_id: parseInt(document.getElementById('idPuesto').value),
        fecha_inicio: document.getElementById('fechaInicio').value,
        fecha_fin: document.getElementById('fechaFin').value
    };
    
    try {
        const response = await fetch(`${API_URL}/permisos/permisos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            showNotification(`✓ Permiso solicitado (ID: ${result.id})`, 'success');
            formPermiso.reset();
            cargarPermisos();
        } else {
            showNotification('Error al solicitar permiso', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
        console.error(error);
    }
});

async function cargarComerciantes() {
    const container = document.getElementById('comerciantes-list');
    
    try {
        const response = await fetch(`${API_URL}/permisos/comerciantes`);
        const comerciantes = await response.json();
        
        if (comerciantes.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; color: #9CA3AF; padding: 40px;">
                    <p>No hay comerciantes registrados</p>
                </div>
            `;
        } else {
            container.innerHTML = comerciantes.map(com => `
                <div class="comerciante-item">
                    <h4>${com.nombre}</h4>
                    <p><strong>Cédula:</strong> ${com.cedula}</p>
                    <p><strong>Email:</strong> ${com.email}</p>
                    <p><strong>Teléfono:</strong> ${com.telefono}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        container.innerHTML = '<div class="loading">Error al cargar comerciantes</div>';
    }
}

async function cargarPermisos() {
    const container = document.getElementById('permisos-list');
    
    try {
        const response = await fetch(`${API_URL}/permisos/permisos`);
        const permisos = await response.json();
        
        if (permisos.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: #9CA3AF; padding: 40px;">
                    <p>No hay permisos registrados</p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Comerciante</th>
                            <th>Puesto</th>
                            <th>Estado</th>
                            <th>Vigencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${permisos.map(p => `
                            <tr>
                                <td>#${p.id}</td>
                                <td>${p.comerciante_id}</td>
                                <td>${p.puesto_id}</td>
                                <td><span class="estado-badge estado-${p.estado.toLowerCase()}">${p.estado}</span></td>
                                <td>${new Date(p.fecha_inicio).toLocaleDateString()} - ${new Date(p.fecha_fin).toLocaleDateString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    } catch (error) {
        container.innerHTML = '<div class="loading">Error al cargar permisos</div>';
    }
}

// Cargar datos iniciales
cargarRecintos();
cargarComerciantes();
