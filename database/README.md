# Base de Datos — Dump

`optimus_dump.sql` es un volcado completo (estructura + datos) de la base 
MySQL del proyecto, exportado desde Clever Cloud el 14/07/2026.

## Cómo restaurarlo

```
mysql -u usuario -p nombre_basededatos < database/optimus_dump.sql
```

## Contenido

Incluye todas las tablas del sistema con datos de prueba ya sembrados 
(ABONADOS, DISPOSITIVOS, EVENTOS, STOCK, SEGUIMIENTOS_EVENTOS, 
MODELOS_DISPOSITIVOS, USUARIOS, etc.), consistentes con lo verificado 
en los commits anteriores de esta sesión.
