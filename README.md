# 🚀 User Management Fullstack Application

Este proyecto es una aplicación fullstack diseñada para la gestión eficiente de usuarios. Proporciona una API RESTful robusta, construida con Node.js y Express, y una interfaz de usuario interactiva y responsiva desarrollada en React. La infraestructura para el despliegue se define como código utilizando Terraform para AWS, y la orquestación local se maneja con Docker Compose. Incluye una suite completa de pruebas unitarias y de integración, así como documentación exhaustiva para desarrolladores.

**Objetivo Principal:** Demostrar habilidades avanzadas en desarrollo fullstack, DevOps, arquitectura de software y mejores prácticas de ingeniería.

## ✨ Características Principales

### Backend (API RESTful)
- **Gestión Completa de Usuarios (CRUD):** Creación, lectura (individual y listado con paginación), actualización y eliminación de usuarios.
- **Autenticación y Autorización:** Implementación de JWT (JSON Web Tokens) para asegurar los endpoints de la API.
- **Validación de Datos Robusta:** Asegura la integridad de los datos de entrada.
- **Manejo de Errores Estructurado:** Respuestas consistentes para errores en la API.
- **Seguridad:** Implementación de middlewares como CORS, Helmet y Rate Limiting para proteger la API.
- **Documentación de API:** Generación automática de documentación OpenAPI (Swagger UI) para fácil referencia y prueba de los endpoints.
- **Logging:** Configuración de un sistema de logging básico para monitoreo en desarrollo.

### Frontend (Interfaz de Usuario)
- **Listado de Usuarios:** Visualización de usuarios con paginación, búsqueda y filtrado.
- **Formularios Dinámicos:** Creación y edición de usuarios mediante modales interactivos.
- **Confirmación de Eliminación:** Prevención de eliminaciones accidentales.
- **Notificaciones:** Retroalimentación visual (éxito/error) para las operaciones de usuario.
- **Diseño Responsivo:** Interfaz adaptativa a diferentes tamaños de pantalla (escritorio y móvil).
- **Gestión de Estado:** Uso de Context API para una gestión de estado eficiente.
- **Peticiones HTTP:** Integración con Axios y manejo de interceptores para tokens y errores.

### Infraestructura como Código (IaC)
- **Dockerización:** Contenedores optimizados para el backend (Node.js) y el frontend (React/Nginx) usando Dockerfiles multi-etapa.
- **Orquestación Local:** Configuración con `docker-compose.yml` para levantar todos los servicios (backend, frontend, MongoDB) con un solo comando.
- **Despliegue en AWS con Terraform (Opción CUMPLIDA):** Definición declarativa de la infraestructura en la nube, incluyendo:
    -   Red virtual (VPC, Subnet, Internet Gateway).
    -   Grupo de seguridad (Security Group) para control de tráfico.
    -   Instancia EC2 para alojar la aplicación (backend y frontend en contenedores).
    -   Configuración de `user_data` para automatizar la instalación de Docker y el despliegue de la aplicación al iniciar la EC2.
    -   **Gestión de Secretos Segura:** Integración con AWS Secrets Manager para inyectar variables de entorno en producción.

## 🏗️ Arquitectura y Estructura del Proyecto

El proyecto está organizado como un **monorepo**, dividiendo la aplicación en directorios lógicos para el backend, frontend, infraestructura y documentación.

<project-root>/
├── backend/ # Contiene la API RESTful (Node.js/Express)
│ ├── src/ # Código fuente del backend
│ │ ├── config/ # Configuración de DB, etc.
│ │ ├── controllers/ # Lógica de manejo de peticiones
│ │ ├── middleware/ # Autenticación, manejo de errores, etc.
│ │ ├── models/ # Esquemas de Mongoose
│ │ ├── routes/ # Definición de rutas API
│ │ ├── services/ # Lógica de negocio y interacción con DB
│ │ └── utils/ # Utilidades (e.g., asyncHandler)
│ ├── tests/ # Pruebas unitarias y de integración
│ │ ├── unit/
│ │ └── integration/
│ ├── jest.config.js # Configuración de Jest
│ ├── package.json # Dependencias y scripts del backend
│ └── Dockerfile # Definición del contenedor Docker del backend
├── frontend/ # Contiene la interfaz de usuario (React/Vite)
│ ├── src/ # Código fuente del frontend
│ │ ├── components/ # Componentes React reutilizables (ej. modales, botones)
│ │ ├── layouts/ # Estructura general de la UI (ej. barra lateral)
│ │ ├── pages/ # Componentes de página completos
│ │ ├── services/ # Clientes API (Axios), con interceptores
│ │ ├── store/ # Gestión de estado (Context API)
│ │ └── utils/ # Utilidades (e.g., tema de MUI)
│ ├── public/ # Archivos estáticos
│ ├── tests/ # (Opcional) Pruebas de componentes frontend
│ ├── package.json # Dependencias y scripts del frontend
│ └── Dockerfile # Definición del contenedor Docker del frontend
│ └── nginx.conf # Configuración de Nginx para servir el frontend
├── infrastructure/ # Definiciones de infraestructura como código (IaC)
│ ├── terraform/ # Archivos de Terraform para AWS
│ │ ├── main.tf # Recursos principales de AWS
│ │ ├── variables.tf # Variables de configuración
│ │ └── outputs.tf # Salidas del despliegue (ej. IP de EC2)
│ └── docker-compose.yml # Orquestación de contenedores Docker
├── docs/ # Documentación adicional del proyecto
│ ├── API.md # Detalles de la API (puedes referenciar a Swagger)
│ ├── DEPLOYMENT.md # Guía de despliegue en AWS
│ └── ARCHITECTURE.md # Decisiones de diseño arquitectónico
├── .github/ # Configuración de GitHub (workflows CI/CD si se implementan)
│ └── workflows/
│ └── ci-cd.yml
├── .gitignore # Reglas para ignorar archivos en Git
├── README.md # Este archivo
├── AI_PROMPTS.md # Registro de prompts de IA
└── AI_WORKFLOW.md # Descripción del flujo de trabajo con IA


```markdown
## 🛠️ Tecnologías Utilizadas

-   **Backend:** Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT), Jest, Supertest, Swagger/OpenAPI.
-   **Frontend:** React.js, Vite, Material-UI (MUI), Axios, React Router DOM, React Toastify.
-   **DevOps/IaC:** Docker, Docker Compose, Terraform (para AWS).
-   **Control de Versiones:** Git, GitHub.
-   **Otros:** ESLint, Prettier (para calidad de código).

## 🚀 Despliegue de la Aplicación en AWS

Esta aplicación está diseñada para ser desplegada en AWS usando un flujo de Infraestructura como Código (IaC) con Terraform y Docker. No se recomienda un flujo de ejecución local con `docker-compose` ya que la configuración está optimizada para la inyección de secretos desde AWS Secrets Manager.

**Para una guía de despliegue detallada paso a paso, por favor consulta [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).**

A continuación, un resumen rápido del proceso:

1.  **Requisitos Previos:**
    *   Tener una cuenta de AWS, AWS CLI, Terraform CLI y un par de claves SSH configurados.

2.  **Configurar Secretos:**
    *   Almacenar todas las variables de entorno necesarias (credenciales de DB, secretos de JWT, usuario admin) en **AWS Secrets Manager**.

3.  **Configurar Variables de Terraform:**
    *   Crear un archivo `infrastructure/terraform/terraform.tfvars` (que no está en Git) para definir tu región de AWS, el ID de la AMI y las rutas a tus claves SSH.

4.  **Ejecutar Terraform:**
    *   Desde la carpeta `infrastructure/terraform`, ejecuta los siguientes comandos:
    ```bash
    # Inicializa Terraform y descarga el proveedor de AWS
    terraform init

    # Revisa el plan de ejecución (opcional pero recomendado)
    terraform plan

    # Aplica los cambios y provisiona la infraestructura
    terraform apply
    ```

5.  **Verificación:**
    *   Una vez que `terraform apply` finalice, te proporcionará la IP pública de la instancia EC2.
    *   Accede al frontend en `http://<IP_PÚBLICA_DE_LA_EC2>`.
    *   Inicia sesión con las credenciales del usuario administrador que definiste en AWS Secrets Manager.
## 🧪 Pruebas

El backend cuenta con una suite comprehensiva de pruebas unitarias y de integración, asegurando la robustez y el correcto funcionamiento de la API.

Para ejecutar las pruebas y generar un reporte de cobertura:

1.  Navega a la carpeta del backend:
    ```bash
    cd backend
    ```
2.  Ejecuta el comando de pruebas con cobertura:
    ```bash
    npm run test:coverage
    ```
3.  Podrás ver el resumen de la cobertura directamente en la terminal. Para un reporte HTML detallado, abre `backend/coverage/lcov-report/index.html` en tu navegador.

**Cobertura Actual del Backend:**

--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           | 87.71   | 68.18    | 90      |88.23    |
src/app.js          | 100     | 100      | 100     | 100     |
src/config          |         |          |         |         |
database.js         | 100     | 100      | 100     | 100     |
src/controllers     | 95.12   | 92.85    | 100     | 95.12   |
authController.js   | 85.71   | 50       | 100     | 85.71   | 18
userController.js   | 100     | 100      | 100     | 100     |
src/middleware      | 75.43   | 66.66    | 66.66   | 75.43   |
auth.js             | 75.43   | 66.66    | 66.66   | 75.43   | 24,31,43
errorHandler.js     | 52.94   | 50       | 100     | 52.94   | 22-26
src/models          | 91.66   | 50       | 100     | 91.66   |
userModel.js        | 91.66   | 50       | 100     | 91.66   | 21
src/routes          | 94.73   | 83.33    | 100     | 94.73   |
authRoutes.js       | 100     | 100      | 100     | 100     |
health.routes.js    | 100     | 100      | 100     | 100     |
userRoutes.js       | 92.3    | 75       | 100     | 92.3    | 28
src/services        | 100     | 100      | 100     | 100     |
authService.js      | 100     | 100      | 100     | 100     |
userService.js      | 100     | 100      | 100     | 100     |
src/utils           | 100     | 100      | 100     | 100     |
asyncHandler.js     | 100     | 100      | 100     | 100     |
--------------------|---------|----------|---------|---------|-------------------

## 📚 Documentación Adicional

-   **API Endpoints:** Una vez desplegada la aplicación, consulta la documentación interactiva en `http://<IP_PÚBLICA_DE_EC2>/api-docs`.
-   **Diseño de Arquitectura:** Más detalles sobre las decisiones de diseño y patrones utilizados en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
-   **Guía de Despliegue Detallada:** Información adicional sobre el proceso de despliegue en [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
## 📞 Contacto

Si tienes alguna pregunta o necesitas más información, no dudes en contactarme:

-   **Adrian Alfonso Sanchez Jimenez**
-   **adriandeveloperj@gmail.com**
-   [Adrian Alfonso Sanchez Jimenez](www.linkedin.com/in/adrian-sanchez-webdev)