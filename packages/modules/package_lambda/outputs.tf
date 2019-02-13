output "zip" {
    description = "The location of the generated zip file"
    value = "${module.package.path}"
}

output "hash" {
    description = "Hash of the source code used to determine if update is required"
    value = "${module.package.base64sha256}"
}