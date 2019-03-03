terraform {
  backend "s3" {}
}

provider "aws" {
  version = "1.60"
  region  = "${var.aws_region}"
}
