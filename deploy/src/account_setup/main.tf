data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "test_state" {
  bucket = "prm-${data.aws_caller_identity.current.account_id}-test-state"
  acl    = "private"

  lifecycle_rule {
    enabled = true

    expiration {
      days = 1
    }
  }
}

resource "aws_s3_bucket" "lambda_images" {
  bucket = "prm-${data.aws_caller_identity.current.account_id}-lambda-images"
  acl    = "private"

  lifecycle_rule {
    enabled = true

    expiration {
      days = 1
    }
  }
}