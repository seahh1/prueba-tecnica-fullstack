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
  default = true # 
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