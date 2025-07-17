# Guía de Despliegue en AWS con Terraform

Este documento proporciona una guía paso a paso para desplegar la aplicación fullstack en una instancia EC2 de AWS utilizando Terraform y Docker.

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
5.  Haz clic en "Next".
6.  Asigna un **Nombre al secreto (Secret name)**. El código Terraform está configurado para usar `app/user-management/prod`. Si usas un nombre diferente, deberás actualizarlo en el archivo `infrastructure/scripts/setup.sh`.
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

## 4. Proceso de Despliegue con Terraform

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

## 5. Verificación del Despliegue

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

## 6. Destrucción de los Recursos

**¡IMPORTANTE!** Cuando hayas terminado con la prueba o ya no necesites la infraestructura, destrúyela para evitar incurrir en costos.

1.  Desde la carpeta `infrastructure/terraform/`, ejecuta:
    ```bash
    terraform destroy
    ```
2.  Terraform te mostrará un plan de todos los recursos que serán eliminados.
3.  Escribe `yes` para confirmar. Terraform se encargará de eliminar la instancia EC2, el Security Group y todos los recursos asociados.