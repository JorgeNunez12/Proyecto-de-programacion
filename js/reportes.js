/* ============================================================================
   reportes.js — Modulo de Reportes
   ----------------------------------------------------------------------------
   Maneja el formulario de incidentes: validacion visual, envio del reporte,
   actualizacion de estadisticas y generacion de alertas recientes.
   Tambien expone helpers para mostrar la seccion de reporte (que inicializa
   el mapa bajo demanda).

   Funciones publicas (expuestas en window.REPORTES):
   - REPORTES.enviar()               Procesa el formulario
   - REPORTES.mostrarSeccion()       Abre la seccion + inicializa mapa
   ============================================================================ */

(function () {
  'use strict';

  /* --- Estado interno --- */
  var reportes = [];   // Array con todos los reportes enviados

  /* --- Configuracion: colores de marcadores por tipo --- */
  var COLORES = {
    robo:       '#e53935',
    vandalismo: '#fb8c00',
    violencia:  '#b71c1c',
    tiroteo:    '#212121',
    otro:       '#1e88e5'
  };


  /* ==========================================================
     VALIDAR UN CAMPO INDIVIDUAL
     Marca el form-group como 'valido' o 'invalido' y muestra
     el mensaje de error si corresponde.
     ========================================================== */
  function validarCampo(input, mensajeError, condicion) {
    var grupo = input.closest('.form-group');
    if (!grupo) return condicion;
    var error = grupo.querySelector('.form-error');

    if (!condicion) {
      grupo.classList.add('invalido');
      grupo.classList.remove('valido');
      if (error) error.textContent = mensajeError;
      return false;
    } else {
      grupo.classList.remove('invalido');
      grupo.classList.add('valido');
      if (error) error.textContent = '';
      return true;
    }
  }


  /* ==========================================================
     LIMPIAR ESTADOS DE VALIDACION DEL FORMULARIO
     ========================================================== */
  function limpiarValidacion() {
    var grupos = document.querySelectorAll('#formulario .form-group');
    for (var i = 0; i < grupos.length; i++) {
      grupos[i].classList.remove('valido', 'invalido');
    }
  }


  /* ==========================================================
     ENVIAR REPORTE
     Valida campos, agrega marcador, guarda en el array,
     actualiza estadisticas y alertas, limpia el formulario.
     ========================================================== */
  function enviar() {
    var inputNombre = document.getElementById('nombre');
    var inputDesc   = document.getElementById('descripcion');
    var nombre      = inputNombre.value.trim();
    var tipo        = document.getElementById('tipo').value;
    var descripcion = inputDesc.value.trim();

    // Validaciones
    var okNombre = validarCampo(inputNombre, 'Por favor escribe tu nombre.', nombre.length >= 2);
    var okDesc   = validarCampo(inputDesc, 'Cuentanos brevemente que paso.', descripcion.length >= 5);

    if (!okNombre || !okDesc) {
      window.UI.toast('Por favor completa los campos marcados', 'warning');
      return;
    }

    var ubicacion = window.MAPA.getUbicacion();
    if (!ubicacion) {
      window.UI.toast('Primero haz clic en el mapa para marcar la ubicacion', 'warning');
      return;
    }

    // Crear marcador
    var color = COLORES[tipo] || '#888';
    var popup = '<div style="font-family:Nunito,sans-serif">' +
                  '<strong style="text-transform:uppercase;color:' + color + '">' + tipo + '</strong><br>' +
                  '<span style="font-size:0.85em;color:#666">Por: ' + nombre + '</span>' +
                  '<p style="margin:6px 0 0">' + descripcion + '</p>' +
                '</div>';

    window.MAPA.agregarMarcador(ubicacion.lat, ubicacion.lng, {
      radius: 11,
      fillColor: color,
      color: '#ffffff',
      weight: 2,
      fillOpacity: 0.92
    }, popup);

    // Guardar reporte
    reportes.push({
      nombre: nombre,
      tipo: tipo,
      descripcion: descripcion,
      hora: new Date()
    });

    // Actualizar UI
    actualizarEstadisticas();
    agregarAlerta(nombre, tipo, descripcion);

    var statTotal = document.getElementById('stat-total');
    if (statTotal) statTotal.textContent = reportes.length;

    window.UI.toast('Reporte enviado correctamente. Gracias por contribuir!', 'success');

    // Limpiar formulario
    inputNombre.value = '';
    inputDesc.value = '';
    limpiarValidacion();
    window.MAPA.limpiarUbicacion();
  }


  /* ==========================================================
     ACTUALIZAR TODAS LAS ESTADISTICAS Y LA TABLA
     ========================================================== */
  function actualizarEstadisticas() {
    var totalEl = document.getElementById('total-reportes');
    if (totalEl) totalEl.textContent = reportes.length;

    // Conteo por tipo
    var conteo = {};
    for (var i = 0; i < reportes.length; i++) {
      var t = reportes[i].tipo;
      conteo[t] = (conteo[t] || 0) + 1;
    }

    // Renderizar chips de conteo
    var lista = document.getElementById('lista-conteo');
    if (lista) {
      lista.innerHTML = '';
      if (reportes.length === 0) {
        lista.innerHTML = '<li class="chip-empty">Aun no hay reportes registrados.</li>';
      } else {
        for (var tipo in conteo) {
          var li = document.createElement('li');
          li.className = 'chip chip-' + tipo;
          li.innerHTML = '<span class="chip-num">' + conteo[tipo] + '</span> ' + tipo;
          lista.appendChild(li);
        }
      }
    }

    // KPI: tipo mas frecuente
    var maxTipo = '--', maxCount = 0;
    for (var t in conteo) {
      if (conteo[t] > maxCount) { maxCount = conteo[t]; maxTipo = t; }
    }
    var kpiFrecuente = document.getElementById('kpi-frecuente');
    if (kpiFrecuente) kpiFrecuente.textContent = maxTipo;

    // KPI: hora mas reciente
    var ultimo = reportes[reportes.length - 1];
    if (ultimo) {
      var hora = ultimo.hora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
      var kpiReciente = document.getElementById('kpi-reciente');
      if (kpiReciente) kpiReciente.textContent = hora;
    }

    // Tabla: agregar nueva fila al inicio
    var tbody = document.getElementById('cuerpo-tabla');
    if (tbody && ultimo) {
      var vacia = tbody.querySelector('.tabla-vacia');
      if (vacia) vacia.remove();

      var fila = document.createElement('tr');
      fila.innerHTML =
        '<td>' + ultimo.nombre + '</td>' +
        '<td><span class="tag tag-' + ultimo.tipo + '">' + ultimo.tipo + '</span></td>' +
        '<td>' + ultimo.descripcion + '</td>';
      tbody.insertBefore(fila, tbody.firstChild);
    }
  }


  /* ==========================================================
     AGREGAR ALERTA RECIENTE
     ========================================================== */
  function agregarAlerta(nombre, tipo, descripcion) {
    var cont = document.getElementById('alertas-recientes');
    if (!cont) return;

    var vacia = cont.querySelector('.alerta-vacia');
    if (vacia) vacia.remove();

    var hora = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    var el = document.createElement('div');
    el.className = 'alerta alerta-' + tipo;
    el.innerHTML =
      '<div class="alerta-header">' +
        '<span class="tag tag-' + tipo + '">' + tipo + '</span>' +
        '<span class="alerta-hora">' + hora + '</span>' +
      '</div>' +
      '<p class="alerta-desc">' + descripcion + '</p>' +
      '<p class="alerta-meta">Reportado por ' + nombre + '</p>';
    cont.insertBefore(el, cont.firstChild);
  }


  /* ==========================================================
     MOSTRAR SECCION DE REPORTE + INICIALIZAR MAPA
     ========================================================== */
  function mostrarSeccion() {
    window.UI.mostrarSeccion('inicio');
    setTimeout(function () {
      window.MAPA.inicializar();
      window.MAPA.invalidate();
    }, 150);
  }


  /* --- API publica --- */
  window.REPORTES = {
    enviar:         enviar,
    mostrarSeccion: mostrarSeccion
  };
})();
