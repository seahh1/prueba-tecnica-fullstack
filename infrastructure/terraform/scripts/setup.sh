#!/bin/bash
set -euxo pipefail 

echo ">>> Actualizando e instalando dependencias..."
apt-get update -y
apt-get install -y git jq unzip

echo ">>> Instalando Docker y Docker Compose..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker ubuntu

echo ">>> Instalando AWS CLI v2..."
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install
rm -rf awscliv2.zip aws

APP_DIR="/home/ubuntu/app"
REPO_URL="https://github.com/seahh1/prueba-tecnica-fullstack.git" 

echo ">>> Clonando el repositorio..."
sudo -u ubuntu git clone "$REPO_URL" "$APP_DIR"

SECRET_ID="app/user-management/prod"
AWS_REGION="us-east-1" 

echo ">>> Obteniendo secretos de AWS Secrets Manager..."
SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id "$SECRET_ID" --region "$AWS_REGION" --query SecretString --output text)

if [ -z "$SECRET_JSON" ]; then
    echo "Error: No se pudieron obtener los secretos de AWS." >&2
    exit 1
fi

echo ">>> Creando archivo de entorno temporal para Docker Compose..."
ENV_FILE="$APP_DIR/infrastructure/.env.docker.temp"

echo "$SECRET_JSON" | jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]' > "$ENV_FILE"

if [ ! -s "$ENV_FILE" ]; then
    echo "Error: El archivo .env.docker.temp está vacío o no se pudo crear." >&2
    exit 1
fi
echo "Archivo de entorno generado en $ENV_FILE"

echo ">>> Preparando el entorno y levantando la aplicación..."
cd "$APP_DIR"

sudo docker compose --env-file "$ENV_FILE" -f infrastructure/docker-compose.yml up --build -d

echo ">>> Esperando 30 segundos para que la base de datos se inicie..."
sleep 30

echo ">>> Ejecutando script de seeding..."

sudo docker compose --env-file "$ENV_FILE" -f infrastructure/docker-compose.yml exec -T backend npm run seed || true

echo ">>> ¡Despliegue completado!"