# Guía de Migraciones de Base de Datos

Este proyecto utiliza **TypeORM** para gestionar las migraciones de la base de datos. Las migraciones permiten versionar el esquema de la base de datos y aplicar cambios de manera controlada y reversible.

## Configuración

La configuración de la conexión para las migraciones se encuentra en `apps/backend/typeorm-cli.config.ts`.
Este archivo lee las variables de entorno del archivo `.env`.

### Variables de Entorno Relevantes

Asegúrate de tener configuradas las siguientes variables en tu archivo `.env`:

```dotenv
DB_TYPE=postgres      # Tipo de base de datos (postgres, mysql, mariadb, etc.)
DB_HOST=localhost     # Host de la base de datos
DB_PORT=5432          # Puerto
DB_USERNAME=usuario   # Usuario
DB_PASSWORD=password  # Contraseña
DB_NAME=nombre_db     # Nombre de la base de datos
```

## Comandos Disponibles

Los siguientes comandos se ejecutan desde el directorio `apps/backend`:

### 1. Generar una Migración

Cuando hayas realizado cambios en tus entidades (`*.entity.ts`), debes generar una nueva migración. TypeORM comparará tus entidades con el estado actual de la base de datos y generará el SQL necesario.

```bash
npm run migration:generate -- ./migrations/NombreDescriptivoDelCambio
```

*Ejemplo:*
```bash
npm run migration:generate -- ./migrations/AddUserEmail
```

Esto creará un nuevo archivo en la carpeta `migrations/` con un timestamp y el nombre que le diste.

### 2. Ejecutar Migraciones

Para aplicar los cambios pendientes a la base de datos (tanto en desarrollo como en producción):

```bash
npm run migration:run
```

Este comando ejecutará todas las migraciones que aún no se hayan registrado en la tabla `migrations` de la base de datos.

### 3. Revertir Migraciones

Si necesitas deshacer la última migración aplicada:

```bash
npm run migration:revert
```

Esto ejecutará el método `down` de la última migración aplicada.

### 4. Crear una Migración Vacía

Si necesitas escribir SQL manualmente en una migración:

```bash
npm run migration:create -- ./migrations/NombreDeLaMigracion
```

## Flujo de Trabajo Recomendado

1.  Modifica tus archivos `.entity.ts` según los requerimientos.
2.  Ejecuta `npm run migration:generate` para crear el archivo de migración.
3.  Revisa el archivo generado en `apps/backend/migrations/` para asegurarte de que el SQL es correcto.
4.  Ejecuta `npm run migration:run` para aplicar los cambios a tu base de datos local.
5.  Comitea tanto los cambios en las entidades como el nuevo archivo de migración.

## Solución de Problemas

*   **Error de conexión**: Verifica que las credenciales en `.env` sean correctas y que la base de datos esté corriendo.
*   **No se detectan cambios**: Asegúrate de haber guardado los archivos de entidad y de que estén incluidos en la ruta de `entities` en `typeorm-cli.config.ts`.
*   **Conflictos de migración**: Si varios desarrolladores generan migraciones al mismo tiempo, pueden ocurrir conflictos. Asegúrate de tener la última versión de la rama principal antes de generar una nueva migración.
