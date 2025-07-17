# Documentación de la API

Esta API RESTful proporciona una interfaz para la gestión completa de usuarios, incluyendo operaciones CRUD, autenticación y autorización.

## Documentación Interactiva (Swagger UI)

La documentación más completa y actualizada de la API, incluyendo todos los endpoints, modelos de datos, parámetros y respuestas de ejemplo, se encuentra disponible a través de nuestra interfaz de **Swagger UI**.

Una vez que la aplicación esté desplegada en AWS, puedes acceder a la documentación interactiva en la siguiente URL:

**URL de Swagger UI:** `http://<IP_PÚBLICA_DE_LA_EC2>/api-docs`

Desde esta interfaz, podrás:
-   Visualizar todos los endpoints disponibles.
-   Ver los detalles de cada endpoint: método HTTP, ruta, descripción, parámetros y posibles respuestas.
-   Probar los endpoints directamente desde el navegador, incluyendo los que requieren autenticación.

## Visión General de la Autenticación

La API utiliza **JSON Web Tokens (JWT)** para proteger los endpoints. El flujo de autenticación es el siguiente:

1.  **Registro (`POST /api/users`):** Un nuevo usuario se puede crear a través de este endpoint público. La contraseña se hashea automáticamente antes de ser guardada en la base de datos.

2.  **Inicio de Sesión (`POST /api/auth/login`):** El usuario envía su `email` y `password`. Si las credenciales son correctas, la API devuelve un token JWT con una duración definida (ej. 1 hora).

3.  **Acceso a Rutas Protegidas:** Para acceder a los endpoints protegidos (ej. `GET /api/users`, `PUT /api/users/:id`), el cliente debe incluir el token JWT en la cabecera `Authorization` de la petición, utilizando el esquema "Bearer":

    ```http
    Authorization: Bearer <tu_token_jwt>
    ```

Si el token es válido, la API procesará la petición. Si el token falta, es inválido o ha expirado, la API devolverá un error `401 Unauthorized`.

## Estructura de Endpoints Principales

A continuación, se muestra una visión general de los recursos y endpoints principales. Para detalles completos, por favor, consulta la [Documentación Interactiva](#documentación-interactiva-swagger-ui).

-   **Autenticación (`/api/auth`)**
    -   `POST /login`: Autentica a un usuario y devuelve un token JWT.

-   **Usuarios (`/api/users`)**
    -   `POST /`: Crea un nuevo usuario (Registro). (Público)
    -   `GET /`: Obtiene una lista de todos los usuarios con paginación. (Protegido)
    -   `GET /:id`: Obtiene los detalles de un usuario específico. (Protegido)
    -   `PUT /:id`: Actualiza los datos de un usuario específico. (Protegido)
    -   `DELETE /:id`: Elimina un usuario específico. (Protegido)

-   **Salud del Sistema (`/api/health`)**
    -   `GET /`: Endpoint de prueba para verificar que la API está en funcionamiento. Devuelve `{"status":"OK"}`. (Público)