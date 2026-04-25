/* ============================================================================
   mapa.js — Modulo del Mapa Interactivo (Leaflet)
   ----------------------------------------------------------------------------
   Encapsula toda la logica del mapa: inicializacion lazy (solo se carga
   cuando el usuario abre la seccion de reporte), captura de coordenadas
   al hacer clic, y creacion de marcadores.

   Funciones publicas (expuestas en window.MAPA):
   - MAPA.inicializar()              Crea el mapa la primera vez
   - MAPA.invalidate()               Recalcula tamaño (al cambiar de seccion)
   - MAPA.getUbicacion()             Devuelve {lat, lng} o null
   - MAPA.limpiarUbicacion()         Resetea las coordenadas
   - MAPA.agregarMarcador(lat, lng, opts, popup)
   ============================================================================ */

(function () {
  'use strict';

  /* --- Estado interno --- */
  var mapa = null;
  var inicializado = false;
  var lat = null;
  var lng = null;

  /* --- Coordenadas iniciales (Culiacan, Sinaloa) --- */
  var COORDS_INICIO = [24.32441803809965, -107.35731435348545];
  var ZOOM_INICIO = 13;


  /* ==========================================================
     ACTUALIZAR INDICADOR VISUAL DE UBICACION
     Cambia el cuadro debajo del mapa (gris -> verde con punto pulsante).
     ========================================================== */
  function actualizarStatus(seleccionada) {
    var box = document.getElementById('ubicacion-status');
    if (!box) return;
    var texto = box.querySelector('.status-text');

    if (seleccionada) {
      box.classList.add('activo');
      if (texto) texto.textContent = 'Ubicacion lista. Ahora completa el formulario.';
    } else {
      box.classList.remove('activo');
      if (texto) texto.textContent = 'Esperando que selecciones una ubicacion...';
    }
  }


  /* ==========================================================
     INICIALIZAR MAPA (lazy load)
     Solo se ejecuta la primera vez que se abre el reporte,
     mejorando el tiempo de carga inicial de la pagina.
     ========================================================== */
  function inicializar() {
    if (inicializado) return;
    if (typeof L === 'undefined') {
      console.error('Leaflet no esta cargado');
      return;
    }

    mapa = L.map('mapa').setView(COORDS_INICIO, ZOOM_INICIO);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19
    }).addTo(mapa);

    // Capturar clic en el mapa
    mapa.on('click', function (e) {
      lat = e.latlng.lat;
      lng = e.latlng.lng;
      actualizarStatus(true);
      if (window.UI) window.UI.toast('Ubicacion seleccionada correctamente', 'success');
    });

    inicializado = true;
  }


  /* ==========================================================
     RECALCULAR TAMAÑO DEL MAPA
     Leaflet necesita esto cuando el contenedor cambia de tamaño
     o pasa de oculto a visible.
     ========================================================== */
  function invalidate() {
    if (mapa && inicializado) {
      mapa.invalidateSize();
    }
  }


  /* ==========================================================
     OBTENER COORDENADAS SELECCIONADAS
     ========================================================== */
  function getUbicacion() {
    if (lat === null || lng === null) return null;
    return { lat: lat, lng: lng };
  }


  /* ==========================================================
     LIMPIAR COORDENADAS (despues de enviar el reporte)
     ========================================================== */
  function limpiarUbicacion() {
    lat = null;
    lng = null;
    actualizarStatus(false);
  }


  /* ==========================================================
     AGREGAR MARCADOR AL MAPA
     ========================================================== */
  function agregarMarcador(latitud, longitud, opciones, htmlPopup) {
    if (!mapa) return null;
    var marcador = L.circleMarker([latitud, longitud], opciones).addTo(mapa);
    if (htmlPopup) marcador.bindPopup(htmlPopup).openPopup();
    return marcador;
  }


  /* --- API publica --- */
  window.MAPA = {
    inicializar:      inicializar,
    invalidate:       invalidate,
    getUbicacion:     getUbicacion,
    limpiarUbicacion: limpiarUbicacion,
    agregarMarcador:  agregarMarcador
  };
})();
