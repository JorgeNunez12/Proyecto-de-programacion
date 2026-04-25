/* ============================================================================
   ui.js — Modulo de Interfaz de Usuario
   ----------------------------------------------------------------------------
   Maneja la navegacion entre secciones, las notificaciones tipo Toast,
   el menu lateral movil y el comportamiento responsive del header.

   Funciones publicas (expuestas en window.UI):
   - UI.toast(mensaje, tipo)        Muestra una notificacion flotante
   - UI.mostrarSeccion(id)          Cambia la seccion visible
   - UI.toggleMenu() / UI.cerrarMenu()  Controla el sidebar movil
   ============================================================================ */

(function () {
  'use strict';

  /* ==========================================================
     SISTEMA DE TOAST
     Reemplaza los alert() del navegador. Soporta 3 tipos:
     'success' (verde), 'warning' (naranja), 'info' (azul).
     ========================================================== */
  var iconos = {
    success: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M5 10l3 3 7-7" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    warning: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M10 4v7M10 14v.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
    info:    '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none"/><path d="M10 9v5M10 6v.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>'
  };

  function toast(mensaje, tipo) {
    tipo = tipo || 'info';
    var contenedor = document.getElementById('toast-container');
    if (!contenedor) return;

    var el = document.createElement('div');
    el.className = 'toast toast-' + tipo;
    el.innerHTML = '<span class="toast-icon">' + iconos[tipo] + '</span>' +
                   '<span class="toast-msg">' + mensaje + '</span>';
    contenedor.appendChild(el);

    // Animar entrada
    setTimeout(function () { el.classList.add('show'); }, 20);
    // Remover despues de 4 segundos
    setTimeout(function () {
      el.classList.remove('show');
      setTimeout(function () { el.remove(); }, 400);
    }, 4000);
  }


  /* ==========================================================
     NAVEGACION ENTRE SECCIONES
     Oculta todas las secciones y muestra solo la solicitada.
     Tambien actualiza la clase 'activo' en los links del nav.
     ========================================================== */
  function mostrarSeccion(id) {
    // Ocultar todas las secciones
    var secciones = document.querySelectorAll('main section');
    for (var i = 0; i < secciones.length; i++) {
      secciones[i].style.display = 'none';
    }
    // Mostrar la solicitada
    var seccion = document.getElementById(id);
    if (seccion) seccion.style.display = '';

    // Si es el mapa, recalcular tamaño (Leaflet lo necesita)
    if (id === 'inicio' && window.MAPA && window.MAPA.invalidate) {
      setTimeout(window.MAPA.invalidate, 100);
    }

    // Actualizar links activos en ambas navs
    var links = document.querySelectorAll('.nav-horizontal a, #menu-lateral a');
    for (var i = 0; i < links.length; i++) {
      links[i].classList.remove('activo');
      if (links[i].dataset.section === id) {
        links[i].classList.add('activo');
      }
    }

    // Scroll suave al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  /* ==========================================================
     SIDEBAR / MENU MOVIL
     ========================================================== */
  function toggleMenu() {
    document.getElementById('menu-lateral').classList.toggle('open');
    document.getElementById('menu-overlay').classList.toggle('open');
    document.getElementById('btn-menu').classList.toggle('open');
  }
  function cerrarMenu() {
    document.getElementById('menu-lateral').classList.remove('open');
    document.getElementById('menu-overlay').classList.remove('open');
    document.getElementById('btn-menu').classList.remove('open');
  }


  /* ==========================================================
     RESPONSIVE: alterna nav-horizontal y sidebar segun ancho
     ========================================================== */
  function checkLayout() {
    var navH = document.getElementById('nav-horizontal');
    var btnM = document.getElementById('btn-menu');
    if (!navH || !btnM) return;

    if (window.innerWidth >= 900) {
      navH.style.display = 'flex';
      btnM.style.display = 'none';
      cerrarMenu();
    } else {
      navH.style.display = 'none';
      btnM.style.display = 'flex';
    }
  }


  /* ==========================================================
     INICIALIZACION
     ========================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    // Año dinamico en el footer
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    checkLayout();
    mostrarSeccion('hero');
  });

  window.addEventListener('resize', checkLayout);


  /* --- API publica --- */
  window.UI = {
    toast:          toast,
    mostrarSeccion: mostrarSeccion,
    toggleMenu:     toggleMenu,
    cerrarMenu:     cerrarMenu
  };
})();
