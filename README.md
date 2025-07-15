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
│ └── docker-compose.yml # Orquestación de contenedores Docker local
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

## 🚀 Instalación y Ejecución Local

Para levantar la aplicación completa en tu máquina local usando Docker Compose:

1.  **Requisitos Previos:**
    *   Docker Desktop instalado y en ejecución (asegúrate de que el servicio de Docker esté activo).
    *   Git instalado.
    *   Node.js (v18+) y npm (o yarn) si deseas ejecutar los servicios individualmente o instalar dependencias fuera de Docker.

2.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/seahh1/prueba-tecnica-fullstack.git
    cd prueba-tecnica-fullstack
    ```

3.  **Configuración de Variables de Entorno:**
    *   Crea un archivo `.env` en la raíz de la carpeta `backend` (`backend/.env`) con el siguiente contenido:
        ```env
        PORT=5000
        MONGO_URI=mongodb://db:27017/user_management_db
        JWT_SECRET=TU_SECRETO_PARA_JWT_QUE_SEA_LARGO_Y_ALEATORIO
        JWT_EXPIRE=1d
        ```
    *   Crea un archivo `.env` en la raíz de la carpeta `frontend` (`frontend/.env`) con el siguiente contenido:
        ```env
        VITE_API_BASE_URL=http://localhost:5000/api
        ```
    *   **Importante:** Nunca subas estos archivos `.env` al repositorio Git. Ya están en el `.gitignore`.

4.  **Levantar la Aplicación con Docker Compose:**
    *   Desde la raíz del proyecto (donde están las carpetas `backend`, `frontend`, `infrastructure`):
    ```bash
    docker compose -f infrastructure/docker-compose.yml up --build -d
    ```
    *   Este comando construirá las imágenes Docker para el backend y el frontend, descargará la imagen de MongoDB y levantará todos los servicios. `--build` asegura que se reconstruyan las imágenes si hay cambios. `-d` ejecuta los contenedores en segundo plano.

5.  **Acceso a la Aplicación:**
    *   **Frontend:** Abre tu navegador y ve a `http://localhost:3000`
    *   **Backend API:** `http://localhost:5000/api/health` (debería mostrar `{"status":"OK"}`)
    *   **Documentación Swagger UI:** `http://localhost:5000/api-docs`

6.  **Detener y Eliminar Contenedores:**
    *   Para detener los servicios:
        ```bash
        docker compose -f infrastructure/docker-compose.yml stop
        ```
    *   Para detener y eliminar los contenedores y sus redes (manteniendo volúmenes para persistir datos):
        ```bash
        docker compose -f infrastructure/docker-compose.yml down
        ```
    *   Para eliminar también los volúmenes (borrar los datos de la DB):
        ```bash
        docker compose -f infrastructure/docker-compose.yml down --volumes
        ```
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

**Cobertura Actual del Backend:** (Aquí pegarías la tabla de Jest que obtuviste, la del 87.71%)

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


**7. Despliegue en AWS con Terraform**

```markdown
## ☁️ Despliegue en AWS con Terraform

La infraestructura de la aplicación puede ser provisionada en AWS utilizando Terraform, siguiendo un enfoque de Infraestructura como Código (IaC).

**Arquitectura de Despliegue:**
-   Una Virtual Private Cloud (VPC) dedicada con una Subnet pública.
-   Un Internet Gateway para permitir la comunicación con Internet.
-   Un Security Group (firewall) configurado para permitir el tráfico HTTP (puerto 80), HTTPS (si aplica), SSH (puerto 22) y el puerto de la API (5000).
-   Una instancia EC2 (Ubuntu 22.04 LTS, t2.medium) que actuará como host para los contenedores Docker.
-   Docker y Docker Compose se instalan automáticamente en la EC2 mediante `user_data` al iniciar la instancia.
-   La aplicación completa (backend, frontend y MongoDB) se levanta en contenedores Docker en la EC2.

**Requisitos Previos para el Despliegue:**
1.  Tener una cuenta de AWS con credenciales configuradas (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) en tu máquina local. Se recomienda configurar el AWS CLI y que el usuario IAM tenga los permisos necesarios (ej. `AdministratorAccess` para esta prueba, o permisos específicos para EC2, VPC, Security Groups).
2.  Tener Terraform CLI instalado.
3.  Un par de claves SSH para EC2. Asegúrate de tener el archivo `.pem` en un lugar seguro y la clave pública (`.pub`) referenciada correctamente en `infrastructure/terraform/main.tf` (`aws_key_pair`).

**Pasos para el Despliegue:**

1.  **Navega a la carpeta de Terraform:**
    ```bash
    cd infrastructure/terraform
    ```

2.  **Inicializa Terraform:**
    ```bash
    terraform init
    ```
    *   Esto descargará los plugins necesarios para AWS.

3.  **Planifica el Despliegue:**
    ```bash
    terraform plan
    ```
    *   Este comando te mostrará un resumen de los recursos que Terraform creará, modificará o destruirá. Revisa cuidadosamente esta salida.

4.  **Aplica el Despliegue:**
    ```bash
    terraform apply --auto-approve
    ```
    *   Este comando provisionará la infraestructura en tu cuenta de AWS. `auto-approve` confirma la operación sin pedirte confirmación manual (úsalo con precaución en producción). Este proceso puede tardar unos minutos.

5.  **Acceso a la Aplicación Desplegada:**
    *   Una vez que `terraform apply` finalice, mostrará las salidas configuradas en `outputs.tf`. Busca `ec2_public_ip` y `ec2_public_dns`.
    *   Accede al **Frontend** a través de: `http://<ec2_public_ip_o_dns>:3000` (el puerto 3000 es el que mapeamos externamente).
    *   Accede a la **Documentación Swagger UI** a través de: `http://<ec2_public_ip_o_dns>:5000/api-docs` (el puerto 5000 es el del backend).

6.  **Destruir la Infraestructura (Limpieza):**
    *   Para evitar cargos innecesarios en AWS, asegúrate de destruir todos los recursos una vez que hayas terminado con la prueba.
    *   Desde la carpeta `infrastructure/terraform`:
        ```bash
        terraform destroy --auto-approve
        ```
## 📚 Documentación Adicional

-   **API Endpoints:** Consulta la documentación interactiva de la API en [http://localhost:5000/api-docs](http://localhost:5000/api-docs) (local) o en `http://<IP_PÚBLICA_DE_EC2>:5000/api-docs` (desplegado).
-   **Diseño de Arquitectura:** Más detalles sobre las decisiones de diseño y patrones utilizados en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
-   **Guía de Despliegue Detallada:** Información adicional sobre el proceso de despliegue en [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
## 📞 Contacto

Si tienes alguna pregunta o necesitas más información, no dudes en contactarme:

-   **Adrian Alfonso Sanchez Jimenez**
-   **adriandeveloperj@gmail.com**
-   [Adrian Alfonso Sanchez Jimenez](www.linkedin.com/in/adrian-sanchez-webdev)