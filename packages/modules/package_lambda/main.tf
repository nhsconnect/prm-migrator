module "package" {
  source = "howdio/lambda/aws//modules/package"

  name = "${var.name}"
  path = "${path.module}/../../lambdas/${var.name}/main.js"
  include_paths = ["${path.module}/../../lambdas/${var.name}"]
}
