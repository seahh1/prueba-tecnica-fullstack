output "instance_public_ip" {
  description = "La IP pública de la instancia EC2 desplegada."
  value       = aws_instance.main_app_server.public_ip
}

output "ssh_command" {
  description = "Comando para SSH a la instancia EC2."
  value       = "ssh -i \"${var.private_key_path}\" ubuntu@${aws_instance.main_app_server.public_ip}"
}