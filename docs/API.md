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

La API utiliza un sistema de autenticación robusto basado en **JSON Web Tokens (JWT)**, implementando un flujo de **Access Token** y **Refresh Token** para mejorar la seguridad y la experiencia de usuario.

### Flujo de Autenticación

1.  **Registro (`POST /api/users`):** Un nuevo usuario se puede crear a través de este endpoint público. La contraseña se hashea automáticamente (usando `bcrypt`) antes de ser guardada en la base de datos.

2.  **Inicio de Sesión (`POST /api/auth/login`):**
    -   El usuario envía su `email` y `password`.
    -   Si las credenciales son correctas, la API genera dos tokens:
        -   Un **Access Token** de corta duración (ej. 15 minutos), que se devuelve en el cuerpo de la respuesta JSON.
        -   Un **Refresh Token** de larga duración (ej. 7 días), que se envía al cliente en una **cookie segura y `HttpOnly`**.

3.  **Acceso a Rutas Protegidas:**
    -   Para acceder a los endpoints protegidos (ej. `GET /api/users`), el cliente debe incluir el **Access Token** en la cabecera `Authorization` de la petición, utilizando el esquema "Bearer":
        ```http
        Authorization: Bearer <tu_access_token>
        ```
    -   Si el Access Token es válido, la API procesará la petición.

4.  **Refresco de Sesión (`POST /api/auth/refresh`):**
    -   Cuando el Access Token expira, el cliente recibirá un error `401 Unauthorized`.
    -   En ese momento, el frontend puede hacer una petición a este endpoint **sin cuerpo**. La petición incluirá automáticamente la cookie `HttpOnly` que contiene el Refresh Token.
    -   Si el Refresh Token es válido, la API devolverá un **nuevo Access Token**, permitiendo al usuario continuar su sesión sin necesidad de volver a iniciarla.

### Seguridad de los Tokens

-   **Access Token:** Es de corta duración para minimizar el riesgo en caso de ser interceptado. Se almacena en la memoria del cliente (frontend).
-   **Refresh Token:** Es de larga duración y se almacena en una cookie `HttpOnly`, lo que impide que sea accedido por scripts maliciosos en el navegador (protección contra ataques XSS).

Si el token es válido, la API procesará la petición. Si el token falta, es inválido o ha expirado, la API devolverá un error `401 Unauthorized`.

## Estructura de Endpoints Principales

A continuación, se muestra una visión general de los recursos y endpoints principales. Para detalles completos, por favor, consulta la [Documentación Interactiva](#documentación-interactiva-swagger-ui).

-   **Autenticación (`/api/auth`)**
    -   `POST /login`: Autentica a un usuario y devuelve un token JWT.
    -   `POST /refresh`: Genera un nuevo Access Token a partir de un Refresh Token válido (enviado vía cookie). (Protegido por cookie)

-   **Usuarios (`/api/users`)**
    -   `POST /`: Crea un nuevo usuario (Registro). (Público)
    -   `GET /`: Obtiene una lista de todos los usuarios con paginación. (Protegido)
    -   `GET /:id`: Obtiene los detalles de un usuario específico. (Protegido)
    -   `PUT /:id`: Actualiza los datos de un usuario específico. (Protegido)
    -   `DELETE /:id`: Elimina un usuario específico. (Protegido)

-   **Salud del Sistema (`/api/health`)**
    -   `GET /`: Endpoint de prueba para verificar que la API está en funcionamiento. Devuelve `{"status":"OK"}`. (Público)