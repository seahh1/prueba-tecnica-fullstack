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

## 4. Arquitectura de Despliegue y CI/CD

El ciclo de vida del despliegue se gestiona a través de dos componentes principales que trabajan en conjunto: **Terraform** para la provisión de la infraestructura y **GitHub Actions** para la entrega continua del código de la aplicación.

### a. Provisión de Infraestructura con Terraform

La infraestructura se define como código utilizando Terraform para garantizar un entorno repetible, consistente y versionado en AWS. Este proceso se ejecuta **una sola vez** para crear el entorno.

1.  **Definición de Recursos (`infrastructure/terraform/`)**:
    -   **Recursos de Red y Seguridad**: Se utiliza la VPC por defecto de AWS y se crea un `aws_security_group` específico que permite el tráfico entrante en los puertos 22 (SSH) y 80 (HTTP).
    -   **Recursos de Cómputo**: Se provisiona una instancia `aws_instance` de tipo `t2.micro` (dentro de la capa gratuita) con una AMI de Ubuntu Server 22.04 LTS.
    -   **Permisos IAM**: Se crea un `aws_iam_role` con una política de confianza OIDC para GitHub Actions y un `aws_iam_instance_profile` para que la EC2 pueda acceder a AWS Secrets Manager.

2.  **Automatización de Arranque (`user_data`)**:
    -   La instancia EC2 está configurada con un script `user_data` que se ejecuta en el primer arranque. Este script es responsable de la configuración inicial del servidor:
        -   Instalación de dependencias críticas como `git`, `Docker` y `Docker Compose`.
        -   Clonación del repositorio de la aplicación desde GitHub.
        -   Obtención de secretos desde **AWS Secrets Manager** y creación de un archivo de entorno (`.env`) temporal.
        -   Ejecución inicial de `docker compose up --build -d` para levantar la aplicación.
        -   Ejecución del script de "seeding" para crear el usuario administrador inicial.

### b. Entrega Continua con GitHub Actions

Una vez que la infraestructura está provisionada, las actualizaciones del código se despliegan automáticamente mediante un pipeline de CI/CD.

1.  **Activador (`.github/workflows/deploy.yml`)**:
    -   El workflow de GitHub Actions se activa automáticamente con cada `push` a la rama `main`.

2.  **Flujo de Despliegue**:
    -   **Autenticación Segura**: El pipeline se autentica con AWS utilizando OIDC y asume el rol IAM previamente creado, obteniendo credenciales temporales sin necesidad de almacenar secretos de AWS en GitHub.
    -   **Conexión a EC2**: Se establece una conexión SSH segura con la instancia EC2 utilizando una clave privada almacenada como un secreto en GitHub.
    -   **Actualización y Re-despliegue**: El script del workflow ejecuta los siguientes comandos en la instancia:
        1.  `git pull` para obtener la versión más reciente del código.
        2.  Refresca los secretos desde AWS Secrets Manager para crear el archivo de entorno.
        3.  Ejecuta `sudo docker compose up --build -d`. Docker reconstruye inteligentemente solo las imágenes cuyos archivos fuente han cambiado y reinicia los servicios necesarios.
        4.  `sudo docker image prune -af` para limpiar imágenes antiguas y optimizar el espacio en disco.

Este flujo desacopla la gestión de la infraestructura (Terraform) de la gestión del código de la aplicación (GitHub Actions), permitiendo despliegues rápidos y seguros para cada cambio.

## 5. Gestión de Secretos

La gestión de secretos sigue las mejores prácticas de seguridad para evitar exponer credenciales en el código fuente.

-   **Entorno de Desarrollo Local**: No se utiliza. El foco está en la configuración de producción.
-   **Entorno de Producción (AWS)**:
    -   Todos los secretos (contraseñas de la base de datos, secretos de JWT, credenciales del usuario admin inicial) se almacenan de forma segura y cifrada en **AWS Secrets Manager**.
    -   La instancia EC2 recibe permisos para acceder a estos secretos a través de un **Rol IAM**, evitando el uso de claves de acceso estáticas.
    -   El script `user_data` obtiene los secretos en el momento del despliegue y los inyecta como **variables de entorno** en los contenedores de Docker. Los secretos nunca se escriben en archivos de texto plano en el disco del servidor (excepto de forma temporal durante el arranque, si fuera necesario, aunque el método actual los exporta al shell).

Este enfoque desacopla los secretos de la base de código y la infraestructura, proporcionando una solución segura y escalable.