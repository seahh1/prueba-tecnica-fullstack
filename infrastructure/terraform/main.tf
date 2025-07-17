provider "aws" {
  region = var.aws_region
}

<<<<<<< HEAD
data "aws_key_pair" "deployer_key" {
  key_name = var.key_name
=======
# Data block para referenciar una clave SSH que ya existe en tu cuenta de AWS.
resource "aws_key_pair" "deployer_key" {
  key_name   = var.key_name
  public_key = file(var.public_key_path)
>>>>>>> 70862fb (despliegue para producción usando AWS Secrets Manager y env vars)
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default_public_list" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
  filter {
    name   = "map-public-ip-on-launch"
    values = ["true"]
  }
}

data "aws_subnet" "default_public" {
  id = tolist(data.aws_subnets.default_public_list.ids)[0]
}

data "aws_internet_gateway" "default" {
  filter {
    name   = "attachment.vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_route_table" "main" {
  vpc_id = data.aws_vpc.default.id
  filter {
    name   = "association.main"
    values = ["true"]
  }
}

resource "random_id" "suffix" {
  byte_length = 8
}
resource "aws_security_group" "app_security_group" {
  name        = "app-security-group-${random_id.suffix.hex}"
  description = "Security group for the application EC2 instance, allowing SSH and HTTP"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "Allow SSH from anywhere"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "app-security-group"
  }
}

<<<<<<< HEAD
=======
resource "aws_iam_policy" "secrets_manager_read_policy" {
  name        = "SecretsManagerReadAccessForApp-${random_id.suffix.hex}"
  description = "Permite leer el secreto de la aplicación desde Secrets Manager"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "secretsmanager:GetSecretValue",
        Resource = data.aws_secretsmanager_secret.app_secrets.arn
      }
    ]
  })
}

resource "aws_iam_role" "ec2_role" {
  name = "ec2-app-role-${random_id.suffix.hex}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = { Service = "ec2.amazonaws.com" },
        Action    = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_secrets_policy" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.secrets_manager_read_policy.arn
}

resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = "ec2-app-instance-profile-${random_id.suffix.hex}"
  role = aws_iam_role.ec2_role.name
}

data "aws_secretsmanager_secret" "app_secrets" {
  name = "app/user-management/prod"
}

# --- Instancia EC2 de la Aplicación ---
>>>>>>> 70862fb (despliegue para producción usando AWS Secrets Manager y env vars)
resource "aws_instance" "main_app_server" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  key_name                    = aws_key_pair.deployer_key.key_name
  vpc_security_group_ids      = [aws_security_group.app_security_group.id]
  subnet_id                   = data.aws_subnet.default_public.id
  associate_public_ip_address = true

  iam_instance_profile = aws_iam_instance_profile.ec2_instance_profile.name

  depends_on = [
    aws_iam_role_policy_attachment.attach_secrets_policy
  ]
  
<<<<<<< HEAD
  user_data = <<-EOF
              #!/bin/bash
              set -euxo pipefail

              sudo apt-get update -y
              sudo apt-get install -y git ca-certificates curl gnupg lsb-release

              sudo mkdir -p /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
              echo \
                "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
                $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
              sudo apt-get update -y
              sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

              sudo usermod -aG docker ubuntu

              REPO_URL="https://github.com/seahh1/prueba-tecnica-fullstack.git"
              APP_DIR="/home/ubuntu/app"
              
              if [ -d "$APP_DIR" ]; then
                  sudo rm -rf "$APP_DIR"
              fi
              git clone $REPO_URL $APP_DIR

              sudo chown -R ubuntu:ubuntu $APP_DIR
              
              su - ubuntu -c "cd $${APP_DIR}/infrastructure && docker compose up --build -d"

              EOF
=======
  user_data = file("${path.module}/scripts/setup.sh")
>>>>>>> 70862fb (despliegue para producción usando AWS Secrets Manager y env vars)

  tags = {
    Name        = "user-management-app-server"
    Environment = "Development"
    Project     = "UserManagement"
  }
}