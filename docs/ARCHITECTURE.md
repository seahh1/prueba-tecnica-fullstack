# Documento de Arquitectura de la Aplicación

Este documento describe las decisiones de arquitectura y diseño tomadas para el desarrollo de la aplicación de gestión de usuarios. El objetivo principal ha sido crear una solución robusta, escalable y mantenible siguiendo las mejores prácticas de la industria.

## 1. Estructura General del Monorepo

Se optó por una estructura de monorepo para centralizar el código del frontend, backend e infraestructura en un solo repositorio Git. Esto facilita la gestión de versiones, la visibilidad del proyecto completo y la coordinación entre las diferentes partes de la aplicación.

La estructura raíz del proyecto es la siguiente:

-   **/backend**: Contiene la API RESTful construida con Node.js y Express.
-   **/frontend**: Contiene la aplicación de interfaz de usuario construida con React (Vite) y Material-UI.
-   **/infrastructure**: Contiene toda la configuración de Infraestructura como Código (IaC).
    -   **/terraform**: Define los recursos de AWS a través de Terraform.
    -   **docker-compose.yml**: Orquesta los servicios de la aplicación en el entorno de producción.
-   **/docs**: Contiene toda la documentación del proyecto, incluyendo este documento.

Esta separación clara permite a los equipos (o al desarrollador) trabajar en cada componente de forma independiente mientras se mantiene una visión unificada del sistema.

## 2. Arquitectura del Backend

El backend sigue un patrón de **arquitectura en capas (Layered Architecture)** para lograr una alta cohesión y un bajo acoplamiento entre los componentes. Esto significa que cada capa tiene una responsabilidad única y solo se comunica con las capas adyacentes.

-   **`routes/`**: Define los endpoints de la API (ej. `/api/users`). Su única responsabilidad es recibir las peticiones HTTP y pasarlas al controlador correspondiente. No contiene lógica de negocio.

-   **`controllers/`**: Actúa como intermediario. Recibe la petición (`req`) y la respuesta (`res`) de la ruta, extrae los datos necesarios (del `body`, `params`, `query`) y llama a la capa de servicio para ejecutar la acción. Su responsabilidad es orquestar el flujo de la petición, no ejecutar la lógica de negocio.

-   **`services/`**: Aquí reside la lógica de negocio principal. Los servicios interactúan con la capa de persistencia (modelo) para realizar operaciones CRUD y aplicar cualquier regla de negocio. Por ejemplo, `userService.js` contiene la lógica para crear un usuario o buscarlo por su ID.

-   **`models/`**: Define los esquemas de la base de datos usando Mongoose. Esta capa es la única que interactúa directamente con la colección de MongoDB. Incluye validaciones a nivel de base de datos para garantizar la integridad de los datos.

-   **`middleware/`**: Contiene funciones que se ejecutan en el ciclo de vida de la petición/respuesta de Express. Se utiliza para tareas transversales como la autenticación (`auth.js`), el manejo de errores (`errorHandler.js`), y la validación de entrada.

-   **`config/`**: Centraliza la configuración de la aplicación, como la conexión a la base de datos (`database.js`) y la configuración de Swagger (`swagger.js`).

Este diseño facilita las pruebas unitarias de cada capa de forma aislada y permite escalar o modificar una capa sin afectar significativamente a las demás.

## 3. Arquitectura del Frontend

El frontend está construido con React (usando Vite para un desarrollo y build rápidos) y sigue una arquitectura basada en componentes.

-   **`pages/`**: Componentes que representan una vista completa de la aplicación, como `UserManagementPage.jsx` o `LoginPage.jsx`. Estas páginas componen varios componentes más pequeños.

-   **`components/`**: Componentes reutilizables que forman los bloques de construcción de las páginas. Por ejemplo, `UserFormModal.jsx` es un componente que se puede usar tanto para crear como para editar usuarios.

-   **`layouts/`**: Componentes que definen la estructura visual principal de la aplicación, como `AppLayout.jsx`, que incluye la barra lateral de navegación y el área de contenido principal. Las páginas se renderizan dentro de este layout.

-   **Gestión de Estado (`store/`)**: Se utiliza la **Context API de React** para gestionar el estado global de la aplicación.
    -   **`AuthContext.jsx`**: Maneja el estado de autenticación (usuario, token, estado de carga) y las funciones de `login` y `logout`. Es el responsable de la persistencia del token en `localStorage`.
    -   **`UserContext.jsx`**: Centraliza toda la lógica relacionada con los datos de los usuarios: la lista de usuarios, la paginación, los filtros de búsqueda, y las funciones CRUD (`createUser`, `updateUser`, `deleteUser`). Esto evita que la lógica de negocio se disperse por los componentes de la UI y facilita su mantenimiento.

-   **Comunicación con la API (`services/`)**:
    -   **`api.js`**: Centraliza la configuración de **Axios**. Se crea una instancia única con la URL base de la API. Lo más importante es que implementa **interceptores** para:
        1.  **Request Interceptor**: Añade automáticamente el token JWT a la cabecera `Authorization` de cada petición saliente.
        2.  **Response Interceptor**: Maneja errores comunes de la API (como 401, 404, 500) de forma global, mostrando notificaciones al usuario con `react-toastify`.

## 4. Flujo de Despliegue (IaC con Terraform y Docker)

El despliegue está completamente automatizado utilizando Infraestructura como Código (IaC) para garantizar un proceso repetible, consistente y libre de errores manuales.

1.  **Terraform (`infrastructure/terraform/`)**:
    -   El desarrollador ejecuta `terraform apply` desde su máquina local.
    -   Terraform se comunica con AWS para provisionar los recursos definidos:
        -   Un **Rol IAM** con una política que permite a la EC2 leer secretos de AWS Secrets Manager.
        -   Una **Instancia EC2** (`t2.micro` para la capa gratuita) en la VPC por defecto.
        -   Un **Grupo de Seguridad** que permite tráfico en los puertos 22 (SSH) y 80 (HTTP).

2.  **Script `user_data` en EC2**:
    -   Al iniciar por primera vez, la instancia EC2 ejecuta automáticamente un script `user_data`. Este script es el "cerebro" del despliegue:
        -   Instala dependencias críticas: `git`, `docker`, `docker-compose`, `jq`.
        -   Clona la última versión del código desde el repositorio público de GitHub.
        -   Usa el AWS CLI para **obtener los secretos** de la aplicación desde **AWS Secrets Manager**.
        -   **Exporta estos secretos como variables de entorno** en el shell de la instancia.
        -   Ejecuta `docker compose up --build -d` desde la carpeta `infrastructure/`.

3.  **Docker Compose (`infrastructure/docker-compose.yml`)**:
    -   Docker Compose lee las variables de entorno que el `user_data` acaba de exportar.
    -   Orquesta el levantamiento de tres contenedores:
        -   **`db` (MongoDB)**: Inicia la base de datos, usando las credenciales del entorno.
        -   **`backend` (Node.js)**: Construye la imagen del backend y la inicia, inyectando las variables de entorno (como `MONGO_URI` y `JWT_SECRET`).
        -   **`frontend` (Nginx)**: Construye la aplicación React estática y la sirve a través de un servidor Nginx ligero.

Este flujo garantiza un despliegue "desde cero" completamente automatizado con un solo comando (`terraform apply`).

## 5. Gestión de Secretos

La gestión de secretos sigue las mejores prácticas de seguridad para evitar exponer credenciales en el código fuente.

-   **Entorno de Desarrollo Local**: No se utiliza. El foco está en la configuración de producción.
-   **Entorno de Producción (AWS)**:
    -   Todos los secretos (contraseñas de la base de datos, secretos de JWT, credenciales del usuario admin inicial) se almacenan de forma segura y cifrada en **AWS Secrets Manager**.
    -   La instancia EC2 recibe permisos para acceder a estos secretos a través de un **Rol IAM**, evitando el uso de claves de acceso estáticas.
    -   El script `user_data` obtiene los secretos en el momento del despliegue y los inyecta como **variables de entorno** en los contenedores de Docker. Los secretos nunca se escriben en archivos de texto plano en el disco del servidor (excepto de forma temporal durante el arranque, si fuera necesario, aunque el método actual los exporta al shell).

Este enfoque desacopla los secretos de la base de código y la infraestructura, proporcionando una solución segura y escalable.