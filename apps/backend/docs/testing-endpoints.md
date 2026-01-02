# Probando los Endpoints con Swagger y Postman

Hemos implementado **OpenAPI (Swagger)** en el backend para facilitar la documentación y prueba de los endpoints.

## Acceso a la Documentación

1.  Asegúrate de que el backend esté corriendo:
    ```bash
    pnpm dev:backend
    ```
2.  Abre tu navegador y ve a:
    [http://localhost:8080/swagger](http://localhost:8080/swagger)

Aquí verás una interfaz interactiva donde puedes probar todos los endpoints directamente desde el navegador.

## Generar Colección de Postman

Para tener una colección de Postman lista para usar con ejemplos y esquemas:

1.  Ve a [http://localhost:8080/swagger-json](http://localhost:8080/swagger-json)
2.  Verás un archivo JSON con la especificación de tu API.
3.  Guarda ese contenido como `swagger.json` (o copia la URL).
4.  Abre **Postman**.
5.  Haz clic en **Import**.
6.  Pega la URL o sube el archivo JSON.

¡Listo! Postman creará automáticamente una colección con todos tus endpoints, organizados por carpetas (Workflows, Process Instances, Data Sources) y con los cuerpos de petición (body) pre-configurados basados en tus DTOs.

## Beneficios

*   **Sincronización**: Si cambias el código (DTOs, Controladores), Swagger se actualiza automáticamente. Solo tienes que re-importar en Postman para tener los cambios.
*   **Ejemplos**: Swagger usa los tipos de TypeScript para generar ejemplos de datos en la documentación.
*   **Interactividad**: Puedes probar "rápido" en el navegador sin abrir Postman si solo quieres verificar que un endpoint responde.
