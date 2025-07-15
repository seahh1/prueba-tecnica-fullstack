
variable "aws_region" {
  description = "Región de AWS donde desplegar los recursos."
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "Tipo de instancia EC2 para el servidor de la aplicación."
  type        = string
  default     = "t2.micro"
}

variable "ami_id" {
  description = "El ID de la AMI para la instancia EC2 (ej. Ubuntu 22.04 LTS)."
  type        = string
}

variable "key_name" {
  description = "Nombre del par de claves SSH en AWS."
  type        = string
  default     = "my-app-key" 
}

variable "public_key_path" {
  description = "Ruta al archivo de clave pública SSH local."
  type        = string
}

variable "private_key_path" {
  description = "Ruta al archivo de clave privada SSH local (para permisos y SSH)."
  type        = string
}