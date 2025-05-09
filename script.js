document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const fileInput = document.getElementById('archivos');
    const fileList = document.getElementById('fileList');
    const historialTareas = document.getElementById('historialTareas');

    // Manejador de archivos
    fileInput.addEventListener('change', function(e) {
        fileList.innerHTML = '';
        Array.from(e.target.files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.textContent = `${file.name} (${formatFileSize(file.size)})`;
            fileList.appendChild(fileItem);
        });
    });

    // Validación de fechas
    const fechaInicio = document.getElementById('fechaInicio');
    const fechaFin = document.getElementById('fechaFin');

    fechaInicio.addEventListener('change', function() {
        fechaFin.min = fechaInicio.value;
    });

    fechaFin.addEventListener('change', function() {
        if (fechaFin.value < fechaInicio.value) {
            alert('La fecha de fin no puede ser anterior a la fecha de inicio');
            fechaFin.value = fechaInicio.value;
        }
    });

    // Guardar tarea
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const tarea = {
            sala: document.getElementById('salaSelect').value,
            prioridad: document.getElementById('prioridadSelect').value,
            fechaInicio: fechaInicio.value,
            fechaFin: fechaFin.value,
            descripcion: document.getElementById('descripcion').value,
            archivos: Array.from(fileInput.files).map(f => f.name)
        };

        guardarTarea(tarea);
        actualizarHistorial();
        taskForm.reset();
        fileList.innerHTML = '';
    });

    // Funciones auxiliares
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function guardarTarea(tarea) {
        let tareas = JSON.parse(localStorage.getItem('tareas') || '[]');
        tareas.push({...tarea, id: Date.now()});
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }

    function actualizarHistorial() {
        const tareas = JSON.parse(localStorage.getItem('tareas') || '[]');
        historialTareas.innerHTML = '';
        
        tareas.reverse().forEach(tarea => {
            const item = document.createElement('div');
            item.className = `list-group-item prioridad-${tarea.prioridad}`;
            item.innerHTML = `
                <h6 class="mb-1">Sala: ${tarea.sala}</h6>
                <p class="mb-1">${tarea.descripcion}</p>
                <small class="task-date">
                    ${new Date(tarea.fechaInicio).toLocaleString()} - 
                    ${new Date(tarea.fechaFin).toLocaleString()}
                </small>
            `;
            historialTareas.appendChild(item);
        });
    }

    // Inicializar historial
    actualizarHistorial();
});