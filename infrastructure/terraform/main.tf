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