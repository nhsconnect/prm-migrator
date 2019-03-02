module "apigw_deploy" {
    source = "../modules/apigw_deploy"

    aws_region = "${var.environment}"
    environment = "${var.environment}"
}
