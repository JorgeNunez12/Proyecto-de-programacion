# Seguridad Vecinal

## Descripción

Seguridad Vecinal es una aplicación web orientada al reporte comunitario de incidentes de seguridad, diseñada para facilitar la visualización, registro y monitoreo de eventos mediante una interfaz interactiva y modular.

La plataforma permite a los usuarios:

* Registrar incidentes en un mapa interactivo.
* Consultar alertas recientes generadas por nuevos reportes.
* Visualizar estadísticas en tiempo real.
* Mantener informada a la comunidad sobre eventos en su zona.

---

## Objetivos del Proyecto

Este proyecto busca proporcionar una solución frontend para:

* Centralizar reportes ciudadanos de seguridad.
* Facilitar el monitoreo comunitario de incidentes.
* Promover la participación ciudadana mediante herramientas digitales.
* Ofrecer una base escalable para futuras integraciones con servicios externos o sistemas institucionales.

---

## Funcionalidades

### Reporte de incidentes

La aplicación permite registrar incidentes mediante:

* Selección de ubicación en mapa interactivo.
* Captura de información del incidente:

  * Tipo de incidente
  * Descripción
  * Nombre del reportante

### Visualización geográfica

* Mapa interactivo basado en Leaflet.
* Ubicación de reportes mediante marcadores.
* Visualización centralizada de incidentes.

### Estadísticas

* Total de reportes registrados.
* Tipo de incidente más frecuente.
* Historial de reportes.
* Alertas recientes generadas dinámicamente.

### Interfaz responsive

* Navegación para escritorio.
* Menú lateral para dispositivos móviles.
* Diseño adaptable mediante media queries.

---

## Tecnologías Utilizadas

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla)

### Librerías y dependencias

* Leaflet.js
* OpenStreetMap
* Google Fonts

---

## Arquitectura del Proyecto

```bash
Seguridad-Vecinal/
│
├── index.html
│
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── components.css
│   ├── layout.css
│   ├── sections.css
│   └── responsive.css
│
├── js/
│   ├── ui.js
│   ├── mapa.js
│   └── reportes.js
│
└── img/
    ├── logo.png
    └── logo-escudo.png
```

---

## Arquitectura JavaScript

### Módulo UI (`ui.js`)

Responsabilidades:

* Navegación entre secciones
* Gestión del menú móvil
* Toast notifications
* Control de sidebar

```javascript
window.UI = {
  mostrarSeccion(),
  toggleMenu(),
  cerrarMenu(),
  toast()
}
```

### Módulo MAPA (`mapa.js`)

Responsabilidades:

* Inicialización de Leaflet
* Gestión de marcadores
* Captura de coordenadas
* Estado del mapa

```javascript
window.MAPA = {
  inicializar(),
  invalidate(),
  getUbicacion()
}
```

### Módulo REPORTES (`reportes.js`)

Responsabilidades:

* Validación de formularios
* Registro de incidentes
* Actualización de estadísticas
* Generación de alertas

```javascript
window.REPORTES = {
  enviar(),
  mostrarSeccion()
}
```

---

## Flujo de Funcionamiento

1. Usuario accede a la plataforma.
2. Selecciona generar reporte.
3. Marca la ubicación del incidente.
4. Completa el formulario.
5. Se registra el reporte.
6. Se actualizan mapa, estadísticas, alertas e historial.

---

## Instalación

```bash
git clone https://github.com/usuario/seguridad-vecinal.git
cd seguridad-vecinal
```

Ejecutar abriendo:

```bash
index.html
```

Opcional:

```bash
Live Server
```

---

## Requisitos

Navegadores compatibles:

* Google Chrome
* Firefox
* Edge
* Safari

Requisitos:

* JavaScript habilitado
* Conexión a internet para dependencias CDN

---

## Mejoras Futuras

* Persistencia con base de datos
* Backend para almacenamiento
* Autenticación de usuarios
* Integración con APIs externas
* Heatmaps de zonas de riesgo
* Notificaciones en tiempo real
* Panel administrativo

---

## Estado del Proyecto

Versión:

```text
v4.0
Arquitectura modular frontend
```

Estado:

```text
En desarrollo activo
```

---

## Licencia

Proyecto desarrollado con fines académicos y comunitarios.
Puede ser utilizado y adaptado conforme a las necesidades del proyecto.
