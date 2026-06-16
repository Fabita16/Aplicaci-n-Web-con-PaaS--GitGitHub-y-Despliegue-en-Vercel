// --- LÓGICA JAVASCRIPT ---

// NOTA: Este script usa 'localStorage' para simular la base de datos.
// Para conectar con Supabase, debes reemplazar las funciones de manipulación de array
// con las llamadas a la API de Supabase (supabase.from('tareas').select()...)

const tareasContainer = document.getElementById('tareas-container');
const contadorElement = document.getElementById('contador');
const tituloInput = document.getElementById('titulo');
const responsableInput = document.getElementById('responsable');

// Estado inicial (Simulación)
let tareas = JSON.parse(localStorage.getItem('tareas_uab')) || [];

// Función principal para renderizar
function renderizarTareas() {
    tareasContainer.innerHTML = '';
    
    // Actualizar contador
    const pendientes = tareas.filter(t => !t.completada).length;
    contadorElement.textContent = pendientes;

    if (tareas.length === 0) {
        tareasContainer.innerHTML = `
            <div class="vacio">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>No hay tareas registradas aún.</p>
            </div>
        `;
        return;
    }

    // Generar HTML para cada tarea
    tareas.forEach((tarea, index) => {
        const div = document.createElement('div');
        div.className = `tarea ${tarea.completada ? 'completada' : ''}`;
        div.innerHTML = `
            <div class="tarea-info">
                <span class="tarea-titulo">${escaparHtml(tarea.titulo)}</span>
                ${tarea.responsable ? `
                    <span class="tarea-responsable">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        ${escaparHtml(tarea.responsable)}
                    </span>
                ` : ''}
            </div>
            <div class="tarea-acciones">
                <button class="btn-accion btn-check" onclick="toggleTarea(${index})" title="Marcar como realizada">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </button>
                <button class="btn-accion btn-eliminar" onclick="eliminarTarea(${index})" title="Eliminar tarea">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;
        tareasContainer.appendChild(div);
    });
}

// Agregar nueva tarea
function agregarTarea() {
    const titulo = tituloInput.value.trim();
    const responsable = responsableInput.value.trim();

    if (titulo === '') return;

    const nuevaTarea = {
        titulo: titulo,
        responsable: responsable,
        completada: false,
        fecha: new Date().toISOString()
    };

    // Aquí iría: supabase.from('tareas').insert([nuevaTarea])
    
    tareas.unshift(nuevaTarea); // Agregar al principio
    guardarYRenderizar();

    // Limpiar formulario
    tituloInput.value = '';
    responsableInput.value = '';
    tituloInput.focus();
}

// Toggle completado
function toggleTarea(index) {
    // Aquí iría: supabase.from('tareas').update({ completada: !tareas[index].completada }).eq('id', id)
    tareas[index].completada = !tareas[index].completada;
    guardarYRenderizar();
}

// Eliminar tarea
function eliminarTarea(index) {
    // Aquí iría: supabase.from('tareas').delete().eq('id', id)
    if(confirm('¿Estás seguro de eliminar esta tarea?')) {
        tareas.splice(index, 1);
        guardarYRenderizar();
    }
}

// Guardar en LocalStorage y actualizar vista
function guardarYRenderizar() {
    localStorage.setItem('tareas_uab', JSON.stringify(tareas));
    renderizarTareas();
}

// Utilidad para seguridad (evitar inyección HTML)
function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', renderizarTareas);