provider "aws" {
  region = var.aws_region 
}

resource "aws_key_pair" "deployer_key" {
  key_name   = var.key_name 
  public_key = file(var.public_key_path) 
}

resource "null_resource" "set_ssh_key_permissions_windows" {
  count = "${(pathexpand("~") == "/c/Users/${env("USERNAME")}") ? 1 : 0}"

  triggers = {
    private_key_path = var.private_key_path
  }

  provisioner "local-exec" {
    command = "icacls ${path.root}/${var.private_key_path} /inheritance:r /grant:r \"${env("USERNAME")}\":F"
    interpreter = ["powershell", "-command"]
  }
  depends_on = [aws_key_pair.deployer_key]
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnet" "default_public" {
  vpc_id            = data.aws_vpc.default.id 
  default_for_az    = true
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


resource "aws_instance" "main_app_server" {
  ami                         = var.ami_id        
  instance_type               = var.instance_type 
  key_name                    = aws_key_pair.deployer_key.key_name 
  vpc_security_group_ids      = [aws_security_group.app_security_group.id]
  subnet_id                   = data.aws_subnet.default_public.id
  associate_public_ip_address = true

  user_data = <<-EOF
              #!/bin/bash
              set -euxo pipefail # Salir inmediatamente si un comando falla

              sudo apt update -y
              sudo apt install -y git

              sudo apt-get update -y
              sudo apt-get install -y ca-certificates curl gnupg lsb-release
              sudo mkdir -p /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
              echo \
                "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
                $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
              sudo apt-get update -y
              sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

              sudo usermod -aG docker ubuntu

              newgrp docker || true

              REPO_URL="https://github.com/seahh1/prueba-tecnica-fullstack.git"
              APP_DIR="/home/ubuntu/app"

              if [ -d "$APP_DIR" ]; then
                  sudo rm -rf "$APP_DIR"
              fi

              git clone $REPO_URL $APP_DIR

              cd $APP_DIR/infrastructure

              docker compose up --build -d

              EOF
  tags = {
    Name        = "user-management-app-server"
    Environment = "Development"
    Project     = "UserManagement"
  }
}