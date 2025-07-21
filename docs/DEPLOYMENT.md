# Guía de Despliegue (Terraform + GitHub Actions)

Este documento proporciona una guía paso a paso para el ciclo de vida completo del despliegue: la **creación inicial de la infraestructura** con Terraform y las **actualizaciones continuas del código** a través de un pipeline de CI/CD con GitHub Actions.

## 1. Pre-requisitos

Antes de comenzar, asegúrate de tener lo siguiente configurado en tu máquina local:

1.  **Cuenta de AWS**: Una cuenta de AWS activa, preferiblemente dentro de la [capa gratuita de AWS](https://aws.amazon.com/free/) para evitar costos inesperados.

2.  **AWS CLI v2**: La Interfaz de Línea de Comandos de AWS instalada y configurada.
    -   [Instrucciones de instalación](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
    -   Configura tus credenciales ejecutando `aws configure` y proporcionando tu `Access Key ID` y `Secret Access Key`.

3.  **Terraform CLI**: La Interfaz de Línea de Comandos de Terraform instalada.
    -   [Instrucciones de descarga](https://developer.hashicorp.com/terraform/downloads)

4.  **Par de Claves SSH**: Un par de claves SSH (pública y privada) para acceder a la instancia EC2.
    -   Si no tienes una, puedes generarla con el comando: `ssh-keygen -t rsa -b 4096 -f ~/.ssh/my_app_key`.

5.  **Repositorio Git**: El código fuente del proyecto debe estar en un repositorio público de GitHub para que la instancia EC2 pueda clonarlo.

## 2. Configuración de Secretos en AWS Secrets Manager

La aplicación gestiona todas las variables sensibles y secretos a través de AWS Secrets Manager para máxima seguridad.

1.  Inicia sesión en la **consola de AWS** y navega al servicio **Secrets Manager**.
2.  Haz clic en **"Store a new secret"**.
3.  Selecciona **"Other type of secret"**.
4.  En la sección **"Key/value pairs"**, añade los siguientes secretos:
    -   `MONGO_USER`: (ej. `admin`)
    -   `MONGO_PASSWORD`: (una contraseña fuerte y segura)
    -   `MONGO_DB`: (ej. `user_management_prod_db`)
    -   `JWT_SECRET`: (una cadena de texto larga, aleatoria y segura)
    -   `ADMIN_NAME`: (ej. `Admin User`)
    -   `ADMIN_EMAIL`: (ej. `admin@example.com`)
    -   `ADMIN_PASSWORD`: (la contraseña para el usuario administrador inicial)
    -   `JWT_EXPIRE`: (ej. `15m` o `1d`)
    -   `REFRESH_TOKEN_SECRET`: (una segunda cadena larga y aleatoria, diferente a JWT_SECRET)
5.  Haz clic en "Next".
6.  Asigna un **Nombre al secreto (Secret name)**. El código Terraform está configurado para usar `app/user-management/prod`. Si usas un nombre diferente, deberás actualizarlo en el archivo `infrastructure/terraform/main.tf` (en   el  
    archivo `infrastructure/terraform/scripts/setup.sh`) y en el workflow de GitHub Actions (`.github/workflows/deploy.yml`).
7.  Completa el proceso de creación del secreto.

## 3. Configuración de Variables Locales de Terraform

Terraform necesita saber dónde encontrar tu clave SSH y en qué región desplegar.

1.  Navega a la carpeta `infrastructure/terraform/`.
2.  Crea un archivo llamado `terraform.tfvars`. **Este archivo no es subido a Git.**
3.  Añade el siguiente contenido, reemplazando los valores con tu configuración específica:

    ```hcl
    # Región de AWS donde desplegarás los recursos.
    aws_region = "us-east-1"

    # ID de una AMI de Ubuntu 22.04 LTS (HVM) Free Tier Eligible para tu región.
    # Búscala en la consola de EC2 -> AMIs.
    # Ejemplo para us-east-1: "ami-053b0d53c279acc91" (Verifica la más reciente)
    ami_id = "ami-053b0d53c279acc91"

    # Ruta a tu clave pública SSH local.
    # Ejemplo para Windows: "C:/Users/TuUsuario/.ssh/my_app_key.pub"
    public_key_path = "C:/Users/TuUsuario/.ssh/my_app_key.pub"

    # Ruta a tu clave privada SSH local.
    private_key_path = "C:/Users/TuUsuario/.ssh/my_app_key"
    ```

## 4. Configuración para GitHub Actions (CI/CD)

Para habilitar el despliegue automático de actualizaciones de código, debes configurar la confianza entre tu repositorio de GitHub y tu cuenta de AWS, además de añadir los secretos necesarios.

### a. Configurar Confianza OIDC en AWS IAM

1.  **Añadir Proveedor de Identidad:** En la consola de AWS IAM, añade un nuevo proveedor de identidad OpenID Connect (OIDC) con la URL `https://token.actions.githubusercontent.com` y la `Audience` `sts.amazonaws.com`.
2.  **Crear Rol IAM:** Crea un nuevo rol IAM para "Web identity", seleccionando el proveedor OIDC que acabas de crear. Configura la confianza para tu repositorio específico (`tu_usuario/tu_repo`) y la rama `main`. No se necesitan políticas de AWS para este pipeline.
3.  **Copiar el ARN del Rol:** Guarda el ARN del rol creado (ej. `arn:aws:iam::123456789012:role/GitHubActions-EC2-DeployRole`).

### b. Añadir Secretos al Repositorio de GitHub

1.  En tu repositorio de GitHub, ve a **Settings > Secrets and variables > Actions**.
2.  Añade los siguientes **Repository secrets**:
    -   `AWS_ROLE_TO_ASSUME`: Pega el ARN del rol IAM del paso anterior.
    -   `EC2_HOST`: La IP pública de la instancia EC2 que Terraform creará. (Deberás añadir esto **después** del primer `terraform apply`).
    -   `EC2_USER`: `ubuntu`.
    -   `EC2_SSH_PRIVATE_KEY`: El contenido completo de tu archivo de clave SSH privada (el que no termina en `.pub`).

## 5. Despliegue Inicial de la Infraestructura

Este proceso se realiza **una sola vez** para crear la infraestructura. Las futuras actualizaciones de código se desplegarán automáticamente a través de GitHub Actions.

Ejecuta los siguientes comandos desde la carpeta `infrastructure/terraform/`.

1.  **Inicializar Terraform**:
    Descarga los plugins necesarios del proveedor de AWS.
    ```bash
    terraform init
    ```

2.  **Planificar el Despliegue**:
    Revisa los recursos que Terraform creará en tu cuenta de AWS. Este comando es seguro y no realiza cambios.
    ```bash
    terraform plan
    ```
    Revisa la salida cuidadosamente para asegurarte de que solo se crearán los recursos esperados (EC2, Security Group, IAM Role, etc.).

3.  **Aplicar el Despliegue**:
    Crea los recursos en AWS. Se te pedirá una confirmación final.
    ```bash
    terraform apply
    ```
    Escribe `yes` cuando se te solicite. El proceso puede tardar varios minutos mientras la instancia EC2 se inicia y ejecuta el script `user_data` para instalar Docker y desplegar la aplicación.

## 6. Verificación del Despliegue

Una vez que `terraform apply` finalice, mostrará los `outputs` definidos, incluyendo la IP pública de la instancia.

1.  **Acceder al Frontend**:
    -   Abre tu navegador y visita `http://<IP_PÚBLICA_DE_LA_EC2>`.
    -   Deberías ser redirigido a la página de login.

2.  **Primer Inicio de Sesión**:
    -   El script de despliegue crea automáticamente un usuario administrador con las credenciales que definiste en **AWS Secrets Manager** (`ADMIN_EMAIL` y `ADMIN_PASSWORD`).
    -   Usa esas credenciales para iniciar sesión.

3.  **Verificar la API**:
    -   Visita `http://<IP_PÚBLICA_DE_LA_EC2>/api/health` para ver el estado del backend. Deberías recibir `{"status":"OK"}`.
    -   Visita `http://<IP_PÚBLICA_DE_LA_EC2>/api-docs` para ver la documentación de Swagger.

4.  **Acceso por SSH (para depuración)**:
    -   Usa el comando SSH proporcionado en la salida de Terraform para conectarte a la instancia si necesitas depurar algo:
        ```bash
        ssh -i "ruta/a/tu/clave/privada" ubuntu@<IP_PÚBLICA_DE_LA_EC2>
        ```
    -   Una vez dentro, puedes usar comandos de Docker como `docker ps` para ver los contenedores en ejecución o `docker logs <nombre_contenedor>` para ver sus logs.

## 7. Actualizaciones Continuas del Código (vía GitHub Actions)

Una vez que la infraestructura inicial está desplegada y los secretos de GitHub Actions están configurados, el proceso de actualización es automático.

1.  Realiza los cambios deseados en el código fuente (backend o frontend).
2.  Haz `commit` y `push` de tus cambios a la rama `main` de tu repositorio de GitHub.
    ```bash
    git add .
    git commit -m "feat: add new feature"
    git push origin main
    ```
3.  El pipeline de GitHub Actions se activará automáticamente. Puedes monitorear su progreso en la pestaña **"Actions"** de tu repositorio.
4.  El workflow se encargará de:
    -   Conectarse a tu instancia EC2.
    -   Actualizar el código con `git pull`.
    -   Refrescar los secretos desde AWS Secrets Manager.
    -   Reconstruir las imágenes de Docker que hayan cambiado y reiniciar los servicios.

## 8. Destrucción de los Recursos

**¡IMPORTANTE!** Para evitar costos inesperados en AWS, asegúrate de destruir todos los recursos una vez que hayas terminado con la prueba.

1.  Desde la carpeta `infrastructure/terraform/`, ejecuta:
    ```bash
    terraform destroy
    ```
2.  Terraform te mostrará un plan de todos los recursos que serán eliminados.
3.  Escribe `yes` para confirmar. Terraform se encargará de eliminar la instancia EC2, el Security Group y todos los recursos asociados.