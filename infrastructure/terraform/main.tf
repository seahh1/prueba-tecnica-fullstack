provider "aws" {
  region = var.aws_region
}

resource "aws_key_pair" "deployer_key" {
  key_name   = var.key_name
  public_key = file(var.public_key_path)
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
  
  user_data = file("${path.module}/scripts/setup.sh")

  tags = {
    Name        = "user-management-app-server"
    Environment = "Development"
    Project     = "UserManagement"
  }
}