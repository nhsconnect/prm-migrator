provider "aws" {
  version = "1.60"
  region  = "${var.aws_region}"
}

provider "null" {
  version = "2.1"
}