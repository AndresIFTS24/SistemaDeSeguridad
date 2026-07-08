# OPTIMUS — Sistema Integral de Gestión Operativa

![Angular](https://img.shields.io/badge/Angular-19-DD0031?logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?logo=socket.io&logoColor=white)
![Clever Cloud](https://img.shields.io/badge/Deploy-Clever%20Cloud-000091)

**OPTIMUS** es un sistema integral de gestión operativa para una empresa de seguridad electrónica. Centraliza la administración de abonados, dispositivos, eventos y alarmas en un panel único, con paneles diferenciados por sector, comunicación en tiempo real vía WebSockets y geolocalización real de los puntos de servicio.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Angular 19 (standalone components) |
| Backend | Node.js + Express |
| Base de datos | MySQL |
| Tiempo real | Socket.io |
| Mapas | Leaflet + geocodificación con Nominatim (OpenStreetMap) |
| Despliegue | Clever Cloud |

---

## Sectores / Dashboards

| Sector | Descripción |
|---|---|
| **Dirección** | Vista ejecutiva: indicadores generales, gestión de usuarios y reportes globales de la operación. |
| **IT** | Administración técnica del sistema: dispositivos, roles, sectores y soporte a la infraestructura. |
| **Monitoreo** | Consola de alarmas y eventos en tiempo real para el equipo que supervisa las centrales de seguridad. |
| **Comercial** | Seguimiento de ventas, contratos nuevos y métricas de efectividad comercial. |
| **Técnica y Campo** | Supervisión de cuadrillas técnicas y trabajo de campo (instalación y mantenimiento). |

---

## Funcionalidades destacadas

- **Geocodificación real de direcciones** de abonados mediante la API de **Nominatim** (OpenStreetMap).
- **Mapa de cobertura** interactivo con **Leaflet**, ubicando abonados y puntos de servicio geográficamente.
- **Eventos y alarmas en tiempo real** mediante **WebSockets (Socket.io)**, sin necesidad de refrescar el navegador.
- **Sistema de roles y permisos por sector**, con autenticación JWT y control de acceso a rutas y vistas según el sector del usuario.

---

## Sistema desplegado

| Entorno | URL |
|---|---|
| Frontend | https://optimus.cleverapps.io |
| Backend (API) | https://optimus-seguridad.cleverapps.io |

---

## Instalación local

### Requisitos previos
- Node.js
- MySQL
- Angular CLI (`npm install -g @angular/cli`)

### 1. Clonar el repositorio
```bash
git clone https://github.com/AndresIFTS24/SistemaDeSeguridad
cd SistemaDeSeguridad
```

### 2. Backend (raíz del repo)
```bash
npm install
```

Crear un archivo `.env` en la raíz (podés basarte en `.env.example`) con las siguientes variables:

```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=3306
JWT_SECRET=
JWT_EXPIRES_IN=8h
PORT=3000
FRONTEND_URL=http://localhost:4200
```

Levantar el backend:
```bash
npm run dev
```
El backend queda disponible en `http://localhost:3000`.

### 3. Frontend
```bash
cd optimus-front
npm install
ng serve
```
El frontend queda disponible en `http://localhost:4200`.

---

## Autores

- **Liliana Alvarez**
- **Andrés Bertolin**

**Materia:** Proyecto Integrador
**Carrera:** Tecnicatura en Desarrollo de Software
**IFTS N°24**
